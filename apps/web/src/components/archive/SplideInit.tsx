import React, { useEffect, useState } from 'react';

interface SplideInitProps {
  testMode?: boolean;
  onInitializeStart?: (() => void) | null;
}

interface SplideInstance {
  index: number;
  Components: {
    Controller: {
      getEnd(): number;
    };
  };
  on(event: string, callback: () => void): void;
  mount(): void;
}

declare global {
  interface Window {
    Splide?: new (element: HTMLElement, options: any) => SplideInstance;
  }
}

// This is a client-side only component
const SplideInit: React.FC<SplideInitProps> = ({ testMode = false, onInitializeStart = null }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Set client-side flag
    setIsClient(true);
  }, []);

  useEffect(() => {
    // Only run on client side
    if (!isClient) return;

    // Check if we're running in a browser environment
    if (typeof window === 'undefined') {
      return;
    }

    // Retry counter to avoid infinite retries
    let retryCount = 0;
    const MAX_RETRIES = 5;

    // Load Splide CSS first (if not already in your head)
    const loadSplideStyles = () => {
      if (!document.getElementById('splide-css')) {
        const link = document.createElement('link');
        link.id = 'splide-css';
        link.rel = 'stylesheet';
        link.href = 'https://cdn.jsdelivr.net/npm/@splidejs/splide@4.1.4/dist/css/splide.min.css';
        document.head.appendChild(link);
      }
    };

    // Load Splide JS
    const loadSplideScript = () => {
      return new Promise((resolve) => {
        if (window.Splide) {
          resolve(true);
          return;
        }

        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/@splidejs/splide@4.1.4/dist/js/splide.min.js';
        script.onload = () => {
          resolve(true);
        };
        script.onerror = (error) => {
          resolve(false); // Resolve with false to indicate failure
        };
        document.body.appendChild(script);
      });
    };

    // Initialize carousels
    const initializeCarousels = () => {
      // Notify for testing purposes
      if (onInitializeStart && typeof onInitializeStart === 'function') {
        onInitializeStart();
      }
      
      if (!window.Splide) {
        return false;
      }
      
      // Check if we have any carousels in the DOM
      const allCarousels = document.querySelectorAll('.splide');
      
      if (allCarousels.length === 0) {
        retryCount++;
        return false;
      }
      
      // Initialize all carousels that aren't already initialized
      const uninitializedCarousels = document.querySelectorAll('.splide:not(.is-initialized)');
      
      let successCount = 0;
      
      uninitializedCarousels.forEach((carousel, index) => {
        try {
          // Check if we already have a progress bar
          let progressBar = carousel.querySelector('.my-carousel-progress-bar') as HTMLElement;
          let progressBarContainer = carousel.querySelector('.my-carousel-progress') as HTMLElement;
          
          // Create progress bar if it doesn't exist
          if (!progressBar) {
            progressBarContainer = document.createElement('div');
            progressBarContainer.className = 'my-carousel-progress';
            progressBar = document.createElement('div');
            progressBar.className = 'my-carousel-progress-bar';
            progressBarContainer.appendChild(progressBar);
            carousel.appendChild(progressBarContainer);
          }
          
          const splide = new window.Splide(carousel as HTMLElement, {
            type: 'loop',
            perPage: 1,
            perMove: 1,
            gap: '1rem',
            pagination: false, // Using custom progress bar
            arrows: true,
            autoplay: false,
            arrowPath: 'm 15.5 0.932 l -4.3 4.38 l 14.5 14.6 l -14.5 14.5 l 4.3 4.4 l 14.6 -14.6 l 4.4 -4.3 l -4.4 -4.4 l -14.6 -14.6 Z',
            speed: 400,
          });

          // Update the progress bar when the carousel moves
          splide.on('mounted move', function () {
            try {
              const end = splide.Components.Controller.getEnd() + 1;
              const rate = Math.min((splide.index + 1) / end, 1);
              progressBar.style.width = String(100 * rate) + '%';
            } catch (e) {
              // Silent error handling for progress bar updates
            }
          });

          splide.mount();
          successCount++;
        } catch (error) {
          // Silent error handling for carousel initialization
        }
      });
      
      return successCount > 0;
    };

    // Execute our loading sequence
    const init = async () => {
      try {
        loadSplideStyles();
        const scriptLoaded = await loadSplideScript();
        
        if (!scriptLoaded) {
          return;
        }
        
        // Try initialization immediately
        let success = initializeCarousels();
        
        // If not successful, retry with exponential backoff
        if (!success) {
          const retryDelays = [100, 500, 1000, 2000, 5000];
          
          for (let i = 0; i < Math.min(MAX_RETRIES, retryDelays.length) && retryCount < MAX_RETRIES; i++) {
            await new Promise(resolve => setTimeout(resolve, retryDelays[i]));
            success = initializeCarousels();
            if (success) break;
          }
        }
      } catch (error) {
        // Silent error handling for initialization
      }
    };

    init();

    // Clean up function
    return () => {
      // We don't need to clean up carousels here since they'll be removed with the DOM
    };
  }, [isClient, testMode, onInitializeStart]);

  // This component doesn't render anything visible
  return null;
};

export default SplideInit; 