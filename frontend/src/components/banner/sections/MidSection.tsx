import React from 'react';

/**
 * Left Section Component
 * 
 * Displays a code visualization with colored bars representing
 * lines of code in different syntax highlighting colors
 */
const LeftSection: React.FC = () => {
  return (
    <>
      <style>
        {`
          @keyframes expandLine {
            from { width: 0; }
            to { width: var(--target-width); }
          }
          
          .animate-line-1 { animation: expandLine 0.8s ease-out 1s both; --target-width: 3rem; }
          .animate-line-2 { animation: expandLine 0.8s ease-out 1.1s both; --target-width: 5rem; }
          .animate-line-3 { animation: expandLine 0.8s ease-out 1.2s both; --target-width: 2rem; }
          .animate-line-4 { animation: expandLine 0.8s ease-out 1.3s both; --target-width: 1.5rem; }
          .animate-line-5 { animation: expandLine 0.8s ease-out 1.4s both; --target-width: 2rem; }
          .animate-line-6 { animation: expandLine 0.8s ease-out 1.5s both; --target-width: 4rem; }
          .animate-line-7 { animation: expandLine 0.8s ease-out 1.6s both; --target-width: 6rem; }
          .animate-line-8 { animation: expandLine 0.8s ease-out 1.7s both; --target-width: 2.5rem; }
          .animate-line-9 { animation: expandLine 0.8s ease-out 1.8s both; --target-width: 1.5rem; }
          .animate-line-10 { animation: expandLine 0.8s ease-out 1.9s both; --target-width: 7rem; }
          .animate-line-11 { animation: expandLine 0.8s ease-out 2s both; --target-width: 1.5rem; }
          .animate-line-12 { animation: expandLine 0.8s ease-out 2.1s both; --target-width: 4rem; }
          .animate-line-13 { animation: expandLine 0.8s ease-out 2.2s both; --target-width: 2rem; }
          .animate-line-14 { animation: expandLine 0.8s ease-out 2.3s both; --target-width: 2.5rem; }
          .animate-line-15 { animation: expandLine 0.8s ease-out 2.4s both; --target-width: 2rem; }
          .animate-line-16 { animation: expandLine 0.8s ease-out 2.5s both; --target-width: 3rem; }
        `}
      </style>
      <div className="w-1/6 bg-teal-700 p-4 relative hidden md:block md:min-w-40 lg:block">
        <div className="absolute inset-0 p-6">
          {/* Code line representations */}
          <div className="flex flex-col h-full space-y-3">
            <div className="flex space-x-2">
              <div className="h-3 bg-teal-300 rounded animate-line-1"></div>
              <div className="h-3 bg-teal-300 rounded animate-line-2"></div>
              <div className="h-3 bg-orange-400 rounded animate-line-3"></div>
              <div className="h-3 bg-teal-800 rounded animate-line-4"></div>
            </div>
            <div className="flex space-x-2">
              <div className="h-3 bg-orange-400 rounded animate-line-5"></div>
              <div className="h-3 bg-teal-300 rounded animate-line-6"></div>
            </div>
            <div className="flex space-x-2">
              <div className="h-3 bg-teal-300 rounded animate-line-7"></div>
              <div className="h-3 bg-orange-400 rounded animate-line-8"></div>
            </div>
            <div className="flex space-x-2">
              <div className="h-3 bg-red-400 rounded animate-line-9"></div>
              <div className="h-3 bg-teal-300 rounded animate-line-10"></div>
            </div>
            <div className="flex space-x-2">
              <div className="h-3 bg-red-400 rounded animate-line-11"></div>
              <div className="h-3 bg-orange-400 rounded animate-line-12"></div>
            </div>
            <div className="flex space-x-2">
              <div className="h-3 bg-pink-600 rounded animate-line-13"></div>
              <div className="h-3 bg-teal-300 rounded animate-line-14"></div>
            </div>
            <div className="h-10"></div>
            <div className="flex space-x-2">
              <div className="h-3 bg-red-400 rounded animate-line-9"></div>
              <div className="h-3 bg-orange-400 rounded animate-line-15"></div>
              <div className="h-3 bg-teal-300 rounded animate-line-6"></div>
            </div>
            <div className="flex space-x-2">
              <div className="h-3 bg-pink-600 rounded animate-line-16"></div>
              <div className="h-3 bg-orange-400 rounded animate-line-7"></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LeftSection; 