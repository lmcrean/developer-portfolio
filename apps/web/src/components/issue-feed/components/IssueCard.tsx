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
      className="issue-card p-4 hover:bg-gray-800/30 cursor-pointer transition-colors"
      onClick={handleClick}
    >
      <div className="flex items-start gap-3">
        {/* Status Indicator */}
        <div className="flex-shrink-0 mt-1">
          {isOpen ? (
            <div className="w-4 h-4 rounded-full border-2 border-green-500" />
          ) : (
            <div className="w-4 h-4 rounded-full bg-purple-500" />
          )}
        </div>

        {/* Issue Content */}
        <div className="flex-1 min-w-0">
          {/* Title and Time */}
          <div className="flex items-start justify-between gap-2 mb-1">
            <h4 className="text-sm font-medium text-white hover:text-blue-400 transition-colors">
              {issue.title}
            </h4>
            <span className="text-xs text-gray-500 flex-shrink-0">
              {relativeTime}
            </span>
          </div>

          {/* Metadata */}
          <div className="flex items-center gap-3 text-xs text-gray-400">
            <span>#{issue.number}</span>
            
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

            {/* Dates */}
            <span className="text-xs">
              Opened: {formatIssueDate(issue.created_at)}
              {issue.closed_at && ` • Closed: ${formatIssueDate(issue.closed_at)}`}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IssueCard;