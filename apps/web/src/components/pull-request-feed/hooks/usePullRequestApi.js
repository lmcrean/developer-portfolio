"use strict";
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.usePullRequestApi = void 0;
var react_1 = require("react");
var Core_1 = require("../../api/Core");
var utilities_1 = require("@shared/types/pull-requests/utilities");
var usePullRequestApi = function (_a) {
    var username = _a.username, onListSuccess = _a.onListSuccess, onListError = _a.onListError, onDetailSuccess = _a.onDetailSuccess, onDetailError = _a.onDetailError, setLoading = _a.setLoading, setModalLoading = _a.setModalLoading;
    // Refs for request cancellation
    var listAbortControllerRef = (0, react_1.useRef)(null);
    var detailAbortControllerRef = (0, react_1.useRef)(null);
    var isMountedRef = (0, react_1.useRef)(true);
    // Fetch pull requests list with proper cancellation
    var fetchPullRequests = (0, react_1.useCallback)(function () {
        var args_1 = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args_1[_i] = arguments[_i];
        }
        return __awaiter(void 0, __spreadArray([], args_1, true), void 0, function (page) {
            var response, err_1;
            var _a;
            if (page === void 0) { page = 1; }
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, 3, 4]);
                        // Cancel any existing request
                        if (listAbortControllerRef.current) {
                            listAbortControllerRef.current.abort();
                        }
                        // Create new abort controller
                        listAbortControllerRef.current = new AbortController();
                        setLoading(true);
                        onListError('');
                        console.log("\uD83D\uDD04 Fetching pull requests page ".concat(page, " for ").concat(username, "..."));
                        return [4 /*yield*/, Core_1.default.get('/api/github/pull-requests', {
                                params: {
                                    username: username,
                                    page: page,
                                    per_page: 20
                                },
                                signal: listAbortControllerRef.current.signal
                            })];
                    case 1:
                        response = _b.sent();
                        // Only update state if component is still mounted
                        if (isMountedRef.current && !listAbortControllerRef.current.signal.aborted) {
                            console.log("\u2705 Successfully fetched ".concat(response.data.data.length, " pull requests"));
                            onListSuccess(response.data.data, response.data.meta.pagination);
                        }
                        return [3 /*break*/, 4];
                    case 2:
                        err_1 = _b.sent();
                        // Only handle errors if component is still mounted and request wasn't cancelled
                        if (isMountedRef.current && err_1.name !== 'AbortError' && err_1.name !== 'CanceledError') {
                            console.error('❌ Request Failed:', ((_a = err_1.config) === null || _a === void 0 ? void 0 : _a.url) || 'Unknown URL');
                            onListError(err_1.message || 'Failed to load pull requests.');
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        // Only update loading state if component is still mounted
                        if (isMountedRef.current) {
                            setLoading(false);
                        }
                        return [7 /*endfinally*/];
                    case 4: return [2 /*return*/];
                }
            });
        });
    }, [username, onListSuccess, onListError, setLoading]);
    // Handle card click - fetch PR details
    var fetchPullRequestDetails = (0, react_1.useCallback)(function (pr) { return __awaiter(void 0, void 0, void 0, function () {
        var _a, owner, repo, response, prData, err_2;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    setModalLoading(true);
                    onDetailError('');
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, 4, 5]);
                    // Cancel any existing detail request
                    if (detailAbortControllerRef.current) {
                        detailAbortControllerRef.current.abort();
                    }
                    // Create new abort controller
                    detailAbortControllerRef.current = new AbortController();
                    _a = (0, utilities_1.parseOwnerAndRepo)(pr.html_url), owner = _a.owner, repo = _a.repo;
                    console.log("\uD83D\uDD04 Fetching details for PR #".concat(pr.number, " from ").concat(owner, "/").concat(repo, "..."));
                    return [4 /*yield*/, Core_1.default.get("/api/github/pull-requests/".concat(owner, "/").concat(repo, "/").concat(pr.number), {
                            signal: detailAbortControllerRef.current.signal
                        })];
                case 2:
                    response = _b.sent();
                    // Only update state if component is still mounted
                    if (isMountedRef.current && !detailAbortControllerRef.current.signal.aborted) {
                        prData = response.data.data;
                        console.log("\u2705 Successfully fetched details for PR #".concat(pr.number));
                        // Ensure all required fields are present
                        if (prData && prData.title && prData.author) {
                            onDetailSuccess(prData);
                        }
                        else {
                            console.error('❌ Incomplete PR data received:', prData);
                            onDetailError('Incomplete pull request data received from server.');
                        }
                    }
                    return [3 /*break*/, 5];
                case 3:
                    err_2 = _b.sent();
                    // Only handle errors if component is still mounted and request wasn't cancelled
                    if (isMountedRef.current && err_2.name !== 'AbortError' && err_2.name !== 'CanceledError') {
                        console.error('Error fetching PR details:', err_2);
                        onDetailError(err_2.message || 'Failed to load pull request details.');
                    }
                    return [3 /*break*/, 5];
                case 4:
                    // Only update loading state if component is still mounted
                    if (isMountedRef.current) {
                        setModalLoading(false);
                    }
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); }, [onDetailSuccess, onDetailError, setModalLoading]);
    // Cleanup function
    var cleanup = (0, react_1.useCallback)(function () {
        console.log('🧹 API hook cleaning up requests...');
        // Mark component as unmounted
        isMountedRef.current = false;
        // Cancel any in-flight requests
        if (listAbortControllerRef.current) {
            listAbortControllerRef.current.abort();
        }
        if (detailAbortControllerRef.current) {
            detailAbortControllerRef.current.abort();
        }
    }, []);
    // Reset mounted flag
    var resetMountedFlag = (0, react_1.useCallback)(function () {
        isMountedRef.current = true;
    }, []);
    // Memoize the return object to prevent unnecessary re-renders
    return (0, react_1.useMemo)(function () { return ({
        fetchPullRequests: fetchPullRequests,
        fetchPullRequestDetails: fetchPullRequestDetails,
        cleanup: cleanup,
        resetMountedFlag: resetMountedFlag
    }); }, [fetchPullRequests, fetchPullRequestDetails, cleanup, resetMountedFlag]);
};
exports.usePullRequestApi = usePullRequestApi;
