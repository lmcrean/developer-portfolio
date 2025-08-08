"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorState = void 0;
var react_1 = require("react");
var ErrorState = function (_a) {
    var error = _a.error;
    return (<div className="p-4 max-h-[calc(100vh-200px)] overflow-y-auto">
      <div className="text-center py-8">
        <div className="text-4xl mb-4">⚠️</div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Error Loading PR</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4">{error}</p>
        <button className="bg-blue-600 dark:bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800" onClick={function () { return window.location.reload(); }}>
          Try Again
        </button>
      </div>
    </div>);
};
exports.ErrorState = ErrorState;
exports.default = exports.ErrorState;
