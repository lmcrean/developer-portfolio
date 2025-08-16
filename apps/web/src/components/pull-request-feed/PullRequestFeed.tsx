import React, { useEffect, useCallback, useRef, useMemo } from 'react';
import { PullRequestFeedProps, PullRequestListData } from '@shared/types/pull-requests';
import { usePullRequestState } from './hooks/usePullRequestState';
import { usePullRequestApi } from './hooks/usePullRequestApi';
import PullRequestList from './components/PullRequestList';
import { applyManualOverrides, HIDDEN_REPOSITORIES, LIMITED_REPOSITORIES } from './config/manual-overrides';

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

  // Filter pull requests based on custom rules
  const filteredPullRequests = useMemo(() => {
    const displayedPRs = state.allPullRequests.slice(0, state.displayedCount);
    
    console.log(`🔍 [FILTER DEBUG] Starting filter with ${displayedPRs.length} PRs, displayedCount: ${state.displayedCount}`);
    console.log(`🔍 [FILTER DEBUG] Username for filtering: "${username}"`);
    
    // Apply custom filtering
    let filtered = displayedPRs.filter((pr, index) => {
      const repoName = pr.repository.name;
      const ownerLogin = pr.repository.owner.login;
      
      // Hide completely blacklisted repositories from config
      if (HIDDEN_REPOSITORIES.includes(repoName)) {
        console.log(`🚫 [FILTER DEBUG] PR ${index}: HIDDEN - ${ownerLogin}/${repoName}`);
        return false;
      }
      
      // Show only external repositories (not user's own repos)
      const isExternal = ownerLogin !== username;
      console.log(`${isExternal ? '✅' : '❌'} [FILTER DEBUG] PR ${index}: ${ownerLogin}/${repoName} - ${isExternal ? 'EXTERNAL (keep)' : 'OWN REPO (filter out)'}`);
      return isExternal;
    });
    
    console.log(`🔍 [FILTER DEBUG] After basic filtering: ${filtered.length} PRs remaining`);
    
    // Apply special filtering for limited repositories
    Object.entries(LIMITED_REPOSITORIES).forEach(([repoName, filterType]) => {
      if (filterType === 'keep-latest-only') {
        const repoPRs = filtered.filter(pr => pr.repository.name === repoName);
        if (repoPRs.length > 1) {
          // Sort by created_at date (most recent first) and keep only the first one
          const mostRecentPR = repoPRs.sort((a, b) => 
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          )[0];
          
          // Remove all PRs from this repo and add back only the most recent one
          filtered = filtered.filter(pr => pr.repository.name !== repoName);
          filtered.push(mostRecentPR);
        }
      }
    });
    
    // Apply manual overrides to fix incorrect data
    const filteredWithOverrides = filtered.map(pr => applyManualOverrides(pr));
    
    console.log(`🔍 [FILTER DEBUG] Final result: ${filteredWithOverrides.length} PRs after all filtering`);
    if (filteredWithOverrides.length === 0) {
      console.log(`❌ [FILTER DEBUG] NO PRs REMAINING! This will cause loading skeleton to show.`);
    }
    
    return filteredWithOverrides;
  }, [state.allPullRequests, state.displayedCount, username]);

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
    />
  );
};

export default PullRequestFeed; 