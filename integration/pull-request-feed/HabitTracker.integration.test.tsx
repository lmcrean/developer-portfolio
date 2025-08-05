import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import HabitTracker from '../../apps/web/src/components/pull-request-feed/components/HabitTracker';

// Mock fetch globally
global.fetch = vi.fn();

describe('HabitTracker Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const mockStatsResponse = {
    total_days: 15,
    total_pull_requests: 45,
    average_per_day: 3.0,
    max_in_single_day: 8,
    current_streak: 5,
    longest_streak: 12
  };

  const mockEntriesResponse = {
    entries: [
      { date: '2025-01-15', pull_request_count: 3, last_updated: '2025-01-15T10:00:00Z' },
      { date: '2025-01-16', pull_request_count: 5, last_updated: '2025-01-16T10:00:00Z' },
      { date: '2025-01-17', pull_request_count: 2, last_updated: '2025-01-17T10:00:00Z' },
      { date: '2025-01-18', pull_request_count: 0, last_updated: '2025-01-18T10:00:00Z' },
      { date: '2025-01-19', pull_request_count: 1, last_updated: '2025-01-19T10:00:00Z' }
    ],
    date_range: { start_date: '2025-01-01', end_date: '2025-12-31' }
  };

  it('integrates with habit tracker API and renders complete component', async () => {
    // Mock successful API responses
    (global.fetch as any)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockStatsResponse,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockEntriesResponse,
      });

    render(<HabitTracker username="testuser" />);

    // Wait for component to load
    await waitFor(() => {
      expect(screen.getByText('Pull Request Habit Tracker')).toBeInTheDocument();
    });

    // Verify stats are displayed
    expect(screen.getByText('45 contributions in 2025')).toBeInTheDocument();
    expect(screen.getByText('Current streak: 5 days')).toBeInTheDocument();
    expect(screen.getByText('Longest streak: 12 days')).toBeInTheDocument();
    expect(screen.getByText('Average: 3.0 per day')).toBeInTheDocument();

    // Verify calendar structure is rendered
    expect(screen.getByText('Jan')).toBeInTheDocument();
    expect(screen.getByText('Mon')).toBeInTheDocument();
    expect(screen.getByText('Less')).toBeInTheDocument();
    expect(screen.getByText('More')).toBeInTheDocument();

    // Verify API calls were made
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/github/habit-tracker/stats')
    );
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/github/habit-tracker/entries?start_date=2025-01-01&end_date=2025-12-31')
    );
  });

  it('handles year selection and triggers API refresh', async () => {
    // Initial load
    (global.fetch as any)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockStatsResponse,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockEntriesResponse,
      })
      // Year change triggers new API calls
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ ...mockStatsResponse, total_pull_requests: 30 }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ ...mockEntriesResponse, entries: mockEntriesResponse.entries.slice(0, 3) }),
      });

    render(<HabitTracker username="testuser" />);

    await waitFor(() => {
      expect(screen.getByText('45 contributions in 2025')).toBeInTheDocument();
    });

    // Change year
    const yearSelect = screen.getByRole('combobox');
    fireEvent.change(yearSelect, { target: { value: '2024' } });

    await waitFor(() => {
      expect(screen.getByText('30 contributions in 2024')).toBeInTheDocument();
    });

    // Verify new API calls were made for 2024
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/github/habit-tracker/entries?start_date=2024-01-01&end_date=2024-12-31')
    );
  });

  it('handles refresh data flow with API integration', async () => {
    // Initial load
    (global.fetch as any)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockStatsResponse,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockEntriesResponse,
      })
      // Refresh button click
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, result: { days_updated: 8 } }),
      })
      // Re-fetch data after refresh
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ ...mockStatsResponse, total_pull_requests: 50 }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockEntriesResponse,
      });

    render(<HabitTracker username="testuser" />);

    await waitFor(() => {
      expect(screen.getByText('45 contributions in 2025')).toBeInTheDocument();
    });

    // Click refresh
    const refreshButton = screen.getByText('Refresh');
    fireEvent.click(refreshButton);

    await waitFor(() => {
      expect(screen.getByText('50 contributions in 2025')).toBeInTheDocument();
    });

    // Verify refresh API call was made
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/github/habit-tracker/refresh'),
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: expect.stringContaining('2025-01-01')
      })
    );
  });

  it('handles API error responses gracefully', async () => {
    // Mock API error
    (global.fetch as any)
      .mockRejectedValueOnce(new Error('Network error'));

    render(<HabitTracker username="testuser" />);

    await waitFor(() => {
      expect(screen.getByText(/Error loading habit tracker/)).toBeInTheDocument();
    });

    expect(screen.getByText('Network error')).toBeInTheDocument();
    expect(screen.getByText('Try Again')).toBeInTheDocument();
  });

  it('renders calendar with correct contribution levels', async () => {
    const entriesWithVariedCounts = {
      entries: [
        { date: '2025-01-01', pull_request_count: 0, last_updated: '2025-01-01T10:00:00Z' },
        { date: '2025-01-02', pull_request_count: 1, last_updated: '2025-01-02T10:00:00Z' },
        { date: '2025-01-03', pull_request_count: 3, last_updated: '2025-01-03T10:00:00Z' },
        { date: '2025-01-04', pull_request_count: 6, last_updated: '2025-01-04T10:00:00Z' },
        { date: '2025-01-05', pull_request_count: 10, last_updated: '2025-01-05T10:00:00Z' }
      ],
      date_range: { start_date: '2025-01-01', end_date: '2025-12-31' }
    };

    (global.fetch as any)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockStatsResponse,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => entriesWithVariedCounts,
      });

    const { container } = render(<HabitTracker username="testuser" />);

    await waitFor(() => {
      expect(screen.getByText('Pull Request Habit Tracker')).toBeInTheDocument();
    });

    // Check that calendar grid is rendered
    const calendarGrid = container.querySelector('div[title*="pull requests"]');
    expect(calendarGrid).toBeInTheDocument();

    // Verify legend is present
    expect(screen.getByText('Learn how we count contributions')).toBeInTheDocument();
  });

  it('validates API response structure', async () => {
    const invalidStatsResponse = {
      // Missing required fields
      total_days: 10
    };

    (global.fetch as any)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => invalidStatsResponse,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockEntriesResponse,
      });

    render(<HabitTracker username="testuser" />);

    await waitFor(() => {
      expect(screen.getByText('Pull Request Habit Tracker')).toBeInTheDocument();
    });

    // Component should handle missing stats gracefully
    // The undefined values should be handled by the component
  });

  it('handles environment-specific API URLs', () => {
    const originalEnv = process.env.NODE_ENV;
    
    // Test development environment
    process.env.NODE_ENV = 'development';
    (global.fetch as any)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockStatsResponse,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockEntriesResponse,
      });

    render(<HabitTracker username="testuser" />);

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('http://localhost:3015')
    );

    // Restore environment
    process.env.NODE_ENV = originalEnv;
  });

  it('handles empty data responses', async () => {
    const emptyStatsResponse = {
      total_days: 0,
      total_pull_requests: 0,
      average_per_day: 0,
      max_in_single_day: 0,
      current_streak: 0,
      longest_streak: 0
    };

    const emptyEntriesResponse = {
      entries: [],
      date_range: { start_date: '2025-01-01', end_date: '2025-12-31' }
    };

    (global.fetch as any)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => emptyStatsResponse,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => emptyEntriesResponse,
      });

    render(<HabitTracker username="testuser" />);

    await waitFor(() => {
      expect(screen.getByText('Pull Request Habit Tracker')).toBeInTheDocument();
    });

    expect(screen.getByText('0 contributions in 2025')).toBeInTheDocument();
    expect(screen.getByText('Current streak: 0 days')).toBeInTheDocument();
    expect(screen.getByText('Average: 0.0 per day')).toBeInTheDocument();
  });
});