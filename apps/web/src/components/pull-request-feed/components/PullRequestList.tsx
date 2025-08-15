import React from 'react';
import { PullRequestListData, PaginationMeta } from '@shared/types/pull-requests';
import PullRequestFeedListCard from '../list-card';
import ErrorRow from './ErrorRow';
import LoadingRows from './LoadingRows';
import FilterToggle from './FilterToggle';

interface PullRequestListProps {
  pullRequests: PullRequestListData[];
  pagination: PaginationMeta | null;
  username: string;
  className: string;
  loading: boolean;
  error: string | null;
  isClient: boolean;
  onCardClick: (pr: PullRequestListData) => void;
  onRetry: () => void;
  enterpriseMode: boolean;
  onEnterpriseToggle: (enabled: boolean) => void;
}

export const PullRequestList: React.FC<PullRequestListProps> = ({
  pullRequests,
  pagination,
  username,
  className,
  loading,
  error,
  isClient,
  onCardClick,
  onRetry,
  enterpriseMode,
  onEnterpriseToggle
}) => {
  // Determine what to render in the table body
  const renderTableBody = () => {
    // Show loading state during SSR and initial client load
    if (!isClient || (loading && pullRequests.length === 0)) {
      return <LoadingRows />;
    }

    // Show error state if error exists and no pull requests
    if (error && pullRequests.length === 0) {
      return <ErrorRow error={error} onRetry={onRetry} />;
    }

    // Show pull requests if available
    if (pullRequests.length > 0) {
      return (
        <>
          {pullRequests.map((pr) => (
            <PullRequestFeedListCard
              key={pr.id}
              pullRequest={pr}
              onClick={() => onCardClick(pr)}
            />
          ))}
        </>
      );
    }

    // Fallback to loading state
    return <LoadingRows />;
  };

  return (
    <div className={`w-full p-4 max-sm:px-1 max-sm:py-2 ${className}`} data-testid="pull-request-feed" style={{ fontFamily: '"IBM Plex Serif", serif' }}>
      {/* Filter Controls */}
      <div className="flex justify-between items-center px-4 max-sm:px-1 py-3 border-b border-gray-700 light:border-gray-200">
        <div className="flex items-center gap-3">
        </div>
        <FilterToggle
          enterpriseMode={enterpriseMode}
          onToggle={onEnterpriseToggle}
        />
      </div>

      {/* Table Header - Always visible */}
      <div className="grid grid-cols-12 gap-4 max-sm:gap-2 px-4 max-sm:px-1 py-3 text-sm font-semibold pr-text-header border-b border-gray-700 light:border-gray-200">
        <div className="col-span-3 max-lg:col-span-4">Repository</div>
        <div className="col-span-5 max-lg:col-span-8">Title</div>
        <div className="col-span-2 max-lg:hidden">Language</div>
        <div className="col-span-2 text-right max-lg:hidden">Status</div>
      </div>

      {/* Table Body - Dynamic content based on state */}
      <div className="divide-y divide-gray-700 light:divide-gray-200" style={{ borderTop: 'none' }}>
        {renderTableBody()}
      </div>
    </div>
  );
};

export default PullRequestList; 