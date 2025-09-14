"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatePullRequestParams = validatePullRequestParams;
exports.extractRepoInfoFromUrl = extractRepoInfoFromUrl;
exports.formatPRStats = formatPRStats;
/**
 * Validate pull request parameters before making API calls
 */
function validatePullRequestParams(owner, repo, pullNumber) {
    if (!owner || !repo) {
        throw new Error('Owner and repository name are required');
    }
    if (!pullNumber || pullNumber <= 0) {
        throw new Error('Pull request number must be a positive integer');
    }
    if (isNaN(pullNumber)) {
        throw new Error('Pull request number must be a valid number');
    }
}
/**
 * Extract owner and repo from a GitHub PR URL
 * Useful for parsing URLs from search results
 */
function extractRepoInfoFromUrl(htmlUrl) {
    try {
        const urlParts = htmlUrl.split('/');
        if (urlParts.length < 5 || !urlParts[3] || !urlParts[4]) {
            throw new Error('Invalid GitHub URL format');
        }
        return {
            owner: urlParts[3],
            repo: urlParts[4]
        };
    }
    catch (error) {
        throw new Error(`Failed to extract repository info from URL: ${htmlUrl}`);
    }
}
/**
 * Format PR statistics for logging
 */
function formatPRStats(pr) {
    const state = pr.state.toUpperCase();
    const commits = pr.commits || 0;
    const additions = pr.additions || 0;
    const deletions = pr.deletions || 0;
    const files = pr.changed_files || 0;
    const comments = pr.comments || 0;
    return `[${state}] ${commits} commits, +${additions}/-${deletions} lines, ${files} files, ${comments} comments`;
}
