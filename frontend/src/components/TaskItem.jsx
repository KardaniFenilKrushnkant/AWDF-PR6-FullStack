import React, { memo } from 'react';

/**
 * TaskItem Component
 * Memoized to eliminate unnecessary re-renders when parent input state updates.
 * Styled with modern SaaS card layout.
 */
function TaskItem({ task, onToggle, onEdit, onDelete }) {
  const priorityClass = (task.priority || 'medium').toLowerCase();

  return (
    <article
      className={`modern-task-card ${task.completed ? 'is-completed' : ''}`}
      key={task._id}
    >
      <div className="task-card-left">
        <label className="custom-checkbox-label">
          <input
            type="checkbox"
            className="custom-checkbox-input"
            checked={Boolean(task.completed)}
            onChange={() => onToggle(task)}
          />
          <span className="checkbox-visual">
            {task.completed && (
              <svg viewBox="0 0 16 16" fill="none" className="check-svg">
                <path
                  d="M13.5 4.5L6.5 11.5L2.5 7.5"
                  stroke="white"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </span>
        </label>

        <div className="task-body">
          <div className="task-title-row">
            <h4 className="task-title-text">{task.title}</h4>
            <span className={`priority-tag ${priorityClass}`}>
              <span className="priority-indicator"></span>
              {task.priority || 'medium'}
            </span>
          </div>

          <p className="task-desc-text">
            {task.description || 'No description provided.'}
          </p>
        </div>
      </div>

      <div className="task-card-actions">
        <button
          type="button"
          className="action-btn edit-btn"
          onClick={() => onEdit(task)}
          title="Edit task"
        >
          <span>✏️</span>
          <span className="btn-label">Edit</span>
        </button>

        <button
          type="button"
          className="action-btn delete-btn"
          onClick={() => onDelete(task)}
          title="Delete task"
        >
          <span>🗑️</span>
          <span className="btn-label">Delete</span>
        </button>
      </div>
    </article>
  );
}

export default memo(TaskItem);
