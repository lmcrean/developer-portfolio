import { test, expect } from '@playwright/test';

/**
 * E2E test for Single Server Static Data Architecture
 * Tests that the web app serves static data from the same origin without needing an API server
 */
test.describe('Single Server Static Data Architecture', () => {
  
  test('should load static data from same origin without API server', async ({ page }) => {
    // Track console messages to verify static data loading behavior
    const consoleMessages: string[] = [];
    const networkRequests: string[] = [];
    let staticDataRequested = false;
    let apiServerRequested = false;
    
    // Capture console logs for debugging
    page.on('console', (msg) => {
      const text = msg.text();
      consoleMessages.push(`[${msg.type()}] ${text}`);
      
      // Look for static client initialization messages
      if (text.includes('Static client initialized') || text.includes('same-origin')) {
        console.log('✅ Static client initialized with same-origin:', text);
      }
      
      // Look for static data success messages
      if (text.includes('Static metadata loaded') || text.includes('Static page') && text.includes('loaded')) {
        console.log('✅ Static data loaded successfully:', text);
      }
      
      // Look for fallback messages (should not happen in single server)
      if (text.includes('Failed to fetch static metadata') || text.includes('falling back to live API')) {
        console.log('⚠️ Unexpected fallback detected:', text);
      }
    });
    
    // Monitor network requests
    page.on('request', (request) => {
      const url = request.url();
      networkRequests.push(url);
      
      // Check for static data requests (same-origin)
      if (url.includes('/static/pull-requests/')) {
        staticDataRequested = true;
        console.log('📁 Static data request detected:', url);
      }
      
      // Check for API server requests (should not happen)
      if (url.includes('/api/github/pull-requests') && !url.includes('/static/')) {
        apiServerRequested = true;
        console.log('🌐 Unexpected API server request:', url);
      }
    });
    
    // Navigate to the homepage where pull request feed loads
    const webUrl = 'http://localhost:3021';
    console.log(`📍 Testing single server setup at: ${webUrl}`);
    
    await page.goto(webUrl, { 
      waitUntil: 'networkidle',
      timeout: 60000 
    });
    
    // Wait for page to fully load
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(5000); // Give time for static data requests
    
    // Check that the pull request feed is visible
    const pullRequestFeed = page.locator('[data-testid="pull-request-feed"], .pull-request-feed, [class*="pull-request"]').first();
    await expect(pullRequestFeed).toBeVisible({ timeout: 30000 });
    
    // Verify static data was requested from same origin
    expect(staticDataRequested).toBe(true);
    console.log('✅ Static data was successfully requested from same origin');
    
    // Verify no API server requests were made
    expect(apiServerRequested).toBe(false);
    console.log('✅ No API server requests made - single server architecture working');
    
    // Log network requests for debugging
    console.log('📊 Network requests made:');
    networkRequests.forEach(url => {
      if (url.includes('/static/pull-requests/') || url.includes('/api/github/')) {
        console.log(`  - ${url}`);
      }
    });
    
    // Log important console messages
    console.log('📢 Important console messages:');
    consoleMessages.forEach(msg => {
      if (msg.includes('Static') || msg.includes('API') || msg.includes('fallback')) {
        console.log(`  - ${msg}`);
      }
    });
  });

  test('should serve static files from web app directory', async ({ page }) => {
    // Direct test of static file availability
    const staticUrls = [
      'http://localhost:3021/static/pull-requests/metadata.json',
      'http://localhost:3021/static/pull-requests/page-1.json'
    ];
    
    for (const url of staticUrls) {
      console.log(`🔍 Testing direct static file access: ${url}`);
      
      const response = await page.request.get(url);
      expect(response.status()).toBe(200);
      
      const contentType = response.headers()['content-type'];
      expect(contentType).toContain('application/json');
      
      const jsonData = await response.json();
      expect(jsonData).toBeDefined();
      
      console.log(`✅ Static file served successfully: ${url}`);
      
      // Validate structure based on file type
      if (url.includes('metadata.json')) {
        expect(jsonData).toHaveProperty('total_count');
        expect(jsonData).toHaveProperty('total_pages');
        expect(jsonData).toHaveProperty('last_generated');
        console.log(`📊 Metadata: ${jsonData.total_count} PRs across ${jsonData.total_pages} pages`);
      } else if (url.includes('page-1.json')) {
        expect(jsonData).toHaveProperty('data');
        expect(jsonData).toHaveProperty('meta');
        expect(Array.isArray(jsonData.data)).toBe(true);
        console.log(`📄 Page 1: ${jsonData.data.length} pull requests loaded`);
      }
    }
  });

  test('should show fast loading performance with static data', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('http://localhost:3021', { 
      waitUntil: 'networkidle',
      timeout: 60000 
    });
    
    // Wait for pull request feed to appear
    const pullRequestFeed = page.locator('[data-testid="pull-request-feed"], .pull-request-feed, [class*="pull-request"]').first();
    await expect(pullRequestFeed).toBeVisible({ timeout: 30000 });
    
    const endTime = Date.now();
    const loadTime = endTime - startTime;
    
    console.log(`⚡ Pull request feed loaded in ${loadTime}ms`);
    
    // With static data, loading should be much faster than live API (< 5 seconds vs ~10 seconds)
    expect(loadTime).toBeLessThan(5000);
    console.log('✅ Fast loading performance achieved with static data');
  });

  test('should handle pagination with static data', async ({ page }) => {
    await page.goto('http://localhost:3021', { 
      waitUntil: 'networkidle',
      timeout: 60000 
    });
    
    // Wait for pull request feed to load
    const pullRequestFeed = page.locator('[data-testid="pull-request-feed"], .pull-request-feed, [class*="pull-request"]').first();
    await expect(pullRequestFeed).toBeVisible({ timeout: 30000 });
    
    // Look for pagination controls
    const paginationControls = page.locator('.pagination, [class*="pagination"], [data-testid*="pagination"]');
    
    if (await paginationControls.count() > 0) {
      console.log('📄 Pagination controls found - testing page navigation');
      
      // Try to click next page if available
      const nextButton = page.locator('button:has-text("Next"), button:has-text("2"), .next, [aria-label*="next"]').first();
      
      if (await nextButton.isVisible()) {
        let staticPage2Requested = false;
        
        page.on('request', (request) => {
          if (request.url().includes('/static/pull-requests/page-2.json')) {
            staticPage2Requested = true;
            console.log('📁 Page 2 static data requested');
          }
        });
        
        await nextButton.click();
        await page.waitForTimeout(2000);
        
        expect(staticPage2Requested).toBe(true);
        console.log('✅ Pagination working with static data');
      } else {
        console.log('⚠️ No next page button available (only one page of data)');
      }
    } else {
      console.log('⚠️ No pagination controls found (possibly single page of data)');
    }
  });
});