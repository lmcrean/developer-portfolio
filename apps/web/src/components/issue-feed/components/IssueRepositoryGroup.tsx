import React from 'react';
import { IssueGroup } from '@shared/types/issues';
import IssueCard from './IssueCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronRight } from '@fortawesome/free-solid-svg-icons';

interface Props {
  group: IssueGroup;
  isExpanded: boolean;
  onToggle: () => void;
}

const IssueRepositoryGroup: React.FC<Props> = ({ group, isExpanded, onToggle }) => {
  const { repository, issues, openCount, closedCount } = group;

  return (
    <div className="issue-repo-group">
      <div 
        className="flex gap-3 px-4 max-sm:px-2 py-4 cursor-pointer transition-all duration-200 hover:bg-gray-800/50 light:hover:bg-gray-50 focus:outline-none focus:bg-gray-800/50 light:focus:bg-gray-50 hover:shadow-sm"
        onClick={onToggle}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onToggle();
          }
        }}
      >
        {/* Left: Organization Icon and Expand/Collapse */}
        <div className="flex-shrink-0 flex items-center gap-2 pt-1">
          <FontAwesomeIcon 
            icon={isExpanded ? faChevronDown : faChevronRight} 
            className="w-3 h-3 text-gray-400"
          />
          <img 
            src={repository.owner.avatar_url}
            alt={`${repository.owner.login} avatar`}
            className="w-6 h-6 rounded-full"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>

        {/* Right: Content */}
        <div className="flex-1 min-w-0">
          {/* Row 1: Repository Name and Issue Counts */}
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <span className="pr-text-primary font-bold text-sm leading-tight truncate block">
                {repository.name}
                <span className="text-xs text-gray-400 ml-2 font-normal">
                  {repository.owner.login}
                </span>
              </span>
            </div>
            <div className="flex-shrink-0 flex items-center gap-2">
              {openCount > 0 && (
                <span className="px-2 py-0.5 text-gray-400 rounded text-xs font-medium whitespace-nowrap">
                  {openCount} open
                </span>
              )}
              {closedCount > 0 && (
                <span className="px-2 py-0.5 border border-gray-200/30 text-gray-400 rounded text-xs font-medium whitespace-nowrap">
                  {closedCount} closed
                </span>
              )}
            </div>
          </div>

          {/* Row 2: Repository Description (when collapsed) */}
          {/* {repository.description && (
            <div className="text-sm text-gray-400 italic truncate">
              {repository.description}
            </div>
          )} */}
        </div>
      </div>

      {/* Issues List (when expanded) */}
      {isExpanded && (
        <div className="issues-list bg-gray-900/10 border-t border-gray-700">
          {issues.length === 0 ? (
            <div className="px-4 py-6 text-center text-gray-500">
              No issues in this repository
            </div>
          ) : (
            <div>
              {issues.map((issue) => (
                <IssueCard key={issue.id} issue={issue} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default IssueRepositoryGroup;