import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { spawn, ChildProcess } from 'child_process';
import { HabitTrackerSQLiteDatabase } from './database-sqlite';
import path from 'path';

describe('Habit Tracker E2E', () => {
  let serverProcess: ChildProcess | undefined;
  let testDbPath: string;

  beforeAll(async () => {
    // Set up test database
    testDbPath = path.join(__dirname, `e2e-test-${Date.now()}.db`);
    process.env.HABIT_TRACKER_DB_PATH = testDbPath;
    process.env.GITHUB_USERNAME = 'testuser';
    process.env.GITHUB_TOKEN = 'fake-token';
    
    // Start the server (this is more of a sanity check)
    // In a real e2e test, we'd start the actual server
    // For now, we'll just test the database integration
  });

  afterAll(async () => {
    // Clean up
    if (serverProcess) {
      serverProcess.kill();
    }
    
    // Clean up test database
    try {
      const fs = require('fs');
      if (fs.existsSync(testDbPath)) {
        fs.unlinkSync(testDbPath);
      }
    } catch (error) {
      // Ignore cleanup errors
    }
  });

  it('should create database and perform basic operations', () => {
    // Test database creation and basic operations
    const db = new HabitTrackerSQLiteDatabase();
    
    // Insert some test data
    db.upsertHabitEntry('2025-01-15', 3);
    db.upsertHabitEntry('2025-01-16', 2);
    db.upsertHabitEntry('2025-01-17', 1);
    
    // Verify data was inserted
    const entry = db.getHabitEntry('2025-01-15');
    expect(entry).toBeDefined();
    expect(entry!.pull_request_count).toBe(3);
    
    // Test range query
    const entries = db.getHabitEntries('2025-01-15', '2025-01-17');
    expect(entries).toHaveLength(3);
    
    // Test stats
    const stats = db.getStats();
    expect(stats.total_pull_requests).toBe(6);
    expect(stats.total_days).toBe(3);
    
    db.close();
  });

  it('should verify habit tracker components work together', () => {
    // Test that all components can work together
    const db = new HabitTrackerSQLiteDatabase();
    
    // Simulate some habit data
    const dates = ['2025-01-10', '2025-01-11', '2025-01-12', '2025-01-13', '2025-01-14'];
    const counts = [1, 2, 0, 3, 1];
    
    for (let i = 0; i < dates.length; i++) {
      db.upsertHabitEntry(dates[i], counts[i]);
    }
    
    // Verify the data structure matches expected API response format
    const allEntries = db.getHabitEntries('2025-01-10', '2025-01-14');
    expect(allEntries).toHaveLength(5);
    
    // Verify each entry has the expected structure
    allEntries.forEach((entry: any, index: number) => {
      expect(entry.date).toBe(dates[index]);
      expect(entry.pull_request_count).toBe(counts[index]);
      expect(entry.last_updated).toBeDefined();
    });
    
    // Verify stats calculation
    const stats = db.getStats();
    expect(stats.total_pull_requests).toBe(7); // 1+2+0+3+1
    expect(stats.total_days).toBe(5);
    expect(stats.max_in_single_day).toBe(3);
    
    db.close();
  });
});