"use strict";
/**
 * Axios HTTP client configuration
 * Simple, reliable API client using runtime configuration
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.API_BASE_URL = void 0;
var axios_1 = require("axios");
/**
 * Get API base URL from runtime configuration or fallback
 */
var getApiBaseUrl = function () {
    var _a;
    // Check for runtime configuration (generated during build)
    if (typeof window !== 'undefined' && ((_a = window.APP_CONFIG) === null || _a === void 0 ? void 0 : _a.apiBaseUrl)) {
        return window.APP_CONFIG.apiBaseUrl;
    }
    // Development fallback
    if (typeof window !== 'undefined') {
        var hostname = window.location.hostname;
        if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1') {
            return 'http://localhost:3015';
        }
    }
    // Production fallback
    return 'https://api-github-main-329000596728.us-central1.run.app';
};
exports.API_BASE_URL = getApiBaseUrl();
/**
 * Create axios instance with static base URL (determined at startup)
 */
var apiClient = axios_1.default.create({
    baseURL: exports.API_BASE_URL,
    timeout: 30000, // 30 second timeout (increased for GitHub API calls)
    headers: {
        'Content-Type': 'application/json',
    },
});
/**
 * Response interceptor for handling common response patterns
 */
apiClient.interceptors.response.use(function (response) {
    return response;
}, function (error) {
    var _a, _b, _c, _d;
    // Handle common error patterns
    if (error.code === 'ECONNABORTED') {
        error.message = 'Request timed out. Please try again.';
    }
    else if (((_a = error.response) === null || _a === void 0 ? void 0 : _a.status) === 404) {
        error.message = ((_c = (_b = error.response) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.message) || 'Resource not found.';
    }
    else if (((_d = error.response) === null || _d === void 0 ? void 0 : _d.status) >= 500) {
        error.message = 'Server error. Please try again later.';
    }
    else if (!error.response) {
        error.message = 'Network error. Please check your connection.';
    }
    return Promise.reject(error);
});
exports.default = apiClient;
