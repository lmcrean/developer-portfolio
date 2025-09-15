const fs = require('fs');
const path = require('path');

// Read the current page-1.json
const filePath = path.join(__dirname, 'static/pull-requests/page-1.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

// Sort PRs: merged first, then by created_at
data.data.sort((a, b) => {
  // First priority: merged PRs come before non-merged
  const aMerged = a.merged_at !== null;
  const bMerged = b.merged_at !== null;

  if (aMerged && !bMerged) return -1;
  if (!aMerged && bMerged) return 1;

  // If both are merged, sort by merged_at date (most recent first)
  if (aMerged && bMerged) {
    return new Date(b.merged_at).getTime() - new Date(a.merged_at).getTime();
  }

  // If neither are merged, sort by created_at date (most recent first)
  return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
});

// Write back the sorted data
fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');

console.log('✅ Sorted page-1.json - merged PRs are now at the top');

// Show the first few PRs to verify
console.log('\nFirst 5 PRs after sorting:');
data.data.slice(0, 5).forEach((pr, index) => {
  console.log(`${index + 1}. ${pr.repository.name} - ${pr.state}${pr.merged_at ? ' (merged)' : ''}`);
});