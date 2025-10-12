#!/usr/bin/env node

/**
 * PR Data Extractor with Descriptions, Diffs, Comments, and Review Comments
 *
 * Generates a standalone JSON file containing external GitHub pull request data
 * with full details including descriptions, diffs, general PR comments, and inline
 * code review comments (including follow-up replies). This script is independent
 * of the developer portfolio and won't affect existing functionality.
 *
 * Usage:
 *   npm run extract-prs-with-descriptions
 *   node dist/scripts/generatePRsWithDescriptions.js
 */

import dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
import { GitHubService } from '../github';
import { Octokit } from '@octokit/rest';
import { delay } from '../utils/rateLimitUtils';
import {
  PullRequestListData,
  PaginationMeta,
  StaticPageData
} from './types';
import {
  HIDDEN_REPOSITORIES,
  LIMITED_REPOSITORIES,
  MAX_REPOSITORY_NAME_LENGTH,
  REPOSITORY_NAME_TRUNCATION_PATTERNS,
  REPOSITORY_OVERRIDES,
  PR_OVERRIDES
} from './pr-overrides';

// Load environment variables from .env file
dotenv.config();

interface Comment {
  id: number;
  user: {
    login: string;
    avatar_url: string;
    html_url: string;
  } | null;
  body: string;
  created_at: string;
  updated_at: string;
  html_url: string;
}

interface ReviewComment {
  id: number;
  user: {
    login: string;
    avatar_url: string;
    html_url: string;
  } | null;
  body: string;
  created_at: string;
  updated_at: string;
  html_url: string;
  path: string; // File path where comment was made
  diff_hunk: string; // The specific diff snippet (stays DRY - not the whole file!)
  line?: number | null; // Line number in the diff
  original_line?: number | null; // Original line number
  commit_id: string; // The commit the comment was made on
  in_reply_to_id?: number | null; // If this is a reply to another review comment
}

interface PRDataWithDescriptions extends PullRequestListData {
  description: string | null; // Always include description field
  diff?: string | null; // Include diff data
  comments_data?: Comment[]; // Include general PR comment details
  review_comments?: ReviewComment[]; // Include inline code review comments
}

interface PRPageDataWithDescriptions {
  data: PRDataWithDescriptions[];
  meta: {
    username: string;
    count: number;
    pagination: PaginationMeta;
  };
}

class PRExtractorWithDescriptions {
  private githubService: GitHubService;
  private octokit: Octokit;
  private outputDir: string;
  private username: string;
  private perPage: number = 20;

  constructor() {
    // Validate environment
    const githubToken = process.env.GITHUB_TOKEN;
    const githubUsername = process.env.GITHUB_USERNAME;

    if (!githubToken) {
      throw new Error('GITHUB_TOKEN environment variable is required');
    }

    if (!githubUsername) {
      throw new Error('GITHUB_USERNAME environment variable is required');
    }

    this.githubService = new GitHubService(githubToken);
    this.octokit = new Octokit({ auth: githubToken });
    this.username = githubUsername;

    // Set up output directory (separate from existing static data)
    this.outputDir = path.join(__dirname, '../../pr-data-with-descriptions');

    console.log('🚀 PR Extractor with Descriptions initialized');
    console.log(`📁 Output directory: ${this.outputDir}`);
    console.log(`👤 GitHub username: ${this.username}`);
  }

  /**
   * Create output directory
   */
  private setupDirectory(): void {
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
      console.log(`📁 Created output directory: ${this.outputDir}`);
    }
  }

  /**
   * Check if a PR is from an external repository (not owned by the target username)
   */
  private isExternalRepository(pr: PullRequestListData): boolean {
    return pr.repository.owner.login !== this.username;
  }

  /**
   * Process repository name based on truncation patterns and length limit
   */
  private processRepositoryName(name: string): string {
    // First apply pattern-based truncation
    let processedName = name;
    for (const { pattern, replacement } of REPOSITORY_NAME_TRUNCATION_PATTERNS) {
      if (pattern.test(processedName)) {
        processedName = processedName.replace(pattern, replacement);
        break; // Apply only the first matching pattern
      }
    }

    // Then enforce maximum length limit (no ellipsis, just truncate)
    if (processedName.length > MAX_REPOSITORY_NAME_LENGTH) {
      processedName = processedName.substring(0, MAX_REPOSITORY_NAME_LENGTH);
    }

    return processedName;
  }

  /**
   * Apply manual overrides to fix incorrect PR data
   */
  private applyManualOverrides(pr: PullRequestListData): PullRequestListData {
    const override = PR_OVERRIDES[pr.id];
    if (!override) {
      return pr;
    }

    return {
      ...pr,
      ...(override.title && { title: override.title }),
      ...(override.state && { state: override.state }),
      ...(override.merged_at !== undefined && { merged_at: override.merged_at }),
      ...(override.html_url && { html_url: override.html_url }),
      ...(override.comments !== undefined && { comments: override.comments })
    };
  }

  /**
   * Apply repository-level overrides (e.g., language customization, name truncation)
   */
  private applyRepositoryOverrides(pr: PullRequestListData): PullRequestListData {
    // First, process the repository name
    const processedName = this.processRepositoryName(pr.repository.name);

    // Then check for specific overrides using the original name
    const repoOverride = REPOSITORY_OVERRIDES[pr.repository.name];

    return {
      ...pr,
      repository: {
        ...pr.repository,
        name: processedName,
        ...(repoOverride?.language && { language: repoOverride.language })
      }
    };
  }

  /**
   * Convert PR data to include descriptions (opposite of stripUnusedFields)
   */
  private ensureDescriptionIncluded(pr: PullRequestListData): PRDataWithDescriptions {
    return {
      ...pr,
      description: pr.description || null // Ensure description is always present
    };
  }

  /**
   * Filter PRs to only include external repositories with additional filtering rules
   */
  private filterToExternalPRs(prs: PullRequestListData[]): PRDataWithDescriptions[] {
    // First, apply manual overrides and repository overrides
    let processedPRs = prs.map(pr => this.applyManualOverrides(pr))
      .map(pr => this.applyRepositoryOverrides(pr))
      .map(pr => this.ensureDescriptionIncluded(pr)); // Keep descriptions!

    // Filter to external repositories only and apply blacklist
    let filtered = processedPRs.filter(pr => {
      // Block manually blocked PRs
      const override = PR_OVERRIDES[pr.id];
      if (override?.blocked) {
        return false;
      }

      // Hide completely blacklisted repositories
      if (HIDDEN_REPOSITORIES.includes(pr.repository.name)) {
        return false;
      }

      // Show only external repositories (not user's own repos)
      return this.isExternalRepository(pr);
    });

    // Apply special filtering for limited repositories
    Object.entries(LIMITED_REPOSITORIES).forEach(([repoName, filterType]) => {
      if (filterType === 'keep-latest-only') {
        const repoPRs = filtered.filter(pr => pr.repository.name === repoName);
        if (repoPRs.length > 1) {
          // Sort by created_at date (most recent first) and keep only the first one
          const mostRecentPR = repoPRs.sort((a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          )[0];

          // Remove all PRs from this repo and add back only the most recent one
          filtered = filtered.filter(pr => pr.repository.name !== repoName);
          filtered.push(mostRecentPR);
        }
      }
    });

    return filtered;
  }

  /**
   * Check if a PR already has detailed data (additions/deletions)
   */
  private hasDetailedData(pr: PullRequestListData): boolean {
    return pr.additions !== undefined && pr.deletions !== undefined;
  }

  /**
   * Enhance existing PRs with descriptions, diffs, comments, and review comments from GitHub API
   */
  private async enhanceExistingPRsWithDescriptions(prs: PRDataWithDescriptions[]): Promise<PRDataWithDescriptions[]> {
    console.log(`🔄 Enhancing ${prs.length} PRs with descriptions, diffs, comments, and review comments from GitHub API...`);

    let enhancedCount = 0;
    const enhancedPRs = [...prs];

    for (let i = 0; i < prs.length; i++) {
      const pr = prs[i];
      try {
        // Extract owner and repo from the URL
        const urlParts = pr.html_url.split('/');
        const owner = urlParts[3];
        const repo = urlParts[4];

        console.log(`📡 [${i + 1}/${prs.length}] Fetching details, diff, comments, and review comments for ${owner}/${repo}#${pr.number}...`);

        // Fetch detailed data directly using GitHub API
        const { data: prDetail } = await this.octokit.rest.pulls.get({
          owner,
          repo,
          pull_number: pr.number
        });

        // Fetch the diff using the GitHub API
        console.log(`📄 Fetching diff for ${owner}/${repo}#${pr.number}...`);
        const { data: prDiff } = await this.octokit.rest.pulls.get({
          owner,
          repo,
          pull_number: pr.number,
          mediaType: {
            format: 'diff'
          }
        });

        // Fetch general PR comments (PRs use issue comments API)
        console.log(`💬 Fetching comments for ${owner}/${repo}#${pr.number}...`);
        const { data: prComments } = await this.octokit.rest.issues.listComments({
          owner,
          repo,
          issue_number: pr.number
        });

        // Fetch inline code review comments
        console.log(`🔍 Fetching review comments for ${owner}/${repo}#${pr.number}...`);
        const { data: prReviewComments } = await this.octokit.rest.pulls.listReviewComments({
          owner,
          repo,
          pull_number: pr.number
        });

        // Map general comments to our Comment interface
        const mappedComments: Comment[] = prComments.map(comment => ({
          id: comment.id,
          user: comment.user ? {
            login: comment.user.login,
            avatar_url: comment.user.avatar_url,
            html_url: comment.user.html_url
          } : null,
          body: comment.body || '',
          created_at: comment.created_at,
          updated_at: comment.updated_at,
          html_url: comment.html_url
        }));

        // Map review comments (inline code comments) to our ReviewComment interface
        const mappedReviewComments: ReviewComment[] = prReviewComments.map(comment => ({
          id: comment.id,
          user: comment.user ? {
            login: comment.user.login,
            avatar_url: comment.user.avatar_url,
            html_url: comment.user.html_url
          } : null,
          body: comment.body || '',
          created_at: comment.created_at,
          updated_at: comment.updated_at,
          html_url: comment.html_url,
          path: comment.path,
          diff_hunk: comment.diff_hunk || '',
          line: comment.line ?? null,
          original_line: comment.original_line ?? null,
          commit_id: comment.commit_id,
          in_reply_to_id: comment.in_reply_to_id ?? null // Captures follow-up replies!
        }));

        // Update the PR with description, diff, comments, and review comments
        enhancedPRs[i] = {
          ...enhancedPRs[i],
          description: prDetail.body || null,
          diff: prDiff as unknown as string || null, // Cast since mediaType changes return type
          comments_data: mappedComments,
          review_comments: mappedReviewComments,
          // Also update other fields if they're missing (for consistency)
          additions: enhancedPRs[i].additions || prDetail.additions,
          deletions: enhancedPRs[i].deletions || prDetail.deletions,
          comments: enhancedPRs[i].comments || prDetail.comments
        };

        enhancedCount++;
        const descriptionPreview = prDetail.body
          ? `"${prDetail.body.substring(0, 50)}${prDetail.body.length > 50 ? '...' : ''}"`
          : 'No description';
        const diffSize = prDiff ? `${(prDiff as unknown as string).length} chars` : 'No diff';
        const commentsCount = mappedComments.length;
        const reviewCommentsCount = mappedReviewComments.length;
        console.log(`✅ Enhanced ${owner}/${repo}#${pr.number} - ${descriptionPreview} + diff (${diffSize}) + ${commentsCount} comments + ${reviewCommentsCount} review comments`);

        // Add longer delay between API calls since we're making 4 calls per PR
        await delay(600);

      } catch (error) {
        console.warn(`⚠️ Failed to enhance PR ${pr.number}:`, error);
        continue;
      }
    }

    console.log(`🎉 Successfully enhanced ${enhancedCount}/${prs.length} PRs with descriptions, diffs, comments, and review comments`);
    return enhancedPRs;
  }

  /**
   * Enhance external PRs with detailed data from individual API calls (legacy method)
   */
  private async enhanceExternalPRsWithDetailedData(prs: PRDataWithDescriptions[]): Promise<PRDataWithDescriptions[]> {
    const prsNeedingEnhancement = prs.filter(pr => !this.hasDetailedData(pr));

    if (prsNeedingEnhancement.length === 0) {
      console.log('📊 All external PRs already have detailed data');
      return prs;
    }

    console.log(`🔄 Enhancing ${prsNeedingEnhancement.length} external PRs with detailed data...`);

    let enhancedCount = 0;
    const enhancedPRs = [...prs];

    for (const pr of prsNeedingEnhancement) {
      try {
        // Extract owner and repo from the URL
        const urlParts = pr.html_url.split('/');
        const owner = urlParts[3];
        const repo = urlParts[4];

        console.log(`📡 Fetching detailed data for ${owner}/${repo}#${pr.number}...`);

        // Fetch detailed data directly using GitHub API
        const { data: prDetail } = await this.octokit.rest.pulls.get({
          owner,
          repo,
          pull_number: pr.number
        });

        // Find and update the PR in the array
        const prIndex = enhancedPRs.findIndex(p => p.id === pr.id);
        if (prIndex !== -1) {
          enhancedPRs[prIndex] = {
            ...enhancedPRs[prIndex],
            description: prDetail.body || null, // Make sure to get the description
            additions: prDetail.additions,
            deletions: prDetail.deletions,
            comments: prDetail.comments
          };
          enhancedCount++;
          console.log(`✅ Enhanced ${owner}/${repo}#${pr.number} with +${prDetail.additions} -${prDetail.deletions} comments:${prDetail.comments}`);
        }

        // Add delay between API calls to be respectful
        await delay(200);

      } catch (error) {
        console.warn(`⚠️ Failed to enhance PR ${pr.number}:`, error);
        continue;
      }
    }

    console.log(`🎉 Successfully enhanced ${enhancedCount} external PRs with detailed data`);
    return enhancedPRs;
  }

  /**
   * Read existing static data from the website
   */
  private readExistingStaticData(): PRDataWithDescriptions[] {
    try {
      console.log('📖 Reading existing static data from website...');

      // Read the existing pr-page-1.json from the web app
      const staticDataPath = 'C:\\Projects\\developer-portfolio\\apps\\web\\static\\pr-page-1.json';

      if (!fs.existsSync(staticDataPath)) {
        throw new Error(`Static data file not found at: ${staticDataPath}`);
      }

      const staticData = JSON.parse(fs.readFileSync(staticDataPath, 'utf8'));

      // Convert existing data to our format with descriptions and diffs
      const existingPRs: PRDataWithDescriptions[] = staticData.data.map((pr: PullRequestListData) => ({
        ...pr,
        description: null, // Will be populated by API calls
        diff: null // Will be populated by API calls
      }));

      console.log(`📊 Found ${existingPRs.length} existing external PRs from website static data`);
      return existingPRs;

    } catch (error) {
      console.error('❌ Failed to read existing static data:', error);
      throw error;
    }
  }

  /**
   * Generate PR data with descriptions using existing static data as base
   */
  async generatePRDataWithDescriptions(): Promise<void> {
    try {
      console.log('🔄 Starting efficient PR data extraction with descriptions, diffs, comments, and review comments...');
      console.log('💡 Using existing website static data to avoid fetching unwanted PRs');

      this.setupDirectory();

      // Read existing static data from the website (already filtered)
      const existingPRs = this.readExistingStaticData();

      // Enhance each PR with description, diff, comment, and review comment data
      console.log('🔧 Enhancing each PR with description, diff, comment, and review comment data from GitHub API...');
      const enhancedPRs = await this.enhanceExistingPRsWithDescriptions(existingPRs);

      // Generate a single comprehensive file (data is already sorted in static file)
      await this.generatePRDataFile(enhancedPRs);

      console.log('✅ Efficient PR data extraction with descriptions, diffs, comments, and review comments completed successfully!');
      console.log(`📁 Generated file in: ${this.outputDir}`);
      console.log(`📊 Total external PRs: ${enhancedPRs.length}`);

    } catch (error) {
      console.error('❌ Failed to generate PR data with descriptions:', error);
      throw error;
    }
  }

  /**
   * Generate the final JSON file with PR data including descriptions
   */
  private async generatePRDataFile(prs: PRDataWithDescriptions[]): Promise<void> {
    try {
      console.log(`📄 Generating PR data file with ${prs.length} pull requests...`);

      // Create pagination metadata (single page with all data)
      const pagination: PaginationMeta = {
        page: 1,
        per_page: prs.length,
        total_count: prs.length,
        total_pages: 1,
        has_next_page: false,
        has_previous_page: false
      };

      const pageData: PRPageDataWithDescriptions = {
        data: prs,
        meta: {
          username: this.username,
          count: prs.length,
          pagination: pagination
        }
      };

      const filePath = path.join(this.outputDir, 'external-prs-details-diffs-comments.json');
      fs.writeFileSync(filePath, JSON.stringify(pageData, null, 2), 'utf8');

      console.log(`✅ Generated PR data file with ${prs.length} pull requests`);
      console.log(`📁 File saved to: ${filePath}`);

      // Generate a summary report
      const withDescriptions = prs.filter(pr => pr.description && pr.description.trim().length > 0).length;
      console.log(`📋 PRs with descriptions: ${withDescriptions}/${prs.length}`);

    } catch (error) {
      console.error(`❌ Failed to generate PR data file:`, error);
      throw error;
    }
  }
}

/**
 * Main execution function
 */
async function main() {
  try {
    const extractor = new PRExtractorWithDescriptions();
    await extractor.generatePRDataWithDescriptions();
    console.log('🎉 PR data extraction with descriptions, diffs, comments, and review comments completed successfully!');
  } catch (error) {
    console.error('💥 PR data extraction failed:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

export { PRExtractorWithDescriptions };