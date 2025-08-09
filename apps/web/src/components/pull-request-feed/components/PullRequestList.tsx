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
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2" style={{ fontFamily: '"IBM Plex Serif", serif', color: 'var(--text-primary, #111827)' }}>Pull Request Activity</h2>
        <p className="text-gray-600 dark:text-gray-300" style={{ fontFamily: '"IBM Plex Serif", serif', color: 'var(--text-secondary, #6b7280)' }}>
          {pagination 
            ? `Showing ${pullRequests.length} of ${pagination.total_count} pull requests for ${username}`
            : `Recent pull requests for ${username}`
          }
        </p>
      </div>

      {/* Pull request table */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden mb-6" 
           style={{ 
             backgroundColor: 'var(--bg-primary, white)', 
             border: '1px solid var(--border-color, #e5e7eb)', 
             borderRadius: '8px', 
             overflow: 'hidden', 
             marginBottom: '24px',
             fontFamily: '"IBM Plex Serif", serif'
           }}>
        {/* Table Header */}
        <div className="grid gap-4 p-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600"
             style={{ 
               display: 'grid', 
               gridTemplateColumns: '1fr 3fr 1fr 1fr', 
               gap: '16px', 
               padding: '16px', 
               backgroundColor: 'var(--bg-secondary, #f9fafb)', 
               borderBottom: '1px solid var(--border-color, #e5e7eb)',
               fontFamily: '"IBM Plex Serif", serif'
             }}>
          <div className="font-semibold text-sm text-gray-700 dark:text-gray-300" style={{ fontWeight: '600', fontSize: '14px', color: 'var(--text-secondary, #374151)', fontFamily: '"IBM Plex Serif", serif' }}>Repository</div>
          <div className="font-semibold text-sm text-gray-700 dark:text-gray-300" style={{ fontWeight: '600', fontSize: '14px', color: 'var(--text-secondary, #374151)', fontFamily: '"IBM Plex Serif", serif' }}>Title</div>
          <div className="font-semibold text-sm text-gray-700 dark:text-gray-300" style={{ fontWeight: '600', fontSize: '14px', color: 'var(--text-secondary, #374151)', fontFamily: '"IBM Plex Serif", serif' }}>Language</div>
          <div className="font-semibold text-sm text-gray-700 dark:text-gray-300" style={{ fontWeight: '600', fontSize: '14px', color: 'var(--text-secondary, #374151)', fontFamily: '"IBM Plex Serif", serif' }}>Status</div>
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
    </div>
  );
};

export default PullRequestList; 