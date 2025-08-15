import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { PullRequestFeed } from '../../apps/web/src/components/pull-request-feed/PullRequestFeed';

// Mock the entire Core API module since that's what the component imports
vi.mock('../../apps/web/src/components/api/Core', () => ({
  default: {
    get: vi.fn(),
  },
}));

// Import the mocked module to access the mock
import apiClient from '../../apps/web/src/components/api/Core';
const mockGet = vi.mocked(apiClient.get);

// Mock data
const mockPullRequests = [
  {
    id: 1,
    number: 20,
    title: 'refactor frontend dir to apps/web',
    description: 'this will be for greater sustainability',
    created_at: '2024-06-30T10:39:00Z',
    merged_at: '2024-06-30T16:39:00Z',
    state: 'merged' as const,
    html_url: 'https://github.com/lmcrean/developer-portfolio/pull/20',
    repository: {
      name: 'developer-portfolio',
      description: 'Portfolio website v3',
      language: 'TypeScript',
      html_url: 'https://github.com/lmcrean/developer-portfolio',
      owner: {
        login: 'lmcrean',
        avatar_url: 'https://avatars.githubusercontent.com/u/123456?v=4'
      }
    }
  },
  {
    id: 2,
    number: 19,
    title: 'feat: add new button component',
    description: 'Added reusable button component with variants',
    created_at: '2024-06-29T14:20:00Z',
    merged_at: null,
    state: 'open' as const,
    html_url: 'https://github.com/lmcrean/developer-portfolio/pull/19',
    repository: {
      name: 'developer-portfolio',
      description: 'Portfolio website v3',
      language: 'JavaScript',
      html_url: 'https://github.com/lmcrean/developer-portfolio',
      owner: {
        login: 'lmcrean',
        avatar_url: 'https://avatars.githubusercontent.com/u/123456?v=4'
      }
    }
  }
];

const mockDetailedPR = {
  ...mockPullRequests[0],
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

const mockApiResponse = {
  data: mockPullRequests,
  meta: {
    username: 'lmcrean',
    count: 2,
    pagination: {
      page: 1,
      per_page: 20,
      total_count: 2,
      total_pages: 1,
      has_next_page: false,
      has_previous_page: false
    }
  }
};

describe('PullRequestFeed Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset document body overflow
    document.body.style.overflow = 'unset';
  });

  afterEach(() => {
    // Clean up any lingering modals
    document.body.style.overflow = 'unset';
  });

  describe('API Integration', () => {
    it('should fetch and display pull requests from API', async () => {
      // Mock successful API response
      mockGet.mockResolvedValueOnce({ data: mockApiResponse });

      render(<PullRequestFeed username="lmcrean" />);

      // Should show loading state initially
      expect(screen.getByText('Loading pull requests for lmcrean...')).toBeInTheDocument();

      // Wait for API call and data to load
      await waitFor(() => {
        expect(screen.getByText('refactor frontend dir to apps/web')).toBeInTheDocument();
      });

      // Verify API was called with correct parameters
      expect(mockGet).toHaveBeenCalledWith(
        '/api/github/pull-requests',
        {
          params: {
            username: 'lmcrean',
            page: 1,
            per_page: 20
          }
        }
      );

      // Verify both PRs are rendered
      expect(screen.getByText('refactor frontend dir to apps/web')).toBeInTheDocument();
      expect(screen.getByText('feat: add new button component')).toBeInTheDocument();
    });

    it('should handle API errors gracefully', async () => {
      // Mock API error
      mockGet.mockRejectedValueOnce(new Error('Network error'));

      render(<PullRequestFeed username="lmcrean" />);

      // Wait for error state
      await waitFor(() => {
        expect(screen.getByText('Failed to Load Pull Requests')).toBeInTheDocument();
      });

      expect(screen.getByText('Network error')).toBeInTheDocument();
      expect(screen.getByText('Try Again')).toBeInTheDocument();
    });

    it('should retry API call when retry button is clicked', async () => {
      // Mock initial error then success
      mockGet
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValueOnce({ data: mockApiResponse });

      render(<PullRequestFeed username="lmcrean" />);

      // Wait for error state
      await waitFor(() => {
        expect(screen.getByText('Try Again')).toBeInTheDocument();
      });

      // Click retry button
      fireEvent.click(screen.getByText('Try Again'));

      // Should show loading and then data
      await waitFor(() => {
        expect(screen.getByText('refactor frontend dir to apps/web')).toBeInTheDocument();
      });

      // Should have made 2 API calls
      expect(mockGet).toHaveBeenCalledTimes(2);
    });
  });

  describe('Component Interactions', () => {
    beforeEach(async () => {
      mockGet.mockResolvedValueOnce({ data: mockApiResponse });
      render(<PullRequestFeed username="lmcrean" />);
      
      // Wait for data to load
      await waitFor(() => {
        expect(screen.getByText('refactor frontend dir to apps/web')).toBeInTheDocument();
      });
    });

    it('should open detailed modal when card is clicked', async () => {
      // Mock detailed PR API response
      mockGet.mockResolvedValueOnce({ data: mockDetailedPR });

      // Click on the first PR card
      const prCard = screen.getByText('refactor frontend dir to apps/web').closest('article');
      expect(prCard).toBeInTheDocument();
      
      fireEvent.click(prCard!);

      // Should show modal loading state
      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      // Wait for detailed data to load
      await waitFor(() => {
        expect(screen.getByText('Description')).toBeInTheDocument();
        expect(screen.getByText('Stats')).toBeInTheDocument();
        expect(screen.getByText('Timeline')).toBeInTheDocument();
      });

      // Verify detailed API call was made - should be called twice: list + detail
      expect(mockGet).toHaveBeenCalledTimes(2);
      expect(mockGet).toHaveBeenNthCalledWith(2,
        '/api/github/pull-requests/lmcrean/developer-portfolio/20'
      );
    });

    it('should close modal when close button is clicked', async () => {
      // Mock detailed PR API response
      mockGet.mockResolvedValueOnce({ data: mockDetailedPR });

      // Open modal
      const prCard = screen.getByText('refactor frontend dir to apps/web').closest('article');
      fireEvent.click(prCard!);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      // Click close button
      const closeButton = screen.getByLabelText('Close modal');
      fireEvent.click(closeButton);

      // Modal should be closed
      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      });
    });

    it('should close modal when escape key is pressed', async () => {
      // Mock detailed PR API response
      mockGet.mockResolvedValueOnce({ data: mockDetailedPR });

      // Open modal
      const prCard = screen.getByText('refactor frontend dir to apps/web').closest('article');
      fireEvent.click(prCard!);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      // Press escape key
      fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' });

      // Modal should be closed
      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      });
    });
  });

  describe('API Integration', () => {
    it('should use relative URLs (environment handled by API client)', () => {
      mockGet.mockResolvedValueOnce({ data: mockApiResponse });
      render(<PullRequestFeed username="lmcrean" />);

      expect(mockGet).toHaveBeenCalledWith(
        '/api/github/pull-requests',
        {
          params: {
            username: 'lmcrean',
            page: 1,
            per_page: 20
          }
        }
      );
    });

    it('should handle different usernames', () => {
      mockGet.mockResolvedValueOnce({ data: mockApiResponse });
      render(<PullRequestFeed username="testuser" />);

      expect(mockGet).toHaveBeenCalledWith(
        '/api/github/pull-requests',
        {
          params: {
            username: 'testuser',
            page: 1,
            per_page: 20
          }
        }
      );
    });
  });

  describe('Pagination', () => {
    it('should handle pagination when multiple pages exist', async () => {
      const mockPaginatedResponse = {
        ...mockApiResponse,
        meta: {
          ...mockApiResponse.meta,
          pagination: {
            page: 1,
            per_page: 20,
            total_count: 50,
            total_pages: 3,
            has_next_page: true,
            has_previous_page: false
          }
        }
      };

      mockGet.mockResolvedValueOnce({ data: mockPaginatedResponse });
      render(<PullRequestFeed username="lmcrean" />);

      await waitFor(() => {
        expect(screen.getByText('Page 1 of 3')).toBeInTheDocument();
      });

      // Next button should be enabled, Previous should be disabled
      const nextButton = screen.getByRole('button', { name: /next/i });
      const prevButton = screen.getByRole('button', { name: /previous/i });
      
      expect(nextButton).toBeEnabled();
      expect(prevButton).toBeDisabled();
    });
  });

  describe('Accessibility', () => {
    beforeEach(async () => {
      mockGet.mockResolvedValueOnce({ data: mockApiResponse });
      render(<PullRequestFeed username="lmcrean" />);
      
      await waitFor(() => {
        expect(screen.getByText('refactor frontend dir to apps/web')).toBeInTheDocument();
      });
    });

    it('should have proper ARIA labels on cards', () => {
      const prCard = screen.getByLabelText(/Pull request #20, merged/);
      expect(prCard).toBeInTheDocument();
      expect(prCard).toHaveAttribute('role', 'button');
      expect(prCard).toHaveAttribute('tabIndex', '0');
    });

    it('should support keyboard navigation on cards', async () => {
      mockGet.mockResolvedValueOnce({ data: mockDetailedPR });

      const prCard = screen.getByLabelText(/Pull request #20, merged/);
      
      // Focus the card and press Enter
      prCard.focus();
      fireEvent.keyDown(prCard, { key: 'Enter', code: 'Enter' });

      // Modal should open
      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });
    });
  });

  describe('Organization Avatar Integration', () => {
    beforeEach(async () => {
      mockGet.mockResolvedValueOnce({ data: mockApiResponse });
      render(<PullRequestFeed username="lmcrean" />);
      
      await waitFor(() => {
        expect(screen.getByText('refactor frontend dir to apps/web')).toBeInTheDocument();
      });
    });

    it('should display organization avatars from API data', () => {
      // Check that organization avatars are rendered
      const avatars = screen.getAllByRole('img');
      expect(avatars.length).toBeGreaterThan(0);
      
      // Verify avatar sources match API data
      const avatar = avatars.find(img => 
        img.getAttribute('src') === 'https://avatars.githubusercontent.com/u/123456?v=4'
      );
      expect(avatar).toBeInTheDocument();
      expect(avatar).toHaveAttribute('alt', 'lmcrean avatar');
    });

    it('should handle different organization avatars', async () => {
      const multiOrgResponse = {
        ...mockApiResponse,
        data: [
          {
            ...mockPullRequests[0],
            repository: {
              ...mockPullRequests[0].repository,
              owner: {
                login: 'facebook',
                avatar_url: 'https://avatars.githubusercontent.com/u/69631?v=4'
              }
            }
          },
          {
            ...mockPullRequests[1],
            repository: {
              ...mockPullRequests[1].repository,
              owner: {
                login: 'google',
                avatar_url: 'https://avatars.githubusercontent.com/u/1342004?v=4'
              }
            }
          }
        ]
      };

      // Clear previous render and render with multi-org data
      mockGet.mockClear();
      mockGet.mockResolvedValueOnce({ data: multiOrgResponse });
      
      render(<PullRequestFeed username="testuser" />);
      
      await waitFor(() => {
        expect(screen.getByText('refactor frontend dir to apps/web')).toBeInTheDocument();
      });

      // Should have different organization avatars
      expect(screen.getByAltText('facebook avatar')).toBeInTheDocument();
      expect(screen.getByAltText('google avatar')).toBeInTheDocument();
    });

    it('should display avatar alongside repository name', () => {
      // Find repository name and check its container has avatar
      const repoName = screen.getByText('developer-portfolio');
      const container = repoName.closest('div');
      
      expect(container).toContainElement(screen.getByAltText('lmcrean avatar'));
      expect(container).toHaveClass('flex', 'items-center', 'gap-2');
    });

    it('should handle API data with organization owner field', () => {
      // Verify the API was called and we have the expected structure
      expect(mockGet).toHaveBeenCalledWith(
        '/api/github/pull-requests',
        {
          params: {
            username: 'lmcrean',
            page: 1,
            per_page: 20
          }
        }
      );

      // Verify that the avatar is properly rendered from the API response
      const avatar = screen.getByAltText('lmcrean avatar');
      expect(avatar).toHaveAttribute('src', 'https://avatars.githubusercontent.com/u/123456?v=4');
      expect(avatar).toHaveClass('w-5', 'h-5', 'rounded-full', 'flex-shrink-0');
    });

    it('should handle broken avatar images gracefully', () => {
      const avatar = screen.getByAltText('lmcrean avatar');
      
      // Simulate image error
      fireEvent.error(avatar);
      
      // Avatar should be hidden on error
      expect(avatar.style.display).toBe('none');
    });
  });
}); 
