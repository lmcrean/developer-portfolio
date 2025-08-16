# GitHub Workflows

Streamlined CI/CD workflows for single-server architecture using reusable workflow pattern.

## Architecture Overview

### Directory Structure
```
.github/workflows/
├── shared/
│   └── deploy.yml              # Reusable workflow with all deployment logic
├── deploy-main-production.yml  # Trigger: push to main (35 lines)
├── deploy-branch-preview.yml   # Trigger: PR events (25 lines)  
├── scheduled-data-update.yml   # Trigger: schedule (delegates to main)
└── scripts/                    # Reusable shell scripts
```

### Design Principles
- **Zero Drift**: Single source of truth in `shared/deploy.yml`
- **Consistent Quality**: Same validation and E2E tests for all deployments
- **Simplified Maintenance**: Change once, apply everywhere
- **Modular Scripts**: Common functionality extracted to `scripts/`

## Workflow Pipelines

### shared/deploy.yml (Reusable Workflow)
Contains ALL deployment logic to ensure consistency.

**Input Parameters:**
- `deployment_channel`: Firebase channel (live or branch-{number})
- `deployment_type`: Type of deployment (main or branch)
- `pr_number`: PR number for branch deployments
- `trigger_source`: What triggered the deployment  
- `update_reason`: Reason for scheduled updates

**Deployment Steps:**
1. Generate fresh static data from GitHub API
2. Copy static data to web app
3. Validate with `validate-static-json.sh` 
4. Build and deploy to Firebase
5. Wait 45 seconds for Firebase provisioning
6. Test static data endpoints
7. Run E2E tests (MUST PASS - no continue-on-error)
8. Update PR comment (branch deployments only)

### deploy-main-production.yml
**Triggers:** Push to main, manual dispatch  
**Action:** Calls `shared/deploy.yml` with `channel: live`  
**Result:** Production at https://lauriecrean-free-38256.web.app

### deploy-branch-preview.yml  
**Triggers:** PR opened/synchronized/reopened, manual dispatch  
**Action:** Calls `shared/deploy.yml` with `channel: branch-{pr_number}`  
**Result:** Preview deployment with unique URL

### scheduled-data-update.yml
**Triggers:** Every 6 hours (00:00, 06:00, 12:00, 18:00 UTC)  
**Action:** Checks data staleness, triggers main workflow if update needed  
**Result:** Smart updates only when data is stale or new activity detected

## Critical Improvements

### Issues Resolved
- ✅ **Testing Consistency**: Both deployments MUST pass E2E tests
- ✅ **Validation Consistency**: All use `validate-static-json.sh` script
- ✅ **URL Resolution**: Standardized handling logic
- ✅ **Wait Logic**: Consistent 45-second wait
- ✅ **Timeout Configuration**: Standardized across workflows

### Performance Metrics

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| Main Workflow | 215 lines | 35 lines | 84% reduction |
| Branch Workflow | 262 lines | 25 lines | 90% reduction |
| Code Duplication | ~90 lines | 0 lines | 100% eliminated |
| Drift Points | 5 critical | 0 | 100% resolved |

## Single-Server Architecture

**Benefits:**
- Sub-second loading with embedded static data
- No API server dependency
- Same-origin requests for optimal performance
- Automatic fallback to live GitHub API if needed

**Data Flow:**
1. GitHub API → Static JSON generation
2. JSON files embedded in web app build
3. Single Firebase deployment serves everything
4. Client loads data from same origin

## Firebase Channels

- **Production**: `live` → https://lauriecrean-free-38256.web.app
- **Preview**: `branch-{pr_number}` → Unique preview URLs

## Environment Variables

Required in GitHub Secrets:
- `API_GITHUB_TOKEN`: GitHub API access for data generation
- `FIREBASE_SERVICE_ACCOUNT_LAURIECREAN_FREE_38256`: Firebase deployment
- `GITHUB_TOKEN`: Provided by GitHub Actions

## Scripts Directory

See [scripts/README.md](scripts/README.md) for detailed script documentation.

Key scripts:
- `generate-static-data.sh`: Fetch GitHub data
- `validate-static-json.sh`: Validate JSON files
- `deploy-web.sh`: Build web application
- `test-static-data.sh`: Test static endpoints
- `run-e2e-tests.sh`: Execute E2E tests
- `check-data-staleness.sh`: Smart update logic

## Testing Locally

```bash
# Generate static data
export GITHUB_TOKEN=your_token
export GITHUB_USERNAME=lmcrean
./.github/workflows/scripts/generate-static-data.sh

# Start web server
cd apps/web
PORT=3023 npm start

# Test static data
./.github/workflows/scripts/test-static-data.sh http://localhost:3023

# Run E2E tests
./.github/workflows/scripts/run-e2e-tests.sh http://localhost:3023
```

## Troubleshooting

### Common Issues

1. **Script Permission Errors**
   - Scripts are chmod +x in workflows
   - Ensure Unix line endings (LF not CRLF)

2. **Static Data Generation Fails**
   - Check `GITHUB_TOKEN` has repo read permissions
   - Verify `GITHUB_USERNAME` is correct
   - Check GitHub API rate limits

3. **Firebase Deployment Fails**
   - Verify service account credentials
   - Check project ID matches Firebase project
   - Ensure Firebase Hosting is enabled

4. **E2E Tests Fail**
   - Verify web app is accessible
   - Check static data endpoints serving
   - Review Playwright test artifacts

## Contributing

When modifying workflows:
1. Update shared/deploy.yml for deployment logic changes
2. Keep trigger workflows minimal (<50 lines)
3. Extract common functionality to scripts/
4. Test scripts locally before committing
5. Update this README for significant changes