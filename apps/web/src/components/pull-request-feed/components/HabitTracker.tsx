import React, { useState, useEffect } from 'react';

interface HabitEntry {
  date: string;
  pull_request_count: number;
  last_updated: string;
}

interface HabitStats {
  total_days: number;
  total_pull_requests: number;
  average_per_day: number;
  max_in_single_day: number;
  current_streak: number;
  longest_streak: number;
}

interface HabitTrackerProps {
  username: string;
  className?: string;
}

const HabitTracker: React.FC<HabitTrackerProps> = ({ username, className = '' }) => {
  const [entries, setEntries] = useState<HabitEntry[]>([]);
  const [stats, setStats] = useState<HabitStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const API_BASE_URL = process.env.NODE_ENV === 'development' 
    ? 'http://localhost:3015' 
    : 'https://api-github-lmcreans-projects.vercel.app';

  useEffect(() => {
    fetchHabitData();
  }, [selectedYear]);

  const fetchHabitData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch stats
      const statsResponse = await fetch(`${API_BASE_URL}/api/github/habit-tracker/stats`);
      if (!statsResponse.ok) throw new Error('Failed to fetch stats');
      const statsData = await statsResponse.json();
      setStats(statsData);

      // Fetch entries for the year
      const startDate = `${selectedYear}-01-01`;
      const endDate = `${selectedYear}-12-31`;
      const entriesResponse = await fetch(
        `${API_BASE_URL}/api/github/habit-tracker/entries?start_date=${startDate}&end_date=${endDate}`
      );
      if (!entriesResponse.ok) throw new Error('Failed to fetch entries');
      const entriesData = await entriesResponse.json();
      setEntries(entriesData.entries || []);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/github/habit-tracker/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date_range: {
            start_date: `${selectedYear}-01-01`,
            end_date: `${selectedYear}-12-31`
          }
        })
      });
      if (!response.ok) throw new Error('Failed to refresh data');
      await fetchHabitData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh data');
    }
  };

  const getContributionLevel = (count: number): string => {
    if (count === 0) return 'bg-gray-100 dark:bg-gray-800';
    if (count === 1) return 'bg-green-200 dark:bg-green-900';
    if (count <= 3) return 'bg-green-400 dark:bg-green-700';
    if (count <= 5) return 'bg-green-600 dark:bg-green-500';
    return 'bg-green-800 dark:bg-green-300';
  };

  const generateCalendarGrid = () => {
    const year = selectedYear;
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31);
    
    // Create a map of dates to PR counts
    const entriesMap = new Map<string, number>();
    entries.forEach(entry => {
      entriesMap.set(entry.date, entry.pull_request_count);
    });

    const weeks: Array<Array<{ date: Date; count: number }>> = [];
    let currentWeek: Array<{ date: Date; count: number }> = [];
    
    // Start from the first day of the year
    const current = new Date(startDate);
    
    // Fill empty days at the beginning of the first week
    const firstDayOfWeek = current.getDay();
    for (let i = 0; i < firstDayOfWeek; i++) {
      currentWeek.push({ date: new Date(0), count: -1 }); // -1 indicates empty cell
    }
    
    while (current <= endDate) {
      const dateStr = current.toISOString().split('T')[0];
      const count = entriesMap.get(dateStr) || 0;
      
      currentWeek.push({ date: new Date(current), count });
      
      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
      
      current.setDate(current.getDate() + 1);
    }
    
    // Fill the last week if necessary
    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) {
        currentWeek.push({ date: new Date(0), count: -1 });
      }
      weeks.push(currentWeek);
    }
    
    return weeks;
  };

  const getMonthLabels = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                   'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months;
  };

  if (loading) {
    return (
      <div className={`w-full max-w-4xl mx-auto p-4 ${className}`}>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-64 mb-4"></div>
          <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`w-full max-w-4xl mx-auto p-4 ${className}`}>
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-700 dark:text-red-300 mb-2">Error loading habit tracker: {error}</p>
          <button
            onClick={refreshData}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const weeks = generateCalendarGrid();
  const monthLabels = getMonthLabels();

  return (
    <div className={`w-full max-w-4xl mx-auto p-4 ${className}`}>
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Pull Request Habit Tracker
          </h2>
          <div className="flex items-center gap-2">
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
            <button
              onClick={refreshData}
              className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
            >
              Refresh
            </button>
          </div>
        </div>
        
        {stats && (
          <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-300">
            <span>{stats.total_pull_requests} contributions in {selectedYear}</span>
            <span>Current streak: {stats.current_streak} days</span>
            <span>Longest streak: {stats.longest_streak} days</span>
            <span>Average: {stats.average_per_day.toFixed(1)} per day</span>
          </div>
        )}
      </div>

      {/* Calendar Grid */}
      <div className="mb-4">
        {/* Month labels */}
        <div className="flex ml-10 mb-2">
          {monthLabels.map((month, index) => (
            <div key={month} className="flex-1 text-xs text-gray-500 dark:text-gray-400 text-center">
              {index % 2 === 0 ? month : ''}
            </div>
          ))}
        </div>
        
        {/* Calendar grid */}
        <div className="flex">
          {/* Day labels */}
          <div className="flex flex-col mr-2">
            <div className="h-3 mb-1"></div> {/* Spacer for month row */}
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
              <div key={day} className="h-3 mb-1 text-xs text-gray-500 dark:text-gray-400 flex items-center">
                {index % 2 === 1 ? day : ''}
              </div>
            ))}
          </div>
          
          {/* Grid */}
          <div className="flex flex-col">
            {[0, 1, 2, 3, 4, 5, 6].map(dayIndex => (
              <div key={dayIndex} className="flex mb-1">
                {weeks.map((week, weekIndex) => {
                  const day = week[dayIndex];
                  if (day.count === -1) {
                    return <div key={weekIndex} className="w-3 h-3 mr-1"></div>;
                  }
                  
                  return (
                    <div
                      key={weekIndex}
                      className={`w-3 h-3 mr-1 rounded-sm ${getContributionLevel(day.count)} border border-gray-200 dark:border-gray-700`}
                      title={`${day.date.toDateString()}: ${day.count} pull requests`}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
        <span>Learn how we count contributions</span>
        <div className="flex items-center gap-1">
          <span>Less</span>
          <div className="flex gap-1 ml-2">
            <div className="w-3 h-3 bg-gray-100 dark:bg-gray-800 rounded-sm border border-gray-200 dark:border-gray-700"></div>
            <div className="w-3 h-3 bg-green-200 dark:bg-green-900 rounded-sm border border-gray-200 dark:border-gray-700"></div>
            <div className="w-3 h-3 bg-green-400 dark:bg-green-700 rounded-sm border border-gray-200 dark:border-gray-700"></div>
            <div className="w-3 h-3 bg-green-600 dark:bg-green-500 rounded-sm border border-gray-200 dark:border-gray-700"></div>
            <div className="w-3 h-3 bg-green-800 dark:bg-green-300 rounded-sm border border-gray-200 dark:border-gray-700"></div>
          </div>
          <span className="ml-2">More</span>
        </div>
      </div>
    </div>
  );
};

export default HabitTracker;