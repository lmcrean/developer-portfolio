#!/bin/bash
set -e

# Validate static JSON files are properly structured
# Usage: ./validate-static-json.sh

echo "🔍 Validating static JSON files structure and content..."

# Define locations
WEB_STATIC_DIR="apps/web/static"
REQUIRED_FILES=(
  "pr-metadata.json"
  "pr-page-1.json"
)

# Check if web static directory exists
if [ ! -d "$WEB_STATIC_DIR" ]; then
  echo "❌ Web static directory not found: $WEB_STATIC_DIR"
  exit 1
fi

# Validate required files exist
echo "📋 Checking required files exist..."
for file in "${REQUIRED_FILES[@]}"; do
  filepath="$WEB_STATIC_DIR/$file"
  if [ ! -f "$filepath" ]; then
    echo "❌ Required file missing: $filepath"
    exit 1
  fi
  echo "✅ Found: $file"
done

# Validate metadata structure
echo "🔧 Validating metadata.json structure..."
metadata_file="$WEB_STATIC_DIR/pr-metadata.json"

# Check metadata has required fields using jq or python
if command -v jq &> /dev/null; then
  # Use jq if available
  total_count=$(jq -r '.total_count' "$metadata_file" 2>/dev/null)
  total_pages=$(jq -r '.total_pages' "$metadata_file" 2>/dev/null)
  last_generated=$(jq -r '.last_generated' "$metadata_file" 2>/dev/null)
else
  # Fallback to python
  total_count=$(python3 -c "import json; print(json.load(open('$metadata_file'))['total_count'])" 2>/dev/null)
  total_pages=$(python3 -c "import json; print(json.load(open('$metadata_file'))['total_pages'])" 2>/dev/null)
  last_generated=$(python3 -c "import json; print(json.load(open('$metadata_file'))['last_generated'])" 2>/dev/null)
fi

# Validate metadata fields
if [ -z "$total_count" ] || [ "$total_count" = "null" ]; then
  echo "❌ Invalid metadata: missing or null total_count"
  exit 1
fi

if [ -z "$total_pages" ] || [ "$total_pages" = "null" ]; then
  echo "❌ Invalid metadata: missing or null total_pages"
  exit 1
fi

if [ -z "$last_generated" ] || [ "$last_generated" = "null" ]; then
  echo "❌ Invalid metadata: missing or null last_generated"
  exit 1
fi

echo "✅ Metadata validated: $total_count PRs across $total_pages pages"

# Validate at least one page file has proper structure
echo "🔧 Validating page file structure..."
page_file="$WEB_STATIC_DIR/pr-page-1.json"

# Check page has data array
if command -v jq &> /dev/null; then
  data_count=$(jq -r '.data | length' "$page_file" 2>/dev/null)
  has_meta=$(jq -r 'has("meta")' "$page_file" 2>/dev/null)
else
  data_count=$(python3 -c "import json; print(len(json.load(open('$page_file'))['data']))" 2>/dev/null)
  has_meta=$(python3 -c "import json; d=json.load(open('$page_file')); print('true' if 'meta' in d else 'false')" 2>/dev/null)
fi

if [ -z "$data_count" ] || [ "$data_count" -eq 0 ]; then
  echo "❌ Invalid page file: empty or missing data array"
  exit 1
fi

if [ "$has_meta" != "true" ]; then
  echo "❌ Invalid page file: missing meta object"
  exit 1
fi

echo "✅ Page file validated: $data_count pull requests found"

# Validate all expected page files exist based on metadata
echo "📄 Validating all expected page files exist..."
for ((i=1; i<=$total_pages; i++)); do
  page_file="$WEB_STATIC_DIR/pr-page-$i.json"
  if [ ! -f "$page_file" ]; then
    echo "❌ Missing page file: pr-page-$i.json (expected $total_pages pages)"
    exit 1
  fi
done
echo "✅ All $total_pages page files present"

# Final summary
echo "🎉 Static JSON validation completed successfully!"
echo "📊 Validated: $total_pages page files + metadata"
echo "✅ All static data files are properly structured"