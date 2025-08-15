import React from 'react';

interface ErrorRowProps {
  error: string;
  onRetry: () => void;
}

export const ErrorRow: React.FC<ErrorRowProps> = ({ error, onRetry }) => {
  return (
    <div className="grid grid-cols-12 gap-4 max-sm:gap-2 px-4 max-sm:px-1 py-8">
      <div className="col-span-12 text-center">
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
};

export default ErrorRow;