import { Pool } from 'pg';
import type { HabitEntry, HabitStats } from './types';
import { IHabitTrackerDatabase } from './database-interface';

export class HabitTrackerPostgresDatabase implements IHabitTrackerDatabase {
  private pool: Pool;

  constructor(connectionString: string) {
    this.pool = new Pool({
      connectionString,
      ssl: {
        rejectUnauthorized: false
      }
    });
  }

  async initialize(): Promise<void> {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS pull_request_habits (
        date DATE PRIMARY KEY,
        pull_request_count INTEGER NOT NULL DEFAULT 0,
        last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    try {
      await this.pool.query(createTableQuery);
      console.log('PostgreSQL table initialized successfully');
    } catch (error) {
      console.error('Error initializing PostgreSQL table:', error);
      throw error;
    }
  }

  async upsertEntry(date: string, pullRequestCount: number): Promise<void> {
    const query = `
      INSERT INTO pull_request_habits (date, pull_request_count, last_updated)
      VALUES ($1, $2, CURRENT_TIMESTAMP)
      ON CONFLICT (date)
      DO UPDATE SET 
        pull_request_count = $2,
        last_updated = CURRENT_TIMESTAMP;
    `;

    try {
      await this.pool.query(query, [date, pullRequestCount]);
    } catch (error) {
      console.error('Error upserting entry:', error);
      throw error;
    }
  }

  async getEntry(date: string): Promise<HabitEntry | null> {
    const query = 'SELECT * FROM pull_request_habits WHERE date = $1';
    
    try {
      const result = await this.pool.query(query, [date]);
      if (result.rows.length === 0) {
        return null;
      }
      
      const row = result.rows[0];
      return {
        date: row.date.toISOString().split('T')[0],
        pullRequestCount: row.pull_request_count,
        lastUpdated: row.last_updated.toISOString()
      };
    } catch (error) {
      console.error('Error getting entry:', error);
      throw error;
    }
  }

  async getEntriesByYear(year: number): Promise<HabitEntry[]> {
    const query = `
      SELECT * FROM pull_request_habits 
      WHERE EXTRACT(YEAR FROM date) = $1
      ORDER BY date ASC
    `;
    
    try {
      const result = await this.pool.query(query, [year]);
      return result.rows.map(row => ({
        date: row.date.toISOString().split('T')[0],
        pullRequestCount: row.pull_request_count,
        lastUpdated: row.last_updated.toISOString()
      }));
    } catch (error) {
      console.error('Error getting entries by year:', error);
      throw error;
    }
  }

  async getStats(): Promise<HabitStats> {
    const allEntriesQuery = 'SELECT * FROM pull_request_habits ORDER BY date ASC';
    
    try {
      const result = await this.pool.query(allEntriesQuery);
      const entries = result.rows.map(row => ({
        date: row.date.toISOString().split('T')[0],
        pullRequestCount: row.pull_request_count,
        lastUpdated: row.last_updated.toISOString()
      }));

      if (entries.length === 0) {
        return {
          totalPullRequests: 0,
          totalDays: 0,
          averagePerDay: 0,
          currentStreak: 0,
          longestStreak: 0,
          maxInSingleDay: 0
        };
      }

      const totalPullRequests = entries.reduce((sum, entry) => sum + entry.pullRequestCount, 0);
      const daysWithPRs = entries.filter(entry => entry.pullRequestCount > 0).length;
      const averagePerDay = daysWithPRs > 0 ? totalPullRequests / daysWithPRs : 0;
      const maxInSingleDay = Math.max(...entries.map(entry => entry.pullRequestCount));

      // Calculate streaks
      let currentStreak = 0;
      let longestStreak = 0;
      let tempStreak = 0;

      for (let i = 0; i < entries.length; i++) {
        if (entries[i].pullRequestCount > 0) {
          tempStreak++;
          if (tempStreak > longestStreak) {
            longestStreak = tempStreak;
          }
        } else {
          tempStreak = 0;
        }
      }

      // Calculate current streak from the end
      for (let i = entries.length - 1; i >= 0; i--) {
        if (entries[i].pullRequestCount > 0) {
          currentStreak++;
        } else {
          break;
        }
      }

      return {
        totalPullRequests,
        totalDays: entries.length,
        averagePerDay: Math.round(averagePerDay * 10) / 10,
        currentStreak,
        longestStreak,
        maxInSingleDay
      };
    } catch (error) {
      console.error('Error getting stats:', error);
      throw error;
    }
  }

  async close(): Promise<void> {
    await this.pool.end();
  }
}