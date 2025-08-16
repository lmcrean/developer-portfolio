#!/usr/bin/env node

/**
 * Static Data Generation Script
 * 
 * Generates static JSON files containing GitHub pull request data
 * to replace live API calls and improve performance.
 * 
 * Usage:
 *   npm run generate-static-data
 *   node dist/scripts/generateStaticData.js
 */

import dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
import { GitHubService } from '../github';
import { Octokit } from '@octokit/rest';
import { delay } from '../utils/rateLimitUtils';

// Filtering configuration - copied from frontend to ensure consistency
const HIDDEN_REPOSITORIES = [
  'team-5',
  'halloween-hackathon',
  'vitest-dev',
  'vitest'
];

const LIMITED_REPOSITORIES = {
  'penpot': 'keep-latest-only'
};

interface PullRequestOverride {
  id: number;
  title?: string;
  state?: 'open' | 'closed' | 'merged';
  merged_at?: string | null;
  html_url?: string;
}

const PR_OVERRIDES: Record<number, PullRequestOverride> = {
  // Penpot milestone lock feature PR - was incorrectly marked as closed, actually merged
  2696869536: {
    id: 2696869536,
    title: "Enhance (version control): Add milestone lock feature to prevent accidental deletion and bad actor interventions",
    state: "merged",
    merged_at: "2025-07-26T12:15:30Z",
    html_url: "https://github.com/penpot/penpot/commit/0b47a366abb56fe553c70ab6716230b1b4646071"
  }
};

// Load environment variables from .env file
dotenv.config();
// Define types locally to avoid DOM dependencies in shared types
interface PullRequestListData {
  id: number;
  number: number;
  title: string;
  description: string | null;
  created_at: string;
  merged_at: string | null;
  state: 'open' | 'closed' | 'merged';
  html_url: string;
  additions?: number;
  deletions?: number;
  repository: {
    name: string;
    description: string | null;
    language: string | null;
    html_url: string;
    owner: {
      login: string;
      avatar_url: string;
    };
  };
}

interface PaginationMeta {
  page: number;
  per_page: number;
  total_count: number;
  total_pages: number;
  has_next_page: boolean;
  has_previous_page: boolean;
}

interface StaticDataMetadata {
  total_count: number;
  total_pages: number;
  per_page: number;
  last_generated: string;
  generator_version: string;
  pages_generated: number;
  external_prs_enhanced?: number;
  enhancement_enabled?: boolean;
}

interface StaticPageData {
  data: PullRequestListData[];
  meta: {
    username: string;
    count: number;
    pagination: PaginationMeta;
  };
}

class StaticDataGenerator {
  private githubService: GitHubService;
  private octokit: Octokit;
  private staticDir: string;
  private pullRequestsDir: string;
  private username: string;
  private perPage: number = 20;
  private enhanceExternalPRs: boolean = true;
  private maxExternalPRsPerPage: number = 10;

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
    
    // Set up directory paths
    this.staticDir = path.join(__dirname, '../../static');
    this.pullRequestsDir = path.join(this.staticDir, 'pull-requests');

    console.log('🚀 Static Data Generator initialized');
    console.log(`📁 Static directory: ${this.staticDir}`);
    console.log(`👤 GitHub username: ${this.username}`);
  }

  /**
   * Create necessary directories
   */
  private setupDirectories(): void {
    if (!fs.existsSync(this.staticDir)) {
      fs.mkdirSync(this.staticDir, { recursive: true });
      console.log(`📁 Created static directory: ${this.staticDir}`);
    }

    if (!fs.existsSync(this.pullRequestsDir)) {
      fs.mkdirSync(this.pullRequestsDir, { recursive: true });
      console.log(`📁 Created pull-requests directory: ${this.pullRequestsDir}`);
    }
  }

  /**
   * Check if a PR is from an external repository (not owned by the target username)
   */
  private isExternalRepository(pr: PullRequestListData): boolean {
    return pr.repository.owner.login !== this.username;
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
      ...(override.html_url && { html_url: override.html_url })
    };
  }

  /**
   * Filter PRs to only include external repositories with additional filtering rules
   */
  private filterToExternalPRs(prs: PullRequestListData[]): PullRequestListData[] {
    // First, apply manual overrides to fix incorrect data
    let processedPRs = prs.map(pr => this.applyManualOverrides(pr));
    
    // Filter to external repositories only and apply blacklist
    let filtered = processedPRs.filter(pr => {
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
   * Enhance external PRs with detailed data from individual API calls
   */
  private async enhanceExternalPRsWithDetailedData(prs: PullRequestListData[]): Promise<PullRequestListData[]> {
    if (!this.enhanceExternalPRs) {
      return prs;
    }

    const externalPRs = prs.filter(pr => this.isExternalRepository(pr) && !this.hasDetailedData(pr));
    
    if (externalPRs.length === 0) {
      console.log('📊 No external PRs need enhancement');
      return prs;
    }

    // Limit the number of external PRs to enhance to avoid rate limiting
    const prsToEnhance = externalPRs.slice(0, this.maxExternalPRsPerPage);
    console.log(`🔄 Enhancing ${prsToEnhance.length} external PRs out of ${externalPRs.length} found`);

    let enhancedCount = 0;
    const enhancedPRs = [...prs];

    for (const pr of prsToEnhance) {
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
            additions: prDetail.additions,
            deletions: prDetail.deletions
          };
          enhancedCount++;
          console.log(`✅ Enhanced ${owner}/${repo}#${pr.number} with +${prDetail.additions} -${prDetail.deletions}`);
        }

        // Add delay between API calls to be respectful
        await delay(150);

      } catch (error) {
        console.warn(`⚠️ Failed to enhance PR ${pr.number}:`, error);
        continue;
      }
    }

    console.log(`🎉 Successfully enhanced ${enhancedCount} external PRs with detailed data`);
    return enhancedPRs;
  }

  /**
   * Enhance all external PRs with detailed data (no limits)
   */
  private async enhanceAllExternalPRs(externalPRs: PullRequestListData[]): Promise<PullRequestListData[]> {
    if (!this.enhanceExternalPRs) {
      return externalPRs;
    }

    const prsNeedingEnhancement = externalPRs.filter(pr => !this.hasDetailedData(pr));
    
    if (prsNeedingEnhancement.length === 0) {
      console.log('📊 All external PRs already have detailed data');
      return externalPRs;
    }

    console.log(`🔄 Enhancing ${prsNeedingEnhancement.length} external PRs with detailed data...`);

    let enhancedCount = 0;
    const enhancedPRs = [...externalPRs];

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
            additions: prDetail.additions,
            deletions: prDetail.deletions
          };
          enhancedCount++;
          console.log(`✅ Enhanced ${owner}/${repo}#${pr.number} with +${prDetail.additions} -${prDetail.deletions}`);
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
   * Generate static data files with pre-filtered external PRs
   */
  async generateStaticData(): Promise<void> {
    try {
      console.log('🔄 Starting static data generation with external PR filtering...');
      
      this.setupDirectories();

      // Fetch first page to get total count
      console.log('🔍 Fetching first page to determine total data size...');
      const firstPageResult = await this.githubService.getPullRequests(this.username, 1, this.perPage);
      
      const totalCount = firstPageResult.meta.pagination.total_count;
      const totalPages = Math.ceil(totalCount / this.perPage);
      
      console.log(`📊 Found ${totalCount} total pull requests across ${totalPages} pages`);

      // Collect ALL PRs from all pages first
      console.log('📥 Collecting all pull requests for filtering...');
      const allPRs: PullRequestListData[] = [];
      
      for (let page = 1; page <= totalPages; page++) {
        console.log(`📄 Fetching page ${page}/${totalPages}...`);
        const result = await this.githubService.getPullRequests(this.username, page, this.perPage);
        allPRs.push(...result.data);
        
        // Add small delay to be respectful to API
        if (page < totalPages) {
          await delay(100);
        }
      }
      
      console.log(`📊 Collected ${allPRs.length} total PRs`);

      // Filter to external PRs only
      console.log('🔍 Filtering to external PRs only...');
      const externalPRs = this.filterToExternalPRs(allPRs);
      console.log(`📊 Found ${externalPRs.length} external PRs after filtering`);

      // Enhance external PRs with detailed data
      console.log('🔧 Enhancing external PRs with detailed data...');
      const enhancedExternalPRs = await this.enhanceAllExternalPRs(externalPRs);
      
      // Generate pages with external PRs only (20 per page)
      const externalPages = Math.ceil(enhancedExternalPRs.length / this.perPage);
      console.log(`📄 Creating ${externalPages} pages with external PRs only`);
      
      let totalEnhancedCount = 0;
      for (let page = 1; page <= externalPages; page++) {
        const enhancedCount = await this.generateExternalPRPageFile(page, enhancedExternalPRs);
        totalEnhancedCount += enhancedCount;
      }

      // Generate metadata file for external PRs
      await this.generateMetadataFile(enhancedExternalPRs.length, externalPages, externalPages, totalEnhancedCount);

      console.log('✅ Static data generation completed successfully!');
      console.log(`📁 Generated files in: ${this.pullRequestsDir}`);
      console.log(`📊 Total external PRs: ${enhancedExternalPRs.length}`);
      console.log(`📊 External pages generated: ${externalPages}`);
      console.log(`🔧 Total external PRs enhanced: ${totalEnhancedCount}`);

    } catch (error) {
      console.error('❌ Failed to generate static data:', error);
      throw error;
    }
  }

  /**
   * Generate a single page file with external PRs only
   */
  private async generateExternalPRPageFile(page: number, allExternalPRs: PullRequestListData[]): Promise<number> {
    try {
      console.log(`📄 Generating external PR page ${page}...`);
      
      // Calculate start and end indices for this page
      const startIndex = (page - 1) * this.perPage;
      const endIndex = startIndex + this.perPage;
      const pageExternalPRs = allExternalPRs.slice(startIndex, endIndex);
      
      // Count enhanced PRs in this page
      const enhancedCount = pageExternalPRs.filter(pr => this.hasDetailedData(pr)).length;
      
      // Create pagination metadata for external PRs
      const totalExternalPages = Math.ceil(allExternalPRs.length / this.perPage);
      const pagination: PaginationMeta = {
        page: page,
        per_page: this.perPage,
        total_count: allExternalPRs.length,
        total_pages: totalExternalPages,
        has_next_page: page < totalExternalPages,
        has_previous_page: page > 1
      };

      const pageData: StaticPageData = {
        data: pageExternalPRs,
        meta: {
          username: this.username,
          count: pageExternalPRs.length,
          pagination: pagination
        }
      };

      const filePath = path.join(this.pullRequestsDir, `page-${page}.json`);
      fs.writeFileSync(filePath, JSON.stringify(pageData, null, 2), 'utf8');
      
      console.log(`✅ Generated external PR page ${page} with ${pageExternalPRs.length} pull requests (${enhancedCount} enhanced)`);
      return enhancedCount;
    } catch (error) {
      console.error(`❌ Failed to generate external PR page ${page}:`, error);
      throw error;
    }
  }

  /**
   * Generate a single page file with enhancement for external PRs (legacy method)
   */
  private async generatePageFile(page: number): Promise<number> {
    try {
      console.log(`📄 Generating page ${page}...`);
      
      const result = await this.githubService.getPullRequests(this.username, page, this.perPage);
      
      // Count external PRs before enhancement
      const externalPRsCount = result.data.filter(pr => this.isExternalRepository(pr) && !this.hasDetailedData(pr)).length;
      
      // Enhance external PRs with detailed data
      const enhancedData = await this.enhanceExternalPRsWithDetailedData(result.data);
      
      // Count how many were actually enhanced
      const enhancedCount = enhancedData.filter(pr => this.isExternalRepository(pr) && this.hasDetailedData(pr)).length;
      const actuallyEnhanced = Math.min(enhancedCount, externalPRsCount);

      const pageData: StaticPageData = {
        data: enhancedData,
        meta: result.meta
      };

      const filePath = path.join(this.pullRequestsDir, `page-${page}.json`);
      fs.writeFileSync(filePath, JSON.stringify(pageData, null, 2), 'utf8');
      
      console.log(`✅ Generated page ${page} with ${result.data.length} pull requests (${actuallyEnhanced} external PRs enhanced)`);
      return actuallyEnhanced;
    } catch (error) {
      console.error(`❌ Failed to generate page ${page}:`, error);
      throw error;
    }
  }

  /**
   * Generate metadata file with generation info
   */
  private async generateMetadataFile(totalCount: number, totalPages: number, pagesGenerated: number, enhancedPRsCount: number = 0): Promise<void> {
    const metadata: StaticDataMetadata = {
      total_count: totalCount,
      total_pages: totalPages,
      per_page: this.perPage,
      last_generated: new Date().toISOString(),
      generator_version: '2.0.0',
      pages_generated: pagesGenerated,
      external_prs_enhanced: enhancedPRsCount,
      enhancement_enabled: this.enhanceExternalPRs
    };

    const metadataPath = path.join(this.pullRequestsDir, 'metadata.json');
    fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2), 'utf8');
    
    console.log(`📋 Generated metadata file (${enhancedPRsCount} external PRs enhanced)`);
  }

  /**
   * Validate generated files
   */
  async validateGeneratedFiles(): Promise<boolean> {
    try {
      console.log('🔍 Validating generated files...');

      // Check if metadata exists
      const metadataPath = path.join(this.pullRequestsDir, 'metadata.json');
      if (!fs.existsSync(metadataPath)) {
        console.error('❌ Metadata file not found');
        return false;
      }

      // Read metadata
      const metadata: StaticDataMetadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
      
      // Validate all page files exist
      for (let page = 1; page <= metadata.total_pages; page++) {
        const pagePath = path.join(this.pullRequestsDir, `page-${page}.json`);
        if (!fs.existsSync(pagePath)) {
          console.error(`❌ Page file missing: page-${page}.json`);
          return false;
        }

        // Validate page file structure
        const pageData: StaticPageData = JSON.parse(fs.readFileSync(pagePath, 'utf8'));
        if (!pageData.data || !pageData.meta) {
          console.error(`❌ Invalid page file structure: page-${page}.json`);
          return false;
        }
      }

      console.log('✅ All generated files validated successfully');
      return true;
    } catch (error) {
      console.error('❌ Validation failed:', error);
      return false;
    }
  }
}

/**
 * Main execution function
 */
async function main() {
  try {
    const generator = new StaticDataGenerator();
    
    await generator.generateStaticData();
    
    const isValid = await generator.validateGeneratedFiles();
    if (!isValid) {
      process.exit(1);
    }
    
    console.log('🎉 Static data generation and validation completed!');
  } catch (error) {
    console.error('💥 Static data generation failed:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

export { StaticDataGenerator };