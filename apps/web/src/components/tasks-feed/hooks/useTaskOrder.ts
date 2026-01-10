import { useState, useEffect, useCallback } from 'react';
import { PullRequestListData } from '@shared/types/pull-requests';
import { prOrderApi } from '../api/tasks-api';
import { useDatabaseStatus } from '../context/DatabaseStatusContext';

const STORAGE_KEY = 'tasks_pr_order';
const STORAGE_KEY_MIGRATION = 'tasks_order_migrated';

interface PROrderMap {
  [prId: number]: number; // PR ID -> order index
}

/**
 * Hook for managing PR order with API backend
 * Migrates data from localStorage to SQL on first load
 */
export const useTaskOrder = () => {
  const [orderMap, setOrderMap] = useState<PROrderMap>({});
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get save status callbacks from context
  const { markSaving, markSaved, markError } = useDatabaseStatus();

  // Migrate localStorage data to API
  const migrateLocalStorageToAPI = useCallback(async () => {
    try {
      // Check if already migrated
      if (localStorage.getItem(STORAGE_KEY_MIGRATION)) {
        return false; // Already migrated
      }

      const stored = localStorage.getItem(STORAGE_KEY);

      if (stored) {
        const localOrderMap: PROrderMap = JSON.parse(stored);

        // Convert to API format
        const orders = Object.entries(localOrderMap).map(([prId, displayOrder]) => ({
          prId: parseInt(prId, 10),
          displayOrder,
        }));

        // Bulk upload to API
        if (orders.length > 0) {
          await prOrderApi.bulkUpdate(orders);

          // Mark migration as complete
          localStorage.setItem(STORAGE_KEY_MIGRATION, 'true');
          console.log('✓ Successfully migrated PR order from localStorage to API');
          return true;
        }
      }

      return false;
    } catch (error) {
      console.error('Failed to migrate localStorage data:', error);
      return false;
    }
  }, []);

  // Load from API on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        // First, try to migrate any existing localStorage data
        await migrateLocalStorageToAPI();

        // Then load from API
        const orders = await prOrderApi.getAll();

        // Convert to order map
        const newOrderMap: PROrderMap = {};
        orders.forEach(order => {
          newOrderMap[order.prId] = order.displayOrder;
        });

        setOrderMap(newOrderMap);
      } catch (err) {
        console.error('Failed to load PR order from API:', err);
        setError('Failed to load PR order. Using fallback data.');

        // Fallback to localStorage if API fails
        try {
          const stored = localStorage.getItem(STORAGE_KEY);
          if (stored) {
            setOrderMap(JSON.parse(stored));
          }
        } catch (localErr) {
          console.error('Failed to load from localStorage:', localErr);
        }
      } finally {
        setIsLoaded(true);
      }
    };

    loadData();
  }, [migrateLocalStorageToAPI]);

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
  const updateOrder = useCallback(async (prs: PullRequestListData[]) => {
    markSaving();
    try {
      const newOrderMap: PROrderMap = {};
      prs.forEach((pr, index) => {
        newOrderMap[pr.id] = index;
      });

      // Convert to API format
      const orders = Object.entries(newOrderMap).map(([prId, displayOrder]) => ({
        prId: parseInt(prId, 10),
        displayOrder,
      }));

      // Bulk update via API
      await prOrderApi.bulkUpdate(orders);
      setOrderMap(newOrderMap);
      setError(null);
      markSaved();
    } catch (err) {
      console.error('Failed to update PR order:', err);
      setError('Failed to update PR order');
      markError('Failed to update order');
      throw err;
    }
  }, [markSaving, markSaved, markError]);

  // Reset order (clear all custom ordering)
  const resetOrder = useCallback(async () => {
    markSaving();
    try {
      await prOrderApi.bulkUpdate([]);
      setOrderMap({});
      setError(null);
      markSaved();
    } catch (err) {
      console.error('Failed to reset PR order:', err);
      setError('Failed to reset PR order');
      markError('Failed to reset order');
      throw err;
    }
  }, [markSaving, markSaved, markError]);

  return {
    isLoaded,
    error,
    sortPRsByOrder,
    updateOrder,
    resetOrder
  };
};
