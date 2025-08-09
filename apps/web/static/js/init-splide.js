// Manual Splide initialization with retry logic and mutation observer
(function () {
    // Track if initialization has already occurred
    var hasInitialized = false;
    var retryCount = 0;
    var MAX_RETRIES = 10;
    var Splide = window.Splide;
    // Main initialization function
    function initSplide() {
        // Check if Splide is loaded
        if (typeof Splide === 'undefined') {
            // Load Splide CSS
            var splideCSS = document.createElement('link');
            splideCSS.rel = 'stylesheet';
            splideCSS.href = 'https://cdn.jsdelivr.net/npm/@splidejs/splide@4.1.4/dist/css/splide.min.css';
            document.head.appendChild(splideCSS);
            // Load Splide JS
            var splideScript = document.createElement('script');
            splideScript.src = 'https://cdn.jsdelivr.net/npm/@splidejs/splide@4.1.4/dist/js/splide.min.js';
            splideScript.onload = function () {
                setTimeout(initializeSplideCarousels, 100); // Wait a bit after script loads
            };
            document.body.appendChild(splideScript);
        }
        else {
            initializeSplideCarousels();
        }
    }
    function initializeSplideCarousels() {
        // Check if we have any uninitialized carousels
        var splideElements = document.querySelectorAll('.splide:not(.is-initialized)');
        // If no uninitialized elements found, retry a few times
        if (splideElements.length === 0) {
            retryCount++;
            if (retryCount <= MAX_RETRIES) {
                setTimeout(initializeSplideCarousels, 1000); // Retry after 1 second
                return;
            }
            return;
        }
        hasInitialized = true;
        var successCount = 0;
        // Initialize all carousels with consistent settings
        splideElements.forEach(function (carousel, index) {
            try {
                // Don't reinitialize if a React component already handled it
                if (carousel.getAttribute('data-splide-initialized') === 'true') {
                    return;
                }
                // Check if we already have a progress bar
                var progressBar_1 = carousel.querySelector('.my-carousel-progress-bar');
                var progressBarContainer = carousel.querySelector('.my-carousel-progress');
                // Create progress bar if it doesn't exist
                if (!progressBar_1) {
                    progressBarContainer = document.createElement('div');
                    progressBarContainer.className = 'my-carousel-progress';
                    progressBar_1 = document.createElement('div');
                    progressBar_1.className = 'my-carousel-progress-bar';
                    progressBarContainer.appendChild(progressBar_1);
                    carousel.appendChild(progressBarContainer);
                }
                var splide_1 = new Splide(carousel, {
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
                splide_1.on('mounted move', function () {
                    try {
                        var end = splide_1.Components.Controller.getEnd() + 1;
                        var rate = Math.min((splide_1.index + 1) / end, 1);
                        progressBar_1.style.width = String(100 * rate) + '%';
                    }
                    catch (e) {
                        // Silent error handling for progress bar updates
                    }
                });
                splide_1.mount();
                carousel.setAttribute('data-splide-initialized', 'true');
                successCount++;
            }
            catch (e) {
                // Silent error handling for carousel initialization
            }
        });
        // If we still have more carousels to initialize, retry
        if (successCount === 0 && retryCount < MAX_RETRIES) {
            retryCount++;
            setTimeout(initializeSplideCarousels, 1000);
        }
    }
    // Set up mutation observer to detect when new content is added
    function setupMutationObserver() {
        var observer = new MutationObserver(function (mutations) {
            var hasSplideElements = false;
            mutations.forEach(function (mutation) {
                if (mutation.addedNodes.length) {
                    // Check if any of the added nodes are splide elements or contain them
                    mutation.addedNodes.forEach(function (node) {
                        if (node.nodeType === 1) { // Element node
                            var element = node;
                            if ((element.classList && element.classList.contains('splide') && !element.classList.contains('is-initialized')) ||
                                (element.querySelector && element.querySelector('.splide:not(.is-initialized)'))) {
                                hasSplideElements = true;
                            }
                        }
                    });
                }
            });
            if (hasSplideElements) {
                // Reset retry counter for new elements
                retryCount = 0;
                initializeSplideCarousels();
            }
        });
        // Start observing the document with the configured parameters
        observer.observe(document.body, { childList: true, subtree: true });
    }
    // Add sidebar toggle listener to handle sidebar collapse/expand
    function setupSidebarToggleListener() {
        // Function to refresh all splide carousels without changing slides
        function refreshSplideCarousels() {
            // Find all initialized splides
            document.querySelectorAll('.splide.is-initialized').forEach(function (carousel) {
                try {
                    // Dispatch a resize event to trigger Splide's internal resize handler
                    if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function') {
                        setTimeout(function () {
                            window.dispatchEvent(new Event('resize'));
                        }, 100);
                    }
                }
                catch (e) {
                    // Silent error handling for carousel refresh
                }
            });
        }
        // Use MutationObserver to detect sidebar toggle
        var sidebarObserver = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
                if (mutation.attributeName === 'class') {
                    var sidebarCollapsed = document.documentElement.classList.contains('sidebar-hidden') ||
                        document.documentElement.classList.contains('navbar--sidebar-show') ||
                        document.documentElement.classList.contains('navbar-sidebar--show');
                    // Wait for the sidebar animation to start before refreshing
                    setTimeout(refreshSplideCarousels, 300);
                }
            });
        });
        // Start observing the HTML element for class changes
        sidebarObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
        // Also listen for Docusaurus sidebar toggle button clicks directly
        document.addEventListener('click', function (event) {
            var target = event.target;
            var toggleButton = target.closest('.navbar__toggle, .navbar-sidebar__close, .navbar-sidebar__backdrop, .navbar__toggle');
            if (toggleButton) {
                // Wait a bit for the sidebar animation to start
                setTimeout(refreshSplideCarousels, 300);
            }
        });
    }
    // Initialize on first load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () {
            initSplide();
            setupMutationObserver();
            setupSidebarToggleListener();
        });
    }
    else {
        initSplide();
        setupMutationObserver();
        setupSidebarToggleListener();
    }
    // Handle Docusaurus page transitions - initialize carousels after page changes
    // This is needed because Docusaurus uses client-side routing
    document.addEventListener('docusaurus.routeDidUpdate', function () {
        // Reset initialization flag when route changes
        hasInitialized = false;
        retryCount = 0;
        setTimeout(initializeSplideCarousels, 300); // Small delay to ensure DOM is updated
    });
})();
