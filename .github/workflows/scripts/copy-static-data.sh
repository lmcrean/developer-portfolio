#!/bin/bash
set -e

# Copy static data from API static location to prepared web app
# Usage: ./copy-static-data.sh

echo "📁 Copying static data from API to web app..."

# Define locations
# The compiled scripts now generate files in dist/apps/api/github/static
API_STATIC_DIR="apps/api/github/dist/apps/api/github/static/pull-requests"
WEB_STATIC_DIR="apps/web/static"

# Verify API static location exists and has data
echo "🔍 Verifying API static data location..."
if [ ! -d "$API_STATIC_DIR" ]; then
  echo "❌ API static data directory not found: $API_STATIC_DIR"
  echo "💡 Make sure generate-static-data.sh was run first"
  exit 1
fi

# Check API static files exist
api_file_count=$(ls "$API_STATIC_DIR"/*.json 2>/dev/null | wc -l)
if [ "$api_file_count" -eq 0 ]; then
  echo "❌ No static data files found in API location"
  echo "📁 API static directory contents:"
  ls -la "$API_STATIC_DIR" || echo "Directory not accessible"
  exit 1
fi

echo "📊 Found $api_file_count static data files in API location"

# Ensure web app static directory exists
echo "🔧 Ensuring web app static directory exists..."
mkdir -p "$WEB_STATIC_DIR"

# Copy static data files with flattened naming from API to web app
echo "📋 Copying static data files to web app..."
copied_count=0

# Copy metadata with flattened naming
echo "📋 Copying metadata file..."
metadata_source="$API_STATIC_DIR/metadata.json"
metadata_target="$WEB_STATIC_DIR/pr-metadata.json"
if [ -f "$metadata_source" ]; then
  cp "$metadata_source" "$metadata_target"
  if [ ! -f "$metadata_target" ]; then
    echo "❌ Failed to copy metadata file"
    exit 1
  fi
  echo "✅ Successfully copied metadata as pr-metadata.json"
  copied_count=$((copied_count + 1))
else
  echo "❌ Metadata file not found: $metadata_source"
  exit 1
fi

# Copy page files with flattened naming
echo "📄 Copying page files..."
for api_file in "$API_STATIC_DIR"/page-*.json; do
  if [ -f "$api_file" ]; then
    filename=$(basename "$api_file")
    page_num=$(echo "$filename" | sed 's/page-\([0-9]*\)\.json/\1/')
    target_file="$WEB_STATIC_DIR/pr-page-${page_num}.json"
    
    echo "🔄 Copying $filename to pr-page-${page_num}.json"
    cp "$api_file" "$target_file"
    
    # Verify copy was successful
    if [ ! -f "$target_file" ]; then
      echo "❌ Failed to copy $filename to web app"
      exit 1
    fi
    
    copied_count=$((copied_count + 1))
    echo "✅ Successfully copied $filename as pr-page-${page_num}.json"
  fi
done

echo "📊 Successfully copied $copied_count files to web app"

# Verify all files were copied correctly
echo "📋 Verifying web app static data..."
web_file_count=$(ls "$WEB_STATIC_DIR"/pr-*.json 2>/dev/null | wc -l)

if [ "$web_file_count" -ne "$copied_count" ]; then
  echo "❌ File count mismatch: copied $copied_count, web app has $web_file_count"
  exit 1
fi

# Verify metadata file specifically
if [ ! -f "$WEB_STATIC_DIR/pr-metadata.json" ]; then
  echo "❌ Metadata file not found in web app static directory"
  exit 1
fi

# Final verification
echo "🔍 Final verification of web app static data..."
echo "📊 Web app static directory contents:"
ls -la "$WEB_STATIC_DIR"/pr-*.json

# Copy issues static data
echo "📋 Copying issues static data..."
ISSUES_SOURCE="apps/api/github/dist/apps/api/github/static/issues/grouped.json"
ISSUES_TARGET="$WEB_STATIC_DIR/issues-grouped.json"

if [ -f "$ISSUES_SOURCE" ]; then
  cp "$ISSUES_SOURCE" "$ISSUES_TARGET"
  if [ ! -f "$ISSUES_TARGET" ]; then
    echo "❌ Failed to copy issues data file"
    exit 1
  fi
  echo "✅ Successfully copied issues data as issues-grouped.json"
  issues_size=$(stat -f%z "$ISSUES_TARGET" 2>/dev/null || stat -c%s "$ISSUES_TARGET" 2>/dev/null)
  echo "📊 Issues data size: ${issues_size} bytes"
else
  echo "⚠️ Issues data file not found: $ISSUES_SOURCE"
  echo "💡 Issues tracking feature will not be available"
fi

echo "✅ Static data successfully copied to web app!"
echo "📁 Copied $copied_count PR files + issues data from API to: $WEB_STATIC_DIR"
echo "🎯 Web app is ready for deployment with embedded static data (PR + Issues)"