import React, { useEffect, useCallback, useRef, useMemo } from 'react';
import { PullRequestFeedProps, PullRequestListData } from '@shared/types/pull-requests';
import { usePullRequestState } from './hooks/usePullRequestState';
import { usePullRequestApi } from './hooks/usePullRequestApi';
import PullRequestList from './components/PullRequestList';
import PullRequestPagination from './components/PullRequestPagination';

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
    setLoading: state.setLoading
  });

  // Track if initial fetch has been performed
  const initialFetchRef = useRef(false);

  // Handle card click to open GitHub PR in new tab
  const handleCardClick = useCallback((pr: PullRequestListData) => {
    if (pr.html_url) {
      window.open(pr.html_url, '_blank', 'noopener,noreferrer');
    }
  }, []);

  // Handle pagination
  const handlePageChange = useCallback((newPage: number) => {
    const validPage = state.handlePageChange(newPage);
    if (validPage) {
      api.fetchPullRequests(validPage);
    }
  }, [state, api]);

  // Retry function
  const handleRetry = useCallback(() => {
    state.clearError();
    api.fetchPullRequests(state.currentPage);
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
    if (!state.enterpriseMode) {
      return state.pullRequests; // Show all PRs when enterprise mode is off
    }
    // Show only PRs to external repositories (not user's own repos)
    return state.pullRequests.filter(pr => pr.repository.owner.login !== username);
  }, [state.pullRequests, state.enterpriseMode, username]);

  return (
    <>
      <PullRequestList
        pullRequests={filteredPullRequests}
        pagination={state.pagination}
        username={username}
        className={className}
        loading={state.loading}
        error={state.error}
        isClient={state.isClient}
        onCardClick={handleCardClick}
        onRetry={handleRetry}
        enterpriseMode={state.enterpriseMode}
        onEnterpriseToggle={state.setEnterpriseMode}
      />

      <PullRequestPagination
        pagination={state.pagination}
        currentPage={state.currentPage}
        loading={state.loading}
        onPageChange={handlePageChange}
      />

    </>
  );
};

export default PullRequestFeed; 