"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
/**
 * Right Section Component
 *
 * Displays the developer's information including:
 * - Name
 * - Job titles/roles
 * - Website URL
 */
var RightSection = function () {
    var typewriterStyle = {
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        borderRight: '27px solid white',
        paddingRight: '2px',
        animation: 'typewriter-name 1.5s steps(12, end) 0.5s both, blink-white-caret 0.75s step-end 0.5s 2, hide-white-caret 0.1s 2s both'
    };
    var subtitleStyle = {
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        borderRight: '14px solid #fde047',
        paddingRight: '0px',
        animation: 'typewriter-subtitle 2s steps(18, end) 2s both, show-yellow-caret 0.1s 2s both, blink-yellow-caret 0.75s step-end 4s infinite'
    };
    return (<>
      <style>
        {"\n          @keyframes typewriter-name {\n            from { width: 0; }\n            to { width: 100%; }\n          }\n          \n          @keyframes typewriter-subtitle {\n            from { width: 0; }\n            to { width: 320px; }\n          }\n          \n          @keyframes blink-white-caret {\n            from, to { border-color: transparent; }\n            50% { border-color: white; }\n          }\n          \n          @keyframes blink-yellow-caret {\n            from, to { border-color: transparent; }\n            50% { border-color: #fde047; }\n          }\n          \n          @keyframes hide-white-caret {\n            to { border-color: transparent; }\n          }\n          \n          @keyframes show-yellow-caret {\n            from { border-color: transparent; }\n            to { border-color: #fde047; }\n          }\n        "}
      </style>
      <div className="w-full md:w-3/6 lg:w-1/2 md:flex-shrink-0 md:min-w-130 bg-teal-800 p-6 flex flex-col justify-center">
        <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white banner-title">
          <span className="inline-block" style={typewriterStyle}>
            Laurie Crean
          </span>
        </div>
        <div className="mt-1">
          <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl italic text-yellow-300 banner-subtitle" style={subtitleStyle}>
            <span style={{ display: 'none' }}>Software Projects and Enterprise Solutions</span>
          </div>
        </div>
      </div>
    </>);
};
exports.default = RightSection;
