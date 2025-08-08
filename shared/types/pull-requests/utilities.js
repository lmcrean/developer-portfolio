"use strict";
// Shared utility functions for pull request data formatting
// Used by both detail and list card components
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseOwnerAndRepo = exports.truncateText = exports.getLanguageColor = exports.getTitleIcon = exports.getStatusDisplay = exports.formatAbsoluteDate = exports.getRelativeTime = void 0;
var getRelativeTime = function (dateString) {
    var date = new Date(dateString);
    var now = new Date();
    var diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (diffInSeconds < 60)
        return 'just now';
    var diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60)
        return "".concat(diffInMinutes, " min").concat(diffInMinutes !== 1 ? 's' : '', " ago");
    var diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24)
        return "".concat(diffInHours, " hour").concat(diffInHours !== 1 ? 's' : '', " ago");
    var diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7)
        return "".concat(diffInDays, " day").concat(diffInDays !== 1 ? 's' : '', " ago");
    var diffInWeeks = Math.floor(diffInDays / 7);
    return "".concat(diffInWeeks, " week").concat(diffInWeeks !== 1 ? 's' : '', " ago");
};
exports.getRelativeTime = getRelativeTime;
var formatAbsoluteDate = function (dateString) {
    if (!dateString)
        return 'Unknown date';
    var date = new Date(dateString);
    if (isNaN(date.getTime()))
        return 'Invalid date';
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
};
exports.formatAbsoluteDate = formatAbsoluteDate;
var getStatusDisplay = function (state, mergedAt, draft) {
    if (draft)
        return { emoji: '•', text: 'draft', color: 'text-gray-600 dark:text-gray-400' };
    if (mergedAt)
        return { emoji: '•', text: 'merged', color: 'text-purple-600 dark:text-purple-400' };
    if (state === 'open')
        return { emoji: '○', text: 'open', color: 'text-green-600 dark:text-green-400' };
    return { emoji: '×', text: 'closed', color: 'text-red-600 dark:text-red-400' };
};
exports.getStatusDisplay = getStatusDisplay;
var getTitleIcon = function (title) {
    if (!title)
        return '📝';
    var lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('refactor'))
        return '🔄';
    if (lowerTitle.includes('feat') || lowerTitle.includes('feature'))
        return '✨';
    if (lowerTitle.includes('fix') || lowerTitle.includes('bug'))
        return '🐛';
    if (lowerTitle.includes('doc'))
        return '📝';
    if (lowerTitle.includes('test'))
        return '🧪';
    if (lowerTitle.includes('style'))
        return '💄';
    return '📝';
};
exports.getTitleIcon = getTitleIcon;
var getLanguageColor = function (language) {
    if (!language)
        return 'bg-gray-500';
    var colors = {
        'TypeScript': 'bg-blue-600',
        'JavaScript': 'bg-yellow-400',
        'Python': 'bg-blue-500',
        'Java': 'bg-orange-600',
        'CSS': 'bg-purple-600',
        'HTML': 'bg-red-500',
        'React': 'bg-cyan-400',
        'Vue': 'bg-green-500',
    };
    return colors[language] || 'bg-gray-500';
};
exports.getLanguageColor = getLanguageColor;
var truncateText = function (text, maxLength) {
    if (!text)
        return '';
    if (text.length <= maxLength)
        return text;
    return text.substring(0, maxLength) + '...';
};
exports.truncateText = truncateText;
// copyToClipboard moved to detail-utilities.ts to avoid duplication
var parseOwnerAndRepo = function (htmlUrl) {
    var urlParts = htmlUrl.split('/');
    return {
        owner: urlParts[3],
        repo: urlParts[4]
    };
};
exports.parseOwnerAndRepo = parseOwnerAndRepo;
