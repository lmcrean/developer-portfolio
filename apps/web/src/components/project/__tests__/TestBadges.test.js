"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var react_2 = require("@testing-library/react");
var TestBadges_1 = require("../TestBadges");
describe('TestBadges', function () {
    it('renders test badges with correct URLs and formatting', function () {
        (0, react_2.render)(<TestBadges_1.default tests="vitest:303,playwright:40"/>);
        // Check if the correct number of badges are rendered
        var badges = react_2.screen.getAllByRole('img');
        expect(badges).toHaveLength(2);
        // Check Vitest badge
        var vitestBadge = react_2.screen.getByAltText('Vitest');
        expect(vitestBadge.getAttribute('src')).toBe('https://img.shields.io/badge/Vitest-303_Passed-1C1C1C?style=flat-square&logo=vitest&logoColor=white');
        // Check Playwright badge
        var playwrightBadge = react_2.screen.getByAltText('Playwright');
        expect(playwrightBadge.getAttribute('src')).toBe('https://img.shields.io/badge/Playwright-40_Passed-1C1C1C?style=flat-square&logo=playwright&logoColor=white');
    });
    it('handles whitespace in test string correctly', function () {
        (0, react_2.render)(<TestBadges_1.default tests="vitest: 303 , playwright : 40"/>);
        var badges = react_2.screen.getAllByRole('img');
        expect(badges).toHaveLength(2);
    });
    it('applies custom className', function () {
        var _a;
        var container = (0, react_2.render)(<TestBadges_1.default tests="vitest:303" className="custom-test-badges"/>).container;
        expect((_a = container.firstChild) === null || _a === void 0 ? void 0 : _a.className).toBe('custom-test-badges');
    });
    it('handles multiple test frameworks', function () {
        (0, react_2.render)(<TestBadges_1.default tests="vitest:303,playwright:40,jest:5,cypress:3,python:38,pytest:20"/>);
        var badges = react_2.screen.getAllByRole('img');
        expect(badges).toHaveLength(6);
        // Check all badges are present by finding them
        expect(react_2.screen.getByAltText('Vitest')).toBeTruthy();
        expect(react_2.screen.getByAltText('Playwright')).toBeTruthy();
        expect(react_2.screen.getByAltText('Jest')).toBeTruthy();
        expect(react_2.screen.getByAltText('Cypress')).toBeTruthy();
        expect(react_2.screen.getByAltText('Python')).toBeTruthy();
        expect(react_2.screen.getByAltText('Pytest')).toBeTruthy();
    });
    it('renders with custom colors', function () {
        (0, react_2.render)(<TestBadges_1.default tests="vitest:303" color="FF0000" logoColor="black"/>);
        var badge = react_2.screen.getByAltText('Vitest');
        expect(badge.getAttribute('src')).toBe('https://img.shields.io/badge/Vitest-303_Passed-FF0000?style=flat-square&logo=vitest&logoColor=black');
    });
    it('handles missing count gracefully', function () {
        (0, react_2.render)(<TestBadges_1.default tests="vitest,playwright:40"/>);
        var vitestBadge = react_2.screen.getByAltText('Vitest');
        expect(vitestBadge.getAttribute('src')).toBe('https://img.shields.io/badge/Vitest-0_Passed-1C1C1C?style=flat-square&logo=vitest&logoColor=white');
    });
});
