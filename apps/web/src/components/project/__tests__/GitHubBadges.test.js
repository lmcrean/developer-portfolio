"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var react_2 = require("@testing-library/react");
var GitHubBadges_1 = require("../GitHubBadges");
describe('GitHubBadges', function () {
    it('renders GitHub badges with correct URLs', function () {
        (0, react_2.render)(<GitHubBadges_1.default repo="lmcrean/dottie" badges="last-commit,created-at"/>);
        // Check if the correct number of badges are rendered
        var badges = react_2.screen.getAllByRole('img');
        expect(badges).toHaveLength(2);
        // Check last-commit badge (should be wrapped in a link)
        var lastCommitBadge = react_2.screen.getByAltText('Last Commit');
        expect(lastCommitBadge.getAttribute('src')).toBe('https://img.shields.io/github/last-commit/lmcrean/dottie?color=1C1C1C');
        // Check created-at badge (should not be wrapped in a link)
        var createdAtBadge = react_2.screen.getByAltText('Created at');
        expect(createdAtBadge.getAttribute('src')).toBe('https://img.shields.io/github/created-at/lmcrean/dottie?color=1C1C1C');
    });
    it('wraps badges with links when appropriate', function () {
        (0, react_2.render)(<GitHubBadges_1.default repo="lmcrean/dottie" badges="last-commit,commit-activity"/>);
        // Check that last-commit badge is wrapped in a link
        var lastCommitLink = react_2.screen.getByRole('link', { name: /last commit/i });
        expect(lastCommitLink.getAttribute('href')).toBe('https://github.com/lmcrean/dottie/');
        expect(lastCommitLink.getAttribute('target')).toBe('_blank');
        expect(lastCommitLink.getAttribute('rel')).toBe('noopener noreferrer');
        // Check that commit-activity badge is wrapped in a link
        var commitActivityLink = react_2.screen.getByRole('link', { name: /commit activity/i });
        expect(commitActivityLink.getAttribute('href')).toBe('https://github.com/lmcrean/dottie/commits/main');
    });
    it('handles all badge types correctly', function () {
        (0, react_2.render)(<GitHubBadges_1.default repo="lmcrean/test-repo" badges="last-commit,created-at,commit-activity,issues,issues-closed,issues-pr,issues-pr-closed"/>);
        var badges = react_2.screen.getAllByRole('img');
        expect(badges).toHaveLength(7);
        // Check all badges are present
        expect(react_2.screen.getByAltText('Last Commit')).toBeTruthy();
        expect(react_2.screen.getByAltText('Created at')).toBeTruthy();
        expect(react_2.screen.getByAltText('Commit Activity')).toBeTruthy();
        expect(react_2.screen.getByAltText('Issues')).toBeTruthy();
        expect(react_2.screen.getByAltText('Issues Closed')).toBeTruthy();
        // Note: issues-pr and issues-pr-closed both have the same alt text
        var prBadges = react_2.screen.getAllByAltText('GitHub Issues or Pull Requests');
        expect(prBadges).toHaveLength(2);
    });
    it('applies custom className', function () {
        var _a;
        var container = (0, react_2.render)(<GitHubBadges_1.default repo="lmcrean/dottie" badges="last-commit" className="custom-github-badges"/>).container;
        expect((_a = container.firstChild) === null || _a === void 0 ? void 0 : _a.className).toBe('custom-github-badges');
    });
    it('handles custom color', function () {
        (0, react_2.render)(<GitHubBadges_1.default repo="lmcrean/dottie" badges="last-commit" color="FF0000"/>);
        var badge = react_2.screen.getByAltText('Last Commit');
        expect(badge.getAttribute('src')).toBe('https://img.shields.io/github/last-commit/lmcrean/dottie?color=FF0000');
    });
    it('handles whitespace in badges string', function () {
        (0, react_2.render)(<GitHubBadges_1.default repo="lmcrean/dottie" badges=" last-commit , created-at "/>);
        var badges = react_2.screen.getAllByRole('img');
        expect(badges).toHaveLength(2);
    });
    it('handles unknown badge types gracefully', function () {
        // Mock console.warn to avoid test output pollution
        var consoleSpy = jest.spyOn(console, 'warn').mockImplementation(function () { });
        (0, react_2.render)(<GitHubBadges_1.default repo="lmcrean/dottie" badges="unknown-badge,last-commit"/>);
        // Should only render the known badge
        var badges = react_2.screen.getAllByRole('img');
        expect(badges).toHaveLength(1);
        expect(react_2.screen.getByAltText('Last Commit')).toBeTruthy();
        // Should log warning for unknown badge
        expect(consoleSpy).toHaveBeenCalledWith('Unknown GitHub badge type: unknown-badge');
        consoleSpy.mockRestore();
    });
});
