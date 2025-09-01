/**
 * GitHub Issues Types
 * Core type definitions for the issues tracking feature
 */

export interface GitHubIssue {
  id: number;
  number: number;
  title: string;
  html_url: string;
  state: 'open' | 'closed';
  created_at: string;
  closed_at: string | null;
  updated_at: string;
  repository_url: string;
  labels?: Label[];
  user: {
    login: string;
    avatar_url: string;
  };
}

export interface Label {
  id: number;
  name: string;
  color: string;
}

export interface Repository {
  id: number;
  name: string;
  full_name: string;
  owner: {
    login: string;
    avatar_url: string;
  };
  html_url: string;
  description: string | null;
  is_external: boolean; // true if not owned by authenticated user
}

export interface IssueGroup {
  repository: Repository;
  issues: GitHubIssue[];
  openCount: number;
  closedCount: number;
  lastActivityDate: string; // ISO date string of most recent issue activity
  isExpanded?: boolean;
}

export interface IssuesApiResponse {
  groups: IssueGroup[];
  metadata: {
    total_issues: number;
    total_repositories: number;
    external_repositories: number;
    last_updated: string;
  };
}

export interface IssueFilters {
  showExternal: boolean;
  repositories?: string[];
  state?: 'all' | 'open' | 'closed';
}