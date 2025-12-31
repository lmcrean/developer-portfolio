/**
 * Get a SQL query executor for the database
 * Uses Neon's serverless driver with connection pooling
 */
export declare function getDb(): import("@neondatabase/serverless").NeonQueryFunction<false, false>;
/**
 * Test database connection
 */
export declare function testConnection(): Promise<boolean>;
//# sourceMappingURL=connection.d.ts.map