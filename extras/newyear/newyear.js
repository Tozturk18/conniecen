/**
 * New Year Easter Egg
 * 
 * Displays fireworks animation on December 31st and January 1st
 * Automatically hides on all other days
 */

(function() {
    // Determine base path (supports nested /pages/ routes)
    const isNested = window.location.pathname.includes('/pages/');
    const basePath = isNested ? '../../' : './';

    // Check if today is December 31st or January 1st, or if debug override is set
    function isNewYearTime() {
        const params = new URLSearchParams(window.location.search);
        const debugOverride = params.has('newyear') || params.has('newyear=1');

        if (debugOverride) return true;

        const today = new Date();
        const month = today.getMonth() + 1; // getMonth returns 0-11
        const day = today.getDate();
        
        return (month === 12 && day === 31) || (month === 1 && day === 1);
    }

    // Load CSS file
    function loadNewYearCSS() {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = `${basePath}extras/newyear/newyear.css`;
        document.head.appendChild(link);
    }

    // Inject HTML content
    function injectNewYearHTML() {
        const newYearHTML = `
        <div id="firework_show">
            <h1>Happy New Year!</h1>
            <div class="firework"></div>
            <div class="firework"></div>
            <div class="firework"></div>
        </div>
        `;
        
        // Append to body
        document.body.insertAdjacentHTML('beforeend', newYearHTML);
        
        // Fade out and remove after 3 seconds
        setTimeout(() => {
            const fireworkShow = document.getElementById('firework_show');
            if (fireworkShow) {
                fireworkShow.classList.add('fade-out');
                // Remove element after fade completes (0.5s)
                setTimeout(() => {
                    fireworkShow.remove();
                }, 500);
            }
        }, 3000);
    }

    // Initialize New Year easter egg
    function initNewYear() {
        if (isNewYearTime()) {
            // Load CSS
            loadNewYearCSS();
            
            // Wait for DOM to be ready
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', injectNewYearHTML);
            } else {
                injectNewYearHTML();
            }
        }
    }

    // Start initialization
    initNewYear();
})();
