import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import express from 'express';
import { Octokit } from '@octokit/rest';
import { createHabitTrackerRouter } from './index';
import request from 'supertest';

// Mock Octokit
const mockOctokit = {
  search: {
    issuesAndPullRequests: async () => ({
      data: {
        items: [
          {
            created_at: '2025-01-15T10:30:00Z',
            title: 'Test PR',
            html_url: 'https://github.com/test/repo/pull/1'
          },
          {
            created_at: '2025-01-15T14:30:00Z',
            title: 'Another PR',
            html_url: 'https://github.com/test/repo/pull/2'
          }
        ]
      }
    })
  }
} as unknown as Octokit;

describe('Habit Tracker API', () => {
  let app: express.Application;
  let originalEnv: string | undefined;

  beforeEach(() => {
    // Save original environment
    originalEnv = process.env.HABIT_TRACKER_DB_PATH;
    
    // Set up test database path
    process.env.HABIT_TRACKER_DB_PATH = ':memory:';
    
    // Create Express app with habit tracker router
    app = express();
    app.use(express.json());
    
    const router = createHabitTrackerRouter(mockOctokit, 'testuser');
    app.use('/api/habit-tracker', router);
  });

  afterEach(() => {
    // Restore original environment
    if (originalEnv) {
      process.env.HABIT_TRACKER_DB_PATH = originalEnv;
    } else {
      delete process.env.HABIT_TRACKER_DB_PATH;
    }
  });

  describe('GET /api/habit-tracker/stats', () => {
    it('should return empty stats for new database', async () => {
      const response = await request(app)
        .get('/api/habit-tracker/stats')
        .expect(200);

      expect(response.body).toEqual({
        total_days: 0,
        total_pull_requests: 0,
        average_per_day: 0,
        max_in_single_day: 0,
        current_streak: 0,
        longest_streak: 0
      });
    });
  });

  describe('GET /api/habit-tracker/entries', () => {
    it('should return empty array for new database', async () => {
      const response = await request(app)
        .get('/api/habit-tracker/entries')
        .expect(200);

      expect(response.body.entries).toEqual([]);
      expect(response.body.date_range).toBeDefined();
    });

    it('should accept date range query parameters', async () => {
      const response = await request(app)
        .get('/api/habit-tracker/entries?start_date=2025-01-01&end_date=2025-01-31')
        .expect(200);

      expect(response.body.date_range).toEqual({
        start_date: '2025-01-01',
        end_date: '2025-01-31'
      });
    });

    it('should return 400 for invalid date format', async () => {
      await request(app)
        .get('/api/habit-tracker/entries?start_date=invalid-date')
        .expect(400);
    });
  });

  describe('GET /api/habit-tracker/entries/:date', () => {
    it('should return 404 for non-existent date', async () => {
      await request(app)
        .get('/api/habit-tracker/entries/2025-01-15')
        .expect(404);
    });

    it('should return 400 for invalid date format', async () => {
      await request(app)
        .get('/api/habit-tracker/entries/invalid-date')
        .expect(400);
    });
  });

  describe('POST /api/habit-tracker/refresh', () => {
    it('should refresh data successfully', async () => {
      const response = await request(app)
        .post('/api/habit-tracker/refresh')
        .send({
          date_range: {
            start_date: '2025-01-15',
            end_date: '2025-01-15'
          }
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.result).toBeDefined();
      expect(response.body.result.days_updated).toBeGreaterThan(0);
    });

    it('should return 400 for invalid date range', async () => {
      await request(app)
        .post('/api/habit-tracker/refresh')
        .send({
          date_range: {
            start_date: 'invalid-date',
            end_date: '2025-01-15'
          }
        })
        .expect(400);
    });

    it('should return 400 when start_date is after end_date', async () => {
      await request(app)
        .post('/api/habit-tracker/refresh')
        .send({
          date_range: {
            start_date: '2025-01-15',
            end_date: '2025-01-10'
          }
        })
        .expect(400);
    });
  });
});