// CI Monitor exports
export { GitHubCIWatcher } from './github-watcher';
export { CIStatusTracker, type StatusTrackerConfig } from './status-tracker';
export * from './types';

// Convenience factory functions
import { GitHubCIWatcher } from './github-watcher';
import { CIStatusTracker, StatusTrackerConfig } from './status-tracker';
import { CIMonitorConfig, CITriggerHooks } from './types';

/**
 * Create a basic CI watcher for simple monitoring
 */
export function createCIWatcher(config?: Partial<CIMonitorConfig>, hooks?: CITriggerHooks): GitHubCIWatcher {
  return new GitHubCIWatcher(config, hooks);
}

/**
 * Create a full CI status tracker with file output and Claude Code integration
 */
export function createCITracker(config?: Partial<StatusTrackerConfig>): CIStatusTracker {
  return new CIStatusTracker(config);
}

/**
 * Quick start function - creates and starts a CI watcher with sensible defaults
 */
export async function startCIMonitoring(options: {
  pollInterval?: number;
  activePollInterval?: number;
  watchedWorkflows?: string[];
  watchedBranches?: string[];
  enableFileOutput?: boolean;
  enableNotifications?: boolean;
  outputDirectory?: string;
  onSuccess?: (run: any) => void;
  onFailure?: (run: any) => void;
} = {}): Promise<CIStatusTracker> {
  const tracker = createCITracker({
    enableFileOutput: options.enableFileOutput !== false,
    outputDirectory: options.outputDirectory || '.ci-status',
    enableNotifications: options.enableNotifications !== false,
    customCommands: {
      onSuccess: options.onSuccess ? ['custom'] : [],
      onFailure: options.onFailure ? ['custom'] : [],
    }
  });

  await tracker.startTracking();
  return tracker;
}

// Default configurations
export const defaultConfigs = {
  /** Basic monitoring with minimal output */
  minimal: {
    pollInterval: 60,
    activePollInterval: 30,
    enableLogging: false,
    enableFileOutput: false,
  },
  
  /** Development monitoring with file output */
  development: {
    pollInterval: 30,
    activePollInterval: 10,
    enableLogging: true,
    enableFileOutput: true,
    enableNotifications: true,
  },
  
  /** Production monitoring for CI/CD */
  production: {
    pollInterval: 60,
    activePollInterval: 15,
    enableLogging: true,
    enableFileOutput: true,
    enableNotifications: false,
  }
};