"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PullRequestHeader = void 0;
var react_1 = require("react");
var utilities_1 = require("@shared/types/pull-requests/utilities");
var PullRequestHeader = function (_a) {
    var _b, _c, _d, _e;
    var pullRequest = _a.pullRequest;
    var status = (0, utilities_1.getStatusDisplay)(pullRequest === null || pullRequest === void 0 ? void 0 : pullRequest.state, pullRequest === null || pullRequest === void 0 ? void 0 : pullRequest.merged_at, pullRequest === null || pullRequest === void 0 ? void 0 : pullRequest.draft);
    var titleIcon = (0, utilities_1.getTitleIcon)(pullRequest === null || pullRequest === void 0 ? void 0 : pullRequest.title);
    var languageColor = (0, utilities_1.getLanguageColor)((_b = pullRequest === null || pullRequest === void 0 ? void 0 : pullRequest.repository) === null || _b === void 0 ? void 0 : _b.language);
    return (<div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <div className={"flex items-center space-x-2 ".concat(status.color, " font-medium")}>
          <span className="text-lg">{status.emoji}</span>
          <span className="capitalize">{status.text}</span>
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {(0, utilities_1.formatAbsoluteDate)((pullRequest === null || pullRequest === void 0 ? void 0 : pullRequest.merged_at) || (pullRequest === null || pullRequest === void 0 ? void 0 : pullRequest.created_at))}
        </div>
      </div>

      <div className="space-y-3">
        <h1 id="pr-modal-title" className="text-xl font-bold text-gray-900 dark:text-white leading-tight">
          <span className="text-2xl mr-2">{titleIcon}</span>
          {(pullRequest === null || pullRequest === void 0 ? void 0 : pullRequest.title) || 'Untitled'}
        </h1>
        
        <div className="flex items-center space-x-2 text-gray-700 dark:text-gray-300" data-testid="pr-author">
          <span className="text-lg">👤</span>
          <span className="font-medium">{((_c = pullRequest === null || pullRequest === void 0 ? void 0 : pullRequest.author) === null || _c === void 0 ? void 0 : _c.login) || 'Unknown'}</span>
        </div>
        
        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
          <span className="font-mono">#{(pullRequest === null || pullRequest === void 0 ? void 0 : pullRequest.number) || 'N/A'}</span>
          <span>•</span>
          <span>{((_d = pullRequest === null || pullRequest === void 0 ? void 0 : pullRequest.repository) === null || _d === void 0 ? void 0 : _d.name) || 'Unknown'}</span>
        </div>
        
        {((_e = pullRequest === null || pullRequest === void 0 ? void 0 : pullRequest.repository) === null || _e === void 0 ? void 0 : _e.language) && (<div>
            <span className={"inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-white ".concat(languageColor)}>
              🏷️ {pullRequest.repository.language}
            </span>
          </div>)}
      </div>
    </div>);
};
exports.PullRequestHeader = PullRequestHeader;
exports.default = exports.PullRequestHeader;
