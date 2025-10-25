import React, { useState } from 'react';
import { PullRequestListData } from '@shared/types/pull-requests';
import PullRequestFeedListCard from '../../pull-request-feed/list-card';
import { useTaskLabels } from '../hooks/useTaskLabels';
import Label from './Label';
import LabelDropdown from './LabelDropdown';

interface TaskCardProps {
  pullRequest: PullRequestListData;
  onClick: () => void;
}

/**
 * TaskCard - Wraps PullRequestFeedListCard with labels and drag handle
 * Keeps all existing styling, adds label section at bottom
 */
export const TaskCard: React.FC<TaskCardProps> = ({
  pullRequest,
  onClick
}) => {
  const {
    labelTemplates,
    saveTemplate,
    addLabelToPR,
    removeLabelFromPR,
    getLabelsForPR
  } = useTaskLabels();

  const [showDropdown, setShowDropdown] = useState(false);
  const prLabels = getLabelsForPR(pullRequest.id);

  const handleAddLabel = (labelId: string) => {
    addLabelToPR(pullRequest.id, labelId);
  };

  const handleRemoveLabel = (labelId: string) => {
    removeLabelFromPR(pullRequest.id, labelId);
  };

  const handleEditLabel = (labelId: string, text: string, color: string) => {
    saveTemplate({ id: labelId, text, color });
  };

  const handleCreateLabel = (text: string, color: string): string => {
    return saveTemplate({ text, color });
  };

  return (
    <div className="task-card relative">
      {/* Reuse existing PR card - DRY! */}
      <PullRequestFeedListCard
        pullRequest={pullRequest}
        onClick={onClick}
        hoverBgColor="orange" // Use orange for open/pending PRs
      />

      {/* Labels section */}
      <div className="px-4 pb-3 pt-1">
        <div className="flex items-center gap-2 flex-wrap text-sm">
          {/* Display existing labels */}
          {prLabels.map((label) => (
            <Label
              key={label.id}
              label={label}
              onRemove={() => handleRemoveLabel(label.id)}
              onEdit={(text, color) => handleEditLabel(label.id, text, color)}
            />
          ))}

          {/* Add label button */}
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowDropdown(!showDropdown);
              }}
              className="text-gray-400 hover:text-gray-300 text-xs px-2 py-1 hover:bg-gray-800 rounded transition-colors"
            >
              + Add label
            </button>

            {/* Dropdown */}
            {showDropdown && (
              <LabelDropdown
                templates={labelTemplates}
                onSelect={handleAddLabel}
                onCreateNew={handleCreateLabel}
                onClose={() => setShowDropdown(false)}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
