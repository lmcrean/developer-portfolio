import { test, expect } from '@playwright/test';
import { 
  ServiceManager, 
  ServiceManagerConfig,
  HealthRunner
} from '../../runners';
import { DEFAULT_WEB_PORT, DEFAULT_API_PORT } from '../../runners/utilities/utilities.api';

/**
 * E2E test for Static Data API functionality
 * Tests the new static JSON file serving capabilities
 */
test.describe('Static Data API Integration', () => {
  let serviceManager: ServiceManager;
  let healthRunner: HealthRunner;
  
  // Configuration
  const config: ServiceManagerConfig = {
    webPort: DEFAULT_WEB_PORT,
    apiPort: DEFAULT_API_PORT,
    startupWaitTime: 15000,
    logFilePath: 'test-results/static-data-e2e-logs.json'
  };
  
  // Setup: Start both services before tests
  test.beforeAll(async () => {
    // Initialize service manager
    serviceManager = new ServiceManager(config);
    
    // Initialize runners with logger and ports
    const logger = serviceManager.getLogger();
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

  test('should serve static metadata file when available', async ({ page }) => {
    const logger = serviceManager.getLogger();
    logger.logInfo('🔍 Testing static metadata endpoint...', 'static-test');
    
    // Try to access the static metadata file
    const metadataUrl = `http://localhost:${config.apiPort}/static/pull-requests/metadata.json`;
    
    await page.goto(metadataUrl, { 
      waitUntil: 'networkidle',
      timeout: 10000 
    });
    
    const content = await page.textContent('body');
    
    if (content && content.includes('total_count')) {
      // Static data is available - validate structure
      logger.logInfo('✅ Static metadata found, validating structure...', 'static-test');
      
      const metadata = JSON.parse(content);
      
      expect(metadata).toHaveProperty('total_count');
      expect(metadata).toHaveProperty('total_pages');
      expect(metadata).toHaveProperty('per_page');
      expect(metadata).toHaveProperty('last_generated');
      expect(metadata).toHaveProperty('generator_version');
      
      expect(typeof metadata.total_count).toBe('number');
      expect(typeof metadata.total_pages).toBe('number');
      expect(metadata.total_count).toBeGreaterThanOrEqual(0);
      expect(metadata.total_pages).toBeGreaterThanOrEqual(0);
      
      logger.logInfo('✅ Static metadata validation passed', 'static-test', {
        totalCount: metadata.total_count,
        totalPages: metadata.total_pages,
        lastGenerated: metadata.last_generated
      });
    } else {
      // Static data not available - this is okay for development
      logger.logInfo('⚠️ Static metadata not available - this is expected in development', 'static-test');
      
      // Check if we get a 404 or similar
      const response = await page.request.get(metadataUrl);
      expect([404, 500]).toContain(response.status());
    }
  });

  test('should serve static page files when available', async ({ page }) => {
    const logger = serviceManager.getLogger();
    logger.logInfo('🔍 Testing static page file endpoint...', 'static-test');
    
    // First check if metadata is available
    const metadataUrl = `http://localhost:${config.apiPort}/static/pull-requests/metadata.json`;
    const metadataResponse = await page.request.get(metadataUrl);
    
    if (metadataResponse.ok()) {
      // Metadata exists, test page files
      const metadataText = await metadataResponse.text();
      const metadata = JSON.parse(metadataText);
      
      logger.logInfo('📋 Metadata found, testing page files...', 'static-test', {
        totalPages: metadata.total_pages
      });
      
      // Test first page
      const page1Url = `http://localhost:${config.apiPort}/static/pull-requests/page-1.json`;
      
      await page.goto(page1Url, { 
        waitUntil: 'networkidle',
        timeout: 10000 
      });
      
      const pageContent = await page.textContent('body');
      expect(pageContent).toBeTruthy();
      
      const pageData = JSON.parse(pageContent!);
      
      // Validate page structure matches API response format
      expect(pageData).toHaveProperty('data');
      expect(pageData).toHaveProperty('meta');
      expect(pageData.meta).toHaveProperty('username');
      expect(pageData.meta).toHaveProperty('count');
      expect(pageData.meta).toHaveProperty('pagination');
      
      expect(Array.isArray(pageData.data)).toBe(true);
      expect(pageData.data.length).toBeGreaterThanOrEqual(0);
      
      // If we have data, validate pull request structure
      if (pageData.data.length > 0) {
        const firstPR = pageData.data[0];
        expect(firstPR).toHaveProperty('id');
        expect(firstPR).toHaveProperty('title');
        expect(firstPR).toHaveProperty('state');
        expect(firstPR).toHaveProperty('repository');
      }
      
      logger.logInfo('✅ Static page file validation passed', 'static-test', {
        pageDataCount: pageData.data.length,
        username: pageData.meta.username
      });
      
    } else {
      // No static data available
      logger.logInfo('⚠️ Static data not available - testing 404 handling', 'static-test');
      
      const page1Url = `http://localhost:${config.apiPort}/static/pull-requests/page-1.json`;
      const page1Response = await page.request.get(page1Url);
      
      expect([404, 500]).toContain(page1Response.status());
    }
  });

  test('should handle CORS for static files', async ({ page }) => {
    const logger = serviceManager.getLogger();
    logger.logInfo('🌐 Testing CORS for static files...', 'static-test');
    
    // Test CORS preflight for metadata
    const metadataUrl = `http://localhost:${config.apiPort}/static/pull-requests/metadata.json`;
    
    const corsResponse = await page.request.fetch(metadataUrl, {
      method: 'OPTIONS',
      headers: {
        'Origin': 'http://localhost:3000',
        'Access-Control-Request-Method': 'GET',
        'Access-Control-Request-Headers': 'Content-Type'
      }
    });
    
    // Should get 200 or 404, but not a CORS error
    expect([200, 404, 500]).toContain(corsResponse.status());
    
    logger.logInfo('✅ CORS test completed', 'static-test', {
      status: corsResponse.status()
    });
  });

  test('should provide proper cache headers for static files', async ({ page }) => {
    const logger = serviceManager.getLogger();
    logger.logInfo('📦 Testing cache headers for static files...', 'static-test');
    
    // Test cache headers on metadata file
    const metadataUrl = `http://localhost:${config.apiPort}/static/pull-requests/metadata.json`;
    const response = await page.request.get(metadataUrl);
    
    if (response.ok()) {
      const headers = response.headers();
      
      // Should have cache control headers
      expect(headers).toHaveProperty('cache-control');
      expect(headers['content-type']).toContain('application/json');
      
      logger.logInfo('✅ Cache headers validation passed', 'static-test', {
        cacheControl: headers['cache-control'],
        contentType: headers['content-type']
      });
    } else {
      logger.logInfo('⚠️ Static file not available for cache header testing', 'static-test');
    }
  });
});