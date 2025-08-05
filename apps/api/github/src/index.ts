import dotenv from 'dotenv';
import express from 'express';
import { GitHubService } from './github';
import { findAvailablePort } from './utils/portUtils';
import { setupMiddleware } from './config/middleware';
import { setupHealthRoutes } from './routes/health';
import { setupGitHubRoutes } from './routes/github';
import { setupValidationRoutes } from './routes/validation';
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

// Setup error handling (must be last)
setup404Handler(app);

// Start server
const PORT = Number(process.env.PORT) || 8080;

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
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 GitHub API server running on port ${PORT}`);
  });
} 