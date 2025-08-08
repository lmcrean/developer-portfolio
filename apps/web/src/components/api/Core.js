"use strict";
/**
 * API Core Module - Main Entry Point
 *
 * Simple, reliable API module using runtime configuration.
 * Provides clean access to HTTP client and environment detection utilities.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = exports.API_BASE_URL = exports.apiClient = exports.isManualTestMode = exports.isDevelopment = void 0;
// Environment utilities (simplified)
var detection_1 = require("./environment/detection");
Object.defineProperty(exports, "isDevelopment", { enumerable: true, get: function () { return detection_1.isDevelopment; } });
Object.defineProperty(exports, "isManualTestMode", { enumerable: true, get: function () { return detection_1.isManualTestMode; } });
// HTTP client (simplified with runtime config)
var axiosClient_1 = require("./client/axiosClient");
Object.defineProperty(exports, "apiClient", { enumerable: true, get: function () { return axiosClient_1.default; } });
Object.defineProperty(exports, "API_BASE_URL", { enumerable: true, get: function () { return axiosClient_1.API_BASE_URL; } });
// Default export for backwards compatibility
var axiosClient_2 = require("./client/axiosClient");
Object.defineProperty(exports, "default", { enumerable: true, get: function () { return axiosClient_2.default; } });
