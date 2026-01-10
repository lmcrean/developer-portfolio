import { NeonQueryFunction } from '@neondatabase/serverless';
/**
 * Check if database is available
 */
export declare function isDatabaseAvailable(): boolean;
/**
 * Get the last database error
 */
export declare function getLastDbError(): string | null;
/**
 * Get a SQL query executor for the database
 * Uses Neon's serverless driver with connection pooling
 * Returns null if database is not configured
 */
export declare function getDb(): NeonQueryFunction<false, false> | null;
/**
 * Test database connection and return status
 */
export declare function testConnection(): Promise<{
    success: boolean;
    message: string;
    timestamp?: string;
}>;
//# sourceMappingURL=connection.d.ts.map