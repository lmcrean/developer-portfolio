"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllPrOrders = getAllPrOrders;
exports.getPrOrder = getPrOrder;
exports.setPrOrder = setPrOrder;
exports.bulkUpdatePrOrder = bulkUpdatePrOrder;
exports.deletePrOrder = deletePrOrder;
const connection_1 = require("../connection");
/**
 * Get all PR order entries
 */
async function getAllPrOrders() {
    const sql = (0, connection_1.getDb)();
    const result = await sql `
    SELECT * FROM pr_order
    ORDER BY display_order ASC
  `;
    return result;
}
/**
 * Get order for a specific PR
 */
async function getPrOrder(prId) {
    const sql = (0, connection_1.getDb)();
    const result = await sql `
    SELECT * FROM pr_order
    WHERE pr_id = ${prId}
    LIMIT 1
  `;
    return result[0] || null;
}
/**
 * Set order for a single PR (upsert)
 */
async function setPrOrder(prId, displayOrder) {
    const sql = (0, connection_1.getDb)();
    const result = await sql `
    INSERT INTO pr_order (pr_id, display_order)
    VALUES (${prId}, ${displayOrder})
    ON CONFLICT (pr_id) DO UPDATE
    SET display_order = ${displayOrder}, updated_at = CURRENT_TIMESTAMP
    RETURNING *
  `;
    return result[0];
}
/**
 * Bulk update PR order (replaces all existing order data)
 */
async function bulkUpdatePrOrder(orders) {
    const sql = (0, connection_1.getDb)();
    // Delete all existing orders
    await sql `DELETE FROM pr_order`;
    if (orders.length === 0) {
        return [];
    }
    // Insert all new orders one by one (Neon doesn't support bulk inserts the same way)
    const results = [];
    for (const order of orders) {
        const result = await sql `
      INSERT INTO pr_order (pr_id, display_order)
      VALUES (${order.pr_id}, ${order.display_order})
      RETURNING *
    `;
        results.push(result[0]);
    }
    return results;
}
/**
 * Delete order for a specific PR
 */
async function deletePrOrder(prId) {
    const sql = (0, connection_1.getDb)();
    const result = await sql `
    DELETE FROM pr_order
    WHERE pr_id = ${prId}
  `;
    return result.length > 0 || result.rowCount > 0;
}
//# sourceMappingURL=pr-order.js.map