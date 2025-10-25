/**
 * Label template stored in database
 */
export interface LabelTemplate {
    id: number;
    label_id: string;
    text: string;
    color: string;
    created_at: Date;
    updated_at: Date;
}
/**
 * Input for creating a new label template
 */
export interface CreateLabelTemplateInput {
    label_id?: string;
    text: string;
    color: string;
}
/**
 * Input for updating a label template
 */
export interface UpdateLabelTemplateInput {
    text: string;
    color: string;
}
/**
 * PR label assignment
 */
export interface PrLabel {
    id: number;
    pr_id: number;
    label_id: string;
    created_at: Date;
}
/**
 * Input for creating a PR label assignment
 */
export interface CreatePrLabelInput {
    pr_id: number;
    label_id: string;
}
/**
 * PR order entry
 */
export interface PrOrder {
    pr_id: number;
    display_order: number;
    updated_at: Date;
}
/**
 * Input for bulk updating PR order
 */
export interface UpdatePrOrderInput {
    pr_id: number;
    display_order: number;
}
//# sourceMappingURL=types.d.ts.map