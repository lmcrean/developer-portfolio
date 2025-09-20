import React from 'react';
import LoadingRows from './LoadingRows';

interface LoadingErrorStatesProps {
  loading: boolean;
  error: string | null;
  pullRequestsLength: number;
  username: string;
  className: string;
  isClient: boolean;
  onRetry: () => void;
}

export const LoadingErrorStates: React.FC<LoadingErrorStatesProps> = ({
  loading,
  error,
  pullRequestsLength,
  username,
  className,
  isClient,
  onRetry
}) => {
  // Show loading state during SSR and initial client load
  if (!isClient || (loading && pullRequestsLength === 0)) {
    return <LoadingRows />;
  }

  // Error state
  if (error && pullRequestsLength === 0) {
    return (
      <div className={`w-full p-4 ${className}`} data-testid="pull-request-feed">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white light:text-gray-900 mb-2">Pull Request Activity</h2>
          <p className="text-gray-300 light:text-gray-600">Error loading pull requests</p>
        </div>
        <div className="bg-gray-800 light:bg-white border border-red-800 light:border-red-200 rounded-lg p-8 text-center">
          <div className="text-4xl mb-4">⚠️</div>
          <h3 className="text-lg font-semibold text-white light:text-gray-900 mb-2">Failed to Load Pull Requests</h3>
          <p className="text-gray-300 light:text-gray-600 mb-4">{error}</p>
          <button 
            className="bg-blue-700 light:bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-600 light:hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 light:focus:ring-offset-white"
            onClick={onRetry}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default LoadingErrorStates; 