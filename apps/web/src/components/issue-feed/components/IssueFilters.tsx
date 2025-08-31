import React from 'react';
import { Repository } from '@shared/types/issues';

interface Props {
  repositories: Repository[];
  selectedRepos: string[];
  onRepoSelect: (repos: string[]) => void;
}

const IssueFilters: React.FC<Props> = ({
  repositories,
  selectedRepos,
  onRepoSelect
}) => {
  const externalRepos = repositories.filter(r => r.is_external);

  return (
    <div className="issue-filters mt-4 p-4 bg-gray-800/30 rounded-lg">
      <div className="flex flex-wrap gap-4 items-center">
        {/* Repository count info */}
        <span className="text-sm text-gray-300">
          Tracking {externalRepos.length} external repositories
        </span>

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