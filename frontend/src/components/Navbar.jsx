import React from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';

export default function Navbar({ user, onLogout }) {
  return (
    <nav className="main-navbar">
      <div className="nav-container">
        <div className="nav-brand">
          <NavLink to="/" className="brand-link">
            <span className="brand-icon">⚡</span>
            <span className="brand-text">TaskManager</span>
            <span className="brand-badge">P-8</span>
          </NavLink>
        </div>

        <div className="nav-links">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              isActive ? 'nav-link active' : 'nav-link'
            }
          >
            Tasks
          </NavLink>
          <NavLink
            to="/projects"
            className={({ isActive }) =>
              isActive ? 'nav-link active' : 'nav-link'
            }
          >
            Projects
          </NavLink>
          <NavLink
            to="/analytics"
            className={({ isActive }) =>
              isActive ? 'nav-link active' : 'nav-link'
            }
          >
            Analytics
          </NavLink>
          <NavLink
            to="/contact"
            className={({ isActive }) =>
              isActive ? 'nav-link active' : 'nav-link'
            }
          >
            Contact
          </NavLink>
        </div>

        <div className="nav-user">
          <span className="user-greeting">
            👤 <strong>{user?.name || user?.username || 'User'}</strong>
          </span>
          <button
            type="button"
            className="logout-button"
            onClick={onLogout}
            title="Log out of session"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
