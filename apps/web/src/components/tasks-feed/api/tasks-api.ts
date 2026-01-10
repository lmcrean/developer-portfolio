import apiClient from '../../api/Core';

// Use the existing API client with automatic endpoint discovery
// This will work in dev (localhost:3015), branch deployments (Cloud Run), and production

export interface DatabaseStatus {
  database: 'connected' | 'disconnected' | 'error';
  available: boolean;
  message: string;
  timestamp: string;
}

export interface LabelTemplate {
  id: number;
  label_id: string;
  text: string;
  color: string;
  created_at: string;
  updated_at: string;
}

export interface CreateLabelTemplateInput {
  text: string;
  color: string;
  label_id?: string;
}

export interface UpdateLabelTemplateInput {
  text: string;
  color: string;
}

export interface PrLabelAssignment {
  prId: number;
  labelId: string;
}

export interface PrOrder {
  prId: number;
  displayOrder: number;
}

/**
 * Database Status API
 */
export const databaseStatusApi = {
  async getStatus(): Promise<DatabaseStatus> {
    const response = await apiClient.get('/api/tasks/status');
    return response.data;
  },
};

/**
 * Label Templates API
 */
export const labelTemplatesApi = {
  async getAll(): Promise<LabelTemplate[]> {
    const response = await apiClient.get('/api/tasks/labels/templates');
    return response.data;
  },

  async create(input: CreateLabelTemplateInput): Promise<LabelTemplate> {
    const response = await apiClient.post('/api/tasks/labels/templates', input);
    return response.data;
  },

  async update(labelId: string, input: UpdateLabelTemplateInput): Promise<LabelTemplate> {
    const response = await apiClient.put(`/api/tasks/labels/templates/${labelId}`, input);
    return response.data;
  },

  async delete(labelId: string): Promise<void> {
    await apiClient.delete(`/api/tasks/labels/templates/${labelId}`);
  },
};

/**
 * PR Label Assignments API
 */
export const labelAssignmentsApi = {
  async getAll(): Promise<PrLabelAssignment[]> {
    const response = await apiClient.get('/api/tasks/labels/assignments');
    return response.data;
  },

  async create(prId: number, labelId: string): Promise<PrLabelAssignment> {
    const response = await apiClient.post('/api/tasks/labels/assignments', { prId, labelId });
    return response.data;
  },

  async delete(prId: number, labelId: string): Promise<void> {
    await apiClient.delete(`/api/tasks/labels/assignments/${prId}/${labelId}`);
  },
};

/**
 * PR Order API
 */
export const prOrderApi = {
  async getAll(): Promise<PrOrder[]> {
    const response = await apiClient.get('/api/tasks/order');
    return response.data;
  },

  async bulkUpdate(orders: PrOrder[]): Promise<PrOrder[]> {
    const response = await apiClient.put('/api/tasks/order', orders);
    return response.data;
  },
};
