import { useState, useEffect, useCallback } from 'react';

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

// Default label templates
const DEFAULT_LABEL_TEMPLATES: LabelTemplate[] = [
  { id: 'waiting', text: 'Waiting on reviewer', color: '#FF6B35' }, // orange/red
  { id: 'conflicts', text: 'Merge conflicts', color: '#F7B801' }, // yellow
  { id: 'ready', text: 'Ready to merge', color: '#10B981' }, // green
  { id: 'fixes', text: 'Needs fixes', color: '#A855F7' }, // purple
  { id: 'inactive', text: 'Inactive', color: '#6B7280' }, // gray
];

/**
 * Hook for managing labels in localStorage
 * Labels are templates that can be reused across PRs
 */
export const useTaskLabels = () => {
  const [labelTemplates, setLabelTemplates] = useState<LabelTemplate[]>(DEFAULT_LABEL_TEMPLATES);
  const [prLabels, setPRLabels] = useState<PRLabel[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const storedTemplates = localStorage.getItem(STORAGE_KEY_TEMPLATES);
      const storedPRLabels = localStorage.getItem(STORAGE_KEY_PR_LABELS);

      if (storedTemplates) {
        setLabelTemplates(JSON.parse(storedTemplates));
      }

      if (storedPRLabels) {
        setPRLabels(JSON.parse(storedPRLabels));
      }
    } catch (error) {
      console.error('Failed to load labels from localStorage:', error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save templates to localStorage
  const saveTemplates = useCallback((templates: LabelTemplate[]) => {
    try {
      localStorage.setItem(STORAGE_KEY_TEMPLATES, JSON.stringify(templates));
      setLabelTemplates(templates);
    } catch (error) {
      console.error('Failed to save label templates:', error);
    }
  }, []);

  // Save PR labels to localStorage
  const savePRLabels = useCallback((labels: PRLabel[]) => {
    try {
      localStorage.setItem(STORAGE_KEY_PR_LABELS, JSON.stringify(labels));
      setPRLabels(labels);
    } catch (error) {
      console.error('Failed to save PR labels:', error);
    }
  }, []);

  // Add or update a label template
  const saveTemplate = useCallback((template: Omit<LabelTemplate, 'id'> & { id?: string }) => {
    const newTemplate: LabelTemplate = {
      id: template.id || `label_${Date.now()}`,
      text: template.text,
      color: template.color
    };

    const existing = labelTemplates.find(t => t.id === newTemplate.id);
    if (existing) {
      // Update existing
      saveTemplates(labelTemplates.map(t => t.id === newTemplate.id ? newTemplate : t));
    } else {
      // Add new
      saveTemplates([...labelTemplates, newTemplate]);
    }

    return newTemplate.id;
  }, [labelTemplates, saveTemplates]);

  // Add label to a PR
  const addLabelToPR = useCallback((prId: number, labelId: string) => {
    const exists = prLabels.some(pl => pl.prId === prId && pl.labelId === labelId);
    if (!exists) {
      savePRLabels([...prLabels, { prId, labelId }]);
    }
  }, [prLabels, savePRLabels]);

  // Remove label from a PR
  const removeLabelFromPR = useCallback((prId: number, labelId: string) => {
    savePRLabels(prLabels.filter(pl => !(pl.prId === prId && pl.labelId === labelId)));
  }, [prLabels, savePRLabels]);

  // Get labels for a specific PR
  const getLabelsForPR = useCallback((prId: number): TaskLabel[] => {
    const prLabelIds = prLabels
      .filter(pl => pl.prId === prId)
      .map(pl => pl.labelId);

    return labelTemplates.filter(t => prLabelIds.includes(t.id));
  }, [prLabels, labelTemplates]);

  // Delete a label template (removes from all PRs too)
  const deleteTemplate = useCallback((labelId: string) => {
    saveTemplates(labelTemplates.filter(t => t.id !== labelId));
    savePRLabels(prLabels.filter(pl => pl.labelId !== labelId));
  }, [labelTemplates, prLabels, saveTemplates, savePRLabels]);

  return {
    labelTemplates,
    prLabels,
    isLoaded,
    saveTemplate,
    addLabelToPR,
    removeLabelFromPR,
    getLabelsForPR,
    deleteTemplate
  };
};
