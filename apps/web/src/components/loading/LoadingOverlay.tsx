import React from 'react';
import { useLocation } from '@docusaurus/router';
import { useLoadingContext } from '../../contexts/LoadingContext';

export const LoadingOverlay: React.FC = () => {
  const { shouldShowOverlay, isFullyLoaded } = useLoadingContext();
  const location = useLocation();

  // Only show loading overlay on the home page
  const isHomePage = location.pathname === '/' || location.pathname === '/pull-request-feed';

  // Don't render if we're not on the home page
  if (!isHomePage) {
    return null;
  }

  // Don't render if overlay should be hidden
  if (!shouldShowOverlay) {
    return null;
  }

  return (
    <div
      className={`loading-overlay ${isFullyLoaded ? 'loading-overlay--fade-out' : ''}`}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: '#1a1a1a',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
      }}
    >
      <div className="loading-overlay__content">
        <img
          src="/img/logo.svg"
          alt="Loading"
          className="loading-overlay__logo"
          style={{
            width: '120px',
            height: '120px',
            marginBottom: '24px',
          }}
        />
        <span
          className="loading-overlay__text"
          style={{
            fontSize: '18px',
            color: '#e2e8f0',
            fontWeight: 500,
            letterSpacing: '0.5px',
          }}
        >
          Loading...
        </span>
      </div>
    </div>
  );
};

export default LoadingOverlay;
