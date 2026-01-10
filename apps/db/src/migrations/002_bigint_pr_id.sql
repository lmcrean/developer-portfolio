-- Migration: Change pr_id columns from INTEGER to BIGINT
-- Reason: GitHub PR IDs can exceed INTEGER max (2,147,483,647)
-- Example: PR ID 2,728,241,517 caused "out of range for type integer" error

-- Alter pr_labels table
ALTER TABLE pr_labels ALTER COLUMN pr_id TYPE BIGINT;

-- Alter pr_order table
ALTER TABLE pr_order ALTER COLUMN pr_id TYPE BIGINT;
