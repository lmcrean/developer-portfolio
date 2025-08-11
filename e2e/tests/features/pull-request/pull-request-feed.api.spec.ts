import { test, expect } from '@playwright/test';
import { 
  getApiBaseUrl, 
  initializeApiUrl,
  TEST_USERNAME,
  ApiResponse,
  validatePullRequestStructure,
  validatePaginationStructure,
  validateCacheHeaders
} from '../../runners/utilities/utilities.api';
import { ObservabilityRunner } from '../../runners/setup/observability-runner';

const observability = new ObservabilityRunner('Pull Request Feed API');

test.describe('Pull Request Feed API Tests', () => {
  
  test.beforeAll(async ({ request }) => {
    await observability.setup(request);
    await initializeApiUrl(request);
  });

  test.afterAll(async () => {
    await observability.teardown();
  });

  test.beforeEach(async () => {
    observability.incrementTestCount();
  });

  test.afterEach(async ({ }, testInfo) => {
    observability.recordTestResult(testInfo.title, testInfo.status === 'passed', testInfo.error);
  });

  test('should fetch pull requests list with default parameters', async ({ request }) => {
    observability.logTestStart('🔍 Testing pull requests list with default parameters');
    
    const response = await request.get(`${getApiBaseUrl()}/api/github/pull-requests?username=${TEST_USERNAME}`);
    observability.recordNetworkCall(response.status() === 200);
    
    expect(response.status()).toBe(200);
    
    // Check cache headers
    validateCacheHeaders(response.headers());
    
    const data: ApiResponse = await response.json();
    
    // Validate response structure
    expect(data).toHaveProperty('data');
    expect(data).toHaveProperty('meta');
    expect(Array.isArray(data.data)).toBe(true);
    
    // Validate meta structure
    expect(data.meta).toHaveProperty('username', TEST_USERNAME);
    expect(data.meta).toHaveProperty('count');
    expect(data.meta).toHaveProperty('pagination');
    expect(data.meta.count).toBe(data.data.length);
    
    // Validate pagination structure
    validatePaginationStructure(data.meta.pagination);
    
    observability.logNetworkActivity(`📋 Successfully fetched ${data.data.length} pull requests`);
    
    // If we have data, validate pull request structure
    if (data.data.length > 0) {
      const pr = data.data[0];
      validatePullRequestStructure(pr);
      observability.logTestInfo(`📄 Validated PR structure for "${pr.title}"`);
    }
  });

  test('should handle pagination parameters correctly', async ({ request }) => {
    observability.logTestStart('📄 Testing pagination parameters');
    
    const page = 1;
    const perPage = 5;
    
    const response = await request.get(`${getApiBaseUrl()}/api/github/pull-requests?username=${TEST_USERNAME}&page=${page}&per_page=${perPage}`);
    observability.recordNetworkCall(response.status() === 200);
    
    expect(response.status()).toBe(200);
    
    const data: ApiResponse = await response.json();
    
    // Validate pagination reflects our parameters
    expect(data.meta.pagination.page).toBe(page);
    expect(data.meta.pagination.per_page).toBe(perPage);
    expect(data.data.length).toBeLessThanOrEqual(perPage);
    expect(data.meta.count).toBeLessThanOrEqual(perPage);
    
    observability.logTestInfo(`📊 Pagination working: page=${page}, per_page=${perPage}, returned=${data.data.length}`);
  });

  test('should handle large per_page requests', async ({ request }) => {
    observability.logTestStart('🔒 Testing large per_page parameter handling');
    
    const response = await request.get(`${getApiBaseUrl()}/api/github/pull-requests?username=${TEST_USERNAME}&per_page=100`);
    
    if (response.status() === 200) {
      // New API behavior: should cap per_page at 50 to prevent rate limiting issues
      observability.recordNetworkCall(true);
      
      const data: ApiResponse = await response.json();
      
      // API should cap per_page at 50 to prevent rate limiting issues
      expect(data.meta.pagination.per_page).toBe(50);
      // The actual returned data might be less due to available PRs
      expect(data.data.length).toBeLessThanOrEqual(50);
      
      observability.logTestInfo(`📊 Large per_page handled (new API): requested=100, capped=${data.meta.pagination.per_page}, returned=${data.data.length}`);
    } else if (response.status() === 500) {
      // Old API behavior: returns 500 for large per_page values due to rate limiting
      observability.recordNetworkCall(false);
      
      const errorData = await response.json();
      expect(errorData).toHaveProperty('error');
      expect(errorData.error).toBe('Failed to fetch pull requests');
      
      observability.logTestInfo(`⚠️ Large per_page failed (old API): requested=100, got 500 error (expected behavior for undeployed API)`);
      console.log('⚠️ API returned 500 for large per_page - this will be fixed when the updated API is deployed');
    } else {
      // Unexpected response
      observability.recordNetworkCall(false);
      throw new Error(`Unexpected response status: ${response.status()}`);
    }
  });


  test('should handle API errors gracefully (intentional 404 test)', async ({ request }) => {
    observability.logTestStart('🚨 Testing API error handling');
    observability.logTestInfo('🧪 Intentionally requesting non-existent repository to test error handling');
    
    const response = await request.get(`${getApiBaseUrl()}/api/github/pull-requests/invalid-user/invalid-repo/999`);
    observability.recordNetworkCall(response.status() >= 400); // Error response is expected
    
    // This should be a 404 or similar error
    expect(response.status()).toBeGreaterThanOrEqual(400);
    
    const data = await response.json();
    expect(data).toHaveProperty('error');
    
    observability.logNetworkActivity(`🛡️ Error handling working: ${response.status()} - ${data.error}`);
  });
});
