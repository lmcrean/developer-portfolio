"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var LangBadges_1 = require("./LangBadges");
var TechBadges = function (_a) {
    var values = _a.values, _b = _a.color, color = _b === void 0 ? '1C1C1C' : _b, _c = _a.logoColor, logoColor = _c === void 0 ? 'white' : _c, _d = _a.className, className = _d === void 0 ? 'tech-badges' : _d;
    // Parse the comma-separated values and remove any whitespace
    var techList = values.split(',').map(function (tech) { return tech.trim(); }).filter(function (tech) { return tech; });
    return (<div className={className}>
      <span>Technologies: </span>
      {techList.map(function (tech) {
            var _a = (0, LangBadges_1.generateBadgeUrl)(tech, color, logoColor), url = _a.url, alt = _a.alt;
            return (<img key={tech} src={url} alt={alt}/>);
        })}
    </div>);
};
exports.default = TechBadges;
