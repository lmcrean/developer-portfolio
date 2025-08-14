import { Octokit } from '@octokit/rest';
import { PullRequestResponse } from '../../types';
import { retryApiCall, delay } from '../../utils/rateLimitUtils';
import { SearchItem } from './types';

/**
 * Convert search results to detailed PR objects
 * Limits the number of detailed API calls to prevent rate limiting during tests
 */
export async function convertSearchResultsToPRs(
  octokit: Octokit, 
  searchItems: SearchItem[]
): Promise<PullRequestResponse[]> {
  const allPRs: PullRequestResponse[] = [];
  
  // Limit the number of detailed API calls to prevent rate limiting during tests
  const maxDetailedCalls = Math.min(searchItems.length, 20);
  console.log(`🔄 Processing ${maxDetailedCalls} PRs out of ${searchItems.length} found items`);
  
  for (let i = 0; i < maxDetailedCalls; i++) {
    const item = searchItems[i];
    try {
      const prData = await fetchDetailedPRData(octokit, item);
      allPRs.push(prData);
    } catch (prError) {
      console.warn(`⚠️ Failed to fetch details for PR ${item.number}:`, prError);
      continue;
    }
  }
  
  return allPRs;
}

/**
 * Fetch detailed data for a single pull request
 */
export async function fetchDetailedPRData(
  octokit: Octokit, 
  item: SearchItem
): Promise<PullRequestResponse> {
  // Extract owner and repo from the URL
  const urlParts = item.html_url.split('/');
  const owner = urlParts[3];
  const repo = urlParts[4];
  
  // Get the full PR details with retry logic
  const { data: pr } = await retryApiCall(() =>
    octokit.rest.pulls.get({
      owner,
      repo,
      pull_number: item.number
    })
  );

  // Get repository details with retry logic
  const { data: repoData } = await retryApiCall(() =>
    octokit.rest.repos.get({
      owner,
      repo
    })
  );

  // Add small delay between API calls to be respectful
  await delay(50);

  return {
    id: pr.id,
    number: pr.number,
    title: pr.title,
    description: pr.body || null,
    created_at: pr.created_at,
    merged_at: pr.merged_at,
    html_url: pr.html_url,
    state: pr.merged_at ? 'merged' as const : pr.state as 'open' | 'closed',
    repository: {
      name: repo,
      description: repoData.description,
      language: repoData.language ?? null,
      html_url: repoData.html_url,
      owner: {
        login: repoData.owner.login,
        avatar_url: repoData.owner.avatar_url
      }
    }
  };
} 