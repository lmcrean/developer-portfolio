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