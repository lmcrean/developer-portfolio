import { useCallback, useRef, useMemo } from 'react';
import apiClient from '../../api/Core';
import {
  PullRequestListData,
  PaginationMeta,
  ApiResponse
} from '@shared/types/pull-requests';

interface UsePullRequestApiProps {
  username: string;
  onListSuccess: (data: PullRequestListData[], pagination: PaginationMeta) => void;
  onListError: (error: string) => void;
  setLoading: (loading: boolean) => void;
}

export const usePullRequestApi = ({
  username,
  onListSuccess,
  onListError,
  setLoading
}: UsePullRequestApiProps) => {
  // Refs for request cancellation
  const listAbortControllerRef = useRef<AbortController | null>(null);
  const isMountedRef = useRef(true);

  // Fetch pull requests list with proper cancellation
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
      
      const response = await apiClient.get<ApiResponse>(
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

      // Only update state if component is still mounted
      if (isMountedRef.current && !listAbortControllerRef.current.signal.aborted) {
        console.log(`✅ Successfully fetched ${response.data.data.length} pull requests`);
        onListSuccess(response.data.data, response.data.meta.pagination);
      }
    } catch (err: any) {
      // Only handle errors if component is still mounted and request wasn't cancelled
      if (isMountedRef.current && err.name !== 'AbortError' && err.name !== 'CanceledError') {
        console.error('❌ Request Failed:', err.config?.url || 'Unknown URL');
        onListError(err.message || 'Failed to load pull requests.');
      }
    } finally {
      // Only update loading state if component is still mounted
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, [username, onListSuccess, onListError, setLoading]);


  // Cleanup function
  const cleanup = useCallback(() => {
    console.log('🧹 API hook cleaning up requests...');
    
    // Mark component as unmounted
    isMountedRef.current = false;
    
    // Cancel any in-flight requests
    if (listAbortControllerRef.current) {
      listAbortControllerRef.current.abort();
    }
  }, []);

  // Reset mounted flag
  const resetMountedFlag = useCallback(() => {
    isMountedRef.current = true;
  }, []);

  // Memoize the return object to prevent unnecessary re-renders
  return useMemo(() => ({
    fetchPullRequests,
    cleanup,
    resetMountedFlag
  }), [fetchPullRequests, cleanup, resetMountedFlag]);
}; 