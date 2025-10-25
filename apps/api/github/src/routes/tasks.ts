import { Express, Request, Response } from 'express';
import {
  getAllLabelTemplates,
  getLabelTemplateById,
  createLabelTemplate,
  updateLabelTemplate,
  deleteLabelTemplate,
  getAllPrLabels,
  createPrLabel,
  deletePrLabel,
  getAllPrOrders,
  bulkUpdatePrOrder,
} from '@developer-portfolio/db';

export function setupTasksRoutes(app: Express) {
  // Label Templates Routes

  // GET /api/tasks/labels/templates - Get all label templates
  app.get('/api/tasks/labels/templates', async (req: Request, res: Response) => {
    try {
      const templates = await getAllLabelTemplates();
      res.json(templates);
    } catch (error) {
      console.error('Error fetching label templates:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // POST /api/tasks/labels/templates - Create label template
  app.post('/api/tasks/labels/templates', async (req: Request, res: Response) => {
    try {
      const { text, color, label_id } = req.body;

      if (!text || !color) {
        return res.status(400).json({ error: 'Missing required fields: text, color' });
      }

      const template = await createLabelTemplate({ text, color, label_id });
      res.status(201).json(template);
    } catch (error) {
      console.error('Error creating label template:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // GET /api/tasks/labels/templates/:labelId - Get specific template
  app.get('/api/tasks/labels/templates/:labelId', async (req: Request, res: Response) => {
    try {
      const { labelId } = req.params;
      const template = await getLabelTemplateById(labelId);

      if (!template) {
        return res.status(404).json({ error: 'Label template not found' });
      }

      res.json(template);
    } catch (error) {
      console.error('Error fetching label template:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // PUT /api/tasks/labels/templates/:labelId - Update template
  app.put('/api/tasks/labels/templates/:labelId', async (req: Request, res: Response) => {
    try {
      const { labelId } = req.params;
      const { text, color } = req.body;

      if (!text || !color) {
        return res.status(400).json({ error: 'Missing required fields: text, color' });
      }

      const template = await updateLabelTemplate(labelId, { text, color });

      if (!template) {
        return res.status(404).json({ error: 'Label template not found' });
      }

      res.json(template);
    } catch (error) {
      console.error('Error updating label template:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // DELETE /api/tasks/labels/templates/:labelId - Delete template
  app.delete('/api/tasks/labels/templates/:labelId', async (req: Request, res: Response) => {
    try {
      const { labelId } = req.params;
      const success = await deleteLabelTemplate(labelId);

      if (!success) {
        return res.status(404).json({ error: 'Label template not found' });
      }

      res.json({ success: true });
    } catch (error) {
      console.error('Error deleting label template:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // PR Label Assignments Routes

  // GET /api/tasks/labels/assignments - Get all PR label assignments
  app.get('/api/tasks/labels/assignments', async (req: Request, res: Response) => {
    try {
      const assignments = await getAllPrLabels();

      // Transform to frontend format
      const formattedAssignments = assignments.map(a => ({
        prId: a.pr_id,
        labelId: a.label_id,
      }));

      res.json(formattedAssignments);
    } catch (error) {
      console.error('Error fetching PR label assignments:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // POST /api/tasks/labels/assignments - Create PR label assignment
  app.post('/api/tasks/labels/assignments', async (req: Request, res: Response) => {
    try {
      const { prId, labelId } = req.body;

      if (!prId || !labelId) {
        return res.status(400).json({ error: 'Missing required fields: prId, labelId' });
      }

      const assignment = await createPrLabel({ pr_id: prId, label_id: labelId });

      res.status(201).json({
        prId: assignment.pr_id,
        labelId: assignment.label_id,
      });
    } catch (error) {
      console.error('Error creating PR label assignment:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // DELETE /api/tasks/labels/assignments/:prId/:labelId - Delete PR label assignment
  app.delete('/api/tasks/labels/assignments/:prId/:labelId', async (req: Request, res: Response) => {
    try {
      const { prId, labelId } = req.params;
      const prIdNum = parseInt(prId, 10);

      if (isNaN(prIdNum)) {
        return res.status(400).json({ error: 'Invalid prId - must be a number' });
      }

      const success = await deletePrLabel(prIdNum, labelId);

      if (!success) {
        return res.status(404).json({ error: 'PR label assignment not found' });
      }

      res.json({ success: true });
    } catch (error) {
      console.error('Error deleting PR label assignment:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // PR Order Routes

  // GET /api/tasks/order - Get all PR orders
  app.get('/api/tasks/order', async (req: Request, res: Response) => {
    try {
      const orders = await getAllPrOrders();

      // Transform to frontend format
      const formattedOrders = orders.map(o => ({
        prId: o.pr_id,
        displayOrder: o.display_order,
      }));

      res.json(formattedOrders);
    } catch (error) {
      console.error('Error fetching PR orders:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // PUT /api/tasks/order - Bulk update PR orders
  app.put('/api/tasks/order', async (req: Request, res: Response) => {
    try {
      const orders = req.body;

      if (!Array.isArray(orders)) {
        return res.status(400).json({ error: 'Request body must be an array of orders' });
      }

      // Validate each order
      for (const order of orders) {
        if (typeof order.prId !== 'number' || typeof order.displayOrder !== 'number') {
          return res.status(400).json({
            error: 'Each order must have prId and displayOrder as numbers',
          });
        }
      }

      // Transform to database format
      const dbOrders = orders.map(o => ({
        pr_id: o.prId,
        display_order: o.displayOrder,
      }));

      const updatedOrders = await bulkUpdatePrOrder(dbOrders);

      // Transform back to frontend format
      const formattedOrders = updatedOrders.map(o => ({
        prId: o.pr_id,
        displayOrder: o.display_order,
      }));

      res.json(formattedOrders);
    } catch (error) {
      console.error('Error updating PR orders:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  console.log('✅ Tasks API routes registered');
}
