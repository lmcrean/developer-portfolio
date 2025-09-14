#!/bin/bash
set -e

# Test script to validate generate-static-data.sh structure without API calls
# This simulates the execution flow without needing a real GitHub token

echo "🧪 Testing generate-static-data.sh structure..."

# Get the script's directory and navigate to repo root
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
REPO_ROOT="$( cd "$SCRIPT_DIR/../../.." && pwd )"

echo "✅ Script directory: $SCRIPT_DIR"
echo "✅ Repository root: $REPO_ROOT"

# Test navigation to CI script dependencies
echo "📦 Testing navigation to CI script dependencies..."
if [ -d "$REPO_ROOT/.github/workflows/scripts/typescript" ]; then
    echo "✅ TypeScript directory exists"
    cd "$REPO_ROOT/.github/workflows/scripts/typescript"
    if [ -f "package.json" ]; then
        echo "✅ package.json found"
    else
        echo "❌ package.json not found"
        exit 1
    fi
else
    echo "❌ TypeScript directory not found"
    exit 1
fi

# Test navigation to API dependencies
echo "📦 Testing navigation to API dependencies..."
if [ -d "$REPO_ROOT/apps/api/github" ]; then
    echo "✅ API directory exists"
    cd "$REPO_ROOT/apps/api/github"
    if [ -f "package.json" ]; then
        echo "✅ package.json found"
    else
        echo "❌ package.json not found"
        exit 1
    fi
else
    echo "❌ API directory not found"
    exit 1
fi

# Test navigation back to CI scripts directory
echo "📦 Testing navigation back to CI scripts..."
cd "$REPO_ROOT/.github/workflows/scripts/typescript"
echo "✅ Successfully navigated back"

# Check if TypeScript files exist
echo "📋 Checking TypeScript files..."
if [ -f "generateStaticData.ts" ]; then
    echo "✅ generateStaticData.ts found"
else
    echo "❌ generateStaticData.ts not found"
    exit 1
fi

if [ -f "generateIssuesStaticData.ts" ]; then
    echo "✅ generateIssuesStaticData.ts found"
else
    echo "❌ generateIssuesStaticData.ts not found"
    exit 1
fi

# Test validation paths
echo "📁 Testing validation paths..."
if [ -d "$REPO_ROOT/apps/api/github" ]; then
    echo "✅ API directory accessible for validation"
    # Create test directories if they don't exist
    mkdir -p "$REPO_ROOT/apps/api/github/static/pull-requests"
    mkdir -p "$REPO_ROOT/apps/api/github/static/issues"
    echo "✅ Static directories created/verified"
else
    echo "❌ API directory not accessible"
    exit 1
fi

echo ""
echo "✅ All path navigation tests passed!"
echo "📋 Summary:"
echo "  - Repository root correctly identified"
echo "  - All required directories exist and are accessible"
echo "  - TypeScript source files present"
echo "  - Navigation flow works correctly"
echo ""
echo "💡 To run the actual script with GitHub API calls:"
echo "   1. Add your GitHub token to .github/workflows/scripts/typescript/.env"
echo "   2. Run: cd .github/workflows/scripts && ./generate-static-data.sh"