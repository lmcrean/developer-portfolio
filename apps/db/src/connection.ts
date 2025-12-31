import { neon, neonConfig } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env file
dotenv.config({ path: resolve(__dirname, '../.env') });

// Enable connection pooling
neonConfig.fetchConnectionCache = true;

// Extract the connection string from NEONDB_KEY
const connectionString = process.env.NEONDB_KEY?.match(/postgresql:\/\/[^\s'"]+/)?.[0];

if (!connectionString) {
  throw new Error('NEONDB_KEY environment variable not found or invalid');
}

/**
 * Get a SQL query executor for the database
 * Uses Neon's serverless driver with connection pooling
 */
export function getDb() {
  return neon(connectionString!);
}

/**
 * Test database connection
 */
export async function testConnection(): Promise<boolean> {
  try {
    const sql = getDb();
    const result = await sql`SELECT NOW() as current_time`;
    console.log('Database connected successfully at:', result[0].current_time);
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
}
