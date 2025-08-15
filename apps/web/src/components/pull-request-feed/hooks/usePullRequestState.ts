import { useState, useCallback } from 'react';
import {
  PullRequestListData,
  PaginationMeta
} from '@shared/types/pull-requests';

export const usePullRequestState = () => {
  // SSR-safe hydration check
  const [isClient, setIsClient] = useState(false);
  
  // List state
  const [pullRequests, setPullRequests] = useState<PullRequestListData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  
  // Filter state - Enterprise mode shows only external repos (default: true)
  const [enterpriseMode, setEnterpriseMode] = useState(true);
  

  // Handlers for list operations
  const handleListSuccess = useCallback((data: PullRequestListData[], paginationData: PaginationMeta) => {
    setPullRequests(data);
    setPagination(paginationData);
    setCurrentPage(paginationData.page);
  }, []);

  const handleListError = useCallback((errorMessage: string) => {
    setError(errorMessage);
  }, []);


  // Pagination
  const handlePageChange = useCallback((newPage: number) => {
    if (pagination && newPage >= 1 && newPage <= pagination.total_pages) {
      return newPage;
    }
    return null;
  }, [pagination]);

  // Retry function
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // State
    isClient,
    pullRequests,
    loading,
    error,
    pagination,
    currentPage,
    enterpriseMode,

    // Setters
    setIsClient,
    setLoading,
    setEnterpriseMode,

    // Handlers
    handleListSuccess,
    handleListError,
    handlePageChange,
    clearError
  };
}; 