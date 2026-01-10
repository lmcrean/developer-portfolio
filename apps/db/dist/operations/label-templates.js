"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllLabelTemplates = getAllLabelTemplates;
exports.getLabelTemplateById = getLabelTemplateById;
exports.createLabelTemplate = createLabelTemplate;
exports.updateLabelTemplate = updateLabelTemplate;
exports.deleteLabelTemplate = deleteLabelTemplate;
exports.ensureDefaultTemplates = ensureDefaultTemplates;
const connection_1 = require("../connection");
/**
 * Default label templates to seed the database
 */
const DEFAULT_TEMPLATES = [
    { label_id: 'waiting', text: 'Waiting on reviewer', color: '#FF6B35' },
    { label_id: 'conflicts', text: 'Merge conflicts', color: '#F7B801' },
    { label_id: 'ready', text: 'Ready to merge', color: '#10B981' },
    { label_id: 'fixes', text: 'Needs fixes', color: '#A855F7' },
    { label_id: 'inactive', text: 'Inactive', color: '#6B7280' },
];
/**
 * Generate a unique label ID
 */
function generateLabelId() {
    return `label_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}
/**
 * Get all label templates
 */
async function getAllLabelTemplates() {
    const sql = (0, connection_1.getDb)();
    if (!sql) {
        throw new Error('Database not available');
    }
    const result = await sql `
    SELECT * FROM label_templates
    ORDER BY created_at ASC
  `;
    return result;
}
/**
 * Get a label template by label_id
 */
async function getLabelTemplateById(labelId) {
    const sql = (0, connection_1.getDb)();
    if (!sql) {
        throw new Error('Database not available');
    }
    const result = await sql `
    SELECT * FROM label_templates
    WHERE label_id = ${labelId}
    LIMIT 1
  `;
    return result[0] || null;
}
/**
 * Create a new label template
 */
async function createLabelTemplate(input) {
    const sql = (0, connection_1.getDb)();
    if (!sql) {
        throw new Error('Database not available');
    }
    const labelId = input.label_id || generateLabelId();
    const result = await sql `
    INSERT INTO label_templates (label_id, text, color)
    VALUES (${labelId}, ${input.text}, ${input.color})
    RETURNING *
  `;
    return result[0];
}
/**
 * Update a label template
 */
async function updateLabelTemplate(labelId, input) {
    const sql = (0, connection_1.getDb)();
    if (!sql) {
        throw new Error('Database not available');
    }
    const result = await sql `
    UPDATE label_templates
    SET text = ${input.text}, color = ${input.color}, updated_at = CURRENT_TIMESTAMP
    WHERE label_id = ${labelId}
    RETURNING *
  `;
    return result[0] || null;
}
/**
 * Delete a label template and all its assignments
 */
async function deleteLabelTemplate(labelId) {
    const sql = (0, connection_1.getDb)();
    if (!sql) {
        throw new Error('Database not available');
    }
    const result = await sql `
    DELETE FROM label_templates
    WHERE label_id = ${labelId}
  `;
    return result.length > 0 || result.rowCount > 0;
}
/**
 * Ensure default label templates exist in the database
 * This is idempotent - it won't create duplicates
 */
async function ensureDefaultTemplates() {
    const sql = (0, connection_1.getDb)();
    if (!sql) {
        console.warn('Database not available, skipping default template creation');
        return { created: 0, existing: 0 };
    }
    let created = 0;
    let existing = 0;
    for (const template of DEFAULT_TEMPLATES) {
        try {
            // Check if template already exists
            const existingTemplate = await sql `
        SELECT 1 FROM label_templates WHERE label_id = ${template.label_id} LIMIT 1
      `;
            if (existingTemplate.length > 0) {
                existing++;
                continue;
            }
            // Create the template
            await sql `
        INSERT INTO label_templates (label_id, text, color)
        VALUES (${template.label_id}, ${template.text}, ${template.color})
      `;
            created++;
            console.log(`✓ Created default label template: ${template.label_id}`);
        }
        catch (error) {
            console.error(`Failed to create default template ${template.label_id}:`, error);
        }
    }
    console.log(`Default templates: ${created} created, ${existing} already existed`);
    return { created, existing };
}
//# sourceMappingURL=label-templates.js.map