// Initialize basic carousels
function initializeBasicCarousels() {
    document.querySelectorAll('.splide:not(#odyssey-carousel):not(#coachmatrix-carousel):not(#steamreport-carousel):not(#buffalo-carousel):not(#laurie-crean-carousel):not(#hoverboard-carousel):not(#crocodile-kingdom-carousel)').forEach(carousel => {
        new Splide(carousel, {
            type: 'loop',
            perPage: 1,
            perMove: 1,
            gap: '1rem',
            pagination: true,
            arrows: true,
            autoplay: true,
            interval: 3000,
            pauseOnHover: true,
        }).mount();
    });
}
// Initialize project carousels
function initializeProjectCarousels() {
    const projectCarousels = ['odyssey', 'coachmatrix', 'steamreport', 'buffalo', 'laurie-crean', 'hoverboard', 'crocodile-kingdom', 'retrolympics', 'wealthquest'];
    projectCarousels.forEach(id => {
        const carousel = document.querySelector(`#${id}-carousel`);
        if (carousel) {
            const splide = new Splide(carousel, {
                type: 'loop',
                perPage: 1,
                perMove: 1,
                gap: '1rem',
                arrows: true,
                pagination: false,
                autoplay: false,
                arrowPath: 'm15.5 0.932-4.3 4.38 14.5 14.6-14.5 14.5 4.3 4.4 14.6-14.6 4.4-4.3-4.4-4.4-14.6-14.6z',
                speed: 400,
            });
            // Get the progress bar
            const bar = carousel.querySelector('.my-carousel-progress-bar');
            if (bar) {
                // Update the progress bar when the carousel moves
                splide.on('mounted move', function () {
                    const end = splide.Components.Controller.getEnd() + 1;
                    const rate = Math.min((splide.index + 1) / end, 1);
                    bar.style.width = String(100 * rate) + '%';
                });
            }
            splide.mount();
        }
    });
}
// Document ready function
document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM loaded, initializing carousels from carousel.js');
    initializeBasicCarousels();
    initializeProjectCarousels();
});
// Also initialize on document.docusaurus.routeDidUpdate for Docusaurus navigation
document.addEventListener('docusaurus.routeDidUpdate', function () {
    console.log('Route updated, reinitializing carousel.js');
    setTimeout(() => {
        initializeBasicCarousels();
        initializeProjectCarousels();
    }, 100);
});
// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeBasicCarousels,
        initializeProjectCarousels
    };
}
