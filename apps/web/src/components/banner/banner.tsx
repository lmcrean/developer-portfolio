import React from 'react';
import MidSection from './sections/MidSection';
import EndSection from './sections/EndSection';
import TitleSection from './sections/TitleSection';

/**
 * Developer Business Card Banner Component
 * 
 * A three-section banner component displaying a developer's information:
 * - Left: Code visualization with colored bars
 * - Middle: Vertical dots and code snippets  
 * - Right: Developer name, titles, and website
 */
const DeveloperBusinessCard: React.FC = () => {
  return (
    <div className="flex w-full h-48 md:h-64 bg-black rounded-lg shadow-lg overflow-hidden">
      <TitleSection />
      <MidSection />
      <EndSection />
    </div>
  );
};

export default DeveloperBusinessCard; 