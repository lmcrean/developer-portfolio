/**
 * Axios HTTP client configuration
 * Simple, reliable API client using runtime configuration
 */

import axios from 'axios';

/**
 * Get API base URL from runtime configuration or fallback
 */
const getApiBaseUrl = (): string => {
  // Check for runtime configuration (generated during build)
  if (typeof window !== 'undefined' && (window as any).APP_CONFIG?.apiBaseUrl) {
    return (window as any).APP_CONFIG.apiBaseUrl;
  }
  
  // Development fallback
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1') {
      return 'http://localhost:3000';
    }
  }
  
  // Production fallback
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