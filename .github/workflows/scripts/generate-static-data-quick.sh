#!/bin/bash
set -e

# Quick test version of generate-static-data.sh that generates minimal data
# For testing pipeline fixes without waiting for full data generation

echo "🚀 Quick static data generation (minimal data for testing)..."

# Get the script's directory and navigate to repo root
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
REPO_ROOT="$( cd "$SCRIPT_DIR/../../.." && pwd )"

# Create minimal test data directly without API calls
echo "📦 Creating minimal test data..."

# Create directories
mkdir -p "$REPO_ROOT/apps/api/github/static/pull-requests"
mkdir -p "$REPO_ROOT/apps/api/github/static/issues"

# Create minimal metadata file
cat > "$REPO_ROOT/apps/api/github/static/pull-requests/metadata.json" << EOF
{
  "total_count": 10,
  "page_count": 1,
  "generated_at": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "username": "lmcrean"
}
EOF

# Create minimal page-1.json with penpot PR
cat > "$REPO_ROOT/apps/api/github/static/pull-requests/page-1.json" << 'EOF'
[
  {
    "id": 2696869536,
    "number": 6982,
    "title": "Enhance (version control): Add milestone lock feature to prevent accidental deletion and bad actors",
    "created_at": "2025-07-20T10:00:00Z",
    "merged_at": "2025-07-26T12:15:30Z",
    "state": "merged",
    "html_url": "https://github.com/penpot/penpot/pull/6982",
    "additions": 500,
    "deletions": 100,
    "comments": 15,
    "repository": {
      "name": "penpot",
      "description": "Penpot - The Open-Source design & prototyping platform",
      "language": "Clojure, SQL",
      "html_url": "https://github.com/penpot/penpot",
      "owner": {
        "login": "penpot",
        "avatar_url": "https://avatars.githubusercontent.com/u/30179644?v=4"
      }
    }
  },
  {
    "id": 2000000001,
    "number": 120,
    "title": "Test PR for pipeline",
    "created_at": "2025-09-14T10:00:00Z",
    "merged_at": null,
    "state": "open",
    "html_url": "https://github.com/lmcrean/developer-portfolio/pull/120",
    "additions": 50,
    "deletions": 20,
    "comments": 3,
    "repository": {
      "name": "developer-portfolio",
      "description": "Personal developer portfolio",
      "language": "TypeScript",
      "html_url": "https://github.com/lmcrean/developer-portfolio",
      "owner": {
        "login": "lmcrean",
        "avatar_url": "https://avatars.githubusercontent.com/u/133490867?v=4"
      }
    }
  }
]
EOF

# Create minimal issues file
cat > "$REPO_ROOT/apps/api/github/static/issues/grouped.json" << 'EOF'
{
  "repositories": [
    {
      "name": "developer-portfolio",
      "issues": [
        {
          "id": 1,
          "title": "Test issue",
          "state": "open",
          "created_at": "2025-09-14T10:00:00Z"
        }
      ]
    }
  ],
  "generated_at": "2025-09-14T18:00:00Z"
}
EOF

echo "✅ Minimal test data created successfully!"
echo "📁 Generated files:"
echo "  - apps/api/github/static/pull-requests/metadata.json"
echo "  - apps/api/github/static/pull-requests/page-1.json"
echo "  - apps/api/github/static/issues/grouped.json"
echo ""
echo "💡 This is minimal test data for pipeline testing only"
echo "   Run ./generate-static-data.sh for real data generation"