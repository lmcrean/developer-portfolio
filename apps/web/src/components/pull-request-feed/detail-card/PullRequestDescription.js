"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PullRequestDescription = void 0;
var react_1 = require("react");
var PullRequestDescription = function (_a) {
    var pullRequest = _a.pullRequest;
    if (!(pullRequest === null || pullRequest === void 0 ? void 0 : pullRequest.description))
        return null;
    return (<div>
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Description</h2>
      <div className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
        <div className="prose prose-sm max-w-none">
          {pullRequest.description.split('\n').map(function (line, index) { return (<p key={index} className="mb-2 last:mb-0 text-gray-700 dark:text-gray-300 leading-relaxed">
              {line || '\u00A0'}
            </p>); })}
        </div>
      </div>
    </div>);
};
exports.PullRequestDescription = PullRequestDescription;
exports.default = exports.PullRequestDescription;
