"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var tocItems = [
    { id: 'dottie', title: 'Dottie', level: 2 },
    { id: 'odyssey', title: 'Odyssey', level: 2 },
    { id: 'coach-matrix', title: 'Coach Matrix', level: 2 },
    { id: 'steam-report', title: 'Steam Report', level: 2 },
    { id: 'laurie-crean', title: 'Developer Portfolio', level: 2 },
];
/**
 * Custom Table of Contents Component
 *
 * Provides navigation for all projects including those using TypewriterTitle components
 */
var CustomTOC = function () {
    var _a = (0, react_1.useState)(''), activeItem = _a[0], setActiveItem = _a[1];
    var scrollToElement = function (id) {
        var element = document.getElementById(id);
        if (element) {
            var elementPosition = element.offsetTop;
            var offsetPosition = elementPosition - 40; // 40px offset to ensure heading is visible
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
            setActiveItem(id);
        }
    };
    // Track which section is currently in view using scroll events
    (0, react_1.useEffect)(function () {
        var handleScroll = function () {
            var _a;
            var scrollPosition = window.scrollY + 60; // 60px offset for better detection
            // Find all sections and their positions
            var sectionPositions = tocItems.map(function (item) {
                var element = document.getElementById(item.id);
                if (!element)
                    return null;
                return {
                    id: item.id,
                    offsetTop: element.offsetTop,
                    offsetBottom: element.offsetTop + element.offsetHeight
                };
            }).filter(Boolean);
            // Find the section that contains the current scroll position
            var currentSection = (_a = sectionPositions[0]) === null || _a === void 0 ? void 0 : _a.id; // default to first section
            for (var _i = 0, sectionPositions_1 = sectionPositions; _i < sectionPositions_1.length; _i++) {
                var section = sectionPositions_1[_i];
                if (scrollPosition >= section.offsetTop) {
                    currentSection = section.id;
                }
                else {
                    break;
                }
            }
            setActiveItem(currentSection || '');
        };
        // Set initial active item
        handleScroll();
        // Add scroll listener
        window.addEventListener('scroll', handleScroll, { passive: true });
        // Also check after TypewriterTitle components have time to render
        var delayedCheck = setTimeout(handleScroll, 1000);
        var delayedCheck2 = setTimeout(handleScroll, 3000);
        return function () {
            window.removeEventListener('scroll', handleScroll);
            clearTimeout(delayedCheck);
            clearTimeout(delayedCheck2);
        };
    }, []);
    return (<div className="table-of-contents mt-7">
      <div className="table-of-contents__title">On this page</div>
      <ul className="table-of-contents__list">
        {tocItems.map(function (item) { return (<li key={item.id} className="table-of-contents__item">
            <a href={"#".concat(item.id)} className={"table-of-contents__link ".concat(activeItem === item.id ? 'table-of-contents__link--active' : '')} onClick={function (e) {
                e.preventDefault();
                scrollToElement(item.id);
            }} data-level={item.level}>
              {item.title}
            </a>
          </li>); })}
      </ul>
    </div>);
};
exports.default = CustomTOC;
