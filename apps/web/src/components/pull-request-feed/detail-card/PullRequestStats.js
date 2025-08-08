"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PullRequestStats = void 0;
var react_1 = require("react");
var PullRequestStats = function (_a) {
    var pullRequest = _a.pullRequest;
    return (<div>
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Stats</h2>
      <div className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-2" data-testid="pr-additions">
            <span className="text-lg">📊</span>
            <span className="text-sm text-gray-700 dark:text-gray-300">
              <span className="text-green-600 dark:text-green-400 font-medium">+{(pullRequest === null || pullRequest === void 0 ? void 0 : pullRequest.additions) || 0}</span>
              {' '}
              <span className="text-red-600 dark:text-red-400 font-medium" data-testid="pr-deletions">-{(pullRequest === null || pullRequest === void 0 ? void 0 : pullRequest.deletions) || 0}</span>
              {' '}changes
            </span>
          </div>
          <div className="flex items-center space-x-2" data-testid="pr-changed-files">
            <span className="text-lg">📁</span>
            <span className="text-sm text-gray-700 dark:text-gray-300">{(pullRequest === null || pullRequest === void 0 ? void 0 : pullRequest.changed_files) || 0} files changed</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-lg">💬</span>
            <span className="text-sm text-gray-700 dark:text-gray-300">{(pullRequest === null || pullRequest === void 0 ? void 0 : pullRequest.comments) || 0} comments</span>
          </div>
          <div className="flex items-center space-x-2" data-testid="pr-commits">
            <span className="text-lg">✅</span>
            <span className="text-sm text-gray-700 dark:text-gray-300">{(pullRequest === null || pullRequest === void 0 ? void 0 : pullRequest.commits) || 0} commits</span>
          </div>
        </div>
      </div>
    </div>);
};
exports.PullRequestStats = PullRequestStats;
exports.default = exports.PullRequestStats;
