"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var Layout_1 = require("@theme-original/Layout");
var Head_1 = require("@docusaurus/Head");
var LayoutWrapper = function (props) {
    return (<>
      <Head_1.default>
        <link rel="icon" href="https://raw.githubusercontent.com/lmcrean/lauriecrean_nextjs/refs/heads/main/docs/favicon-v2.ico" type="image/x-icon"/>
        <link rel="shortcut icon" href="https://raw.githubusercontent.com/lmcrean/lauriecrean_nextjs/refs/heads/main/docs/favicon-v2.ico" type="image/x-icon"/>
      </Head_1.default>
      <Layout_1.default {...props}/>
    </>);
};
exports.default = LayoutWrapper;
