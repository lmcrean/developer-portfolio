import { spawn } from 'child_process';
import { EventEmitter } from 'events';
import winston from 'winston';
import chalk from 'chalk';
import { 
  GitHubRunStatus, 
  WorkflowRun, 
  CIStatusChange, 
  CIMonitorConfig, 
  CITriggerHooks,
  CIMonitorState 
} from './types';

export class GitHubCIWatcher extends EventEmitter {
  private logger: winston.Logger;
  private config: CIMonitorConfig;
  private hooks: CITriggerHooks;
  private state: CIMonitorState;
  private pollTimer: NodeJS.Timeout | null = null;

  constructor(config: Partial<CIMonitorConfig> = {}, hooks: CITriggerHooks = {}) {
    super();
    
    this.config = {
      pollInterval: 60,
      activePollInterval: 15,
      enableLogging: true,
      enableFileOutput: false,
      ...config
    };
    
    this.hooks = hooks;
    
    this.state = {
      isMonitoring: false,
      lastPollTime: null,
      activeRuns: new Map(),
      recentChanges: [],
      errorCount: 0,
      lastError: null
    };

    this.logger = winston.createLogger({
      level: 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ timestamp, level, message }) => {
          const time = chalk.gray(timestamp);
          const levelColor = level === 'error' ? chalk.red : level === 'warn' ? chalk.yellow : chalk.blue;
          return `${time} ${levelColor(level.toUpperCase())}: ${message}`;
        })
      ),
      transports: [
        new winston.transports.Console({ silent: !this.config.enableLogging })
      ]
    });
  }

  /**
   * Start monitoring GitHub Actions
   */
  async startMonitoring(): Promise<void> {
    if (this.state.isMonitoring) {
      this.logger.warn('CI monitoring is already active');
      return;
    }

    this.logger.info(chalk.green('🚀 Starting GitHub Actions CI monitoring...'));
    
    try {
      // Initial check to verify GitHub CLI is available
      await this.verifyGitHubCLI();
      
      this.state.isMonitoring = true;
      this.scheduleNextPoll();
      
      this.logger.info(chalk.green('✅ CI monitoring started successfully'));
      this.emit('started');
      
    } catch (error) {
      this.handleError(error as Error);
      throw error;
    }
  }

  /**
   * Stop monitoring
   */
  stopMonitoring(): void {
    if (!this.state.isMonitoring) return;

    if (this.pollTimer) {
      clearTimeout(this.pollTimer);
      this.pollTimer = null;
    }

    this.state.isMonitoring = false;
    this.logger.info(chalk.yellow('⏹️ CI monitoring stopped'));
    this.emit('stopped');
  }

  /**
   * Get current monitoring state
   */
  getState(): Readonly<CIMonitorState> {
    return { ...this.state };
  }

  /**
   * Get current active runs
   */
  getActiveRuns(): WorkflowRun[] {
    return Array.from(this.state.activeRuns.values());
  }

  /**
   * Get recent status changes
   */
  getRecentChanges(limit: number = 10): CIStatusChange[] {
    return this.state.recentChanges.slice(-limit);
  }

  private async verifyGitHubCLI(): Promise<void> {
    return new Promise((resolve, reject) => {
      const process = spawn('gh', ['--version'], { stdio: 'pipe' });
      
      process.on('error', (error) => {
        reject(new Error(`GitHub CLI not found: ${error.message}`));
      });
      
      process.on('exit', (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`GitHub CLI verification failed with exit code ${code}`));
        }
      });
    });
  }

  private scheduleNextPoll(): void {
    if (!this.state.isMonitoring) return;

    const hasActiveRuns = this.state.activeRuns.size > 0;
    const interval = hasActiveRuns ? this.config.activePollInterval : this.config.pollInterval;
    
    this.pollTimer = setTimeout(() => {
      this.pollGitHubActions();
    }, interval * 1000);
  }

  private async pollGitHubActions(): Promise<void> {
    try {
      this.logger.debug(`🔍 Polling GitHub Actions (${this.state.activeRuns.size} active runs)`);
      
      const runs = await this.fetchWorkflowRuns();
      await this.processRunUpdates(runs);
      
      this.state.lastPollTime = new Date().toISOString();
      this.scheduleNextPoll();
      
    } catch (error) {
      this.handleError(error as Error);
      // Continue monitoring even on errors, with exponential backoff
      const backoffInterval = Math.min(this.config.pollInterval * Math.pow(2, this.state.errorCount), 300);
      setTimeout(() => this.scheduleNextPoll(), backoffInterval * 1000);
    }
  }

  private async fetchWorkflowRuns(): Promise<WorkflowRun[]> {
    return new Promise((resolve, reject) => {
      const args = ['run', 'list', '--limit', '20', '--json', 
        'databaseId,name,status,conclusion,workflowName,headBranch,headSha,createdAt,updatedAt,url'];
      
      // Add workflow filter if specified
      if (this.config.watchedWorkflows && this.config.watchedWorkflows.length > 0) {
        this.config.watchedWorkflows.forEach(workflow => {
          args.push('--workflow', workflow);
        });
      }

      const process = spawn('gh', args, { stdio: 'pipe' });
      let output = '';
      let errorOutput = '';

      process.stdout.on('data', (data) => {
        output += data.toString();
      });

      process.stderr.on('data', (data) => {
        errorOutput += data.toString();
      });

      process.on('error', (error) => {
        reject(new Error(`Failed to execute gh command: ${error.message}`));
      });

      process.on('exit', (code) => {
        if (code === 0) {
          try {
            const rawRuns = JSON.parse(output);
            const runs: WorkflowRun[] = rawRuns.map((run: any) => ({
              id: run.databaseId,
              name: run.name,
              status: run.status,
              conclusion: run.conclusion,
              workflow_name: run.workflowName,
              branch: run.headBranch,
              sha: run.headSha.substring(0, 7),
              created_at: run.createdAt,
              updated_at: run.updatedAt,
              html_url: run.url
            }));
            
            // Filter by watched branches if specified
            const filteredRuns = this.config.watchedBranches 
              ? runs.filter(run => this.config.watchedBranches!.includes(run.branch))
              : runs;
            
            resolve(filteredRuns);
          } catch (parseError) {
            reject(new Error(`Failed to parse GitHub CLI output: ${parseError}`));
          }
        } else {
          reject(new Error(`GitHub CLI failed with exit code ${code}: ${errorOutput}`));
        }
      });
    });
  }

  private async processRunUpdates(runs: WorkflowRun[]): Promise<void> {
    const currentRunIds = new Set<number>();
    
    for (const run of runs) {
      currentRunIds.add(run.id);
      const existingRun = this.state.activeRuns.get(run.id);
      
      if (!existingRun) {
        // New run detected
        if (run.status === 'in_progress' || run.status === 'queued') {
          this.state.activeRuns.set(run.id, run);
          this.logger.info(chalk.blue(`🔄 New run: ${run.workflow_name} (${run.branch})`));
        }
      } else {
        // Check for status changes
        const statusChanged = existingRun.status !== run.status;
        const conclusionChanged = existingRun.conclusion !== run.conclusion;
        
        if (statusChanged || conclusionChanged) {
          const change: CIStatusChange = {
            run,
            previousStatus: existingRun.status,
            previousConclusion: existingRun.conclusion,
            timestamp: new Date().toISOString()
          };
          
          this.state.recentChanges.push(change);
          this.state.activeRuns.set(run.id, run);
          
          await this.handleStatusChange(change);
        }
        
        // Remove completed runs from active tracking
        if (run.status === 'completed') {
          this.state.activeRuns.delete(run.id);
        }
      }
    }
    
    // Clean up runs that are no longer in the recent list
    for (const [runId] of this.state.activeRuns) {
      if (!currentRunIds.has(runId)) {
        this.state.activeRuns.delete(runId);
      }
    }
  }

  private async handleStatusChange(change: CIStatusChange): Promise<void> {
    const { run } = change;
    const statusIcon = this.getStatusIcon(run.status, run.conclusion);
    
    this.logger.info(
      `${statusIcon} ${chalk.bold(run.workflow_name)} ` +
      `${chalk.gray('(')}${chalk.cyan(run.branch)}${chalk.gray(')')} ` +
      `→ ${chalk.yellow(run.status)}` +
      (run.conclusion ? ` (${this.getStatusColor(run.conclusion)(run.conclusion)})` : '')
    );

    // Trigger hooks
    try {
      if (this.hooks.onStatusChange) {
        await this.hooks.onStatusChange(change);
      }

      if (run.status === 'completed') {
        if (this.hooks.onRunComplete) {
          await this.hooks.onRunComplete(run);
        }

        if (run.conclusion === 'success' && this.hooks.onRunSuccess) {
          await this.hooks.onRunSuccess(run);
        } else if (run.conclusion === 'failure' && this.hooks.onRunFailure) {
          await this.hooks.onRunFailure(run);
        }
      }
    } catch (hookError) {
      this.logger.error(`Hook execution failed: ${hookError}`);
    }

    this.emit('statusChange', change);
  }

  private getStatusIcon(status: string, conclusion: string | null): string {
    if (status === 'completed') {
      switch (conclusion) {
        case 'success': return '✅';
        case 'failure': return '❌';
        case 'cancelled': return '⚪';
        default: return '❓';
      }
    }
    return status === 'in_progress' ? '🔄' : '⏳';
  }

  private getStatusColor(conclusion: string) {
    switch (conclusion) {
      case 'success': return chalk.green;
      case 'failure': return chalk.red;
      case 'cancelled': return chalk.gray;
      default: return chalk.yellow;
    }
  }

  private handleError(error: Error): void {
    this.state.errorCount++;
    this.state.lastError = error;
    
    this.logger.error(chalk.red(`❌ CI monitoring error: ${error.message}`));
    
    if (this.hooks.onError) {
      this.hooks.onError(error);
    }
    
    this.emit('error', error);
  }
}