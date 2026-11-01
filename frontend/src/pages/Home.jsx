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
  eventLogs = [],
  handleTestError,
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
      if (filter === 'high') return task.priority?.toLowerCase() === 'high';
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
    <div className="home-dashboard">
      {/* Executive Welcome & KPI Row */}
      <header className="dashboard-hero">
        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-pulse"></span>
            <span>Task Management &bull; React 19 + Vite</span>
          </div>
          <h1 className="hero-heading">
            Welcome back, <span className="highlight-name">{user?.name || user?.username || 'Fenil'}</span>
          </h1>
          <p className="hero-subtext">
            Track daily priorities, manage agile milestones, and monitor frontend performance optimizations.
          </p>
        </div>

        {/* 4 KPI Cards */}
        <div className="kpi-banner-grid">
          <div className="kpi-mini-card">
            <div className="kpi-icon-box bg-blue">
              <span>📋</span>
            </div>
            <div className="kpi-details">
              <span className="kpi-label">Total Tasks</span>
              <strong className="kpi-number">{stats.total}</strong>
            </div>
          </div>

          <div className="kpi-mini-card">
            <div className="kpi-icon-box bg-amber">
              <span>⏳</span>
            </div>
            <div className="kpi-details">
              <span className="kpi-label">In Progress</span>
              <strong className="kpi-number text-amber">{stats.pending}</strong>
            </div>
          </div>

          <div className="kpi-mini-card">
            <div className="kpi-icon-box bg-emerald">
              <span>✅</span>
            </div>
            <div className="kpi-details">
              <span className="kpi-label">Completed</span>
              <strong className="kpi-number text-emerald">{stats.completed}</strong>
            </div>
          </div>

          <div className="kpi-mini-card">
            <div className="kpi-icon-box bg-indigo">
              <span>📈</span>
            </div>
            <div className="kpi-details">
              <span className="kpi-label">Completion</span>
              <strong className="kpi-number text-indigo">{stats.completionRate}%</strong>
            </div>
          </div>
        </div>
      </header>

      {/* Practical 10: Event-Driven Background Processing Status & Activity Stream */}
      <section className="event-bus-section">
        <div className="event-bus-header">
          <div className="event-bus-title-group">
            <span className="event-bus-pill">⚡ Practical 10</span>
            <h3 className="event-bus-title">Event-Driven Asynchronous Processing</h3>
            <span className="event-status-badge">Node.js EventEmitter Active</span>
          </div>
          <button
            type="button"
            className="btn-simulate-error"
            onClick={handleTestError}
            title="Triggers POST /test-event-error to test EventEmitter error isolation"
          >
            🛡️ Simulate & Catch Error Event
          </button>
        </div>
        <p className="event-bus-desc">
          When tasks are created or deleted, the API responds immediately (~20 ms) while heavy notification and audit handlers run asynchronously in the background via Libuv timers.
        </p>

        <div className="event-stream-container">
          <div className="event-stream-header">
            <span className="stream-dot-pulse"></span>
            <strong>Live Background Event Bus Activity</strong>
            <span className="stream-badge-count">{eventLogs.length} events logged</span>
          </div>
          <div className="event-stream-list">
            {eventLogs.map((log) => (
              <div key={log.id} className={`event-log-item status-${log.status}`}>
                <div className="event-log-meta">
                  <span className="event-time">{log.time}</span>
                  <span className={`event-type-pill type-${log.type}`}>{log.type}</span>
                </div>
                <div className="event-log-details">
                  <span className="event-task-name">{log.title}</span>
                  <span className="event-desc">{log.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Two-Column or Stacked Dashboard Grid */}
      <div className="dashboard-grid">
        {/* Left / Top: Task Creation & Edit Form */}
        <section className="form-card-panel">
          <div className="panel-header">
            <div className="panel-title-wrap">
              <span className="panel-icon">{editingId ? '✏️' : '✨'}</span>
              <h3>{editingId ? 'Edit Task' : 'Create New Task'}</h3>
            </div>
            {editingId && (
              <span className="editing-badge">Editing Task #{editingId.slice(-4)}</span>
            )}
          </div>

          <form onSubmit={handleSubmit} className="modern-task-form">
            <div className="form-field">
              <label htmlFor="task-title">
                Task Title <span className="req">*</span>
              </label>
              <input
                id="task-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Implement route-based lazy loading"
                required
                maxLength={120}
              />
            </div>

            <div className="form-field">
              <label htmlFor="task-desc">Description</label>
              <textarea
                id="task-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add context, deadlines, or acceptance criteria..."
                rows={3}
              />
            </div>

            <div className="form-field">
              <label>Priority Level</label>
              <div className="priority-select-pills">
                {['low', 'medium', 'high'].map((p) => (
                  <button
                    key={p}
                    type="button"
                    className={`priority-pill ${priority === p ? `selected ${p}` : ''}`}
                    onClick={() => setPriority(p)}
                  >
                    <span className={`pill-dot ${p}`}></span>
                    {p.charAt(0).toUpperCase() + p.slice(1)} Priority
                  </button>
                ))}
              </div>
            </div>

            <div className="form-btn-actions">
              <button type="submit" className="btn-primary" disabled={saving}>
                {saving ? (
                  <span className="btn-loading">
                    <span className="mini-spin"></span> Saving...
                  </span>
                ) : editingId ? (
                  '💾 Update Task'
                ) : (
                  '➕ Add Task'
                )}
              </button>

              {editingId && (
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={resetForm}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </section>

        {/* Right / Bottom: Task Board */}
        <section className="task-board-panel">
          <div className="board-header">
            <div className="board-title-group">
              <h2>Task Board</h2>
              <span className="board-count-pill">{filteredTasks.length} tasks</span>
            </div>

            <button
              type="button"
              className="refresh-btn"
              onClick={loadTasks}
              disabled={loading}
              title="Sync tasks with backend"
            >
              <span className={`refresh-icon ${loading ? 'spinning' : ''}`}>🔄</span>
              <span>{loading ? 'Refreshing...' : 'Refresh'}</span>
            </button>
          </div>

          {/* Search & Filter Toolbar */}
          <div className="board-toolbar">
            <div className="search-wrap">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                className="search-input"
                placeholder="Search tasks by title or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button
                  type="button"
                  className="clear-search-btn"
                  onClick={() => setSearchTerm('')}
                >
                  ✕
                </button>
              )}
            </div>

            <div className="filter-chip-group">
              <button
                type="button"
                className={`filter-chip ${filter === 'all' ? 'active' : ''}`}
                onClick={() => setFilter('all')}
              >
                All ({tasks.length})
              </button>
              <button
                type="button"
                className={`filter-chip ${filter === 'pending' ? 'active' : ''}`}
                onClick={() => setFilter('pending')}
              >
                Pending ({stats.pending})
              </button>
              <button
                type="button"
                className={`filter-chip ${filter === 'completed' ? 'active' : ''}`}
                onClick={() => setFilter('completed')}
              >
                Done ({stats.completed})
              </button>
              <button
                type="button"
                className={`filter-chip ${filter === 'high' ? 'active' : ''}`}
                onClick={() => setFilter('high')}
              >
                High Priority
              </button>
            </div>
          </div>

          {message && <div className="banner success">{message}</div>}
          {error && <div className="banner error">{error}</div>}

          {/* Task Items List */}
          {loading ? (
            <div className="loading-state-card">
              <div className="loading-spinner"></div>
              <p>Fetching tasks from server...</p>
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="empty-state-card">
              <div className="empty-icon-wrap">📋</div>
              <h3>No tasks found</h3>
              <p>
                {searchTerm
                  ? `No tasks match your search "${searchTerm}". Try a different keyword.`
                  : filter !== 'all'
                  ? `There are no ${filter} tasks right now.`
                  : 'Get started by creating your first task using the form above!'}
              </p>
            </div>
          ) : (
            <div className="task-cards-container">
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
    </div>
  );
}
