import React from 'react';
import ProjectCarousel from '../archive/ProjectCarousel';
import SplideInit from '../archive/SplideInit';

/**
 * Example component showing how to use the ProjectCarousel component
 */
const CarouselExample: React.FC = () => {
  return (
    <div className="carousel-examples">
      <h2>Project Carousels</h2>
      
      <h3>Odyssey Project</h3>
      <ProjectCarousel projectKey="odyssey" />
      
      <h3>Coach Matrix Project</h3>
      <ProjectCarousel projectKey="coachmatrix" />
      
      <h3>Buffalo Project</h3>
      <ProjectCarousel projectKey="buffalo" />
      
      <h3>Retrolympics Rush Project</h3>
      <ProjectCarousel projectKey="retrolympics" />
      
      <h3>Wealth Quest Project</h3>
      <ProjectCarousel projectKey="wealthquest" />
      
      {/* The SplideInit component needs to be included once in your app */}
      <SplideInit />
    </div>
  );
};

export default CarouselExample; 