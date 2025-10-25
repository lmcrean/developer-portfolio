import { LabelTemplate, CreateLabelTemplateInput, UpdateLabelTemplateInput } from '../types';
/**
 * Get all label templates
 */
export declare function getAllLabelTemplates(): Promise<LabelTemplate[]>;
/**
 * Get a label template by label_id
 */
export declare function getLabelTemplateById(labelId: string): Promise<LabelTemplate | null>;
/**
 * Create a new label template
 */
export declare function createLabelTemplate(input: CreateLabelTemplateInput): Promise<LabelTemplate>;
/**
 * Update a label template
 */
export declare function updateLabelTemplate(labelId: string, input: UpdateLabelTemplateInput): Promise<LabelTemplate | null>;
/**
 * Delete a label template and all its assignments
 */
export declare function deleteLabelTemplate(labelId: string): Promise<boolean>;
//# sourceMappingURL=label-templates.d.ts.map