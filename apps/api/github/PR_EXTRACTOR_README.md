# PR Data Extractor with Descriptions

This directory contains a standalone script to extract external GitHub pull request data with descriptions included.

## Overview

The `generatePRsWithDescriptions.ts` script creates a separate JSON file containing external PR data with the same structure as the existing `pr-page-1.json` but includes the `description` field that was previously stripped for performance.

## Key Features

- **Standalone Operation**: Doesn't affect existing developer portfolio functionality
- **Complete PR Data**: Includes all fields from the original data plus descriptions
- **External PRs Only**: Filters to show only external repositories (not user's own repos)
- **Enhanced Data**: Includes additions, deletions, and comments count
- **Same Structure**: Compatible with existing data format

## Usage

### Command Line
```bash
# Using npm script (recommended)
npm run extract-prs-with-descriptions

# Or directly with ts-node
npx ts-node src/scripts/generatePRsWithDescriptions.ts
```

### Environment Requirements
- `GITHUB_TOKEN`: GitHub personal access token
- `GITHUB_USERNAME`: GitHub username for API calls

## Output

The script generates:
- **Output Directory**: `pr-data-with-descriptions/`
- **Output File**: `external-prs-with-descriptions.json`

## Data Structure

The output JSON follows this structure:
```json
{
  "data": [
    {
      "id": number,
      "number": number,
      "title": string,
      "description": string | null,  // ← This is the key addition
      "created_at": string,
      "merged_at": string | null,
      "state": "open" | "closed" | "merged",
      "html_url": string,
      "additions": number,
      "deletions": number,
      "comments": number,
      "repository": {
        "name": string,
        "description": string | null,
        "language": string | null,
        "html_url": string,
        "owner": {
          "login": string,
          "avatar_url": string
        }
      }
    }
  ],
  "meta": {
    "username": string,
    "count": number,
    "pagination": {...}
  }
}
```

## Key Differences from Existing Static Data

1. **Descriptions Included**: The `description` field contains the PR body/description
2. **Separate Output**: Doesn't overwrite existing static data files
3. **External PRs Focus**: Only contains external repository contributions
4. **Single File**: All data in one comprehensive JSON file

## Performance Notes

- Script respects GitHub API rate limits
- Includes delays between API calls to be respectful
- May take several minutes to complete for users with many PRs
- Progress is logged to console during execution

## Maintenance

The script reuses existing infrastructure:
- GitHub API integration (`GitHubService`)
- Filtering logic (repository overrides, blacklists)
- Enhancement logic (detailed PR data fetching)

This ensures consistency and reduces code duplication.