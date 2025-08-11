import React, { useState, useEffect } from 'react';
import { 
  PullRequestFeedListCardProps,
  PullRequestListData 
} from '@shared/types/pull-requests';
import {
  getRelativeTime,
  getStatusDisplay
} from '@shared/types/pull-requests/utilities';

export const PullRequestFeedListCard: React.FC<PullRequestFeedListCardProps> = ({
  pullRequest,
  onClick
}) => {
  const status = getStatusDisplay(pullRequest.state, pullRequest.merged_at);

  // Add client-side only time calculation
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Only calculate relative time on client side
  const relativeTime = isClient ? getRelativeTime(pullRequest.created_at) : 'Loading...';

  return (
    <div 
      className="grid grid-cols-12 gap-4 px-4 py-4 cursor-pointer transition-all duration-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 focus:outline-none focus:bg-blue-50 dark:focus:bg-blue-900/20 hover:shadow-sm"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      aria-label={`Pull request #${pullRequest.number}, ${status.text} ${relativeTime}. Opens in new tab.`}
      data-testid="pull-request-card"
      data-pr-number={pullRequest.number}
      data-pr-title={pullRequest.title}
    >
      {/* Repository Column */}
      <div className="col-span-3 flex items-center">
        <span className="text-gray-900 dark:text-white font-medium text-sm truncate">
          {pullRequest.repository.name}
        </span>
      </div>

      {/* Title Column */}
      <div className="col-span-5 flex items-center">
        <span className="text-gray-900 dark:text-white text-sm truncate">
          {pullRequest.title}
        </span>
      </div>

      {/* Language Column */}
      <div className="col-span-2 flex items-center">
        {pullRequest.repository.language ? (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-600">
            {pullRequest.repository.language}
          </span>
        ) : (
          <span className="text-gray-400 dark:text-gray-500 text-xs">—</span>
        )}
      </div>

      {/* Status Column */}
      <div className="col-span-2 flex items-center justify-end">
        <div className="flex items-center gap-2">
          <div className={`flex items-center gap-1 ${status.color} text-sm font-medium`}>
            <span>{status.emoji}</span>
            <span>{status.text}</span>
          </div>
          <span className="text-gray-500 dark:text-gray-400 text-xs">
            {relativeTime}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PullRequestFeedListCard; 