# CI Monitoring with Claude Code

This package now includes comprehensive GitHub Actions CI monitoring tools that provide real-time feedback and integrate with Claude Code for automated responses.

## Quick Start

### 1. Terminal Watch Commands

**Basic CI watching:**
```bash
cd packages/observability
npm run ci:watch
```

**Watch specific workflow or branch:**
```bash
npm run ci:watch -- --workflow deploy-api-main
npm run ci:watch -- --branch main
npm run ci:watch -- --once  # One-time check
```

### 2. Background Monitoring

**Start background monitor with file output:**
```bash
npm run ci:monitor
```

This creates status files in `.ci-status/` that Claude Code can watch and react to:
- `status.json` - Full CI status information
- `simple-status.json` - Quick status checks  
- `terminal-summary.txt` - Human-readable summary

### 3. CI Dashboard

**View comprehensive CI status:**
```bash
npm run ci:dashboard
npm run ci:dashboard -- --refresh  # Auto-refreshing dashboard
npm run ci:dashboard -- --show-logs # Include log URLs and quick actions
```

## Advanced Usage

### Background Monitoring with Custom Commands

```bash
# Monitor with custom success/failure commands
node src/scripts/monitor-workflows.js \
  --success-command "echo 'Build succeeded!'" \
  --failure-command "echo 'Build failed - check logs'" \
  --enable-git-integration
```

### Workflow-Specific Monitoring

```bash
# Monitor only deployment workflows
node src/scripts/watch-ci.js --workflows deploy-api-main,deploy-web-main

# Monitor main and develop branches only
node src/scripts/monitor-workflows.js --branches main,develop
```

### Using in Node.js/TypeScript

```typescript
import { startCIMonitoring, createCIWatcher } from '@lauriecrean/observability';

// Quick start with defaults
const tracker = await startCIMonitoring({
  enableFileOutput: true,
  enableNotifications: true,
  onSuccess: (run) => console.log(`✅ ${run.workflow_name} succeeded!`),
  onFailure: (run) => console.log(`❌ ${run.workflow_name} failed!`)
});

// Or create custom watcher
const watcher = createCIWatcher({
  pollInterval: 30,
  activePollInterval: 10,
  watchedWorkflows: ['deploy-api-main', 'test-main-e2e']
}, {
  onRunComplete: async (run) => {
    if (run.conclusion === 'success') {
      console.log('🎉 CI passed! Ready to deploy.');
    }
  }
});

await watcher.startMonitoring();
```

## Claude Code Integration

### File-Based Triggers

The background monitor writes status files that can trigger Claude Code actions:

```bash
# In Claude Code, you could watch these files:
# .ci-status/simple-status.json
# .ci-status/status.json

# Example: Check if CI is currently active
jq '.isActive' .ci-status/simple-status.json
```

### Real-Time Commands

Use these commands in Claude Code for instant CI feedback:

```bash
# Quick status check
cd packages/observability && npm run ci:watch -- --once

# Start monitoring in background
cd packages/observability && npm run ci:monitor &

# View dashboard
cd packages/observability && npm run ci:dashboard

# Check specific workflow
gh run list --workflow=deploy-api-main --limit 3
```

## Integration with Your Workflows

### Monitor Your Specific Workflows

Your repository has these key workflows that you can monitor:

```bash
# Monitor API deployments
npm run ci:watch -- --workflow deploy-api-main

# Monitor web deployments  
npm run ci:watch -- --workflow deploy-web-main

# Monitor E2E tests
npm run ci:watch -- --workflow test-main-e2e

# Monitor all main branch workflows
npm run ci:watch -- --branch main
```

### Useful Combinations

```bash
# Development workflow: Watch active runs with quick refresh
npm run ci:watch -- --interval 15 --active-interval 5

# Deployment monitoring: Background monitor with notifications
npm run ci:monitor -- --workflows deploy-api-main,deploy-web-main --enable-notifications

# Debug mode: Dashboard with logs and quick actions
npm run ci:dashboard -- --refresh --show-logs
```

## Features

### 🔄 Real-Time Monitoring
- Polls GitHub Actions with smart interval adjustment
- Faster polling when runs are active
- Detects status changes immediately

### 📊 Status Tracking  
- Tracks run state changes
- Maintains history of recent activity
- Provides summary statistics

### 🔔 Notifications
- Desktop notifications on completion (Windows)
- Console notifications for all platforms
- Custom command execution on events

### 📁 File Integration
- Writes JSON status files for external tools
- Human-readable terminal summaries
- Simple status files for quick checks

### 🎯 Smart Filtering
- Filter by specific workflows
- Filter by branches
- Focus on active runs automatically

### ⚡ Performance
- Respects GitHub API rate limits
- Efficient polling with backoff on errors
- Minimal resource usage

## Troubleshooting

### GitHub CLI Setup
Ensure GitHub CLI is installed and authenticated:
```bash
gh --version
gh auth status
```

### Permissions
Scripts need read access to GitHub Actions:
```bash
gh auth refresh -s repo
```

### Output Directory
Background monitor creates `.ci-status/` directory:
```bash
ls -la .ci-status/
```

This CI monitoring system provides the real-time feedback you need to speed up your development workflow without context switching!