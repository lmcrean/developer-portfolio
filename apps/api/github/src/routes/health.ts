import express from 'express';
import { createDatabase } from '../pull-requests/habit-tracker/database-factory';

/**
 * Health and system information endpoints
 */
export function setupHealthRoutes(app: express.Application): void {
  // Health check endpoint
  app.get('/health', async (req, res) => {
    const hasGitHubToken = !!process.env.GITHUB_TOKEN;
    const tokenLength = process.env.GITHUB_TOKEN?.length || 0;
    const hasNeonDbUrl = !!process.env.NEON_DATABASE_URL;
    const isProduction = process.env.NODE_ENV === 'production';
    
    // Test database connection
    let databaseStatus = 'unknown';
    let databaseType = 'unknown';
    let databaseError = null;
    
    try {
      const database = await createDatabase();
      databaseType = isProduction && hasNeonDbUrl ? 'postgresql' : 'sqlite';
      
      // Test basic database operation
      await database.getStats();
      databaseStatus = 'connected';
      
      // Clean up connection if it has a close method
      if (database.close) {
        await database.close();
      }
    } catch (error) {
      databaseStatus = 'error';
      databaseError = error instanceof Error ? error.message : 'Unknown error';
    }
    
    const overallStatus = hasGitHubToken && databaseStatus === 'connected' ? 'ok' : 'warning';
    
    res.json({ 
      status: overallStatus,
      timestamp: new Date().toISOString(),
      service: 'api-github',
      environment: process.env.NODE_ENV || 'development',
      github_token: {
        present: hasGitHubToken,
        length: tokenLength,
        valid_format: hasGitHubToken && (process.env.GITHUB_TOKEN?.startsWith('ghp_') || process.env.GITHUB_TOKEN?.startsWith('github_pat_')),
        status: hasGitHubToken ? 'configured' : 'missing'
      },
      database: {
        type: databaseType,
        status: databaseStatus,
        neon_url_present: hasNeonDbUrl,
        error: databaseError as string | null
      }
    });
  });

  // Port info endpoint
  app.get('/api/port-info', (req, res) => {
    const port = parseInt(process.env.PORT || '3000');
    const mode = process.env.NODE_ENV === 'test' ? 'e2e' : 'manual';
    
    res.json({
      port,
      mode,
      timestamp: new Date().toISOString()
    });
  });

  // Habit tracker database health check
  app.get('/health/database', async (req, res) => {
    const hasNeonDbUrl = !!process.env.NEON_DATABASE_URL;
    const isProduction = process.env.NODE_ENV === 'production';
    
    let result = {
      status: 'unknown',
      database_type: 'unknown',
      tests: {
        connection: 'unknown',
        table_exists: 'unknown',
        crud_operations: 'unknown'
      },
      environment: {
        node_env: process.env.NODE_ENV || 'development',
        neon_url_present: hasNeonDbUrl,
        expected_db_type: isProduction && hasNeonDbUrl ? 'postgresql' : 'sqlite'
      },
      error: null as string | null
    };
    
    try {
      const database = await createDatabase();
      result.database_type = isProduction && hasNeonDbUrl ? 'postgresql' : 'sqlite';
      
      // Test 1: Connection
      result.tests.connection = 'passed';
      
      // Test 2: Basic read operation (table exists)
      try {
        await database.getStats();
        result.tests.table_exists = 'passed';
      } catch (error) {
        result.tests.table_exists = 'failed';
        throw error;
      }
      
      // Test 3: CRUD operations
      try {
        const testDate = new Date().toISOString().split('T')[0];
        
        // Insert/Update
        await database.upsertEntry(testDate, 999);
        
        // Read
        const entry = await database.getEntry(testDate);
        if (entry && entry.pullRequestCount === 999) {
          result.tests.crud_operations = 'passed';
        } else {
          result.tests.crud_operations = 'failed';
          throw new Error('CRUD test failed: data mismatch');
        }
      } catch (error) {
        result.tests.crud_operations = 'failed';
        throw error;
      }
      
      result.status = 'healthy';
      
      // Clean up connection
      if (database.close) {
        await database.close();
      }
      
    } catch (error) {
      result.status = 'error';
      result.error = error instanceof Error ? error.message : 'Unknown error';
    }
    
    res.json(result);
  });

  console.log('✅ Health routes configured: /health, /api/port-info, /health/database');
} 