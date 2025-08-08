import React, { useState, useEffect } from 'react';
import { 
  PullRequestFeedListCardProps,
  PullRequestListData 
} from '@shared/types/pull-requests';
import {
  getRelativeTime,
  getStatusDisplay,
  getTitleIcon,
  getLanguageColor
} from '@shared/types/pull-requests/utilities';

export const PullRequestFeedListCard: React.FC<PullRequestFeedListCardProps> = ({
  pullRequest,
  onClick
}) => {
  const status = getStatusDisplay(pullRequest.state, pullRequest.merged_at);
  const titleIcon = getTitleIcon(pullRequest.title);
  const languageColor = getLanguageColor(pullRequest.repository.language);

  // Add client-side only time calculation
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Only calculate relative time on client side
  const relativeTime = isClient ? getRelativeTime(pullRequest.created_at) : 'Loading...';

  return (
    <article 
      className="grid gap-4 p-4 cursor-pointer transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-inset"
      style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 3fr 1fr 1fr', 
        gap: '16px', 
        padding: '16px', 
        cursor: 'pointer',
        borderBottom: '1px solid var(--border-color, #e5e7eb)',
        transition: 'background-color 0.2s ease',
        fontFamily: '"IBM Plex Serif", serif'
      }}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = 'var(--bg-hover, #f9fafb)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'transparent';
      }}
      aria-label={`Pull request #${pullRequest.number}, ${status.text} ${relativeTime}`}
      data-testid="pull-request-card"
      data-pr-number={pullRequest.number}
      data-pr-title={pullRequest.title}
    >
      {/* Repository Column */}
      <div className="flex items-center space-x-2" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span className="text-sm" style={{ fontSize: '14px' }}>📦</span>
        <span className="text-gray-700 dark:text-gray-300 text-sm font-medium truncate" 
              style={{ 
                color: 'var(--text-secondary, #374151)', 
                fontSize: '14px', 
                fontWeight: '500', 
                whiteSpace: 'nowrap', 
                overflow: 'hidden', 
                textOverflow: 'ellipsis',
                fontFamily: '"IBM Plex Serif", serif'
              }}>
          {pullRequest.repository.name}
        </span>
      </div>

      {/* Title Column (now has more space) */}
      <div className="flex items-center space-x-2" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span className="text-lg flex-shrink-0" style={{ fontSize: '18px', flexShrink: 0 }}>{titleIcon}</span>
        <h3 className="font-bold text-gray-900 dark:text-white text-sm leading-tight truncate" 
            style={{ 
              fontWeight: '700', 
              color: 'var(--text-primary, #111827)', 
              fontSize: '14px', 
              lineHeight: '1.25', 
              whiteSpace: 'nowrap', 
              overflow: 'hidden', 
              textOverflow: 'ellipsis',
              fontFamily: '"IBM Plex Serif", serif'
            }}>
          {pullRequest.title}
        </h3>
      </div>

      {/* Language Column (removed emoji) */}
      <div className="flex items-center" style={{ display: 'flex', alignItems: 'center' }}>
        {pullRequest.repository.language ? (
          <span 
            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-white ${languageColor}`}
            style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              padding: '4px 8px', 
              borderRadius: '9999px', 
              fontSize: '12px', 
              fontWeight: '500', 
              color: 'white', 
              backgroundColor: '#6b7280',
              fontFamily: '"IBM Plex Serif", serif'
            }}
          >
            {pullRequest.repository.language}
          </span>
        ) : (
          <span className="text-gray-400 dark:text-gray-500 text-xs" 
                style={{ 
                  color: 'var(--text-muted, #9ca3af)', 
                  fontSize: '12px',
                  fontFamily: '"IBM Plex Serif", serif'
                }}>No language</span>
        )}
      </div>

      {/* Status Column */}
      <div className="flex items-center justify-between" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div className={`flex items-center space-x-1 ${status.color} font-medium text-xs`} 
             style={{ 
               display: 'flex', 
               alignItems: 'center', 
               gap: '4px', 
               fontWeight: '500', 
               fontSize: '12px',
               fontFamily: '"IBM Plex Serif", serif'
             }}>
          <span>{status.emoji}</span>
          <span>{status.text}</span>
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1" 
             style={{ 
               fontSize: '12px', 
               color: 'var(--text-muted, #6b7280)', 
               display: 'flex', 
               alignItems: 'center', 
               gap: '4px',
               fontFamily: '"IBM Plex Serif", serif'
             }}>
          <i className="fas fa-clock"></i>
          <span>{relativeTime}</span>
        </div>
      </div>
    </article>
  );
};

export default PullRequestFeedListCard; 