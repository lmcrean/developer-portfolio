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
  
  // Animation state - track which items are newly added for fade-in animation
  const [animatingItems, setAnimatingItems] = useState<Set<number>>(new Set());
  const [previousPullRequestCount, setPreviousPullRequestCount] = useState(0);

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

  // Detect newly added items and trigger fade-in animation
  useEffect(() => {
    if (!isClient) return;

    const currentCount = pullRequests.length;

    // Skip animation for initial load (when previousPullRequestCount is 0)
    const isInitialLoad = previousPullRequestCount === 0;

    if (currentCount > previousPullRequestCount) {
      // Only animate if this is NOT the initial load
      if (!isInitialLoad) {
        // New items added after initial load - mark them for animation
        const newItemIds = new Set<number>();
        for (let i = previousPullRequestCount; i < currentCount; i++) {
          if (pullRequests[i]) {
            newItemIds.add(pullRequests[i].id);
          }
        }

        setAnimatingItems(newItemIds);

        // Remove animation classes after animation completes
        const timer = setTimeout(() => {
          setAnimatingItems(new Set());
        }, 800); // Match animation duration

        setPreviousPullRequestCount(currentCount);

        return () => clearTimeout(timer);
      } else {
        // Initial load - just update the count without animation
        setPreviousPullRequestCount(currentCount);
      }
    } else if (currentCount < previousPullRequestCount) {
      // Items were removed (filter change, etc.)
      setPreviousPullRequestCount(currentCount);
      setAnimatingItems(new Set());
    }
  }, [pullRequests.length, previousPullRequestCount, isClient, pullRequests]);

  // Split pull requests into merged and open
  const mergedPRs = pullRequests.filter(pr => pr.merged_at);
  const openPRs = pullRequests.filter(pr => !pr.merged_at && pr.state === 'open');

  // Helper function to render PR cards
  const renderPRCards = (prs: PullRequestListData[], hoverBgColor: 'teal' | 'orange' = 'teal') => {
    return prs.map((pr, index) => {
      const isAnimating = animatingItems.has(pr.id);
      const animationDelay = isAnimating ? (index - previousPullRequestCount) * 0.1 : 0;
      
      return (
        <div
          key={pr.id}
          className={`${
            isAnimating 
              ? 'pr-fade-in animate-fade-in' 
              : 'opacity-100'
          }`}
          style={{
            animationDelay: isAnimating ? `${animationDelay}s` : undefined,
          }}
        >
          <PullRequestFeedListCard
            pullRequest={pr}
            onClick={() => onCardClick(pr)}
            hoverBgColor={hoverBgColor}
          />
        </div>
      );
    });
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
                  Enterprise Solutions
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
      {/* CSS for fade-in animation */}
      <style dangerouslySetInnerHTML={{__html: `
        .pr-fade-in {
          opacity: 0;
          transform: translateY(20px);
        }
        
        .animate-fade-in {
          animation: pr-fade-in 0.6s ease-out forwards;
        }
        
        @keyframes pr-fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}} />

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
            
            {/* End of list message */}
            {!hasMoreItems && !isLoadingMore && (
              <div className="px-4 py-6 text-center">
                <a 
                  href="https://github.com/lmcrean" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm font-medium hover:underline"
                  style={{ color: '#9ca3af' }}
                >
                  View all Activity on Github
                </a>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default PullRequestList; 