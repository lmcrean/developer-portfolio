"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModalHeader = void 0;
var react_1 = require("react");
var ModalHeader = function (_a) {
    var onClose = _a.onClose;
    return (<div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 sticky top-0 z-10">
      <button className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors" onClick={onClose} aria-label="Go back" data-testid="close-modal">
        <span>←</span>
        <span className="font-medium">Back</span>
      </button>
      <button className="w-8 h-8 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 text-xl transition-colors" onClick={onClose} aria-label="Close modal" data-testid="modal-close-x">
        ×
      </button>
    </div>);
};
exports.ModalHeader = ModalHeader;
exports.default = exports.ModalHeader;
