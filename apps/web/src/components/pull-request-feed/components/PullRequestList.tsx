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

      {/* Pull request table */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden mb-6">
        {/* Table Header */}
        <div className="grid grid-cols-5 gap-4 p-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
          <div className="font-semibold text-sm text-gray-700 dark:text-gray-300">Repository</div>
          <div className="font-semibold text-sm text-gray-700 dark:text-gray-300 col-span-2">Title</div>
          <div className="font-semibold text-sm text-gray-700 dark:text-gray-300">Language</div>
          <div className="font-semibold text-sm text-gray-700 dark:text-gray-300">Status</div>
        </div>
        
        {/* Table Rows */}
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {pullRequests.map((pr) => (
            <PullRequestFeedListCard
              key={pr.id}
              pullRequest={pr}
              onClick={() => onCardClick(pr)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PullRequestList; 