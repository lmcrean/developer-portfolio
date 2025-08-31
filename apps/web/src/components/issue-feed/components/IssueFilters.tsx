import React from 'react';
import { Repository } from '@shared/types/issues';

interface Props {
  showExternal: boolean;
  onToggleExternal: (show: boolean) => void;
  repositories: Repository[];
  selectedRepos: string[];
  onRepoSelect: (repos: string[]) => void;
}

const IssueFilters: React.FC<Props> = ({
  showExternal,
  onToggleExternal,
  repositories,
  selectedRepos,
  onRepoSelect
}) => {
  const externalRepos = repositories.filter(r => r.is_external);
  const ownRepos = repositories.filter(r => !r.is_external);

  return (
    <div className="issue-filters mt-4 p-4 bg-gray-800/30 rounded-lg">
      <div className="flex flex-wrap gap-4 items-center">
        {/* External Repository Toggle */}
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={showExternal}
            onChange={(e) => onToggleExternal(e.target.checked)}
            className="w-4 h-4 text-blue-500 rounded"
          />
          <span className="text-sm text-gray-300">
            Show external repositories ({externalRepos.length})
          </span>
        </label>

        {/* Clear Filters */}
        {selectedRepos.length > 0 && (
          <button
            onClick={() => onRepoSelect([])}
            className="text-sm text-blue-400 hover:text-blue-300"
          >
            Clear filters ({selectedRepos.length} selected)
          </button>
        )}
      </div>
    </div>
  );
};

export default IssueFilters;