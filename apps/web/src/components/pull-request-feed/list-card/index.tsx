import React, { useState, useEffect } from 'react';
import { 
  PullRequestFeedListCardProps,
  PullRequestListData 
} from '@shared/types/pull-requests';
import {
  getRelativeTime,
  getStatusDisplay,
  getTitleIcon,
  getLanguageColor,
  truncateText
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
      className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 cursor-pointer transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-blue-500 dark:hover:border-blue-400 hover:shadow-md hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800"
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
      {/* Status & Timing Row */}
      <div className="flex justify-between items-center mb-3">
        <div className={`flex items-center space-x-1 ${status.color} font-medium text-sm`}>
          <span>{status.emoji}</span>
          <span>{status.text}</span>
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
          <i className="fas fa-clock"></i>
          <span>{relativeTime}</span>
        </div>
      </div>

      {/* Title Section */}
      <div className="mb-3">
        <div className="flex items-start space-x-2">
          <span className="text-lg flex-shrink-0 mt-0.5">{titleIcon}</span>
          <h3 className="font-bold text-gray-900 dark:text-white text-base leading-tight line-clamp-2">
            {pullRequest.title}
          </h3>
        </div>
      </div>

      {/* Description Preview */}
      {pullRequest.description && (
        <div className="mb-3">
          <div className="flex items-start space-x-2">
            <span className="text-sm flex-shrink-0 mt-0.5">📝</span>
            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed line-clamp-2">
              {truncateText(pullRequest.description, 80)}
            </p>
          </div>
        </div>
      )}

      {/* Repository & Language */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-1">
          <span className="text-sm">📦</span>
          <span className="text-gray-700 dark:text-gray-300 text-sm font-medium">
            {pullRequest.repository.name}
          </span>
        </div>
        {pullRequest.repository.language && (
          <div className="flex items-center space-x-1">
            <span 
              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-white ${languageColor}`}
            >
              🏷️ {pullRequest.repository.language}
            </span>
          </div>
        )}
      </div>

      {/* Bottom Row: PR Number & Action */}
      <div className="flex justify-between items-center">
        <div className="text-gray-500 dark:text-gray-400 text-xs font-mono">
          #{pullRequest.number}
        </div>
        <div className="flex items-center space-x-1 text-blue-600 dark:text-blue-400 text-sm font-medium">
          <span>👆</span>
          <span>View PR</span>
        </div>
      </div>
    </article>
  );
};

export default PullRequestFeedListCard; 