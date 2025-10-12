import { IssueOverride } from '../scripts/types';
import { ISSUE_OVERRIDES } from '../scripts/issue-overrides';

/**
 * List of repositories to exclude from issue tracking
 * These are typically learning projects or test repositories
 */
export const EXCLUDED_REPOSITORIES = [
  'team-5',
  'Portfolio-2---Alien-Memory-Game',  // Fixed: three hyphens, not two
  'PP1',
  'halloween-hackathon'
];

/**
 * List of repository owners to exclude from issue tracking
 * Issues from any repository owned by these users will be excluded
 */
export const EXCLUDED_OWNERS = [
  'moirahartigan'
];

/**
 * Check if a repository should be excluded
 * @param repoName - Repository name (without owner)
 * @param fullName - Full repository name (owner/repo)
 */
export function isRepositoryExcluded(repoName: string, fullName?: string): boolean {
  // Check by repo name
  if (EXCLUDED_REPOSITORIES.includes(repoName)) {
    return true;
  }
  
  // Check by owner if fullName is provided
  if (fullName) {
    const owner = fullName.split('/')[0];
    if (EXCLUDED_OWNERS.some(excluded => 
      owner.toLowerCase() === excluded.toLowerCase()
    )) {
      return true;
    }
    
    // Also check if the full name contains any excluded repo
    return EXCLUDED_REPOSITORIES.some(excluded => 
      fullName.toLowerCase().includes(excluded.toLowerCase())
    );
  }
  
  return false;
}

/**
 * Check if an issue should be blocked based on issue-level overrides
 * @param issueUrl - Full URL of the issue
 * @param repoFullName - Full repository name (owner/repo)
 * @param issueNumber - Issue number
 */
export function isIssueBlocked(issueUrl: string, repoFullName?: string, issueNumber?: number): boolean {
  const result = ISSUE_OVERRIDES.some(override => {
    if (!override.blocked) return false;
    
    // Check by URL (most specific)
    if (override.url && issueUrl === override.url) {
      console.log(`🚫 BLOCKING ISSUE: ${issueUrl} (URL match)`);
      return true;
    }
    
    // Check by repository + number combination
    if (override.repository && override.number && 
        repoFullName === override.repository && 
        issueNumber === override.number) {
      console.log(`🚫 BLOCKING ISSUE: ${repoFullName}#${issueNumber} (repo+number match)`);
      return true;
    }
    
    return false;
  });
  
  if (result) {
    console.log(`✅ Issue blocked: ${issueUrl}`);
  }
  
  return result;
}