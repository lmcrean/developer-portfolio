"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EXCLUDED_OWNERS = exports.EXCLUDED_REPOSITORIES = void 0;
exports.isRepositoryExcluded = isRepositoryExcluded;
/**
 * List of repositories to exclude from issue tracking
 * These are typically learning projects or test repositories
 */
exports.EXCLUDED_REPOSITORIES = [
    'team-5',
    'Portfolio-2---Alien-Memory-Game', // Fixed: three hyphens, not two
    'PP1',
    'halloween-hackathon'
];
/**
 * List of repository owners to exclude from issue tracking
 * Issues from any repository owned by these users will be excluded
 */
exports.EXCLUDED_OWNERS = [
    'moirahartigan'
];
/**
 * Check if a repository should be excluded
 * @param repoName - Repository name (without owner)
 * @param fullName - Full repository name (owner/repo)
 */
function isRepositoryExcluded(repoName, fullName) {
    // Check by repo name
    if (exports.EXCLUDED_REPOSITORIES.includes(repoName)) {
        return true;
    }
    // Check by owner if fullName is provided
    if (fullName) {
        const owner = fullName.split('/')[0];
        if (exports.EXCLUDED_OWNERS.some(excluded => owner.toLowerCase() === excluded.toLowerCase())) {
            return true;
        }
        // Also check if the full name contains any excluded repo
        return exports.EXCLUDED_REPOSITORIES.some(excluded => fullName.toLowerCase().includes(excluded.toLowerCase()));
    }
    return false;
}
