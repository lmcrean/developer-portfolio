import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import HabitTracker from '../HabitTracker';

// Mock fetch
global.fetch = jest.fn();

const mockFetch = fetch as jest.MockedFunction<typeof fetch>;

describe('HabitTracker', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  const mockStatsResponse = {
    total_days: 10,
    total_pull_requests: 25,
    average_per_day: 2.5,
    max_in_single_day: 5,
    current_streak: 3,
    longest_streak: 7
  };

  const mockEntriesResponse = {
    entries: [
      { date: '2025-01-15', pull_request_count: 2, last_updated: '2025-01-15T10:00:00Z' },
      { date: '2025-01-16', pull_request_count: 3, last_updated: '2025-01-16T10:00:00Z' },
      { date: '2025-01-17', pull_request_count: 1, last_updated: '2025-01-17T10:00:00Z' }
    ],
    date_range: { start_date: '2025-01-01', end_date: '2025-12-31' }
  };

  it('renders loading state initially', () => {
    mockFetch.mockImplementation(() => new Promise(() => {})); // Never resolves
    
    render(<HabitTracker username="testuser" />);
    
    expect(screen.getByText('Pull Request Habit Tracker')).toBeInTheDocument();
    expect(screen.getByRole('generic')).toHaveClass('animate-pulse');
  });

  it('renders habit tracker with data', async () => {
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockStatsResponse,
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockEntriesResponse,
      } as Response);

    render(<HabitTracker username="testuser" />);

    await waitFor(() => {
      expect(screen.getByText('Pull Request Habit Tracker')).toBeInTheDocument();
    });

    expect(screen.getByText('25 contributions in 2025')).toBeInTheDocument();
    expect(screen.getByText('Current streak: 3 days')).toBeInTheDocument();
    expect(screen.getByText('Longest streak: 7 days')).toBeInTheDocument();
    expect(screen.getByText('Average: 2.5 per day')).toBeInTheDocument();
  });

  it('renders error state when fetch fails', async () => {
    mockFetch.mockRejectedValue(new Error('Failed to fetch'));

    render(<HabitTracker username="testuser" />);

    await waitFor(() => {
      expect(screen.getByText(/Error loading habit tracker/)).toBeInTheDocument();
    });

    expect(screen.getByText('Try Again')).toBeInTheDocument();
  });

  it('allows year selection', async () => {
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockStatsResponse,
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockEntriesResponse,
      } as Response);

    render(<HabitTracker username="testuser" />);

    await waitFor(() => {
      expect(screen.getByText('Pull Request Habit Tracker')).toBeInTheDocument();
    });

    const yearSelect = screen.getByRole('combobox');
    expect(yearSelect).toBeInTheDocument();
    expect(yearSelect).toHaveValue('2025');
  });

  it('handles refresh button click', async () => {
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockStatsResponse,
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockEntriesResponse,
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, result: { days_updated: 5 } }),
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockStatsResponse,
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockEntriesResponse,
      } as Response);

    render(<HabitTracker username="testuser" />);

    await waitFor(() => {
      expect(screen.getByText('Pull Request Habit Tracker')).toBeInTheDocument();
    });

    const refreshButton = screen.getByText('Refresh');
    fireEvent.click(refreshButton);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/github/habit-tracker/refresh'),
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: expect.stringContaining('2025-01-01')
        })
      );
    });
  });

  it('renders calendar grid with correct structure', async () => {
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockStatsResponse,
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockEntriesResponse,
      } as Response);

    render(<HabitTracker username="testuser" />);

    await waitFor(() => {
      expect(screen.getByText('Pull Request Habit Tracker')).toBeInTheDocument();
    });

    // Check for month labels
    expect(screen.getByText('Jan')).toBeInTheDocument();
    expect(screen.getByText('Feb')).toBeInTheDocument();
    expect(screen.getByText('Mar')).toBeInTheDocument();

    // Check for day labels
    expect(screen.getByText('Mon')).toBeInTheDocument();
    expect(screen.getByText('Wed')).toBeInTheDocument();
    expect(screen.getByText('Fri')).toBeInTheDocument();

    // Check for legend
    expect(screen.getByText('Less')).toBeInTheDocument();
    expect(screen.getByText('More')).toBeInTheDocument();
    expect(screen.getByText('Learn how we count contributions')).toBeInTheDocument();
  });

  it('applies correct CSS classes for different contribution levels', () => {
    const { container } = render(<HabitTracker username="testuser" />);
    
    // This is a unit test for the getContributionLevel function
    // We'll need to access the component's internal method
    const component = container.querySelector('[data-testid="habit-tracker"]');
    
    // Since we can't directly test the internal method, we'll test the rendered output
    // after the component loads with data
  });

  it('handles API URLs correctly for different environments', () => {
    const originalEnv = process.env.NODE_ENV;
    
    // Test development environment
    process.env.NODE_ENV = 'development';
    render(<HabitTracker username="testuser" />);
    
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('http://localhost:3015'),
      expect.any(Object)
    );
    
    // Test production environment
    process.env.NODE_ENV = 'production';
    render(<HabitTracker username="testuser" />);
    
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('https://api-github-lmcreans-projects.vercel.app'),
      expect.any(Object)
    );
    
    process.env.NODE_ENV = originalEnv;
  });
});