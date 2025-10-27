import React, { useState, useEffect, useRef } from 'react';
import { IssuesApiResponse, IssueGroup } from '@shared/types/issues';
import IssueRepositoryGroup from './components/IssueRepositoryGroup';
import IssueFilters from './components/IssueFilters';
import LoadingState from './components/LoadingState';
import { useIssuesApi } from './hooks/useIssuesApi';
import { useLoadingContext } from '../../contexts/LoadingContext';

interface IssueFeedProps {
  username?: string;
  className?: string;
}

export const IssueFeed: React.FC<IssueFeedProps> = ({
  username = 'lmcrean',
  className = ''
}) => {
  const [expandedRepos, setExpandedRepos] = useState<Set<string>>(new Set());
  const [selectedRepos, setSelectedRepos] = useState<string[]>([]);
  const hasNotifiedLoadingRef = useRef(false);
  const { setIssuesLoaded } = useLoadingContext();

  const { data, loading, error, refetch } = useIssuesApi({
    username
  });

  // Initialize all repos as expanded when data is loaded
  useEffect(() => {
    if (data) {
      const allRepos = data.groups.map(g => g.repository.full_name);
      setExpandedRepos(new Set(allRepos));
    }
  }, [data]);

  // Notify loading context when issues are loaded
  useEffect(() => {
    if (!loading && !hasNotifiedLoadingRef.current) {
      hasNotifiedLoadingRef.current = true;
      setIssuesLoaded(true);
    }
  }, [loading, setIssuesLoaded]);

  const toggleRepo = (repoName: string) => {
    setExpandedRepos(prev => {
      const next = new Set(prev);
      if (next.has(repoName)) {
        next.delete(repoName);
      } else {
        next.add(repoName);
      }
      return next;
    });
  };

  const toggleAllRepos = (expand: boolean) => {
    if (expand && data) {
      setExpandedRepos(new Set(data.groups.map(g => g.repository.full_name)));
    } else {
      setExpandedRepos(new Set());
    }
  };

  if (loading) return <LoadingState />;
  if (error) return <div className="text-red-500">Error loading issues: {error}</div>;
  if (!data) return null;

  // Filter to only show external repositories
  let filteredGroups = data.groups.filter(g => g.repository.is_external);
  
  // Apply additional repository filtering if selected
  if (selectedRepos.length > 0) {
    filteredGroups = filteredGroups.filter(g => 
      selectedRepos.includes(g.repository.name)
    );
  }


  // Check if all repos are expanded or collapsed
  const allReposExpanded = filteredGroups.length > 0 &&
    filteredGroups.every(g => expandedRepos.has(g.repository.full_name));
  const allReposCollapsed = filteredGroups.length > 0 &&
    filteredGroups.every(g => !expandedRepos.has(g.repository.full_name));

  return (
    <div className={`w-full max-sm:px-1 max-sm:py-2 ${className}`} style={{ fontFamily: '"IBM Plex Serif", serif' }}>
      {/* Table Header - Consistent with Pull Request Feed */}
      <div className="grid gap-4 max-sm:gap-2 px-4 max-sm:px-1 text-sm font-semibold pr-text-secondary  light:border-gray-200">
        Agile Approach
      </div>
      <div className="px-4 pb-3 text-xs italic text-gray-400 light:text-gray-600 mt-1 border-b border-gray-700">
        <span>Github Issues</span>
      </div>

      {/* Filters and Controls - Hidden */}
      <div className="hidden px-4 max-sm:px-1 py-4">
        <IssueFilters
          repositories={filteredGroups.map(g => g.repository)}
          selectedRepos={selectedRepos}
          onRepoSelect={setSelectedRepos}
        />

        <div className="flex gap-2 mt-4">
          {!allReposExpanded && (
            <>
              <button 
                onClick={() => toggleAllRepos(true)}
                className=" text-gray-400 hover:text-blue-300 text-xs"
              >
                Expand All
              </button>
              {!allReposCollapsed && <span className="text-gray-500">|</span>}
            </>
          )}
          {!allReposCollapsed && (
            <button 
              onClick={() => toggleAllRepos(false)}
              className="text-xs text-gray-400 hover:text-blue-300"
            >
              Collapse All
            </button>
          )}
        </div>
      </div>

      {/* Issue Repository List - Consistent container */}
      <div className="divide-y divide-gray-700 light:divide-gray-200" style={{ borderTop: 'none' }}>
        {filteredGroups.length === 0 ? (
          <div className="px-4 py-12 text-center">
            <span className="text-sm text-gray-400 light:text-gray-200 font-medium">
              No issues available
            </span>
          </div>
        ) : (
          filteredGroups.map((group) => (
            <IssueRepositoryGroup
              key={group.repository.full_name}
              group={group}
              isExpanded={expandedRepos.has(group.repository.full_name)}
              onToggle={() => toggleRepo(group.repository.full_name)}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default IssueFeed;