import { useState, useCallback } from 'react';
import {
  PullRequestListData,
  PaginationMeta
} from '@shared/types/pull-requests';

export const usePullRequestState = () => {
  // SSR-safe hydration check
  const [isClient, setIsClient] = useState(false);
  
  // Infinite scroll state
  const [allPullRequests, setAllPullRequests] = useState<PullRequestListData[]>([]);
  const [displayedCount, setDisplayedCount] = useState(5); // Start by showing 5 items
  const [loading, setLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMoreItems, setHasMoreItems] = useState(true);
  const [totalItemsAvailable, setTotalItemsAvailable] = useState(0);
  
  

  // Handlers for list operations
  const handleListSuccess = useCallback((data: PullRequestListData[], paginationData: PaginationMeta, isAppending = false) => {
    console.log(`📊 handleListSuccess called: ${data.length} items, isAppending: ${isAppending}`);
    if (isAppending) {
      // Append new data to existing data
      setAllPullRequests(prev => [...prev, ...data]);
    } else {
      // Replace existing data (initial load)
      setAllPullRequests(data);
      setDisplayedCount(Math.min(5, data.length)); // Show first 5 items
    }
    setTotalItemsAvailable(paginationData.total_count);
    setHasMoreItems(paginationData.has_next_page || data.length > displayedCount);
    console.log(`📊 State updated: ${data.length} PRs, displayedCount: ${Math.min(5, data.length)}`);
  }, [displayedCount]);

  const handleListError = useCallback((errorMessage: string) => {
    setError(errorMessage);
  }, []);

  // Load more items (show 5 more from existing data)
  const loadMoreItems = useCallback(() => {
    const newDisplayedCount = displayedCount + 5;
    const maxItems = allPullRequests.length;
    
    setDisplayedCount(Math.min(newDisplayedCount, maxItems));
    
    // Update hasMoreItems based on whether we have more data or can fetch more pages
    const hasMoreDataLocally = newDisplayedCount < maxItems;
    const canFetchMore = allPullRequests.length < totalItemsAvailable;
    setHasMoreItems(hasMoreDataLocally || canFetchMore);
    
    return newDisplayedCount;
  }, [displayedCount, allPullRequests.length, totalItemsAvailable]);

  // Check if we need to fetch more data from API
  const shouldFetchMoreData = useCallback(() => {
    const remainingItems = allPullRequests.length - displayedCount;
    // Fetch more when we have less than 5 items remaining and there's more data available
    return remainingItems < 5 && allPullRequests.length < totalItemsAvailable;
  }, [allPullRequests.length, displayedCount, totalItemsAvailable]);

  // Get currently displayed pull requests
  const getDisplayedPullRequests = useCallback(() => {
    return allPullRequests.slice(0, displayedCount);
  }, [allPullRequests, displayedCount]);

  // Retry function
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // State
    isClient,
    allPullRequests,
    displayedCount,
    loading,
    isLoadingMore,
    error,
    hasMoreItems,
    totalItemsAvailable,

    // Setters
    setIsClient,
    setLoading,
    setIsLoadingMore,

    // Handlers
    handleListSuccess,
    handleListError,
    loadMoreItems,
    shouldFetchMoreData,
    getDisplayedPullRequests,
    clearError
  };
}; 