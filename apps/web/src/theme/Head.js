"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var Head_1 = require("@docusaurus/Head");
// This component will extend the default Head component of Docusaurus
var HeadCustom = function (props) {
    return (<>
      <Head_1.default {...props}>
        {/* Explicitly add the favicon from GitHub */}
        <link rel="icon" href="https://raw.githubusercontent.com/lmcrean/lauriecrean_nextjs/refs/heads/main/docs/favicon-v2.ico" type="image/x-icon"/>
        <link rel="shortcut icon" href="https://raw.githubusercontent.com/lmcrean/lauriecrean_nextjs/refs/heads/main/docs/favicon-v2.ico" type="image/x-icon"/>
      </Head_1.default>
    </>);
};
exports.default = HeadCustom;
