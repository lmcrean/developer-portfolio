import { PrLabel, CreatePrLabelInput } from '../types';
/**
 * Get all PR label assignments
 */
export declare function getAllPrLabels(): Promise<PrLabel[]>;
/**
 * Get labels for a specific PR
 */
export declare function getLabelsForPr(prId: number): Promise<PrLabel[]>;
/**
 * Get PRs with a specific label
 */
export declare function getPrsWithLabel(labelId: string): Promise<PrLabel[]>;
/**
 * Create a PR label assignment (idempotent)
 */
export declare function createPrLabel(input: CreatePrLabelInput): Promise<PrLabel>;
/**
 * Delete a PR label assignment
 */
export declare function deletePrLabel(prId: number, labelId: string): Promise<boolean>;
/**
 * Delete all labels for a PR
 */
export declare function deleteAllLabelsForPr(prId: number): Promise<number>;
//# sourceMappingURL=pr-labels.d.ts.map