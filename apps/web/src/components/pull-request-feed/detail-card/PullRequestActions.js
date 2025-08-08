"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PullRequestActions = void 0;
var react_1 = require("react");
var detail_utilities_1 = require("@shared/types/pull-requests/detail-utilities");
var PullRequestActions = function (_a) {
    var pullRequest = _a.pullRequest;
    return (<div>
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Actions</h2>
      <div className="space-y-3">
        <button className="w-full bg-blue-600 dark:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800" onClick={function () { return (pullRequest === null || pullRequest === void 0 ? void 0 : pullRequest.html_url) && window.open(pullRequest.html_url, '_blank'); }} data-testid="github-link" disabled={!(pullRequest === null || pullRequest === void 0 ? void 0 : pullRequest.html_url)}>
          View on GitHub
        </button>
        <button className="w-full bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-200 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800" onClick={function () { return (pullRequest === null || pullRequest === void 0 ? void 0 : pullRequest.html_url) && (0, detail_utilities_1.copyToClipboard)(pullRequest.html_url); }} disabled={!(pullRequest === null || pullRequest === void 0 ? void 0 : pullRequest.html_url)}>
          Copy Link
        </button>
        <button className="w-full bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-200 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800" onClick={function () { return pullRequest && (0, detail_utilities_1.shareData)(pullRequest); }} disabled={!pullRequest}>
          Share
        </button>
      </div>
    </div>);
};
exports.PullRequestActions = PullRequestActions;
exports.default = exports.PullRequestActions;
