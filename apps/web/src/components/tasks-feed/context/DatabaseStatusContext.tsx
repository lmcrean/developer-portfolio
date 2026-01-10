import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { databaseStatusApi, DatabaseStatus } from '../api/tasks-api';

export interface SaveStatus {
  status: 'idle' | 'saving' | 'saved' | 'error' | 'offline';
  lastSavedAt: Date | null;
  message: string;
  isConnected: boolean;
}

interface DatabaseStatusContextValue {
  dbStatus: DatabaseStatus | null;
  saveStatus: SaveStatus;
  isChecking: boolean;
  checkStatus: () => Promise<void>;
  markSaving: () => void;
  markSaved: () => void;
  markError: (message?: string) => void;
}

const DatabaseStatusContext = createContext<DatabaseStatusContextValue | null>(null);

// Format time for display
const formatTime = (date: Date): string => {
  return date.toLocaleString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const DatabaseStatusProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [dbStatus, setDbStatus] = useState<DatabaseStatus | null>(null);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>({
    status: 'idle',
    lastSavedAt: null,
    message: 'Checking connection...',
    isConnected: false,
  });
  const [isChecking, setIsChecking] = useState(false);
  const checkIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Check database status
  const checkStatus = useCallback(async () => {
    if (isChecking) return;

    setIsChecking(true);
    try {
      const status = await databaseStatusApi.getStatus();
      setDbStatus(status);

      const isConnected = status.database === 'connected' && status.available;

      setSaveStatus(prev => ({
        ...prev,
        isConnected,
        status: isConnected ? (prev.status === 'saving' ? 'saving' : prev.status === 'saved' ? 'saved' : 'idle') : 'offline',
        message: isConnected
          ? (prev.lastSavedAt ? `Auto-Saved to NeonDB at ${formatTime(prev.lastSavedAt)}` : 'Connected to NeonDB')
          : `NeonDB: ${status.message}`,
      }));
    } catch (error) {
      console.error('Failed to check database status:', error);
      setDbStatus(null);
      setSaveStatus(prev => ({
        ...prev,
        isConnected: false,
        status: 'offline',
        message: 'Using local storage (API unavailable)',
      }));
    } finally {
      setIsChecking(false);
    }
  }, [isChecking]);

  // Mark save as started
  const markSaving = useCallback(() => {
    setSaveStatus(prev => ({
      ...prev,
      status: 'saving',
      message: 'Saving...',
    }));
  }, []);

  // Mark save as successful
  const markSaved = useCallback(() => {
    const now = new Date();
    setSaveStatus(prev => ({
      ...prev,
      status: 'saved',
      lastSavedAt: now,
      message: `Auto-Saved to NeonDB at ${formatTime(now)}`,
    }));
  }, []);

  // Mark save as failed
  const markError = useCallback((errorMessage?: string) => {
    setSaveStatus(prev => ({
      ...prev,
      status: 'error',
      message: errorMessage || 'Failed to save',
    }));
  }, []);

  // Initial check and periodic polling
  useEffect(() => {
    checkStatus();

    // Check every 30 seconds
    checkIntervalRef.current = setInterval(checkStatus, 30000);

    return () => {
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
      }
    };
  }, []);

  return (
    <DatabaseStatusContext.Provider
      value={{
        dbStatus,
        saveStatus,
        isChecking,
        checkStatus,
        markSaving,
        markSaved,
        markError,
      }}
    >
      {children}
    </DatabaseStatusContext.Provider>
  );
};

export const useDatabaseStatus = () => {
  const context = useContext(DatabaseStatusContext);
  if (!context) {
    // Return a fallback for when used outside provider
    return {
      dbStatus: null,
      saveStatus: {
        status: 'idle' as const,
        lastSavedAt: null,
        message: 'Checking connection...',
        isConnected: false,
      },
      isChecking: false,
      checkStatus: async () => {},
      markSaving: () => {},
      markSaved: () => {},
      markError: () => {},
    };
  }
  return context;
};
