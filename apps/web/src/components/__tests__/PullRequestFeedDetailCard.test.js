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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var react_2 = require("@testing-library/react");
require("@testing-library/jest-dom");
var index_1 = require("../pull-request-feed/detail-card/index");
// Mock detailed pull request data
var mockDetailedPullRequest = {
    id: 123,
    number: 456,
    title: 'feat: Add new feature to improve user experience',
    description: 'This is a detailed description of the pull request.\n\nIt includes multiple lines and explains the changes made.\n\nThe implementation improves user experience significantly.',
    created_at: '2024-01-15T10:30:00Z',
    updated_at: '2024-01-16T12:15:00Z',
    merged_at: '2024-01-16T14:45:00Z',
    closed_at: null,
    html_url: 'https://github.com/lmcrean/test-repo/pull/456',
    state: 'merged',
    draft: false,
    commits: 8,
    additions: 142,
    deletions: 73,
    changed_files: 12,
    comments: 5,
    author: {
        login: 'lmcrean',
        avatar_url: 'https://github.com/lmcrean.png',
        html_url: 'https://github.com/lmcrean'
    },
    repository: {
        name: 'test-repo',
        description: 'A test repository for testing purposes',
        language: 'TypeScript',
        html_url: 'https://github.com/lmcrean/test-repo'
    }
};
var mockOpenPullRequest = __assign(__assign({}, mockDetailedPullRequest), { id: 124, number: 457, state: 'open', merged_at: null, title: 'fix: Fix critical bug in authentication system' });
var mockDraftPullRequest = __assign(__assign({}, mockDetailedPullRequest), { id: 125, number: 458, state: 'open', merged_at: null, draft: true, title: 'draft: Work in progress feature' });
var mockClosedPullRequest = __assign(__assign({}, mockDetailedPullRequest), { id: 126, number: 459, state: 'closed', merged_at: null, closed_at: '2024-01-16T16:00:00Z', title: 'chore: Update dependencies' });
// Mock clipboard API
Object.assign(navigator, {
    clipboard: {
        writeText: jest.fn().mockResolvedValue(undefined),
    },
});
// Mock window.open
Object.defineProperty(window, 'open', {
    writable: true,
    value: jest.fn(),
});
// Mock navigator.share
Object.defineProperty(navigator, 'share', {
    writable: true,
    value: jest.fn().mockResolvedValue(undefined),
});
describe('PullRequestFeedDetailCard', function () {
    var mockOnClose = jest.fn();
    beforeEach(function () {
        jest.clearAllMocks();
        // Mock Date for consistent time formatting
        jest.useFakeTimers();
        jest.setSystemTime(new Date('2024-01-16T15:00:00Z'));
        // Reset body overflow style
        document.body.style.overflow = 'unset';
    });
    afterEach(function () {
        jest.useRealTimers();
        document.body.style.overflow = 'unset';
    });
    describe('Modal Behavior', function () {
        it('does not render when isOpen is false', function () {
            (0, react_2.render)(<index_1.default pullRequest={mockDetailedPullRequest} isOpen={false} onClose={mockOnClose}/>);
            expect(react_2.screen.queryByRole('dialog')).not.toBeInTheDocument();
        });
        it('renders when isOpen is true', function () {
            (0, react_2.render)(<index_1.default pullRequest={mockDetailedPullRequest} isOpen={true} onClose={mockOnClose}/>);
            expect(react_2.screen.getByRole('dialog')).toBeInTheDocument();
        });
        it('sets body overflow to hidden when modal is open', function () {
            (0, react_2.render)(<index_1.default pullRequest={mockDetailedPullRequest} isOpen={true} onClose={mockOnClose}/>);
            expect(document.body.style.overflow).toBe('hidden');
        });
        it('calls onClose when backdrop is clicked', function () {
            (0, react_2.render)(<index_1.default pullRequest={mockDetailedPullRequest} isOpen={true} onClose={mockOnClose}/>);
            var backdrop = react_2.screen.getByRole('dialog').parentElement;
            react_2.fireEvent.click(backdrop);
            expect(mockOnClose).toHaveBeenCalledTimes(1);
        });
        it('does not close when modal content is clicked', function () {
            (0, react_2.render)(<index_1.default pullRequest={mockDetailedPullRequest} isOpen={true} onClose={mockOnClose}/>);
            var modal = react_2.screen.getByRole('dialog');
            react_2.fireEvent.click(modal);
            expect(mockOnClose).not.toHaveBeenCalled();
        });
        it('calls onClose when back button is clicked', function () {
            (0, react_2.render)(<index_1.default pullRequest={mockDetailedPullRequest} isOpen={true} onClose={mockOnClose}/>);
            var backButton = react_2.screen.getByLabelText('Go back');
            react_2.fireEvent.click(backButton);
            expect(mockOnClose).toHaveBeenCalledTimes(1);
        });
        it('calls onClose when close button is clicked', function () {
            (0, react_2.render)(<index_1.default pullRequest={mockDetailedPullRequest} isOpen={true} onClose={mockOnClose}/>);
            var closeButton = react_2.screen.getByLabelText('Close modal');
            react_2.fireEvent.click(closeButton);
            expect(mockOnClose).toHaveBeenCalledTimes(1);
        });
        it('calls onClose when Escape key is pressed', function () {
            (0, react_2.render)(<index_1.default pullRequest={mockDetailedPullRequest} isOpen={true} onClose={mockOnClose}/>);
            react_2.fireEvent.keyDown(document, { key: 'Escape' });
            expect(mockOnClose).toHaveBeenCalledTimes(1);
        });
        it('does not call onClose for other keys', function () {
            (0, react_2.render)(<index_1.default pullRequest={mockDetailedPullRequest} isOpen={true} onClose={mockOnClose}/>);
            react_2.fireEvent.keyDown(document, { key: 'Enter' });
            expect(mockOnClose).not.toHaveBeenCalled();
        });
    });
    describe('Loading State', function () {
        it('displays loading content when loading is true', function () {
            (0, react_2.render)(<index_1.default pullRequest={mockDetailedPullRequest} isOpen={true} onClose={mockOnClose} loading={true}/>);
            expect(react_2.screen.getByText('Back')).toBeInTheDocument();
            expect(react_2.screen.getAllByRole('button')).toHaveLength(2); // Back and close buttons
            // Check for loading skeleton
            var skeletons = document.querySelectorAll('.animate-pulse');
            expect(skeletons.length).toBeGreaterThan(0);
        });
    });
    describe('Error State', function () {
        it('displays error content when error is provided', function () {
            (0, react_2.render)(<index_1.default pullRequest={mockDetailedPullRequest} isOpen={true} onClose={mockOnClose} error="Failed to load PR details"/>);
            expect(react_2.screen.getByText('Error Loading PR')).toBeInTheDocument();
            expect(react_2.screen.getByText('Failed to load PR details')).toBeInTheDocument();
            expect(react_2.screen.getByText('Try Again')).toBeInTheDocument();
        });
        it('reloads page when Try Again button is clicked in error state', function () {
            var mockReload = jest.fn();
            Object.defineProperty(window.location, 'reload', {
                writable: true,
                value: mockReload,
            });
            (0, react_2.render)(<index_1.default pullRequest={mockDetailedPullRequest} isOpen={true} onClose={mockOnClose} error="Failed to load PR details"/>);
            var tryAgainButton = react_2.screen.getByText('Try Again');
            react_2.fireEvent.click(tryAgainButton);
            expect(mockReload).toHaveBeenCalledTimes(1);
        });
    });
    describe('Content Rendering', function () {
        beforeEach(function () {
            (0, react_2.render)(<index_1.default pullRequest={mockDetailedPullRequest} isOpen={true} onClose={mockOnClose}/>);
        });
        it('displays pull request title', function () {
            expect(react_2.screen.getByText(mockDetailedPullRequest.title)).toBeInTheDocument();
        });
        it('displays pull request number', function () {
            expect(react_2.screen.getByText('#456')).toBeInTheDocument();
        });
        it('displays author information', function () {
            expect(react_2.screen.getByText('lmcrean')).toBeInTheDocument();
        });
        it('displays repository name', function () {
            expect(react_2.screen.getByText('test-repo')).toBeInTheDocument();
        });
        it('displays programming language', function () {
            expect(react_2.screen.getByText('🏷️ TypeScript')).toBeInTheDocument();
        });
        it('displays description with line breaks', function () {
            expect(react_2.screen.getByText(/This is a detailed description/)).toBeInTheDocument();
            expect(react_2.screen.getByText(/It includes multiple lines/)).toBeInTheDocument();
            expect(react_2.screen.getByText(/The implementation improves/)).toBeInTheDocument();
        });
        it('displays statistics correctly', function () {
            expect(react_2.screen.getByText('+142')).toBeInTheDocument();
            expect(react_2.screen.getByText('-73')).toBeInTheDocument();
            expect(react_2.screen.getByText('12 files changed')).toBeInTheDocument();
            expect(react_2.screen.getByText('5 comments')).toBeInTheDocument();
            expect(react_2.screen.getByText('8 commits')).toBeInTheDocument();
        });
        it('displays timeline information', function () {
            expect(react_2.screen.getByText(/Created:/)).toBeInTheDocument();
            expect(react_2.screen.getByText(/Updated:/)).toBeInTheDocument();
            expect(react_2.screen.getByText(/Merged:/)).toBeInTheDocument();
        });
    });
    describe('Status Display', function () {
        it('displays merged status correctly', function () {
            (0, react_2.render)(<index_1.default pullRequest={mockDetailedPullRequest} isOpen={true} onClose={mockOnClose}/>);
            expect(react_2.screen.getByText('merged')).toBeInTheDocument();
            expect(react_2.screen.getByText('•')).toBeInTheDocument();
        });
        it('displays open status correctly', function () {
            (0, react_2.render)(<index_1.default pullRequest={mockOpenPullRequest} isOpen={true} onClose={mockOnClose}/>);
            expect(react_2.screen.getByText('open')).toBeInTheDocument();
            expect(react_2.screen.getByText('○')).toBeInTheDocument();
        });
        it('displays draft status correctly', function () {
            (0, react_2.render)(<index_1.default pullRequest={mockDraftPullRequest} isOpen={true} onClose={mockOnClose}/>);
            expect(react_2.screen.getByText('draft')).toBeInTheDocument();
        });
        it('displays closed status and timeline correctly', function () {
            (0, react_2.render)(<index_1.default pullRequest={mockClosedPullRequest} isOpen={true} onClose={mockOnClose}/>);
            expect(react_2.screen.getByText('closed')).toBeInTheDocument();
            expect(react_2.screen.getByText(/Closed:/)).toBeInTheDocument();
        });
    });
    describe('Actions', function () {
        beforeEach(function () {
            (0, react_2.render)(<index_1.default pullRequest={mockDetailedPullRequest} isOpen={true} onClose={mockOnClose}/>);
        });
        it('opens GitHub URL when View on GitHub is clicked', function () {
            var viewButton = react_2.screen.getByText('View on GitHub');
            react_2.fireEvent.click(viewButton);
            expect(window.open).toHaveBeenCalledWith(mockDetailedPullRequest.html_url, '_blank');
        });
        it('copies URL to clipboard when Copy Link is clicked', function () { return __awaiter(void 0, void 0, void 0, function () {
            var copyButton;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        copyButton = react_2.screen.getByText('Copy Link');
                        react_2.fireEvent.click(copyButton);
                        return [4 /*yield*/, (0, react_2.waitFor)(function () {
                                expect(navigator.clipboard.writeText).toHaveBeenCalledWith(mockDetailedPullRequest.html_url);
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('uses navigator.share when Share is clicked and share API is available', function () { return __awaiter(void 0, void 0, void 0, function () {
            var shareButton;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        shareButton = react_2.screen.getByText('Share');
                        react_2.fireEvent.click(shareButton);
                        return [4 /*yield*/, (0, react_2.waitFor)(function () {
                                expect(navigator.share).toHaveBeenCalledWith({
                                    title: "PR #456: ".concat(mockDetailedPullRequest.title),
                                    text: "Check out this pull request by ".concat(mockDetailedPullRequest.author.login),
                                    url: mockDetailedPullRequest.html_url
                                });
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('falls back to clipboard when Share is clicked and share API is not available', function () { return __awaiter(void 0, void 0, void 0, function () {
            var originalShare, shareButton;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        originalShare = navigator.share;
                        delete navigator.share;
                        shareButton = react_2.screen.getByText('Share');
                        react_2.fireEvent.click(shareButton);
                        return [4 /*yield*/, (0, react_2.waitFor)(function () {
                                expect(navigator.clipboard.writeText).toHaveBeenCalledWith(mockDetailedPullRequest.html_url);
                            })];
                    case 1:
                        _a.sent();
                        // Restore navigator.share
                        navigator.share = originalShare;
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('Conditional Rendering', function () {
        it('does not display description section when description is null', function () {
            var prWithoutDescription = __assign(__assign({}, mockDetailedPullRequest), { description: null });
            (0, react_2.render)(<index_1.default pullRequest={prWithoutDescription} isOpen={true} onClose={mockOnClose}/>);
            expect(react_2.screen.queryByText('Description')).not.toBeInTheDocument();
        });
        it('does not display language tag when language is null', function () {
            var prWithoutLanguage = __assign(__assign({}, mockDetailedPullRequest), { repository: __assign(__assign({}, mockDetailedPullRequest.repository), { language: null }) });
            (0, react_2.render)(<index_1.default pullRequest={prWithoutLanguage} isOpen={true} onClose={mockOnClose}/>);
            expect(react_2.screen.queryByText(/🏷️/)).not.toBeInTheDocument();
        });
        it('does not display merged timeline when not merged', function () {
            (0, react_2.render)(<index_1.default pullRequest={mockOpenPullRequest} isOpen={true} onClose={mockOnClose}/>);
            expect(react_2.screen.queryByText(/Merged:/)).not.toBeInTheDocument();
        });
        it('does not display closed timeline when not closed', function () {
            (0, react_2.render)(<index_1.default pullRequest={mockDetailedPullRequest} isOpen={true} onClose={mockOnClose}/>);
            expect(react_2.screen.queryByText(/Closed:/)).not.toBeInTheDocument();
        });
    });
    describe('Accessibility', function () {
        it('has correct ARIA attributes', function () {
            (0, react_2.render)(<index_1.default pullRequest={mockDetailedPullRequest} isOpen={true} onClose={mockOnClose}/>);
            var dialog = react_2.screen.getByRole('dialog');
            expect(dialog).toHaveAttribute('aria-modal', 'true');
            expect(dialog).toHaveAttribute('aria-labelledby', 'pr-modal-title');
        });
        it('has proper heading structure', function () {
            (0, react_2.render)(<index_1.default pullRequest={mockDetailedPullRequest} isOpen={true} onClose={mockOnClose}/>);
            var mainTitle = react_2.screen.getByRole('heading', { level: 1 });
            expect(mainTitle).toHaveAttribute('id', 'pr-modal-title');
            expect(mainTitle).toHaveTextContent(mockDetailedPullRequest.title);
            var subHeadings = react_2.screen.getAllByRole('heading', { level: 2 });
            expect(subHeadings.length).toBeGreaterThan(0);
        });
        it('has proper button labels', function () {
            (0, react_2.render)(<index_1.default pullRequest={mockDetailedPullRequest} isOpen={true} onClose={mockOnClose}/>);
            expect(react_2.screen.getByLabelText('Go back')).toBeInTheDocument();
            expect(react_2.screen.getByLabelText('Close modal')).toBeInTheDocument();
        });
    });
    describe('Styling and Layout', function () {
        it('has correct dark mode classes', function () {
            var container = (0, react_2.render)(<index_1.default pullRequest={mockDetailedPullRequest} isOpen={true} onClose={mockOnClose}/>).container;
            var modal = container.querySelector('.bg-white');
            expect(modal).toHaveClass('dark:bg-gray-800');
            var borders = container.querySelectorAll('.border-gray-200');
            borders.forEach(function (border) {
                expect(border).toHaveClass('dark:border-gray-700');
            });
        });
        it('has proper responsive classes', function () {
            var container = (0, react_2.render)(<index_1.default pullRequest={mockDetailedPullRequest} isOpen={true} onClose={mockOnClose}/>).container;
            var modal = react_2.screen.getByRole('dialog');
            expect(modal).toHaveClass('w-full');
            expect(modal).toHaveClass('max-w-full');
            expect(modal).toHaveClass('sm:max-w-2xl');
            expect(modal).toHaveClass('rounded-t-lg');
            expect(modal).toHaveClass('sm:rounded-lg');
        });
    });
    describe('Edge Cases', function () {
        it('handles empty statistics gracefully', function () {
            var prWithZeroStats = __assign(__assign({}, mockDetailedPullRequest), { commits: 0, additions: 0, deletions: 0, changed_files: 0, comments: 0 });
            expect(function () {
                (0, react_2.render)(<index_1.default pullRequest={prWithZeroStats} isOpen={true} onClose={mockOnClose}/>);
            }).not.toThrow();
            expect(react_2.screen.getByText('+0')).toBeInTheDocument();
            expect(react_2.screen.getByText('-0')).toBeInTheDocument();
        });
        it('handles missing author information gracefully', function () {
            var prWithMinimalAuthor = __assign(__assign({}, mockDetailedPullRequest), { author: {
                    login: '',
                    avatar_url: '',
                    html_url: ''
                } });
            expect(function () {
                (0, react_2.render)(<index_1.default pullRequest={prWithMinimalAuthor} isOpen={true} onClose={mockOnClose}/>);
            }).not.toThrow();
        });
        it('handles clipboard API failures gracefully', function () { return __awaiter(void 0, void 0, void 0, function () {
            var originalWriteText, copyButton;
            return __generator(this, function (_a) {
                originalWriteText = navigator.clipboard.writeText;
                navigator.clipboard.writeText = jest.fn().mockRejectedValue(new Error('Clipboard failed'));
                (0, react_2.render)(<index_1.default pullRequest={mockDetailedPullRequest} isOpen={true} onClose={mockOnClose}/>);
                copyButton = react_2.screen.getByText('Copy Link');
                expect(function () {
                    react_2.fireEvent.click(copyButton);
                }).not.toThrow();
                // Restore original
                navigator.clipboard.writeText = originalWriteText;
                return [2 /*return*/];
            });
        }); });
    });
});
