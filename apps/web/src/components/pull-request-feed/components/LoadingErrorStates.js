"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoadingErrorStates = void 0;
var react_1 = require("react");
var LoadingErrorStates = function (_a) {
    var loading = _a.loading, error = _a.error, pullRequestsLength = _a.pullRequestsLength, username = _a.username, className = _a.className, isClient = _a.isClient, onRetry = _a.onRetry;
    // Show loading state during SSR and initial client load
    if (!isClient || (loading && pullRequestsLength === 0)) {
        return (<div className={"w-full max-w-4xl mx-auto p-4 ".concat(className)} data-testid="pull-request-feed">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Pull Request Activity</h2>
          <p className="text-gray-600 dark:text-gray-300">
            {!isClient ? 'Initializing...' : "Loading pull requests for ".concat(username, "...")}
          </p>
        </div>
        <div className="space-y-4">
          {Array.from({ length: 3 }, function (_, index) { return (<div key={index} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 animate-pulse">
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              </div>
            </div>); })}
        </div>
      </div>);
    }
    // Error state
    if (error && pullRequestsLength === 0) {
        return (<div className={"w-full max-w-4xl mx-auto p-4 ".concat(className)} data-testid="pull-request-feed">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Pull Request Activity</h2>
          <p className="text-gray-600 dark:text-gray-300">Error loading pull requests</p>
        </div>
        <div className="bg-white dark:bg-gray-800 border border-red-200 dark:border-red-800 rounded-lg p-8 text-center">
          <div className="text-4xl mb-4">⚠️</div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Failed to Load Pull Requests</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">{error}</p>
          <button className="bg-blue-600 dark:bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800" onClick={onRetry}>
            Try Again
          </button>
        </div>
      </div>);
    }
    return null;
};
exports.LoadingErrorStates = LoadingErrorStates;
exports.default = exports.LoadingErrorStates;
