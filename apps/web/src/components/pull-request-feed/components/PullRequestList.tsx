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
    <div className={`w-full p-4 ${className}`} data-testid="pull-request-feed" style={{ fontFamily: '"IBM Plex Serif", serif' }}>
      {/* Table Header */}
      <div className="grid grid-cols-12 gap-4 px-4 py-3 text-sm font-semibold text-gray-600 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
        <div className="col-span-3">Repository</div>
        <div className="col-span-5">Title</div>
        <div className="col-span-2">Language</div>
        <div className="col-span-2 text-right">Status</div>
      </div>

      {/* Table Rows */}
      <div className="divide-y divide-gray-200 dark:divide-gray-700" style={{ borderTop: 'none' }}>
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