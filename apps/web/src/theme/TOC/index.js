"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = TOC;
var react_1 = require("react");
var router_1 = require("@docusaurus/router");
var CustomTOC_1 = require("../../components/CustomTOC");
/**
 * Custom TOC Theme Component
 *
 * This overrides Docusaurus's default TOC behavior
 * Only renders the custom TOC on the index page
 */
function TOC() {
    var location = (0, router_1.useLocation)();
    // Only show custom TOC on the index page
    if (location.pathname === '/') {
        return <CustomTOC_1.default />;
    }
    // For all other pages (like Pull Requests), don't render any TOC
    return null;
}
