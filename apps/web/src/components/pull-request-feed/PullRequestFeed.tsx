import React, { useEffect, useCallback, useRef } from 'react';
import { PullRequestFeedProps, PullRequestListData } from '@shared/types/pull-requests';
import { usePullRequestState } from './hooks/usePullRequestState';
import { usePullRequestApi } from './hooks/usePullRequestApi';
import LoadingErrorStates from './components/LoadingErrorStates';
import PullRequestList from './components/PullRequestList';
import PullRequestPagination from './components/PullRequestPagination';
import PullRequestFeedDetailCard from './detail-card';

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
    onDetailSuccess: state.handleDetailSuccess,
    onDetailError: state.handleDetailError,
    setLoading: state.setLoading,
    setModalLoading: state.setModalLoading
  });

  // Track if initial fetch has been performed
  const initialFetchRef = useRef(false);

  // Handle card click with API hook
  const handleCardClick = useCallback((pr: PullRequestListData) => {
    api.fetchPullRequestDetails(pr);
  }, [api]);

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

  // Show loading state during SSR and initial client load
  const shouldShowLoadingError = !state.isClient || 
    (state.loading && state.pullRequests.length === 0) || 
    (state.error && state.pullRequests.length === 0);

  if (shouldShowLoadingError) {
    return (
      <LoadingErrorStates
        loading={state.loading}
        error={state.error}
        pullRequestsLength={state.pullRequests.length}
        username={username}
        className={className}
        isClient={state.isClient}
        onRetry={handleRetry}
      />
    );
  }

  return (
    <>
      <PullRequestList
        pullRequests={state.pullRequests}
        pagination={state.pagination}
        username={username}
        className={className}
        onCardClick={handleCardClick}
      />

      <PullRequestPagination
        pagination={state.pagination}
        currentPage={state.currentPage}
        loading={state.loading}
        onPageChange={handlePageChange}
      />

      {/* Detail Modal */}
      <PullRequestFeedDetailCard
        pullRequest={state.selectedPR}
        isOpen={state.isModalOpen}
        onClose={state.handleModalClose}
        loading={state.modalLoading}
        error={state.modalError}
      />
    </>
  );
};

export default PullRequestFeed; 