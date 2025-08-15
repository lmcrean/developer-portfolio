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

# Prepare static data in temp location for later copying
echo "📁 Preparing static data in temp location..."
cd static/pull-requests

# Create temp directory for static data (at project root for CI safety)
TEMP_STATIC_DIR="../../../../../temp-static-data"
echo "🔧 Creating temp directory: $TEMP_STATIC_DIR"
mkdir -p "$TEMP_STATIC_DIR"
echo "📁 Temp directory created successfully at: $(realpath $TEMP_STATIC_DIR)"

# Copy metadata with flattened naming to temp location
echo "📋 Copying metadata to temp location..."
cp metadata.json "$TEMP_STATIC_DIR/pr-metadata.json"
if [ ! -f "$TEMP_STATIC_DIR/pr-metadata.json" ]; then
  echo "❌ Failed to copy metadata to temp location"
  exit 1
fi

# Copy all page files with flattened naming to temp location
echo "📄 Copying page files to temp location..."
page_count=0
for file in page-*.json; do
  if [ -f "$file" ]; then
    page_num=$(echo "$file" | sed 's/page-\([0-9]*\)\.json/\1/')
    target_file="$TEMP_STATIC_DIR/pr-page-${page_num}.json"
    
    echo "🔄 Copying $file (page ${page_num}) to temp location..."
    cp "$file" "$target_file"
    
    # Small delay for file system consistency in CI
    sleep 0.1
    
    # Enhanced validation with detailed error info
    if [ ! -f "$target_file" ]; then
      echo "❌ Failed to copy $file to temp location"
      echo "📍 Source file: $file ($(ls -la $file 2>/dev/null || echo 'not found'))"
      echo "📍 Target file: $target_file"
      echo "📍 Temp directory contents:"
      ls -la "$TEMP_STATIC_DIR" 2>/dev/null || echo "Temp directory not accessible"
      echo "📍 Current working directory: $(pwd)"
      exit 1
    fi
    echo "✅ Copied $file to temp as pr-page-${page_num}.json"
    ((page_count++))
  fi
done
echo "📊 Successfully copied $page_count page files to temp location"

# Verify temp files
echo "📋 Verifying temp static data files..."
if ls "$TEMP_STATIC_DIR"/pr-*.json 1> /dev/null 2>&1; then
  file_count=$(ls "$TEMP_STATIC_DIR"/pr-*.json | wc -l)
  echo "📊 Found $file_count static data files in temp location"
  ls -la "$TEMP_STATIC_DIR"/pr-*.json
else
  echo "❌ No static data files found in temp location"
  exit 1
fi

# Final validation of temp files
echo "🔍 Validating temp static data..."
if [ ! -f "$TEMP_STATIC_DIR/pr-metadata.json" ]; then
  echo "❌ Metadata file not found in temp location"
  exit 1
fi

# Final count validation
expected_files=$((page_count + 1))  # pages + metadata
actual_files=$(ls "$TEMP_STATIC_DIR"/pr-*.json | wc -l)
if [ "$actual_files" -ne "$expected_files" ]; then
  echo "❌ File count mismatch in temp: expected $expected_files, found $actual_files"
  exit 1
fi

echo "🎯 Static data successfully prepared in temp location: $TEMP_STATIC_DIR"
echo "📁 Temp location absolute path: $(realpath $TEMP_STATIC_DIR)"

echo "✅ Static data generation complete!"
echo "📁 Generated $page_count page files + 1 metadata file = $expected_files total files"
echo "💡 Next step: Run copy-static-data.sh after web app is prepared"