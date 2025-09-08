// Manual configuration for pull request overrides and repository filtering
// This file allows manual corrections to PR data that would otherwise be overridden by API regeneration

export interface PullRequestOverride {
  id: number;
  title?: string;
  state?: 'open' | 'closed' | 'merged';
  merged_at?: string | null;
  html_url?: string;
}

// Configuration for repositories to completely hide from the feed
export const HIDDEN_REPOSITORIES = [
  'team-5',           // Hide team-5 repository contributions
  'halloween-hackathon', // Hide halloween-hackathon repository contributions
  'vitest-dev',
  'vitest'
];

// Configuration for repositories with special filtering (keep only most recent)
export const LIMITED_REPOSITORIES = {
  'penpot': 'keep-latest-only' // For penpot, keep only the most recent PR
};

// Configuration for specific PRs that need manual corrections
export const PR_OVERRIDES: Record<number, PullRequestOverride> = {
  // Penpot milestone lock feature PR - was incorrectly marked as closed, actually merged
  2696869536: {
    id: 2696869536,
    title: "Enhance (version control): Add milestone lock feature to prevent accidental deletion",
    state: "merged",
    merged_at: "2025-07-26T12:15:30Z",
    html_url: "https://github.com/penpot/penpot/pull/6982"
  }
};

// Function to apply manual overrides to PR data
export const applyManualOverrides = <T extends { id: number; title?: string; state?: string; merged_at?: string | null; html_url?: string }>(pr: T): T => {
  const override = PR_OVERRIDES[pr.id];
  if (!override) {
    return pr;
  }
  
  return {
    ...pr,
    ...(override.title && { title: override.title }),
    ...(override.state && { state: override.state }),
    ...(override.merged_at !== undefined && { merged_at: override.merged_at }),
    ...(override.html_url && { html_url: override.html_url })
  };
};