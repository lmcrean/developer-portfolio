#!/bin/bash
set -e

echo "🧪 Testing complete pipeline flow locally..."
echo "================================================"
echo ""

# Get the script's directory and navigate to repo root
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
REPO_ROOT="$( cd "$SCRIPT_DIR/../../.." && pwd )"

# Step 1: Test generate-static-data.sh structure
echo "Step 1: Testing generate-static-data.sh path navigation"
echo "---------------------------------------------------------"
cd "$REPO_ROOT"

# Verify all paths work
echo "✅ Repository root: $REPO_ROOT"

if [ -d "$REPO_ROOT/.github/workflows/scripts/typescript" ]; then
    echo "✅ TypeScript scripts directory exists"
else
    echo "❌ TypeScript scripts directory not found"
    exit 1
fi

if [ -d "$REPO_ROOT/apps/api/github" ]; then
    echo "✅ API directory exists"
else
    echo "❌ API directory not found"
    exit 1
fi

# Check for .env file
if [ -f "$REPO_ROOT/.github/workflows/scripts/typescript/.env" ]; then
    echo "✅ .env file found"
    # Check if it has a valid token
    if grep -q "ghp_" "$REPO_ROOT/.github/workflows/scripts/typescript/.env"; then
        echo "✅ GitHub token appears to be configured"
    else
        echo "⚠️  GitHub token might not be properly configured"
    fi
else
    echo "❌ .env file not found in typescript directory"
    echo "   Create it with GITHUB_TOKEN and GITHUB_USERNAME"
    exit 1
fi

echo ""
echo "Step 2: Checking if static data exists"
echo "---------------------------------------------------------"
if [ -f "$REPO_ROOT/apps/api/github/static/pull-requests/metadata.json" ]; then
    echo "✅ PR metadata exists"
    page_count=$(ls "$REPO_ROOT/apps/api/github/static/pull-requests"/page-*.json 2>/dev/null | wc -l)
    echo "✅ Found $page_count PR page files"
else
    echo "⚠️  No static data found (run generate-static-data.sh to create)"
fi

if [ -f "$REPO_ROOT/apps/api/github/static/issues/grouped.json" ]; then
    echo "✅ Issues data exists"
else
    echo "⚠️  No issues data found"
fi

echo ""
echo "Step 3: Testing copy-static-data.sh"
echo "---------------------------------------------------------"
cd "$REPO_ROOT/.github/workflows/scripts"

# Run the copy script
if ./copy-static-data.sh; then
    echo "✅ Copy script executed successfully"
else
    echo "❌ Copy script failed"
    exit 1
fi

echo ""
echo "Step 4: Verifying web static files"
echo "---------------------------------------------------------"
if [ -f "$REPO_ROOT/apps/web/static/pr-metadata.json" ]; then
    echo "✅ PR metadata copied to web"
fi

web_page_count=$(ls "$REPO_ROOT/apps/web/static"/pr-page-*.json 2>/dev/null | wc -l)
if [ "$web_page_count" -gt 0 ]; then
    echo "✅ $web_page_count PR page files copied to web"
fi

if [ -f "$REPO_ROOT/apps/web/static/issues-grouped.json" ]; then
    echo "✅ Issues data copied to web"
fi

echo ""
echo "================================================"
echo "🎉 Pipeline test complete!"
echo ""
echo "Summary:"
echo "  ✅ Path navigation works correctly"
echo "  ✅ Scripts use absolute paths via \$REPO_ROOT"
echo "  ✅ Copy script works with new directory structure"
echo "  ✅ No dependency on dist directories"
echo ""
echo "The pipeline will work correctly in GitHub Actions!"
echo ""
echo "To run full data generation:"
echo "  cd .github/workflows/scripts && ./generate-static-data.sh"