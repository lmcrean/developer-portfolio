import React from 'react';

const LoadingState: React.FC = () => {
  return (
    <div className="issue-feed-loading p-8">
      <div className="animate-pulse">
        {/* Header skeleton */}
        <div className="h-8 bg-gray-700 rounded w-1/4 mb-4"></div>
        <div className="h-4 bg-gray-700 rounded w-1/2 mb-6"></div>
        
        {/* Filters skeleton */}
        <div className="h-16 bg-gray-800/30 rounded-lg mb-6"></div>
        
        {/* Repository groups skeleton */}
        {[1, 2, 3].map((i) => (
          <div key={i} className="border border-gray-700 rounded-lg p-4 mb-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-gray-700 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-700 rounded w-1/4 mb-2"></div>
                <div className="h-3 bg-gray-700 rounded w-1/6"></div>
              </div>
              <div className="flex gap-2">
                <div className="h-6 bg-gray-700 rounded w-20"></div>
                <div className="h-6 bg-gray-700 rounded w-20"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LoadingState;