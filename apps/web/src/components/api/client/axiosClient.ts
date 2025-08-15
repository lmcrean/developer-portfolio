/**
 * Axios HTTP client configuration
 * Simple, reliable API client using runtime configuration
 */

import axios from 'axios';

/**
 * Get API base URL from runtime configuration or fallback
 */
const getApiBaseUrl = (): string => {
  if (typeof window !== 'undefined') {
    // Check for Docusaurus injected environment variables
    const docusaurusApiUrl = (window as any).DOCUSAURUS_API_BASE_URL;
    const reactApiUrl = (window as any).REACT_APP_API_BASE_URL;
    
    if (docusaurusApiUrl) {
      console.log('🔗 Using Docusaurus API URL:', docusaurusApiUrl);
      return docusaurusApiUrl;
    }
    
    if (reactApiUrl) {
      console.log('🔗 Using React API URL:', reactApiUrl);
      return reactApiUrl;
    }
    
    // Check for runtime configuration (generated during build)
    if ((window as any).APP_CONFIG?.apiBaseUrl) {
      console.log('🔗 Using APP_CONFIG API URL:', (window as any).APP_CONFIG.apiBaseUrl);
      return (window as any).APP_CONFIG.apiBaseUrl;
    }
    
    // Development fallback
    const hostname = window.location.hostname;
    if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1') {
      console.log('🔗 Using development fallback API URL: http://localhost:3000');
      return 'http://localhost:3000';
    }
  }
  
  // Production fallback
  console.log('🔗 Using production fallback API URL');
  return 'https://api-github-main-329000596728.us-central1.run.app';
};

export const API_BASE_URL = getApiBaseUrl();

/**
 * Create axios instance with static base URL (determined at startup)
 */
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 second timeout (increased for GitHub API calls)
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Response interceptor for handling common response patterns
 */
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle common error patterns
    if (error.code === 'ECONNABORTED') {
      error.message = 'Request timed out. Please try again.';
    } else if (error.response?.status === 404) {
      error.message = error.response?.data?.message || 'Resource not found.';
    } else if (error.response?.status >= 500) {
      error.message = 'Server error. Please try again later.';
    } else if (!error.response) {
      error.message = 'Network error. Please check your connection.';
    }
    
    return Promise.reject(error);
  }
);

export default apiClient; 