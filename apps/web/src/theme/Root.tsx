import React, { useEffect, useState } from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import SplideInit from '../components/SplideInit';

interface RootProps {
  children: React.ReactNode;
}

// Default implementation, that you can customize
const Root: React.FC<RootProps> = ({children}) => {
  // Sync Docusaurus theme with Tailwind dark mode
  useEffect(() => {
    const syncDarkMode = () => {
      // Check if Docusaurus is in dark mode
      const isDarkMode = document.documentElement.getAttribute('data-theme') === 'dark';
      
      // Sync with Tailwind's dark mode class
      if (isDarkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    };

    // Initial sync
    syncDarkMode();

    // Watch for theme changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
          syncDarkMode();
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme']
    });

    return () => observer.disconnect();
  }, []);

  return (
    <>
      {children}
      <BrowserOnly>
        {() => <SplideInit />}
      </BrowserOnly>
    </>
  );
};

export default Root; 