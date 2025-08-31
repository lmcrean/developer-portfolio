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