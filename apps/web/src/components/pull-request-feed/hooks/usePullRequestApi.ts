import { useCallback, useRef, useMemo } from 'react';
import apiClient from '../../api/Core';
import staticClient from '../../api/client/staticClient';
import {
  PullRequestListData,
  PaginationMeta,
  ApiResponse
} from '@shared/types/pull-requests';

interface UsePullRequestApiProps {
  username: string;
  onListSuccess: (data: PullRequestListData[], pagination: PaginationMeta, isAppending?: boolean) => void;
  onListError: (error: string) => void;
  setLoading: (loading: boolean) => void;
  setIsLoadingMore: (loading: boolean) => void;
  useStaticMode?: boolean; // Optional flag to force static mode
}

export const usePullRequestApi = ({
  username,
  onListSuccess,
  onListError,
  setLoading,
  setIsLoadingMore,
  useStaticMode = false
}: UsePullRequestApiProps) => {
  // Refs for request cancellation and pagination tracking
  const listAbortControllerRef = useRef<AbortController | null>(null);
  const isMountedRef = useRef(true);
  const currentPageRef = useRef(1);
  const hasMorePagesRef = useRef(true);

  // Determine whether to use static or live API
  const shouldUseStatic = useCallback(async (): Promise<boolean> => {
    // If explicitly forced to use static mode
    if (useStaticMode) {
      console.log('🔧 Static mode forced via props');
      return true;
    }

    // Check if static data is available and fresh
    try {
      const isAvailable = await staticClient.isStaticDataAvailable();
      console.log(`📁 Static data available: ${isAvailable}`);
      return isAvailable;
    } catch (error) {
      console.log('⚠️ Static data check failed, falling back to live API');
      return false;
    }
  }, [useStaticMode]);

  // Fetch pull requests list with static/live API selection
  const fetchPullRequests = useCallback(async (page: number = 1) => {
    try {
      // Cancel any existing request
      if (listAbortControllerRef.current) {
        listAbortControllerRef.current.abort();
      }

      // Create new abort controller
      listAbortControllerRef.current = new AbortController();

      setLoading(true);
      onListError('');
      
      console.log(`🔄 Fetching pull requests page ${page} for ${username}...`);
      
      // Determine which client to use
      const useStatic = await shouldUseStatic();
      let response;

      if (useStatic) {
        console.log('📁 Using static data client');
        response = await staticClient.getPullRequests({
          username,
          page,
          per_page: 20
        });
      } else {
        console.log('🌐 Using live API client');
        response = await apiClient.get<ApiResponse>(
          '/api/github/pull-requests',
          {
            params: {
              username,
              page,
              per_page: 20
            },
            signal: listAbortControllerRef.current.signal
          }
        );
      }

      // Only update state if component is still mounted
      if (isMountedRef.current && !listAbortControllerRef.current.signal.aborted) {
        const dataSource = useStatic ? 'static data' : 'live API';
        console.log(`✅ Successfully fetched ${response.data.data.length} pull requests from ${dataSource}`);
        
        // Update pagination refs
        currentPageRef.current = response.data.meta.pagination.page;
        hasMorePagesRef.current = response.data.meta.pagination.has_next_page;
        
        onListSuccess(response.data.data, response.data.meta.pagination, false);
      }
    } catch (err: any) {
      // Only handle errors if component is still mounted and request wasn't cancelled
      if (isMountedRef.current && err.name !== 'AbortError' && err.name !== 'CanceledError') {
        console.error('❌ Request Failed:', err.config?.url || err.message || 'Unknown error');
        onListError(err.message || 'Failed to load pull requests.');
      }
    } finally {
      // Only update loading state if component is still mounted
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, [username, onListSuccess, onListError, setLoading, shouldUseStatic]);

  // Fetch more pull requests for infinite scroll
  const fetchMorePullRequests = useCallback(async () => {
    if (!hasMorePagesRef.current) {
      console.log('🚫 No more pages available');
      return false;
    }

    try {
      setIsLoadingMore(true);
      const nextPage = currentPageRef.current + 1;
      
      console.log(`🔄 Fetching more pull requests page ${nextPage} for ${username}...`);
      
      // Determine which client to use
      const useStatic = await shouldUseStatic();
      let response;

      if (useStatic) {
        console.log('📁 Using static data client for more items');
        response = await staticClient.getPullRequests({
          username,
          page: nextPage,
          per_page: 20
        });
      } else {
        console.log('🌐 Using live API client for more items');
        response = await apiClient.get<ApiResponse>(
          '/api/github/pull-requests',
          {
            params: {
              username,
              page: nextPage,
              per_page: 20
            }
          }
        );
      }

      // Only update state if component is still mounted
      if (isMountedRef.current) {
        const dataSource = useStatic ? 'static data' : 'live API';
        console.log(`✅ Successfully fetched ${response.data.data.length} more pull requests from ${dataSource}`);
        
        // Update pagination refs
        currentPageRef.current = response.data.meta.pagination.page;
        hasMorePagesRef.current = response.data.meta.pagination.has_next_page;
        
        onListSuccess(response.data.data, response.data.meta.pagination, true);
        return true;
      }
      
      return false;
    } catch (err: any) {
      // Only handle errors if component is still mounted
      if (isMountedRef.current) {
        console.error('❌ Failed to fetch more pull requests:', err.message || 'Unknown error');
        onListError(`Failed to load more pull requests: ${err.message || 'Unknown error'}`);
      }
      return false;
    } finally {
      // Only update loading state if component is still mounted
      if (isMountedRef.current) {
        setIsLoadingMore(false);
      }
    }
  }, [username, onListSuccess, onListError, setIsLoadingMore, shouldUseStatic]);


  // Cleanup function
  const cleanup = useCallback(() => {
    console.log('🧹 API hook cleaning up requests...');
    
    // Mark component as unmounted
    isMountedRef.current = false;
    
    // Cancel any in-flight requests
    if (listAbortControllerRef.current) {
      listAbortControllerRef.current.abort();
    }
    
    // Reset pagination refs
    currentPageRef.current = 1;
    hasMorePagesRef.current = true;
  }, []);

  // Reset mounted flag and pagination refs
  const resetMountedFlag = useCallback(() => {
    isMountedRef.current = true;
    currentPageRef.current = 1;
    hasMorePagesRef.current = true;
  }, []);

  // Memoize the return object to prevent unnecessary re-renders
  return useMemo(() => ({
    fetchPullRequests,
    fetchMorePullRequests,
    cleanup,
    resetMountedFlag
  }), [fetchPullRequests, fetchMorePullRequests, cleanup, resetMountedFlag]);
}; 