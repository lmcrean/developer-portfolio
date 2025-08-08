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
var PullRequestFeed_1 = require("../pull-request-feed/PullRequestFeed");
var Core_1 = require("../api/Core");
// Mock the API client
jest.mock('../api/Core');
var mockedApiClient = Core_1.default;
// Mock child components
jest.mock('../pull-request-feed/PullRequestFeedListCard', function () { return ({
    default: function (_a) {
        var pullRequest = _a.pullRequest, onClick = _a.onClick;
        return (<div data-testid={"pr-card-".concat(pullRequest.id)} onClick={onClick}>
      <h3>{pullRequest.title}</h3>
      <span>#{pullRequest.number}</span>
    </div>);
    }
}); });
jest.mock('../pull-request-feed/PullRequestFeedDetailCard', function () { return ({
    default: function (_a) {
        var isOpen = _a.isOpen, onClose = _a.onClose, pullRequest = _a.pullRequest;
        return (isOpen ? (<div data-testid="detail-modal" onClick={onClose}>
        <h1>{(pullRequest === null || pullRequest === void 0 ? void 0 : pullRequest.title) || 'Loading...'}</h1>
        <button onClick={onClose}>Close</button>
      </div>) : null);
    }
}); });
// Mock data
var mockPullRequestsResponse = {
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
                    html_url: 'https://github.com/lmcrean/repo1'
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
                    html_url: 'https://github.com/lmcrean/repo2'
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
var mockDetailedPRResponse = {
    data: __assign(__assign({}, mockPullRequestsResponse.data.data[0]), { updated_at: '2024-01-16T12:15:00Z', closed_at: null, draft: false, commits: 8, additions: 142, deletions: 73, changed_files: 12, comments: 5, author: {
            login: 'lmcrean',
            avatar_url: 'https://github.com/lmcrean.png',
            html_url: 'https://github.com/lmcrean'
        } })
};
describe('PullRequestFeed', function () {
    beforeEach(function () {
        jest.clearAllMocks();
    });
    afterEach(function () {
        jest.resetAllMocks();
    });
    describe('Initial Loading', function () {
        it('renders loading state initially', function () {
            mockedApiClient.get.mockImplementation(function () { return new Promise(function () { }); }); // Never resolves
            (0, react_2.render)(<PullRequestFeed_1.default />);
            expect(react_2.screen.getByText('Pull Request Activity')).toBeInTheDocument();
            expect(react_2.screen.getByText(/Loading pull requests for lmcrean/)).toBeInTheDocument();
            expect(react_2.screen.getAllByRole('generic')).toHaveLength(expect.any(Number));
        });
        it('displays loading skeletons', function () {
            mockedApiClient.get.mockImplementation(function () { return new Promise(function () { }); });
            var container = (0, react_2.render)(<PullRequestFeed_1.default />).container;
            var skeletons = container.querySelectorAll('.animate-pulse');
            expect(skeletons.length).toBeGreaterThan(0);
        });
    });
    describe('Successful Data Loading', function () {
        beforeEach(function () {
            mockedApiClient.get.mockResolvedValue(mockPullRequestsResponse);
        });
        it('displays pull requests after loading', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        (0, react_2.render)(<PullRequestFeed_1.default />);
                        return [4 /*yield*/, (0, react_2.waitFor)(function () {
                                expect(react_2.screen.getByText('feat: Add new feature')).toBeInTheDocument();
                                expect(react_2.screen.getByText('fix: Fix bug')).toBeInTheDocument();
                            })];
                    case 1:
                        _a.sent();
                        expect(react_2.screen.getByText('#123')).toBeInTheDocument();
                        expect(react_2.screen.getByText('#124')).toBeInTheDocument();
                        return [2 /*return*/];
                }
            });
        }); });
        it('displays pagination information', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        (0, react_2.render)(<PullRequestFeed_1.default />);
                        return [4 /*yield*/, (0, react_2.waitFor)(function () {
                                expect(react_2.screen.getByText('Showing 2 of 25 pull requests for lmcrean')).toBeInTheDocument();
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('calls API with correct parameters', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        (0, react_2.render)(<PullRequestFeed_1.default username="testuser"/>);
                        return [4 /*yield*/, (0, react_2.waitFor)(function () {
                                expect(mockedApiClient.get).toHaveBeenCalledWith('/api/github/pull-requests', {
                                    params: {
                                        username: 'testuser',
                                        page: 1,
                                        per_page: 20
                                    }
                                });
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('uses default username when none provided', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        (0, react_2.render)(<PullRequestFeed_1.default />);
                        return [4 /*yield*/, (0, react_2.waitFor)(function () {
                                expect(mockedApiClient.get).toHaveBeenCalledWith('/api/github/pull-requests', {
                                    params: {
                                        username: 'lmcrean',
                                        page: 1,
                                        per_page: 20
                                    }
                                });
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('Error Handling', function () {
        it('displays error message when API call fails', function () { return __awaiter(void 0, void 0, void 0, function () {
            var error;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        error = new Error('Failed to fetch');
                        mockedApiClient.get.mockRejectedValue(error);
                        (0, react_2.render)(<PullRequestFeed_1.default />);
                        return [4 /*yield*/, (0, react_2.waitFor)(function () {
                                expect(react_2.screen.getByText('Failed to Load Pull Requests')).toBeInTheDocument();
                                expect(react_2.screen.getByText('Failed to fetch')).toBeInTheDocument();
                            })];
                    case 1:
                        _a.sent();
                        expect(react_2.screen.getByText('Try Again')).toBeInTheDocument();
                        return [2 /*return*/];
                }
            });
        }); });
        it('displays fallback error message when no error message', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockedApiClient.get.mockRejectedValue({});
                        (0, react_2.render)(<PullRequestFeed_1.default />);
                        return [4 /*yield*/, (0, react_2.waitFor)(function () {
                                expect(react_2.screen.getByText('Failed to load pull requests.')).toBeInTheDocument();
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('retries API call when Try Again is clicked', function () { return __awaiter(void 0, void 0, void 0, function () {
            var error;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        error = new Error('Network error');
                        mockedApiClient.get.mockRejectedValueOnce(error)
                            .mockResolvedValue(mockPullRequestsResponse);
                        (0, react_2.render)(<PullRequestFeed_1.default />);
                        return [4 /*yield*/, (0, react_2.waitFor)(function () {
                                expect(react_2.screen.getByText('Try Again')).toBeInTheDocument();
                            })];
                    case 1:
                        _a.sent();
                        react_2.fireEvent.click(react_2.screen.getByText('Try Again'));
                        return [4 /*yield*/, (0, react_2.waitFor)(function () {
                                expect(react_2.screen.getByText('feat: Add new feature')).toBeInTheDocument();
                            })];
                    case 2:
                        _a.sent();
                        expect(mockedApiClient.get).toHaveBeenCalledTimes(2);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('Pagination', function () {
        beforeEach(function () {
            mockedApiClient.get.mockResolvedValue(mockPullRequestsResponse);
        });
        it('displays pagination controls when multiple pages exist', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        (0, react_2.render)(<PullRequestFeed_1.default />);
                        return [4 /*yield*/, (0, react_2.waitFor)(function () {
                                expect(react_2.screen.getByText('Previous')).toBeInTheDocument();
                                expect(react_2.screen.getByText('Next')).toBeInTheDocument();
                                expect(react_2.screen.getByText('Page 1 of 2')).toBeInTheDocument();
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('disables Previous button on first page', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        (0, react_2.render)(<PullRequestFeed_1.default />);
                        return [4 /*yield*/, (0, react_2.waitFor)(function () {
                                var previousButton = react_2.screen.getByText('Previous').closest('button');
                                expect(previousButton).toBeDisabled();
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('enables Next button when has_next_page is true', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        (0, react_2.render)(<PullRequestFeed_1.default />);
                        return [4 /*yield*/, (0, react_2.waitFor)(function () {
                                var nextButton = react_2.screen.getByText('Next').closest('button');
                                expect(nextButton).not.toBeDisabled();
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('calls API with correct page when Next is clicked', function () { return __awaiter(void 0, void 0, void 0, function () {
            var page2Response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        page2Response = __assign(__assign({}, mockPullRequestsResponse), { data: __assign(__assign({}, mockPullRequestsResponse.data), { meta: __assign(__assign({}, mockPullRequestsResponse.data.meta), { pagination: __assign(__assign({}, mockPullRequestsResponse.data.meta.pagination), { page: 2, has_next_page: false, has_previous_page: true }) }) }) });
                        mockedApiClient.get.mockResolvedValueOnce(mockPullRequestsResponse)
                            .mockResolvedValueOnce(page2Response);
                        (0, react_2.render)(<PullRequestFeed_1.default />);
                        return [4 /*yield*/, (0, react_2.waitFor)(function () {
                                expect(react_2.screen.getByText('Next')).toBeInTheDocument();
                            })];
                    case 1:
                        _a.sent();
                        react_2.fireEvent.click(react_2.screen.getByText('Next'));
                        return [4 /*yield*/, (0, react_2.waitFor)(function () {
                                expect(mockedApiClient.get).toHaveBeenCalledWith('/api/github/pull-requests', {
                                    params: {
                                        username: 'lmcrean',
                                        page: 2,
                                        per_page: 20
                                    }
                                });
                            })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('does not display pagination for single page', function () { return __awaiter(void 0, void 0, void 0, function () {
            var singlePageResponse;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        singlePageResponse = __assign(__assign({}, mockPullRequestsResponse), { data: __assign(__assign({}, mockPullRequestsResponse.data), { meta: __assign(__assign({}, mockPullRequestsResponse.data.meta), { pagination: {
                                        page: 1,
                                        per_page: 20,
                                        total_count: 2,
                                        total_pages: 1,
                                        has_next_page: false,
                                        has_previous_page: false
                                    } }) }) });
                        mockedApiClient.get.mockResolvedValue(singlePageResponse);
                        (0, react_2.render)(<PullRequestFeed_1.default />);
                        return [4 /*yield*/, (0, react_2.waitFor)(function () {
                                expect(react_2.screen.getByText('feat: Add new feature')).toBeInTheDocument();
                            })];
                    case 1:
                        _a.sent();
                        expect(react_2.screen.queryByText('Previous')).not.toBeInTheDocument();
                        expect(react_2.screen.queryByText('Next')).not.toBeInTheDocument();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('Modal Interactions', function () {
        beforeEach(function () {
            mockedApiClient.get.mockResolvedValueOnce(mockPullRequestsResponse)
                .mockResolvedValueOnce(mockDetailedPRResponse);
        });
        it('opens modal when PR card is clicked', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        (0, react_2.render)(<PullRequestFeed_1.default />);
                        return [4 /*yield*/, (0, react_2.waitFor)(function () {
                                expect(react_2.screen.getByTestId('pr-card-1')).toBeInTheDocument();
                            })];
                    case 1:
                        _a.sent();
                        react_2.fireEvent.click(react_2.screen.getByTestId('pr-card-1'));
                        return [4 /*yield*/, (0, react_2.waitFor)(function () {
                                expect(react_2.screen.getByTestId('detail-modal')).toBeInTheDocument();
                            })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('fetches detailed PR data when card is clicked', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        (0, react_2.render)(<PullRequestFeed_1.default />);
                        return [4 /*yield*/, (0, react_2.waitFor)(function () {
                                expect(react_2.screen.getByTestId('pr-card-1')).toBeInTheDocument();
                            })];
                    case 1:
                        _a.sent();
                        react_2.fireEvent.click(react_2.screen.getByTestId('pr-card-1'));
                        return [4 /*yield*/, (0, react_2.waitFor)(function () {
                                expect(mockedApiClient.get).toHaveBeenCalledWith('/api/github/pull-requests/lmcrean/repo1/123');
                            })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('closes modal when close is clicked', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        (0, react_2.render)(<PullRequestFeed_1.default />);
                        return [4 /*yield*/, (0, react_2.waitFor)(function () {
                                expect(react_2.screen.getByTestId('pr-card-1')).toBeInTheDocument();
                            })];
                    case 1:
                        _a.sent();
                        react_2.fireEvent.click(react_2.screen.getByTestId('pr-card-1'));
                        return [4 /*yield*/, (0, react_2.waitFor)(function () {
                                expect(react_2.screen.getByTestId('detail-modal')).toBeInTheDocument();
                            })];
                    case 2:
                        _a.sent();
                        react_2.fireEvent.click(react_2.screen.getByText('Close'));
                        return [4 /*yield*/, (0, react_2.waitFor)(function () {
                                expect(react_2.screen.queryByTestId('detail-modal')).not.toBeInTheDocument();
                            })];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('handles modal API errors gracefully', function () { return __awaiter(void 0, void 0, void 0, function () {
            var detailError;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        detailError = new Error('Failed to load details');
                        mockedApiClient.get.mockResolvedValueOnce(mockPullRequestsResponse)
                            .mockRejectedValueOnce(detailError);
                        (0, react_2.render)(<PullRequestFeed_1.default />);
                        return [4 /*yield*/, (0, react_2.waitFor)(function () {
                                expect(react_2.screen.getByTestId('pr-card-1')).toBeInTheDocument();
                            })];
                    case 1:
                        _a.sent();
                        react_2.fireEvent.click(react_2.screen.getByTestId('pr-card-1'));
                        // Modal should still open even if detail fetch fails
                        return [4 /*yield*/, (0, react_2.waitFor)(function () {
                                expect(react_2.screen.getByTestId('detail-modal')).toBeInTheDocument();
                            })];
                    case 2:
                        // Modal should still open even if detail fetch fails
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('Custom Props', function () {
        beforeEach(function () {
            mockedApiClient.get.mockResolvedValue(mockPullRequestsResponse);
        });
        it('applies custom className', function () { return __awaiter(void 0, void 0, void 0, function () {
            var container, feedContainer;
            return __generator(this, function (_a) {
                container = (0, react_2.render)(<PullRequestFeed_1.default className="custom-class"/>).container;
                feedContainer = container.querySelector('.custom-class');
                expect(feedContainer).toBeInTheDocument();
                return [2 /*return*/];
            });
        }); });
        it('uses custom username in API call', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        (0, react_2.render)(<PullRequestFeed_1.default username="customuser"/>);
                        return [4 /*yield*/, (0, react_2.waitFor)(function () {
                                expect(mockedApiClient.get).toHaveBeenCalledWith('/api/github/pull-requests', {
                                    params: {
                                        username: 'customuser',
                                        page: 1,
                                        per_page: 20
                                    }
                                });
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('displays custom username in header', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        (0, react_2.render)(<PullRequestFeed_1.default username="customuser"/>);
                        return [4 /*yield*/, (0, react_2.waitFor)(function () {
                                expect(react_2.screen.getByText(/pull requests for customuser/)).toBeInTheDocument();
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('Loading States During Pagination', function () {
        it('shows loading indicator during pagination', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockedApiClient.get.mockResolvedValueOnce(mockPullRequestsResponse)
                            .mockImplementation(function () { return new Promise(function () { }); }); // Never resolves
                        (0, react_2.render)(<PullRequestFeed_1.default />);
                        return [4 /*yield*/, (0, react_2.waitFor)(function () {
                                expect(react_2.screen.getByText('Next')).toBeInTheDocument();
                            })];
                    case 1:
                        _a.sent();
                        react_2.fireEvent.click(react_2.screen.getByText('Next'));
                        return [4 /*yield*/, (0, react_2.waitFor)(function () {
                                expect(react_2.screen.getByText('Loading...')).toBeInTheDocument();
                            })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('disables pagination buttons during loading', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockedApiClient.get.mockResolvedValueOnce(mockPullRequestsResponse)
                            .mockImplementation(function () { return new Promise(function () { }); });
                        (0, react_2.render)(<PullRequestFeed_1.default />);
                        return [4 /*yield*/, (0, react_2.waitFor)(function () {
                                expect(react_2.screen.getByText('Next')).toBeInTheDocument();
                            })];
                    case 1:
                        _a.sent();
                        react_2.fireEvent.click(react_2.screen.getByText('Next'));
                        return [4 /*yield*/, (0, react_2.waitFor)(function () {
                                var nextButton = react_2.screen.getByText('Next').closest('button');
                                var previousButton = react_2.screen.getByText('Previous').closest('button');
                                expect(nextButton).toBeDisabled();
                                expect(previousButton).toBeDisabled();
                            })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('Edge Cases', function () {
        it('handles empty response gracefully', function () { return __awaiter(void 0, void 0, void 0, function () {
            var emptyResponse;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        emptyResponse = {
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
                        (0, react_2.render)(<PullRequestFeed_1.default />);
                        return [4 /*yield*/, (0, react_2.waitFor)(function () {
                                expect(react_2.screen.getByText('Showing 0 of 0 pull requests for lmcrean')).toBeInTheDocument();
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('handles malformed API response', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockedApiClient.get.mockResolvedValue({ data: null });
                        (0, react_2.render)(<PullRequestFeed_1.default />);
                        return [4 /*yield*/, (0, react_2.waitFor)(function () {
                                expect(react_2.screen.getByText(/Failed to load/)).toBeInTheDocument();
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
