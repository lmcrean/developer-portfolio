"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var BrowserOnly_1 = require("@docusaurus/BrowserOnly");
var SplideInit_1 = require("../components/SplideInit");
// Default implementation, that you can customize
var Root = function (_a) {
    var children = _a.children;
    return (<>
      {children}
      <BrowserOnly_1.default>
        {function () { return <SplideInit_1.default />; }}
      </BrowserOnly_1.default>
    </>);
};
exports.default = Root;
