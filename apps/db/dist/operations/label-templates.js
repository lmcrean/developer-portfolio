"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllLabelTemplates = getAllLabelTemplates;
exports.getLabelTemplateById = getLabelTemplateById;
exports.createLabelTemplate = createLabelTemplate;
exports.updateLabelTemplate = updateLabelTemplate;
exports.deleteLabelTemplate = deleteLabelTemplate;
const connection_1 = require("../connection");
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
//# sourceMappingURL=label-templates.js.map