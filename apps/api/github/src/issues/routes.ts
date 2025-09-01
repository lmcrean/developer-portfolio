import express from 'express';
import { IssuesController } from './controller';

export function setupIssuesRoutes(app: express.Application, githubToken: string): void {
  const controller = new IssuesController(githubToken);

  // GET /api/issues/external-created - Get issues created by user in external repositories
  app.get('/api/issues/external-created', (req, res) => controller.getExternalCreatedIssues(req, res));
  
  // GET /api/issues/closed-by-user - Get issues closed by the user
  app.get('/api/issues/closed-by-user', (req, res) => controller.getClosedByUserIssues(req, res));
  
  // GET /api/issues/grouped - Get all issues grouped by repository
  app.get('/api/issues/grouped', (req, res) => controller.getGroupedIssues(req, res));

  console.log('✅ Issues routes configured: /api/issues/external-created, /api/issues/closed-by-user, /api/issues/grouped');
}