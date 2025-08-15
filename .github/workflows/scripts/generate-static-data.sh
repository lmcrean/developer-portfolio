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

# Copy metadata with flattened naming
cp metadata.json ../../web/static/pr-metadata.json

# Copy all page files with flattened naming  
for file in page-*.json; do
  if [ -f "$file" ]; then
    page_num=$(echo "$file" | sed 's/page-\([0-9]*\)\.json/\1/')
    cp "$file" "../../web/static/pr-page-${page_num}.json"
    echo "Copied $file to pr-page-${page_num}.json"
  fi
done

# Verify files were copied
echo "📋 Verifying static data files..."
ls -la ../../web/static/pr-*.json

# Validate file structure
echo "🔍 Validating generated static data..."
if [ ! -f "../../web/static/pr-metadata.json" ]; then
  echo "❌ Metadata file not found"
  exit 1
fi

echo "✅ Static data generation complete!"