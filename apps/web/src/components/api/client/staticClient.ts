/**
 * Static JSON client for pre-generated GitHub pull request data
 * 
 * Provides the same interface as axiosClient but serves static JSON files
 * for improved performance (sub-second vs 10-second load times).
 */

import axios, { AxiosResponse } from 'axios';
import {
  PullRequestListData,
  PaginationMeta,
  ApiResponse
} from '@shared/types/pull-requests';

interface StaticDataMetadata {
  total_count: number;
  total_pages: number;
  per_page: number;
  last_generated: string;
  generator_version: string;
  pages_generated: number;
}

interface StaticPageData {
  data: PullRequestListData[];
  meta: {
    username: string;
    count: number;
    pagination: PaginationMeta;
  };
}

/**
 * Get static API base URL for fetching pre-generated JSON files
 * Now uses same-origin paths to serve static data from the web app itself
 */
const getStaticApiBaseUrl = (): string => {
  if (typeof window !== 'undefined') {
    // Use same-origin (no protocol/host) for static data served by web app
    const origin = window.location.origin;
    console.log('🔗 Using same-origin for static data:', origin);
    return origin;
  }
  
  // Server-side rendering fallback (shouldn't be used for static data)
  console.log('🔗 Using empty base URL for server-side rendering');
  return '';
};

const STATIC_API_BASE_URL = getStaticApiBaseUrl();

/**
 * Static client for fetching pre-generated JSON files
 */
class StaticClient {
  private baseURL: string;
  private metadata: StaticDataMetadata | null = null;
  
  constructor() {
    this.baseURL = STATIC_API_BASE_URL;
    console.log('📁 Static client initialized with base URL:', this.baseURL);
  }

  /**
   * Fetch and cache metadata about available static data
   */
  private async getMetadata(): Promise<StaticDataMetadata> {
    if (this.metadata) {
      return this.metadata;
    }

    try {
      const url = `${this.baseURL}/static/pull-requests/metadata.json`;
      console.log('📋 Fetching static data metadata from:', url);
      
      const response = await axios.get<StaticDataMetadata>(url, {
        timeout: 10000,
        headers: { 'Content-Type': 'application/json' }
      });
      
      this.metadata = response.data;
      console.log('✅ Static metadata loaded:', {
        totalCount: this.metadata.total_count,
        totalPages: this.metadata.total_pages,
        lastGenerated: this.metadata.last_generated
      });
      
      return this.metadata;
    } catch (error) {
      console.error('❌ Failed to fetch static metadata:', error);
      throw new Error('Static data not available');
    }
  }

  /**
   * Fetch a specific page of static pull request data
   */
  private async fetchPage(page: number): Promise<StaticPageData> {
    try {
      const url = `${this.baseURL}/static/pull-requests/page-${page}.json`;
      console.log(`📄 Fetching static page ${page} from:`, url);
      
      const response = await axios.get<StaticPageData>(url, {
        timeout: 10000,
        headers: { 'Content-Type': 'application/json' }
      });
      
      console.log(`✅ Static page ${page} loaded with ${response.data.data.length} pull requests`);
      return response.data;
    } catch (error) {
      console.error(`❌ Failed to fetch static page ${page}:`, error);
      throw new Error(`Static page ${page} not available`);
    }
  }

  /**
   * Get pull requests with pagination (mimics live API interface)
   */
  async getPullRequests(params: {
    username: string;
    page?: number;
    per_page?: number;
  }): Promise<AxiosResponse<ApiResponse>> {
    try {
      const page = params.page || 1;
      const perPage = params.per_page || 20;
      
      console.log(`🔄 Getting static pull requests page ${page} for ${params.username}...`);
      
      // Get metadata to validate page request
      const metadata = await this.getMetadata();
      
      // Validate page number
      if (page < 1 || page > metadata.total_pages) {
        throw new Error(`Page ${page} out of range (1-${metadata.total_pages})`);
      }
      
      // Fetch the requested page
      const pageData = await this.fetchPage(page);
      
      // Transform to match live API response format
      const response: ApiResponse = {
        data: pageData.data,
        meta: pageData.meta
      };
      
      // Create mock AxiosResponse to match expected interface
      const axiosResponse: AxiosResponse<ApiResponse> = {
        data: response,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
        request: {}
      };
      
      console.log(`✅ Static pull requests page ${page} returned ${response.data.length} items`);
      return axiosResponse;
      
    } catch (error) {
      console.error('❌ Static pull requests request failed:', error);
      throw error;
    }
  }

  /**
   * Check if static data is available and fresh
   */
  async isStaticDataAvailable(): Promise<boolean> {
    try {
      const metadata = await this.getMetadata();
      
      // Check if data is reasonably fresh (within 8 hours)
      const lastGenerated = new Date(metadata.last_generated);
      const now = new Date();
      const hoursOld = (now.getTime() - lastGenerated.getTime()) / (1000 * 60 * 60);
      
      const isValid = hoursOld < 8;
      console.log(`🕒 Static data is ${hoursOld.toFixed(1)} hours old, valid: ${isValid}`);
      
      return isValid;
    } catch (error) {
      console.log('⚠️ Static data availability check failed:', error);
      return false;
    }
  }

  /**
   * Get information about static data freshness
   */
  async getDataInfo(): Promise<{
    available: boolean;
    lastGenerated?: string;
    totalCount?: number;
    totalPages?: number;
  }> {
    try {
      const metadata = await this.getMetadata();
      return {
        available: true,
        lastGenerated: metadata.last_generated,
        totalCount: metadata.total_count,
        totalPages: metadata.total_pages
      };
    } catch (error) {
      return { available: false };
    }
  }
}

// Export singleton instance
const staticClient = new StaticClient();
export default staticClient;

// Export base URL for testing
export { STATIC_API_BASE_URL };