import * as fs from 'fs/promises';
import * as path from 'path';
import winston from 'winston';
import chalk from 'chalk';
import { GitHubCIWatcher } from './github-watcher';
import { WorkflowRun, CIStatusChange, CITriggerHooks } from './types';

export interface StatusTrackerConfig {
  /** Enable file-based status output for Claude Code integration */
  enableFileOutput: boolean;
  /** Directory to write status files */
  outputDirectory: string;
  /** Enable automatic git operations on successful deployments */
  enableGitIntegration: boolean;
  /** Enable notifications */
  enableNotifications: boolean;
  /** Custom commands to run on specific events */
  customCommands?: {
    onSuccess?: string[];
    onFailure?: string[];
    onDeployment?: string[];
  };
}

export interface StatusFile {
  timestamp: string;
  activeRuns: WorkflowRun[];
  recentChanges: CIStatusChange[];
  summary: {
    totalActive: number;
    hasFailures: boolean;
    hasSuccesses: boolean;
    lastUpdate: string;
  };
}

export class CIStatusTracker {
  private logger: winston.Logger;
  private config: StatusTrackerConfig;
  private watcher: GitHubCIWatcher;

  constructor(config: Partial<StatusTrackerConfig> = {}) {
    this.config = {
      enableFileOutput: true,
      outputDirectory: path.join(process.cwd(), '.ci-status'),
      enableGitIntegration: false,
      enableNotifications: true,
      ...config
    };

    this.logger = winston.createLogger({
      level: 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ timestamp, level, message }) => {
          const time = chalk.gray(timestamp.split('T')[1].split('.')[0]);
          return `${time} ${chalk.magenta('[CI-TRACKER]')} ${message}`;
        })
      ),
      transports: [new winston.transports.Console()]
    });

    // Create CI watcher with integrated hooks
    this.watcher = new GitHubCIWatcher(
      {
        pollInterval: 30,
        activePollInterval: 10,
        enableLogging: false // We'll handle logging in the tracker
      },
      this.createIntegrationHooks()
    );
  }

  /**
   * Start monitoring with Claude Code integration
   */
  async startTracking(): Promise<void> {
    this.logger.info(chalk.cyan('🎯 Starting CI status tracking with Claude Code integration...'));

    try {
      // Ensure output directory exists
      if (this.config.enableFileOutput) {
        await this.ensureOutputDirectory();
      }

      // Start the watcher
      await this.watcher.startMonitoring();

      this.logger.info(chalk.green('✅ CI status tracking started successfully'));
      
      // Initial status write
      if (this.config.enableFileOutput) {
        await this.writeStatusFiles();
      }

    } catch (error) {
      this.logger.error(chalk.red(`❌ Failed to start CI tracking: ${error}`));
      throw error;
    }
  }

  /**
   * Stop tracking
   */
  stopTracking(): void {
    this.watcher.stopMonitoring();
    this.logger.info(chalk.yellow('⏹️ CI status tracking stopped'));
  }

  /**
   * Get current tracking state
   */
  getTrackingState() {
    return {
      isTracking: this.watcher.getState().isMonitoring,
      activeRuns: this.watcher.getActiveRuns(),
      recentChanges: this.watcher.getRecentChanges(),
      config: this.config
    };
  }

  /**
   * Force status file update
   */
  async updateStatusFiles(): Promise<void> {
    if (this.config.enableFileOutput) {
      await this.writeStatusFiles();
    }
  }

  private createIntegrationHooks(): CITriggerHooks {
    return {
      onStatusChange: async (change: CIStatusChange) => {
        this.logger.info(this.formatStatusChange(change));
        
        if (this.config.enableFileOutput) {
          await this.writeStatusFiles();
        }
      },

      onRunComplete: async (run: WorkflowRun) => {
        const icon = run.conclusion === 'success' ? '✅' : '❌';
        this.logger.info(`${icon} ${chalk.bold('COMPLETED:')} ${run.workflow_name} (${run.branch}) → ${run.conclusion}`);
        
        if (this.config.enableNotifications) {
          await this.sendNotification(run);
        }
      },

      onRunSuccess: async (run: WorkflowRun) => {
        this.logger.info(chalk.green(`🎉 SUCCESS: ${run.workflow_name} on ${run.branch}`));
        
        // Handle deployment successes
        if (this.isDeploymentWorkflow(run)) {
          await this.handleDeploymentSuccess(run);
        }

        // Run custom success commands
        if (this.config.customCommands?.onSuccess) {
          await this.executeCustomCommands(this.config.customCommands.onSuccess, run);
        }
      },

      onRunFailure: async (run: WorkflowRun) => {
        this.logger.error(chalk.red(`💥 FAILURE: ${run.workflow_name} on ${run.branch}`));
        this.logger.info(chalk.blue(`🔗 View logs: ${run.html_url}`));
        
        // Run custom failure commands
        if (this.config.customCommands?.onFailure) {
          await this.executeCustomCommands(this.config.customCommands.onFailure, run);
        }
      },

      onError: async (error: Error) => {
        this.logger.error(chalk.red(`⚠️ CI monitoring error: ${error.message}`));
      }
    };
  }

  private formatStatusChange(change: CIStatusChange): string {
    const { run } = change;
    const statusIcon = this.getStatusIcon(run.status, run.conclusion);
    const workflow = chalk.bold(run.workflow_name);
    const branch = chalk.cyan(run.branch);
    const status = chalk.yellow(run.status);
    const conclusion = run.conclusion ? ` (${this.getStatusColor(run.conclusion)(run.conclusion)})` : '';
    
    return `${statusIcon} ${workflow} ${chalk.gray('(')}${branch}${chalk.gray(')')} → ${status}${conclusion}`;
  }

  private async writeStatusFiles(): Promise<void> {
    try {
      const state = this.watcher.getState();
      const activeRuns = this.watcher.getActiveRuns();
      const recentChanges = this.watcher.getRecentChanges(20);

      const statusFile: StatusFile = {
        timestamp: new Date().toISOString(),
        activeRuns,
        recentChanges,
        summary: {
          totalActive: activeRuns.length,
          hasFailures: recentChanges.some(c => c.run.conclusion === 'failure'),
          hasSuccesses: recentChanges.some(c => c.run.conclusion === 'success'),
          lastUpdate: state.lastPollTime || new Date().toISOString()
        }
      };

      // Write main status file
      const statusPath = path.join(this.config.outputDirectory, 'status.json');
      await fs.writeFile(statusPath, JSON.stringify(statusFile, null, 2));

      // Write simplified status for quick checks
      const simpleStatus = {
        isActive: statusFile.summary.totalActive > 0,
        activeCount: statusFile.summary.totalActive,
        lastUpdate: statusFile.timestamp,
        hasFailures: statusFile.summary.hasFailures
      };
      
      const simplePath = path.join(this.config.outputDirectory, 'simple-status.json');
      await fs.writeFile(simplePath, JSON.stringify(simpleStatus, null, 2));

      // Write latest runs summary for terminal display
      const terminalSummary = this.createTerminalSummary(statusFile);
      const summaryPath = path.join(this.config.outputDirectory, 'terminal-summary.txt');
      await fs.writeFile(summaryPath, terminalSummary);

    } catch (error) {
      this.logger.error(`Failed to write status files: ${error}`);
    }
  }

  private createTerminalSummary(status: StatusFile): string {
    const lines: string[] = [];
    lines.push(`CI Status - ${new Date().toLocaleTimeString()}`);
    lines.push(''.padEnd(50, '='));
    
    if (status.activeRuns.length === 0) {
      lines.push('✅ No active CI runs');
    } else {
      lines.push(`🔄 Active Runs (${status.activeRuns.length}):`);
      status.activeRuns.forEach(run => {
        const icon = this.getStatusIcon(run.status, run.conclusion);
        lines.push(`  ${icon} ${run.workflow_name} (${run.branch})`);
      });
    }

    if (status.recentChanges.length > 0) {
      lines.push('');
      lines.push('Recent Changes:');
      status.recentChanges.slice(-5).forEach(change => {
        const time = new Date(change.timestamp).toLocaleTimeString();
        const icon = this.getStatusIcon(change.run.status, change.run.conclusion);
        lines.push(`  ${time} ${icon} ${change.run.workflow_name}`);
      });
    }

    return lines.join('\n');
  }

  private async ensureOutputDirectory(): Promise<void> {
    try {
      await fs.mkdir(this.config.outputDirectory, { recursive: true });
    } catch (error) {
      throw new Error(`Failed to create output directory: ${error}`);
    }
  }

  private async sendNotification(run: WorkflowRun): Promise<void> {
    // This could be extended to support various notification methods
    // For now, we'll use console notifications
    const icon = run.conclusion === 'success' ? '✅' : '❌';
    const message = `${icon} ${run.workflow_name} (${run.branch}) - ${run.conclusion}`;
    
    // On Windows, we can use native notifications
    if (process.platform === 'win32') {
      try {
        const { spawn } = require('child_process');
        spawn('powershell', [
          '-Command',
          `Add-Type -AssemblyName System.Windows.Forms; [System.Windows.Forms.MessageBox]::Show('${message}', 'GitHub Actions CI')`
        ], { detached: true, stdio: 'ignore' });
      } catch (error) {
        // Fallback to console
        console.log(`\n🔔 ${message}\n`);
      }
    } else {
      console.log(`\n🔔 ${message}\n`);
    }
  }

  private isDeploymentWorkflow(run: WorkflowRun): boolean {
    const deploymentKeywords = ['deploy', 'deployment', 'release', 'publish'];
    return deploymentKeywords.some(keyword => 
      run.workflow_name.toLowerCase().includes(keyword)
    );
  }

  private async handleDeploymentSuccess(run: WorkflowRun): Promise<void> {
    this.logger.info(chalk.green(`🚀 Deployment succeeded: ${run.workflow_name}`));
    
    if (this.config.enableGitIntegration && run.branch === 'main') {
      // Could automatically pull latest changes on successful main branch deployments
      this.logger.info(chalk.blue('💡 Consider pulling latest changes from main branch'));
    }

    // Run custom deployment commands
    if (this.config.customCommands?.onDeployment) {
      await this.executeCustomCommands(this.config.customCommands.onDeployment, run);
    }
  }

  private async executeCustomCommands(commands: string[], run: WorkflowRun): Promise<void> {
    for (const command of commands) {
      try {
        // Replace placeholders in commands
        const expandedCommand = command
          .replace('{workflow}', run.workflow_name)
          .replace('{branch}', run.branch)
          .replace('{status}', run.conclusion || run.status)
          .replace('{url}', run.html_url);

        this.logger.info(chalk.blue(`⚙️ Executing: ${expandedCommand}`));
        
        // Note: In a real implementation, you'd want to carefully sanitize and execute these commands
        // For now, we'll just log them
        
      } catch (error) {
        this.logger.error(`Failed to execute custom command: ${error}`);
      }
    }
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
}