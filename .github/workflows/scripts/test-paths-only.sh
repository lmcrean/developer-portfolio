#!/bin/bash
set -e

# Quick test to verify the path fixes without running the full data generation

echo "🧪 Testing path navigation fixes in generate-static-data.sh..."

# Get the script's directory and navigate to repo root
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
REPO_ROOT="$( cd "$SCRIPT_DIR/../../.." && pwd )"

echo "✅ Script directory: $SCRIPT_DIR"
echo "✅ Repository root: $REPO_ROOT"

# Test all the paths used in generate-static-data.sh
echo ""
echo "Testing path: $REPO_ROOT/.github/workflows/scripts/typescript"
if [ -d "$REPO_ROOT/.github/workflows/scripts/typescript" ]; then
    echo "✅ Path exists"
    cd "$REPO_ROOT/.github/workflows/scripts/typescript"
    pwd
else
    echo "❌ Path does not exist"
    exit 1
fi

echo ""
echo "Testing path: $REPO_ROOT/apps/api/github"
if [ -d "$REPO_ROOT/apps/api/github" ]; then
    echo "✅ Path exists"
    cd "$REPO_ROOT/apps/api/github"
    pwd
else
    echo "❌ Path does not exist"
    exit 1
fi

echo ""
echo "Testing navigation back to: $REPO_ROOT/.github/workflows/scripts/typescript"
cd "$REPO_ROOT/.github/workflows/scripts/typescript"
echo "✅ Successfully navigated"
pwd

echo ""
echo "Testing validation path: $REPO_ROOT/apps/api/github/static/pull-requests"
if [ -d "$REPO_ROOT/apps/api/github/static/pull-requests" ]; then
    echo "✅ Path exists"
    cd "$REPO_ROOT/apps/api/github/static/pull-requests"
    pwd
else
    echo "⚠️  Path does not exist (will be created during generation)"
    mkdir -p "$REPO_ROOT/apps/api/github/static/pull-requests"
    echo "✅ Created path"
fi

echo ""
echo "Testing validation path: $REPO_ROOT/apps/api/github"
cd "$REPO_ROOT/apps/api/github"
echo "✅ Successfully navigated"
pwd

echo ""
echo "🎉 All path navigation tests passed!"
echo "The generate-static-data.sh script should work correctly in GitHub Actions."