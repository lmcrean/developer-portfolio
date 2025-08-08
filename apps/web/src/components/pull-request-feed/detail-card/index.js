"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PullRequestFeedDetailCard = void 0;
var react_1 = require("react");
var ModalWrapper_1 = require("./ModalWrapper");
var ModalHeader_1 = require("./ModalHeader");
var LoadingState_1 = require("./LoadingState");
var ErrorState_1 = require("./ErrorState");
var MainContent_1 = require("./MainContent");
var PullRequestFeedDetailCard = function (_a) {
    var pullRequest = _a.pullRequest, isOpen = _a.isOpen, onClose = _a.onClose, _b = _a.loading, loading = _b === void 0 ? false : _b, error = _a.error;
    // Early return if modal isn't open
    if (!isOpen)
        return null;
    // Show loading state if data is not yet available
    if (!pullRequest && !loading && !error) {
        return null;
    }
    // Determine content based on state
    var getContent = function () {
        if (loading) {
            return <LoadingState_1.default />;
        }
        if (error) {
            return <ErrorState_1.default error={error}/>;
        }
        if (!pullRequest) {
            return null;
        }
        return <MainContent_1.default pullRequest={pullRequest}/>;
    };
    return (<ModalWrapper_1.default isOpen={isOpen} onClose={onClose} ariaLabelledBy="pr-modal-title">
      <ModalHeader_1.default onClose={onClose}/>
      {getContent()}
    </ModalWrapper_1.default>);
};
exports.PullRequestFeedDetailCard = PullRequestFeedDetailCard;
exports.default = exports.PullRequestFeedDetailCard;
