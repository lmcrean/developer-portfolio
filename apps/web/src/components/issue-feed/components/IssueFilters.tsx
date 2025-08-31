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
    <div className="issue-filters">
      <div className="flex flex-wrap gap-4 items-center">
        {/* Clear Filters */}
        {selectedRepos.length > 0 && (
          <>
            <span className="text-gray-500">|</span>
            <button
              onClick={() => onRepoSelect([])}
              className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
            >
              Clear filters ({selectedRepos.length} selected)
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default IssueFilters;