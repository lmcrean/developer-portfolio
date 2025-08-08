"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usePullRequestState = void 0;
var react_1 = require("react");
var usePullRequestState = function () {
    // SSR-safe hydration check
    var _a = (0, react_1.useState)(false), isClient = _a[0], setIsClient = _a[1];
    // List state
    var _b = (0, react_1.useState)([]), pullRequests = _b[0], setPullRequests = _b[1];
    var _c = (0, react_1.useState)(false), loading = _c[0], setLoading = _c[1];
    var _d = (0, react_1.useState)(null), error = _d[0], setError = _d[1];
    var _e = (0, react_1.useState)(null), pagination = _e[0], setPagination = _e[1];
    var _f = (0, react_1.useState)(1), currentPage = _f[0], setCurrentPage = _f[1];
    // Modal state
    var _g = (0, react_1.useState)(null), selectedPR = _g[0], setSelectedPR = _g[1];
    var _h = (0, react_1.useState)(false), modalLoading = _h[0], setModalLoading = _h[1];
    var _j = (0, react_1.useState)(null), modalError = _j[0], setModalError = _j[1];
    var _k = (0, react_1.useState)(false), isModalOpen = _k[0], setIsModalOpen = _k[1];
    // Handlers for list operations
    var handleListSuccess = (0, react_1.useCallback)(function (data, paginationData) {
        setPullRequests(data);
        setPagination(paginationData);
        setCurrentPage(paginationData.page);
    }, []);
    var handleListError = (0, react_1.useCallback)(function (errorMessage) {
        setError(errorMessage);
    }, []);
    // Handlers for detail operations
    var handleDetailSuccess = (0, react_1.useCallback)(function (data) {
        setSelectedPR(data);
        setIsModalOpen(true);
    }, []);
    var handleDetailError = (0, react_1.useCallback)(function (errorMessage) {
        setModalError(errorMessage);
        setIsModalOpen(true);
    }, []);
    // Modal management
    var handleModalClose = (0, react_1.useCallback)(function () {
        setIsModalOpen(false);
        setSelectedPR(null);
        setModalError(null);
        setModalLoading(false);
    }, []);
    // Pagination
    var handlePageChange = (0, react_1.useCallback)(function (newPage) {
        if (pagination && newPage >= 1 && newPage <= pagination.total_pages) {
            return newPage;
        }
        return null;
    }, [pagination]);
    // Retry function
    var clearError = (0, react_1.useCallback)(function () {
        setError(null);
    }, []);
    return {
        // State
        isClient: isClient,
        pullRequests: pullRequests,
        loading: loading,
        error: error,
        pagination: pagination,
        currentPage: currentPage,
        selectedPR: selectedPR,
        modalLoading: modalLoading,
        modalError: modalError,
        isModalOpen: isModalOpen,
        // Setters
        setIsClient: setIsClient,
        setLoading: setLoading,
        setModalLoading: setModalLoading,
        // Handlers
        handleListSuccess: handleListSuccess,
        handleListError: handleListError,
        handleDetailSuccess: handleDetailSuccess,
        handleDetailError: handleDetailError,
        handleModalClose: handleModalClose,
        handlePageChange: handlePageChange,
        clearError: clearError
    };
};
exports.usePullRequestState = usePullRequestState;
