"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoadingState = void 0;
var react_1 = require("react");
var LoadingState = function () {
    return (<div className="p-4 max-h-[calc(100vh-200px)] overflow-y-auto">
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-2"></div>
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
        </div>
      </div>
    </div>);
};
exports.LoadingState = LoadingState;
exports.default = exports.LoadingState;
