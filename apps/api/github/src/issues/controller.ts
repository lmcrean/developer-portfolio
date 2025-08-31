import { Request, Response } from 'express';
import { GitHubIssuesService } from './service';

export class IssuesController {
  private service: GitHubIssuesService;

  constructor(token: string) {
    this.service = new GitHubIssuesService(token);
  }

  /**
   * GET /api/issues/external-created
   * Get issues created by user in external repositories
   */
  async getExternalCreatedIssues(req: Request, res: Response) {
    try {
      const username = req.query.username as string || process.env.GITHUB_USERNAME || 'lmcrean';
      
      const issues = await this.service.getExternalIssuesCreatedByUser(username);
      
      // Return simplified JSON with required fields
      const simplified = issues.map(issue => ({
        id: issue.id,
        number: issue.number,
        title: issue.title,
        url: issue.html_url,
        state: issue.state,
        date_opened: issue.created_at,
        date_closed: issue.closed_at,
        repository: issue.repository_url.replace('https://api.github.com/repos/', '')
      }));

      res.json({
        count: simplified.length,
        issues: simplified
      });
    } catch (error) {
      console.error('Error in getExternalCreatedIssues:', error);
      res.status(500).json({ error: 'Failed to fetch external issues' });
    }
  }

  /**
   * GET /api/issues/closed-by-user
   * Get issues closed by the user
   */
  async getClosedByUserIssues(req: Request, res: Response) {
    try {
      const username = req.query.username as string || process.env.GITHUB_USERNAME || 'lmcrean';
      
      const issues = await this.service.getIssuesClosedByUser(username);
      
      // Return simplified JSON with required fields
      const simplified = issues.map(issue => ({
        id: issue.id,
        number: issue.number,
        title: issue.title,
        url: issue.html_url,
        state: issue.state,
        date_opened: issue.created_at,
        date_closed: issue.closed_at,
        repository: issue.repository_url.replace('https://api.github.com/repos/', '')
      }));

      res.json({
        count: simplified.length,
        issues: simplified
      });
    } catch (error) {
      console.error('Error in getClosedByUserIssues:', error);
      res.status(500).json({ error: 'Failed to fetch closed issues' });
    }
  }

  /**
   * GET /api/issues/grouped
   * Get all issues grouped by repository
   */
  async getGroupedIssues(req: Request, res: Response) {
    try {
      const username = req.query.username as string || process.env.GITHUB_USERNAME || 'lmcrean';
      const includeExternal = req.query.external !== 'false';
      
      const response = await this.service.getGroupedIssues(username, includeExternal);
      res.json(response);
    } catch (error) {
      console.error('Error in getGroupedIssues:', error);
      res.status(500).json({ error: 'Failed to fetch grouped issues' });
    }
  }
}