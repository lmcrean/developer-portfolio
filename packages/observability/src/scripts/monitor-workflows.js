#!/usr/bin/env node

/**
 * Background CI Monitor - Long-running process with file output and notifications
 * 
 * Usage:
 *   node monitor-workflows.js [options]
 * 
 * This script runs continuously in the background, monitoring CI and writing
 * status files that Claude Code can watch and react to.
 */

const { CIStatusTracker } = require('../ci-monitor/status-tracker');
const chalk = require('chalk');
const path = require('path');

class BackgroundCIMonitor {
  constructor(options = {}) {
    this.options = {
      outputDir: options.outputDir || path.join(process.cwd(), '.ci-status'),
      enableGitIntegration: options.enableGitIntegration || false,
      enableNotifications: options.enableNotifications !== false, // default true
      customCommands: options.customCommands || {},
      watchedWorkflows: options.watchedWorkflows || [],
      watchedBranches: options.watchedBranches || [],
      ...options
    };

    this.tracker = null;
    this.isRunning = false;
  }

  async start() {
    console.log(chalk.cyan('🔄 Starting background CI monitor...'));
    console.log(chalk.gray(`📁 Output directory: ${this.options.outputDir}`));
    
    if (this.options.watchedWorkflows.length > 0) {
      console.log(chalk.gray(`🎯 Watching workflows: ${this.options.watchedWorkflows.join(', ')}`));
    }
    
    if (this.options.watchedBranches.length > 0) {
      console.log(chalk.gray(`🌿 Watching branches: ${this.options.watchedBranches.join(', ')}`));
    }

    try {
      this.tracker = new CIStatusTracker({
        enableFileOutput: true,
        outputDirectory: this.options.outputDir,
        enableGitIntegration: this.options.enableGitIntegration,
        enableNotifications: this.options.enableNotifications,
        customCommands: this.options.customCommands
      });

      await this.tracker.startTracking();
      this.isRunning = true;

      console.log(chalk.green('✅ Background CI monitor started successfully'));
      console.log(chalk.blue('💡 Use Ctrl+C to stop monitoring'));
      
      // Keep the process alive
      this.keepAlive();

    } catch (error) {
      console.error(chalk.red(`❌ Failed to start monitor: ${error.message}`));
      process.exit(1);
    }
  }

  keepAlive() {
    // Keep the process running and provide periodic status updates
    const statusInterval = setInterval(() => {
      if (!this.isRunning) {
        clearInterval(statusInterval);
        return;
      }

      const state = this.tracker.getTrackingState();
      const activeRuns = state.activeRuns;
      
      if (activeRuns.length > 0) {
        console.log(chalk.blue(`🔄 Monitoring ${activeRuns.length} active run(s)...`));
      }
    }, 300000); // Every 5 minutes

    // Handle process signals
    process.on('SIGINT', () => this.gracefulShutdown());
    process.on('SIGTERM', () => this.gracefulShutdown());
  }

  gracefulShutdown() {
    if (!this.isRunning) return;
    
    console.log(chalk.yellow('\n🛑 Shutting down CI monitor...'));
    this.isRunning = false;
    
    if (this.tracker) {
      this.tracker.stopTracking();
    }
    
    console.log(chalk.green('✅ CI monitor stopped gracefully'));
    process.exit(0);
  }

  async status() {
    if (!this.tracker) {
      console.log(chalk.red('❌ Monitor not running'));
      return;
    }

    const state = this.tracker.getTrackingState();
    console.log(chalk.bold('\n📊 CI Monitor Status:'));
    console.log(''.padEnd(50, '='));
    
    console.log(`${chalk.cyan('Status:')} ${state.isTracking ? chalk.green('Running') : chalk.red('Stopped')}`);
    console.log(`${chalk.cyan('Active Runs:')} ${state.activeRuns.length}`);
    console.log(`${chalk.cyan('Recent Changes:')} ${state.recentChanges.length}`);
    console.log(`${chalk.cyan('Output Directory:')} ${this.options.outputDir}`);
    
    if (state.activeRuns.length > 0) {
      console.log(chalk.bold('\n🔄 Active Runs:'));
      state.activeRuns.forEach(run => {
        const icon = this.getStatusIcon(run.status, run.conclusion);
        console.log(`  ${icon} ${run.workflow_name} (${run.branch}) - ${run.status}`);
      });
    }

    if (state.recentChanges.length > 0) {
      console.log(chalk.bold('\n📝 Recent Changes:'));
      state.recentChanges.slice(-5).forEach(change => {
        const time = new Date(change.timestamp).toLocaleTimeString();
        const icon = this.getStatusIcon(change.run.status, change.run.conclusion);
        console.log(`  ${time} ${icon} ${change.run.workflow_name} → ${change.run.status}`);
      });
    }
  }

  getStatusIcon(status, conclusion) {
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
}

// Parse command line arguments
function parseArgs() {
  const args = process.argv.slice(2);
  const options = {};
  
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    
    if (arg === '--output-dir' && i + 1 < args.length) {
      options.outputDir = args[++i];
    } else if (arg === '--enable-git-integration') {
      options.enableGitIntegration = true;
    } else if (arg === '--disable-notifications') {
      options.enableNotifications = false;
    } else if (arg === '--workflows' && i + 1 < args.length) {
      options.watchedWorkflows = args[++i].split(',');
    } else if (arg === '--branches' && i + 1 < args.length) {
      options.watchedBranches = args[++i].split(',');
    } else if (arg === '--success-command' && i + 1 < args.length) {
      options.customCommands = options.customCommands || {};
      options.customCommands.onSuccess = options.customCommands.onSuccess || [];
      options.customCommands.onSuccess.push(args[++i]);
    } else if (arg === '--failure-command' && i + 1 < args.length) {
      options.customCommands = options.customCommands || {};
      options.customCommands.onFailure = options.customCommands.onFailure || [];
      options.customCommands.onFailure.push(args[++i]);
    } else if (arg === '--deployment-command' && i + 1 < args.length) {
      options.customCommands = options.customCommands || {};
      options.customCommands.onDeployment = options.customCommands.onDeployment || [];
      options.customCommands.onDeployment.push(args[++i]);
    } else if (arg === '--help' || arg === '-h') {
      console.log(`
Background CI Monitor

Usage: node monitor-workflows.js [options]

Options:
  --output-dir <path>           Directory for status files (default: ./.ci-status)
  --enable-git-integration      Enable automatic git operations
  --disable-notifications       Disable desktop notifications
  --workflows <list>            Comma-separated list of workflows to watch
  --branches <list>             Comma-separated list of branches to watch
  --success-command <cmd>       Command to run on successful builds
  --failure-command <cmd>       Command to run on failed builds
  --deployment-command <cmd>    Command to run on successful deployments
  --help                        Show this help

Examples:
  node monitor-workflows.js                                    # Monitor all workflows
  node monitor-workflows.js --workflows deploy-api,deploy-web  # Monitor specific workflows
  node monitor-workflows.js --branches main,develop           # Monitor specific branches
  node monitor-workflows.js --enable-git-integration          # Enable git automation
  
Status files created:
  .ci-status/status.json           # Full status information
  .ci-status/simple-status.json    # Simplified status for quick checks
  .ci-status/terminal-summary.txt  # Human-readable summary
      `);
      process.exit(0);
    }
  }
  
  return options;
}

// Main execution
if (require.main === module) {
  const options = parseArgs();
  const monitor = new BackgroundCIMonitor(options);
  
  monitor.start().catch(error => {
    console.error(chalk.red(`Fatal error: ${error.message}`));
    process.exit(1);
  });
}

module.exports = BackgroundCIMonitor;