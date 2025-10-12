// Type definitions for static data generation
// Separated from main script for better maintainability

export interface PullRequestListData {
  id: number;
  number: number;
  title: string;
  description?: string | null; // Optional since we strip it during processing
  created_at: string;
  merged_at: string | null;
  state: 'open' | 'closed' | 'merged';
  html_url: string;
  additions?: number;
  deletions?: number;
  comments?: number;
  repository: {
    name: string;
    description: string | null;
    language: string | null;
    html_url: string;
    owner: {
      login: string;
      avatar_url: string;
    };
  };
}

export interface PaginationMeta {
  page: number;
  per_page: number;
  total_count: number;
  total_pages: number;
  has_next_page: boolean;
  has_previous_page: boolean;
}

export interface StaticDataMetadata {
  total_count: number;
  total_pages: number;
  per_page: number;
  last_generated: string;
  generator_version: string;
  pages_generated: number;
  external_prs_enhanced?: number;
  enhancement_enabled?: boolean;
}

export interface StaticPageData {
  data: PullRequestListData[];
  meta: {
    username: string;
    count: number;
    pagination: PaginationMeta;
  };
}

export interface PullRequestOverride {
  id: number;
  title?: string;
  state?: 'open' | 'closed' | 'merged';
  merged_at?: string | null;
  html_url?: string;
  comments?: number;
  blocked?: boolean; // When true, the PR will be filtered out completely
}

export interface IssueOverride {
  url?: string;  // Full issue URL for easy identification
  repository?: string;  // e.g., "AstraZeneca/cellatria"
  number?: number;  // Issue number
  blocked?: boolean;  // When true, issue will be filtered out
}

export interface ManualIssue {
  id: number;
  number: number;
  title: string;
  html_url: string;
  state: 'open' | 'closed';
  created_at: string;
  closed_at: string | null;
  updated_at: string;
  repository_url: string;
  repository: {
    owner: string;
    name: string;
    full_name: string;
  };
  labels?: Array<{
    id: number;
    name: string;
    color: string;
  }>;
  user: {
    login: string;
    avatar_url: string;
  };
}