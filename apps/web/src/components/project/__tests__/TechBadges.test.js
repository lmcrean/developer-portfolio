"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var react_2 = require("@testing-library/react");
var TechBadges_1 = require("../TechBadges");
describe('TechBadges', function () {
    it('renders tech badges with correct URLs and alt text', function () {
        (0, react_2.render)(<TechBadges_1.default values="typescript,react,express"/>);
        // Check if the correct number of badges are rendered
        var badges = react_2.screen.getAllByRole('img');
        expect(badges).toHaveLength(3);
        // Check TypeScript badge
        var typescriptBadge = react_2.screen.getByAltText('Typescript');
        expect(typescriptBadge.getAttribute('src')).toBe('https://img.shields.io/badge/Typescript-1C1C1C?&logo=typescript&logoColor=white');
        // Check React badge
        var reactBadge = react_2.screen.getByAltText('React');
        expect(reactBadge.getAttribute('src')).toBe('https://img.shields.io/badge/React-1C1C1C?&logo=react&logoColor=white');
        // Check Express badge
        var expressBadge = react_2.screen.getByAltText('Express');
        expect(expressBadge.getAttribute('src')).toBe('https://img.shields.io/badge/Express-1C1C1C?&logo=express&logoColor=white');
    });
    it('handles whitespace in values correctly', function () {
        (0, react_2.render)(<TechBadges_1.default values="typescript, react , express"/>);
        var badges = react_2.screen.getAllByRole('img');
        expect(badges).toHaveLength(3);
    });
    it('applies custom className', function () {
        var _a;
        var container = (0, react_2.render)(<TechBadges_1.default values="typescript" className="custom-tech-badges"/>).container;
        expect((_a = container.firstChild) === null || _a === void 0 ? void 0 : _a.className).toBe('custom-tech-badges');
    });
    it('handles unknown technologies with fallback', function () {
        (0, react_2.render)(<TechBadges_1.default values="unknowntech"/>);
        var badge = react_2.screen.getByAltText('Unknowntech');
        expect(badge.getAttribute('src')).toBe('https://img.shields.io/badge/Unknowntech-1C1C1C?&logo=unknowntech&logoColor=white');
    });
    it('renders with custom colors', function () {
        (0, react_2.render)(<TechBadges_1.default values="typescript" color="FF0000" logoColor="black"/>);
        var badge = react_2.screen.getByAltText('Typescript');
        expect(badge.getAttribute('src')).toBe('https://img.shields.io/badge/Typescript-FF0000?&logo=typescript&logoColor=black');
    });
});
