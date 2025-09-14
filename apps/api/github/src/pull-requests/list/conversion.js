"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertSearchResultsToPRs = convertSearchResultsToPRs;
exports.fetchDetailedPRData = fetchDetailedPRData;
const rateLimitUtils_1 = require("../../utils/rateLimitUtils");
/**
 * Convert search results to detailed PR objects
 * Limits the number of detailed API calls to prevent rate limiting during tests
 */
async function convertSearchResultsToPRs(octokit, searchItems) {
    const allPRs = [];
    // Limit the number of detailed API calls to prevent rate limiting during tests
    const maxDetailedCalls = Math.min(searchItems.length, 20);
    console.log(`🔄 Processing ${maxDetailedCalls} PRs out of ${searchItems.length} found items`);
    for (let i = 0; i < maxDetailedCalls; i++) {
        const item = searchItems[i];
        try {
            const prData = await fetchDetailedPRData(octokit, item);
            allPRs.push(prData);
        }
        catch (prError) {
            console.warn(`⚠️ Failed to fetch details for PR ${item.number}:`, prError);
            continue;
        }
    }
    return allPRs;
}
/**
 * Fetch detailed data for a single pull request
 */
async function fetchDetailedPRData(octokit, item) {
    // Extract owner and repo from the URL
    const urlParts = item.html_url.split('/');
    const owner = urlParts[3];
    const repo = urlParts[4];
    // Get the full PR details with retry logic
    const { data: pr } = await (0, rateLimitUtils_1.retryApiCall)(() => octokit.rest.pulls.get({
        owner,
        repo,
        pull_number: item.number
    }));
    // Get repository details with retry logic
    const { data: repoData } = await (0, rateLimitUtils_1.retryApiCall)(() => octokit.rest.repos.get({
        owner,
        repo
    }));
    // Add small delay between API calls to be respectful
    await (0, rateLimitUtils_1.delay)(50);
    return {
        id: pr.id,
        number: pr.number,
        title: pr.title,
        description: pr.body || null,
        created_at: pr.created_at,
        merged_at: pr.merged_at,
        html_url: pr.html_url,
        state: pr.merged_at ? 'merged' : pr.state,
        additions: pr.additions,
        deletions: pr.deletions,
        comments: pr.comments,
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
