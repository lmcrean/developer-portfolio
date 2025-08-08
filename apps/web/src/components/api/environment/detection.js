"use strict";
/**
 * Environment detection utilities
 * Simple, reliable environment detection
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.isDevelopment = exports.isManualTestMode = void 0;
/**
 * Manual test mode detection
 * Checks if the app is running in manual test mode via URL or window object
 */
var isManualTestMode = function () {
    if (typeof window !== 'undefined') {
        // Check URL parameters for test mode
        var urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('test') === 'true') {
            return true;
        }
        // Check for test environment flag
        if (window.__TEST_MODE__) {
            return true;
        }
    }
    return false;
};
exports.isManualTestMode = isManualTestMode;
/**
 * Development mode detection
 * Determines if the app is running in development mode (localhost)
 */
var isDevelopment = function () {
    if (typeof window !== 'undefined') {
        var hostname = window.location.hostname;
        return hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1';
    }
    return false;
};
exports.isDevelopment = isDevelopment;
