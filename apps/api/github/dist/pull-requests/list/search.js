"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchSearchResults = fetchSearchResults;
exports.getTotalPullRequestCount = getTotalPullRequestCount;
const rateLimitUtils_1 = require("../../utils/rateLimitUtils");
/**
 * Fetch search results from GitHub's search API with pagination support
 */
async function fetchSearchResults(octokit, searchQuery, itemsNeeded) {
    const githubPagesNeeded = Math.ceil(itemsNeeded / 100); // GitHub search returns max 100 per page
    let allSearchItems = [];
    for (let githubPage = 1; githubPage <= githubPagesNeeded; githubPage++) {
        const itemsToFetchThisPage = Math.min(100, itemsNeeded - ((githubPage - 1) * 100));
        if (itemsToFetchThisPage <= 0)
            break;
        try {
            const { data: searchResults } = await (0, rateLimitUtils_1.retryApiCall)(() => octokit.rest.search.issuesAndPullRequests({
                q: searchQuery,
                sort: 'created',
                order: 'desc',
                per_page: itemsToFetchThisPage,
                page: githubPage
            }));
            allSearchItems.push(...searchResults.items);
            // Store total count from first page response
            if (githubPage === 1) {
                console.log(`📊 Found ${searchResults.total_count} total PRs via search`);
            }
            // If this page returned fewer items than requested, we've hit the end
            if (searchResults.items.length < itemsToFetchThisPage) {
                break;
            }
            // Add small delay between API calls to be respectful
            if (githubPage < githubPagesNeeded) {
                await (0, rateLimitUtils_1.delay)(100);
            }
        }
        catch (error) {
            console.warn(`⚠️ Failed to fetch GitHub search page ${githubPage}:`, error);
            break;
        }
    }
    return allSearchItems;
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
//# sourceMappingURL=search.js.map