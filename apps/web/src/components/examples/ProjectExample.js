"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var Project_1 = require("../Project");
var projects_1 = require("../../data/projects");
var SplideInit_1 = require("../SplideInit");
/**
 * Example component showing how to use the Project component
 */
var ProjectExample = function () {
    return (<div className="project-examples">
      <h2>Project Examples</h2>
      
      <div className="project-grid">
        {/* Display specific projects */}
        <Project_1.default projectData={projects_1.default.odyssey}/>
        <Project_1.default projectData={projects_1.default.buffalo}/>
      </div>
      
      <h3>All Projects</h3>
      <div className="project-grid">
        {/* Map through all projects */}
        {Object.values(projects_1.default).map(function (projectData) { return (<Project_1.default key={projectData.id} projectData={projectData}/>); })}
      </div>
      
      {/* The SplideInit component needs to be included once in your app */}
      <SplideInit_1.default />
    </div>);
};
exports.default = ProjectExample;
