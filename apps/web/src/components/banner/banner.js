"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var MidSection_1 = require("./sections/MidSection");
var EndSection_1 = require("./sections/EndSection");
var TitleSection_1 = require("./sections/TitleSection");
/**
 * Developer Business Card Banner Component
 *
 * A three-section banner component displaying a developer's information:
 * - Left: Code visualization with colored bars
 * - Middle: Vertical dots and code snippets
 * - Right: Developer name, titles, and website
 */
var DeveloperBusinessCard = function () {
    return (<div className="flex w-full h-48 md:h-64 bg-black rounded-lg shadow-lg overflow-hidden mb-10">
      <TitleSection_1.default />
      <MidSection_1.default />
      <EndSection_1.default />
    </div>);
};
exports.default = DeveloperBusinessCard;
