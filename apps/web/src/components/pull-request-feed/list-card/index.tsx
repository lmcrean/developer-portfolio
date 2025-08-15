import React, { useState, useEffect } from 'react';
import { 
  PullRequestFeedListCardProps,
  PullRequestListData 
} from '@shared/types/pull-requests';
import {
  getRelativeTime,
  getStatusDisplay,
  formatBytesChange
} from '@shared/types/pull-requests/utilities';

export const PullRequestFeedListCard: React.FC<PullRequestFeedListCardProps> = ({
  pullRequest,
  onClick
}) => {
  const status = getStatusDisplay(pullRequest.state, pullRequest.merged_at);
  const bytesChange = formatBytesChange(pullRequest.additions, pullRequest.deletions);

  // Add client-side only time calculation
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Only calculate relative time on client side
  const relativeTime = isClient ? getRelativeTime(pullRequest.created_at) : 'Loading...';

  return (
    <div 
      className="grid grid-cols-12 gap-4 max-sm:gap-2 px-4 max-sm:px-1 py-4 cursor-pointer transition-all duration-200 hover:bg-blue-900/20 light:hover:bg-blue-50 focus:outline-none focus:bg-blue-900/20 light:focus:bg-blue-50 hover:shadow-sm"
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
      <div className="col-span-2 max-lg:col-span-3 flex items-center gap-2">
        <img 
          src={pullRequest.repository.owner.avatar_url}
          alt={`${pullRequest.repository.owner.login} avatar`}
          className="w-5 h-5 rounded-full flex-shrink-0"
          onError={(e) => {
            // Hide image on error
            e.currentTarget.style.display = 'none';
          }}
        />
        <span className="pr-text-primary font-medium text-sm truncate">
          {pullRequest.repository.name}
        </span>
      </div>

      {/* Changes Column */}
      <div className="col-span-2 max-lg:hidden flex items-center justify-center">
        {bytesChange.hasData ? (
          <span className="font-mono text-xs">
            <span className="text-green-400 light:text-green-600">
              {bytesChange.formatted.split(' ')[0]}
            </span>
            {' '}
            <span className="text-red-400 light:text-red-600">
              {bytesChange.formatted.split(' ')[1]}
            </span>
          </span>
        ) : (
          <span className="pr-text-muted text-xs">—</span>
        )}
      </div>

      {/* Title Column */}
      <div className="col-span-4 max-lg:col-span-9 flex items-center">
        <span className="pr-text-primary text-sm truncate">
          {pullRequest.title}
        </span>
      </div>

      {/* Language Column */}
      <div className="col-span-2 max-lg:hidden flex items-center">
        {pullRequest.repository.language ? (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium pr-text-secondary italic">
            {pullRequest.repository.language}
          </span>
        ) : (
          <span className="pr-text-muted text-xs">—</span>
        )}
      </div>

      {/* Status Column */}
      <div className="col-span-2 max-lg:hidden flex items-center justify-end italic">
        <div className="flex items-center gap-2">
          <div className={`flex items-center gap-1 ${status.color} text-sm font-medium`}>
            <span>{status.emoji}</span>
            <span>{status.text}</span>
          </div>
          <span className="pr-text-muted text-xs">
            {relativeTime}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PullRequestFeedListCard; 