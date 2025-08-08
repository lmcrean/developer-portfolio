"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var banner_1 = require("../components/banner/banner");
/**
 * Banner Test Page Component
 *
 * A simple page to preview and test the DeveloperBusinessCard banner component
 */
var BannerTest = function () {
    return (<div className="p-8 min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-6">Banner Component Preview</h1>
      <div className="max-w-4xl mx-auto">
        <banner_1.default />
      </div>
    </div>);
};
exports.default = BannerTest;
