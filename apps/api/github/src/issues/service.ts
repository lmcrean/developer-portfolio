import { Octokit } from '@octokit/rest';
import { GitHubIssue, Repository, IssueGroup, IssuesApiResponse } from '@shared/types/issues';

interface CachedData {
  data: any;
  timestamp: number;
}

export class GitHubIssuesService {
  private octokit: Octokit;
  private cache: Map<string, CachedData> = new Map();
  private CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  constructor(token: string) {
    this.octokit = new Octokit({ auth: token });
  }

  /**
   * Fetch issues created by the user in external repositories
   */
  async getExternalIssuesCreatedByUser(username: string): Promise<GitHubIssue[]> {
    const cacheKey = `external-created-${username}`;
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    try {
      // Search for issues authored by user, excluding their own repos
      const response = await this.octokit.rest.search.issuesAndPullRequests({
        q: `author:${username} is:issue -user:${username}`,
        sort: 'created',
        order: 'desc',
        per_page: 100
      });

      const issues = response.data.items.map(item => this.transformToGitHubIssue(item));
      this.setCache(cacheKey, issues);
      return issues;
    } catch (error) {
      console.error('Error fetching external issues:', error);
      return [];
    }
  }

  /**
   * Fetch issues closed by the user (assigned and closed)
   */
  async getIssuesClosedByUser(username: string): Promise<GitHubIssue[]> {
    const cacheKey = `closed-by-${username}`;
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    try {
      // Search for closed issues assigned to user
      const response = await this.octokit.rest.search.issuesAndPullRequests({
        q: `assignee:${username} is:issue is:closed`,
        sort: 'updated',
        order: 'desc',
        per_page: 100
      });

      const issues = response.data.items.map(item => this.transformToGitHubIssue(item));
      this.setCache(cacheKey, issues);
      return issues;
    } catch (error) {
      console.error('Error fetching closed issues:', error);
      return [];
    }
  }

  /**
   * Get all issues and group by repository
   */
  async getGroupedIssues(username: string, includeExternal: boolean = true): Promise<IssuesApiResponse> {
    const [externalCreated, closedByUser] = await Promise.all([
      includeExternal ? this.getExternalIssuesCreatedByUser(username) : [],
      this.getIssuesClosedByUser(username)
    ]);

    // Combine and deduplicate issues
    const allIssues = this.deduplicateIssues([...externalCreated, ...closedByUser]);
    
    // Group by repository
    const groups = await this.groupIssuesByRepository(allIssues, username);

    return {
      groups,
      metadata: {
        total_issues: allIssues.length,
        total_repositories: groups.length,
        external_repositories: groups.filter(g => g.repository.is_external).length,
        last_updated: new Date().toISOString()
      }
    };
  }

  /**
   * Transform API response to GitHubIssue type
   */
  private transformToGitHubIssue(item: any): GitHubIssue {
    return {
      id: item.id,
      number: item.number,
      title: item.title,
      html_url: item.html_url,
      state: item.state,
      created_at: item.created_at,
      closed_at: item.closed_at,
      updated_at: item.updated_at,
      repository_url: item.repository_url,
      labels: item.labels?.map((label: any) => ({
        id: label.id,
        name: label.name,
        color: label.color
      })) || [],
      user: {
        login: item.user.login,
        avatar_url: item.user.avatar_url
      }
    };
  }

  /**
   * Group issues by repository with counts
   */
  private async groupIssuesByRepository(issues: GitHubIssue[], username: string): Promise<IssueGroup[]> {
    const groups = new Map<string, IssueGroup>();
    
    for (const issue of issues) {
      // Extract repository info from URL
      const repoMatch = issue.repository_url.match(/repos\/([^\/]+)\/([^\/]+)$/);
      if (!repoMatch) continue;
      
      const [, owner, name] = repoMatch;
      const repoKey = `${owner}/${name}`;
      
      if (!groups.has(repoKey)) {
        // Fetch repository details
        const repoData = await this.fetchRepositoryDetails(owner, name);
        
        groups.set(repoKey, {
          repository: {
            id: repoData.id,
            name: repoData.name,
            full_name: repoData.full_name,
            owner: {
              login: repoData.owner.login,
              avatar_url: repoData.owner.avatar_url
            },
            html_url: repoData.html_url,
            description: repoData.description,
            is_external: repoData.owner.login.toLowerCase() !== username.toLowerCase()
          },
          issues: [],
          openCount: 0,
          closedCount: 0
        });
      }
      
      const group = groups.get(repoKey)!;
      group.issues.push(issue);
      
      if (issue.state === 'open') {
        group.openCount++;
      } else {
        group.closedCount++;
      }
    }
    
    // Sort groups by total issue count
    return Array.from(groups.values())
      .sort((a, b) => b.issues.length - a.issues.length);
  }

  private async fetchRepositoryDetails(owner: string, repo: string): Promise<any> {
    try {
      const response = await this.octokit.rest.repos.get({ owner, repo });
      return response.data;
    } catch (error) {
      console.error(`Error fetching repo ${owner}/${repo}:`, error);
      return {
        id: 0,
        name: repo,
        full_name: `${owner}/${repo}`,
        owner: { login: owner, avatar_url: `https://github.com/${owner}.png` },
        html_url: `https://github.com/${owner}/${repo}`,
        description: null
      };
    }
  }

  private deduplicateIssues(issues: GitHubIssue[]): GitHubIssue[] {
    const seen = new Set<number>();
    return issues.filter(issue => {
      if (seen.has(issue.id)) return false;
      seen.add(issue.id);
      return true;
    });
  }

  private getFromCache(key: string): any {
    const cached = this.cache.get(key);
    if (!cached) return null;
    if (Date.now() - cached.timestamp > this.CACHE_TTL) {
      this.cache.delete(key);
      return null;
    }
    return cached.data;
  }

  private setCache(key: string, data: any): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }
}