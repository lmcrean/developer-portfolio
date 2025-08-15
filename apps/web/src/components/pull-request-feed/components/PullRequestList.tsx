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
    if (currentCount > previousPullRequestCount) {
      // New items added - mark them for animation
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
    } else if (currentCount < previousPullRequestCount) {
      // Items were removed (filter change, etc.)
      setPreviousPullRequestCount(currentCount);
      setAnimatingItems(new Set());
    }
  }, [pullRequests.length, previousPullRequestCount, isClient, pullRequests]);

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
          {pullRequests.map((pr, index) => {
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
                />
              </div>
            );
          })}
        </>
      );
    }

    // Fallback to loading state
    return <LoadingRows />;
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

      {/* Table Header - Always visible */}
      <div className="grid gap-4 max-sm:gap-2 px-4 max-sm:px-1 py-3 text-sm font-semibold pr-text-header border-b border-gray-700 light:border-gray-200">
        Enterprise Solutions
      </div>

      {/* Table Body - Dynamic content based on state */}
      <div className="divide-y divide-gray-700 light:divide-gray-200" style={{ borderTop: 'none' }}>
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
            
            {/* Loading more indicator */}
            {isLoadingMore && (
              <div className="px-4 py-6 text-center">
                <div className="inline-flex items-center space-x-2 text-gray-400 light:text-gray-600">
                  <div className="animate-spin w-4 h-4 border-2 border-blue-500 light:border-blue-600 border-t-transparent rounded-full"></div>
                  <span className="text-sm font-medium">Loading more pull requests...</span>
                </div>
              </div>
            )}
            
            {/* End of list message */}
            {!hasMoreItems && !isLoadingMore && (
              <div className="px-4 py-6 text-center">
                <span className="text-sm text-gray-400 light:text-gray-200 font-medium">
                  Visit Github for more
                </span>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default PullRequestList; 