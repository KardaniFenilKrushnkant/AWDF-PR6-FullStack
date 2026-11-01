import React, { useState, useMemo } from 'react';
import TaskItem from '../components/TaskItem';

export default function Home({
  user,
  tasks,
  loading,
  saving,
  error,
  message,
  editingId,
  title,
  setTitle,
  description,
  setDescription,
  priority,
  setPriority,
  handleSubmit,
  resetForm,
  startEditing,
  toggleCompleted,
  handleDelete,
  loadTasks,
}) {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch =
        task.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description?.toLowerCase().includes(searchTerm.toLowerCase());

      if (!matchesSearch) return false;

      if (filter === 'completed') return task.completed;
      if (filter === 'pending') return !task.completed;
      if (filter === 'high') return task.priority === 'high';
      return true;
    });
  }, [tasks, filter, searchTerm]);

  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.completed).length;
    const pending = total - completed;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { total, completed, pending, completionRate };
  }, [tasks]);

  return (
    <div className="home-page">
      <header className="hero">
        <div className="hero-text">
          <p className="badge">MERN Full-Stack &bull; React 19 &bull; Vite</p>
          <h1>Manage Your Tasks With Speed &amp; Ease</h1>
          <p className="subtitle">
            Welcome back, <strong>{user?.name || user?.username}</strong>! Organize your workflow,
            track deadlines, and measure frontend performance.
          </p>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <strong>{stats.total}</strong>
            <span>Total Tasks</span>
          </div>
          <div className="stat-card">
            <strong style={{ color: '#10b981' }}>{stats.completed}</strong>
            <span>Completed</span>
          </div>
          <div className="stat-card">
            <strong style={{ color: '#f59e0b' }}>{stats.pending}</strong>
            <span>Pending</span>
          </div>
          <div className="stat-card">
            <strong style={{ color: '#5146e5' }}>{stats.completionRate}%</strong>
            <span>Done Rate</span>
          </div>
        </div>
      </header>

      {/* Task Creation & Editing Panel */}
      <section className="panel">
        <h2>{editingId ? '✏️ Edit Task' : '➕ Create a Task'}</h2>

        <form onSubmit={handleSubmit} className="task-form">
          <label>
            Task title
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Implement route-based lazy loading"
              required
              maxLength={120}
            />
          </label>

          <label>
            Description
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detailed description of the task..."
              rows={3}
            />
          </label>

          <label>
            Priority
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
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

      {/* Task Listing Section */}
      <section className="tasks-section">
        <div className="section-heading">
          <h2>Your Task Board</h2>

          <div className="heading-actions">
            <button
              type="button"
              className="secondary refresh"
              onClick={loadTasks}
              disabled={loading}
            >
              {loading ? 'Refreshing...' : '🔄 Refresh'}
            </button>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="task-controls">
          <div className="filter-chips">
            <button
              type="button"
              className={`chip ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All ({tasks.length})
            </button>
            <button
              type="button"
              className={`chip ${filter === 'pending' ? 'active' : ''}`}
              onClick={() => setFilter('pending')}
            >
              Pending ({stats.pending})
            </button>
            <button
              type="button"
              className={`chip ${filter === 'completed' ? 'active' : ''}`}
              onClick={() => setFilter('completed')}
            >
              Completed ({stats.completed})
            </button>
            <button
              type="button"
              className={`chip ${filter === 'high' ? 'active' : ''}`}
              onClick={() => setFilter('high')}
            >
              High Priority
            </button>
          </div>

          <input
            type="text"
            className="search-input"
            placeholder="🔍 Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {message && <p className="notice success">{message}</p>}
        {error && <p className="notice error">Error: {error}</p>}

        {loading ? (
          <p className="empty">Loading tasks from backend...</p>
        ) : filteredTasks.length === 0 ? (
          <div className="empty">
            <h3>No tasks match your filter</h3>
            <p>Add a task or adjust the search/filter criteria above.</p>
          </div>
        ) : (
          <div className="task-list">
            {filteredTasks.map((task) => (
              <TaskItem
                key={task._id}
                task={task}
                onToggle={toggleCompleted}
                onEdit={startEditing}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
