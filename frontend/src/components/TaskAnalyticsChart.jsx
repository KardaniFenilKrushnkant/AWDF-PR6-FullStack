import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import './TaskAnalyticsChart.css';

// Register Chart.js modules
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

/**
 * TaskAnalyticsChart
 * Heavy third-party visualizer utilizing Chart.js and react-chartjs-2.
 * Lazy loaded on demand to prevent heavy charting bundle from polluting the main chunk.
 */
export default function TaskAnalyticsChart({ tasks = [] }) {
  const completedCount = tasks.filter((t) => t.completed).length;
  const pendingCount = tasks.filter((t) => !t.completed).length;

  const lowPriority = tasks.filter((t) => (t.priority || '').toLowerCase() === 'low').length;
  const mediumPriority = tasks.filter((t) => (t.priority || '').toLowerCase() === 'medium').length;
  const highPriority = tasks.filter((t) => (t.priority || '').toLowerCase() === 'high').length;

  const statusData = {
    labels: ['Completed Tasks', 'Pending Tasks'],
    datasets: [
      {
        data: [completedCount, pendingCount],
        backgroundColor: ['#10b981', '#f59e0b'],
        hoverBackgroundColor: ['#059669', '#d97706'],
        borderWidth: 2,
        borderColor: '#ffffff',
      },
    ],
  };

  const priorityData = {
    labels: ['Low', 'Medium', 'High'],
    datasets: [
      {
        label: 'Tasks by Priority',
        data: [lowPriority, mediumPriority, highPriority],
        backgroundColor: ['#3b82f6', '#f59e0b', '#ef4444'],
        borderRadius: 8,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          font: { family: 'Inter', size: 12 },
          color: '#475569',
        },
      },
    },
  };

  return (
    <div className="analytics-charts-grid">
      <div className="chart-card">
        <h3>Task Completion Status</h3>
        <p className="chart-sub">Doughnut breakdown of done vs pending tasks</p>
        <div className="chart-canvas-wrapper">
          <Doughnut data={statusData} options={chartOptions} />
        </div>
      </div>

      <div className="chart-card">
        <h3>Task Priority Distribution</h3>
        <p className="chart-sub">Distribution of tasks across priority tiers</p>
        <div className="chart-canvas-wrapper">
          <Bar data={priorityData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
}
