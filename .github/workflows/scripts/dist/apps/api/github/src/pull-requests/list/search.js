"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchSearchResults = fetchSearchResults;
exports.getTotalPullRequestCount = getTotalPullRequestCount;
const rateLimitUtils_1 = require("../../utils/rateLimitUtils");
/**
 * Fetch search results from GitHub's search API using native pagination
 */
async function fetchSearchResults(octokit, searchQuery, page, perPage) {
    try {
        const { data: searchResults } = await (0, rateLimitUtils_1.retryApiCall)(() => octokit.rest.search.issuesAndPullRequests({
            q: searchQuery,
            sort: 'created',
            order: 'desc',
            per_page: perPage,
            page: page
        }));
        // Log total count from response
        console.log(`📊 Found ${searchResults.total_count} total PRs via search`);
        return searchResults.items;
    }
    catch (error) {
        console.warn(`⚠️ Failed to fetch GitHub search page ${page}:`, error);
        return [];
    }
}
/**
 * Get total count of pull requests for pagination
 */
async function getTotalPullRequestCount(octokit, searchQuery) {
    try {
        const { data: countSearch } = await (0, rateLimitUtils_1.retryApiCall)(() => octokit.rest.search.issuesAndPullRequests({
            q: searchQuery,
            sort: 'created',
            order: 'desc',
            per_page: 1,
            page: 1
        }));
        return countSearch.total_count;
    }
    catch (error) {
        console.warn('⚠️ Failed to get total PR count:', error);
        return 0;
    }
}
