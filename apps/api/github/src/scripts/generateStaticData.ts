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
  private staticDir: string;
  private pullRequestsDir: string;
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
   * Generate static data files
   */
  async generateStaticData(): Promise<void> {
    try {
      console.log('🔄 Starting static data generation...');
      
      this.setupDirectories();

      // Fetch first page to get total count
      console.log('🔍 Fetching first page to determine total data size...');
      const firstPageResult = await this.githubService.getPullRequests(this.username, 1, this.perPage);
      
      const totalCount = firstPageResult.meta.pagination.total_count;
      const totalPages = Math.ceil(totalCount / this.perPage);
      
      console.log(`📊 Found ${totalCount} total pull requests across ${totalPages} pages`);

      // Generate page files
      const pagePromises: Promise<void>[] = [];
      
      for (let page = 1; page <= totalPages; page++) {
        pagePromises.push(this.generatePageFile(page));
      }

      // Wait for all pages to complete
      await Promise.all(pagePromises);

      // Generate metadata file
      await this.generateMetadataFile(totalCount, totalPages, totalPages);

      console.log('✅ Static data generation completed successfully!');
      console.log(`📁 Generated files in: ${this.pullRequestsDir}`);
      console.log(`📊 Total pages generated: ${totalPages}`);

    } catch (error) {
      console.error('❌ Failed to generate static data:', error);
      throw error;
    }
  }

  /**
   * Generate a single page file
   */
  private async generatePageFile(page: number): Promise<void> {
    try {
      console.log(`📄 Generating page ${page}...`);
      
      const result = await this.githubService.getPullRequests(this.username, page, this.perPage);
      
      const pageData: StaticPageData = {
        data: result.data,
        meta: result.meta
      };

      const filePath = path.join(this.pullRequestsDir, `page-${page}.json`);
      fs.writeFileSync(filePath, JSON.stringify(pageData, null, 2), 'utf8');
      
      console.log(`✅ Generated page ${page} with ${result.data.length} pull requests`);
    } catch (error) {
      console.error(`❌ Failed to generate page ${page}:`, error);
      throw error;
    }
  }

  /**
   * Generate metadata file with generation info
   */
  private async generateMetadataFile(totalCount: number, totalPages: number, pagesGenerated: number): Promise<void> {
    const metadata: StaticDataMetadata = {
      total_count: totalCount,
      total_pages: totalPages,
      per_page: this.perPage,
      last_generated: new Date().toISOString(),
      generator_version: '1.0.0',
      pages_generated: pagesGenerated
    };

    const metadataPath = path.join(this.pullRequestsDir, 'metadata.json');
    fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2), 'utf8');
    
    console.log('📋 Generated metadata file');
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