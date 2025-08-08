"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModalWrapper = void 0;
var react_1 = require("react");
var ModalWrapper = function (_a) {
    var isOpen = _a.isOpen, onClose = _a.onClose, children = _a.children, _b = _a.ariaLabelledBy, ariaLabelledBy = _b === void 0 ? "modal-title" : _b;
    // Handle escape key
    (0, react_1.useEffect)(function () {
        var handleEscape = function (e) {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };
        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }
        return function () {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);
    if (!isOpen)
        return null;
    var backdropClasses = "fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center";
    var containerClasses = "w-full max-w-full sm:max-w-2xl bg-white dark:bg-gray-800 rounded-t-lg sm:rounded-lg shadow-xl transform transition-all duration-300 ease-out max-h-full overflow-hidden";
    return (<div className={backdropClasses} onClick={onClose} role="dialog" aria-modal="true" aria-labelledby={ariaLabelledBy} data-testid="pull-request-modal">
      <div className={containerClasses} onClick={function (e) { return e.stopPropagation(); }} data-testid="pull-request-detail">
        {children}
      </div>
    </div>);
};
exports.ModalWrapper = ModalWrapper;
exports.default = exports.ModalWrapper;
