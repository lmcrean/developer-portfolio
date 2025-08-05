import Database from 'better-sqlite3';
import path from 'path';
import { HabitEntry, HabitStats } from './types';
import { IHabitTrackerDatabase } from './database-interface';

const DB_PATH = process.env.HABIT_TRACKER_DB_PATH || path.join(process.cwd(), 'data', 'habit-tracker.db');

export class HabitTrackerSQLiteDatabase implements IHabitTrackerDatabase {
  private db: Database.Database;

  constructor() {
    // Ensure data directory exists
    const dataDir = path.dirname(DB_PATH);
    if (!require('fs').existsSync(dataDir)) {
      require('fs').mkdirSync(dataDir, { recursive: true });
    }

    this.db = new Database(DB_PATH);
  }

  async initialize(): Promise<void> {
    // Create table if it doesn't exist
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS pull_request_habits (
        date TEXT PRIMARY KEY,
        pull_request_count INTEGER NOT NULL,
        last_updated TEXT NOT NULL
      )
    `);

    // Create indexes for performance
    this.db.exec(`
      CREATE INDEX IF NOT EXISTS idx_date ON pull_request_habits(date);
      CREATE INDEX IF NOT EXISTS idx_count ON pull_request_habits(pull_request_count);
    `);
  }

  async upsertEntry(date: string, pullRequestCount: number): Promise<void> {
    const stmt = this.db.prepare(`
      INSERT INTO pull_request_habits (date, pull_request_count, last_updated)
      VALUES (?, ?, ?)
      ON CONFLICT(date) DO UPDATE SET
        pull_request_count = excluded.pull_request_count,
        last_updated = excluded.last_updated
    `);

    stmt.run(date, pullRequestCount, new Date().toISOString());
  }

  async getEntry(date: string): Promise<HabitEntry | null> {
    const stmt = this.db.prepare(`
      SELECT date, pull_request_count, last_updated
      FROM pull_request_habits
      WHERE date = ?
    `);

    const row = stmt.get(date) as any;
    if (!row) return null;
    return {
      date: row.date,
      pullRequestCount: row.pull_request_count,
      lastUpdated: row.last_updated
    };
  }

  async getEntriesByYear(year: number): Promise<HabitEntry[]> {
    const stmt = this.db.prepare(`
      SELECT date, pull_request_count, last_updated
      FROM pull_request_habits
      WHERE strftime('%Y', date) = ?
      ORDER BY date ASC
    `);

    const rows = stmt.all(year.toString()) as any[];
    return rows.map(row => ({
      date: row.date,
      pullRequestCount: row.pull_request_count,
      lastUpdated: row.last_updated
    }));
  }

  async getStats(): Promise<HabitStats> {
    const totalStats = this.db.prepare(`
      SELECT 
        COUNT(*) as total_days,
        SUM(pull_request_count) as total_pull_requests,
        AVG(pull_request_count) as average_per_day,
        MAX(pull_request_count) as max_in_single_day
      FROM pull_request_habits
    `).get() as any;

    // Calculate streaks
    const allEntries = this.db.prepare(`
      SELECT date, pull_request_count
      FROM pull_request_habits
      ORDER BY date DESC
    `).all() as Array<{ date: string; pull_request_count: number }>;

    const { currentStreak, longestStreak } = this.calculateStreaks(allEntries);

    return {
      totalDays: totalStats.total_days || 0,
      totalPullRequests: totalStats.total_pull_requests || 0,
      averagePerDay: parseFloat(totalStats.average_per_day?.toFixed(2) || '0'),
      maxInSingleDay: totalStats.max_in_single_day || 0,
      currentStreak: currentStreak,
      longestStreak: longestStreak
    };
  }

  private calculateStreaks(entries: Array<{ date: string; pull_request_count: number }>): {
    currentStreak: number;
    longestStreak: number;
  } {
    if (entries.length === 0) {
      return { currentStreak: 0, longestStreak: 0 };
    }

    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;
    let lastDate: Date | null = null;

    // Start from most recent date
    for (const entry of entries) {
      if (entry.pull_request_count === 0) {
        tempStreak = 0;
        lastDate = null;
        continue;
      }

      const currentDate = new Date(entry.date);
      
      if (lastDate === null) {
        // First entry with PRs
        tempStreak = 1;
        if (entries[0] === entry) {
          // If this is the most recent entry, it's the start of current streak
          currentStreak = 1;
        }
      } else {
        const diffDays = Math.floor((lastDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) {
          // Consecutive day
          tempStreak++;
          if (currentStreak > 0 && entries.indexOf(entry) < entries.length) {
            currentStreak++;
          }
        } else {
          // Gap in dates
          tempStreak = 1;
          if (currentStreak > 0 && entries.indexOf(entry) < entries.length) {
            // Current streak is broken
            currentStreak = 0;
          }
        }
      }

      longestStreak = Math.max(longestStreak, tempStreak);
      lastDate = currentDate;
    }

    return { currentStreak, longestStreak };
  }

  async close(): Promise<void> {
    this.db.close();
  }
}