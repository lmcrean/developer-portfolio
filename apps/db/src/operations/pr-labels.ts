import { getDb } from '../connection';
import { PrLabel, CreatePrLabelInput } from '../types';

/**
 * Get all PR label assignments
 */
export async function getAllPrLabels(): Promise<PrLabel[]> {
  const sql = getDb();
  const result = await sql`
    SELECT * FROM pr_labels
    ORDER BY created_at ASC
  `;
  return result as PrLabel[];
}

/**
 * Get labels for a specific PR
 */
export async function getLabelsForPr(prId: number): Promise<PrLabel[]> {
  const sql = getDb();
  const result = await sql`
    SELECT * FROM pr_labels
    WHERE pr_id = ${prId}
    ORDER BY created_at ASC
  `;
  return result as PrLabel[];
}

/**
 * Get PRs with a specific label
 */
export async function getPrsWithLabel(labelId: string): Promise<PrLabel[]> {
  const sql = getDb();
  const result = await sql`
    SELECT * FROM pr_labels
    WHERE label_id = ${labelId}
    ORDER BY created_at ASC
  `;
  return result as PrLabel[];
}

/**
 * Create a PR label assignment (idempotent)
 */
export async function createPrLabel(input: CreatePrLabelInput): Promise<PrLabel> {
  const sql = getDb();

  // Use ON CONFLICT to make it idempotent
  const result = await sql`
    INSERT INTO pr_labels (pr_id, label_id)
    VALUES (${input.pr_id}, ${input.label_id})
    ON CONFLICT (pr_id, label_id) DO UPDATE
    SET created_at = pr_labels.created_at
    RETURNING *
  `;

  return result[0] as PrLabel;
}

/**
 * Delete a PR label assignment
 */
export async function deletePrLabel(prId: number, labelId: string): Promise<boolean> {
  const sql = getDb();

  const result = await sql`
    DELETE FROM pr_labels
    WHERE pr_id = ${prId} AND label_id = ${labelId}
  `;

  return (result as any).length > 0 || (result as any).rowCount > 0;
}

/**
 * Delete all labels for a PR
 */
export async function deleteAllLabelsForPr(prId: number): Promise<number> {
  const sql = getDb();

  const result = await sql`
    DELETE FROM pr_labels
    WHERE pr_id = ${prId}
  `;

  return (result as any).rowCount || 0;
}
