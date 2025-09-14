"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
const service_1 = require("../../../../apps/api/github/src/issues/service");
// Load environment variables
dotenv_1.default.config();
class IssuesStaticDataGenerator {
    constructor(token) {
        this.service = new service_1.GitHubIssuesService(token);
        this.staticDir = path.join(__dirname, '../../../../apps/api/github/static');
        this.issuesDir = path.join(this.staticDir, 'issues');
    }
    async generate(username) {
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
        fs.writeFileSync(path.join(this.issuesDir, 'external-created.json'), JSON.stringify({
            count: externalSimplified.length,
            issues: externalSimplified,
            generated_at: new Date().toISOString()
        }, null, 2));
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
        fs.writeFileSync(path.join(this.issuesDir, 'closed-by-user.json'), JSON.stringify({
            count: closedSimplified.length,
            issues: closedSimplified,
            generated_at: new Date().toISOString()
        }, null, 2));
        // Generate grouped.json
        fs.writeFileSync(path.join(this.issuesDir, 'grouped.json'), JSON.stringify(grouped, null, 2));
        console.log(`✅ Generated static data:`);
        console.log(`   - ${externalSimplified.length} external issues created`);
        console.log(`   - ${closedSimplified.length} issues closed by user`);
        console.log(`   - ${grouped.groups.length} repositories with issues`);
    }
    setupDirectories() {
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
exports.default = IssuesStaticDataGenerator;
