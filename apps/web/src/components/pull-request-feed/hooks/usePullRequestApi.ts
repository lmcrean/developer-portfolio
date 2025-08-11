import { useCallback, useRef, useMemo } from 'react';
import apiClient from '../../api/Core';
import {
  PullRequestListData,
  DetailedPullRequestData,
  PaginationMeta,
  ApiResponse,
  DetailedPullRequestApiResponse
} from '@shared/types/pull-requests';
import { parseOwnerAndRepo } from '@shared/types/pull-requests/utilities';

interface UsePullRequestApiProps {
  username: string;
  onListSuccess: (data: PullRequestListData[], pagination: PaginationMeta) => void;
  onListError: (error: string) => void;
  onDetailSuccess: (data: DetailedPullRequestData) => void;
  onDetailError: (error: string) => void;
  setLoading: (loading: boolean) => void;
  setModalLoading: (loading: boolean) => void;
}

export const usePullRequestApi = ({
  username,
  onListSuccess,
  onListError,
  onDetailSuccess,
  onDetailError,
  setLoading,
  setModalLoading
}: UsePullRequestApiProps) => {
  // Refs for request cancellation
  const listAbortControllerRef = useRef<AbortController | null>(null);
  const detailAbortControllerRef = useRef<AbortController | null>(null);
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

  // Handle card click - fetch PR details
  const fetchPullRequestDetails = useCallback(async (pr: PullRequestListData) => {
    setModalLoading(true);
    onDetailError('');
    
    try {
      // Cancel any existing detail request
      if (detailAbortControllerRef.current) {
        detailAbortControllerRef.current.abort();
      }

      // Create new abort controller
      detailAbortControllerRef.current = new AbortController();

      // Extract owner and repo from HTML URL
      const { owner, repo } = parseOwnerAndRepo(pr.html_url);
      
      console.log(`🔄 Fetching details for PR #${pr.number} from ${owner}/${repo}...`);
      
      const response = await apiClient.get<DetailedPullRequestApiResponse>(
        `/api/github/pull-requests/${owner}/${repo}/${pr.number}`,
        {
          signal: detailAbortControllerRef.current.signal
        }
      );

      // Only update state if component is still mounted
      if (isMountedRef.current && !detailAbortControllerRef.current.signal.aborted) {
        const prData = response.data.data;
        
        console.log(`✅ Successfully fetched details for PR #${pr.number}`);
        
        // Ensure all required fields are present
        if (prData && prData.title && prData.author) {
          onDetailSuccess(prData);
        } else {
          console.error('❌ Incomplete PR data received:', prData);
          onDetailError('Incomplete pull request data received from server.');
        }
      }
    } catch (err: any) {
      // Only handle errors if component is still mounted and request wasn't cancelled
      if (isMountedRef.current && err.name !== 'AbortError' && err.name !== 'CanceledError') {
        console.error('Error fetching PR details:', err);
        onDetailError(err.message || 'Failed to load pull request details.');
      }
    } finally {
      // Only update loading state if component is still mounted
      if (isMountedRef.current) {
        setModalLoading(false);
      }
    }
  }, [onDetailSuccess, onDetailError, setModalLoading]);

  // Cleanup function
  const cleanup = useCallback(() => {
    console.log('🧹 API hook cleaning up requests...');
    
    // Mark component as unmounted
    isMountedRef.current = false;
    
    // Cancel any in-flight requests
    if (listAbortControllerRef.current) {
      listAbortControllerRef.current.abort();
    }
    
    if (detailAbortControllerRef.current) {
      detailAbortControllerRef.current.abort();
    }
  }, []);

  // Reset mounted flag
  const resetMountedFlag = useCallback(() => {
    isMountedRef.current = true;
  }, []);

  // Memoize the return object to prevent unnecessary re-renders
  return useMemo(() => ({
    fetchPullRequests,
    fetchPullRequestDetails,
    cleanup,
    resetMountedFlag
  }), [fetchPullRequests, fetchPullRequestDetails, cleanup, resetMountedFlag]);
}; 