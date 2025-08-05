export interface PullRequestHabitEntry {
  date: string; // YYYY-MM-DD format
  pull_request_count: number;
  last_updated: string; // ISO 8601 timestamp
}

export interface HabitEntry {
  date: string; // YYYY-MM-DD format
  pullRequestCount: number;
  lastUpdated: string; // ISO 8601 timestamp
}

export interface HabitTrackerStats {
  total_days: number;
  total_pull_requests: number;
  average_per_day: number;
  max_in_single_day: number;
  current_streak: number;
  longest_streak: number;
}

export interface HabitStats {
  totalDays: number;
  totalPullRequests: number;
  averagePerDay: number;
  maxInSingleDay: number;
  currentStreak: number;
  longestStreak: number;
}

export interface DateRange {
  start_date: string; // YYYY-MM-DD
  end_date: string; // YYYY-MM-DD
}

export interface RefreshResult {
  days_updated: number;
  total_pull_requests_found: number;
  date_range: DateRange;
}