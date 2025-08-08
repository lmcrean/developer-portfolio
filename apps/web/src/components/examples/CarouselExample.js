"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var ProjectCarousel_1 = require("../ProjectCarousel");
var SplideInit_1 = require("../SplideInit");
/**
 * Example component showing how to use the ProjectCarousel component
 */
var CarouselExample = function () {
    return (<div className="carousel-examples">
      <h2>Project Carousels</h2>
      
      <h3>Odyssey Project</h3>
      <ProjectCarousel_1.default projectKey="odyssey"/>
      
      <h3>Coach Matrix Project</h3>
      <ProjectCarousel_1.default projectKey="coachmatrix"/>
      
      <h3>Buffalo Project</h3>
      <ProjectCarousel_1.default projectKey="buffalo"/>
      
      <h3>Retrolympics Rush Project</h3>
      <ProjectCarousel_1.default projectKey="retrolympics"/>
      
      <h3>Wealth Quest Project</h3>
      <ProjectCarousel_1.default projectKey="wealthquest"/>
      
      {/* The SplideInit component needs to be included once in your app */}
      <SplideInit_1.default />
    </div>);
};
exports.default = CarouselExample;
