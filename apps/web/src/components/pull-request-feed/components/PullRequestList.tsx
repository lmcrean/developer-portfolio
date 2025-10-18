import React, { useEffect, useRef, useCallback, useState } from 'react';
import { PullRequestListData } from '@shared/types/pull-requests';
import PullRequestFeedListCard from '../list-card';
import ErrorRow from './ErrorRow';
import LoadingRows from './LoadingRows';

interface PullRequestListProps {
  pullRequests: PullRequestListData[];
  hasMoreItems: boolean;
  isLoadingMore: boolean;
  username: string;
  className: string;
  loading: boolean;
  error: string | null;
  isClient: boolean;
  onCardClick: (pr: PullRequestListData) => void;
  onRetry: () => void;
  onLoadMore: () => void;
}

export const PullRequestList: React.FC<PullRequestListProps> = ({
  pullRequests,
  hasMoreItems,
  isLoadingMore,
  username,
  className,
  loading,
  error,
  isClient,
  onCardClick,
  onRetry,
  onLoadMore
}) => {
  // Ref for the infinite scroll trigger element
  const infiniteScrollTriggerRef = useRef<HTMLDivElement>(null);

  // Handle loading more items
  const handleLoadMore = useCallback(() => {
    if (!isLoadingMore && hasMoreItems) {
      onLoadMore();
    }
  }, [isLoadingMore, hasMoreItems, onLoadMore]);

  // Set up intersection observer for infinite scroll
  useEffect(() => {
    if (!isClient || !infiniteScrollTriggerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && hasMoreItems && !isLoadingMore && !loading) {
          console.log('🔄 Intersection Observer triggered - loading more items');
          handleLoadMore();
        }
      },
      {
        rootMargin: '100px', // Trigger 100px before the element comes into view
        threshold: 0.1
      }
    );

    observer.observe(infiniteScrollTriggerRef.current);

    return () => {
      observer.disconnect();
    };
  }, [isClient, hasMoreItems, isLoadingMore, loading, handleLoadMore]);


  // Split pull requests into merged and open
  const mergedPRs = pullRequests.filter(pr => pr.merged_at);
  const openPRs = pullRequests.filter(pr => !pr.merged_at && pr.state === 'open');

  console.log('📊 PullRequestList rendering:', {
    totalPRs: pullRequests.length,
    mergedPRs: mergedPRs.length,
    openPRs: openPRs.length,
    loading,
    error,
    hasMoreItems,
    sampleOpenPRs: openPRs.slice(0, 5).map(pr => ({ title: pr.title.substring(0, 40), repo: pr.repository.name }))
  });

  // Helper function to render PR cards
  const renderPRCards = (prs: PullRequestListData[], hoverBgColor: 'teal' | 'orange' = 'teal') => {
    return prs.map((pr) => (
      <div key={pr.id}>
        <PullRequestFeedListCard
          pullRequest={pr}
          onClick={() => onCardClick(pr)}
          hoverBgColor={hoverBgColor}
        />
      </div>
    ));
  };

  // Determine what to render in the table body
  const renderTableBody = () => {
    // Show error state if error exists and no pull requests
    if (error && pullRequests.length === 0) {
      return <ErrorRow error={error} onRetry={onRetry} />;
    }

    // Show pull requests if available
    if (pullRequests.length > 0) {
      return (
        <>
          {/* Merged PRs Section */}
          {mergedPRs.length > 0 && (
            <>
              <div className="px-4 max-sm:px-1 py-3 border-b border-gray-700 light:border-gray-200">
                <div className="text-sm font-semibold pr-text-secondary">
                  Open Source Contributions
                </div>
                <div className="text-xs italic text-gray-400 light:text-gray-600 mt-1">
                  Approved in production
                </div>
              </div>
              <div className="divide-y divide-gray-700 light:divide-gray-200">
                {renderPRCards(mergedPRs, 'teal')}
              </div>
            </>
          )}
          
          {/* Open PRs Section */}
          {openPRs.length > 0 && (
            <>
              <div className="px-4 max-sm:px-1 py-3 border-b border-gray-700 light:border-gray-200 mt-6">
                <div className="text-xs italic text-gray-400 light:text-gray-600 mt-1">
                  Pending approval
                </div>
              </div>
              <div className="divide-y divide-gray-700 light:divide-gray-200">
                {renderPRCards(openPRs, 'orange')}
              </div>
            </>
          )}
        </>
      );
    }

    // No loading skeleton - this app is designed for lightning-fast static data loading
    // If no PRs are available, show empty state message
    if (isClient && !loading) {
      return (
        <div className="px-4 py-12 text-center">
          <span className="text-sm text-gray-400 light:text-gray-200 font-medium">
            No pull requests available after filtering
          </span>
        </div>
      );
    }

    // Only show loading during actual loading (very brief for static data)
    return loading ? <LoadingRows /> : null;
  };

  return (
    <div className={`w-full p-4 max-sm:px-1 max-sm:py-2 ${className}`} data-testid="pull-request-feed" style={{ fontFamily: '"IBM Plex Serif", serif' }}>
      {/* Table Body - Dynamic content based on state */}
      <div>
        {renderTableBody()}
        
        {/* Infinite Scroll Trigger & Loading More Indicator */}
        {isClient && pullRequests.length > 0 && (
          <>
            {/* Intersection Observer trigger element */}
            <div 
              ref={infiniteScrollTriggerRef}
              className="w-full h-4"
              aria-hidden="true"
            />
            
            {/* Loading more indicator -- currently empty as we predict expectionally fast speeds */}
            {isLoadingMore && (
              <div className="px-4 py-6 text-center">
                <div className="inline-flex items-center space-x-2 text-gray-400 light:text-gray-600">
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default PullRequestList; 