// TypeScript interfaces for GitHub API responses

export interface PullRequestResponse {
  id: number;
  number: number; // PR number like #20
  title: string;
  description: string | null;
  created_at: string;
  merged_at: string | null;
  html_url: string;
  state: 'open' | 'closed' | 'merged';
  additions?: number;
  deletions?: number;
  comments?: number;
  closingIssues?: Array<{
    number: number;
    url: string;
  }>; // Issues that will be closed by this PR
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

export interface ApiResponse {
  data: PullRequestResponse[];
  meta: {
    username: string;
    count: number;
    pagination: PaginationMeta;
  };
}

export interface ErrorResponse {
  error: string;
  message: string;
}

export interface DetailedPullRequestResponse extends PullRequestResponse {
  author: {
    login: string;
    avatar_url: string;
    html_url: string;
  };
  updated_at: string;
  closed_at: string | null;
  draft: boolean;
  commits: number;
  additions: number;
  deletions: number;
  changed_files: number;
  comments: number; // Comments count for 💬 display
  closingIssues?: Array<{
    number: number;
    url: string;
  }>; // Issues that will be closed by this PR
} 