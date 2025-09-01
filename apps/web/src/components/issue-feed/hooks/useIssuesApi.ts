import { useState, useEffect, useCallback } from 'react';
import { IssuesApiResponse } from '@shared/types/issues';
import staticClient from '../../api/client/staticClient';

interface UseIssuesApiOptions {
  username: string;
}

export const useIssuesApi = (options: UseIssuesApiOptions) => {
  const [data, setData] = useState<IssuesApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchIssues = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Try static data first
      const staticData = await staticClient.getIssues();
      
      if (staticData) {
        setData(staticData);
      } else {
        // Fallback to live API - always fetch external repos
        const apiUrl = process.env.REACT_APP_API_BASE_URL || 
                      process.env.DOCUSAURUS_API_BASE_URL || 
                      'http://localhost:3000';
        
        const response = await fetch(
          `${apiUrl}/api/issues/grouped?username=${options.username}&external=true`
        );
        
        if (!response.ok) throw new Error('Failed to fetch issues');
        
        const apiData = await response.json();
        setData(apiData);
      }
    } catch (err: any) {
      console.error('Error fetching issues:', err);
      setError(err.message || 'Failed to load issues');
    } finally {
      setLoading(false);
    }
  }, [options.username]);

  useEffect(() => {
    fetchIssues();
  }, [fetchIssues]);

  return {
    data,
    loading,
    error,
    refetch: fetchIssues
  };
};