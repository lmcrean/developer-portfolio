"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MainContent = void 0;
var react_1 = require("react");
var PullRequestHeader_1 = require("./PullRequestHeader");
var PullRequestDescription_1 = require("./PullRequestDescription");
var PullRequestStats_1 = require("./PullRequestStats");
var PullRequestTimeline_1 = require("./PullRequestTimeline");
var PullRequestActions_1 = require("./PullRequestActions");
var MainContent = function (_a) {
    var pullRequest = _a.pullRequest;
    return (<div className="p-4 max-h-[calc(100vh-200px)] overflow-y-auto space-y-6">
      <PullRequestHeader_1.default pullRequest={pullRequest}/>
      <PullRequestDescription_1.default pullRequest={pullRequest}/>
      <PullRequestStats_1.default pullRequest={pullRequest}/>
      <PullRequestTimeline_1.default pullRequest={pullRequest}/>
      <PullRequestActions_1.default pullRequest={pullRequest}/>
    </div>);
};
exports.MainContent = MainContent;
exports.default = exports.MainContent;
