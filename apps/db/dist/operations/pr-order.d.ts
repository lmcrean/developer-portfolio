import { PrOrder, UpdatePrOrderInput } from '../types';
/**
 * Get all PR order entries
 */
export declare function getAllPrOrders(): Promise<PrOrder[]>;
/**
 * Get order for a specific PR
 */
export declare function getPrOrder(prId: number): Promise<PrOrder | null>;
/**
 * Set order for a single PR (upsert)
 */
export declare function setPrOrder(prId: number, displayOrder: number): Promise<PrOrder>;
/**
 * Bulk update PR order (replaces all existing order data)
 */
export declare function bulkUpdatePrOrder(orders: UpdatePrOrderInput[]): Promise<PrOrder[]>;
/**
 * Delete order for a specific PR
 */
export declare function deletePrOrder(prId: number): Promise<boolean>;
//# sourceMappingURL=pr-order.d.ts.map