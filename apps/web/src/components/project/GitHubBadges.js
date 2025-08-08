"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var GITHUB_BADGE_CONFIGS = {
    'last-commit': {
        type: 'last-commit',
        alt: 'Last Commit',
        shieldPath: 'last-commit',
        linkPath: ''
    },
    'created-at': {
        type: 'created-at',
        alt: 'Created at',
        shieldPath: 'created-at'
    },
    'commit-activity': {
        type: 'commit-activity',
        alt: 'Commit Activity',
        shieldPath: 'commit-activity/t',
        linkPath: 'commits/main'
    },
    'issues': {
        type: 'issues',
        alt: 'Issues',
        shieldPath: 'issues',
        linkPath: 'issues-open'
    },
    'issues-closed': {
        type: 'issues-closed',
        alt: 'Issues Closed',
        shieldPath: 'issues-closed',
        linkPath: 'issues'
    },
    'issues-pr': {
        type: 'issues-pr',
        alt: 'GitHub Issues or Pull Requests',
        shieldPath: 'issues-pr',
        linkPath: 'pulls'
    },
    'issues-pr-closed': {
        type: 'issues-pr-closed',
        alt: 'GitHub Issues or Pull Requests',
        shieldPath: 'issues-pr-closed',
        linkPath: 'pulls'
    },
    'stars': {
        type: 'stars',
        alt: 'GitHub Stars',
        shieldPath: 'stars',
        linkPath: 'stargazers'
    },
    'contributors': {
        type: 'contributors',
        alt: 'GitHub Contributors',
        shieldPath: 'contributors',
        linkPath: 'graphs/contributors'
    },
    'contributors-anon': {
        type: 'contributors-anon',
        alt: 'GitHub Contributors (Anonymous)',
        shieldPath: 'contributors-anon',
        linkPath: 'graphs/contributors'
    }
};
var GitHubBadges = function (_a) {
    var repo = _a.repo, badges = _a.badges, _b = _a.color, color = _b === void 0 ? '1C1C1C' : _b, _c = _a.style, style = _c === void 0 ? 'flat' : _c, _d = _a.className, className = _d === void 0 ? 'github-badges' : _d;
    var badgeTypes = badges.split(',').map(function (badge) { return badge.trim(); }).filter(function (badge) { return badge; });
    var generateBadgeUrl = function (shieldPath) {
        return "https://img.shields.io/github/".concat(shieldPath, "/").concat(repo, "?color=").concat(color, "&style=").concat(style);
    };
    var generateLinkUrl = function (linkPath) {
        return "https://github.com/".concat(repo, "/").concat(linkPath);
    };
    return (<div className={className}>
      <span>Github: </span>
      {badgeTypes.map(function (badgeType) {
            var config = GITHUB_BADGE_CONFIGS[badgeType];
            if (!config) {
                console.warn("Unknown GitHub badge type: ".concat(badgeType));
                return null;
            }
            var badgeUrl = generateBadgeUrl(config.shieldPath);
            var imgElement = (<img src={badgeUrl} alt={config.alt} key={badgeType}/>);
            // If badge has a link path, wrap in anchor tag
            if (config.linkPath !== undefined) {
                var linkUrl = generateLinkUrl(config.linkPath);
                return (<a href={linkUrl} key={badgeType} target="_blank" rel="noopener noreferrer">
              {imgElement}
            </a>);
            }
            return imgElement;
        })}
    </div>);
};
exports.default = GitHubBadges;
