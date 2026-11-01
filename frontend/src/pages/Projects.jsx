import React, { useState } from 'react';
import './Projects.css';

/**
 * Projects Page Component
 * Route: /projects
 * Lazy-loaded route component fulfilling Practical 8 core objective.
 */
export default function Projects({ tasks = [] }) {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const projectModules = [
    {
      id: 'p-awdf-8',
      name: 'Performance Optimization & Code Splitting',
      practical: 'Practical 8',
      status: 'In Progress',
      progress: 90,
      description:
        'Implementing route-based code splitting using React.lazy() and Suspense to decouple heavy bundles, measure Vite output, and optimize perceived load time.',
      tags: ['React 19', 'React.lazy', 'Suspense', 'Vite', 'DevTools Profiler'],
      dueDate: 'November 2026',
    },
    {
      id: 'p-awdf-7',
      name: 'Authentication & Authorization Middleware',
      practical: 'Practical 7',
      status: 'Completed',
      progress: 100,
      description:
        'Secured task endpoints using JSON Web Tokens (JWT), password hashing with bcrypt, and custom Express middleware with Postman test suites.',
      tags: ['JWT', 'Express', 'Auth Middleware', 'Bcrypt', 'Postman'],
      dueDate: 'October 2026',
    },
    {
      id: 'p-awdf-6',
      name: 'Full-Stack MERN Integration',
      practical: 'Practical 6',
      status: 'Completed',
      progress: 100,
      description:
        'Integrated React frontend with Node.js/Express REST APIs and MongoDB Atlas database with full CRUD capabilities.',
      tags: ['React', 'Node.js', 'Express', 'MongoDB', 'Mongoose', 'REST API'],
      dueDate: 'October 2026',
    },
    {
      id: 'p-awdf-capstone',
      name: 'Distributed Cloud Microservices & Deployments',
      practical: 'Upcoming Module',
      status: 'Planned',
      progress: 20,
      description:
        'Containerized microservices using Docker, continuous integration workflows, and production CDN asset caching.',
      tags: ['Docker', 'CI/CD', 'Microservices', 'Cloud Architecture'],
      dueDate: 'December 2026',
    },
  ];

  const filteredProjects =
    selectedCategory === 'all'
      ? projectModules
      : projectModules.filter((p) =>
          selectedCategory === 'completed'
            ? p.status === 'Completed'
            : p.status !== 'Completed'
        );

  return (
    <div className="projects-page">
      <header className="page-header">
        <div className="header-badge">Route-Based Chunk &bull; Projects.chunk.js</div>
        <h1>Course Project Workspaces</h1>
        <p className="header-sub">
          Structured development milestones for Advanced Web Development Frameworks (ITUE301).
          Dynamically split and lazy-loaded via <code>React.lazy()</code>.
        </p>
      </header>

      {/* Filter tabs */}
      <div className="projects-filter-bar">
        <button
          type="button"
          className={`filter-btn ${selectedCategory === 'all' ? 'active' : ''}`}
          onClick={() => setSelectedCategory('all')}
        >
          All Projects ({projectModules.length})
        </button>
        <button
          type="button"
          className={`filter-btn ${selectedCategory === 'in-progress' ? 'active' : ''}`}
          onClick={() => setSelectedCategory('in-progress')}
        >
          Active / In-Progress (2)
        </button>
        <button
          type="button"
          className={`filter-btn ${selectedCategory === 'completed' ? 'active' : ''}`}
          onClick={() => setSelectedCategory('completed')}
        >
          Completed (2)
        </button>
      </div>

      {/* Project Cards Grid */}
      <div className="projects-grid">
        {filteredProjects.map((project) => (
          <article key={project.id} className="project-card">
            <div className="project-card-header">
              <span className="project-pill">{project.practical}</span>
              <span
                className={`status-pill ${
                  project.status === 'Completed' ? 'status-done' : 'status-pending'
                }`}
              >
                {project.status}
              </span>
            </div>

            <h3 className="project-title">{project.name}</h3>
            <p className="project-desc">{project.description}</p>

            <div className="progress-section">
              <div className="progress-label">
                <span>Progress</span>
                <strong>{project.progress}%</strong>
              </div>
              <div className="progress-bar-track">
                <div
                  className="progress-bar-fill"
                  style={{ width: `${project.progress}%` }}
                ></div>
              </div>
            </div>

            <div className="project-tags">
              {project.tags.map((tag) => (
                <span key={tag} className="tag-chip">
                  {tag}
                </span>
              ))}
            </div>

            <div className="project-footer">
              <span className="due-date">🗓️ Target: {project.dueDate}</span>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
