import React, { useState, useRef, useEffect } from 'react';
import { LabelTemplate } from '../hooks/useTaskLabels';

interface LabelDropdownProps {
  templates: LabelTemplate[];
  onSelect: (labelId: string) => void;
  onCreateNew: (text: string, color: string) => string;
  onDeleteTemplate: (labelId: string) => void;
  onClose: () => void;
}

/**
 * LabelDropdown - Shows existing labels + create new option
 */
export const LabelDropdown: React.FC<LabelDropdownProps> = ({
  templates,
  onSelect,
  onCreateNew,
  onDeleteTemplate,
  onClose
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [newLabelText, setNewLabelText] = useState('');
  const [newLabelColor, setNewLabelColor] = useState('#10B981'); // green default
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const handleCreateLabel = () => {
    if (newLabelText.trim()) {
      const newId = onCreateNew(newLabelText.trim(), newLabelColor);
      onSelect(newId);
      setNewLabelText('');
      setNewLabelColor('#10B981');
      setIsCreating(false);
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCreateLabel();
    } else if (e.key === 'Escape') {
      if (isCreating) {
        setIsCreating(false);
        setNewLabelText('');
      } else {
        onClose();
      }
    }
  };

  return (
    <div
      ref={dropdownRef}
      className="absolute z-50 mt-2 bg-gray-800 border border-gray-700 rounded-lg shadow-xl min-w-[300px] max-w-md"
      onClick={(e) => e.stopPropagation()} // Prevent card click
    >
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-700">
        <h3 className="text-sm font-semibold text-white">Select or create label</h3>
      </div>

      {/* Existing labels */}
      {templates.length > 0 && (
        <div className="max-h-60 overflow-y-auto">
          {templates.map((template) => (
            <div
              key={template.id}
              className="w-full px-4 py-2 hover:bg-gray-700 transition-colors flex items-center justify-between gap-2 group"
            >
              {/* Label info - clickable to select */}
              <button
                onClick={() => {
                  onSelect(template.id);
                  onClose();
                }}
                className="flex items-center gap-2 flex-1 text-left"
              >
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: template.color }}
                />
                <span className="text-sm text-white">{template.text}</span>
              </button>

              {/* Delete button - appears on hover */}
              {deleteConfirm === template.id ? (
                <div className="flex items-center gap-1">
                  <span className="text-xs text-gray-400">Delete?</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteTemplate(template.id);
                      setDeleteConfirm(null);
                    }}
                    className="text-red-400 hover:text-red-300 text-xs px-1"
                    title="Confirm delete"
                  >
                    ✓
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteConfirm(null);
                    }}
                    className="text-gray-400 hover:text-gray-300 text-xs px-1"
                    title="Cancel"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setDeleteConfirm(template.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-400 transition-opacity"
                  title="Delete template"
                >
                  🗑️
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Divider */}
      <div className="border-t border-gray-700" />

      {/* Create new */}
      <div className="px-4 py-3">
        {!isCreating ? (
          <button
            onClick={() => setIsCreating(true)}
            className="w-full text-left text-sm text-blue-400 hover:text-blue-300"
          >
            + Create new label
          </button>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newLabelText}
                onChange={(e) => setNewLabelText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Label name..."
                className="flex-1 bg-gray-700 text-white text-sm px-2 py-1 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                autoFocus
              />
              <input
                type="color"
                value={newLabelColor}
                onChange={(e) => setNewLabelColor(e.target.value)}
                className="w-8 h-8 rounded cursor-pointer"
                title="Choose color"
              />
              <button
                onClick={handleCreateLabel}
                disabled={!newLabelText.trim()}
                className="text-green-400 hover:text-green-300 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Save"
              >
                ✓
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LabelDropdown;
