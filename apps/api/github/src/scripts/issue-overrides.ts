// Issue overrides and manual issue configuration
// Similar to pr-overrides.ts but for issues

import { ManualIssue } from './types';

// Manual issues to add to the portfolio that don't appear via GitHub API
export const MANUAL_ISSUES: ManualIssue[] = [
  // Google Guava issue #6217 - Performance improvement
  {
    id: 9900006217, // Using high ID to avoid conflicts with GitHub API IDs
    number: 6217,
    title: "Performance improvement: Cache compiled patterns in MoreObjects.ToStringHelper",
    html_url: "https://github.com/google/guava/issues/6217",
    state: "closed",
    created_at: "2023-01-15T10:30:00Z",
    closed_at: "2025-09-16T14:20:00Z",
    updated_at: "2025-09-16T14:20:00Z",
    repository_url: "https://api.github.com/repos/google/guava",
    repository: {
      owner: "google",
      name: "guava",
      full_name: "google/guava"
    },
    labels: [
      {
        id: 1,
        name: "type=enhancement",
        color: "84b6eb"
      },
      {
        id: 2,
        name: "P3",
        color: "d93f0b"
      }
    ],
    user: {
      login: "lmcrean",
      avatar_url: "https://avatars.githubusercontent.com/u/133490867?v=4"
    }
  },
  // Google Guava issue #5773 - Feature request
  {
    id: 9900005773, // Using high ID to avoid conflicts with GitHub API IDs
    number: 5773,
    title: "Feature request: Add support for custom serialization in Graph utilities",
    html_url: "https://github.com/google/guava/issues/5773",
    state: "closed",
    created_at: "2022-08-20T14:15:00Z",
    closed_at: "2025-09-16T15:45:00Z",
    updated_at: "2025-09-16T15:45:00Z",
    repository_url: "https://api.github.com/repos/google/guava",
    repository: {
      owner: "google",
      name: "guava",
      full_name: "google/guava"
    },
    labels: [
      {
        id: 3,
        name: "type=enhancement",
        color: "84b6eb"
      },
      {
        id: 4,
        name: "graph",
        color: "0052cc"
      }
    ],
    user: {
      login: "lmcrean",
      avatar_url: "https://avatars.githubusercontent.com/u/133490867?v=4"
    }
  }
];

// Repositories that should be excluded from issue tracking
export const EXCLUDED_ISSUE_REPOSITORIES = [
  'team-5',
  'halloween-hackathon',
  'vitest-dev',
  'vitest'
];