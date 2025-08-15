import React, { useEffect, useCallback, useRef, useMemo } from 'react';
import { PullRequestFeedProps, PullRequestListData } from '@shared/types/pull-requests';
import { usePullRequestState } from './hooks/usePullRequestState';
import { usePullRequestApi } from './hooks/usePullRequestApi';
import PullRequestList from './components/PullRequestList';

export const PullRequestFeed: React.FC<PullRequestFeedProps> = ({
  username = 'lmcrean',
  className = ''
}) => {
  // Use custom hooks for state and API management
  const state = usePullRequestState();
  
  const api = usePullRequestApi({
    username,
    onListSuccess: state.handleListSuccess,
    onListError: state.handleListError,
    setLoading: state.setLoading,
    setIsLoadingMore: state.setIsLoadingMore
  });

  // Track if initial fetch has been performed
  const initialFetchRef = useRef(false);

  // Handle card click to open GitHub PR in new tab
  const handleCardClick = useCallback((pr: PullRequestListData) => {
    if (pr.html_url) {
      window.open(pr.html_url, '_blank', 'noopener,noreferrer');
    }
  }, []);

  // Handle loading more items for infinite scroll
  const handleLoadMore = useCallback(async () => {
    console.log('🔄 handleLoadMore called');
    
    // First try to load more from existing data
    const newDisplayedCount = state.loadMoreItems();
    
    // Check if we need to fetch more data from API
    if (state.shouldFetchMoreData()) {
      console.log('📡 Fetching more data from API...');
      await api.fetchMorePullRequests();
    }
  }, [state, api]);

  // Retry function
  const handleRetry = useCallback(() => {
    state.clearError();
    api.fetchPullRequests(1); // Always retry from first page
  }, [api, state]);

  // Hydration-safe effect to detect client-side rendering
  useEffect(() => {
    state.setIsClient(true);
  }, [state]);

  // Initial load with proper cleanup - only run once on client side
  useEffect(() => {
    if (!state.isClient || initialFetchRef.current) return;
    
    // Mark that initial fetch is starting
    initialFetchRef.current = true;
    
    // Reset mounted flag on mount
    api.resetMountedFlag();
    
    // Fetch initial data
    api.fetchPullRequests();

    // Cleanup function
    return () => {
      api.cleanup();
    };
  }, [state.isClient]); // Only depend on isClient

  // Cleanup on unmount and username change
  useEffect(() => {
    return () => {
      api.cleanup();
    };
  }, [username, api.cleanup]); // Only depend on username and cleanup function

  // Filter pull requests based on enterprise mode
  const filteredPullRequests = useMemo(() => {
    const displayedPRs = state.allPullRequests.slice(0, state.displayedCount);
    if (!state.enterpriseMode) {
      return displayedPRs; // Show all displayed PRs when enterprise mode is off
    }
    // Show only PRs to external repositories (not user's own repos)
    return displayedPRs.filter(pr => pr.repository.owner.login !== username);
  }, [state.allPullRequests, state.displayedCount, state.enterpriseMode, username]);

  return (
    <PullRequestList
      pullRequests={filteredPullRequests}
      hasMoreItems={state.hasMoreItems}
      isLoadingMore={state.isLoadingMore}
      username={username}
      className={className}
      loading={state.loading}
      error={state.error}
      isClient={state.isClient}
      onCardClick={handleCardClick}
      onRetry={handleRetry}
      onLoadMore={handleLoadMore}
      enterpriseMode={state.enterpriseMode}
      onEnterpriseToggle={state.setEnterpriseMode}
    />
  );
};

export default PullRequestFeed; 