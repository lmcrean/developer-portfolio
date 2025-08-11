import { Octokit } from '@octokit/rest';
import { retryApiCall, delay } from '../../utils/rateLimitUtils';
import { SearchItem } from './types';

/**
 * Fetch search results from GitHub's search API using native pagination
 */
export async function fetchSearchResults(
  octokit: Octokit, 
  searchQuery: string, 
  page: number,
  perPage: number
): Promise<SearchItem[]> {
  try {
    const { data: searchResults } = await retryApiCall(() => 
      octokit.rest.search.issuesAndPullRequests({
        q: searchQuery,
        sort: 'created',
        order: 'desc',
        per_page: perPage,
        page: page
      })
    );

    // Log total count from response
    console.log(`📊 Found ${searchResults.total_count} total PRs via search`);
    
    return searchResults.items;
  } catch (error) {
    console.warn(`⚠️ Failed to fetch GitHub search page ${page}:`, error);
    return [];
  }
}

/**
 * Get total count of pull requests for pagination
 */
export async function getTotalPullRequestCount(octokit: Octokit, searchQuery: string): Promise<number> {
  try {
    const { data: countSearch } = await retryApiCall(() =>
      octokit.rest.search.issuesAndPullRequests({
        q: searchQuery,
        sort: 'created',
        order: 'desc',
        per_page: 1,
        page: 1
      })
    );
    return countSearch.total_count;
  } catch (error) {
    console.warn('⚠️ Failed to get total PR count:', error);
    return 0;
  }
} 