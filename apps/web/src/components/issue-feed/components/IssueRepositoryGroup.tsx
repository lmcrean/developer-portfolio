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
    <div className="issue-repo-group border border-gray-700 rounded-lg overflow-hidden">
      <div 
        className="repo-header p-4 bg-gray-800/50 hover:bg-gray-800/70 cursor-pointer transition-colors"
        onClick={onToggle}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Expand/Collapse Icon */}
            <div className="text-gray-400">
              <FontAwesomeIcon 
                icon={isExpanded ? faChevronDown : faChevronRight} 
                className="w-4 h-4"
              />
            </div>

            {/* Company Logo */}
            <img 
              src={repository.owner.avatar_url}
              alt={repository.owner.login}
              className="w-8 h-8 rounded-full"
            />

            {/* Repository Name */}
            <div className="flex flex-col">
              <span className="font-semibold text-white">
                {repository.name}
              </span>
              <span className="text-xs text-gray-400">
                {repository.owner.login}
              </span>
            </div>
          </div>

          {/* Issue Count Badges */}
          <div className="flex items-center gap-4">
            <span className="px-2 py-1 bg-green-900/50 text-green-400 rounded text-sm font-medium">
              {openCount} opened
            </span>
            <span className="px-2 py-1 bg-purple-900/50 text-purple-400 rounded text-sm font-medium">
              {closedCount} closed
            </span>
          </div>
        </div>

        {/* Repository Description (when collapsed) */}
        {repository.description && !isExpanded && (
          <p className="text-sm text-gray-400 mt-2 ml-12">
            {repository.description}
          </p>
        )}
      </div>

      {/* Issues List (when expanded) */}
      {isExpanded && (
        <div className="issues-list bg-gray-900/30">
          {issues.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              No issues in this repository
            </div>
          ) : (
            <div className="divide-y divide-gray-800">
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