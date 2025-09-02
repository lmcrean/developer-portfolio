import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import PullRequestFeedListCard from '../../apps/web/src/components/pull-request-feed/PullRequestFeedListCard';
import PullRequestFeedDetailCard from '../../apps/web/src/components/pull-request-feed/PullRequestFeedDetailCard';

// Mock data
const mockListPR = {
  id: 1,
  number: 20,
  title: 'refactor frontend dir to apps/web',
  description: 'this will be for greater sustainability and improved organization',
  created_at: '2024-06-30T10:39:00Z',
  merged_at: '2024-06-30T16:39:00Z',
  state: 'merged' as const,
  html_url: 'https://github.com/lmcrean/developer-portfolio/pull/20',
  repository: {
    name: 'developer-portfolio',
    description: 'Portfolio website v3',
    language: 'TypeScript',
    html_url: 'https://github.com/lmcrean/developer-portfolio'
  }
};

const mockDetailedPR = {
  ...mockListPR,
  updated_at: '2024-06-30T16:35:00Z',
  closed_at: null,
  draft: false,
  commits: 12,
  additions: 245,
  deletions: 123,
  changed_files: 15,
  comments: 3,
  author: {
    login: 'lmcrean',
    avatar_url: 'https://avatars.githubusercontent.com/u/123456?v=4',
    html_url: 'https://github.com/lmcrean'
  }
};

describe('PullRequestFeedListCard Integration Tests', () => {
  const mockOnClick = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Visual Elements and Styling', () => {
    beforeEach(() => {
      render(<PullRequestFeedListCard pullRequest={mockListPR} onClick={mockOnClick} />);
    });

    it('should display all required PR information', () => {
      // Status and timing
      expect(screen.getByText('merged')).toBeInTheDocument();
      expect(screen.getByText(/ago/)).toBeInTheDocument();

      // Title with context icon
      expect(screen.getByText('refactor frontend dir to apps/web')).toBeInTheDocument();
      expect(screen.getByText('🔄')).toBeInTheDocument(); // refactor icon

      // Description
      expect(screen.getByText(/this will be for greater sustainability/)).toBeInTheDocument();

      // Repository and language
      expect(screen.getByText('developer-portfolio')).toBeInTheDocument();
      expect(screen.getByText(/🏷️\s*TypeScript/)).toBeInTheDocument();

      // PR number and action
      expect(screen.getByText('#20')).toBeInTheDocument();
      expect(screen.getByText('View PR')).toBeInTheDocument();
    });

    it('should apply correct status colors', () => {
      const statusElement = screen.getByText('merged').closest('div');
      expect(statusElement).toHaveClass('text-purple-600');
    });

    it('should apply correct language styling', () => {
      const languageElement = screen.getByText(/🏷️\s*TypeScript/);
      expect(languageElement).toHaveClass('bg-blue-600', 'text-white');
    });

    it('should have proper responsive classes', () => {
      const card = screen.getByRole('button');
      expect(card).toHaveClass(
        'w-full',
        'bg-white',
        'border',
        'border-gray-200',
        'rounded-lg',
        'p-4',
        'cursor-pointer'
      );
    });
  });

  describe('Context Icons', () => {
    it('should show correct icon for feature PR', () => {
      const featurePR = { ...mockListPR, title: 'feat: add new component' };
      render(<PullRequestFeedListCard pullRequest={featurePR} onClick={mockOnClick} />);
      expect(screen.getByText('✨')).toBeInTheDocument();
    });

    it('should show correct icon for bug fix PR', () => {
      const bugPR = { ...mockListPR, title: 'fix: resolve button styling issue' };
      render(<PullRequestFeedListCard pullRequest={bugPR} onClick={mockOnClick} />);
      expect(screen.getByText('🐛')).toBeInTheDocument();
    });

    it('should show correct icon for documentation PR', () => {
      const docPR = { ...mockListPR, title: 'docs: update README' };
      render(<PullRequestFeedListCard pullRequest={docPR} onClick={mockOnClick} />);
      // Look for the title icon specifically (first occurrence in the title section)
      const titleSection = screen.getByRole('heading').closest('div');
      expect(titleSection).toHaveTextContent('📝');
    });
  });

  describe('Different PR States', () => {
    it('should handle open PRs correctly', () => {
      const openPR = { ...mockListPR, state: 'open' as const, merged_at: null };
      render(<PullRequestFeedListCard pullRequest={openPR} onClick={mockOnClick} />);
      
      const statusElement = screen.getByText('opened').closest('div');
      expect(statusElement).toHaveClass('text-green-600');
      expect(screen.getByText('○')).toBeInTheDocument();
    });

    it('should handle closed PRs correctly', () => {
      const closedPR = { ...mockListPR, state: 'closed' as const, merged_at: null };
      render(<PullRequestFeedListCard pullRequest={closedPR} onClick={mockOnClick} />);
      
      const statusElement = screen.getByText('closed').closest('div');
      expect(statusElement).toHaveClass('text-red-600');
      expect(screen.getByText('×')).toBeInTheDocument();
    });
  });

  describe('Interaction', () => {
    it('should call onClick when card is clicked', () => {
      render(<PullRequestFeedListCard pullRequest={mockListPR} onClick={mockOnClick} />);
      
      const card = screen.getByRole('button');
      fireEvent.click(card);
      
      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

    it('should call onClick when Enter key is pressed', () => {
      render(<PullRequestFeedListCard pullRequest={mockListPR} onClick={mockOnClick} />);
      
      const card = screen.getByRole('button');
      fireEvent.keyDown(card, { key: 'Enter', code: 'Enter' });
      
      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

    it('should call onClick when Space key is pressed', () => {
      render(<PullRequestFeedListCard pullRequest={mockListPR} onClick={mockOnClick} />);
      
      const card = screen.getByRole('button');
      fireEvent.keyDown(card, { key: ' ', code: 'Space' });
      
      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

    it('should not call onClick for other keys', () => {
      render(<PullRequestFeedListCard pullRequest={mockListPR} onClick={mockOnClick} />);
      
      const card = screen.getByRole('button');
      fireEvent.keyDown(card, { key: 'Tab', code: 'Tab' });
      
      expect(mockOnClick).not.toHaveBeenCalled();
    });
  });

  describe('Text Truncation', () => {
    it('should truncate long descriptions', () => {
      const longDescPR = {
        ...mockListPR,
        description: 'This is a very long description that should be truncated when it exceeds the maximum character limit that we have set for the card view to maintain clean layout'
      };
      
      render(<PullRequestFeedListCard pullRequest={longDescPR} onClick={mockOnClick} />);
      
      const description = screen.getByText(/This is a very long description/);
      expect(description.textContent).toContain('...');
    });

    it('should handle PRs without descriptions', () => {
      const noDeskPR = { ...mockListPR, description: null };
      render(<PullRequestFeedListCard pullRequest={noDeskPR} onClick={mockOnClick} />);
      
      expect(screen.queryByText('📝')).not.toBeInTheDocument();
    });
  });
});

describe('PullRequestFeedDetailCard Integration Tests', () => {
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Modal Behavior', () => {
    it('should not render when isOpen is false', () => {
      render(
        <PullRequestFeedDetailCard 
          pullRequest={mockDetailedPR} 
          isOpen={false} 
          onClose={mockOnClose} 
        />
      );
      
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('should render when isOpen is true', () => {
      render(
        <PullRequestFeedDetailCard 
          pullRequest={mockDetailedPR} 
          isOpen={true} 
          onClose={mockOnClose} 
        />
      );
      
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('should handle loading state', () => {
      render(
        <PullRequestFeedDetailCard 
          pullRequest={mockDetailedPR} 
          isOpen={true} 
          onClose={mockOnClose} 
          loading={true}
        />
      );
      
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      // Should show skeleton loading content
      expect(document.querySelector('.animate-pulse')).toBeInTheDocument();
    });

    it('should handle error state', () => {
      render(
        <PullRequestFeedDetailCard 
          pullRequest={mockDetailedPR} 
          isOpen={true} 
          onClose={mockOnClose} 
          error="Failed to load PR details"
        />
      );
      
      expect(screen.getByText('Error Loading PR')).toBeInTheDocument();
      expect(screen.getByText('Failed to load PR details')).toBeInTheDocument();
      expect(screen.getByText('Try Again')).toBeInTheDocument();
    });
  });

  describe('Detailed Content Display', () => {
    beforeEach(() => {
      render(
        <PullRequestFeedDetailCard 
          pullRequest={mockDetailedPR} 
          isOpen={true} 
          onClose={mockOnClose} 
        />
      );
    });

    it('should display all PR details', () => {
      // Status and title
      expect(screen.getByText('merged')).toBeInTheDocument();
      expect(screen.getByText('refactor frontend dir to apps/web')).toBeInTheDocument();
      expect(screen.getByText('lmcrean')).toBeInTheDocument();

      // Sections
      expect(screen.getByText('Description')).toBeInTheDocument();
      expect(screen.getByText('Stats')).toBeInTheDocument();
      expect(screen.getByText('Timeline')).toBeInTheDocument();
      expect(screen.getByText('Actions')).toBeInTheDocument();
    });

    it('should display statistics correctly', () => {
      expect(screen.getByText('+245')).toBeInTheDocument();
      expect(screen.getByText('-123')).toBeInTheDocument();
      expect(screen.getByText('15 files changed')).toBeInTheDocument();
      expect(screen.getByText('3 comments')).toBeInTheDocument();
      expect(screen.getByText('12 commits')).toBeInTheDocument();
    });

    it('should display timeline information', () => {
      expect(screen.getByText('Created:')).toBeInTheDocument();
      expect(screen.getByText('Updated:')).toBeInTheDocument();
      expect(screen.getByText('Merged:')).toBeInTheDocument();
    });

    it('should display action buttons', () => {
      expect(screen.getByText('View on GitHub')).toBeInTheDocument();
      expect(screen.getByText('Copy Link')).toBeInTheDocument();
      expect(screen.getByText('Share')).toBeInTheDocument();
    });
  });

  describe('Modal Interaction', () => {
    beforeEach(() => {
      render(
        <PullRequestFeedDetailCard 
          pullRequest={mockDetailedPR} 
          isOpen={true} 
          onClose={mockOnClose} 
        />
      );
    });

    it('should close when back button is clicked', () => {
      const backButton = screen.getByLabelText('Go back');
      fireEvent.click(backButton);
      
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('should close when close button is clicked', () => {
      const closeButton = screen.getByLabelText('Close modal');
      fireEvent.click(closeButton);
      
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('should close when backdrop is clicked', () => {
      const backdrop = screen.getByRole('dialog');
      fireEvent.click(backdrop);
      
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('should not close when modal content is clicked', () => {
      const modalContent = screen.getByText('Description').closest('div');
      fireEvent.click(modalContent!);
      
      expect(mockOnClose).not.toHaveBeenCalled();
    });
  });

  describe('Responsive Design', () => {
    it('should have proper mobile-first classes', () => {
      render(
        <PullRequestFeedDetailCard 
          pullRequest={mockDetailedPR} 
          isOpen={true} 
          onClose={mockOnClose} 
        />
      );
      
      const backdrop = screen.getByRole('dialog');
      expect(backdrop).toHaveClass('fixed', 'inset-0', 'z-50');
      
      const container = backdrop.firstChild as HTMLElement;
      expect(container).toHaveClass('w-full', 'max-w-full', 'sm:max-w-2xl');
    });
  });

  describe('Accessibility', () => {
    beforeEach(() => {
      render(
        <PullRequestFeedDetailCard 
          pullRequest={mockDetailedPR} 
          isOpen={true} 
          onClose={mockOnClose} 
        />
      );
    });

    it('should have proper ARIA attributes', () => {
      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveAttribute('aria-modal', 'true');
      expect(dialog).toHaveAttribute('aria-labelledby', 'pr-modal-title');
    });

    it('should have properly labeled buttons', () => {
      expect(screen.getByLabelText('Go back')).toBeInTheDocument();
      expect(screen.getByLabelText('Close modal')).toBeInTheDocument();
    });

    it('should have proper heading structure', () => {
      const title = screen.getByRole('heading', { level: 1 });
      expect(title).toHaveAttribute('id', 'pr-modal-title');
    });
  });
}); 