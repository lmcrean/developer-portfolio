import React, { useEffect, useRef } from 'react';
import '../../css/projectCarousel.css';
import projectCarousels from '../../data/projectCarousels';

interface ProjectCarouselProps {
  projectKey: string;
  slides?: { src: string; alt: string }[];
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

/**
 * ProjectCarousel Component
 * 
 * Renders a project carousel for the given project key
 */
const ProjectCarousel: React.FC<ProjectCarouselProps> = ({ projectKey, slides: propSlides }) => {
  const splideRef = useRef<HTMLDivElement>(null);
  // Get slides from project carousels data or use passed slides
  const slides = propSlides || projectCarousels[projectKey]?.slides || [];
  const carouselId = projectCarousels[projectKey]?.id || `project-carousel-${projectKey}`;
  
  useEffect(() => {    
    // Function to initialize Splide
    const initSplide = () => {
      if (splideRef.current) {
        // Only initialize if not already initialized
        if (!splideRef.current.classList.contains('is-initialized')) {

          // Check if Splide is available in the window
          if (typeof window !== 'undefined' && window.Splide) {
            try {
              const splide = new window.Splide(splideRef.current, {
                type: 'loop',
                perPage: 1,
                autoplay: false,
                pauseOnHover: true,
                interval: 5000,
                pagination: true,
                arrows: true,
                height: 'auto',
                gap: '1rem',
              });
              
              // Add progress bar element manually if needed
              const progressBarContainer = document.createElement('div');
              progressBarContainer.className = 'my-carousel-progress';
              const progressBar = document.createElement('div');
              progressBar.className = 'my-carousel-progress-bar';
              progressBarContainer.appendChild(progressBar);
              splideRef.current.appendChild(progressBarContainer);
              
              // Update progress bar on carousel movement
              splide.on('mounted move', function() {
                try {
                  const end = splide.Components.Controller.getEnd() + 1;
                  const rate = Math.min((splide.index + 1) / end, 1);
                  progressBar.style.width = String(100 * rate) + '%';
                } catch (e) {
                  console.error(`[ProjectCarousel] Error updating progress bar: ${e.message}`);
                }
              });
              
              splide.mount();
            } catch (e) {
              console.error(`[ProjectCarousel] Error initializing Splide for ${carouselId}:`, e.message);
            }
          } else {
            console.warn(`[ProjectCarousel] Splide not available in window for ${carouselId}`);
          }
        }
      }
    };
    
    // Try initialization with increasing delays to ensure DOM and scripts are loaded
    initSplide();
    const timeouts = [100, 500, 1000, 2000].map(delay => 
      setTimeout(() => {
        initSplide();
      }, delay)
    );
    
    // Cleanup function
    return () => {
      timeouts.forEach(clearTimeout);
      if (splideRef.current && splideRef.current.classList.contains('is-initialized')) {
        // If there's a stored instance, we could clean it up properly
      }
    };
  }, [projectKey, carouselId, slides]);

  // Don't render if no slides
  if (!slides || slides.length === 0) {
    return null;
  }

  return (
    <div className="splide-container">
      <div 
        className="splide" 
        ref={splideRef}
        id={carouselId}
        data-splide-initialized="false"
      >
        <div className="splide__track">
          <ul className="splide__list">
            {slides.map((slide, index) => (
              <li key={`${projectKey}-slide-${index}`} className="splide__slide">
                <img 
                  src={slide.src} 
                  alt={slide.alt || `${projectKey} screenshot ${index + 1}`}
                  className="project-image"
                  loading="lazy"
                />
              </li>
            ))}
          </ul>
        </div>
        {/* Progress bar will be added by the JS */}
      </div>
    </div>
  );
};

export default ProjectCarousel; 