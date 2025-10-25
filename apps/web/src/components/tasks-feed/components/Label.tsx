import React, { useState } from 'react';
import { TaskLabel } from '../hooks/useTaskLabels';

interface LabelProps {
  label: TaskLabel;
  onRemove: () => void;
  onEdit: (text: string, color: string) => void;
}

/**
 * Label - Displays a single label with edit/delete functionality
 */
export const Label: React.FC<LabelProps> = ({ label, onRemove, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(label.text);
  const [editColor, setEditColor] = useState(label.color);
  const [isHovered, setIsHovered] = useState(false);

  const handleSave = () => {
    if (editText.trim()) {
      onEdit(editText.trim(), editColor);
      setIsEditing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    e.stopPropagation(); // Prevent bubbling to card's keydown handler

    if (e.key === 'Enter') {
      e.preventDefault(); // Prevent default form submission behavior
      handleSave();
    } else if (e.key === 'Escape') {
      setEditText(label.text);
      setEditColor(label.color);
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return (
      <div
        className="inline-flex items-center gap-1 bg-gray-800 rounded px-2 py-1"
        onClick={(e) => e.stopPropagation()}
      >
        <input
          type="text"
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleSave}
          onClick={(e) => e.stopPropagation()}
          className="bg-gray-700 text-white text-xs px-1 py-0.5 rounded w-32 focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="Label name"
          title="Press Enter to save, Esc to cancel"
          autoFocus
        />
        <input
          type="color"
          value={editColor}
          onChange={(e) => setEditColor(e.target.value)}
          onKeyDown={handleKeyDown}
          onClick={(e) => e.stopPropagation()}
          className="w-6 h-6 rounded cursor-pointer"
          title="Choose color (press Enter to save)"
        />
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="text-red-400 hover:text-red-300 text-xs"
          title="Delete label"
        >
          🗑️
        </button>
      </div>
    );
  }

  return (
    <div
      className="inline-flex items-center gap-1 rounded px-2 py-1 text-xs font-medium cursor-pointer transition-all"
      style={{
        backgroundColor: label.color + '33', // 20% opacity
        borderLeft: `3px solid ${label.color}`,
        color: '#fff'
      }}
      onClick={(e) => {
        e.stopPropagation();
        setIsEditing(true);
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      title="Click to edit"
    >
      <span>{label.text}</span>
      {isHovered && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="text-gray-400 hover:text-red-400 ml-1"
          title="Remove"
        >
          ✕
        </button>
      )}
    </div>
  );
};

export default Label;
