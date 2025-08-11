/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import PullRequestFeedListCard from '../pull-request-feed/list-card/index';

// Type declaration for Jest globals
declare global {
  var jest: any;
  var describe: any;
  var it: any;
  var test: any;
  var beforeEach: any;
  var afterEach: any;
  var expect: any;
}

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
    html_url: 'https://github.com/lmcrean/test-repo'
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

    it('displays external link icon', () => {
      render(<PullRequestFeedListCard pullRequest={mockPullRequest} onClick={mockOnClick} />);
      expect(screen.getByText('🔗')).toBeInTheDocument();
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

    it('has external link icon with proper aria-hidden', () => {
      render(<PullRequestFeedListCard pullRequest={mockPullRequest} onClick={mockOnClick} />);
      const linkIcon = screen.getByText('🔗');
      expect(linkIcon).toHaveAttribute('aria-hidden', 'true');
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
});