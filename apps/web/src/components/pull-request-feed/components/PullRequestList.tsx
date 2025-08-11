import React from 'react';
import { PullRequestListData, PaginationMeta } from '@shared/types/pull-requests';
import PullRequestFeedListCard from '../list-card';

interface PullRequestListProps {
  pullRequests: PullRequestListData[];
  pagination: PaginationMeta | null;
  username: string;
  className: string;
  onCardClick: (pr: PullRequestListData) => void;
}

export const PullRequestList: React.FC<PullRequestListProps> = ({
  pullRequests,
  pagination,
  username,
  className,
  onCardClick
}) => {
  return (
    <div className={`w-full max-w-4xl mx-auto p-4 ${className}`} data-testid="pull-request-feed">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Pull Request Activity</h2>
        <p className="text-gray-600 dark:text-gray-300">
          {pagination 
            ? `Showing ${pullRequests.length} of ${pagination.total_count} pull requests for ${username}`
            : `Recent pull requests for ${username}`
          }
        </p>
      </div>

      {/* Pull request list */}
      <div className="space-y-4 mb-6">
        {pullRequests.map((pr) => (
          <PullRequestFeedListCard
            key={pr.id}
            pullRequest={pr}
            onClick={() => onCardClick(pr)}
          />
        ))}
      </div>
    </div>
  );
};

export default PullRequestList; 