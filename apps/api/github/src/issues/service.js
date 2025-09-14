"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GitHubIssuesService = void 0;
const rest_1 = require("@octokit/rest");
const excludedRepositories_1 = require("./excludedRepositories");
class GitHubIssuesService {
    constructor(token) {
        this.cache = new Map();
        this.CACHE_TTL = 5 * 60 * 1000; // 5 minutes
        this.octokit = new rest_1.Octokit({ auth: token });
    }
    /**
     * Fetch issues created by the user in external repositories
     */
    async getExternalIssuesCreatedByUser(username) {
        const cacheKey = `external-created-${username}`;
        const cached = this.getFromCache(cacheKey);
        if (cached)
            return cached;
        try {
            // Search for issues authored by user, excluding their own repos
            const response = await this.octokit.rest.search.issuesAndPullRequests({
                q: `author:${username} is:issue -user:${username}`,
                sort: 'created',
                order: 'desc',
                per_page: 100
            });
            const issues = response.data.items
                .filter(item => {
                // Extract repo name from repository URL
                const repoMatch = item.repository_url.match(/repos\/([^\/]+)\/([^\/]+)$/);
                if (repoMatch) {
                    const [, owner, name] = repoMatch;
                    const fullName = `${owner}/${name}`;
                    if ((0, excludedRepositories_1.isRepositoryExcluded)(name, fullName)) {
                        console.log(`⏭️ Filtering out issue from excluded repo: ${fullName}`);
                        return false;
                    }
                }
                return true;
            })
                .map(item => this.transformToGitHubIssue(item));
            this.setCache(cacheKey, issues);
            return issues;
        }
        catch (error) {
            console.error('Error fetching external issues:', error);
            return [];
        }
    }
    /**
     * Fetch issues closed by the user (assigned and closed)
     */
    async getIssuesClosedByUser(username) {
        const cacheKey = `closed-by-${username}`;
        const cached = this.getFromCache(cacheKey);
        if (cached)
            return cached;
        try {
            // Search for closed issues assigned to user
            const response = await this.octokit.rest.search.issuesAndPullRequests({
                q: `assignee:${username} is:issue is:closed`,
                sort: 'updated',
                order: 'desc',
                per_page: 100
            });
            const issues = response.data.items
                .filter(item => {
                // Extract repo name from repository URL
                const repoMatch = item.repository_url.match(/repos\/([^\/]+)\/([^\/]+)$/);
                if (repoMatch) {
                    const [, owner, name] = repoMatch;
                    const fullName = `${owner}/${name}`;
                    if ((0, excludedRepositories_1.isRepositoryExcluded)(name, fullName)) {
                        console.log(`⏭️ Filtering out closed issue from excluded repo: ${fullName}`);
                        return false;
                    }
                }
                return true;
            })
                .map(item => this.transformToGitHubIssue(item));
            this.setCache(cacheKey, issues);
            return issues;
        }
        catch (error) {
            console.error('Error fetching closed issues:', error);
            return [];
        }
    }
    /**
     * Get all issues and group by repository
     */
    async getGroupedIssues(username, includeExternal = true) {
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
    transformToGitHubIssue(item) {
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
            labels: item.labels?.map((label) => ({
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
    async groupIssuesByRepository(issues, username) {
        const groups = new Map();
        for (const issue of issues) {
            // Extract repository info from URL
            const repoMatch = issue.repository_url.match(/repos\/([^\/]+)\/([^\/]+)$/);
            if (!repoMatch)
                continue;
            const [, owner, name] = repoMatch;
            const repoKey = `${owner}/${name}`;
            // Skip excluded repositories
            if ((0, excludedRepositories_1.isRepositoryExcluded)(name, repoKey)) {
                console.log(`⏭️ Skipping excluded repository: ${repoKey}`);
                continue;
            }
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
                    closedCount: 0,
                    lastActivityDate: ''
                });
            }
            const group = groups.get(repoKey);
            group.issues.push(issue);
            if (issue.state === 'open') {
                group.openCount++;
            }
            else {
                group.closedCount++;
            }
        }
        // Calculate lastActivityDate for each group and sort by it
        const groupsArray = Array.from(groups.values());
        for (const group of groupsArray) {
            // Find the most recent activity date from all issues in the group
            if (group.issues.length > 0) {
                const dates = group.issues.map(issue => new Date(issue.updated_at || issue.created_at).getTime());
                const mostRecentDate = new Date(Math.max(...dates));
                group.lastActivityDate = mostRecentDate.toISOString();
            }
            else {
                group.lastActivityDate = new Date(0).toISOString();
            }
        }
        // Sort groups by most recent activity first
        return groupsArray.sort((a, b) => {
            const dateA = new Date(a.lastActivityDate).getTime();
            const dateB = new Date(b.lastActivityDate).getTime();
            return dateB - dateA; // Descending order (most recent first)
        });
    }
    async fetchRepositoryDetails(owner, repo) {
        try {
            const response = await this.octokit.rest.repos.get({ owner, repo });
            return response.data;
        }
        catch (error) {
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
    deduplicateIssues(issues) {
        const seen = new Set();
        return issues.filter(issue => {
            if (seen.has(issue.id))
                return false;
            seen.add(issue.id);
            return true;
        });
    }
    getFromCache(key) {
        const cached = this.cache.get(key);
        if (!cached)
            return null;
        if (Date.now() - cached.timestamp > this.CACHE_TTL) {
            this.cache.delete(key);
            return null;
        }
        return cached.data;
    }
    setCache(key, data) {
        this.cache.set(key, { data, timestamp: Date.now() });
    }
}
exports.GitHubIssuesService = GitHubIssuesService;
