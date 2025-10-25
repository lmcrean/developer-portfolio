import React, { useEffect, useCallback, useRef, useMemo } from 'react';
import { PullRequestFeedProps, PullRequestListData } from '@shared/types/pull-requests';
import { usePullRequestState } from '../pull-request-feed/hooks/usePullRequestState';
import { usePullRequestApi } from '../pull-request-feed/hooks/usePullRequestApi';
import TasksList from './components/TasksList';

/**
 * TasksFeed - Displays only OPEN pull requests for task management
 * Reuses PullRequestFeed logic but filters for state === 'open'
 */
export const TasksFeed: React.FC<PullRequestFeedProps> = ({
  username = 'lmcrean',
  className = ''
}) => {
  // Reuse existing hooks from PullRequestFeed
  const state = usePullRequestState();

  const api = usePullRequestApi({
    username,
    onListSuccess: state.handleListSuccess,
    onListError: state.handleListError,
    setLoading: state.setLoading,
    setIsLoadingMore: state.setIsLoadingMore
  });

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
    api.fetchPullRequests(1);
  }, [api, state]);

  // Hydration-safe effect to detect client-side rendering
  useEffect(() => {
    state.setIsClient(true);
  }, [state]);

  // Initial load with proper cleanup
  useEffect(() => {
    if (!state.isClient || initialFetchRef.current) return;

    initialFetchRef.current = true;
    api.resetMountedFlag();
    api.fetchPullRequests();

    return () => {
      api.cleanup();
    };
  }, [state.isClient]);

  // Cleanup on unmount and username change
  useEffect(() => {
    return () => {
      api.cleanup();
    };
  }, [username, api.cleanup]);

  // Filter for ONLY open PRs (not merged, state === 'open')
  const openPullRequests = useMemo(() => {
    return state.allPullRequests.filter(pr =>
      pr.state === 'open' && !pr.merged_at
    );
  }, [state.allPullRequests]);

  // Apply display limit to filtered open PRs
  const displayedPullRequests = openPullRequests.slice(0, state.displayedCount);

  console.log('📊 TasksFeed rendering:', {
    totalPRs: state.allPullRequests.length,
    openPRs: openPullRequests.length,
    displayed: displayedPullRequests.length
  });

  return (
    <TasksList
      pullRequests={displayedPullRequests}
      hasMoreItems={displayedPullRequests.length < openPullRequests.length || state.hasMoreItems}
      isLoadingMore={state.isLoadingMore}
      username={username}
      className={className}
      loading={state.loading}
      error={state.error}
      isClient={state.isClient}
      onCardClick={handleCardClick}
      onRetry={handleRetry}
      onLoadMore={handleLoadMore}
    />
  );
};

export default TasksFeed;
