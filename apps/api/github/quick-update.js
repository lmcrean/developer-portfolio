const fs = require('fs');
const path = require('path');

// Read the current page-1.json
const filePath = path.join(__dirname, 'static/pull-requests/page-1.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

// Apply overrides
const PR_OVERRIDES = {
  // Penpot milestone lock feature
  2696869536: {
    title: "Implement milestone lock feature to prevent accidental deletion and bad actors",
    state: "merged",
    merged_at: "2025-07-26T12:15:30Z"
  },
  // GoCardless WooCommerce subscription fix
  2793359837: {
    title: "Fix inconsistent subscriptions after cancellation with centralised logic"
  },
  // Google Guava PR #7988 - was closed but actually merged
  2826673514: {
    state: "merged",
    merged_at: "2025-09-14T13:00:00Z"
  },
  // Google Guava PR #7989 - was closed but actually merged
  2826689299: {
    state: "merged",
    merged_at: "2025-09-14T13:04:00Z"
  },
  // Google Guava PR #7987 - was closed but actually merged
  2826631136: {
    state: "merged",
    merged_at: "2025-09-14T11:44:42Z"
  }
};

// Apply overrides to PRs
data.data = data.data.map(pr => {
  const override = PR_OVERRIDES[pr.id];
  if (!override) return pr;

  return {
    ...pr,
    ...(override.title && { title: override.title }),
    ...(override.state && { state: override.state }),
    ...(override.merged_at !== undefined && { merged_at: override.merged_at })
  };
});

// Sort PRs: merged first, then by created_at
data.data.sort((a, b) => {
  const aMerged = a.merged_at !== null;
  const bMerged = b.merged_at !== null;

  if (aMerged && !bMerged) return -1;
  if (!aMerged && bMerged) return 1;

  if (aMerged && bMerged) {
    return new Date(b.merged_at).getTime() - new Date(a.merged_at).getTime();
  }

  return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
});

// Write back the sorted data
fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');

console.log('✅ Applied overrides and sorted page-1.json');

// Show the first few PRs to verify
console.log('\nFirst 6 PRs after update:');
data.data.slice(0, 6).forEach((pr, index) => {
  console.log(`${index + 1}. ${pr.repository.name} - ${pr.state}${pr.merged_at ? ' (merged)' : ''} - ${pr.title.substring(0, 50)}...`);
});