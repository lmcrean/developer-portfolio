import { useState, useEffect, useCallback } from 'react';
import { labelTemplatesApi, labelAssignmentsApi } from '../api/tasks-api';

export interface TaskLabel {
  id: string;
  text: string;
  color: string; // hex color
}

export interface LabelTemplate extends TaskLabel {
  // Label templates are reusable across PRs
}

export interface PRLabel {
  prId: number;
  labelId: string; // references a label template
}

const STORAGE_KEY_TEMPLATES = 'tasks_label_templates';
const STORAGE_KEY_PR_LABELS = 'tasks_pr_labels';
const STORAGE_KEY_MIGRATION = 'tasks_labels_migrated';

// Default label templates
const DEFAULT_LABEL_TEMPLATES: LabelTemplate[] = [
  { id: 'waiting', text: 'Waiting on reviewer', color: '#FF6B35' }, // orange/red
  { id: 'conflicts', text: 'Merge conflicts', color: '#F7B801' }, // yellow
  { id: 'ready', text: 'Ready to merge', color: '#10B981' }, // green
  { id: 'fixes', text: 'Needs fixes', color: '#A855F7' }, // purple
  { id: 'inactive', text: 'Inactive', color: '#6B7280' }, // gray
];

/**
 * Hook for managing labels with API backend
 * Migrates data from localStorage to SQL on first load
 */
export const useTaskLabels = () => {
  const [labelTemplates, setLabelTemplates] = useState<LabelTemplate[]>([]);
  const [prLabels, setPRLabels] = useState<PRLabel[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Migrate localStorage data to API
  const migrateLocalStorageToAPI = useCallback(async () => {
    try {
      // Check if already migrated
      if (localStorage.getItem(STORAGE_KEY_MIGRATION)) {
        return false; // Already migrated
      }

      const storedTemplates = localStorage.getItem(STORAGE_KEY_TEMPLATES);
      const storedPRLabels = localStorage.getItem(STORAGE_KEY_PR_LABELS);

      let hasMigrated = false;

      // Migrate templates
      if (storedTemplates) {
        const localTemplates: LabelTemplate[] = JSON.parse(storedTemplates);
        for (const template of localTemplates) {
          try {
            await labelTemplatesApi.create({
              text: template.text,
              color: template.color,
              label_id: template.id,
            });
          } catch (err) {
            console.warn(`Failed to migrate template ${template.id}:`, err);
          }
        }
        hasMigrated = true;
      }

      // Migrate PR label assignments
      if (storedPRLabels) {
        const localPRLabels: PRLabel[] = JSON.parse(storedPRLabels);
        for (const assignment of localPRLabels) {
          try {
            await labelAssignmentsApi.create(assignment.prId, assignment.labelId);
          } catch (err) {
            console.warn(`Failed to migrate PR label ${assignment.prId}:`, err);
          }
        }
        hasMigrated = true;
      }

      if (hasMigrated) {
        // Mark migration as complete
        localStorage.setItem(STORAGE_KEY_MIGRATION, 'true');
        console.log('✓ Successfully migrated labels from localStorage to API');
      }

      return hasMigrated;
    } catch (error) {
      console.error('Failed to migrate localStorage data:', error);
      return false;
    }
  }, []);

  // Load from API on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        // First, try to migrate any existing localStorage data
        await migrateLocalStorageToAPI();

        // Then load from API
        const [templates, assignments] = await Promise.all([
          labelTemplatesApi.getAll(),
          labelAssignmentsApi.getAll(),
        ]);

        // Transform templates to match frontend format
        const transformedTemplates: LabelTemplate[] = templates.map(t => ({
          id: t.label_id,
          text: t.text,
          color: t.color,
        }));

        // If no templates exist in API, create defaults
        if (transformedTemplates.length === 0) {
          for (const defaultTemplate of DEFAULT_LABEL_TEMPLATES) {
            await labelTemplatesApi.create({
              text: defaultTemplate.text,
              color: defaultTemplate.color,
              label_id: defaultTemplate.id,
            });
          }
          // Reload templates after creating defaults
          const newTemplates = await labelTemplatesApi.getAll();
          setLabelTemplates(newTemplates.map(t => ({
            id: t.label_id,
            text: t.text,
            color: t.color,
          })));
        } else {
          setLabelTemplates(transformedTemplates);
        }

        setPRLabels(assignments);
      } catch (err) {
        console.error('Failed to load labels from API:', err);
        setError('Failed to load labels. Using fallback data.');

        // Fallback to localStorage if API fails
        try {
          const storedTemplates = localStorage.getItem(STORAGE_KEY_TEMPLATES);
          const storedPRLabels = localStorage.getItem(STORAGE_KEY_PR_LABELS);

          if (storedTemplates) {
            setLabelTemplates(JSON.parse(storedTemplates));
          } else {
            setLabelTemplates(DEFAULT_LABEL_TEMPLATES);
          }

          if (storedPRLabels) {
            setPRLabels(JSON.parse(storedPRLabels));
          }
        } catch (localErr) {
          console.error('Failed to load from localStorage:', localErr);
          setLabelTemplates(DEFAULT_LABEL_TEMPLATES);
        }
      } finally {
        setIsLoaded(true);
      }
    };

    loadData();
  }, [migrateLocalStorageToAPI]);

  // Add or update a label template
  const saveTemplate = useCallback(async (template: Omit<LabelTemplate, 'id'> & { id?: string }) => {
    try {
      const labelId = template.id || `label_${Date.now()}`;

      // Check if updating existing template
      const existing = labelTemplates.find(t => t.id === labelId);

      if (existing) {
        // Update existing
        await labelTemplatesApi.update(labelId, {
          text: template.text,
          color: template.color,
        });
        setLabelTemplates(labelTemplates.map(t =>
          t.id === labelId ? { id: labelId, text: template.text, color: template.color } : t
        ));
      } else {
        // Create new
        const created = await labelTemplatesApi.create({
          text: template.text,
          color: template.color,
          label_id: labelId,
        });
        setLabelTemplates([...labelTemplates, {
          id: created.label_id,
          text: created.text,
          color: created.color,
        }]);
      }

      setError(null);
      return labelId;
    } catch (err) {
      console.error('Failed to save template:', err);
      setError('Failed to save template');
      throw err;
    }
  }, [labelTemplates]);

  // Add label to a PR
  const addLabelToPR = useCallback(async (prId: number, labelId: string) => {
    try {
      const exists = prLabels.some(pl => pl.prId === prId && pl.labelId === labelId);
      if (!exists) {
        await labelAssignmentsApi.create(prId, labelId);
        setPRLabels([...prLabels, { prId, labelId }]);
      }
      setError(null);
    } catch (err) {
      console.error('Failed to add label to PR:', err);
      setError('Failed to add label');
      throw err;
    }
  }, [prLabels]);

  // Remove label from a PR
  const removeLabelFromPR = useCallback(async (prId: number, labelId: string) => {
    try {
      await labelAssignmentsApi.delete(prId, labelId);
      setPRLabels(prLabels.filter(pl => !(pl.prId === prId && pl.labelId === labelId)));
      setError(null);
    } catch (err) {
      console.error('Failed to remove label from PR:', err);
      setError('Failed to remove label');
      throw err;
    }
  }, [prLabels]);

  // Get labels for a specific PR
  const getLabelsForPR = useCallback((prId: number): TaskLabel[] => {
    const prLabelIds = prLabels
      .filter(pl => pl.prId === prId)
      .map(pl => pl.labelId);

    return labelTemplates.filter(t => prLabelIds.includes(t.id));
  }, [prLabels, labelTemplates]);

  // Delete a label template (removes from all PRs too)
  const deleteTemplate = useCallback(async (labelId: string) => {
    try {
      // API will cascade delete all PR assignments
      await labelTemplatesApi.delete(labelId);
      setLabelTemplates(labelTemplates.filter(t => t.id !== labelId));
      setPRLabels(prLabels.filter(pl => pl.labelId !== labelId));
      setError(null);
    } catch (err) {
      console.error('Failed to delete template:', err);
      setError('Failed to delete template');
      throw err;
    }
  }, [labelTemplates, prLabels]);

  return {
    labelTemplates,
    prLabels,
    isLoaded,
    error,
    saveTemplate,
    addLabelToPR,
    removeLabelFromPR,
    getLabelsForPR,
    deleteTemplate
  };
};
