"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PullRequestTimeline = void 0;
var react_1 = require("react");
var utilities_1 = require("@shared/types/pull-requests/utilities");
var PullRequestTimeline = function (_a) {
    var pullRequest = _a.pullRequest;
    return (<div>
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Timeline</h2>
      <div className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center py-1">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Created:</span>
            <span className="text-sm text-gray-600 dark:text-gray-400">{(0, utilities_1.formatAbsoluteDate)(pullRequest === null || pullRequest === void 0 ? void 0 : pullRequest.created_at)}</span>
          </div>
          <div className="flex justify-between items-center py-1">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Updated:</span>
            <span className="text-sm text-gray-600 dark:text-gray-400">{(0, utilities_1.formatAbsoluteDate)(pullRequest === null || pullRequest === void 0 ? void 0 : pullRequest.updated_at)}</span>
          </div>
          {(pullRequest === null || pullRequest === void 0 ? void 0 : pullRequest.merged_at) && (<div className="flex justify-between items-center py-1">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Merged:</span>
              <span className="text-sm text-gray-600 dark:text-gray-400">{(0, utilities_1.formatAbsoluteDate)(pullRequest.merged_at)}</span>
            </div>)}
          {(pullRequest === null || pullRequest === void 0 ? void 0 : pullRequest.closed_at) && !(pullRequest === null || pullRequest === void 0 ? void 0 : pullRequest.merged_at) && (<div className="flex justify-between items-center py-1">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Closed:</span>
              <span className="text-sm text-gray-600 dark:text-gray-400">{(0, utilities_1.formatAbsoluteDate)(pullRequest.closed_at)}</span>
            </div>)}
        </div>
      </div>
    </div>);
};
exports.PullRequestTimeline = PullRequestTimeline;
exports.default = exports.PullRequestTimeline;
