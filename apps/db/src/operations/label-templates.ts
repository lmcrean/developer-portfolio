import { getDb } from '../connection';
import { LabelTemplate, CreateLabelTemplateInput, UpdateLabelTemplateInput } from '../types';

/**
 * Generate a unique label ID
 */
function generateLabelId(): string {
  return `label_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Get all label templates
 */
export async function getAllLabelTemplates(): Promise<LabelTemplate[]> {
  const sql = getDb();
  if (!sql) {
    throw new Error('Database not available');
  }
  const result = await sql`
    SELECT * FROM label_templates
    ORDER BY created_at ASC
  `;
  return result as LabelTemplate[];
}

/**
 * Get a label template by label_id
 */
export async function getLabelTemplateById(labelId: string): Promise<LabelTemplate | null> {
  const sql = getDb();
  if (!sql) {
    throw new Error('Database not available');
  }
  const result = await sql`
    SELECT * FROM label_templates
    WHERE label_id = ${labelId}
    LIMIT 1
  `;
  return (result[0] as LabelTemplate) || null;
}

/**
 * Create a new label template
 */
export async function createLabelTemplate(input: CreateLabelTemplateInput): Promise<LabelTemplate> {
  const sql = getDb();
  if (!sql) {
    throw new Error('Database not available');
  }
  const labelId = input.label_id || generateLabelId();

  const result = await sql`
    INSERT INTO label_templates (label_id, text, color)
    VALUES (${labelId}, ${input.text}, ${input.color})
    RETURNING *
  `;

  return result[0] as LabelTemplate;
}

/**
 * Update a label template
 */
export async function updateLabelTemplate(
  labelId: string,
  input: UpdateLabelTemplateInput
): Promise<LabelTemplate | null> {
  const sql = getDb();
  if (!sql) {
    throw new Error('Database not available');
  }

  const result = await sql`
    UPDATE label_templates
    SET text = ${input.text}, color = ${input.color}, updated_at = CURRENT_TIMESTAMP
    WHERE label_id = ${labelId}
    RETURNING *
  `;

  return (result[0] as LabelTemplate) || null;
}

/**
 * Delete a label template and all its assignments
 */
export async function deleteLabelTemplate(labelId: string): Promise<boolean> {
  const sql = getDb();
  if (!sql) {
    throw new Error('Database not available');
  }

  const result = await sql`
    DELETE FROM label_templates
    WHERE label_id = ${labelId}
  `;

  return (result as any).length > 0 || (result as any).rowCount > 0;
}
