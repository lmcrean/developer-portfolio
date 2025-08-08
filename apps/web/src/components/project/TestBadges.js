"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var TEST_FRAMEWORK_LOGOS = {
    vitest: 'vitest',
    playwright: 'playwright',
    jest: 'jest',
    cypress: 'cypress',
    python: 'python',
    pytest: 'pytest',
};
var parseTestString = function (tests) {
    return tests.split(',')
        .map(function (test) { return test.trim(); })
        .filter(function (test) { return test; })
        .map(function (test) {
        var _a = test.split(':'), framework = _a[0], count = _a[1];
        var logo = TEST_FRAMEWORK_LOGOS[framework.toLowerCase()] || framework.toLowerCase();
        return {
            framework: framework.charAt(0).toUpperCase() + framework.slice(1),
            count: count || '0',
            logo: logo
        };
    });
};
var TestBadges = function (_a) {
    var tests = _a.tests, _b = _a.color, color = _b === void 0 ? '1C1C1C' : _b, _c = _a.logoColor, logoColor = _c === void 0 ? 'white' : _c, _d = _a.className, className = _d === void 0 ? 'test-badges' : _d;
    var testBadges = parseTestString(tests);
    return (<div className={className}>
      <span>Testing: </span>
      {testBadges.map(function (test, index) {
            var badgeText = "".concat(test.framework, "-").concat(test.count, "_Passed");
            var url = "https://img.shields.io/badge/".concat(badgeText, "-").concat(color, "?style=flat-square&logo=").concat(test.logo, "&logoColor=").concat(logoColor);
            return (<img key={"".concat(test.framework, "-").concat(index)} src={url} alt={test.framework}/>);
        })}
    </div>);
};
exports.default = TestBadges;
