import express from 'express';
import { GitHubService } from '../github';
import { createHabitTrackerRouter } from '../pull-requests/habit-tracker';

/**
 * GitHub API endpoints
 */
export function setupGitHubRoutes(app: express.Application, githubService: GitHubService): void {
  // Get pull requests for a user - support both path and query parameters
  app.get('/api/github/pull-requests/:username?', async (req, res) => {
    try {
      // Support both path parameter (:username) and query parameter (?username=...)
      const username = req.params.username || req.query.username as string;
      
      if (!username) {
        return res.status(400).json({ 
          error: 'Username is required',
          message: 'Please provide username either as path parameter or query parameter' 
        });
      }
      
      const page = parseInt(req.query.page as string) || 1;
      let perPage = parseInt(req.query.per_page as string) || 10;
      
      // Validate page parameter
      if (page < 1) {
        return res.status(400).json({ 
          error: 'Invalid page parameter',
          message: 'Page must be a positive integer' 
        });
      }
      
      // Validate and limit per_page parameter to prevent rate limiting
      if (perPage < 1) {
        return res.status(400).json({ 
          error: 'Invalid per_page parameter',
          message: 'per_page must be a positive integer' 
        });
      }
      
      // Cap per_page at 50 to prevent rate limiting and performance issues
      const maxPerPage = 50;
      if (perPage > maxPerPage) {
        perPage = maxPerPage;
        console.log(`⚠️ per_page parameter ${req.query.per_page} capped at ${maxPerPage} for user ${username}`);
      }
      
      const result = await githubService.getPullRequests(username, page, perPage);
      res.json(result);
    } catch (error) {
      console.error('❌ Error in pull requests endpoint:', error);
      res.status(500).json({ 
        error: 'Failed to fetch pull requests', 
        message: error instanceof Error ? error.message : 'Unknown error occurred' 
      });
    }
  });

  // Get details for a specific pull request
  app.get('/api/github/pull-requests/:owner/:repo/:pullNumber', async (req, res) => {
    try {
      const { owner, repo, pullNumber } = req.params;
      const prNumber = parseInt(pullNumber);
      
      const result = await githubService.getPullRequestDetails(owner, repo, prNumber);
      res.json(result);
    } catch (error) {
      // Check if it's a 404 error (expected during testing)
      const isNotFound = (error as any).status === 404 || 
                        (error instanceof Error && error.message.includes('Not Found'));
      
      // Check if it's a test case (common test patterns)
      const isTestCase = req.params.owner === 'invalid-owner' || 
                        req.params.repo === 'invalid-repo' || 
                        parseInt(req.params.pullNumber) === 999999;
      
      if (isNotFound) {
        if (isTestCase) {
          // Clear message for intentional test cases
          console.log(`🧪 Test case: API endpoint handling 404 (expected): ${req.params.owner}/${req.params.repo}#${req.params.pullNumber}`);
        } else {
          // Log simple message for real 404s
          console.log(`🔍 Pull request not found: ${req.params.owner}/${req.params.repo}#${req.params.pullNumber}`);
        }
        
        res.status(404).json({ 
          error: 'Not Found', 
          message: error instanceof Error ? error.message : 'Pull request not found' 
        });
      } else {
        // Log full error details for unexpected errors (only for non-test cases)
        if (!isTestCase) {
          console.error('❌ Error in pull request details endpoint:', error);
        }
        
        res.status(500).json({ 
          error: 'Failed to fetch pull request details', 
          message: error instanceof Error ? error.message : 'Unknown error occurred' 
        });
      }
    }
  });

  // Get current GitHub API rate limit status
  app.get('/api/github/rate-limit', async (req, res) => {
    try {
      const result = await githubService.getRateLimit();
      res.json(result);
    } catch (error) {
      console.error('❌ Error in rate limit endpoint:', error);
      res.status(500).json({ 
        error: 'Failed to check rate limit', 
        message: error instanceof Error ? error.message : 'Unknown error occurred' 
      });
    }
  });

  // Mount habit tracker routes
  const username = process.env.GITHUB_USERNAME || 'lauriecrean';
  const habitTrackerRouter = createHabitTrackerRouter(githubService.getOctokit(), username);
  app.use('/api/github/habit-tracker', habitTrackerRouter);

  console.log('✅ GitHub routes configured: /api/github/pull-requests, /api/github/rate-limit, /api/github/habit-tracker');
} 