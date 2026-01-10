import { getDb } from '../connection';
import { PrOrder, UpdatePrOrderInput } from '../types';

/**
 * Get all PR order entries
 */
export async function getAllPrOrders(): Promise<PrOrder[]> {
  const sql = getDb();
  if (!sql) {
    throw new Error('Database not available');
  }
  const result = await sql`
    SELECT * FROM pr_order
    ORDER BY display_order ASC
  `;
  return result as PrOrder[];
}

/**
 * Get order for a specific PR
 */
export async function getPrOrder(prId: number): Promise<PrOrder | null> {
  const sql = getDb();
  if (!sql) {
    throw new Error('Database not available');
  }
  const result = await sql`
    SELECT * FROM pr_order
    WHERE pr_id = ${prId}
    LIMIT 1
  `;
  return (result[0] as PrOrder) || null;
}

/**
 * Set order for a single PR (upsert)
 */
export async function setPrOrder(prId: number, displayOrder: number): Promise<PrOrder> {
  const sql = getDb();
  if (!sql) {
    throw new Error('Database not available');
  }

  const result = await sql`
    INSERT INTO pr_order (pr_id, display_order)
    VALUES (${prId}, ${displayOrder})
    ON CONFLICT (pr_id) DO UPDATE
    SET display_order = ${displayOrder}, updated_at = CURRENT_TIMESTAMP
    RETURNING *
  `;

  return result[0] as PrOrder;
}

/**
 * Bulk update PR order (replaces all existing order data)
 */
export async function bulkUpdatePrOrder(orders: UpdatePrOrderInput[]): Promise<PrOrder[]> {
  const sql = getDb();
  if (!sql) {
    throw new Error('Database not available');
  }

  console.log(`bulkUpdatePrOrder: Processing ${orders.length} orders`);

  // Delete all existing orders
  try {
    await sql`DELETE FROM pr_order`;
    console.log('bulkUpdatePrOrder: Deleted existing orders');
  } catch (deleteError) {
    console.error('bulkUpdatePrOrder: Failed to delete existing orders:', deleteError);
    throw deleteError;
  }

  if (orders.length === 0) {
    console.log('bulkUpdatePrOrder: No orders to insert');
    return [];
  }

  // Insert all new orders one by one (Neon doesn't support bulk inserts the same way)
  const results: PrOrder[] = [];
  for (let i = 0; i < orders.length; i++) {
    const order = orders[i];
    try {
      const result = await sql`
        INSERT INTO pr_order (pr_id, display_order)
        VALUES (${order.pr_id}, ${order.display_order})
        RETURNING *
      `;
      results.push(result[0] as PrOrder);
    } catch (insertError) {
      console.error(`bulkUpdatePrOrder: Failed to insert order ${i + 1}/${orders.length}:`, {
        pr_id: order.pr_id,
        display_order: order.display_order,
        error: insertError,
      });
      throw insertError;
    }
  }

  console.log(`bulkUpdatePrOrder: Successfully inserted ${results.length} orders`);
  return results;
}

/**
 * Delete order for a specific PR
 */
export async function deletePrOrder(prId: number): Promise<boolean> {
  const sql = getDb();
  if (!sql) {
    throw new Error('Database not available');
  }

  const result = await sql`
    DELETE FROM pr_order
    WHERE pr_id = ${prId}
  `;

  return (result as any).length > 0 || (result as any).rowCount > 0;
}
