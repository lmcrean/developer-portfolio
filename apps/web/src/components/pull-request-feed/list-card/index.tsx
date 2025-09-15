import React from 'react';
import {
  PullRequestFeedListCardProps,
  PullRequestListData
} from '@shared/types/pull-requests';
import {
  formatStaticDate,
  getStatusDisplay,
  formatBytesChange
} from '@shared/types/pull-requests/utilities';

export const PullRequestFeedListCard: React.FC<PullRequestFeedListCardProps> = ({
  pullRequest,
  onClick,
  hoverBgColor = 'teal'
}) => {
  const status = getStatusDisplay(pullRequest.state, pullRequest.merged_at);
  const bytesChange = formatBytesChange(pullRequest.additions, pullRequest.deletions);
  const statusDate = pullRequest.merged_at ? pullRequest.merged_at : pullRequest.created_at;
  const formattedDate = formatStaticDate(statusDate);

  return (
    <div 
      className={`flex gap-3 px-4 max-sm:px-2 py-4 cursor-pointer transition-all duration-200 ${hoverBgColor === 'orange' ? 'hover:bg-yellow-900/20 focus:bg-yellow-900/20' : 'hover:bg-teal-900/20 focus:bg-teal-900/20'} light:hover:bg-blue-50 focus:outline-none light:focus:bg-blue-50 hover:shadow-sm`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      aria-label={`Pull request #${pullRequest.number}, ${status.text} ${formattedDate}. Opens in new tab.`}
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
        {/* Row 1: Org:Repo:Title and Language */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-1">
            <span className="pr-text-muted text-sm max-lg:hidden">
              {pullRequest.repository.owner.login}:
            </span>
            <span className="font-medium pr-text-secondary text-sm max-sm:hidden">
              {pullRequest.repository.name}:
            </span>
            <span className="pr-text-primary font-bold text-sm leading-tight">
              {pullRequest.title}
            </span>
          </div>
          <div className="flex-shrink-0 max-sm:hidden">
            {pullRequest.repository.language && (
              <span className="italic text-sm pr-text-muted">
                {pullRequest.repository.language}
              </span>
            )}
          </div>
        </div>

        {/* Row 2: Status Date and Changes/Time */}
        <div className="flex items-center justify-between text-sm pr-text-muted">
          {/* Left: Status with date */}
          <div className="flex items-center gap-1">
            <span className="text-xs">
              {status.text} {formattedDate}
            </span>
          </div>
          
          {/* Right: Changes on desktop, Language on mobile */}
          <div className="flex items-center gap-1 flex-wrap">
            {/* Language - shown on mobile only */}
            {pullRequest.repository.language && (
              <span className="italic text-xs pr-text-muted sm:hidden">
                {pullRequest.repository.language}
              </span>
            )}

            {/* Comments - hidden on mobile */}
            {pullRequest.comments !== undefined && pullRequest.comments > 0 && (
              <span className="text-xs opacity-70 max-sm:hidden">
                <i className="far fa-comment fa-xs" title="Comments"></i>{' '}
                {pullRequest.comments}
              </span>
            )}
            
            {/* Changes - hidden on mobile */}
            {bytesChange.hasData && (
              <span className="font-mono text-xs max-sm:hidden">
                <span className="text-green-400 light:text-green-600">
                  {bytesChange.formatted.split(' ')[0]}
                </span>
                {' '}
                <span className="text-red-400 light:text-red-600">
                  {bytesChange.formatted.split(' ')[1]}
                </span>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PullRequestFeedListCard; 