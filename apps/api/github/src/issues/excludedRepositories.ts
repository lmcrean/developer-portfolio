/**
 * List of repositories to exclude from issue tracking
 * These are typically learning projects or test repositories
 */
export const EXCLUDED_REPOSITORIES = [
  'team-5',
  'Portfolio-2--Alien-Memory-Game',
  'PP1',
  'hallween-hackathon'
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
  
  // Also check if the full name contains any excluded repo
  if (fullName) {
    return EXCLUDED_REPOSITORIES.some(excluded => 
      fullName.toLowerCase().includes(excluded.toLowerCase())
    );
  }
  
  return false;
}