"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
/**
 * Middle Section Component
 *
 * Displays a vertical dotted line with 12 dots and
 * horizontal code snippet representations
 */
var MiddleSection = function () {
    return (<>
      <style>
        {"\n          @keyframes expandCodeLine {\n            from { width: 0; }\n            to { width: var(--line-width); }\n          }\n          \n          @keyframes fadeInDot {\n            from { opacity: 0; transform: scale(0); }\n            to { opacity: 1; transform: scale(1); }\n          }\n          \n          .animate-dot-1 { animation: fadeInDot 0.3s ease-out 2.8s both; }\n          .animate-dot-2 { animation: fadeInDot 0.3s ease-out 2.9s both; }\n          .animate-dot-3 { animation: fadeInDot 0.3s ease-out 3s both; }\n          .animate-dot-4 { animation: fadeInDot 0.3s ease-out 3.1s both; }\n          .animate-dot-5 { animation: fadeInDot 0.3s ease-out 3.2s both; }\n          .animate-dot-6 { animation: fadeInDot 0.3s ease-out 3.3s both; }\n          .animate-dot-7 { animation: fadeInDot 0.3s ease-out 3.4s both; }\n          .animate-dot-8 { animation: fadeInDot 0.3s ease-out 3.5s both; }\n          .animate-dot-9 { animation: fadeInDot 0.3s ease-out 3.6s both; }\n          .animate-dot-10 { animation: fadeInDot 0.3s ease-out 3.7s both; }\n          .animate-dot-11 { animation: fadeInDot 0.3s ease-out 3.8s both; }\n          .animate-dot-12 { animation: fadeInDot 0.3s ease-out 3.9s both; }\n          \n          .animate-code-1 { animation: expandCodeLine 0.6s ease-out 2.4s both; --line-width: 6rem; }\n          .animate-code-2 { animation: expandCodeLine 0.6s ease-out 2.5s both; --line-width: 9rem; }\n          .animate-code-3 { animation: expandCodeLine 0.6s ease-out 2.6s both; --line-width: 4rem; }\n          .animate-code-4 { animation: expandCodeLine 0.6s ease-out 2.7s both; --line-width: 6rem; }\n          .animate-code-5 { animation: expandCodeLine 0.6s ease-out 2.8s both; --line-width: 8rem; }\n          .animate-code-6 { animation: expandCodeLine 0.6s ease-out 2.9s both; --line-width: 5rem; }\n          .animate-code-7 { animation: expandCodeLine 0.6s ease-out 3s both; --line-width: 7rem; }\n          .animate-code-8 { animation: expandCodeLine 0.6s ease-out 3.1s both; --line-width: 6rem; }\n          .animate-code-9 { animation: expandCodeLine 0.6s ease-out 3.2s both; --line-width: 8rem; }\n          .animate-code-10 { animation: expandCodeLine 0.6s ease-out 3.3s both; --line-width: 4rem; }\n          .animate-code-11 { animation: expandCodeLine 0.6s ease-out 3.4s both; --line-width: 8rem; }\n        "}
      </style>
      <div className="w-1/3 lg:w-1/2 bg-teal-600 p-4 relative hidden md:block border-6 border-teal-600 sm:hidden">
        <div className="absolute inset-0 flex flex-col justify-center items-center p-4">
          {/* Vertical dotted line with 12 squares */}
          <div className="absolute left-8 top-0 bottom-0 h-full flex flex-col justify-between py-4">
            <div className="h-2 w-2 bg-yellow-300 rounded-full animate-dot-1"></div>
            <div className="h-2 w-2 bg-yellow-300 rounded-full animate-dot-2"></div>
            <div className="h-2 w-2 bg-yellow-300 rounded-full animate-dot-3"></div>
            <div className="h-2 w-2 bg-yellow-300 rounded-full animate-dot-4"></div>
            <div className="h-2 w-2 bg-yellow-300 rounded-full animate-dot-5"></div>
            <div className="h-2 w-2 bg-yellow-300 rounded-full animate-dot-6"></div>
            <div className="h-2 w-2 bg-yellow-300 rounded-full animate-dot-7"></div>
            <div className="h-2 w-2 bg-yellow-300 rounded-full animate-dot-8"></div>
            <div className="h-2 w-2 bg-yellow-300 rounded-full animate-dot-9"></div>
            <div className="h-2 w-2 bg-yellow-300 rounded-full animate-dot-10"></div>
            <div className="h-2 w-2 bg-yellow-300 rounded-full animate-dot-11"></div>
            <div className="h-2 w-2 bg-yellow-300 rounded-full animate-dot-12"></div>
          </div>

          {/* Code snippets */}
          <div className="w-full flex flex-col space-y-3">
            <div className="h-2 bg-yellow-300 rounded ml-12 animate-code-1"></div>
            <div className="h-2 bg-yellow-300 rounded ml-12 animate-code-2"></div>
            <div className="h-2 bg-yellow-300 rounded ml-12 animate-code-3"></div>
            <div className="h-2 bg-teal-400 rounded ml-12 animate-code-4"></div>
            <div className="h-2 bg-teal-400 rounded ml-12 animate-code-5"></div>
            <div className="h-2 bg-teal-300 rounded ml-12 animate-code-6"></div>
            <div className="h-2 bg-orange-400 rounded ml-12 animate-code-7"></div>
            <div className="h-2 bg-teal-300 rounded ml-12 animate-code-8"></div>
            <div className="h-2 bg-teal-400 rounded ml-12 animate-code-9"></div>
            <div className="h-2 bg-yellow-300 rounded ml-12 animate-code-10"></div>
            <div className="h-2 bg-teal-400 rounded ml-12 animate-code-11"></div>
          </div>
        </div>
      </div>
    </>);
};
exports.default = MiddleSection;
