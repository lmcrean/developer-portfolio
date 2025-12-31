"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllPrLabels = getAllPrLabels;
exports.getLabelsForPr = getLabelsForPr;
exports.getPrsWithLabel = getPrsWithLabel;
exports.createPrLabel = createPrLabel;
exports.deletePrLabel = deletePrLabel;
exports.deleteAllLabelsForPr = deleteAllLabelsForPr;
const connection_1 = require("../connection");
/**
 * Get all PR label assignments
 */
async function getAllPrLabels() {
    const sql = (0, connection_1.getDb)();
    const result = await sql `
    SELECT * FROM pr_labels
    ORDER BY created_at ASC
  `;
    return result;
}
/**
 * Get labels for a specific PR
 */
async function getLabelsForPr(prId) {
    const sql = (0, connection_1.getDb)();
    const result = await sql `
    SELECT * FROM pr_labels
    WHERE pr_id = ${prId}
    ORDER BY created_at ASC
  `;
    return result;
}
/**
 * Get PRs with a specific label
 */
async function getPrsWithLabel(labelId) {
    const sql = (0, connection_1.getDb)();
    const result = await sql `
    SELECT * FROM pr_labels
    WHERE label_id = ${labelId}
    ORDER BY created_at ASC
  `;
    return result;
}
/**
 * Create a PR label assignment (idempotent)
 */
async function createPrLabel(input) {
    const sql = (0, connection_1.getDb)();
    // Use ON CONFLICT to make it idempotent
    const result = await sql `
    INSERT INTO pr_labels (pr_id, label_id)
    VALUES (${input.pr_id}, ${input.label_id})
    ON CONFLICT (pr_id, label_id) DO UPDATE
    SET created_at = pr_labels.created_at
    RETURNING *
  `;
    return result[0];
}
/**
 * Delete a PR label assignment
 */
async function deletePrLabel(prId, labelId) {
    const sql = (0, connection_1.getDb)();
    const result = await sql `
    DELETE FROM pr_labels
    WHERE pr_id = ${prId} AND label_id = ${labelId}
  `;
    return result.length > 0 || result.rowCount > 0;
}
/**
 * Delete all labels for a PR
 */
async function deleteAllLabelsForPr(prId) {
    const sql = (0, connection_1.getDb)();
    const result = await sql `
    DELETE FROM pr_labels
    WHERE pr_id = ${prId}
  `;
    return result.rowCount || 0;
}
//# sourceMappingURL=pr-labels.js.map