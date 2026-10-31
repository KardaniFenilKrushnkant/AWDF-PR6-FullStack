
import { useEffect, useState, useCallback } from 'react';
import Toast from './Toast';
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} from './api';
import './App.css';

function App() {
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

  async function loadTasks() {
    setLoading(true);
    setError('');

    try {
      const data = await getTasks();
      setTasks(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTasks();
  }, []);

  function resetForm() {
    setTitle('');
    setDescription('');
    setPriority('medium');
    setEditingId(null);
  }

  async function handleSubmit(event) {
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
  }

  function startEditing(task) {
    setEditingId(task._id);
    setTitle(task.title || '');
    setDescription(task.description || '');
    setPriority(task.priority || 'medium');
    setMessage('');
    setError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function toggleCompleted(task) {
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
  }

  async function handleDelete(task) {
    if (!window.confirm(`Delete "${task.title}"?`)) return;

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
  }

  return (
    <main className="app">
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={closeToast}
      />

      <header className="hero">
        <p className="eyebrow">
          PRACTICAL 6 · FULL STACK DEVELOPMENT
        </p>
        <h1>Task Manager</h1>
        <p className="subtitle">
          Manage your tasks with React, Express and MongoDB.
        </p>

        <div className="stats">
          <div>
            <strong>{tasks.length}</strong>
            <span>Total tasks</span>
          </div>
          <div>
            <strong>
              {tasks.filter((task) => task.completed).length}
            </strong>
            <span>Completed</span>
          </div>
          <div>
            <strong>
              {tasks.filter((task) => !task.completed).length}
            </strong>
            <span>Pending</span>
          </div>
        </div>
      </header>

      <section className="panel">
        <h2>{editingId ? 'Edit Task' : 'Create a Task'}</h2>

        <form onSubmit={handleSubmit} className="task-form">
          <label>
            Task title
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="e.g. Complete Practical 6"
              required
              maxLength={120}
            />
          </label>

          <label>
            Description
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="What needs to be done?"
              rows={3}
            />
          </label>

          <label>
            Priority
            <select
              value={priority}
              onChange={(event) => setPriority(event.target.value)}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </label>

          <div className="form-actions">
            <button type="submit" disabled={saving}>
              {saving
                ? 'Saving...'
                : editingId
                  ? 'Save Changes'
                  : 'Add Task'}
            </button>

            {editingId && (
              <button
                type="button"
                className="secondary"
                onClick={resetForm}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="tasks-section">
        <div className="section-heading">
          <h2>Your Tasks</h2>
          <button
            type="button"
            className="secondary refresh"
            onClick={loadTasks}
            disabled={loading}
          >
            Refresh
          </button>
        </div>

        {message && <p className="notice success">{message}</p>}
        {error && <p className="notice error">Error: {error}</p>}

        {loading ? (
          <p className="empty">Loading tasks...</p>
        ) : tasks.length === 0 ? (
          <div className="empty">
            <h3>No tasks yet</h3>
            <p>Add your first task using the form above.</p>
          </div>
        ) : (
          <div className="task-list">
            {tasks.map((task) => (
              <article
                className={`task-card ${task.completed ? 'completed' : ''}`}
                key={task._id}
              >
                <div className="task-main">
                  <label className="check-row">
                    <input
                      type="checkbox"
                      checked={Boolean(task.completed)}
                      onChange={() => toggleCompleted(task)}
                    />
                    <span className="task-title">{task.title}</span>
                  </label>

                  <p className="task-description">
                    {task.description || 'No description provided.'}
                  </p>

                  <span
                    className={`priority ${task.priority || 'medium'}`}
                  >
                    {task.priority || 'medium'} priority
                  </span>
                </div>

                <div className="task-actions">
                  <button
                    type="button"
                    className="secondary"
                    onClick={() => startEditing(task)}
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    className="danger"
                    onClick={() => handleDelete(task)}
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <footer>
        Advanced Web Development Frameworks · Practical 6
      </footer>
    </main>
  );
}

export default App;
