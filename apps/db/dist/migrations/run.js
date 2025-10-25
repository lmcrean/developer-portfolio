"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const connection_1 = require("../connection");
const fs_1 = require("fs");
const path_1 = require("path");
/**
 * Run database migrations
 */
async function runMigrations() {
    console.log('Starting database migrations...');
    try {
        const sql = (0, connection_1.getDb)();
        // Read and execute the schema SQL file from source directory
        // (SQL files are not copied to dist during build)
        const schemaPath = (0, path_1.resolve)(__dirname, '../../src/schema/001_create_tables.sql');
        const schemaSql = (0, fs_1.readFileSync)(schemaPath, 'utf-8');
        // Split SQL statements properly, handling function bodies with $$ or $BODY$ delimiters
        // Neon doesn't support multiple commands in a single statement
        const statements = [];
        let currentStatement = '';
        let inFunctionBody = false;
        let delimiter = '';
        const lines = schemaSql.split('\n');
        for (const line of lines) {
            const trimmedLine = line.trim();
            // Skip comments
            if (trimmedLine.startsWith('--')) {
                continue;
            }
            // Check for function body delimiter start
            if (!inFunctionBody && (trimmedLine.includes('$$') || trimmedLine.includes('$BODY$'))) {
                delimiter = trimmedLine.includes('$$') ? '$$' : '$BODY$';
                inFunctionBody = true;
                currentStatement += line + '\n';
                continue;
            }
            // Check for function body delimiter end
            if (inFunctionBody && (trimmedLine.includes(delimiter))) {
                inFunctionBody = false;
                currentStatement += line + '\n';
                // Check if this line also ends with semicolon
                if (trimmedLine.endsWith(';')) {
                    statements.push(currentStatement.trim());
                    currentStatement = '';
                }
                continue;
            }
            // Regular line processing
            currentStatement += line + '\n';
            // If not in function body and line ends with semicolon, this statement is complete
            if (!inFunctionBody && trimmedLine.endsWith(';')) {
                statements.push(currentStatement.trim());
                currentStatement = '';
            }
        }
        // Add any remaining statement
        if (currentStatement.trim()) {
            statements.push(currentStatement.trim());
        }
        // Filter empty statements
        const filteredStatements = statements.filter(stmt => stmt.length > 0);
        console.log(`Executing ${filteredStatements.length} SQL statements...`);
        for (let i = 0; i < filteredStatements.length; i++) {
            const statement = filteredStatements[i];
            console.log(`[${i + 1}/${filteredStatements.length}] Executing...`);
            try {
                await sql([statement]);
            }
            catch (error) {
                // Ignore certain expected errors:
                // 42P07 - duplicate table
                // 42710 - duplicate object
                // 42P01 - undefined table (for DROP IF EXISTS)
                const ignoredCodes = ['42P07', '42710', '42P01'];
                if (!ignoredCodes.includes(error.code)) {
                    throw error;
                }
                console.log(`  (already exists or doesn't exist, skipped)`);
            }
        }
        console.log('✓ Database migrations completed successfully');
        process.exit(0);
    }
    catch (error) {
        console.error('✗ Database migration failed:', error);
        process.exit(1);
    }
}
runMigrations();
//# sourceMappingURL=run.js.map