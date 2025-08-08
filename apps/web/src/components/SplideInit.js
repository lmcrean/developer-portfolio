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
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
// This is a client-side only component
var SplideInit = function (_a) {
    var _b = _a.testMode, testMode = _b === void 0 ? false : _b, _c = _a.onInitializeStart, onInitializeStart = _c === void 0 ? null : _c;
    var _d = (0, react_1.useState)(false), isClient = _d[0], setIsClient = _d[1];
    (0, react_1.useEffect)(function () {
        // Set client-side flag
        setIsClient(true);
    }, []);
    (0, react_1.useEffect)(function () {
        // Only run on client side
        if (!isClient)
            return;
        // Check if we're running in a browser environment
        if (typeof window === 'undefined') {
            return;
        }
        // Retry counter to avoid infinite retries
        var retryCount = 0;
        var MAX_RETRIES = 5;
        // Load Splide CSS first (if not already in your head)
        var loadSplideStyles = function () {
            if (!document.getElementById('splide-css')) {
                var link = document.createElement('link');
                link.id = 'splide-css';
                link.rel = 'stylesheet';
                link.href = 'https://cdn.jsdelivr.net/npm/@splidejs/splide@4.1.4/dist/css/splide.min.css';
                document.head.appendChild(link);
            }
        };
        // Load Splide JS
        var loadSplideScript = function () {
            return new Promise(function (resolve) {
                if (window.Splide) {
                    resolve(true);
                    return;
                }
                var script = document.createElement('script');
                script.src = 'https://cdn.jsdelivr.net/npm/@splidejs/splide@4.1.4/dist/js/splide.min.js';
                script.onload = function () {
                    resolve(true);
                };
                script.onerror = function (error) {
                    resolve(false); // Resolve with false to indicate failure
                };
                document.body.appendChild(script);
            });
        };
        // Initialize carousels
        var initializeCarousels = function () {
            // Notify for testing purposes
            if (onInitializeStart && typeof onInitializeStart === 'function') {
                onInitializeStart();
            }
            if (!window.Splide) {
                return false;
            }
            // Check if we have any carousels in the DOM
            var allCarousels = document.querySelectorAll('.splide');
            if (allCarousels.length === 0) {
                retryCount++;
                return false;
            }
            // Initialize all carousels that aren't already initialized
            var uninitializedCarousels = document.querySelectorAll('.splide:not(.is-initialized)');
            var successCount = 0;
            uninitializedCarousels.forEach(function (carousel, index) {
                try {
                    // Check if we already have a progress bar
                    var progressBar_1 = carousel.querySelector('.my-carousel-progress-bar');
                    var progressBarContainer = carousel.querySelector('.my-carousel-progress');
                    // Create progress bar if it doesn't exist
                    if (!progressBar_1) {
                        progressBarContainer = document.createElement('div');
                        progressBarContainer.className = 'my-carousel-progress';
                        progressBar_1 = document.createElement('div');
                        progressBar_1.className = 'my-carousel-progress-bar';
                        progressBarContainer.appendChild(progressBar_1);
                        carousel.appendChild(progressBarContainer);
                    }
                    var splide_1 = new window.Splide(carousel, {
                        type: 'loop',
                        perPage: 1,
                        perMove: 1,
                        gap: '1rem',
                        pagination: false, // Using custom progress bar
                        arrows: true,
                        autoplay: false,
                        arrowPath: 'm 15.5 0.932 l -4.3 4.38 l 14.5 14.6 l -14.5 14.5 l 4.3 4.4 l 14.6 -14.6 l 4.4 -4.3 l -4.4 -4.4 l -14.6 -14.6 Z',
                        speed: 400,
                    });
                    // Update the progress bar when the carousel moves
                    splide_1.on('mounted move', function () {
                        try {
                            var end = splide_1.Components.Controller.getEnd() + 1;
                            var rate = Math.min((splide_1.index + 1) / end, 1);
                            progressBar_1.style.width = String(100 * rate) + '%';
                        }
                        catch (e) {
                            // Silent error handling for progress bar updates
                        }
                    });
                    splide_1.mount();
                    successCount++;
                }
                catch (error) {
                    // Silent error handling for carousel initialization
                }
            });
            return successCount > 0;
        };
        // Execute our loading sequence
        var init = function () { return __awaiter(void 0, void 0, void 0, function () {
            var scriptLoaded, success, retryDelays_1, _loop_1, i, state_1, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 6, , 7]);
                        loadSplideStyles();
                        return [4 /*yield*/, loadSplideScript()];
                    case 1:
                        scriptLoaded = _a.sent();
                        if (!scriptLoaded) {
                            return [2 /*return*/];
                        }
                        success = initializeCarousels();
                        if (!!success) return [3 /*break*/, 5];
                        retryDelays_1 = [100, 500, 1000, 2000, 5000];
                        _loop_1 = function (i) {
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0: return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, retryDelays_1[i]); })];
                                    case 1:
                                        _b.sent();
                                        success = initializeCarousels();
                                        if (success)
                                            return [2 /*return*/, "break"];
                                        return [2 /*return*/];
                                }
                            });
                        };
                        i = 0;
                        _a.label = 2;
                    case 2:
                        if (!(i < Math.min(MAX_RETRIES, retryDelays_1.length) && retryCount < MAX_RETRIES)) return [3 /*break*/, 5];
                        return [5 /*yield**/, _loop_1(i)];
                    case 3:
                        state_1 = _a.sent();
                        if (state_1 === "break")
                            return [3 /*break*/, 5];
                        _a.label = 4;
                    case 4:
                        i++;
                        return [3 /*break*/, 2];
                    case 5: return [3 /*break*/, 7];
                    case 6:
                        error_1 = _a.sent();
                        return [3 /*break*/, 7];
                    case 7: return [2 /*return*/];
                }
            });
        }); };
        init();
        // Clean up function
        return function () {
            // We don't need to clean up carousels here since they'll be removed with the DOM
        };
    }, [isClient, testMode, onInitializeStart]);
    // This component doesn't render anything visible
    return null;
};
exports.default = SplideInit;
