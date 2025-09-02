// Shared utility functions for pull request data formatting
// Used by both detail and list card components

export const getRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'just now';
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes} min${diffInMinutes !== 1 ? 's' : ''} ago`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
  
  const diffInWeeks = Math.floor(diffInDays / 7);
  return `${diffInWeeks} week${diffInWeeks !== 1 ? 's' : ''} ago`;
};

export const formatAbsoluteDate = (dateString: string | null | undefined): string => {
  if (!dateString) return 'Unknown date';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'Invalid date';
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
};

export const getStatusDisplay = (state: string | null | undefined, mergedAt: string | null, draft?: boolean) => {
  // Dark-first design: dark mode colors are primary, light mode is the exception
  if (draft) return { emoji: '•', text: 'draft', color: 'text-gray-400 light:text-gray-600' };
  if (mergedAt) return { emoji: '•', text: 'merged' };
  if (state === 'open') return { emoji: '○', text: 'opened'};
  return { emoji: '×', text: 'closed', color: 'text-pink-400 light:text-pink-600' };
};

export const getTitleIcon = (title: string | null | undefined): string => {
  if (!title) return '📝';
  const lowerTitle = title.toLowerCase();
  if (lowerTitle.includes('refactor')) return '🔄';
  if (lowerTitle.includes('feat') || lowerTitle.includes('feature')) return '✨';
  if (lowerTitle.includes('fix') || lowerTitle.includes('bug')) return '🐛';
  if (lowerTitle.includes('doc')) return '📝';
  if (lowerTitle.includes('test')) return '🧪';
  if (lowerTitle.includes('style')) return '💄';
  return '📝';
};

export const getLanguageColor = (language: string | null): string => {
  if (!language) return 'bg-gray-500';
  
  const colors: Record<string, string> = {
    'TypeScript': 'bg-blue-600',
    'JavaScript': 'bg-yellow-400',
    'Python': 'bg-blue-500',
    'Java': 'bg-orange-600',
    'CSS': 'bg-purple-600',
    'HTML': 'bg-red-500',
    'React': 'bg-cyan-400',
    'Vue': 'bg-green-500',
  };
  
  return colors[language] || 'bg-gray-500';
};

export const truncateText = (text: string | null, maxLength: number): string => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const formatBytesChange = (additions?: number, deletions?: number): { 
  formatted: string; 
  hasData: boolean;
} => {
  if (additions === undefined && deletions === undefined) {
    return { formatted: '—', hasData: false };
  }
  
  // Format large numbers (1000+ becomes 1k+, etc.)
  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
    return num.toString();
  };
  
  const addStr = additions !== undefined ? `+${formatNumber(additions)}` : '+0';
  const delStr = deletions !== undefined ? `-${formatNumber(deletions)}` : '-0';
  
  return { 
    formatted: `${addStr} ${delStr}`,
    hasData: true
  };
};

// copyToClipboard moved to detail-utilities.ts to avoid duplication

export const parseOwnerAndRepo = (htmlUrl: string): { owner: string; repo: string } => {
  const urlParts = htmlUrl.split('/');
  return {
    owner: urlParts[3],
    repo: urlParts[4]
  };
}; 