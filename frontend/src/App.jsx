import React, { useEffect, useState, useCallback, lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login';
import Toast from './Toast';
import Navbar from './components/Navbar';
import LoadingFallback from './components/LoadingFallback';
import DelayedFallback from './components/DelayedFallback';
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} from './api';
import './App.css';

// STEP 3: Route-based code splitting using React.lazy()
// Core Practical 8 requirements: Apply React.lazy() and Suspense to at least Projects and Contact routes
const Home = lazy(() => import('./pages/Home'));
const Projects = lazy(() => import('./pages/Projects'));
const Analytics = lazy(() => import('./pages/Analytics'));
const Contact = lazy(() => import('./pages/Contact'));

function App() {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (!token || !savedUser) return null;

    try {
      return JSON.parse(savedUser);
    } catch {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return null;
    }
  });

  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [editingId, setEditingId] = useState(null);

  const [toast, setToast] = useState({
    message: '',
    type: 'success',
  });

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
  }, []);

  const closeToast = useCallback(() => {
    setToast({ message: '', type: 'success' });
  }, []);

  function resetForm() {
    setTitle('');
    setDescription('');
    setPriority('medium');
    setEditingId(null);
  }

  function handleLogin(userData) {
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  }

  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    setUser(null);
    setTasks([]);
    setError('');
    setMessage('');
    resetForm();
  }

  const loadTasks = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const data = await getTasks();
      setTasks(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);

      const errorMessage = err.message.toLowerCase();

      if (
        errorMessage.includes('token') ||
        errorMessage.includes('unauthorized')
      ) {
        handleLogout();
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) {
      loadTasks();
    } else {
      setTasks([]);
      setLoading(false);
    }
  }, [user, loadTasks]);

  const handleSubmit = useCallback(async (event) => {
    event.preventDefault();

    setError('');
    setMessage('');
    setSaving(true);

    const taskData = {
      title: title.trim(),
      description: description.trim(),
      priority,
      completed: false,
    };

    try {
      if (editingId) {
        const updated = await updateTask(editingId, taskData);

        setTasks((current) =>
          current.map((task) =>
            task._id === editingId ? updated : task
          )
        );

        showToast('Task updated successfully!');
      } else {
        const created = await createTask(taskData);

        setTasks((current) => [created, ...current]);
        showToast('Task created successfully!');
      }

      resetForm();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSaving(false);
    }
  }, [editingId, title, description, priority, showToast]);

  const startEditing = useCallback((task) => {
    setEditingId(task._id);
    setTitle(task.title || '');
    setDescription(task.description || '');
    setPriority(task.priority || 'medium');
    setMessage('');
    setError('');

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, []);

  const toggleCompleted = useCallback(async (task) => {
    setError('');
    setMessage('');

    try {
      const updated = await updateTask(task._id, {
        completed: !task.completed,
      });

      setTasks((current) =>
        current.map((item) =>
          item._id === task._id ? updated : item
        )
      );

      showToast('Task status updated!');
    } catch (err) {
      showToast(err.message, 'error');
    }
  }, [showToast]);

  const handleDelete = useCallback(async (task) => {
    if (!window.confirm(`Delete "${task.title}"?`)) {
      return;
    }

    setError('');
    setMessage('');

    try {
      await deleteTask(task._id);

      setTasks((current) =>
        current.filter((item) => item._id !== task._id)
      );

      if (editingId === task._id) {
        resetForm();
      }

      showToast('Task deleted successfully!');
    } catch (err) {
      showToast(err.message, 'error');
    }
  }, [editingId, showToast]);

  // Show login before task manager if unauthenticated
  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="app-root">
      <Navbar user={user} onLogout={handleLogout} />

      <main className="app">
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={closeToast}
        />

        {/* STEP 4: Wrap the Routes block with Suspense and a meaningful Fallback UI */}
        {/* Uses DelayedFallback (300ms minimum-delay to avoid UI flicker on fast networks) */}
        <Suspense fallback={<DelayedFallback delayMs={200} message="Loading requested route chunk..." />}>
          <Routes>
            <Route
              path="/"
              element={
                <Home
                  user={user}
                  tasks={tasks}
                  loading={loading}
                  saving={saving}
                  error={error}
                  message={message}
                  editingId={editingId}
                  title={title}
                  setTitle={setTitle}
                  description={description}
                  setDescription={setDescription}
                  priority={priority}
                  setPriority={setPriority}
                  handleSubmit={handleSubmit}
                  resetForm={resetForm}
                  startEditing={startEditing}
                  toggleCompleted={toggleCompleted}
                  handleDelete={handleDelete}
                  loadTasks={loadTasks}
                />
              }
            />
            <Route
              path="/projects"
              element={<Projects tasks={tasks} />}
            />
            <Route
              path="/analytics"
              element={<Analytics tasks={tasks} />}
            />
            <Route
              path="/contact"
              element={<Contact />}
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>

        <footer>
          Charotar University of Science and Technology &bull; ITUE301 Practical 8: Performance Optimization &amp; Lazy Loading
        </footer>
      </main>
    </div>
  );
}

export default App;
