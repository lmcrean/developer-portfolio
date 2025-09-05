#!/usr/bin/env node

/**
 * Test script for Pull Request Description Validation
 * 
 * This script tests the validation functionality with mock data
 * to ensure it correctly identifies and blocks restricted descriptions.
 */

import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import PullRequestDescriptionValidator from './validatePullRequestDescriptions';

interface TestCase {
  name: string;
  mockData: any;
  shouldFail: boolean;
  description: string;
}

class ValidationTester {
  private tempDir: string;
  private tempStaticDir: string;
  private tempPRDir: string;

  constructor() {
    // Create a temporary directory for testing
    this.tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'pr-validation-test-'));
    this.tempStaticDir = path.join(this.tempDir, 'static');
    this.tempPRDir = path.join(this.tempStaticDir, 'pull-requests');
    
    fs.mkdirSync(this.tempStaticDir, { recursive: true });
    fs.mkdirSync(this.tempPRDir, { recursive: true });
  }

  cleanup() {
    // Clean up temporary directory
    fs.rmSync(this.tempDir, { recursive: true, force: true });
  }

  async runTests(): Promise<void> {
    console.log('🧪 Starting PR description validation tests...');
    console.log(`📁 Using temp directory: ${this.tempDir}`);

    const testCases: TestCase[] = [
      {
        name: 'Empty directory',
        mockData: null,
        shouldFail: false,
        description: 'Should pass when no PR data exists'
      },
      {
        name: 'Valid PRs only',
        mockData: {
          data: [
            {
              id: 1,
              number: 1,
              title: "Fix bug in authentication",
              description: "This PR fixes a bug in the authentication system",
              state: "open",
              html_url: "https://github.com/example/repo/pull/1",
              repository: { name: "example-repo" }
            }
          ],
          meta: {}
        },
        shouldFail: false,
        description: 'Should pass when PRs have normal descriptions'
      },
      {
        name: 'Blocked description in title',
        mockData: {
          data: [
            {
              id: 2,
              number: 2,
              title: "Remove `disableRecycling` documentation to deter developers from using internal prop",
              description: "This PR removes documentation",
              state: "merged",
              html_url: "https://github.com/example/repo/pull/2",
              repository: { name: "test-repo" }
            }
          ],
          meta: {}
        },
        shouldFail: true,
        description: 'Should fail when blocked description is in title'
      },
      {
        name: 'Blocked description in content',
        mockData: {
          data: [
            {
              id: 3,
              number: 3,
              title: "Documentation update",
              description: "Remove `disableRecycling` documentation to deter developers from using internal prop\n\nThis change removes the problematic documentation.",
              state: "open",
              html_url: "https://github.com/example/repo/pull/3",
              repository: { name: "another-repo" }
            }
          ],
          meta: {}
        },
        shouldFail: true,
        description: 'Should fail when blocked description is in content'
      },
      {
        name: 'Partial match should not block',
        mockData: {
          data: [
            {
              id: 4,
              number: 4,
              title: "Remove disableRecycling prop",
              description: "This removes some recycling functionality",
              state: "open",
              html_url: "https://github.com/example/repo/pull/4",
              repository: { name: "partial-repo" }
            }
          ],
          meta: {}
        },
        shouldFail: false,
        description: 'Should pass when only partial match exists'
      }
    ];

    let passedTests = 0;
    let totalTests = testCases.length;

    for (const testCase of testCases) {
      try {
        await this.runSingleTest(testCase);
        passedTests++;
        console.log(`✅ ${testCase.name}: PASSED`);
      } catch (error) {
        console.log(`❌ ${testCase.name}: FAILED - ${error}`);
      }
    }

    console.log('');
    console.log('🎯 Test Results:');
    console.log(`   Passed: ${passedTests}/${totalTests}`);
    
    if (passedTests === totalTests) {
      console.log('🎉 All tests passed!');
    } else {
      console.log('❌ Some tests failed!');
      process.exit(1);
    }
  }

  private async runSingleTest(testCase: TestCase): Promise<void> {
    // Clean up previous test data
    const pageFile = path.join(this.tempPRDir, 'page-1.json');
    if (fs.existsSync(pageFile)) {
      fs.unlinkSync(pageFile);
    }

    // Create mock data if provided
    if (testCase.mockData) {
      fs.writeFileSync(pageFile, JSON.stringify(testCase.mockData, null, 2));
    }

    // Create a validator that uses our temp directory
    const validator = new (class extends PullRequestDescriptionValidator {
      constructor(tempDir: string) {
        super(true); // Enable throw on error for testing
        // Override the directories to use our temp directory
        (this as any).staticDir = path.join(tempDir, 'static');
        (this as any).pullRequestsDir = path.join(tempDir, 'static', 'pull-requests');
      }
    })(this.tempDir);

    try {
      // Capture output during validation to reduce noise in tests
      const originalLog = console.log;
      const originalError = console.error;
      let validationFailed = false;
      
      // Suppress output during test validation runs to keep output clean
      console.log = () => {};
      console.error = () => {};
      
      try {
        await validator.validate();
      } catch (error) {
        validationFailed = true;
      } finally {
        // Restore original console methods
        console.log = originalLog;
        console.error = originalError;
      }
      
      if (testCase.shouldFail && !validationFailed) {
        throw new Error('Expected validation to fail but it passed');
      }
      
      if (!testCase.shouldFail && validationFailed) {
        throw new Error('Expected validation to pass but it failed');
      }
    } catch (error) {
      throw error;
    }
  }
}

// Run tests if this script is executed directly
if (require.main === module) {
  const tester = new ValidationTester();
  
  tester.runTests()
    .then(() => {
      tester.cleanup();
      console.log('🧹 Cleanup completed');
    })
    .catch(error => {
      console.error('❌ Test execution failed:', error);
      tester.cleanup();
      process.exit(1);
    });
}

export default ValidationTester;