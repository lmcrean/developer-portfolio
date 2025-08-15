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
      className="flex gap-3 px-4 max-sm:px-2 py-4 cursor-pointer transition-all duration-200 hover:bg-blue-900/20 light:hover:bg-blue-50 focus:outline-none focus:bg-blue-900/20 light:focus:bg-blue-50 hover:shadow-sm"
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
      {/* Left: Organization Icon */}
      <div className="flex-shrink-0 pt-1">
        <img 
          src={pullRequest.repository.owner.avatar_url}
          alt={`${pullRequest.repository.owner.login} avatar`}
          className="w-6 h-6 rounded-full"
          onError={(e) => {
            // Hide image on error
            e.currentTarget.style.display = 'none';
          }}
        />
      </div>

      {/* Right: Content */}
      <div className="flex-1 min-w-0">
        {/* Row 1: PR Title in Bold */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <span className="pr-text-primary font-bold text-sm leading-tight">
            {pullRequest.title}
          </span>
          <div className="flex-shrink-0 flex items-center gap-1">
            <div className={`flex items-center gap-1 ${status.color} text-sm font-medium`}>
              <span>{status.emoji}</span>
              <span className="max-sm:hidden">{status.text}</span>
            </div>
          </div>
        </div>

        {/* Row 2: Repository, Language, Changes, Status Details */}
        <div className="flex items-center gap-3 text-sm pr-text-muted flex-wrap">
          {/* Repository */}
          <span className="font-medium pr-text-secondary">
            {pullRequest.repository.name}
          </span>
          
          {/* Language */}
          {pullRequest.repository.language && (
            <>
              <span>•</span>
              <span className="italic">
                {pullRequest.repository.language}
              </span>
            </>
          )}
          
          {/* Changes */}
          {bytesChange.hasData && (
            <>
              <span>•</span>
              <span className="font-mono text-xs">
                <span className="text-green-400 light:text-green-600">
                  {bytesChange.formatted.split(' ')[0]}
                </span>
                {' '}
                <span className="text-red-400 light:text-red-600">
                  {bytesChange.formatted.split(' ')[1]}
                </span>
              </span>
            </>
          )}
          
          {/* Time */}
          <span>•</span>
          <span className="text-xs">
            {relativeTime}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PullRequestFeedListCard; 