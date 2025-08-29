// Shared types for pull request data structures
// Used by both the main app and e2e tests

export interface PullRequestListData {
  id: number;
  number: number;
  title: string;
  description: string | null;
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

export interface DetailedPullRequestData extends PullRequestListData {
  updated_at: string;
  closed_at: string | null;
  draft?: boolean;
  commits: number;
  additions: number;
  deletions: number;
  changed_files: number;
  comments: number;
  author: {
    login: string;
    avatar_url: string;
    html_url: string;
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

export interface ApiResponse<T = PullRequestListData[]> {
  data: T;
  meta: {
    username: string;
    count: number;
    pagination: PaginationMeta;
  };
}

export interface DetailedPullRequestApiResponse {
  data: DetailedPullRequestData;
}

// Component prop types
export interface PullRequestFeedListCardProps {
  pullRequest: PullRequestListData;
  onClick: () => void;
}

export interface PullRequestFeedDetailCardProps {
  pullRequest: DetailedPullRequestData | null;
  isOpen: boolean;
  onClose: () => void;
  loading?: boolean;
  error?: string | null;
}

export interface PullRequestFeedProps {
  username?: string;
  className?: string;
} 