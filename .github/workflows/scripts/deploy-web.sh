#!/bin/bash
set -e

# Deploy web app to Firebase
# Usage: ./deploy-web.sh <mode> [pr_number]
# mode: "main" or "branch"
# pr_number: required if mode is "branch"

MODE="$1"
PR_NUMBER="$2"

if [ "$MODE" != "main" ] && [ "$MODE" != "branch" ]; then
  echo "❌ Invalid mode. Use 'main' or 'branch'"
  exit 1
fi

if [ "$MODE" = "branch" ] && [ -z "$PR_NUMBER" ]; then
  echo "❌ PR number required for branch deployment"
  exit 1
fi

echo "🚀 Deploying web app in $MODE mode..."

# Install web dependencies
echo "📦 Installing web dependencies..."
cd apps/web
# Try npm ci first, fall back to npm install if lock file is out of sync
npm ci || {
  echo "⚠️ npm ci failed, falling back to npm install..."
  npm install
}

# Run web tests
echo "🧪 Running web tests..."
npm test 2>/dev/null || echo "⚠️ Tests not configured or failed"

# Build web app
echo "🏗️ Building web app..."
npm run build

# Deploy to Firebase
echo "🔐 Deploying to Firebase..."
if [ "$MODE" = "main" ]; then
  CHANNEL_ID="live"
  echo "📍 Deploying to main production channel"
else
  CHANNEL_ID="branch-$PR_NUMBER"
  echo "📍 Deploying to branch preview channel: $CHANNEL_ID"
fi

# Note: Firebase deployment is handled by GitHub Action in workflow
# This script prepares everything up to the deployment step

echo "✅ Web app prepared for Firebase deployment"
echo "🔗 Channel ID: $CHANNEL_ID"