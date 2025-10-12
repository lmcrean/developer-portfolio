import { Octokit } from '@octokit/rest';
import { PaginationMeta } from '../../types';
import { ensureSufficientRateLimit } from '../../utils/rateLimitUtils';
import { GetPullRequestsResult } from './types';
import { fetchSearchResults, getTotalPullRequestCount } from './search';
import { convertSearchResultsToPRs } from './conversion';

/**
 * Fetch pull requests for a user using GitHub's search API
 * This provides better coverage across all repositories the user has contributed to
 */
export async function fetchPullRequests(
  octokit: Octokit,
  username: string,
  page: number = 1,
  perPage: number = 20,
  token?: string
): Promise<GetPullRequestsResult> {
  console.log(`🔍 Searching for PRs by ${username} using GitHub Search API (page ${page})`);

  // Check if we have sufficient rate limit for this operation
  const hasRateLimit = await ensureSufficientRateLimit(octokit, 'pull_requests', perPage);
  if (!hasRateLimit) {
    throw new Error('Insufficient GitHub API rate limit for pull requests operation');
  }

  const searchQuery = `author:${username} type:pr`;

  // Fetch search results from GitHub using native pagination
  const searchItems = await fetchSearchResults(octokit, searchQuery, page, perPage);

  // Get total count for pagination
  const totalCount = await getTotalPullRequestCount(octokit, searchQuery);

  // Convert search results to our format with detailed data
  const paginatedPRs = await convertSearchResultsToPRs(octokit, searchItems, token);

  // Calculate pagination metadata
  const totalPages = Math.ceil(totalCount / perPage);
  const pagination: PaginationMeta = {
    page,
    per_page: perPage,
    total_count: totalCount,
    total_pages: totalPages,
    has_next_page: page < totalPages,
    has_previous_page: page > 1
  };

  console.log(`✅ Returning ${paginatedPRs.length} PRs for ${username} (page ${page}/${totalPages}, total: ${totalCount})`);

  if (paginatedPRs.length > 0) {
    console.log(`📄 First PR on this page: ${paginatedPRs[0]?.title} (${paginatedPRs[0]?.created_at})`);
  }

  return {
    pullRequests: paginatedPRs,
    pagination
  };
}

// Re-export types for convenience
export * from './types'; 