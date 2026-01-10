import React, { useState, useEffect, useCallback } from 'react';
import TasksFeed from './TasksFeed';
import { DatabaseStatusProvider, useDatabaseStatus } from './context/DatabaseStatusContext';

interface TasksPageProps {
  username?: string;
}

const NOTES_STORAGE_KEY = 'tasks_notes';

/**
 * NotesSection - Simple notes textarea with local storage
 */
const NotesSection: React.FC = () => {
  const [notes, setNotes] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);

  // Load notes from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(NOTES_STORAGE_KEY);
      if (saved) {
        setNotes(saved);
      }
    } catch (err) {
      console.error('Failed to load notes:', err);
    }
    setIsLoaded(true);
  }, []);

  // Save notes to localStorage on change (debounced)
  const handleNotesChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setNotes(value);
    try {
      localStorage.setItem(NOTES_STORAGE_KEY, value);
    } catch (err) {
      console.error('Failed to save notes:', err);
    }
  }, []);

  if (!isLoaded) {
    return (
      <div className="bg-gray-900/50 rounded-lg border border-gray-700/50 p-4">
        <h2 className="text-xl font-semibold text-white mb-4">Notes</h2>
        <div className="text-gray-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900/50 rounded-lg border border-gray-700/50 p-4">
      <h2 className="text-xl font-semibold text-white mb-4">Notes</h2>
      <textarea
        value={notes}
        onChange={handleNotesChange}
        placeholder="Add your notes here..."
        className="w-full h-64 bg-gray-800/50 border border-gray-700/50 rounded-lg p-3 text-gray-300 placeholder-gray-500 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent"
      />
    </div>
  );
};

/**
 * TasksPageContent - Inner content that uses database status context
 */
const TasksPageContent: React.FC<TasksPageProps> = ({ username = 'lmcrean' }) => {
  const { saveStatus } = useDatabaseStatus();

  // Get status indicator styling
  const getStatusColor = () => {
    switch (saveStatus.status) {
      case 'saved':
        return 'text-green-400';
      case 'saving':
        return 'text-yellow-400';
      case 'error':
        return 'text-red-400';
      case 'offline':
        return 'text-gray-500';
      default:
        return 'text-gray-400';
    }
  };

  const getStatusDot = () => {
    switch (saveStatus.status) {
      case 'saved':
        return 'bg-green-400';
      case 'saving':
        return 'bg-yellow-400 animate-pulse';
      case 'error':
        return 'bg-red-400';
      case 'offline':
        return 'bg-gray-500';
      default:
        return 'bg-gray-400';
    }
  };

  return (
    <div className="tasks-page">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Task Management</h1>
        <div className={`text-sm ${getStatusColor()} flex items-center justify-center gap-2`}>
          <span className={`inline-block w-2 h-2 rounded-full ${getStatusDot()}`} />
          <span>{saveStatus.message}</span>
        </div>
      </div>

      {/* Main content - Two column layout on larger screens */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Tasks Feed - Main content */}
        <div className="flex-1 min-w-0">
          <TasksFeed username={username} className="mb-8" />
        </div>

        {/* Notes Section - Sidebar */}
        <div className="lg:w-80 flex-shrink-0">
          <NotesSection />
        </div>
      </div>
    </div>
  );
};

/**
 * TasksPage - Main container for tasks with header and status
 * Wraps content in DatabaseStatusProvider
 */
export const TasksPage: React.FC<TasksPageProps> = (props) => {
  return (
    <DatabaseStatusProvider>
      <TasksPageContent {...props} />
    </DatabaseStatusProvider>
  );
};

export default TasksPage;
