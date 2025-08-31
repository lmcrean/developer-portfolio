import React from 'react';
import { GitHubIssue } from '@shared/types/issues';
import { formatIssueDate, getRelativeTime } from '@shared/types/issues/utilities';

interface Props {
  issue: GitHubIssue;
}

const IssueCard: React.FC<Props> = ({ issue }) => {
  const isOpen = issue.state === 'open';
  const relativeTime = getRelativeTime(issue.created_at);

  const handleClick = () => {
    window.open(issue.html_url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div 
      className="flex gap-3 px-6 max-sm:px-3 py-4 cursor-pointer transition-all duration-200 hover:bg-blue-900/20 light:hover:bg-blue-50 focus:outline-none focus:bg-blue-900/20 light:focus:bg-blue-50 hover:shadow-sm border-t border-gray-800 first:border-t-0"
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
      aria-label={`Issue #${issue.number}, ${isOpen ? 'open' : 'closed'} ${relativeTime}. Opens in new tab.`}
    >
      {/* Left: Status Indicator */}
      <div className="flex-shrink-0 pt-1">
        {isOpen ? (
          <div className="w-4 h-4 rounded-full border-2 border-green-500" />
        ) : (
          <div className="w-4 h-4 rounded-full bg-purple-500" />
        )}
      </div>

      {/* Right: Content */}
      <div className="flex-1 min-w-0">
        {/* Row 1: Issue Title and Status */}
        <div className="flex items-start gap-2 mb-2">
          <div className="flex-1 min-w-0 max-w-[calc(100%-80px)]">
            <span className="pr-text-primary font-bold text-sm leading-tight block truncate min-w-0 max-w-[calc(100%-80px)]">
              {issue.title}
            </span>
          </div>
          <div className="flex-shrink-0 flex items-center gap-1">
            <span className={`text-sm font-medium whitespace-nowrap ${isOpen ? 'text-green-400' : 'text-purple-400'}`}>
              {isOpen ? 'Open' : 'Closed'}
            </span>
          </div>
        </div>

        {/* Row 2: Metadata */}
        <div className="flex items-center justify-between text-sm pr-text-muted">
          {/* Left: Issue Number and Labels */}
          <div className="flex items-center gap-3">
            <span className="pr-text-muted">
              #{issue.number}
            </span>
            
            {/* Labels */}
            {issue.labels && issue.labels.length > 0 && (
              <div className="flex gap-1">
                {issue.labels.slice(0, 3).map((label) => (
                  <span
                    key={label.id}
                    className="px-2 py-0.5 rounded-full text-xs"
                    style={{
                      backgroundColor: `#${label.color}20`,
                      color: `#${label.color}`,
                      border: `1px solid #${label.color}40`
                    }}
                  >
                    {label.name}
                  </span>
                ))}
              </div>
            )}
          </div>
          
          {/* Right: Time */}
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-xs">
              {relativeTime}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IssueCard;