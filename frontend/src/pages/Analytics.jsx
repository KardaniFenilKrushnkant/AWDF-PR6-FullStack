import React, { lazy, Suspense, useState } from 'react';
import LoadingFallback from '../components/LoadingFallback';
import './Analytics.css';

// Supplementary Problem 1: Lazy load heavy third-party component (Chart.js + react-chartjs-2)
const TaskAnalyticsChart = lazy(() => import('../components/TaskAnalyticsChart'));

/**
 * Analytics Page Component
 * Route: /analytics
 * Demonstrates both Route-level code splitting AND Component-level code splitting
 * with third-party charting libraries (Chart.js + react-chartjs-2).
 */
export default function Analytics({ tasks = [] }) {
  const [chartsLoaded, setChartsLoaded] = useState(true);

  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  const pending = total - completed;
  const highPriority = tasks.filter((t) => t.priority === 'high').length;

  return (
    <div className="analytics-page">
      <header className="page-header">
        <div className="header-badge">Supplementary Problem 1 &bull; Heavy Component Lazy Loading</div>
        <h1>Task Performance &amp; Analytics</h1>
        <p className="header-sub">
          Demonstrating component-level dynamic code splitting with Chart.js. The charting library is
          isolated into a dedicated chunk and only requested when this view renders.
        </p>
      </header>

      {/* Metrics Row */}
      <div className="analytics-kpi-grid">
        <div className="kpi-card">
          <span className="kpi-label">Total Workload</span>
          <strong className="kpi-value">{total}</strong>
          <span className="kpi-foot">Active and logged tasks</span>
        </div>
        <div className="kpi-card">
          <span className="kpi-label">Completed</span>
          <strong className="kpi-value text-green">{completed}</strong>
          <span className="kpi-foot">
            {total > 0 ? `${Math.round((completed / total) * 100)}% completion rate` : 'No tasks'}
          </span>
        </div>
        <div className="kpi-card">
          <span className="kpi-label">Pending Action</span>
          <strong className="kpi-value text-orange">{pending}</strong>
          <span className="kpi-foot">Requires user attention</span>
        </div>
        <div className="kpi-card">
          <span className="kpi-label">High Priority</span>
          <strong className="kpi-value text-red">{highPriority}</strong>
          <span className="kpi-foot">Urgent deadlines</span>
        </div>
      </div>

      {/* Chart Lazy Loading Section */}
      <section className="chart-container-section">
        <div className="chart-header-row">
          <div>
            <h2>Visual Breakdown &amp; Chart.js</h2>
            <p className="chart-section-sub">
              Isolated bundle chunk: <code>TaskAnalyticsChart.chunk.js</code> &bull; Only loaded on demand
            </p>
          </div>

          <button
            type="button"
            className="toggle-chart-btn"
            onClick={() => setChartsLoaded((prev) => !prev)}
          >
            {chartsLoaded ? 'Hide Chart Visualizer' : 'Load Interactive Visualizer'}
          </button>
        </div>

        {chartsLoaded ? (
          <Suspense fallback={<LoadingFallback message="Streaming Chart.js bundle & Canvas engine..." />}>
            <TaskAnalyticsChart tasks={tasks} />
          </Suspense>
        ) : (
          <div className="chart-unloaded-placeholder">
            <p>Chart component is currently unmounted. Click above to dynamically fetch the chunk.</p>
          </div>
        )}
      </section>
    </div>
  );
}
