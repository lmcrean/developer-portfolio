"use strict";
/**
 * Simple test to verify button CSS definitions are present and correctly formatted
 */
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var path = require("path");
describe('Buttons CSS', function () {
    var cssContent;
    // Read the buttons.css file before tests
    beforeAll(function () {
        var cssPath = path.resolve(__dirname, 'buttons.css');
        cssContent = fs.readFileSync(cssPath, 'utf8');
    });
    test('buttons.css file exists and has content', function () {
        expect(cssContent).toBeDefined();
        expect(cssContent.length).toBeGreaterThan(0);
    });
    test('contains core button class definitions', function () {
        // Check for the main button classes
        expect(cssContent).toMatch(/\.code-btn/);
        expect(cssContent).toMatch(/\.readme-btn/);
        expect(cssContent).toMatch(/\.live-demo-btn/);
        expect(cssContent).toMatch(/\.figma-btn/);
    });
    test('defines button colors correctly', function () {
        // Check for color definitions (using hex colors)
        expect(cssContent).toMatch(/#[0-9a-fA-F]{6}/); // At least one hex color
        // Check for specific color classes if they exist
        expect(cssContent).toMatch(/background-color|background:/);
    });
    test('contains button hover states', function () {
        // Check for hover pseudo-classes
        expect(cssContent).toMatch(/:hover/);
    });
    test('defines button typography and spacing', function () {
        // Check for common button styling properties
        expect(cssContent).toMatch(/padding/);
        expect(cssContent).toMatch(/font-/);
    });
    test('contains button transitions for smooth interactions', function () {
        // Check for transition properties
        expect(cssContent).toMatch(/transition/);
    });
    test('defines button dimensions and layout', function () {
        // Check for sizing and layout properties
        expect(cssContent).toMatch(/width|height|min-width|min-height/);
        expect(cssContent).toMatch(/display/);
    });
    test('contains proper button cursor styles', function () {
        // Check for cursor pointer on interactive elements
        expect(cssContent).toMatch(/cursor:\s*pointer/);
    });
    test('validates CSS syntax structure', function () {
        // Basic CSS syntax validation
        var openBraces = (cssContent.match(/\{/g) || []).length;
        var closeBraces = (cssContent.match(/\}/g) || []).length;
        expect(openBraces).toBe(closeBraces); // Balanced braces
        expect(cssContent).toMatch(/;/); // Contains semicolons
    });
});
