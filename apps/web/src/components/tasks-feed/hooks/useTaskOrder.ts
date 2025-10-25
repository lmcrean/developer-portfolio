import { useState, useEffect, useCallback } from 'react';
import { PullRequestListData } from '@shared/types/pull-requests';

const STORAGE_KEY = 'tasks_pr_order';

interface PROrderMap {
  [prId: number]: number; // PR ID -> order index
}

/**
 * Hook for managing PR order in localStorage
 */
export const useTaskOrder = () => {
  const [orderMap, setOrderMap] = useState<PROrderMap>({});
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setOrderMap(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Failed to load PR order from localStorage:', error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save to localStorage
  const saveOrder = useCallback((newOrderMap: PROrderMap) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newOrderMap));
      setOrderMap(newOrderMap);
    } catch (error) {
      console.error('Failed to save PR order:', error);
    }
  }, []);

  // Sort PRs by custom order
  const sortPRsByOrder = useCallback((prs: PullRequestListData[]): PullRequestListData[] => {
    return [...prs].sort((a, b) => {
      const orderA = orderMap[a.id] ?? Number.MAX_SAFE_INTEGER;
      const orderB = orderMap[b.id] ?? Number.MAX_SAFE_INTEGER;

      // If neither has a custom order, maintain original order
      if (orderA === Number.MAX_SAFE_INTEGER && orderB === Number.MAX_SAFE_INTEGER) {
        return 0;
      }

      return orderA - orderB;
    });
  }, [orderMap]);

  // Update order after drag and drop
  const updateOrder = useCallback((prs: PullRequestListData[]) => {
    const newOrderMap: PROrderMap = {};
    prs.forEach((pr, index) => {
      newOrderMap[pr.id] = index;
    });
    saveOrder(newOrderMap);
  }, [saveOrder]);

  // Reset order (clear all custom ordering)
  const resetOrder = useCallback(() => {
    saveOrder({});
  }, [saveOrder]);

  return {
    isLoaded,
    sortPRsByOrder,
    updateOrder,
    resetOrder
  };
};
