/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import PullRequestFeed from '../pull-request-feed/PullRequestFeed';
import apiClient from '../api/Core';


// Mock the API client
jest.mock('../api/Core');
const mockedApiClient = apiClient as any;

// Mock child components
jest.mock('../pull-request-feed/PullRequestFeedListCard', () => ({
  default: ({ pullRequest, onClick }: any) => (
    <div data-testid={`pr-card-${pullRequest.id}`} onClick={onClick}>
      <h3>{pullRequest.title}</h3>
      <span>#{pullRequest.number}</span>
    </div>
  )
}));


// Mock data
const mockPullRequestsResponse = {
  data: {
    data: [
      {
        id: 1,
        number: 123,
        title: 'feat: Add new feature',
        description: 'This adds a new feature',
        created_at: '2024-01-15T10:30:00Z',
        merged_at: '2024-01-16T14:45:00Z',
        state: 'merged',
        html_url: 'https://github.com/lmcrean/repo1/pull/123',
        repository: {
          name: 'repo1',
          description: 'First repository',
          language: 'TypeScript',
          html_url: 'https://github.com/lmcrean/repo1',
          owner: {
            login: 'lmcrean',
            avatar_url: 'https://avatars.githubusercontent.com/u/123456?v=4'
          }
        }
      },
      {
        id: 2,
        number: 124,
        title: 'fix: Fix bug',
        description: 'This fixes a bug',
        created_at: '2024-01-14T10:30:00Z',
        merged_at: null,
        state: 'open',
        html_url: 'https://github.com/lmcrean/repo2/pull/124',
        repository: {
          name: 'repo2',
          description: 'Second repository',
          language: 'JavaScript',
          html_url: 'https://github.com/lmcrean/repo2',
          owner: {
            login: 'lmcrean',
            avatar_url: 'https://avatars.githubusercontent.com/u/123456?v=4'
          }
        }
      }
    ],
    meta: {
      username: 'lmcrean',
      count: 2,
      pagination: {
        page: 1,
        per_page: 20,
        total_count: 25,
        total_pages: 2,
        has_next_page: true,
        has_previous_page: false
      }
    }
  }
};


describe('PullRequestFeed', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('Initial Loading', () => {
    it('renders loading state initially', () => {
      mockedApiClient.get.mockImplementation(() => new Promise(() => {})); // Never resolves
      
      render(<PullRequestFeed />);
      
      expect(screen.getByText('Pull Request Activity')).toBeInTheDocument();
      expect(screen.getByText(/Loading pull requests for lmcrean/)).toBeInTheDocument();
      expect(screen.getAllByRole('generic')).toHaveLength(expect.any(Number));
    });

    it('displays loading skeletons', () => {
      mockedApiClient.get.mockImplementation(() => new Promise(() => {}));
      
      const { container } = render(<PullRequestFeed />);
      
      const skeletons = container.querySelectorAll('.animate-pulse');
      expect(skeletons.length).toBeGreaterThan(0);
    });
  });

  describe('Successful Data Loading', () => {
    beforeEach(() => {
      mockedApiClient.get.mockResolvedValue(mockPullRequestsResponse);
    });

    it('displays pull requests after loading', async () => {
      render(<PullRequestFeed />);
      
      await waitFor(() => {
        expect(screen.getByText('feat: Add new feature')).toBeInTheDocument();
        expect(screen.getByText('fix: Fix bug')).toBeInTheDocument();
      });
      
      expect(screen.getByText('#123')).toBeInTheDocument();
      expect(screen.getByText('#124')).toBeInTheDocument();
    });

    it('displays pagination information', async () => {
      render(<PullRequestFeed />);
      
      await waitFor(() => {
        expect(screen.getByText('Showing 2 of 25 pull requests for lmcrean')).toBeInTheDocument();
      });
    });

    it('calls API with correct parameters', async () => {
      render(<PullRequestFeed username="testuser" />);
      
      await waitFor(() => {
        expect(mockedApiClient.get).toHaveBeenCalledWith('/api/github/pull-requests', {
          params: {
            username: 'testuser',
            page: 1,
            per_page: 20
          }
        });
      });
    });

    it('uses default username when none provided', async () => {
      render(<PullRequestFeed />);
      
      await waitFor(() => {
        expect(mockedApiClient.get).toHaveBeenCalledWith('/api/github/pull-requests', {
          params: {
            username: 'lmcrean',
            page: 1,
            per_page: 20
          }
        });
      });
    });
  });

  describe('Error Handling', () => {
    it('displays error message when API call fails', async () => {
      const error = new Error('Failed to fetch');
      mockedApiClient.get.mockRejectedValue(error);
      
      render(<PullRequestFeed />);
      
      await waitFor(() => {
        expect(screen.getByText('Failed to Load Pull Requests')).toBeInTheDocument();
        expect(screen.getByText('Failed to fetch')).toBeInTheDocument();
      });
      
      expect(screen.getByText('Try Again')).toBeInTheDocument();
    });

    it('displays fallback error message when no error message', async () => {
      mockedApiClient.get.mockRejectedValue({});
      
      render(<PullRequestFeed />);
      
      await waitFor(() => {
        expect(screen.getByText('Failed to load pull requests.')).toBeInTheDocument();
      });
    });

    it('retries API call when Try Again is clicked', async () => {
      const error = new Error('Network error');
      mockedApiClient.get.mockRejectedValueOnce(error)
                      .mockResolvedValue(mockPullRequestsResponse);
      
      render(<PullRequestFeed />);
      
      await waitFor(() => {
        expect(screen.getByText('Try Again')).toBeInTheDocument();
      });
      
      fireEvent.click(screen.getByText('Try Again'));
      
      await waitFor(() => {
        expect(screen.getByText('feat: Add new feature')).toBeInTheDocument();
      });
      
      expect(mockedApiClient.get).toHaveBeenCalledTimes(2);
    });
  });

  describe('Pagination', () => {
    beforeEach(() => {
      mockedApiClient.get.mockResolvedValue(mockPullRequestsResponse);
    });

    it('displays pagination controls when multiple pages exist', async () => {
      render(<PullRequestFeed />);
      
      await waitFor(() => {
        expect(screen.getByText('Previous')).toBeInTheDocument();
        expect(screen.getByText('Next')).toBeInTheDocument();
        expect(screen.getByText('Page 1 of 2')).toBeInTheDocument();
      });
    });

    it('disables Previous button on first page', async () => {
      render(<PullRequestFeed />);
      
      await waitFor(() => {
        const previousButton = screen.getByText('Previous').closest('button');
        expect(previousButton).toBeDisabled();
      });
    });

    it('enables Next button when has_next_page is true', async () => {
      render(<PullRequestFeed />);
      
      await waitFor(() => {
        const nextButton = screen.getByText('Next').closest('button');
        expect(nextButton).not.toBeDisabled();
      });
    });

    it('calls API with correct page when Next is clicked', async () => {
      const page2Response = {
        ...mockPullRequestsResponse,
        data: {
          ...mockPullRequestsResponse.data,
          meta: {
            ...mockPullRequestsResponse.data.meta,
            pagination: {
              ...mockPullRequestsResponse.data.meta.pagination,
              page: 2,
              has_next_page: false,
              has_previous_page: true
            }
          }
        }
      };
      
      mockedApiClient.get.mockResolvedValueOnce(mockPullRequestsResponse)
                      .mockResolvedValueOnce(page2Response);
      
      render(<PullRequestFeed />);
      
      await waitFor(() => {
        expect(screen.getByText('Next')).toBeInTheDocument();
      });
      
      fireEvent.click(screen.getByText('Next'));
      
      await waitFor(() => {
        expect(mockedApiClient.get).toHaveBeenCalledWith('/api/github/pull-requests', {
          params: {
            username: 'lmcrean',
            page: 2,
            per_page: 20
          }
        });
      });
    });

    it('does not display pagination for single page', async () => {
      const singlePageResponse = {
        ...mockPullRequestsResponse,
        data: {
          ...mockPullRequestsResponse.data,
          meta: {
            ...mockPullRequestsResponse.data.meta,
            pagination: {
              page: 1,
              per_page: 20,
              total_count: 2,
              total_pages: 1,
              has_next_page: false,
              has_previous_page: false
            }
          }
        }
      };
      
      mockedApiClient.get.mockResolvedValue(singlePageResponse);
      
      render(<PullRequestFeed />);
      
      await waitFor(() => {
        expect(screen.getByText('feat: Add new feature')).toBeInTheDocument();
      });
      
      expect(screen.queryByText('Previous')).not.toBeInTheDocument();
      expect(screen.queryByText('Next')).not.toBeInTheDocument();
    });
  });

  describe('GitHub Link Interactions', () => {
    beforeEach(() => {
      mockedApiClient.get.mockResolvedValue(mockPullRequestsResponse);
      // Mock window.open
      global.open = jest.fn();
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('opens GitHub PR in new tab when card is clicked', async () => {
      render(<PullRequestFeed />);
      
      await waitFor(() => {
        expect(screen.getByTestId('pr-card-1')).toBeInTheDocument();
      });
      
      fireEvent.click(screen.getByTestId('pr-card-1'));
      
      expect(global.open).toHaveBeenCalledWith(
        'https://github.com/lmcrean/repo1/pull/123',
        '_blank',
        'noopener,noreferrer'
      );
    });

    it('does not call API for detail data when card is clicked', async () => {
      render(<PullRequestFeed />);
      
      await waitFor(() => {
        expect(screen.getByTestId('pr-card-1')).toBeInTheDocument();
      });
      
      fireEvent.click(screen.getByTestId('pr-card-1'));
      
      // Should only have called for initial list, not detail
      expect(mockedApiClient.get).toHaveBeenCalledTimes(1);
      expect(mockedApiClient.get).toHaveBeenCalledWith('/api/github/pull-requests', {
        params: {
          username: 'lmcrean',
          page: 1,
          per_page: 20
        }
      });
    });
  });

  describe('Custom Props', () => {
    beforeEach(() => {
      mockedApiClient.get.mockResolvedValue(mockPullRequestsResponse);
    });

    it('applies custom className', async () => {
      const { container } = render(<PullRequestFeed className="custom-class" />);
      
      const feedContainer = container.querySelector('.custom-class');
      expect(feedContainer).toBeInTheDocument();
    });

    it('uses custom username in API call', async () => {
      render(<PullRequestFeed username="customuser" />);
      
      await waitFor(() => {
        expect(mockedApiClient.get).toHaveBeenCalledWith('/api/github/pull-requests', {
          params: {
            username: 'customuser',
            page: 1,
            per_page: 20
          }
        });
      });
    });

    it('displays custom username in header', async () => {
      render(<PullRequestFeed username="customuser" />);
      
      await waitFor(() => {
        expect(screen.getByText(/pull requests for customuser/)).toBeInTheDocument();
      });
    });
  });

  describe('Loading States During Pagination', () => {
    it('shows loading indicator during pagination', async () => {
      mockedApiClient.get.mockResolvedValueOnce(mockPullRequestsResponse)
                      .mockImplementation(() => new Promise(() => {})); // Never resolves
      
      render(<PullRequestFeed />);
      
      await waitFor(() => {
        expect(screen.getByText('Next')).toBeInTheDocument();
      });
      
      fireEvent.click(screen.getByText('Next'));
      
      await waitFor(() => {
        expect(screen.getByText('Loading...')).toBeInTheDocument();
      });
    });

    it('disables pagination buttons during loading', async () => {
      mockedApiClient.get.mockResolvedValueOnce(mockPullRequestsResponse)
                      .mockImplementation(() => new Promise(() => {}));
      
      render(<PullRequestFeed />);
      
      await waitFor(() => {
        expect(screen.getByText('Next')).toBeInTheDocument();
      });
      
      fireEvent.click(screen.getByText('Next'));
      
      await waitFor(() => {
        const nextButton = screen.getByText('Next').closest('button');
        const previousButton = screen.getByText('Previous').closest('button');
        expect(nextButton).toBeDisabled();
        expect(previousButton).toBeDisabled();
      });
    });
  });

  describe('Edge Cases', () => {
    it('handles empty response gracefully', async () => {
      const emptyResponse = {
        data: {
          data: [],
          meta: {
            username: 'lmcrean',
            count: 0,
            pagination: {
              page: 1,
              per_page: 20,
              total_count: 0,
              total_pages: 0,
              has_next_page: false,
              has_previous_page: false
            }
          }
        }
      };
      
      mockedApiClient.get.mockResolvedValue(emptyResponse);
      
      render(<PullRequestFeed />);
      
      await waitFor(() => {
        expect(screen.getByText('Showing 0 of 0 pull requests for lmcrean')).toBeInTheDocument();
      });
    });

    it('handles malformed API response', async () => {
      mockedApiClient.get.mockResolvedValue({ data: null });
      
      render(<PullRequestFeed />);
      
      await waitFor(() => {
        expect(screen.getByText(/Failed to load/)).toBeInTheDocument();
      });
    });
  });
}); 