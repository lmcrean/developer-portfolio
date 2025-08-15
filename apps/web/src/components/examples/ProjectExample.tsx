import React from 'react';
import Project from '../archive/Project';
import projects from '../../data/projects';
import SplideInit from '../archive/SplideInit';

/**
 * Example component showing how to use the Project component
 */
const ProjectExample: React.FC = () => {
  return (
    <div className="project-examples">
      <h2>Project Examples</h2>
      
      <div className="project-grid">
        {/* Display specific projects */}
        <Project projectData={projects.odyssey} />
        <Project projectData={projects.buffalo} />
      </div>
      
      <h3>All Projects</h3>
      <div className="project-grid">
        {/* Map through all projects */}
        {Object.values(projects).map(projectData => (
          <Project key={projectData.id} projectData={projectData} />
        ))}
      </div>
      
      {/* The SplideInit component needs to be included once in your app */}
      <SplideInit />
    </div>
  );
};

export default ProjectExample; 