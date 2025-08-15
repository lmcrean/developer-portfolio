/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import PullRequestFeedListCard from '../pull-request-feed/list-card/index';


// Mock data
const mockPullRequest = {
  id: 123,
  number: 456,
  title: 'feat: Add new feature to improve user experience',
  description: 'This is a detailed description of the pull request',
  created_at: '2024-01-15T10:30:00Z',
  merged_at: '2024-01-16T14:45:00Z',
  state: 'merged' as const,
  html_url: 'https://github.com/lmcrean/test-repo/pull/456',
  repository: {
    name: 'test-repo',
    description: 'A test repository for testing purposes',
    language: 'TypeScript',
    html_url: 'https://github.com/lmcrean/test-repo',
    owner: {
      login: 'lmcrean',
      avatar_url: 'https://avatars.githubusercontent.com/u/123456?v=4'
    }
  }
};

describe('PullRequestFeedListCard', () => {
  const mockOnClick = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    // Mock Date for consistent time calculations
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2024-01-16T15:00:00Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('Basic Rendering', () => {
    it('renders without crashing', () => {
      render(<PullRequestFeedListCard pullRequest={mockPullRequest} onClick={mockOnClick} />);
    });

    it('displays pull request title', () => {
      render(<PullRequestFeedListCard pullRequest={mockPullRequest} onClick={mockOnClick} />);
      expect(screen.getByText(mockPullRequest.title)).toBeInTheDocument();
    });

    it('displays repository name', () => {
      render(<PullRequestFeedListCard pullRequest={mockPullRequest} onClick={mockOnClick} />);
      expect(screen.getByText('test-repo')).toBeInTheDocument();
    });

    it('displays programming language', () => {
      render(<PullRequestFeedListCard pullRequest={mockPullRequest} onClick={mockOnClick} />);
      expect(screen.getByText('TypeScript')).toBeInTheDocument();
    });


    it('displays status', () => {
      render(<PullRequestFeedListCard pullRequest={mockPullRequest} onClick={mockOnClick} />);
      expect(screen.getByText('merged')).toBeInTheDocument();
    });
  });

  describe('Interactions', () => {
    it('calls onClick when card is clicked', () => {
      render(<PullRequestFeedListCard pullRequest={mockPullRequest} onClick={mockOnClick} />);
      const card = screen.getByRole('button');
      fireEvent.click(card);
      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

    it('calls onClick when Enter key is pressed', () => {
      render(<PullRequestFeedListCard pullRequest={mockPullRequest} onClick={mockOnClick} />);
      const card = screen.getByRole('button');
      fireEvent.keyDown(card, { key: 'Enter' });
      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

    it('calls onClick when Space key is pressed', () => {
      render(<PullRequestFeedListCard pullRequest={mockPullRequest} onClick={mockOnClick} />);
      const card = screen.getByRole('button');
      fireEvent.keyDown(card, { key: ' ' });
      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

    it('does not call onClick for other keys', () => {
      render(<PullRequestFeedListCard pullRequest={mockPullRequest} onClick={mockOnClick} />);
      const card = screen.getByRole('button');
      fireEvent.keyDown(card, { key: 'Tab' });
      expect(mockOnClick).not.toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('has correct ARIA label indicating external link', () => {
      render(<PullRequestFeedListCard pullRequest={mockPullRequest} onClick={mockOnClick} />);
      const card = screen.getByRole('button');
      const ariaLabel = card.getAttribute('aria-label');
      expect(ariaLabel).toContain('Pull request #456');
      expect(ariaLabel).toContain('merged');
      expect(ariaLabel).toContain('Opens in new tab');
    });

    it('has correct tabIndex', () => {
      render(<PullRequestFeedListCard pullRequest={mockPullRequest} onClick={mockOnClick} />);
      const card = screen.getByRole('button');
      expect(card).toHaveAttribute('tabIndex', '0');
    });

    it('has button role', () => {
      render(<PullRequestFeedListCard pullRequest={mockPullRequest} onClick={mockOnClick} />);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

  });

  describe('Data Attributes', () => {
    it('has correct data attributes', () => {
      render(<PullRequestFeedListCard pullRequest={mockPullRequest} onClick={mockOnClick} />);
      const card = screen.getByRole('button');
      expect(card).toHaveAttribute('data-testid', 'pull-request-card');
      expect(card).toHaveAttribute('data-pr-number', '456');
      expect(card).toHaveAttribute('data-pr-title', mockPullRequest.title);
    });
  });

  describe('Language Display', () => {
    it('handles missing language gracefully', () => {
      const noLangPR = {
        ...mockPullRequest,
        repository: {
          ...mockPullRequest.repository,
          language: null
        }
      };
      render(<PullRequestFeedListCard pullRequest={noLangPR} onClick={mockOnClick} />);
      expect(screen.getByText('—')).toBeInTheDocument();
    });
  });

  describe('Organization Avatar', () => {
    it('renders organization avatar with correct src and alt attributes', () => {
      render(<PullRequestFeedListCard pullRequest={mockPullRequest} onClick={mockOnClick} />);
      const avatar = screen.getByRole('img');
      expect(avatar).toBeInTheDocument();
      expect(avatar).toHaveAttribute('src', 'https://avatars.githubusercontent.com/u/123456?v=4');
      expect(avatar).toHaveAttribute('alt', 'lmcrean avatar');
    });

    it('applies correct CSS classes to avatar', () => {
      render(<PullRequestFeedListCard pullRequest={mockPullRequest} onClick={mockOnClick} />);
      const avatar = screen.getByRole('img');
      expect(avatar).toHaveClass('w-5', 'h-5', 'rounded-full', 'flex-shrink-0');
    });

    it('handles avatar error by hiding the image', () => {
      render(<PullRequestFeedListCard pullRequest={mockPullRequest} onClick={mockOnClick} />);
      const avatar = screen.getByRole('img');
      
      // Simulate image load error
      fireEvent.error(avatar);
      
      // Check that display style is set to 'none'
      expect(avatar.style.display).toBe('none');
    });

    it('displays avatar for different organizations', () => {
      const orgPR = {
        ...mockPullRequest,
        repository: {
          ...mockPullRequest.repository,
          owner: {
            login: 'facebook',
            avatar_url: 'https://avatars.githubusercontent.com/u/69631?v=4'
          }
        }
      };
      render(<PullRequestFeedListCard pullRequest={orgPR} onClick={mockOnClick} />);
      const avatar = screen.getByRole('img');
      expect(avatar).toHaveAttribute('src', 'https://avatars.githubusercontent.com/u/69631?v=4');
      expect(avatar).toHaveAttribute('alt', 'facebook avatar');
    });

    it('displays avatar alongside repository name in same container', () => {
      render(<PullRequestFeedListCard pullRequest={mockPullRequest} onClick={mockOnClick} />);
      const repositoryColumn = screen.getByText('test-repo').closest('div');
      const avatar = screen.getByRole('img');
      
      // Avatar should be in the same container as repository name
      expect(repositoryColumn).toContainElement(avatar);
      expect(repositoryColumn).toHaveClass('flex', 'items-center', 'gap-2');
    });

    it('maintains repository name visibility with avatar present', () => {
      render(<PullRequestFeedListCard pullRequest={mockPullRequest} onClick={mockOnClick} />);
      
      // Both avatar and repository name should be visible
      expect(screen.getByRole('img')).toBeInTheDocument();
      expect(screen.getByText('test-repo')).toBeInTheDocument();
    });

    it('handles organization with empty avatar_url gracefully', () => {
      const emptyAvatarPR = {
        ...mockPullRequest,
        repository: {
          ...mockPullRequest.repository,
          owner: {
            login: 'test-org',
            avatar_url: ''
          }
        }
      };
      render(<PullRequestFeedListCard pullRequest={emptyAvatarPR} onClick={mockOnClick} />);
      const avatar = screen.getByRole('img');
      expect(avatar).toHaveAttribute('src', '');
      expect(avatar).toHaveAttribute('alt', 'test-org avatar');
    });

    it('works with special characters in organization login', () => {
      const specialCharPR = {
        ...mockPullRequest,
        repository: {
          ...mockPullRequest.repository,
          owner: {
            login: 'org-with-dashes',
            avatar_url: 'https://avatars.githubusercontent.com/u/999999?v=4'
          }
        }
      };
      render(<PullRequestFeedListCard pullRequest={specialCharPR} onClick={mockOnClick} />);
      const avatar = screen.getByRole('img');
      expect(avatar).toHaveAttribute('alt', 'org-with-dashes avatar');
    });
  });
});