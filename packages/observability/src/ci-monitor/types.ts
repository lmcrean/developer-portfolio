// CI monitoring types for GitHub Actions integration

export interface GitHubRunStatus {
  id: number;
  name: string;
  head_branch: string;
  head_sha: string;
  status: 'queued' | 'in_progress' | 'completed';
  conclusion: 'success' | 'failure' | 'neutral' | 'cancelled' | 'timed_out' | 'action_required' | 'stale' | null;
  workflow_id: number;
  workflow_name: string;
  created_at: string;
  updated_at: string;
  html_url: string;
  jobs_url: string;
  logs_url: string;
}

export interface WorkflowRun {
  id: number;
  name: string;
  status: GitHubRunStatus['status'];
  conclusion: GitHubRunStatus['conclusion'];
  workflow_name: string;
  branch: string;
  sha: string;
  created_at: string;
  updated_at: string;
  html_url: string;
}

export interface CIStatusChange {
  run: WorkflowRun;
  previousStatus?: GitHubRunStatus['status'];
  previousConclusion?: GitHubRunStatus['conclusion'];
  timestamp: string;
}

export interface CIMonitorConfig {
  /** How often to poll GitHub API (in seconds) */
  pollInterval: number;
  /** Increased polling frequency when runs are active (in seconds) */
  activePollInterval: number;
  /** Workflows to monitor specifically */
  watchedWorkflows?: string[];
  /** Branches to monitor */
  watchedBranches?: string[];
  /** Enable console logging */
  enableLogging: boolean;
  /** Enable file-based status output */
  enableFileOutput: boolean;
  /** Path to write status files */
  statusFilePath?: string;
}

export interface CITriggerHooks {
  onStatusChange?: (change: CIStatusChange) => void | Promise<void>;
  onRunComplete?: (run: WorkflowRun) => void | Promise<void>;
  onRunFailure?: (run: WorkflowRun) => void | Promise<void>;
  onRunSuccess?: (run: WorkflowRun) => void | Promise<void>;
  onError?: (error: Error) => void | Promise<void>;
}

export interface CIMonitorState {
  isMonitoring: boolean;
  lastPollTime: string | null;
  activeRuns: Map<number, WorkflowRun>;
  recentChanges: CIStatusChange[];
  errorCount: number;
  lastError: Error | null;
}