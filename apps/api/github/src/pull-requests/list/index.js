"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchPullRequests = fetchPullRequests;
const rateLimitUtils_1 = require("../../utils/rateLimitUtils");
const search_1 = require("./search");
const conversion_1 = require("./conversion");
/**
 * Fetch pull requests for a user using GitHub's search API
 * This provides better coverage across all repositories the user has contributed to
 */
async function fetchPullRequests(octokit, username, page = 1, perPage = 20) {
    console.log(`🔍 Searching for PRs by ${username} using GitHub Search API (page ${page})`);
    // Check if we have sufficient rate limit for this operation
    const hasRateLimit = await (0, rateLimitUtils_1.ensureSufficientRateLimit)(octokit, 'pull_requests', perPage);
    if (!hasRateLimit) {
        throw new Error('Insufficient GitHub API rate limit for pull requests operation');
    }
    const searchQuery = `author:${username} type:pr`;
    // Fetch search results from GitHub using native pagination
    const searchItems = await (0, search_1.fetchSearchResults)(octokit, searchQuery, page, perPage);
    // Get total count for pagination
    const totalCount = await (0, search_1.getTotalPullRequestCount)(octokit, searchQuery);
    // Convert search results to our format with detailed data
    const paginatedPRs = await (0, conversion_1.convertSearchResultsToPRs)(octokit, searchItems);
    // Calculate pagination metadata
    const totalPages = Math.ceil(totalCount / perPage);
    const pagination = {
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
__exportStar(require("./types"), exports);
