#!/bin/bash
set -e

# Generate static data for single-server architecture
# Usage: ./generate-static-data.sh

echo "🔧 Generating static data for single-server deployment..."

# Get the script's directory and navigate to repo root
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
REPO_ROOT="$( cd "$SCRIPT_DIR/../../.." && pwd )"

# Install CI script dependencies
echo "📦 Installing CI script dependencies..."
cd "$REPO_ROOT/.github/workflows/scripts/typescript"
npm ci

# Install API dependencies (for GitHubService)
echo "📦 Installing API dependencies..."
cd "$REPO_ROOT/apps/api/github"
npm ci

# Go back to CI scripts directory
cd "$REPO_ROOT/.github/workflows/scripts/typescript"

# Run the CI script using ts-node
echo "⚡ Running static data generation CI script..."
npx ts-node generateStaticData.ts

# Generate issues static data
echo "🔧 Running issues static data generation..."
echo "📋 Using CI issues generation script..."
npx ts-node generateIssuesStaticData.ts

# Validate generated static data in API location (ready for copying)
echo "📁 Validating generated pull request static data in API location..."
# The script creates files in the apps/api/github/static directory
cd "$REPO_ROOT/apps/api/github/static/pull-requests"

# Count generated files
page_count=$(ls page-*.json 2>/dev/null | wc -l)
if [ "$page_count" -eq 0 ]; then
  echo "❌ No page files found in API static location"
  exit 1
fi

# Verify metadata file exists
if [ ! -f "metadata.json" ]; then
  echo "❌ Metadata file not found in API static location"
  exit 1
fi

# Verify all expected files are present
echo "📊 Found $page_count page files + 1 metadata file"
echo "📋 Generated files ready for copying:"
ls -la *.json

# Final validation
expected_files=$((page_count + 1))  # pages + metadata
actual_files=$(ls *.json | wc -l)
if [ "$actual_files" -ne "$expected_files" ]; then
  echo "❌ File count mismatch: expected $expected_files, found $actual_files"
  exit 1
fi

# Go back to the api/github directory to validate issues data
cd "$REPO_ROOT/apps/api/github"

# Validate issues static data
echo "📁 Validating generated issues static data..."
if [ ! -f "static/issues/grouped.json" ]; then
  echo "❌ Issues grouped.json file not found"
  exit 1
fi

# Check file size to ensure it has content
issues_size=$(stat -f%z "static/issues/grouped.json" 2>/dev/null || stat -c%s "static/issues/grouped.json" 2>/dev/null)
if [ "$issues_size" -lt 100 ]; then
  echo "❌ Issues data file seems too small: $issues_size bytes"
  exit 1
fi

echo "✅ Issues data generated successfully (${issues_size} bytes)"
echo "📋 Issues data includes filtered repositories (excludes: team-5, PP1, halloween-hackathon, moirahartigan repos)"

echo "✅ Static data generation complete!"
echo "📁 Generated $page_count PR page files + 1 metadata file = $expected_files total PR files"
echo "📁 Generated 1 issues grouped.json file"
echo "📁 Static data location: apps/api/github/static/"
echo "💡 Next step: Prepare web app, then run copy-static-data.sh"