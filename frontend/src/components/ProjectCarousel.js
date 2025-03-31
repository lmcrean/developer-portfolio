import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import '../css/projectCarousel.css';
import projectCarousels from '../data/projectCarousels';

/**
 * ProjectCarousel Component
 * 
 * Renders a project carousel for the given project key
 * 
 * @param {Object} props
 * @param {string} props.projectKey - Key of the project from projectCarousels data
 * @returns {JSX.Element} The rendered carousel
 */
const ProjectCarousel = ({ projectKey }) => {
  const splideRef = useRef(null);
  // Get slides from project carousels data
  const slides = projectCarousels[projectKey]?.slides || [];
  const carouselId = projectCarousels[projectKey]?.id || `project-carousel-${projectKey}`;
  
  useEffect(() => {
    // Only run if we have slides and a valid DOM element
    if (slides.length === 0 || !splideRef.current) {
      console.log(`[ProjectCarousel] No slides found for ${projectKey} or no DOM element`);
      return;
    }

    console.log(`[ProjectCarousel] Initializing carousel for ${projectKey} with id ${carouselId}`);
    
    // Function to initialize Splide
    const initSplide = () => {
      if (splideRef.current) {
        // Only initialize if not already initialized
        if (!splideRef.current.classList.contains('is-initialized')) {
          console.log(`[ProjectCarousel] Starting initialization for ${carouselId}`);
          
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
              console.log(`[ProjectCarousel] Successfully mounted ${carouselId}`);
            } catch (e) {
              console.error(`[ProjectCarousel] Error initializing Splide for ${carouselId}:`, e.message);
            }
          } else {
            console.warn(`[ProjectCarousel] Splide not available in window for ${carouselId}`);
          }
        } else {
          console.log(`[ProjectCarousel] ${carouselId} already initialized`);
        }
      }
    };
    
    // Try initialization with increasing delays to ensure DOM and scripts are loaded
    initSplide();
    const timeouts = [100, 500, 1000, 2000].map(delay => 
      setTimeout(() => {
        console.log(`[ProjectCarousel] Retry initialization after ${delay}ms for ${carouselId}`);
        initSplide();
      }, delay)
    );
    
    // Cleanup function
    return () => {
      timeouts.forEach(clearTimeout);
      if (splideRef.current && splideRef.current.classList.contains('is-initialized')) {
        console.log(`[ProjectCarousel] Cleaning up ${carouselId}`);
        // If there's a stored instance, we could clean it up properly
      }
    };
  }, [projectKey, carouselId, slides]);

  // Don't render if no slides
  if (!slides || slides.length === 0) {
    console.log(`[ProjectCarousel] No slides found for ${projectKey}, not rendering`);
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

ProjectCarousel.propTypes = {
  projectKey: PropTypes.string.isRequired
};

export default ProjectCarousel; 