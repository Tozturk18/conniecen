/**
 * Christmas Easter Egg
 * 
 * Displays Santa sleigh animation on December 24th and 25th
 * Automatically hides on all other days
 */

(function() {
    // Determine base path (supports nested /pages/ routes)
    const isNested = window.location.pathname.includes('/pages/');
    const basePath = isNested ? '../../' : './';

    // Check if today is December 24th or 25th, or if debug override is set
    function isChristmasTime() {
        const params = new URLSearchParams(window.location.search);
        const debugOverride = params.has('xmas') || params.has('xmas=1');

        if (debugOverride) return true;

        const today = new Date();
        const month = today.getMonth() + 1; // getMonth returns 0-11
        const day = today.getDate();
        
        return month === 12 && (day === 24 || day === 25);
    }

    // Load CSS file
    function loadChristmasCSS() {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = `${basePath}extras/christmas/christmas.css`;
        document.head.appendChild(link);
    }

    // Inject HTML content
    function injectChristmasHTML() {
        const christmasHTML = `
        <extra id="christmas_extra">
            <img id="tree_image" src="${basePath}extras/christmas/tree.png" alt="Christmas Tree">
            <img id="santa_image" src="${basePath}extras/christmas/santa.png" alt="Santa Claus">
        </extra>
        `;
        
        // Append to body
        document.body.insertAdjacentHTML('beforeend', christmasHTML);
    }

    // Initialize Christmas easter egg
    function initChristmas() {
        if (isChristmasTime()) {
            // Load CSS
            loadChristmasCSS();
            
            // Wait for DOM to be ready
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', injectChristmasHTML);
            } else {
                injectChristmasHTML();
            }
        }
    }

    // Start initialization
    initChristmas();
})();
