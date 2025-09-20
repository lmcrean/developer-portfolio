import * as fs from 'fs';
import * as path from 'path';
import dotenv from 'dotenv';
import { GitHubIssuesService } from '../issues/service';

// Load environment variables
dotenv.config();

class IssuesStaticDataGenerator {
  private service: GitHubIssuesService;
  private staticDir: string;
  private issuesDir: string;

  constructor(token: string) {
    this.service = new GitHubIssuesService(token);
    this.staticDir = path.join(__dirname, '../../static');
    this.issuesDir = path.join(this.staticDir, 'issues');
  }

  async generate(username: string) {
    console.log('🔄 Generating static issues data...');
    
    // Create directories
    this.setupDirectories();

    // Fetch all issue data
    const [externalCreated, closedByUser, grouped] = await Promise.all([
      this.service.getExternalIssuesCreatedByUser(username),
      this.service.getIssuesClosedByUser(username),
      this.service.getGroupedIssues(username, true)
    ]);

    // Generate external-created.json
    const externalSimplified = externalCreated.map(issue => ({
      id: issue.id,
      number: issue.number,
      title: issue.title,
      url: issue.html_url,
      state: issue.state,
      date_opened: issue.created_at,
      date_closed: issue.closed_at,
      repository: issue.repository_url.replace('https://api.github.com/repos/', '')
    }));

    fs.writeFileSync(
      path.join(this.issuesDir, 'external-created.json'),
      JSON.stringify({
        count: externalSimplified.length,
        issues: externalSimplified,
        generated_at: new Date().toISOString()
      }, null, 2)
    );

    // Generate closed-by-user.json
    const closedSimplified = closedByUser.map(issue => ({
      id: issue.id,
      number: issue.number,
      title: issue.title,
      url: issue.html_url,
      state: issue.state,
      date_opened: issue.created_at,
      date_closed: issue.closed_at,
      repository: issue.repository_url.replace('https://api.github.com/repos/', '')
    }));

    fs.writeFileSync(
      path.join(this.issuesDir, 'closed-by-user.json'),
      JSON.stringify({
        count: closedSimplified.length,
        issues: closedSimplified,
        generated_at: new Date().toISOString()
      }, null, 2)
    );

    // Generate grouped.json
    fs.writeFileSync(
      path.join(this.issuesDir, 'grouped.json'),
      JSON.stringify(grouped, null, 2)
    );

    console.log(`✅ Generated static data:`);
    console.log(`   - ${externalSimplified.length} external issues created`);
    console.log(`   - ${closedSimplified.length} issues closed by user`);
    console.log(`   - ${grouped.groups.length} repositories with issues`);
    console.log(`   - ${grouped.metadata.total_issues} total issues (including manual)`);
  }

  private setupDirectories() {
    if (!fs.existsSync(this.staticDir)) {
      fs.mkdirSync(this.staticDir, { recursive: true });
    }
    if (!fs.existsSync(this.issuesDir)) {
      fs.mkdirSync(this.issuesDir, { recursive: true });
    }
  }
}

// Run if executed directly
if (require.main === module) {
  const token = process.env.GITHUB_TOKEN;
  const username = process.env.GITHUB_USERNAME || 'lmcrean';
  
  if (!token) {
    console.error('❌ GITHUB_TOKEN environment variable is required');
    process.exit(1);
  }

  const generator = new IssuesStaticDataGenerator(token);
  generator.generate(username)
    .then(() => console.log('✅ Static issues data generation complete'))
    .catch(error => {
      console.error('❌ Error generating static data:', error);
      process.exit(1);
    });
}

export default IssuesStaticDataGenerator;