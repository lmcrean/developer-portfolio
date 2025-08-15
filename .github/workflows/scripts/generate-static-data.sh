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

# Copy static data to web app (flattened structure)
echo "📁 Copying static data to web app..."
cd static/pull-requests

# Ensure web app static directory exists
echo "🔧 Ensuring static directory exists..."
mkdir -p ../../../../web/static

# Copy metadata with flattened naming
echo "📋 Copying metadata file..."
cp metadata.json ../../../../web/static/pr-metadata.json
if [ ! -f "../../../../web/static/pr-metadata.json" ]; then
  echo "❌ Failed to copy metadata file"
  exit 1
fi

# Copy all page files with flattened naming  
echo "📄 Copying page files..."
page_count=0
for file in page-*.json; do
  if [ -f "$file" ]; then
    page_num=$(echo "$file" | sed 's/page-\([0-9]*\)\.json/\1/')
    target_file="../../../../web/static/pr-page-${page_num}.json"
    cp "$file" "$target_file"
    if [ ! -f "$target_file" ]; then
      echo "❌ Failed to copy $file to pr-page-${page_num}.json"
      exit 1
    fi
    echo "✅ Copied $file to pr-page-${page_num}.json"
    ((page_count++))
  fi
done
echo "📊 Successfully copied $page_count page files"

# Verify files were copied
echo "📋 Verifying static data files..."
if ls ../../../../web/static/pr-*.json 1> /dev/null 2>&1; then
  file_count=$(ls ../../../../web/static/pr-*.json | wc -l)
  echo "📊 Found $file_count static data files in web app"
  ls -la ../../../../web/static/pr-*.json
else
  echo "❌ No static data files found in web app"
  exit 1
fi

# Validate file structure
echo "🔍 Validating generated static data..."
if [ ! -f "../../../../web/static/pr-metadata.json" ]; then
  echo "❌ Metadata file not found"
  exit 1
fi

# Final validation
expected_files=$((page_count + 1))  # pages + metadata
actual_files=$(ls ../../../../web/static/pr-*.json | wc -l)
if [ "$actual_files" -ne "$expected_files" ]; then
  echo "❌ File count mismatch: expected $expected_files, found $actual_files"
  exit 1
fi

echo "✅ Static data generation complete!"
echo "📁 Generated $page_count page files + 1 metadata file = $expected_files total files"