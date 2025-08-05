import { Octokit } from '@octokit/rest';
import { RefreshResult, DateRange } from './types';
import { IHabitTrackerDatabase } from './database-interface';

export class GitHubHabitSync {
  private octokit: Octokit;
  private database: IHabitTrackerDatabase;
  private username: string;

  constructor(octokit: Octokit, database: IHabitTrackerDatabase, username: string) {
    this.octokit = octokit;
    this.database = database;
    this.username = username;
  }

  async refreshPullRequestData(dateRange?: DateRange): Promise<RefreshResult> {
    console.log(`🔄 Starting habit tracker refresh for ${this.username}`);
    
    // Default to last 365 days if no range specified
    const endDate = dateRange?.end_date || new Date().toISOString().split('T')[0];
    const startDate = dateRange?.start_date || this.getDateDaysAgo(365);

    console.log(`📅 Date range: ${startDate} to ${endDate}`);

    // Fetch all pull requests in the date range
    const pullRequestsByDate = await this.fetchAllPullRequestsInRange(startDate, endDate);

    // Update database with the counts
    let daysUpdated = 0;
    let totalPRsFound = 0;

    for (const [date, count] of pullRequestsByDate.entries()) {
      await this.database.upsertEntry(date, count);
      daysUpdated++;
      totalPRsFound += count;
    }

    // Also ensure we have entries for days with 0 PRs
    const allDates = this.getAllDatesInRange(startDate, endDate);
    for (const date of allDates) {
      if (!pullRequestsByDate.has(date)) {
        await this.database.upsertEntry(date, 0);
        daysUpdated++;
      }
    }

    console.log(`✅ Refresh complete: ${daysUpdated} days updated, ${totalPRsFound} PRs found`);

    return {
      days_updated: daysUpdated,
      total_pull_requests_found: totalPRsFound,
      date_range: { start_date: startDate, end_date: endDate }
    };
  }

  private async fetchAllPullRequestsInRange(startDate: string, endDate: string): Promise<Map<string, number>> {
    const pullRequestsByDate = new Map<string, number>();
    
    // Use search API to fetch all PRs by this user
    const searchQuery = `author:${this.username} type:pr created:${startDate}..${endDate}`;
    
    let page = 1;
    let hasMore = true;
    const perPage = 100; // Max allowed by GitHub

    while (hasMore) {
      try {
        console.log(`📋 Fetching page ${page} of PRs...`);
        
        const response = await this.octokit.search.issuesAndPullRequests({
          q: searchQuery,
          per_page: perPage,
          page: page,
          sort: 'created',
          order: 'desc'
        });

        // Process each PR and count by date
        for (const item of response.data.items) {
          const createdDate = item.created_at.split('T')[0]; // Get YYYY-MM-DD
          
          const currentCount = pullRequestsByDate.get(createdDate) || 0;
          pullRequestsByDate.set(createdDate, currentCount + 1);
        }

        // Check if there are more pages
        hasMore = response.data.items.length === perPage;
        page++;

        // Add a small delay to be respectful of rate limits
        if (hasMore) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      } catch (error) {
        console.error(`❌ Error fetching PRs on page ${page}:`, error);
        hasMore = false;
      }
    }

    console.log(`📊 Found PRs across ${pullRequestsByDate.size} different days`);
    return pullRequestsByDate;
  }

  private getDateDaysAgo(days: number): string {
    const date = new Date();
    date.setDate(date.getDate() - days);
    return date.toISOString().split('T')[0];
  }

  private getAllDatesInRange(startDate: string, endDate: string): string[] {
    const dates: string[] = [];
    const currentDate = new Date(startDate);
    const end = new Date(endDate);

    while (currentDate <= end) {
      dates.push(currentDate.toISOString().split('T')[0]);
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates;
  }
}