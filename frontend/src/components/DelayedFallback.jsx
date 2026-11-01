import React, { useState, useEffect } from 'react';
import LoadingFallback from './LoadingFallback';

/**
 * DelayedFallback Component
 * Supplementary Problem Solution:
 * Prevents flickering loading states on fast network connections by delaying
 * the rendering of the fallback UI (default 300ms). If content loads within
 * that threshold, no spinner ever flashes on screen.
 */
export default function DelayedFallback({
  delayMs = 300,
  message = 'Loading component...',
}) {
  const [shouldShow, setShouldShow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShouldShow(true);
    }, delayMs);

    return () => clearTimeout(timer);
  }, [delayMs]);

  if (!shouldShow) {
    // Return empty placeholder during the initial threshold to prevent UI flicker
    return null;
  }

  return <LoadingFallback message={message} />;
}
