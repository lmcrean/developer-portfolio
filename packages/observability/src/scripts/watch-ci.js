#!/usr/bin/env node

/**
 * Terminal CI Watcher - Quick status checks and real-time monitoring
 * 
 * Usage:
 *   node watch-ci.js [options]
 * 
 * Options:
 *   --branch <name>     Watch specific branch
 *   --workflow <name>   Watch specific workflow
 *   --interval <sec>    Polling interval (default: 30)
 *   --active-interval <sec>  Active polling interval (default: 10)
 *   --quiet            Minimal output
 *   --once             Check once and exit
 */

const { spawn } = require('child_process');
const chalk = require('chalk');

class TerminalCIWatcher {
  constructor(options = {}) {
    this.options = {
      branch: options.branch,
      workflow: options.workflow,
      interval: options.interval || 30,
      activeInterval: options.activeInterval || 10,
      quiet: options.quiet || false,
      once: options.once || false,
      ...options
    };
    
    this.isRunning = false;
    this.activeRuns = new Map();
  }

  async start() {
    console.log(chalk.cyan('🔍 Starting CI watcher...'));
    
    if (this.options.once) {
      await this.checkOnce();
      return;
    }
    
    this.isRunning = true;
    await this.monitorLoop();
  }

  async checkOnce() {
    try {
      const runs = await this.fetchRuns();
      this.displayRuns(runs);
    } catch (error) {
      console.error(chalk.red(`❌ Error: ${error.message}`));
      process.exit(1);
    }
  }

  async monitorLoop() {
    while (this.isRunning) {
      try {
        const runs = await this.fetchRuns();
        this.processRunUpdates(runs);
        
        const hasActive = runs.some(run => run.status === 'in_progress' || run.status === 'queued');
        const nextInterval = hasActive ? this.options.activeInterval : this.options.interval;
        
        if (!this.options.quiet) {
          const time = new Date().toLocaleTimeString();
          const activeCount = runs.filter(r => r.status !== 'completed').length;
          console.log(chalk.gray(`[${time}] Monitoring... (${activeCount} active, next check in ${nextInterval}s)`));
        }
        
        await this.sleep(nextInterval * 1000);
        
      } catch (error) {
        console.error(chalk.red(`❌ Error: ${error.message}`));
        await this.sleep(this.options.interval * 1000);
      }
    }
  }

  async fetchRuns() {
    return new Promise((resolve, reject) => {
      const args = ['run', 'list', '--limit', '20', '--json', 
        'id,name,status,conclusion,workflowName,headBranch,headSha,createdAt,updatedAt,htmlUrl'];
      
      if (this.options.workflow) {
        args.push('--workflow', this.options.workflow);
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
        reject(new Error(`GitHub CLI not available: ${error.message}`));
      });

      process.on('exit', (code) => {
        if (code === 0) {
          try {
            let runs = JSON.parse(output);
            
            // Filter by branch if specified
            if (this.options.branch) {
              runs = runs.filter(run => run.headBranch === this.options.branch);
            }
            
            resolve(runs);
          } catch (parseError) {
            reject(new Error(`Failed to parse GitHub CLI output: ${parseError.message}`));
          }
        } else {
          reject(new Error(`GitHub CLI failed: ${errorOutput || 'Unknown error'}`));
        }
      });
    });
  }

  processRunUpdates(runs) {
    const currentRunIds = new Set();
    
    for (const run of runs) {
      currentRunIds.add(run.id);
      const existing = this.activeRuns.get(run.id);
      
      if (!existing) {
        // New run
        if (run.status !== 'completed') {
          this.activeRuns.set(run.id, run);
          this.logRunEvent('NEW', run);
        }
      } else {
        // Check for changes
        const statusChanged = existing.status !== run.status;
        const conclusionChanged = existing.conclusion !== run.conclusion;
        
        if (statusChanged || conclusionChanged) {
          this.activeRuns.set(run.id, run);
          this.logRunEvent('UPDATE', run, existing);
        }
        
        // Remove completed runs
        if (run.status === 'completed') {
          this.activeRuns.delete(run.id);
        }
      }
    }
    
    // Clean up runs no longer in list
    for (const runId of this.activeRuns.keys()) {
      if (!currentRunIds.has(runId)) {
        this.activeRuns.delete(runId);
      }
    }
  }

  logRunEvent(type, run, previous = null) {
    const time = new Date().toLocaleTimeString();
    const icon = this.getStatusIcon(run.status, run.conclusion);
    const workflow = chalk.bold(run.workflowName);
    const branch = chalk.cyan(run.headBranch);
    const status = chalk.yellow(run.status);
    const conclusion = run.conclusion ? ` (${this.getStatusColor(run.conclusion)(run.conclusion)})` : '';
    
    if (type === 'NEW') {
      console.log(`${chalk.gray(time)} ${icon} ${chalk.blue('NEW:')} ${workflow} (${branch}) → ${status}`);
    } else {
      console.log(`${chalk.gray(time)} ${icon} ${workflow} (${branch}) → ${status}${conclusion}`);
    }
    
    // Show URL for completed runs
    if (run.status === 'completed' && !this.options.quiet) {
      console.log(`${chalk.gray('  └─')} ${chalk.blue(run.htmlUrl)}`);
    }
  }

  displayRuns(runs) {
    if (runs.length === 0) {
      console.log(chalk.green('✅ No recent CI runs found'));
      return;
    }

    console.log(chalk.bold(`\n📋 Recent CI Runs (${runs.length}):`));
    console.log(''.padEnd(80, '─'));
    
    runs.slice(0, 10).forEach(run => {
      const icon = this.getStatusIcon(run.status, run.conclusion);
      const workflow = run.workflowName.padEnd(25);
      const branch = run.headBranch.padEnd(15);
      const status = run.status.padEnd(12);
      const conclusion = run.conclusion || '';
      const time = new Date(run.updatedAt).toLocaleTimeString();
      
      console.log(
        `${icon} ${chalk.bold(workflow)} ${chalk.cyan(branch)} ${chalk.yellow(status)} ` +
        `${this.getStatusColor(conclusion)(conclusion.padEnd(10))} ${chalk.gray(time)}`
      );
    });
    
    const activeCount = runs.filter(r => r.status !== 'completed').length;
    if (activeCount > 0) {
      console.log(chalk.blue(`\n🔄 ${activeCount} active run(s)`));
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

  getStatusColor(conclusion) {
    switch (conclusion) {
      case 'success': return chalk.green;
      case 'failure': return chalk.red;
      case 'cancelled': return chalk.gray;
      default: return chalk.yellow;
    }
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  stop() {
    this.isRunning = false;
    console.log(chalk.yellow('\n⏹️ CI watcher stopped'));
  }
}

// Parse command line arguments
function parseArgs() {
  const args = process.argv.slice(2);
  const options = {};
  
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    
    if (arg === '--branch' && i + 1 < args.length) {
      options.branch = args[++i];
    } else if (arg === '--workflow' && i + 1 < args.length) {
      options.workflow = args[++i];
    } else if (arg === '--interval' && i + 1 < args.length) {
      options.interval = parseInt(args[++i]);
    } else if (arg === '--active-interval' && i + 1 < args.length) {
      options.activeInterval = parseInt(args[++i]);
    } else if (arg === '--quiet') {
      options.quiet = true;
    } else if (arg === '--once') {
      options.once = true;
    } else if (arg === '--help' || arg === '-h') {
      console.log(`
Terminal CI Watcher

Usage: node watch-ci.js [options]

Options:
  --branch <name>           Watch specific branch
  --workflow <name>         Watch specific workflow  
  --interval <seconds>      Polling interval (default: 30)
  --active-interval <sec>   Active polling interval (default: 10)
  --quiet                   Minimal output
  --once                    Check once and exit
  --help                    Show this help

Examples:
  node watch-ci.js                           # Watch all workflows
  node watch-ci.js --branch main             # Watch main branch only
  node watch-ci.js --workflow deploy-api     # Watch specific workflow
  node watch-ci.js --once                    # One-time status check
      `);
      process.exit(0);
    }
  }
  
  return options;
}

// Main execution
if (require.main === module) {
  const options = parseArgs();
  const watcher = new TerminalCIWatcher(options);
  
  // Handle graceful shutdown
  process.on('SIGINT', () => {
    watcher.stop();
    process.exit(0);
  });
  
  process.on('SIGTERM', () => {
    watcher.stop();
    process.exit(0);
  });
  
  watcher.start().catch(error => {
    console.error(chalk.red(`Fatal error: ${error.message}`));
    process.exit(1);
  });
}

module.exports = TerminalCIWatcher;