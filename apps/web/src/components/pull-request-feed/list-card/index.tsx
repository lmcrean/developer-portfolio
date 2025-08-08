import React, { useState, useEffect } from 'react';
import { 
  PullRequestFeedListCardProps,
  PullRequestListData 
} from '@shared/types/pull-requests';
import {
  getRelativeTime,
  getStatusDisplay,
  getTitleIcon,
  getLanguageColor
} from '@shared/types/pull-requests/utilities';

export const PullRequestFeedListCard: React.FC<PullRequestFeedListCardProps> = ({
  pullRequest,
  onClick
}) => {
  const status = getStatusDisplay(pullRequest.state, pullRequest.merged_at);
  const titleIcon = getTitleIcon(pullRequest.title);
  const languageColor = getLanguageColor(pullRequest.repository.language);

  // Add client-side only time calculation
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Only calculate relative time on client side
  const relativeTime = isClient ? getRelativeTime(pullRequest.created_at) : 'Loading...';

  return (
    <article 
      className="grid grid-cols-5 gap-4 p-4 cursor-pointer transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-inset"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      aria-label={`Pull request #${pullRequest.number}, ${status.text} ${relativeTime}`}
      data-testid="pull-request-card"
      data-pr-number={pullRequest.number}
      data-pr-title={pullRequest.title}
    >
      {/* Repository Column */}
      <div className="flex items-center space-x-2">
        <span className="text-sm">📦</span>
        <span className="text-gray-700 dark:text-gray-300 text-sm font-medium truncate">
          {pullRequest.repository.name}
        </span>
      </div>

      {/* Title Column (spans 2 columns for more space) */}
      <div className="col-span-2 flex items-center space-x-2">
        <span className="text-lg flex-shrink-0">{titleIcon}</span>
        <h3 className="font-bold text-gray-900 dark:text-white text-sm leading-tight truncate">
          {pullRequest.title}
        </h3>
      </div>

      {/* Language Column */}
      <div className="flex items-center">
        {pullRequest.repository.language ? (
          <span 
            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-white ${languageColor}`}
          >
            🏷️ {pullRequest.repository.language}
          </span>
        ) : (
          <span className="text-gray-400 dark:text-gray-500 text-xs">No language</span>
        )}
      </div>

      {/* Status Column */}
      <div className="flex items-center justify-between">
        <div className={`flex items-center space-x-1 ${status.color} font-medium text-xs`}>
          <span>{status.emoji}</span>
          <span>{status.text}</span>
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
          <i className="fas fa-clock"></i>
          <span>{relativeTime}</span>
        </div>
      </div>
    </article>
  );
};

export default PullRequestFeedListCard; 