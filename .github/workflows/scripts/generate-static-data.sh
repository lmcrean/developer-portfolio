#!/bin/bash
set -e

# Generate static data for single-server architecture
# Usage: ./generate-static-data.sh

echo "🔧 Generating static data for single-server deployment..."

# Install API dependencies for static generation
echo "📦 Installing API dependencies..."
cd apps/api/github
npm ci

# Build and generate static data
echo "⚡ Building API and generating static data..."
npm run build

# Use compiled JS instead of ts-node for CI reliability
echo "🔧 Running pull request static data generation with compiled JavaScript..."
node dist/apps/api/github/src/scripts/generateStaticData.js

# Generate issues static data
echo "🔧 Running issues static data generation..."
# Use the compiled JavaScript file for issues generation
echo "📋 Using compiled issues generation script..."
node dist/apps/api/github/src/scripts/generateIssuesStaticData.js

# Validate generated static data in API location (ready for copying)
echo "📁 Validating generated pull request static data in API location..."
# The compiled script creates files relative to its location
cd dist/apps/api/github/static/pull-requests

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

# Go back to the dist/apps/api/github directory to validate issues data
cd ../..

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
echo "📁 Static data location: apps/api/github/dist/apps/api/github/static/"
echo "💡 Next step: Prepare web app, then run copy-static-data.sh"