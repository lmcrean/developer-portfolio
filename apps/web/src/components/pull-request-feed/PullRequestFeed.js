"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PullRequestFeed = void 0;
var react_1 = require("react");
var usePullRequestState_1 = require("./hooks/usePullRequestState");
var usePullRequestApi_1 = require("./hooks/usePullRequestApi");
var LoadingErrorStates_1 = require("./components/LoadingErrorStates");
var PullRequestList_1 = require("./components/PullRequestList");
var PullRequestPagination_1 = require("./components/PullRequestPagination");
var detail_card_1 = require("./detail-card");
var PullRequestFeed = function (_a) {
    var _b = _a.username, username = _b === void 0 ? 'lmcrean' : _b, _c = _a.className, className = _c === void 0 ? '' : _c;
    // Use custom hooks for state and API management
    var state = (0, usePullRequestState_1.usePullRequestState)();
    var api = (0, usePullRequestApi_1.usePullRequestApi)({
        username: username,
        onListSuccess: state.handleListSuccess,
        onListError: state.handleListError,
        onDetailSuccess: state.handleDetailSuccess,
        onDetailError: state.handleDetailError,
        setLoading: state.setLoading,
        setModalLoading: state.setModalLoading
    });
    // Track if initial fetch has been performed
    var initialFetchRef = (0, react_1.useRef)(false);
    // Handle card click with API hook
    var handleCardClick = (0, react_1.useCallback)(function (pr) {
        api.fetchPullRequestDetails(pr);
    }, [api]);
    // Handle pagination
    var handlePageChange = (0, react_1.useCallback)(function (newPage) {
        var validPage = state.handlePageChange(newPage);
        if (validPage) {
            api.fetchPullRequests(validPage);
        }
    }, [state, api]);
    // Retry function
    var handleRetry = (0, react_1.useCallback)(function () {
        state.clearError();
        api.fetchPullRequests(state.currentPage);
    }, [api, state]);
    // Hydration-safe effect to detect client-side rendering
    (0, react_1.useEffect)(function () {
        state.setIsClient(true);
    }, [state]);
    // Initial load with proper cleanup - only run once on client side
    (0, react_1.useEffect)(function () {
        if (!state.isClient || initialFetchRef.current)
            return;
        // Mark that initial fetch is starting
        initialFetchRef.current = true;
        // Reset mounted flag on mount
        api.resetMountedFlag();
        // Fetch initial data
        api.fetchPullRequests();
        // Cleanup function
        return function () {
            api.cleanup();
        };
    }, [state.isClient]); // Only depend on isClient
    // Cleanup on unmount and username change
    (0, react_1.useEffect)(function () {
        return function () {
            api.cleanup();
        };
    }, [username, api.cleanup]); // Only depend on username and cleanup function
    // Show loading state during SSR and initial client load
    var shouldShowLoadingError = !state.isClient ||
        (state.loading && state.pullRequests.length === 0) ||
        (state.error && state.pullRequests.length === 0);
    if (shouldShowLoadingError) {
        return (<LoadingErrorStates_1.default loading={state.loading} error={state.error} pullRequestsLength={state.pullRequests.length} username={username} className={className} isClient={state.isClient} onRetry={handleRetry}/>);
    }
    return (<>
      <PullRequestList_1.default pullRequests={state.pullRequests} pagination={state.pagination} username={username} className={className} onCardClick={handleCardClick}/>

      <PullRequestPagination_1.default pagination={state.pagination} currentPage={state.currentPage} loading={state.loading} onPageChange={handlePageChange}/>

      {/* Detail Modal */}
      <detail_card_1.default pullRequest={state.selectedPR} isOpen={state.isModalOpen} onClose={state.handleModalClose} loading={state.modalLoading} error={state.modalError}/>
    </>);
};
exports.PullRequestFeed = PullRequestFeed;
exports.default = exports.PullRequestFeed;
