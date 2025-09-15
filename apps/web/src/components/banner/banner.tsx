import React from 'react';
import TitleSection from './sections/TitleSection';

/**
 * Developer Banner Component
 *
 * A minimal banner displaying developer name and tagline
 * with typewriter animation effects
 */
const DeveloperBusinessCard: React.FC = () => {
  return (
    <div className="w-full py-8">
      <TitleSection />
    </div>
  );
};

export default DeveloperBusinessCard; 