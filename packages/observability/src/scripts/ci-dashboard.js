#!/usr/bin/env node

/**
 * CI Dashboard - Quick overview of all CI status
 * 
 * Usage:
 *   node ci-dashboard.js [options]
 * 
 * Provides a comprehensive dashboard view of CI status with real-time updates
 */

const { spawn } = require('child_process');
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');

class CIDashboard {
  constructor(options = {}) {
    this.options = {
      refresh: options.refresh || false,
      refreshInterval: options.refreshInterval || 30,
      statusFile: options.statusFile || path.join(process.cwd(), '.ci-status', 'status.json'),
      showLogs: options.showLogs || false,
      ...options
    };
  }

  async show() {
    if (this.options.refresh) {
      console.log(chalk.cyan('🔄 Starting CI Dashboard with auto-refresh...'));
      await this.startRefreshMode();
    } else {
      await this.showOnce();
    }
  }

  async showOnce() {
    try {
      const [runs, statusFile] = await Promise.all([
        this.fetchRuns(),
        this.loadStatusFile()
      ]);

      this.clearScreen();
      this.displayHeader();
      this.displayOverview(runs, statusFile);
      this.displayActiveRuns(runs);
      this.displayRecentActivity(runs, statusFile);
      
      if (this.options.showLogs) {
        this.displayQuickActions(runs);
      }
      
    } catch (error) {
      console.error(chalk.red(`❌ Error: ${error.message}`));
    }
  }

  async startRefreshMode() {
    let isRunning = true;
    
    const refresh = async () => {
      if (!isRunning) return;
      
      await this.showOnce();
      console.log(chalk.gray(`\n⏰ Auto-refreshing every ${this.options.refreshInterval}s (Press Ctrl+C to exit)...`));
      
      setTimeout(refresh, this.options.refreshInterval * 1000);
    };
    
    // Handle graceful shutdown
    process.on('SIGINT', () => {
      isRunning = false;
      console.log(chalk.yellow('\n👋 Dashboard stopped'));
      process.exit(0);
    });
    
    await refresh();
  }

  clearScreen() {
    if (this.options.refresh) {
      process.stdout.write('\x1b[2J\x1b[0f');
    }
  }

  displayHeader() {
    const now = new Date().toLocaleString();
    console.log(chalk.bold.cyan('🔬 GitHub Actions CI Dashboard'));
    console.log(chalk.gray(`📅 ${now}`));
    console.log(''.padEnd(80, '═'));
  }

  displayOverview(runs, statusFile) {
    const activeRuns = runs.filter(run => run.status !== 'completed');
    const completedRuns = runs.filter(run => run.status === 'completed');
    const successfulRuns = runs.filter(run => run.conclusion === 'success');
    const failedRuns = runs.filter(run => run.conclusion === 'failure');
    
    console.log(chalk.bold('\n📊 Overview:'));
    console.log(''.padEnd(40, '─'));
    
    console.log(`${chalk.cyan('Total Runs:')} ${runs.length}`);
    console.log(`${chalk.yellow('Active:')} ${activeRuns.length}`);
    console.log(`${chalk.green('Successful:')} ${successfulRuns.length}`);
    console.log(`${chalk.red('Failed:')} ${failedRuns.length}`);
    
    if (statusFile && statusFile.summary) {
      const lastUpdate = new Date(statusFile.summary.lastUpdate).toLocaleTimeString();
      console.log(`${chalk.gray('Last Monitor Update:')} ${lastUpdate}`);
    }

    // Status indicators
    const indicators = [];
    if (activeRuns.length > 0) indicators.push(chalk.yellow('🔄 ACTIVE'));
    if (failedRuns.some(r => this.isRecent(r.updated_at))) indicators.push(chalk.red('❌ RECENT FAILURES'));
    if (successfulRuns.some(r => this.isRecent(r.updated_at))) indicators.push(chalk.green('✅ RECENT SUCCESSES'));
    
    if (indicators.length > 0) {
      console.log(`\n${chalk.bold('Status:')} ${indicators.join(' ')}`);
    }
  }

  displayActiveRuns(runs) {
    const activeRuns = runs.filter(run => run.status !== 'completed');
    
    if (activeRuns.length === 0) {
      console.log(chalk.bold('\n🟢 No Active Runs'));
      return;
    }

    console.log(chalk.bold(`\n🔄 Active Runs (${activeRuns.length}):`));
    console.log(''.padEnd(80, '─'));
    
    activeRuns.forEach(run => {
      const icon = this.getStatusIcon(run.status, run.conclusion);
      const workflow = run.workflowName.padEnd(30);
      const branch = run.headBranch.padEnd(15);
      const duration = this.formatDuration(run.created_at);
      const status = run.status;
      
      console.log(
        `${icon} ${chalk.bold(workflow)} ${chalk.cyan(branch)} ` +
        `${chalk.yellow(status.padEnd(12))} ${chalk.gray(duration)}`
      );
      
      if (this.options.showLogs) {
        console.log(chalk.gray(`    🔗 ${run.htmlUrl}`));
      }
    });
  }

  displayRecentActivity(runs, statusFile) {
    const recentRuns = runs
      .filter(run => run.status === 'completed')
      .filter(run => this.isRecent(run.updated_at, 2 * 60 * 60 * 1000)) // Last 2 hours
      .slice(0, 10);

    if (recentRuns.length === 0) {
      console.log(chalk.bold('\n📝 No Recent Activity'));
      return;
    }

    console.log(chalk.bold(`\n📝 Recent Activity (${recentRuns.length}):`));
    console.log(''.padEnd(80, '─'));
    
    recentRuns.forEach(run => {
      const icon = this.getStatusIcon(run.status, run.conclusion);
      const workflow = run.workflowName.padEnd(30);
      const branch = run.headBranch.padEnd(15);
      const conclusion = (run.conclusion || 'unknown').padEnd(10);
      const time = new Date(run.updated_at).toLocaleTimeString();
      
      console.log(
        `${icon} ${chalk.bold(workflow)} ${chalk.cyan(branch)} ` +
        `${this.getStatusColor(run.conclusion)(conclusion)} ${chalk.gray(time)}`
      );
    });

    // Show status file changes if available
    if (statusFile && statusFile.recentChanges && statusFile.recentChanges.length > 0) {
      const recentChanges = statusFile.recentChanges.slice(-3);
      console.log(chalk.bold('\n🔄 Recent Status Changes:'));
      recentChanges.forEach(change => {
        const time = new Date(change.timestamp).toLocaleTimeString();
        const icon = this.getStatusIcon(change.run.status, change.run.conclusion);
        console.log(`  ${chalk.gray(time)} ${icon} ${change.run.workflow_name} → ${change.run.status}`);
      });
    }
  }

  displayQuickActions(runs) {
    const failedRuns = runs.filter(run => run.conclusion === 'failure' && this.isRecent(run.updated_at));
    
    if (failedRuns.length > 0) {
      console.log(chalk.bold('\n🚨 Quick Actions for Failed Runs:'));
      console.log(''.padEnd(40, '─'));
      
      failedRuns.slice(0, 3).forEach((run, index) => {
        console.log(`${index + 1}. ${chalk.red(run.workflowName)} (${run.headBranch})`);
        console.log(`   ${chalk.blue('View logs:')} gh run view ${run.databaseId} --log`);
        console.log(`   ${chalk.blue('Re-run:')} gh run rerun ${run.databaseId}`);
        console.log(`   ${chalk.blue('Web:')} ${run.url}`);
      });
    }

    console.log(chalk.bold('\n⚙️ Useful Commands:'));
    console.log(''.padEnd(20, '─'));
    console.log(`${chalk.blue('Watch CI:')} node watch-ci.js --branch main`);
    console.log(`${chalk.blue('Monitor:')} node monitor-workflows.js`);
    console.log(`${chalk.blue('List runs:')} gh run list --limit 10`);
    console.log(`${chalk.blue('Cancel all:')} gh run list --status in_progress --json id | jq -r '.[].id' | xargs -I {} gh run cancel {}`);
  }

  async fetchRuns() {
    return new Promise((resolve, reject) => {
      const args = ['run', 'list', '--limit', '50', '--json', 
        'databaseId,name,status,conclusion,workflowName,headBranch,headSha,createdAt,updatedAt,url'];

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
        reject(new Error(`GitHub CLI not available: ${error.message}`));
      });

      process.on('exit', (code) => {
        if (code === 0) {
          try {
            resolve(JSON.parse(output));
          } catch (parseError) {
            reject(new Error(`Failed to parse GitHub CLI output: ${parseError.message}`));
          }
        } else {
          reject(new Error(`GitHub CLI failed: ${errorOutput || 'Unknown error'}`));
        }
      });
    });
  }

  async loadStatusFile() {
    try {
      if (fs.existsSync(this.options.statusFile)) {
        const content = fs.readFileSync(this.options.statusFile, 'utf8');
        return JSON.parse(content);
      }
    } catch (error) {
      // Ignore file read errors
    }
    return null;
  }

  isRecent(timestamp, maxAge = 30 * 60 * 1000) { // Default 30 minutes
    const date = new Date(timestamp);
    const now = new Date();
    return (now - date) < maxAge;
  }

  formatDuration(startTime) {
    const start = new Date(startTime);
    const now = new Date();
    const diffMs = now - start;
    
    const minutes = Math.floor(diffMs / 60000);
    const seconds = Math.floor((diffMs % 60000) / 1000);
    
    if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    }
    return `${seconds}s`;
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

  getStatusColor(conclusion) {
    switch (conclusion) {
      case 'success': return chalk.green;
      case 'failure': return chalk.red;
      case 'cancelled': return chalk.gray;
      default: return chalk.yellow;
    }
  }
}

// Parse command line arguments
function parseArgs() {
  const args = process.argv.slice(2);
  const options = {};
  
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    
    if (arg === '--refresh' || arg === '-r') {
      options.refresh = true;
    } else if (arg === '--refresh-interval' && i + 1 < args.length) {
      options.refreshInterval = parseInt(args[++i]);
    } else if (arg === '--status-file' && i + 1 < args.length) {
      options.statusFile = args[++i];
    } else if (arg === '--show-logs') {
      options.showLogs = true;
    } else if (arg === '--help' || arg === '-h') {
      console.log(`
CI Dashboard

Usage: node ci-dashboard.js [options]

Options:
  --refresh, -r               Enable auto-refresh mode
  --refresh-interval <sec>    Refresh interval in seconds (default: 30)
  --status-file <path>        Path to CI status file (default: ./.ci-status/status.json)
  --show-logs                 Show log URLs and quick actions
  --help                      Show this help

Examples:
  node ci-dashboard.js                    # One-time dashboard view
  node ci-dashboard.js --refresh          # Auto-refreshing dashboard
  node ci-dashboard.js --show-logs        # Include log URLs and quick actions
  node ci-dashboard.js -r --refresh-interval 15  # Refresh every 15 seconds
      `);
      process.exit(0);
    }
  }
  
  return options;
}

// Main execution
if (require.main === module) {
  const options = parseArgs();
  const dashboard = new CIDashboard(options);
  
  dashboard.show().catch(error => {
    console.error(chalk.red(`Fatal error: ${error.message}`));
    process.exit(1);
  });
}

module.exports = CIDashboard;