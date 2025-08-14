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
    <div className={`w-full p-4 max-sm:px-1 max-sm:py-2 ${className}`} data-testid="pull-request-feed" style={{ fontFamily: '"IBM Plex Serif", serif' }}>
      {/* Table Header */}
      <div className="grid grid-cols-12 gap-4 max-sm:gap-2 px-4 max-sm:px-1 py-3 text-sm font-semibold pr-text-header border-b border-gray-700 light:border-gray-200">
        <div className="col-span-3 max-lg:col-span-4">Repository</div>
        <div className="col-span-5 max-lg:col-span-8">Title</div>
        <div className="col-span-2 max-lg:hidden">Language</div>
        <div className="col-span-2 text-right max-lg:hidden">Status</div>
      </div>

      {/* Table Rows */}
      <div className="divide-y divide-gray-700 light:divide-gray-200" style={{ borderTop: 'none' }}>
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