import React, { useState, useEffect } from 'react';
import { IssuesApiResponse, IssueGroup } from '@shared/types/issues';
import IssueRepositoryGroup from './components/IssueRepositoryGroup';
import IssueFilters from './components/IssueFilters';
import LoadingState from './components/LoadingState';
import { useIssuesApi } from './hooks/useIssuesApi';

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
  
  const { data, loading, error, refetch } = useIssuesApi({
    username
  });

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

  return (
    <div className={`issue-feed ${className}`}>
      <div className="issue-feed-header mb-6">
        <IssueFilters
          repositories={filteredGroups.map(g => g.repository)}
          selectedRepos={selectedRepos}
          onRepoSelect={setSelectedRepos}
        />

        <div className="flex gap-2 mt-4">
          <button 
            onClick={() => toggleAllRepos(true)}
            className="text-sm text-blue-400 hover:text-blue-300"
          >
            Expand All
          </button>
          <span className="text-gray-500">|</span>
          <button 
            onClick={() => toggleAllRepos(false)}
            className="text-sm text-blue-400 hover:text-blue-300"
          >
            Collapse All
          </button>
        </div>
      </div>

      <div className="issue-repository-list space-y-4">
        {filteredGroups.map((group) => (
          <IssueRepositoryGroup
            key={group.repository.full_name}
            group={group}
            isExpanded={expandedRepos.has(group.repository.full_name)}
            onToggle={() => toggleRepo(group.repository.full_name)}
          />
        ))}
      </div>
    </div>
  );
};

export default IssueFeed;