import React from 'react';

const LoadingState: React.FC = () => {
  return (
    <div className="issue-feed-loading flex justify-center items-center min-h-[400px]">
      <div className="animate-pulse flex gap-8 max-w-4xl w-full">
        {/* Middle section - colorful code blocks */}
        <div className="flex-1 flex flex-col gap-3 items-center">
          {/* Row 1 */}
          <div className="flex gap-2 justify-center">
            <div className="h-6 bg-teal-500/30 rounded w-20"></div>
            <div className="h-6 bg-blue-500/30 rounded w-24"></div>
            <div className="h-6 bg-orange-500/30 rounded w-16"></div>
          </div>
          {/* Row 2 */}
          <div className="flex gap-2 justify-center">
            <div className="h-6 bg-orange-500/30 rounded w-28"></div>
            <div className="h-6 bg-teal-500/30 rounded w-32"></div>
          </div>
          {/* Row 3 */}
          <div className="flex gap-2 justify-center">
            <div className="h-6 bg-blue-500/30 rounded w-24"></div>
            <div className="h-6 bg-orange-500/30 rounded w-20"></div>
          </div>
          {/* Row 4 */}
          <div className="flex gap-2 justify-center">
            <div className="h-6 bg-red-500/30 rounded w-16"></div>
            <div className="h-6 bg-teal-500/30 rounded w-36"></div>
          </div>
          {/* Row 5 */}
          <div className="flex gap-2 justify-center">
            <div className="h-6 bg-red-500/30 rounded w-20"></div>
            <div className="h-6 bg-orange-500/30 rounded w-28"></div>
          </div>
          {/* Row 6 */}
          <div className="flex gap-2 justify-center">
            <div className="h-6 bg-pink-500/30 rounded w-18"></div>
            <div className="h-6 bg-teal-500/30 rounded w-24"></div>
          </div>
          {/* Row 7 */}
          <div className="flex gap-2 justify-center">
            <div className="h-6 bg-red-500/30 rounded w-16"></div>
            <div className="h-6 bg-orange-500/30 rounded w-20"></div>
            <div className="h-6 bg-teal-500/30 rounded w-28"></div>
          </div>
          {/* Row 8 */}
          <div className="flex gap-2 justify-center">
            <div className="h-6 bg-pink-500/30 rounded w-20"></div>
            <div className="h-6 bg-orange-500/30 rounded w-32"></div>
          </div>
        </div>

        {/* Right section - issue dots and bars */}
        <div className="flex flex-col gap-3">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-2 h-2 bg-yellow-500/50 rounded-full"></div>
              <div className="h-4 bg-teal-500/20 rounded" style={{width: `${80 + Math.random() * 60}px`}}></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoadingState;