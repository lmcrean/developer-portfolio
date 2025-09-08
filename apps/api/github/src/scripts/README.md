# Pull Request Description Validation

This directory contains a validation script that ensures certain pull request descriptions are blocked from being processed in the build pipeline.

## Purpose

The validation script (`validatePullRequestDescriptions.ts`) scans the static PR data and blocks the build if it finds any PRs with specific restricted descriptions. This prevents PRs with certain content from being deployed or processed.

## Blocked Descriptions

Currently blocking:
- `"Remove \`disableRecycling\` documentation to deter developers from using internal prop"`

## Integration

The validation is integrated into the build process:

```json
{
  "scripts": {
    "build": "tsc && npm run validate-pr-descriptions",
    "validate-pr-descriptions": "ts-node src/scripts/validatePullRequestDescriptions.ts"
  }
}
```

## Testing

Run the validation tests:

```bash
npm test
```

This will run comprehensive tests to ensure the validation logic works correctly for various scenarios.

## Behavior

- **Pass**: Build continues if no blocked descriptions are found
- **Fail**: Build stops with exit code 1 if blocked descriptions are detected
- **Output**: Clear error messages showing which PRs contain blocked content

## Example Output

When blocked content is found:
```
❌ Build blocked: Found PRs with restricted descriptions

🚫 BLOCKED PR: flash-list#1835
   Title: Remove `disableRecycling` documentation to deter developers from using internal prop
   URL: https://github.com/Shopify/flash-list/pull/1835
   State: merged
   Reason: Contains blocked description
```

When validation passes:
```
✅ PR description validation passed - no blocked descriptions found
```