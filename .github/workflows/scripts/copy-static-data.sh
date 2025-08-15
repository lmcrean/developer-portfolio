#!/bin/bash
set -e

# Copy static data from temp location to prepared web app
# Usage: ./copy-static-data.sh

echo "📁 Copying static data from temp to web app..."

# Define locations (temp at project root, copy script runs from project root)
TEMP_STATIC_DIR="./temp-static-data"
WEB_STATIC_DIR="apps/web/static"

# Verify temp location exists and has data
echo "🔍 Verifying temp static data location..."
if [ ! -d "$TEMP_STATIC_DIR" ]; then
  echo "❌ Temp static data directory not found: $TEMP_STATIC_DIR"
  echo "💡 Make sure generate-static-data.sh was run first"
  exit 1
fi

# Check temp files exist
temp_file_count=$(ls "$TEMP_STATIC_DIR"/pr-*.json 2>/dev/null | wc -l)
if [ "$temp_file_count" -eq 0 ]; then
  echo "❌ No static data files found in temp location"
  echo "📁 Temp directory contents:"
  ls -la "$TEMP_STATIC_DIR" || echo "Directory not accessible"
  exit 1
fi

echo "📊 Found $temp_file_count static data files in temp location"

# Ensure web app static directory exists
echo "🔧 Ensuring web app static directory exists..."
mkdir -p "$WEB_STATIC_DIR"

# Copy all static data files from temp to web app
echo "📋 Copying static data files to web app..."
copied_count=0
for temp_file in "$TEMP_STATIC_DIR"/pr-*.json; do
  if [ -f "$temp_file" ]; then
    filename=$(basename "$temp_file")
    target_file="$WEB_STATIC_DIR/$filename"
    
    echo "🔄 Copying $filename to web app static directory"
    cp "$temp_file" "$target_file"
    
    # Verify copy was successful
    if [ ! -f "$target_file" ]; then
      echo "❌ Failed to copy $filename to web app"
      exit 1
    fi
    
    ((copied_count++))
    echo "✅ Successfully copied $filename"
  fi
done

echo "📊 Successfully copied $copied_count files to web app"

# Verify all files were copied correctly
echo "📋 Verifying web app static data..."
web_file_count=$(ls "$WEB_STATIC_DIR"/pr-*.json 2>/dev/null | wc -l)

if [ "$web_file_count" -ne "$temp_file_count" ]; then
  echo "❌ File count mismatch: temp has $temp_file_count, web app has $web_file_count"
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

echo "✅ Static data successfully copied to web app!"
echo "📁 Copied $copied_count files from temp to: $WEB_STATIC_DIR"
echo "🎯 Web app is ready for deployment with embedded static data"