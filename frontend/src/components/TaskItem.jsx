import React, { memo } from 'react';

/**
 * TaskItem Component
 * Supplementary Problem Solution:
 * Memoized using React.memo to eliminate unnecessary re-renders when the parent
 * form state changes (e.g., typing in the task title input field).
 * DevTools Profiler confirms this component does not re-render unless its specific
 * task props or handlers change.
 */
function TaskItem({ task, onToggle, onEdit, onDelete }) {
  return (
    <article
      className={`task-card ${task.completed ? 'completed' : ''}`}
      key={task._id}
    >
      <div className="task-main">
        <label className="check-row">
          <input
            type="checkbox"
            checked={Boolean(task.completed)}
            onChange={() => onToggle(task)}
          />
          <span className="task-title">{task.title}</span>
        </label>

        <p className="task-description">
          {task.description || 'No description provided.'}
        </p>

        <span className={`priority ${task.priority || 'medium'}`}>
          {task.priority || 'medium'} priority
        </span>
      </div>

      <div className="task-actions">
        <button
          type="button"
          className="secondary"
          onClick={() => onEdit(task)}
        >
          Edit
        </button>

        <button
          type="button"
          className="danger"
          onClick={() => onDelete(task)}
        >
          Delete
        </button>
      </div>
    </article>
  );
}

export default memo(TaskItem);
