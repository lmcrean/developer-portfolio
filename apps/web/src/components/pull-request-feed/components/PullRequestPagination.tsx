import React from 'react';
import { PaginationMeta } from '@shared/types/pull-requests';

interface PullRequestPaginationProps {
  pagination: PaginationMeta | null;
  currentPage: number;
  loading: boolean;
  onPageChange: (page: number) => void;
}

export const PullRequestPagination: React.FC<PullRequestPaginationProps> = ({
  pagination,
  currentPage,
  loading,
  onPageChange
}) => {
  if (!pagination || pagination.total_pages <= 1) {
    return null;
  }

  return (
    <>
      {/* Pagination */}
      <div className="flex items-center justify-between bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
        <button
          className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!pagination.has_previous_page || loading}
        >
          <span>←</span>
          <span>Previous</span>
        </button>
        
        <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
          Page {currentPage} of {pagination.total_pages}
        </div>
        
        <button
          className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!pagination.has_next_page || loading}
        >
          <span>Next</span>
          <span>→</span>
        </button>
      </div>

      {/* Loading indicator for pagination */}
      {loading && (
        <div className="text-center py-4">
          <div className="inline-flex items-center space-x-2 text-gray-600 dark:text-gray-400">
            <div className="animate-spin w-4 h-4 border-2 border-blue-600 dark:border-blue-500 border-t-transparent rounded-full"></div>
            <span>Loading...</span>
          </div>
        </div>
      )}
    </>
  );
};

export default PullRequestPagination; 