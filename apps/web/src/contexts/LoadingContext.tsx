import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

interface LoadingContextType {
  isPullRequestsLoaded: boolean;
  isIssuesLoaded: boolean;
  isFullyLoaded: boolean;
  shouldShowOverlay: boolean;
  setPullRequestsLoaded: (loaded: boolean) => void;
  setIssuesLoaded: (loaded: boolean) => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const LoadingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isPullRequestsLoaded, setIsPullRequestsLoaded] = useState(false);
  const [isIssuesLoaded, setIsIssuesLoaded] = useState(false);
  const [isFullyLoaded, setIsFullyLoaded] = useState(false);
  const [shouldShowOverlay, setShouldShowOverlay] = useState(true);

  // Update fully loaded state when both feeds are done
  useEffect(() => {
    if (isPullRequestsLoaded && isIssuesLoaded && !isFullyLoaded) {
      console.log('✅ Both feeds loaded, starting fade out...');
      setIsFullyLoaded(true);

      // Hide overlay after fade-out animation completes (1 second)
      setTimeout(() => {
        setShouldShowOverlay(false);
        console.log('🎉 Loading overlay hidden');
      }, 500);
    }
  }, [isPullRequestsLoaded, isIssuesLoaded, isFullyLoaded]);

  const setPullRequestsLoaded = useCallback((loaded: boolean) => {
    console.log(`📊 Pull Requests loaded: ${loaded}`);
    setIsPullRequestsLoaded(loaded);
  }, []);

  const setIssuesLoaded = useCallback((loaded: boolean) => {
    console.log(`🎯 Issues loaded: ${loaded}`);
    setIsIssuesLoaded(loaded);
  }, []);

  return (
    <LoadingContext.Provider
      value={{
        isPullRequestsLoaded,
        isIssuesLoaded,
        isFullyLoaded,
        shouldShowOverlay,
        setPullRequestsLoaded,
        setIssuesLoaded,
      }}
    >
      {children}
    </LoadingContext.Provider>
  );
};

export const useLoadingContext = () => {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error('useLoadingContext must be used within a LoadingProvider');
  }
  return context;
};
