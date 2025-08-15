import React from 'react';

interface FilterToggleProps {
  enterpriseMode: boolean;
  onToggle: (enabled: boolean) => void;
  className?: string;
}

export const FilterToggle: React.FC<FilterToggleProps> = ({
  enterpriseMode,
  onToggle,
  className = ''
}) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <span className="text-sm pr-text-secondary">
        {enterpriseMode ? 'Enterprise Solutions' : 'All Projects'}
      </span>
      
      <button
        onClick={() => onToggle(!enterpriseMode)}
        className={`
          relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900
          ${enterpriseMode ? 'bg-blue-600' : 'bg-gray-600'}
        `}
        role="switch"
        aria-checked={enterpriseMode}
        aria-label={`Toggle filter mode. Currently showing ${enterpriseMode ? 'enterprise solutions only' : 'all projects'}`}
      >
        <span
          className={`
            inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ease-in-out
            ${enterpriseMode ? 'translate-x-6' : 'translate-x-1'}
          `}
        />
      </button>
      
      <span className="text-xs pr-text-muted">
        {enterpriseMode ? 'External repos only' : 'Including personal repos'}
      </span>
    </div>
  );
};

export default FilterToggle;