// PR overrides and repository filtering configuration
// Separated from main script for easier maintenance and updates

import { PullRequestOverride } from './types';

// Filtering configuration - repositories to hide completely
export const HIDDEN_REPOSITORIES = [
  'team-5',
  'halloween-hackathon',
  'vitest-dev',
  'vitest'
];

// Repositories with special filtering rules
export const LIMITED_REPOSITORIES = {
  'penpot': 'keep-latest-only'
};

// Maximum allowed length for repository names
export const MAX_REPOSITORY_NAME_LENGTH = 20;

// Repository name truncation patterns
// These patterns will be used to truncate long repository names at the API layer
export const REPOSITORY_NAME_TRUNCATION_PATTERNS = [
  {
    pattern: /^(woocommerce-gateway)-.*$/,
    replacement: '$1'
  }
];

// Repository-level overrides for specific customizations
export const REPOSITORY_OVERRIDES: Record<string, { language?: string }> = {
  'penpot': {
    language: 'Clojure, SQL'
  }
};

// Manual overrides to fix incorrect PR data
export const PR_OVERRIDES: Record<number, PullRequestOverride> = {
  // Penpot milestone lock feature PR - was incorrectly marked as closed, actually merged
  2696869536: {
    id: 2696869536,
    title: "Implement milestone lock feature to prevent accidental deletion and bad actors",
    state: "merged",
    merged_at: "2025-07-26T12:15:30Z",
    html_url: "https://github.com/penpot/penpot/pull/6982"
  },
  // GoCardless WooCommerce subscription fix
  2793359837: {
    id: 2793359837,
    title: "Fix inconsistent subscriptions after cancellation with centralised logic"
  },
  // Google Guava PR #7988 - was closed but actually merged
  2826673514: {
    id: 2826673514,
    state: "merged",
    merged_at: "2025-09-14T13:00:00Z"
  },
  // Block disableRecycling documentation PR to deter developers from using internal prop
  2742664883: {
    id: 2742664883,
    blocked: true
  }
};