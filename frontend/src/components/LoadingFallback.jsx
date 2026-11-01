import React from 'react';
import './LoadingFallback.css';

export default function LoadingFallback({ message = 'Loading module...' }) {
  return (
    <div className="fallback-container" role="status" aria-live="polite">
      <div className="fallback-card">
        <div className="fallback-spinner" aria-hidden="true"></div>
        <h3 className="fallback-title">{message}</h3>
        <p className="fallback-subtitle">
          Code splitting in action &bull; Loading chunk on demand
        </p>

        {/* Skeleton animation placeholders */}
        <div className="skeleton-wrapper">
          <div className="skeleton-bar skeleton-title-bar"></div>
          <div className="skeleton-bar skeleton-body-bar"></div>
          <div className="skeleton-bar skeleton-body-bar short"></div>
        </div>
      </div>
    </div>
  );
}
