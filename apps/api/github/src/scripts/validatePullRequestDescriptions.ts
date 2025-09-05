#!/usr/bin/env node

/**
 * Pull Request Description Validation Script
 * 
 * This script validates that pull requests with specific blocked descriptions 
 * are not present in the static data during the build process.
 * If any blocked descriptions are found, the build will fail.
 * 
 * This ensures that PRs with certain restricted content cannot be processed
 * through the build pipeline, effectively blocking them from deployment.
 * 
 * Usage:
 *   npm run validate-pr-descriptions
 *   node dist/apps/api/github/src/scripts/validatePullRequestDescriptions.js
 */

import * as fs from 'fs';
import * as path from 'path';

// The specific description that should block the build
const BLOCKED_DESCRIPTION = "Remove `disableRecycling` documentation to deter developers from using internal prop";

interface PullRequestData {
  id: number;
  number: number;
  title: string;
  description: string;
  state: string;
  html_url: string;
  repository: {
    name: string;
  };
}

interface StaticPageData {
  data: PullRequestData[];
  meta: any;
}

/**
 * Validates that no PRs contain the blocked description
 */
class PullRequestDescriptionValidator {
  private staticDir: string;
  private pullRequestsDir: string;
  private throwOnError: boolean;

  constructor(throwOnError: boolean = false) {
    // Use relative paths from the script location
    this.staticDir = path.resolve(__dirname, '../../static');
    this.pullRequestsDir = path.join(this.staticDir, 'pull-requests');
    this.throwOnError = throwOnError;
  }

  /**
   * Main validation method
   */
  async validate(): Promise<void> {
    console.log('🔍 Starting pull request description validation...');
    console.log(`📁 Checking directory: ${this.pullRequestsDir}`);

    if (!fs.existsSync(this.pullRequestsDir)) {
      console.log('⚠️ Pull requests directory not found - skipping validation');
      return;
    }

    const blockedPRs = await this.findBlockedPRs();
    
    if (blockedPRs.length > 0) {
      console.error('❌ Build blocked: Found PRs with restricted descriptions');
      console.error('');
      
      for (const pr of blockedPRs) {
        console.error(`🚫 BLOCKED PR: ${pr.repository.name}#${pr.number}`);
        console.error(`   Title: ${pr.title}`);
        console.error(`   URL: ${pr.html_url}`);
        console.error(`   State: ${pr.state}`);
        console.error(`   Reason: Contains blocked description`);
        console.error('');
      }
      
      console.error(`💡 Found ${blockedPRs.length} PR(s) with the blocked description:`);
      console.error(`   "${BLOCKED_DESCRIPTION}"`);
      console.error('');
      console.error('⛔ Build cannot proceed with PRs containing this description.');
      console.error('   Please remove or modify the description to continue.');
      
      if (this.throwOnError) {
        throw new Error(`Found ${blockedPRs.length} PR(s) with blocked description`);
      } else {
        process.exit(1);
      }
    }

    console.log('✅ PR description validation passed - no blocked descriptions found');
  }

  /**
   * Finds PRs with blocked descriptions
   */
  private async findBlockedPRs(): Promise<PullRequestData[]> {
    const blockedPRs: PullRequestData[] = [];
    
    // Read all page files
    const files = fs.readdirSync(this.pullRequestsDir)
      .filter(file => file.startsWith('page-') && file.endsWith('.json'))
      .sort(); // Ensure consistent order

    console.log(`📋 Checking ${files.length} page files for blocked descriptions...`);

    for (const file of files) {
      const filePath = path.join(this.pullRequestsDir, file);
      
      try {
        const pageData: StaticPageData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        
        for (const pr of pageData.data) {
          if (this.isContentBlocked(pr.title, pr.description)) {
            console.log(`🚫 Found blocked PR in ${file}: ${pr.repository.name}#${pr.number}`);
            blockedPRs.push(pr);
          }
        }
      } catch (error) {
        console.warn(`⚠️ Failed to process ${file}:`, error);
      }
    }

    return blockedPRs;
  }

  /**
   * Checks if a title or description contains blocked content
   */
  private isContentBlocked(title: string, description: string): boolean {
    // Check title first (most common case)
    if (title && title.includes(BLOCKED_DESCRIPTION)) {
      return true;
    }
    
    // Also check description for completeness
    if (!description) return false;
    
    // Check for exact match in the title/first line of description
    const firstLine = description.split('\n')[0].trim();
    if (firstLine === BLOCKED_DESCRIPTION) {
      return true;
    }
    
    // Check if the blocked description appears anywhere in the content
    return description.includes(BLOCKED_DESCRIPTION);
  }
}

// Run validation if this script is executed directly
if (require.main === module) {
  const validator = new PullRequestDescriptionValidator();
  validator.validate().catch(error => {
    console.error('❌ Validation failed:', error);
    process.exit(1);
  });
}

export default PullRequestDescriptionValidator;