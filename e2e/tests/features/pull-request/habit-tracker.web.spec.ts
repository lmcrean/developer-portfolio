import { test, expect } from '@playwright/test';

test.describe('Habit Tracker E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the pull request feed page
    await page.goto('/pull-request-feed');
    
    // Wait for the page to load
    await page.waitForLoadState('networkidle');
  });

  test('should display habit tracker component', async ({ page }) => {
    // Check that the habit tracker component is present
    await expect(page.locator('text=Pull Request Habit Tracker')).toBeVisible();
    
    // Check for stats display
    await expect(page.locator('text=contributions in')).toBeVisible();
    await expect(page.locator('text=Current streak:')).toBeVisible();
    await expect(page.locator('text=Longest streak:')).toBeVisible();
    await expect(page.locator('text=Average:')).toBeVisible();
  });

  test('should render calendar grid structure', async ({ page }) => {
    // Wait for habit tracker to load
    await page.waitForSelector('text=Pull Request Habit Tracker');
    
    // Check for month labels
    await expect(page.locator('text=Jan')).toBeVisible();
    await expect(page.locator('text=Feb')).toBeVisible();
    await expect(page.locator('text=Mar')).toBeVisible();
    
    // Check for day labels
    await expect(page.locator('text=Mon')).toBeVisible();
    await expect(page.locator('text=Wed')).toBeVisible();
    await expect(page.locator('text=Fri')).toBeVisible();
    
    // Check for legend
    await expect(page.locator('text=Less')).toBeVisible();
    await expect(page.locator('text=More')).toBeVisible();
    await expect(page.locator('text=Learn how we count contributions')).toBeVisible();
  });

  test('should have functioning year selector', async ({ page }) => {
    // Wait for habit tracker to load
    await page.waitForSelector('text=Pull Request Habit Tracker');
    
    // Check year selector is present
    const yearSelect = page.locator('select');
    await expect(yearSelect).toBeVisible();
    
    // Get current year and verify it's selected
    const currentYear = new Date().getFullYear().toString();
    await expect(yearSelect).toHaveValue(currentYear);
    
    // Check that we can select different years
    await yearSelect.selectOption((currentYear - 1).toString());
    await expect(yearSelect).toHaveValue((currentYear - 1).toString());
    
    // Verify the stats update to reflect the new year
    await expect(page.locator(`text=contributions in ${currentYear - 1}`)).toBeVisible();
  });

  test('should have functioning refresh button', async ({ page }) => {
    // Wait for habit tracker to load
    await page.waitForSelector('text=Pull Request Habit Tracker');
    
    // Check refresh button is present
    const refreshButton = page.locator('button:has-text("Refresh")');
    await expect(refreshButton).toBeVisible();
    
    // Click refresh button
    await refreshButton.click();
    
    // Wait for the refresh to complete (loading state should appear and disappear)
    await page.waitForTimeout(1000);
    
    // Verify the component is still visible after refresh
    await expect(page.locator('text=Pull Request Habit Tracker')).toBeVisible();
  });

  test('should display calendar grid with contribution squares', async ({ page }) => {
    // Wait for habit tracker to load
    await page.waitForSelector('text=Pull Request Habit Tracker');
    
    // Wait for calendar to render
    await page.waitForTimeout(2000);
    
    // Check for calendar grid structure
    // The calendar should have contribution squares (small divs with background colors)
    const calendarSquares = page.locator('div[title*="pull requests"]');
    
    // There should be many squares (one for each day of the year)
    const count = await calendarSquares.count();
    expect(count).toBeGreaterThan(300); // Should have ~365 squares for a full year
    
    // Check that squares have appropriate styling
    const firstSquare = calendarSquares.first();
    await expect(firstSquare).toHaveClass(/w-3 h-3/);
  });

  test('should show hover tooltips on calendar squares', async ({ page }) => {
    // Wait for habit tracker to load
    await page.waitForSelector('text=Pull Request Habit Tracker');
    
    // Wait for calendar to render
    await page.waitForTimeout(2000);
    
    // Find a calendar square and hover over it
    const calendarSquare = page.locator('div[title*="pull requests"]').first();
    await calendarSquare.hover();
    
    // Check that the title attribute contains date and PR count information
    const title = await calendarSquare.getAttribute('title');
    expect(title).toContain('pull requests');
    expect(title).toMatch(/\d{4}/); // Should contain a year
  });

  test('should be responsive on mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Navigate to page
    await page.goto('/pull-request-feed');
    await page.waitForLoadState('networkidle');
    
    // Check that habit tracker is still visible and functional
    await expect(page.locator('text=Pull Request Habit Tracker')).toBeVisible();
    
    // Check that controls are accessible
    await expect(page.locator('select')).toBeVisible();
    await expect(page.locator('button:has-text("Refresh")')).toBeVisible();
    
    // Check that calendar grid is still visible (may be scrollable)
    await expect(page.locator('text=Less')).toBeVisible();
    await expect(page.locator('text=More')).toBeVisible();
  });

  test('should handle API errors gracefully', async ({ page }) => {
    // Mock API to return error
    await page.route('**/api/github/habit-tracker/stats', (route) => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Internal server error' })
      });
    });
    
    await page.route('**/api/github/habit-tracker/entries**', (route) => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Internal server error' })
      });
    });
    
    // Navigate to page
    await page.goto('/pull-request-feed');
    await page.waitForLoadState('networkidle');
    
    // Check that error state is displayed
    await expect(page.locator('text=Error loading habit tracker')).toBeVisible();
    await expect(page.locator('button:has-text("Try Again")')).toBeVisible();
  });

  test('should integrate with pull request feed page layout', async ({ page }) => {
    // Navigate to pull request feed page
    await page.goto('/pull-request-feed');
    await page.waitForLoadState('networkidle');
    
    // Check that both habit tracker and pull request feed are present
    await expect(page.locator('text=Pull Request Habit Tracker')).toBeVisible();
    await expect(page.locator('text=Pull Request Activity')).toBeVisible();
    
    // Check that habit tracker appears before pull request feed
    const habitTracker = page.locator('text=Pull Request Habit Tracker');
    const prFeed = page.locator('text=Pull Request Activity');
    
    const habitTrackerBox = await habitTracker.boundingBox();
    const prFeedBox = await prFeed.boundingBox();
    
    // Habit tracker should be above pull request feed
    expect(habitTrackerBox!.y).toBeLessThan(prFeedBox!.y);
  });

  test('should maintain state during interactions', async ({ page }) => {
    // Navigate to page
    await page.goto('/pull-request-feed');
    await page.waitForLoadState('networkidle');
    
    // Wait for habit tracker to load
    await page.waitForSelector('text=Pull Request Habit Tracker');
    
    // Get initial stats
    const initialStats = await page.locator('text=contributions in').textContent();
    
    // Change year and back
    const yearSelect = page.locator('select');
    const currentYear = new Date().getFullYear().toString();
    await yearSelect.selectOption((currentYear - 1).toString());
    await page.waitForTimeout(1000);
    await yearSelect.selectOption(currentYear);
    
    // Check that stats are consistent
    await expect(page.locator('text=contributions in')).toBeVisible();
    
    // Refresh data
    await page.locator('button:has-text("Refresh")').click();
    await page.waitForTimeout(1000);
    
    // Component should still be functional
    await expect(page.locator('text=Pull Request Habit Tracker')).toBeVisible();
    await expect(page.locator('text=contributions in')).toBeVisible();
  });
});