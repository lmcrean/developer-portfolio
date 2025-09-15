import React from 'react';

/**
 * Title Section Component
 *
 * Displays the developer's name with smooth letter-by-letter fade animation
 */
const TitleSection: React.FC = () => {
  const name = "Laurie Crean";
  const letters = name.split('');

  return (
    <>
      <style>
        {`


          @keyframes fadeInLetter {
            from {
              opacity: 0;
              filter: blur(3px);
            }
            to {
              opacity: 0.9;
              filter: blur(0.5);
            }
          }

          .letter-animate {
            font-family: 'funnel display';
            opacity: 0;
            display: inline-block;
            animation: fadeInLetter 0.6s ease-out forwards;
            font-weight:300;
          }

          /* Stagger the animation for each letter */
          .letter-0 { animation-delay: 0.1s; }
          .letter-1 { animation-delay: 0.2s; }
          .letter-2 { animation-delay: 0.3s; }
          .letter-3 { animation-delay: 0.4s; }
          .letter-4 { animation-delay: 0.5s; }
          .letter-5 { animation-delay: 0.6s; }
          .letter-6 { animation-delay: 0.7s; }
          .letter-7 { animation-delay: 0.8s; }
          .letter-8 { animation-delay: 0.9s; }
          .letter-9 { animation-delay: 1.0s; }
          .letter-10 { animation-delay: 1.1s; }
          .letter-11 { animation-delay: 1.2s; }

          /* Preserve spaces */
          .letter-space {
            width: 0.3em;
            display: inline-block;
          }

          /* Responsive adjustments */
          @media (max-width: 640px) {
            .name-title {
              font-size: 2.5rem !important;
            }
          }

          @media (min-width: 641px) and (max-width: 768px) {
            .name-title {
              font-size: 4rem !important;
            }
          }

          @media (min-width: 769px) {
            .name-title {
              font-size: 5rem !important;
            }
          }
        `}
      </style>
      <div className="text-center space-y-4">
        <h1 className="name-title text-6xl sm:text-7xl md:text-8xl font-bold text-gray-900 dark:text-white">
          {letters.map((letter, index) => (
            letter === ' ' ? (
              <span key={index} className="letter-space"></span>
            ) : (
              <span
                key={index}
                className={`letter-animate letter-${index}`}
              >
                {letter}
              </span>
            )
          ))}
        </h1>
        <div className="text-xl sm:text-2xl md:text-3xl italic text-gray-600 dark:text-amber-400">
        </div>
      </div>
    </>
  );
};

export default TitleSection;
