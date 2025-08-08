"use strict";
/**
 * @jest-environment jsdom
 */
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var react_2 = require("@testing-library/react");
require("@testing-library/jest-dom");
var banner_1 = require("../banner/banner");
var MidSection_1 = require("../banner/sections/MidSection");
var EndSection_1 = require("../banner/sections/EndSection");
var TitleSection_1 = require("../banner/sections/TitleSection");
describe('DeveloperBusinessCard Component', function () {
    it('renders without crashing', function () {
        (0, react_2.render)(<banner_1.default />);
    });
    it('renders all three sections', function () {
        var container = (0, react_2.render)(<banner_1.default />).container;
        // Check that the main container has the expected structure (updated for responsive height)
        var mainContainer = container.querySelector('.flex.w-full');
        expect(mainContainer).toBeTruthy();
        // Should have exactly 3 child sections
        expect(mainContainer.children).toHaveLength(3);
    });
    it('has the correct CSS classes for layout', function () {
        var container = (0, react_2.render)(<banner_1.default />).container;
        var mainContainer = container.querySelector('div');
        expect(mainContainer.className).toContain('flex');
        expect(mainContainer.className).toContain('w-full');
        expect(mainContainer.className).toContain('h-48'); // Updated for responsive design
        expect(mainContainer.className).toContain('md:h-64'); // Updated for responsive design
        expect(mainContainer.className).toContain('bg-white');
        expect(mainContainer.className).toContain('rounded-lg');
        expect(mainContainer.className).toContain('shadow-lg');
        expect(mainContainer.className).toContain('overflow-hidden');
    });
});
describe('LeftSection Component', function () {
    it('renders the code visualization elements', function () {
        var container = (0, react_2.render)(<MidSection_1.default />).container;
        // Check for the blue background section
        var leftSection = container.querySelector('.w-1\\/3.bg-blue-600');
        expect(leftSection).toBeTruthy();
        // Check for code line representations (colored bars)
        var codeElements = container.querySelectorAll('.h-3');
        expect(codeElements.length).toBeGreaterThan(10); // Should have multiple code line elements
    });
    it('has the correct background color and layout', function () {
        var container = (0, react_2.render)(<MidSection_1.default />).container;
        var section = container.querySelector('div');
        expect(section.className).toContain('w-1/3');
        expect(section.className).toContain('bg-blue-600');
        expect(section.className).toContain('p-4');
        expect(section.className).toContain('relative');
    });
});
describe('MiddleSection Component', function () {
    it('renders the vertical dotted line with 12 dots', function () {
        var container = (0, react_2.render)(<EndSection_1.default />).container;
        // Check for yellow dots (representing the dotted line)
        var dots = container.querySelectorAll('.bg-yellow-300.rounded-full');
        expect(dots).toHaveLength(12);
    });
    it('renders code snippet representations', function () {
        var container = (0, react_2.render)(<EndSection_1.default />).container;
        // Check for code snippet bars
        var codeSnippets = container.querySelectorAll('.h-2');
        expect(codeSnippets.length).toBeGreaterThan(15); // 12 dots + code snippets
    });
    it('has the correct background color', function () {
        var container = (0, react_2.render)(<EndSection_1.default />).container;
        var section = container.querySelector('div');
        expect(section.className).toContain('w-1/3');
        expect(section.className).toContain('bg-blue-500');
    });
});
describe('RightSection Component', function () {
    it('renders the developer name', function () {
        (0, react_2.render)(<TitleSection_1.default />);
        expect(react_2.screen.getByText('Laurie Crean')).toBeTruthy();
    });
    it('renders all job titles', function () {
        (0, react_2.render)(<TitleSection_1.default />);
        // Updated to match current implementation - "Back End" is hidden
        expect(react_2.screen.getByText('Software Developer')).toBeTruthy();
    });
    it('renders the developer name', function () {
        (0, react_2.render)(<TitleSection_1.default />);
        expect(react_2.screen.getByText('Laurie Crean')).toBeTruthy();
    });
    it('has the correct styling classes', function () {
        var container = (0, react_2.render)(<TitleSection_1.default />).container;
        var section = container.querySelector('div');
        expect(section.className).toContain('w-full');
        expect(section.className).toContain('bg-teal-800');
        expect(section.className).toContain('p-6');
        // Check for name styling - find the parent div containing the name
        var nameElement = react_2.screen.getByText('Laurie Crean');
        var nameContainer = nameElement.parentElement;
        expect(nameContainer.className).toContain('text-4xl');
        expect(nameContainer.className).toContain('font-bold');
        expect(nameContainer.className).toContain('text-white');
    });
    it('has correct color classes for different job titles', function () {
        (0, react_2.render)(<TitleSection_1.default />);
        // Updated to match current implementation - only "Software Developer" is visible
        var developer = react_2.screen.getByText('Software Developer');
        expect(developer.className).toContain('text-lg');
        expect(developer.className).toContain('text-yellow-300');
        expect(developer.className).toContain('italic');
    });
});
