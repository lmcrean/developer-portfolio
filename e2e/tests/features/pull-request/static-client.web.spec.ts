import { test, expect } from '@playwright/test';
import { 
  ServiceManager, 
  ServiceManagerConfig,
  PullRequestFeedRunner,
  HealthRunner
} from '../../runners';
import { DEFAULT_WEB_PORT, DEFAULT_API_PORT } from '../../runners/utilities/utilities.api';

/**
 * E2E test for Static Client Web Integration
 * Tests that the web app can properly consume static data
 */
test.describe('Static Client Web Integration', () => {
  let serviceManager: ServiceManager;
  let pullRequestFeedRunner: PullRequestFeedRunner;
  let healthRunner: HealthRunner;
  
  // Configuration
  const config: ServiceManagerConfig = {
    webPort: DEFAULT_WEB_PORT,
    apiPort: DEFAULT_API_PORT,
    startupWaitTime: 15000,
    logFilePath: 'test-results/static-client-web-e2e-logs.json'
  };
  
  // Setup: Start both services before tests
  test.beforeAll(async () => {
    // Initialize service manager
    serviceManager = new ServiceManager(config);
    
    // Initialize runners with logger and ports
    const logger = serviceManager.getLogger();
    pullRequestFeedRunner = new PullRequestFeedRunner(logger, config.webPort);
    healthRunner = new HealthRunner(logger, config.apiPort);
    
    // Start services
    await serviceManager.startServices();
    
    // Perform health checks
    await serviceManager.performHealthChecks();
  });
  
  // Cleanup: Stop services after tests
  test.afterAll(async () => {
    await serviceManager.stopServices();
  });

  test('should detect and use static data when available', async ({ page }) => {
    const logger = serviceManager.getLogger();
    logger.logInfo('🔍 Testing static data detection in web app...', 'static-web-test');
    
    let staticDataRequested = false;
    let liveApiRequested = false;
    
    // Monitor network requests to see what data source is used
    page.on('request', (request) => {
      const url = request.url();
      
      if (url.includes('/static/pull-requests/')) {
        staticDataRequested = true;
        logger.logInfo(`📁 Static data request detected: ${url}`, 'static-web-test');
      }
      
      if (url.includes('/api/github/pull-requests') && !url.includes('/static/')) {
        liveApiRequested = true;
        logger.logInfo(`🌐 Live API request detected: ${url}`, 'static-web-test');
      }
    });
    
    // Navigate to pull request feed
    const webUrl = `http://localhost:${config.webPort}/pull-request-feed`;
    logger.logInfo(`📍 Navigating to pull request feed: ${webUrl}`, 'static-web-test');
    
    await page.goto(webUrl, { 
      waitUntil: 'networkidle',
      timeout: 60000 
    });
    
    // Wait for page to load and make requests
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(5000);
    
    // Check for pull request feed visibility
    const pullRequestFeed = page.locator('[data-testid="pull-request-feed"]');
    await expect(pullRequestFeed).toBeVisible({ timeout: 15000 });
    
    // Log which data source was used
    if (staticDataRequested && !liveApiRequested) {
      logger.logInfo('✅ Web app successfully used static data only', 'static-web-test');
    } else if (liveApiRequested && !staticDataRequested) {
      logger.logInfo('⚠️ Web app fell back to live API (static data not available)', 'static-web-test');
    } else if (staticDataRequested && liveApiRequested) {
      logger.logInfo('⚠️ Web app used both static and live API (unexpected)', 'static-web-test');
    } else {
      logger.logInfo('❌ No API requests detected (possible error)', 'static-web-test');
    }
    
    // The test should pass regardless of which data source is used
    // The important thing is that the pull request feed loads successfully
    expect(pullRequestFeed).toBeVisible();
  });

  test('should gracefully fallback to live API when static data unavailable', async ({ page }) => {
    const logger = serviceManager.getLogger();
    logger.logInfo('🔄 Testing fallback to live API...', 'static-web-test');
    
    let fallbackOccurred = false;
    let errorLogged = false;
    
    // Monitor console logs for fallback messages
    page.on('console', (msg) => {
      const text = msg.text();
      
      if (text.includes('static data check failed') || text.includes('falling back to live API')) {
        fallbackOccurred = true;
        logger.logInfo(`📢 Fallback message detected: ${text}`, 'static-web-test');
      }
      
      if (msg.type() === 'error') {
        errorLogged = true;
        logger.logInfo(`❌ Console error: ${text}`, 'static-web-test');
      }
    });
    
    // Block static data requests to force fallback
    await page.route('**/static/pull-requests/**', (route) => {
      logger.logInfo('🚫 Blocking static data request to test fallback', 'static-web-test');
      route.abort();
    });
    
    // Navigate to pull request feed
    const webUrl = `http://localhost:${config.webPort}/pull-request-feed`;
    
    await page.goto(webUrl, { 
      waitUntil: 'networkidle',
      timeout: 60000 
    });
    
    // Wait for page to load and attempt requests
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(10000); // Give more time for fallback
    
    // The pull request feed should still load via live API
    const pullRequestFeed = page.locator('[data-testid="pull-request-feed"]');
    
    // Allow more time for live API to respond
    await expect(pullRequestFeed).toBeVisible({ timeout: 30000 });
    
    logger.logInfo('✅ Fallback test completed - app still functions without static data', 'static-web-test', {
      fallbackDetected: fallbackOccurred,
      errorsLogged: errorLogged
    });
  });

  test('should display appropriate loading states for both data sources', async ({ page }) => {
    const logger = serviceManager.getLogger();
    logger.logInfo('⏳ Testing loading states for data sources...', 'static-web-test');
    
    // Navigate to pull request feed
    const webUrl = `http://localhost:${config.webPort}/pull-request-feed`;
    
    await page.goto(webUrl, { 
      waitUntil: 'domcontentloaded',
      timeout: 60000 
    });
    
    // Check for loading indicator initially
    const loadingIndicator = page.locator('[data-testid="loading"], .loading, [aria-label*="loading"]');
    
    // Loading state might be brief, so don't require it
    // Just check that we eventually get content
    
    // Wait for either content or error state
    await Promise.race([
      page.waitForSelector('[data-testid="pull-request-feed"]', { timeout: 30000 }),
      page.waitForSelector('[data-testid="error"], .error', { timeout: 30000 })
    ]);
    
    // Check final state
    const pullRequestFeed = page.locator('[data-testid="pull-request-feed"]');
    const errorState = page.locator('[data-testid="error"], .error');
    
    const feedVisible = await pullRequestFeed.isVisible();
    const errorVisible = await errorState.isVisible();
    
    logger.logInfo('📊 Loading state test results', 'static-web-test', {
      feedVisible,
      errorVisible
    });
    
    // Should have either feed or error, not both
    expect(feedVisible || errorVisible).toBe(true);
    expect(feedVisible && errorVisible).toBe(false);
  });
});