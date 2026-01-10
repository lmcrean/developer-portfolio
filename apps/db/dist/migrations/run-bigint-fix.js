"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const connection_1 = require("../connection");
/**
 * Fix pr_id columns to use BIGINT instead of INTEGER
 * GitHub PR IDs can exceed INTEGER max (2,147,483,647)
 */
async function runBigintFix() {
    console.log('Starting BIGINT migration for pr_id columns...');
    try {
        const sql = (0, connection_1.getDb)();
        if (!sql) {
            console.error('✗ Database not available - NEONDB_KEY not configured');
            process.exit(1);
        }
        // Alter pr_labels table
        console.log('Altering pr_labels.pr_id to BIGINT...');
        await sql `ALTER TABLE pr_labels ALTER COLUMN pr_id TYPE BIGINT`;
        console.log('✓ pr_labels.pr_id updated');
        // Alter pr_order table
        console.log('Altering pr_order.pr_id to BIGINT...');
        await sql `ALTER TABLE pr_order ALTER COLUMN pr_id TYPE BIGINT`;
        console.log('✓ pr_order.pr_id updated');
        console.log('✓ BIGINT migration completed successfully');
        process.exit(0);
    }
    catch (error) {
        // Check if columns are already BIGINT
        if (error.message?.includes('already')) {
            console.log('✓ Columns are already BIGINT, nothing to do');
            process.exit(0);
        }
        console.error('✗ Migration failed:', error);
        process.exit(1);
    }
}
runBigintFix();
//# sourceMappingURL=run-bigint-fix.js.map