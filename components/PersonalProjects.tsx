import React from 'react';

const PersonalProjects = () => {
    return (
      <section className="container mx-auto px-4">
        <h2 className="text-xl font-bold mb-4">Personal Projects</h2>
        <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="bg-white shadow-md rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-2">Project {index + 1}</h3>
              <p>A brief description of what Project {index + 1} does.</p>
            </div>
          ))}
        </div>
      </section>
    );
  };

export default PersonalProjects;