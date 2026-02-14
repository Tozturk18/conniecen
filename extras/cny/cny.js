/**
 * Chinese New Year (Lunar New Year) Easter Egg
 * 
 * Displays CNY animation during Chinese New Year
 * Automatically hides on all other days
 * Debug: Add ?cny to URL to show anytime
 */

(function() {
    // Determine base path (supports nested /pages/ routes)
    const isNested = window.location.pathname.includes('/pages/');
    const basePath = isNested ? '../../' : './';

    // Chinese New Year dates (lunar new year occurrences)
    // Format: year: [month, day]
    const chineseNewYearDates = {
        2026: [2, 17],  // Year of the Horse
        2027: [2, 6],   // Year of the Sheep
        2028: [1, 26],  // Year of the Monkey
        2029: [2, 13],  // Year of the Rooster
        2030: [2, 3],   // Year of the Dog
        2031: [1, 23],  // Year of the Pig
        2032: [2, 11],  // Year of the Rat
        2033: [1, 31],  // Year of the Ox
        2034: [2, 19],  // Year of the Tiger
        2035: [2, 8],   // Year of the Rabbit
    };

    // Check if today is Chinese New Year, or if debug override is set
    function isCNYTime() {
        const params = new URLSearchParams(window.location.search);
        const debugOverride = params.has('cny') || params.get('cny') === '1';

        if (debugOverride) return true;

        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth() + 1; // getMonth returns 0-11
        const day = today.getDate();

        const cnyDate = chineseNewYearDates[year];
        if (cnyDate) {
            return month === cnyDate[0] && day === cnyDate[1];
        }

        return false;
    }

    // Load CSS file
    function loadCNYCSS() {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = `${basePath}extras/cny/cny.css`;
        document.head.appendChild(link);
    }

    // Get zodiac animal for a given year
    function getAnimal(year) {
        if (year < 0) {
            console.error("Invalid year");
            return null;
        }
        const animals = ["猴", "鸡", "狗", "猪", "鼠", "牛", "虎", "兔", "龙", "蛇", "马", "羊"];
        const index = year % 12;
        return animals[index];
    }

    // Get zodiac image position based on animal
    function getImage(animal) {
        const imageMap = {
            "猴": "100% 66.6%",
            "鸡": "0% 99.9%",
            "狗": "50% 99.9%",
            "猪": "100% 99.9%",
            "鼠": "0% 0%",
            "牛": "50% 0%",
            "虎": "100% 0",
            "兔": "0% 33.3%",
            "龙": "50% 33.3%",
            "蛇": "100% 33.3%",
            "马": "0% 66.6%",
            "羊": "50% 66.6%"
        };
        return imageMap[animal] || "";
    }

    // Get zodiac animal image filename based on animal character
    function getAnimalImageName(animalChar) {
        const animalImageMap = {
            "猴": "monkey.png",
            "鸡": "rooster.png",
            "狗": "dog.png",
            "猪": "pig.png",
            "鼠": "rat.png",
            "牛": "ox.png",
            "虎": "tiger.png",
            "兔": "bunny.png",
            "龙": "dragon.png",
            "蛇": "snake.png",
            "马": "horse.png",
            "羊": "sheep.png"
        };
        return animalImageMap[animalChar] || "dragon.png";
    }

    // Set the zodiac seal position
    function setZodiacPosition() {
        const currentYear = new Date().getFullYear();
        const animal = getAnimal(currentYear);
        const position = getImage(animal);
        const cardSeals = document.getElementsByClassName("card-seal");
        if (cardSeals.length > 0) {
            cardSeals[0].style.backgroundPosition = position;
        }
    }

    // Inject HTML content from cny.html
    function injectCNYHTML() {
        // Read the HTML markup directly from cny.html
        const cnyHTML = `<div class="card">
        <h1 class="card-title">恭贺新年</h1>
        <div class="wrapper">
<div class="kandil">
  <div class="kandil-top"></div>
  <div class="kandil-inner">
    福
    <div class="kandil-hang"></div>
    <div class="kandil-bottom"></div>
  </div>

  <ul class="ribbons">
    <li></li>
    <li></li>
    <li></li>
    <li></li>
    <li></li>
    <li></li>
    <li></li>
    <li></li>
    <li></li>
    <li></li>
  </ul>
</div>
</div>
        <div class="card-seal"></div>
        <div class="card-flower-1">
          <div class="card-flower-petal petal-1"></div>
          <div class="card-flower-petal petal-2"></div>
          <div class="card-flower-petal petal-3"></div>
          <div class="card-flower-petal petal-4"></div>
          <div class="card-flower-petal petal-5"></div>
          <div class="card-flower-pollen pollen-1"></div>
          <div class="card-flower-pollen pollen-2"></div>
          <div class="card-flower-pollen pollen-3"></div>
          <div class="card-flower-pollen pollen-4"></div>
          <div class="card-flower-pollen pollen-5"></div>
        </div>
        <div class="card-flower-2">
          <div class="card-flower-petal petal-1"></div>
          <div class="card-flower-petal petal-2"></div>
          <div class="card-flower-petal petal-3"></div>
          <div class="card-flower-petal petal-4"></div>
          <div class="card-flower-petal petal-5"></div>
          <div class="card-flower-pollen pollen-1"></div>
          <div class="card-flower-pollen pollen-2"></div>
          <div class="card-flower-pollen pollen-3"></div>
          <div class="card-flower-pollen pollen-4"></div>
          <div class="card-flower-pollen pollen-5"></div>
        </div>
        <div class="card-flower-3">
          <div class="card-flower-petal petal-1"></div>
          <div class="card-flower-petal petal-2"></div>
          <div class="card-flower-petal petal-3"></div>
          <div class="card-flower-petal petal-4"></div>
          <div class="card-flower-petal petal-5"></div>
          <div class="card-flower-pollen pollen-1"></div>
          <div class="card-flower-pollen pollen-2"></div>
          <div class="card-flower-pollen pollen-3"></div>
          <div class="card-flower-pollen pollen-4"></div>
          <div class="card-flower-pollen pollen-5"></div>
        </div>
        <div class="card-hill hill-1">
          <div class="card-hill-star star-1"></div>
          <div class="card-hill-star star-2"></div>
          <div class="card-hill-star star-3"></div>
        </div>
        <div class="card-hill hill-2">
          <div class="card-hill-circle-1">
            <div class="hill-circle circle-1"></div>
            <div class="hill-circle circle-2"></div>
            <div class="hill-circle circle-3"></div>
            <div class="hill-circle circle-4"></div>
            <div class="hill-circle circle-5"></div>
          </div>
          <div class="card-hill-circle-2">
            <div class="hill-circle circle-1"></div>
            <div class="hill-circle circle-2"></div>
            <div class="hill-circle circle-3"></div>
            <div class="hill-circle circle-4"></div>
            <div class="hill-circle circle-5"></div>
          </div>
          <div class="card-hill-circle-3">
            <div class="hill-circle circle-1"></div>
            <div class="hill-circle circle-2"></div>
            <div class="hill-circle circle-3"></div>
            <div class="hill-circle circle-4"></div>
            <div class="hill-circle circle-5"></div>
          </div>
          <div class="card-hill-circle-4">
            <div class="hill-circle circle-1"></div>
            <div class="hill-circle circle-2"></div>
            <div class="hill-circle circle-3"></div>
            <div class="hill-circle circle-4"></div>
            <div class="hill-circle circle-5"></div>
          </div>
          <div class="card-hill-circle-5">
            <div class="hill-circle circle-1"></div>
            <div class="hill-circle circle-2"></div>
            <div class="hill-circle circle-3"></div>
            <div class="hill-circle circle-4"></div>
            <div class="hill-circle circle-5"></div>
          </div>
        </div>
        <div class="card-hill hill-3">
          <div class="card-hill-border-1">
            <div class="border-1"></div>
            <div class="border-2"></div>
          </div>
          <div class="card-hill-border-2">
            <div class="border-1"></div>
            <div class="border-2"></div>
          </div>
          <div class="card-hill-border-3">
            <div class="border-1"></div>
            <div class="border-2"></div>
          </div>
        </div>
      </div>`;

        // Function to fade out and remove all CNY elements
        function fadeOutCNY() {
            const cnyShow = document.getElementById('cny_show');
            const cnyShowRight = document.getElementById('cny_show_right');
            const cnyOverlay = document.getElementById('cny_overlay');
            const hongbao = document.getElementById('cny_hongbao');
            
            if (cnyShow) {
                cnyShow.style.opacity = '0';
                cnyShow.style.transition = 'opacity 0.5s ease-out';
            }
            if (cnyShowRight) {
                cnyShowRight.style.opacity = '0';
                cnyShowRight.style.transition = 'opacity 0.5s ease-out';
            }
            if (cnyOverlay) {
                cnyOverlay.style.opacity = '0';
                cnyOverlay.style.transition = 'opacity 0.5s ease-out';
            }
            if (hongbao) {
                hongbao.style.opacity = '0';
                hongbao.style.transition = 'opacity 0.5s ease-out';
            }
            
            // Remove elements after fade completes
            setTimeout(() => {
                if (cnyShow) cnyShow.remove();
                if (cnyShowRight) cnyShowRight.remove();
                if (cnyOverlay) cnyOverlay.remove();
                if (hongbao) hongbao.remove();
            }, 500);
        }

        // Create dark overlay background
        const overlay = document.createElement('div');
        overlay.id = 'cny_overlay';
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        overlay.style.zIndex = '9998';
        overlay.style.cursor = 'pointer';
        document.body.appendChild(overlay);

        // Add click handler to overlay to dismiss
        overlay.addEventListener('click', function(e) {
            if (e.target === overlay) {
                fadeOutCNY();
            }
        });

        // Append card to body (top-left)
        const cnyShowDiv = document.createElement('div');
        cnyShowDiv.id = 'cny_show';
        cnyShowDiv.style.position = 'fixed';
        cnyShowDiv.style.top = '20px';
        cnyShowDiv.style.left = '20px';
        cnyShowDiv.style.zIndex = '9999';
        cnyShowDiv.innerHTML = cnyHTML;
        document.body.appendChild(cnyShowDiv);

        // Create second card (top-right) with animal image instead of seal
        const currentYear = new Date().getFullYear();
        const animalChar = getAnimal(currentYear);
        const animalImageName = getAnimalImageName(animalChar);
        
        const cnyShowRightDiv = document.createElement('div');
        cnyShowRightDiv.id = 'cny_show_right';
        cnyShowRightDiv.style.position = 'fixed';
        cnyShowRightDiv.style.top = '20px';
        cnyShowRightDiv.style.right = '20px';
        cnyShowRightDiv.style.zIndex = '9999';
        
        // Create card HTML for right side
        const cnyRightHTML = `<div class="card" style="position: relative;">
        
        <div class="card-animal-image" style="
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 100%;
            height: 100%;
            background-image: url('${basePath}extras/cny/cny_img/${animalImageName}');
            background-size: contain;
            background-repeat: no-repeat;
            background-position: center;
        "></div>
        
      </div>`;
        
        cnyShowRightDiv.innerHTML = cnyRightHTML;
        document.body.appendChild(cnyShowRightDiv);

        // Create Hongbao element
        const hongbaoContainer = document.createElement('div');
        hongbaoContainer.id = 'cny_hongbao';
        hongbaoContainer.style.position = 'fixed';
        hongbaoContainer.style.top = '50%';
        hongbaoContainer.style.left = '50%';
        hongbaoContainer.style.transform = 'translate(-50%, -50%)';
        hongbaoContainer.style.zIndex = '9999';
        hongbaoContainer.innerHTML = `
            <div id="hongbao" style="position: relative; width: 200px; height: 300px;">
                <!-- Envelope Flap/Lip -->
                <div id="hongbao-flap" style="
                    position: absolute;
                    top: 3px;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 0;
                    height: 0;
                    border-left: 100px solid transparent;
                    border-right: 100px solid transparent;
                    border-top: 30px solid #b30000;
                    z-index: 10;
                    transition: transform 0.5s ease, border-top 0.25s ease;
                "></div>
                
                <!-- Red Envelope Closed State (Clickable) -->
                <div id="hongbao-closed" style="
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(135deg, #d7000f 0%, #ff1744 50%, #d7000f 100%);
                    border-radius: 10px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
                    border: 3px solid #8b0000;
                    font-weight: bold;
                    font-size: 48px;
                    color: #ffd700;
                    cursor: pointer;
                    z-index: 5;
                    transition: transform 0.5s ease;
                ">
                    恭
                </div>
                
                <!-- Gold Note Inside (Slides Up) -->
                <div id="hongbao-note" style="
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(135deg, #ffd700 0%, #ffed4e 50%, #ffd700 100%);
                    border-radius: 10px;
                    padding: 20px;
                    box-sizing: border-box;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
                    border: 3px solid #d7000f;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    text-align: center;
                    font-family: 'Zhi Mang Xing', cursive;
                    font-size: 18px;
                    color: #d7000f;
                    line-height: 1.5;
                    transition: transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
                    overflow: hidden;
                    z-index: 2;
                ">
                    <div style="font-size: 24px; font-weight: bold; margin-bottom: 8px;">Happy Chinese New Year!</div>
                    <div style="font-size: 16px;">恭喜发财</div>
                    <div style="font-size: 12px; margin-top: 8px;">Wishing you prosperity!</div>
                </div>
            </div>
        `;
        document.body.appendChild(hongbaoContainer);

        // Add click handler only to the closed hongbao
        const hongbaoClosed = document.getElementById('hongbao-closed');
        const hongbaoNote = document.getElementById('hongbao-note');
        const hongbaoFlap = document.getElementById('hongbao-flap');
        let hongbaoOpened = false;
        
        hongbaoClosed.addEventListener('click', function(e) {
            e.stopPropagation();
            
            if (!hongbaoOpened) {
                hongbaoOpened = true;
                
                
                
                // Change z-index halfway through animation so note appears on top
                setTimeout(() => {
                    hongbaoFlap.style.zIndex = '-10';
                    // Slide the note up by 50% (halfway)
                    hongbaoNote.style.transform = 'translateY(-50%)';
                    hongbaoClosed.style.transform = 'translateY(25%)';
                }, 301);
                
                // Rotate the flap to look opened
                hongbaoFlap.style.transform = 'translateX(-50%) translateY(-100%) rotateX(180deg)';
                hongbaoFlap.style.borderTop = '30px solid #ff1744';
                
                // Fade out the closed envelope
                hongbaoClosed.style.pointerEvents = 'none';
                
                // Start fade out after 3 seconds of showing the message
                setTimeout(() => {
                    fadeOutCNY();
                }, 3000);
            }
        });

        // Set zodiac position after HTML is injected
        setZodiacPosition();
    }

    // Initialize CNY easter egg
    function initCNY() {
        if (isCNYTime()) {
            // Load CSS
            loadCNYCSS();

            // Wait for DOM to be ready
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', injectCNYHTML);
            } else {
                injectCNYHTML();
            }
        }
    }

    // Start initialization
    initCNY();
})();