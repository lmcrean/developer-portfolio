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
echo "🔧 Running static data generation with compiled JavaScript..."
node dist/scripts/generateStaticData.js

# Validate generated static data in API location (ready for copying)
echo "📁 Validating generated static data in API location..."
cd static/pull-requests

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

echo "✅ Static data generation complete!"
echo "📁 Generated $page_count page files + 1 metadata file = $expected_files total files"
echo "📁 Static data location: $(pwd)"
echo "💡 Next step: Prepare web app, then run copy-static-data.sh"