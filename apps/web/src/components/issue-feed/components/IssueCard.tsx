import React from 'react';
import { GitHubIssue } from '@shared/types/issues';
import { formatIssueDate, getRelativeTime } from '@shared/types/issues/utilities';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTag } from '@fortawesome/free-solid-svg-icons';

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
      {/* Status Indicator Dot */}
      <div className="flex-shrink-0 pt-1.5">
        <div className={`w-2.5 h-2.5 rounded-full ${isOpen ?'border border-gray-400': 'bg-gray-400'}`} />
      </div>

      {/* Right: Content */}
      <div className="flex-1 min-w-0">
        {/* Row 1: Issue Title */}
        <div className="flex items-start gap-2 mb-2">
          <div className="flex-1 min-w-0">
            <span className="pr-text-primary font-bold text-sm leading-tight block truncate min-w-0">
              {issue.title}
            </span>
          </div>
        </div>

        {/* Row 2: Metadata */}
        <div className="flex items-center justify-between text-sm pr-text-muted">
          {/* Left: Issue Number, Dates and Labels */}
          <div className="flex items-center gap-3">
            
            {/* Dates */}
            <span className="text-xs text-gray-400">
              Opened: {formatIssueDate(issue.created_at)}
              {issue.closed_at && ` • Closed: ${formatIssueDate(issue.closed_at)}`}
            </span>
            
            {/* Labels - Hidden on mobile */}
            {issue.labels && issue.labels.length > 0 && (
              <div className="hidden sm:flex gap-1">
                <span className="text-xs text-gray-400"><FontAwesomeIcon icon={faTag} /></span>
                {issue.labels.slice(0, 3).map((label) => (
                  <span
                    key={label.id}
                    className="px-2 rounded-full text-xs text-gray-400"
                    style={{
                      border: `1px solid gray`
                    }}
                  >
                    {label.name}
                  </span>
                ))}
              </div>
            )}
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default IssueCard;