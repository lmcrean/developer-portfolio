# Branch Deployment Workflow

## 🚀 Overview

The branch deployment system automatically deploys both the web app and API service when pull requests are created or updated. It uses **Firebase Hosting** for the web app and **Google Cloud Run** for the API service.

## 📋 Workflow Architecture

### 1. `deploy-branch-preview.yml` (Main Orchestrator)
- **Trigger**: PR opened/updated
- **Function**: Coordinates all deployment steps
- **Outputs**: Comprehensive PR comment with deployment URLs

### 2. `deploy-api-branch.yml` (API Deployment)
- **Function**: Deploys API to Google Cloud Run with branch-specific services
- **Service Format**: `api-github-{branch-name}`
- **URL Format**: `https://api-github-{branch-name}-{hash}.us-central1.run.app`
- **Output**: API deployment URL

### 3. `deploy-web-branch.yml` (Web Deployment)
- **Function**: Deploys web app to Firebase with branch-specific channels
- **Channel Format**: `branch-{pr-number}`
- **URL Format**: `https://lauriecrean-free-38256--branch-{pr-number}-{hash}.web.app`
- **Output**: Web app deployment URL

### 4. `test-branch-integration.yml` (Integration Testing)
- **Function**: Tests API/web connectivity and health
- **Tests**: Health checks, API endpoints, CORS, accessibility, performance
- **Output**: Integration test results

## 🔧 Required Secrets

Add these to GitHub Repository Settings → Secrets:

### Google Cloud Platform
```
GCP_PROJECT_ID                                    # Google Cloud Project ID (lauriecrean-free-38256)
GCP_SA_KEY                                       # Service Account JSON key for Cloud Run deployment
```

### Firebase
```
FIREBASE_SERVICE_ACCOUNT_LAURIECREAN_FREE_38256  # Firebase service account for hosting deployment
```

### GitHub
```
GITHUB_TOKEN                                     # Automatically provided by GitHub Actions
```

## 🎯 Deployment Flow

1. **PR Created/Updated** → Triggers `deploy-branch-preview.yml`
2. **API Deployment** → Uses `deploy-api-branch.yml`
   - Builds Docker image
   - Deploys to Cloud Run with branch-specific service name
   - Validates health endpoint
3. **Web Deployment** → Uses `deploy-web-branch.yml`
   - Builds Docusaurus site with API URL
   - Deploys to Firebase hosting channel
   - Validates accessibility
4. **Integration Testing** → Uses `test-branch-integration.yml`
   - Tests API health and endpoints
   - Validates CORS configuration
   - Checks web app connectivity
5. **PR Update** → Comment with deployment URLs and status

## 🌐 URL Formats

### Success Example
```
## 🚀 DEPLOYMENT BRANCH

### 🌐 Web App
**Live Preview:** https://lauriecrean-free-38256--branch-123-abcdef.web.app

### ⚡ API Service
**API Endpoint:** https://api-github-feat-auth-329000596728.us-central1.run.app

### 🧪 Quick Test Links
- [📱 Web App](https://lauriecrean-free-38256--branch-123-abcdef.web.app) - Test the user interface
- [❤️ API Health](https://api-github-feat-auth-329000596728.us-central1.run.app/health) - Verify API status
- [🔗 Click here to test!](https://lauriecrean-free-38256--branch-123-abcdef.web.app)

### 🔄 Integration Status
✅ All tests passed!
```

### Failure Example
```
## ❌ FAILED

### Deployment Status
- **API**: ❌ Deployment failed
- **Web**: ✅ https://lauriecrean-free-38256--branch-123-abcdef.web.app

**API Error:** API deployment failed - check logs
```

## 🔄 Project Structure

```
lauriecrean/
├── apps/
│   ├── web/                 # Docusaurus site → Firebase Hosting
│   │   ├── firebase.json
│   │   ├── .firebaserc
│   │   └── build/           # Build output
│   └── api/
│       └── github/          # Node.js API → Google Cloud Run
│           ├── Dockerfile
│           ├── cloudrun.yaml
│           └── dist/        # Build output
└── .github/workflows/
    ├── deploy-branch-preview.yml
    ├── deploy-api-branch.yml
    ├── deploy-web-branch.yml
    └── test-branch-integration.yml
```

## 🧪 Testing Locally

### API Service
```bash
cd apps/api/github
npm install
npm run build
npm start
# Test: http://localhost:8080/health
```

### Web App
```bash
cd apps/web
npm install
npm run build
npm run serve
# Test: http://localhost:3000
```

## 🔍 Troubleshooting

### API Deployment Issues
- **Docker build fails**: Check Dockerfile and dependencies
- **Cloud Run deployment fails**: Verify GCP service account permissions
- **Health check fails**: Ensure `/health` endpoint exists and returns 200

### Web Deployment Issues
- **Build fails**: Check Docusaurus configuration and dependencies
- **Firebase deployment fails**: Verify service account permissions
- **Channel creation fails**: Check Firebase project settings

### Integration Test Issues
- **CORS errors**: Verify API CORS configuration allows web domain
- **API connectivity fails**: Check API health endpoint and networking
- **Web app not loading**: Verify Firebase hosting configuration

## 📦 Dependencies

### API Service
- Node.js 20+
- Docker
- Google Cloud SDK
- Express.js server with `/health` endpoint

### Web App
- Node.js 20+
- Docusaurus 3.7+
- Firebase CLI
- Build output in `build/` directory

## 🌟 Benefits

- ✅ **Automatic**: Triggers on PR creation/updates
- ✅ **Branch-specific**: Each PR gets unique URLs
- ✅ **Integrated**: Web app automatically connects to API
- ✅ **Tested**: Comprehensive health and integration testing
- ✅ **Informative**: Clear PR comments with deployment status
- ✅ **Cost-effective**: Uses free tiers of Firebase and Cloud Run
- ✅ **Scalable**: Handles multiple concurrent PR deployments

## 🔄 Cleanup

Branch deployments are automatically cleaned up when:
- PR is closed/merged (Firebase channels auto-expire)
- Cloud Run services can be manually cleaned up via GCP console
- Consider setting up automated cleanup for old Cloud Run services 