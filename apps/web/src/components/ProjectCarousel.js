"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
require("../css/projectCarousel.css");
var projectCarousels_1 = require("../data/projectCarousels");
/**
 * ProjectCarousel Component
 *
 * Renders a project carousel for the given project key
 */
var ProjectCarousel = function (_a) {
    var _b, _c;
    var projectKey = _a.projectKey, propSlides = _a.slides;
    var splideRef = (0, react_1.useRef)(null);
    // Get slides from project carousels data or use passed slides
    var slides = propSlides || ((_b = projectCarousels_1.default[projectKey]) === null || _b === void 0 ? void 0 : _b.slides) || [];
    var carouselId = ((_c = projectCarousels_1.default[projectKey]) === null || _c === void 0 ? void 0 : _c.id) || "project-carousel-".concat(projectKey);
    (0, react_1.useEffect)(function () {
        // Function to initialize Splide
        var initSplide = function () {
            if (splideRef.current) {
                // Only initialize if not already initialized
                if (!splideRef.current.classList.contains('is-initialized')) {
                    // Check if Splide is available in the window
                    if (typeof window !== 'undefined' && window.Splide) {
                        try {
                            var splide_1 = new window.Splide(splideRef.current, {
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
                            var progressBarContainer = document.createElement('div');
                            progressBarContainer.className = 'my-carousel-progress';
                            var progressBar_1 = document.createElement('div');
                            progressBar_1.className = 'my-carousel-progress-bar';
                            progressBarContainer.appendChild(progressBar_1);
                            splideRef.current.appendChild(progressBarContainer);
                            // Update progress bar on carousel movement
                            splide_1.on('mounted move', function () {
                                try {
                                    var end = splide_1.Components.Controller.getEnd() + 1;
                                    var rate = Math.min((splide_1.index + 1) / end, 1);
                                    progressBar_1.style.width = String(100 * rate) + '%';
                                }
                                catch (e) {
                                    console.error("[ProjectCarousel] Error updating progress bar: ".concat(e.message));
                                }
                            });
                            splide_1.mount();
                        }
                        catch (e) {
                            console.error("[ProjectCarousel] Error initializing Splide for ".concat(carouselId, ":"), e.message);
                        }
                    }
                    else {
                        console.warn("[ProjectCarousel] Splide not available in window for ".concat(carouselId));
                    }
                }
            }
        };
        // Try initialization with increasing delays to ensure DOM and scripts are loaded
        initSplide();
        var timeouts = [100, 500, 1000, 2000].map(function (delay) {
            return setTimeout(function () {
                initSplide();
            }, delay);
        });
        // Cleanup function
        return function () {
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
    return (<div className="splide-container">
      <div className="splide" ref={splideRef} id={carouselId} data-splide-initialized="false">
        <div className="splide__track">
          <ul className="splide__list">
            {slides.map(function (slide, index) { return (<li key={"".concat(projectKey, "-slide-").concat(index)} className="splide__slide">
                <img src={slide.src} alt={slide.alt || "".concat(projectKey, " screenshot ").concat(index + 1)} className="project-image" loading="lazy"/>
              </li>); })}
          </ul>
        </div>
        {/* Progress bar will be added by the JS */}
      </div>
    </div>);
};
exports.default = ProjectCarousel;
