"use strict";
/**
 * @jest-environment jsdom
 */
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var react_2 = require("@testing-library/react");
require("@testing-library/jest-dom");
var index_1 = require("../pull-request-feed/list-card/index");
// Mock data
var mockPullRequest = {
    id: 123,
    number: 456,
    title: 'feat: Add new feature to improve user experience',
    description: 'This is a detailed description of the pull request that explains what changes were made and why they were necessary for the application.',
    created_at: '2024-01-15T10:30:00Z',
    merged_at: '2024-01-16T14:45:00Z',
    state: 'merged',
    html_url: 'https://github.com/lmcrean/test-repo/pull/456',
    repository: {
        name: 'test-repo',
        description: 'A test repository for testing purposes',
        language: 'TypeScript',
        html_url: 'https://github.com/lmcrean/test-repo'
    }
};
var mockOpenPullRequest = __assign(__assign({}, mockPullRequest), { id: 124, number: 457, state: 'open', merged_at: null, title: 'fix: Fix critical bug in authentication system' });
var mockClosedPullRequest = __assign(__assign({}, mockPullRequest), { id: 125, number: 458, state: 'closed', merged_at: null, title: 'doc: Update README with installation instructions' });
describe('PullRequestFeedListCard', function () {
    var mockOnClick = jest.fn();
    beforeEach(function () {
        jest.clearAllMocks();
        // Mock Date for consistent time calculations
        jest.useFakeTimers();
        jest.setSystemTime(new Date('2024-01-16T15:00:00Z'));
    });
    afterEach(function () {
        jest.useRealTimers();
    });
    describe('Basic Rendering', function () {
        it('renders without crashing', function () {
            (0, react_2.render)(<index_1.default pullRequest={mockPullRequest} onClick={mockOnClick}/>);
        });
        it('displays pull request title', function () {
            (0, react_2.render)(<index_1.default pullRequest={mockPullRequest} onClick={mockOnClick}/>);
            expect(react_2.screen.getByText(mockPullRequest.title)).toBeInTheDocument();
        });
        it('displays pull request number', function () {
            (0, react_2.render)(<index_1.default pullRequest={mockPullRequest} onClick={mockOnClick}/>);
            expect(react_2.screen.getByText('#456')).toBeInTheDocument();
        });
        it('displays repository name', function () {
            (0, react_2.render)(<index_1.default pullRequest={mockPullRequest} onClick={mockOnClick}/>);
            expect(react_2.screen.getByText('test-repo')).toBeInTheDocument();
        });
        it('displays programming language', function () {
            (0, react_2.render)(<index_1.default pullRequest={mockPullRequest} onClick={mockOnClick}/>);
            expect(react_2.screen.getByText('🏷️ TypeScript')).toBeInTheDocument();
        });
        it('displays description when provided', function () {
            (0, react_2.render)(<index_1.default pullRequest={mockPullRequest} onClick={mockOnClick}/>);
            expect(react_2.screen.getByText(/This is a detailed description/)).toBeInTheDocument();
        });
        it('does not display description section when null', function () {
            var prWithoutDescription = __assign(__assign({}, mockPullRequest), { description: null });
            (0, react_2.render)(<index_1.default pullRequest={prWithoutDescription} onClick={mockOnClick}/>);
            expect(react_2.screen.queryByText('📝')).not.toBeInTheDocument();
        });
    });
    describe('Status Display', function () {
        it('displays merged status correctly', function () {
            (0, react_2.render)(<index_1.default pullRequest={mockPullRequest} onClick={mockOnClick}/>);
            expect(react_2.screen.getByText('merged')).toBeInTheDocument();
            expect(react_2.screen.getByText('•')).toBeInTheDocument();
        });
        it('displays open status correctly', function () {
            (0, react_2.render)(<index_1.default pullRequest={mockOpenPullRequest} onClick={mockOnClick}/>);
            expect(react_2.screen.getByText('open')).toBeInTheDocument();
            expect(react_2.screen.getByText('○')).toBeInTheDocument();
        });
        it('displays closed status correctly', function () {
            (0, react_2.render)(<index_1.default pullRequest={mockClosedPullRequest} onClick={mockOnClick}/>);
            expect(react_2.screen.getByText('closed')).toBeInTheDocument();
            expect(react_2.screen.getByText('×')).toBeInTheDocument();
        });
        it('applies correct CSS classes for merged status', function () {
            var container = (0, react_2.render)(<index_1.default pullRequest={mockPullRequest} onClick={mockOnClick}/>).container;
            var statusElement = container.querySelector('.text-purple-600');
            expect(statusElement).toBeInTheDocument();
            expect(statusElement).toHaveClass('dark:text-purple-400');
        });
        it('applies correct CSS classes for open status', function () {
            var container = (0, react_2.render)(<index_1.default pullRequest={mockOpenPullRequest} onClick={mockOnClick}/>).container;
            var statusElement = container.querySelector('.text-green-600');
            expect(statusElement).toBeInTheDocument();
            expect(statusElement).toHaveClass('dark:text-green-400');
        });
        it('applies correct CSS classes for closed status', function () {
            var container = (0, react_2.render)(<index_1.default pullRequest={mockClosedPullRequest} onClick={mockOnClick}/>).container;
            var statusElement = container.querySelector('.text-red-600');
            expect(statusElement).toBeInTheDocument();
            expect(statusElement).toHaveClass('dark:text-red-400');
        });
    });
    describe('Time Display', function () {
        it('displays relative time correctly', function () {
            (0, react_2.render)(<index_1.default pullRequest={mockPullRequest} onClick={mockOnClick}/>);
            // Check that some relative time is displayed (the exact format may vary)
            expect(react_2.screen.getByText(/ago$/)).toBeInTheDocument();
        });
        it('displays "just now" for very recent PRs', function () {
            var recentPR = __assign(__assign({}, mockPullRequest), { created_at: '2024-01-16T14:59:30Z' // 30 seconds ago
             });
            (0, react_2.render)(<index_1.default pullRequest={recentPR} onClick={mockOnClick}/>);
            expect(react_2.screen.getByText('just now')).toBeInTheDocument();
        });
    });
    describe('Title Icons', function () {
        it('displays refactor icon for refactor PRs', function () {
            var refactorPR = __assign(__assign({}, mockPullRequest), { title: 'refactor: Improve code structure' });
            (0, react_2.render)(<index_1.default pullRequest={refactorPR} onClick={mockOnClick}/>);
            expect(react_2.screen.getByText('🔄')).toBeInTheDocument();
        });
        it('displays feature icon for feature PRs', function () {
            var featurePR = __assign(__assign({}, mockPullRequest), { title: 'feat: Add new dashboard' });
            (0, react_2.render)(<index_1.default pullRequest={featurePR} onClick={mockOnClick}/>);
            expect(react_2.screen.getByText('✨')).toBeInTheDocument();
        });
        it('displays bug icon for fix PRs', function () {
            var bugPR = __assign(__assign({}, mockPullRequest), { title: 'fix: Resolve login issue' });
            (0, react_2.render)(<index_1.default pullRequest={bugPR} onClick={mockOnClick}/>);
            expect(react_2.screen.getByText('🐛')).toBeInTheDocument();
        });
        it('displays doc icon for documentation PRs', function () {
            var docPR = __assign(__assign({}, mockPullRequest), { title: 'doc: Update API documentation' });
            var container = (0, react_2.render)(<index_1.default pullRequest={docPR} onClick={mockOnClick}/>).container;
            // Look for the title icon specifically (larger size)
            var titleIcon = container.querySelector('.text-lg');
            expect(titleIcon).toHaveTextContent('📝');
        });
        it('displays test icon for test PRs', function () {
            var testPR = __assign(__assign({}, mockPullRequest), { title: 'test: Add unit tests for auth' });
            var container = (0, react_2.render)(<index_1.default pullRequest={testPR} onClick={mockOnClick}/>).container;
            var titleIcon = container.querySelector('.text-lg');
            expect(titleIcon).toHaveTextContent('🧪');
        });
        it('displays style icon for style PRs', function () {
            var stylePR = __assign(__assign({}, mockPullRequest), { title: 'style: Update button styling' });
            var container = (0, react_2.render)(<index_1.default pullRequest={stylePR} onClick={mockOnClick}/>).container;
            var titleIcon = container.querySelector('.text-lg');
            expect(titleIcon).toHaveTextContent('💄');
        });
        it('displays default icon for other PRs', function () {
            var otherPR = __assign(__assign({}, mockPullRequest), { title: 'chore: Update dependencies' });
            var container = (0, react_2.render)(<index_1.default pullRequest={otherPR} onClick={mockOnClick}/>).container;
            var titleIcon = container.querySelector('.text-lg');
            expect(titleIcon).toHaveTextContent('📝');
        });
    });
    describe('Language Colors', function () {
        it('applies TypeScript color correctly', function () {
            var container = (0, react_2.render)(<index_1.default pullRequest={mockPullRequest} onClick={mockOnClick}/>).container;
            var languageTag = container.querySelector('.bg-blue-600');
            expect(languageTag).toBeInTheDocument();
            expect(languageTag).toHaveTextContent('🏷️ TypeScript');
        });
        it('applies JavaScript color correctly', function () {
            var jsPR = __assign(__assign({}, mockPullRequest), { repository: __assign(__assign({}, mockPullRequest.repository), { language: 'JavaScript' }) });
            var container = (0, react_2.render)(<index_1.default pullRequest={jsPR} onClick={mockOnClick}/>).container;
            var languageTag = container.querySelector('.bg-yellow-400');
            expect(languageTag).toBeInTheDocument();
        });
        it('does not display language tag when language is null', function () {
            var noLangPR = __assign(__assign({}, mockPullRequest), { repository: __assign(__assign({}, mockPullRequest.repository), { language: null }) });
            (0, react_2.render)(<index_1.default pullRequest={noLangPR} onClick={mockOnClick}/>);
            expect(react_2.screen.queryByText(/🏷️/)).not.toBeInTheDocument();
        });
    });
    describe('Interactions', function () {
        it('calls onClick when card is clicked', function () {
            (0, react_2.render)(<index_1.default pullRequest={mockPullRequest} onClick={mockOnClick}/>);
            var card = react_2.screen.getByRole('button');
            react_2.fireEvent.click(card);
            expect(mockOnClick).toHaveBeenCalledTimes(1);
        });
        it('calls onClick when Enter key is pressed', function () {
            (0, react_2.render)(<index_1.default pullRequest={mockPullRequest} onClick={mockOnClick}/>);
            var card = react_2.screen.getByRole('button');
            react_2.fireEvent.keyDown(card, { key: 'Enter' });
            expect(mockOnClick).toHaveBeenCalledTimes(1);
        });
        it('calls onClick when Space key is pressed', function () {
            (0, react_2.render)(<index_1.default pullRequest={mockPullRequest} onClick={mockOnClick}/>);
            var card = react_2.screen.getByRole('button');
            react_2.fireEvent.keyDown(card, { key: ' ' });
            expect(mockOnClick).toHaveBeenCalledTimes(1);
        });
        it('does not call onClick for other keys', function () {
            (0, react_2.render)(<index_1.default pullRequest={mockPullRequest} onClick={mockOnClick}/>);
            var card = react_2.screen.getByRole('button');
            react_2.fireEvent.keyDown(card, { key: 'Tab' });
            expect(mockOnClick).not.toHaveBeenCalled();
        });
    });
    describe('Accessibility', function () {
        it('has correct ARIA label', function () {
            (0, react_2.render)(<index_1.default pullRequest={mockPullRequest} onClick={mockOnClick}/>);
            var card = react_2.screen.getByRole('button');
            // Check that aria-label contains expected elements
            var ariaLabel = card.getAttribute('aria-label');
            expect(ariaLabel).toContain('Pull request #456');
            expect(ariaLabel).toContain('merged');
            expect(ariaLabel).toMatch(/ago$/);
        });
        it('has correct tabIndex', function () {
            (0, react_2.render)(<index_1.default pullRequest={mockPullRequest} onClick={mockOnClick}/>);
            var card = react_2.screen.getByRole('button');
            expect(card).toHaveAttribute('tabIndex', '0');
        });
        it('has button role', function () {
            (0, react_2.render)(<index_1.default pullRequest={mockPullRequest} onClick={mockOnClick}/>);
            expect(react_2.screen.getByRole('button')).toBeInTheDocument();
        });
    });
    describe('Styling and Layout', function () {
        it('has correct base CSS classes', function () {
            var container = (0, react_2.render)(<index_1.default pullRequest={mockPullRequest} onClick={mockOnClick}/>).container;
            var card = container.querySelector('article');
            expect(card).toHaveClass('w-full');
            expect(card).toHaveClass('bg-white');
            expect(card).toHaveClass('dark:bg-gray-800');
            expect(card).toHaveClass('border');
            expect(card).toHaveClass('border-gray-200');
            expect(card).toHaveClass('dark:border-gray-700');
            expect(card).toHaveClass('rounded-lg');
            expect(card).toHaveClass('p-4');
            expect(card).toHaveClass('cursor-pointer');
        });
        it('has correct hover and focus classes', function () {
            var container = (0, react_2.render)(<index_1.default pullRequest={mockPullRequest} onClick={mockOnClick}/>).container;
            var card = container.querySelector('article');
            expect(card).toHaveClass('hover:bg-gray-50');
            expect(card).toHaveClass('dark:hover:bg-gray-700');
            expect(card).toHaveClass('focus:outline-none');
            expect(card).toHaveClass('focus:ring-2');
            expect(card).toHaveClass('focus:ring-blue-500');
        });
        it('truncates long descriptions', function () {
            var longDescPR = __assign(__assign({}, mockPullRequest), { description: 'This is a very long description that should be truncated when it exceeds the maximum character limit set by the truncateText function. It contains way more than 80 characters and should end with ellipsis.' });
            (0, react_2.render)(<index_1.default pullRequest={longDescPR} onClick={mockOnClick}/>);
            var description = react_2.screen.getByText(/This is a very long description/);
            expect(description.textContent).toMatch(/\.\.\.$/);
        });
    });
    describe('Edge Cases', function () {
        it('handles missing repository language gracefully', function () {
            var noLangPR = __assign(__assign({}, mockPullRequest), { repository: __assign(__assign({}, mockPullRequest.repository), { language: null }) });
            expect(function () {
                (0, react_2.render)(<index_1.default pullRequest={noLangPR} onClick={mockOnClick}/>);
            }).not.toThrow();
        });
        it('handles empty description gracefully', function () {
            var emptyDescPR = __assign(__assign({}, mockPullRequest), { description: '' });
            expect(function () {
                (0, react_2.render)(<index_1.default pullRequest={emptyDescPR} onClick={mockOnClick}/>);
            }).not.toThrow();
        });
        it('handles invalid date strings gracefully', function () {
            var invalidDatePR = __assign(__assign({}, mockPullRequest), { created_at: 'invalid-date' });
            expect(function () {
                (0, react_2.render)(<index_1.default pullRequest={invalidDatePR} onClick={mockOnClick}/>);
            }).not.toThrow();
        });
    });
});
