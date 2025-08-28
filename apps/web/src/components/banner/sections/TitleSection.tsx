import React from 'react';

/**
 * Right Section Component
 * 
 * Displays the developer's information including:
 * - Name
 * - Job titles/roles
 * - Website URL
 */
const RightSection: React.FC = () => {
  const typewriterStyle = {
    overflow: 'hidden',
    whiteSpace: 'nowrap' as const,
    borderRight: '27px solid white',
    paddingRight: '2px',
    animation: 'typewriter-name 1.5s steps(12, end) 0.5s both, blink-white-caret 0.75s step-end 0.5s 2, hide-white-caret 0.1s 2s both'
  };

  const subtitleStyle = {
    overflow: 'hidden',
    whiteSpace: 'nowrap' as const,
    borderRight: '14px solid #fde047',
    paddingRight: '0px',
    animation: 'typewriter-subtitle 2s steps(18, end) 2s both, show-yellow-caret 0.1s 2s both, blink-yellow-caret 0.75s step-end 4s infinite'
  };

  return (
    <>
      <style>
        {`
          @keyframes typewriter-name {
            from { width: 0; }
            to { width: 100%; }
          }
          
          @keyframes typewriter-subtitle {
            from { width: 0; }
            to { width: 320px; }
          }
          
          @keyframes blink-white-caret {
            from, to { border-color: transparent; }
            50% { border-color: white; }
          }
          
          @keyframes blink-yellow-caret {
            from, to { border-color: transparent; }
            50% { border-color: #fde047; }
          }
          
          @keyframes hide-white-caret {
            to { border-color: transparent; }
          }
          
          @keyframes show-yellow-caret {
            from { border-color: transparent; }
            to { border-color: #fde047; }
          }
          
          /* Override animation for viewports less than 400px */
          @media (max-width: 399px) {
            .typewriter-name-container {
              animation: blink-white-caret 0.75s step-end 0.5s 2, hide-white-caret 0.1s 2s both !important;
              width: 100% !important;
            }
          }
        `}
      </style>
      <div className="w-full md:w-3/6 lg:w-1/2 md:flex-shrink-0 md:min-w-130 bg-teal-800 p-6 flex flex-col justify-center">
        <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white banner-title">
          <span className="inline-block typewriter-name-container" style={typewriterStyle}>
            Laurie Crean
          </span>
        </div>
        <div className="mt-1">
          <div 
            className="text-lg sm:text-xl md:text-2xl lg:text-3xl italic text-yellow-300 banner-subtitle"
            style={subtitleStyle}
          >
            <span style={{ display: 'none' }}>Software Projects and Enterprise Solutions</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default RightSection;
