import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import { GitHubService } from './github';
import { findAvailablePort } from './utils/portUtils';
import { setupMiddleware } from './config/middleware';
import { setupHealthRoutes } from './routes/health';
import { setupGitHubRoutes } from './routes/github';
import { setupValidationRoutes } from './routes/validation';
import { setupIssuesRoutes } from './issues/routes';
import { setupTasksRoutes } from './routes/tasks';
import { setup404Handler } from './utils/errorHandler';

// Load environment variables from .env file
dotenv.config();

const app = express();

// Initialize GitHub service
const githubService = new GitHubService(process.env.GITHUB_TOKEN || '');

// Enhanced debug logging for authentication and environment
console.log('=== 🔍 ENVIRONMENT DEBUGGING ===');
console.log('🔑 GITHUB_TOKEN present:', !!process.env.GITHUB_TOKEN);
console.log('📏 GITHUB_TOKEN length:', process.env.GITHUB_TOKEN?.length || 0);
console.log('🌍 NODE_ENV:', process.env.NODE_ENV);
console.log('🔌 PORT:', process.env.PORT);
console.log('=====================================');

// Setup middleware
setupMiddleware(app);

// Setup route modules
setupHealthRoutes(app);
setupGitHubRoutes(app, githubService);
setupValidationRoutes(app, githubService);
setupIssuesRoutes(app, process.env.GITHUB_TOKEN || '');
setupTasksRoutes(app);

// Serve static files (for pre-generated JSON data)
const staticPath = path.join(__dirname, '..', 'static');
app.use('/static', express.static(staticPath, {
  setHeaders: (res, path) => {
    // Set cache headers for static JSON files
    if (path.endsWith('.json')) {
      res.setHeader('Cache-Control', 'public, max-age=300'); // 5 minutes
      res.setHeader('Content-Type', 'application/json');
    }
  }
}));

console.log(`📁 Static files served from: ${staticPath}`);

// Setup error handling (must be last)
setup404Handler(app);

// Start server
const PORT = process.env.PORT || 3000;

// If running in test environment, use a different port
if (process.env.NODE_ENV === 'test') {
  findAvailablePort(3015, 3020).then(port => {
    app.listen(port, () => {
      console.log(`🚀 GitHub API server running on port ${port} (test mode)`);
    });
  }).catch(error => {
    console.error('❌ Could not find available port:', error);
    process.exit(1);
  });
} else {
  app.listen(PORT, () => {
    console.log(`🚀 GitHub API server running on port ${PORT}`);
  });
} 