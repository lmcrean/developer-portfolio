import { neon, neonConfig, NeonQueryFunction } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env file
dotenv.config({ path: resolve(__dirname, '../.env') });

// Enable connection pooling
neonConfig.fetchConnectionCache = true;

// Extract the connection string from NEONDB_KEY
const connectionString = process.env.NEONDB_KEY?.match(/postgresql:\/\/[^\s'"]+/)?.[0];

// Track database availability
let dbAvailable = !!connectionString;
let lastError: string | null = null;

if (!connectionString) {
  console.warn('⚠️ NEONDB_KEY environment variable not found or invalid. Database features will be disabled.');
}

/**
 * Check if database is available
 */
export function isDatabaseAvailable(): boolean {
  return dbAvailable;
}

/**
 * Get the last database error
 */
export function getLastDbError(): string | null {
  return lastError;
}

/**
 * Get a SQL query executor for the database
 * Uses Neon's serverless driver with connection pooling
 * Returns null if database is not configured
 */
export function getDb(): NeonQueryFunction<false, false> | null {
  if (!connectionString) {
    return null;
  }
  return neon(connectionString);
}

/**
 * Test database connection and return status
 */
export async function testConnection(): Promise<{ success: boolean; message: string; timestamp?: string }> {
  if (!connectionString) {
    return { success: false, message: 'NEONDB_KEY not configured' };
  }

  try {
    const sql = getDb();
    if (!sql) {
      return { success: false, message: 'Database not available' };
    }
    const result = await sql`SELECT NOW() as current_time`;
    const timestamp = result[0].current_time;
    console.log('Database connected successfully at:', timestamp);
    dbAvailable = true;
    lastError = null;
    return { success: true, message: 'Connected', timestamp };
  } catch (error) {
    console.error('Database connection failed:', error);
    dbAvailable = false;
    lastError = error instanceof Error ? error.message : 'Unknown error';
    return { success: false, message: lastError };
  }
}
