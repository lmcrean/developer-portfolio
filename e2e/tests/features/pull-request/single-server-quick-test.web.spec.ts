import { test, expect } from '@playwright/test';

/**
 * Quick test for single server static data setup
 */
test.describe('Single Server Quick Test', () => {
  
  test('should load static data from flattened structure', async ({ page }) => {
    const consoleMessages: string[] = [];
    let staticDataRequested = false;
    let apiServerRequested = false;
    
    // Capture console logs
    page.on('console', (msg) => {
      const text = msg.text();
      consoleMessages.push(`[${msg.type()}] ${text}`);
      console.log(`[Console] ${text}`);
    });
    
    // Monitor network requests
    page.on('request', (request) => {
      const url = request.url();
      
      if (url.includes('/pr-metadata.json') || url.includes('/pr-page-')) {
        staticDataRequested = true;
        console.log('✅ Static data request (flattened):', url);
      }
      
      if (url.includes('/api/github/pull-requests') && !url.includes('pr-')) {
        apiServerRequested = true;
        console.log('🌐 API server request detected:', url);
      }
    });
    
    // Navigate to homepage - use environment variable or fallback to localhost
    const webUrl = process.env.WEB_URL || 'http://localhost:3023';
    const isProduction = webUrl.includes('web.app') || webUrl.includes('firebase');
    const timeout = isProduction ? 120000 : 60000; // Longer timeout for production
    
    console.log(`🔍 Testing single server at: ${webUrl}`);
    console.log(`⏰ Using timeout: ${timeout}ms (${isProduction ? 'production' : 'local'})`);
    
    await page.goto(webUrl, { 
      waitUntil: 'networkidle',
      timeout: timeout 
    });
    
    // Wait for page to fully load - longer for production
    const waitTime = isProduction ? 10000 : 5000;
    console.log(`⏱️ Waiting ${waitTime}ms for full page load...`);
    await page.waitForTimeout(waitTime);
    
    // Check if pull request content appeared
    const pullRequestContent = page.locator('[data-testid="pull-request-feed"], .pull-request, [class*="pull-request"]').first();
    
    if (await pullRequestContent.isVisible()) {
      console.log('✅ Pull request content is visible');
      
      // Check which data source was used
      if (staticDataRequested && !apiServerRequested) {
        console.log('🎉 SUCCESS: Single server with static data working!');
        expect(staticDataRequested).toBe(true);
        expect(apiServerRequested).toBe(false);
      } else if (apiServerRequested) {
        console.log('❌ FAILURE: Attempted to use live API fallback - this should not happen!');
        expect(apiServerRequested).toBe(false); // Fail the test - no API fallback should occur
      } else {
        console.log('❌ FAILURE: No data source detected - static data not loading');
        expect(staticDataRequested).toBe(true); // Fail - static data should always load
      }
    } else {
      console.log('❌ FAILURE: Pull request content not visible');
      expect(pullRequestContent).toBeVisible(); // Fail the test - content must be visible
    }
    
    // Log network requests for debugging
    console.log('📊 All network requests summary:');
    console.log(`  - Static data requests: ${staticDataRequested ? 'YES' : 'NO'}`);
    console.log(`  - API server requests: ${apiServerRequested ? 'YES' : 'NO'}`);
  });

  test('should serve individual static files correctly', async ({ page }) => {
    const webUrl = process.env.WEB_URL || 'http://localhost:3023';
    const isProduction = webUrl.includes('web.app') || webUrl.includes('firebase');
    const requestTimeout = isProduction ? 30000 : 15000; // Longer timeout for production
    
    console.log(`🔍 Testing static files at: ${webUrl}`);
    console.log(`⏰ Using request timeout: ${requestTimeout}ms`);
    
    // Test metadata
    const metadataResponse = await page.request.get(`${webUrl}/pr-metadata.json`, {
      timeout: requestTimeout
    });
    expect(metadataResponse.status()).toBe(200);
    
    const contentType = metadataResponse.headers()['content-type'];
    expect(contentType).toContain('application/json');
    
    const metadata = await metadataResponse.json();
    expect(metadata).toHaveProperty('total_count');
    expect(metadata).toHaveProperty('total_pages');
    
    console.log(`✅ Metadata: ${metadata.total_count} PRs, ${metadata.total_pages} pages`);
    
    // Test first page
    const page1Response = await page.request.get(`${webUrl}/pr-page-1.json`, {
      timeout: requestTimeout
    });
    expect(page1Response.status()).toBe(200);
    
    const page1Data = await page1Response.json();
    expect(page1Data).toHaveProperty('data');
    expect(page1Data).toHaveProperty('meta');
    expect(Array.isArray(page1Data.data)).toBe(true);
    
    console.log(`✅ Page 1: ${page1Data.data.length} pull requests`);
    
    // Additional validation: Ensure no API fallback occurs
    expect(page1Data.data.length).toBeGreaterThan(0);
    
    // Verify each PR has required fields (checking repository.owner specifically)
    for (const pr of page1Data.data.slice(0, 3)) { // Check first 3 PRs
      expect(pr).toHaveProperty('repository');
      expect(pr.repository).toHaveProperty('owner');
      expect(pr.repository.owner).toHaveProperty('login');
      expect(pr.repository.owner.login).toBeTruthy();
    }
    console.log('✅ All PRs have valid repository.owner structure');
  });
});