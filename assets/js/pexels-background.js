// Pexels Background Image System
// Fetches random landscape images from Pexels API and crossfades them every 3 seconds

class PexelsBackground {
    constructor() {
        this.apiKey = null;
        this.queries = this.getQueries();
        this.imageBatch = []; // Store current batch of images
        this.currentIndex = 0; // Track which image to show next
        this.rotationInterval = null; // Interval ID for rotation
        this.fallbackGradient = 'linear-gradient(135deg, var(--color-primary-dark) 0%, var(--color-primary) 20%, var(--color-primary-light) 40%, var(--color-primary) 60%, var(--color-primary-dark) 75%, var(--color-primary-dark) 90%, var(--color-primary) 100%)';

        this.hideGradientBackground();
        this.waitForConfig();
    }

    waitForConfig() {
        const checkConfig = () => {
            if (window.PEXELS_API_KEY) {
                this.apiKey = window.PEXELS_API_KEY;
                this.init();
            } else {
                setTimeout(checkConfig, 100);
            }
        };
        setTimeout(checkConfig, 100);
    }

    hideGradientBackground() {
        const heroSection = document.querySelector('.hero-section');
        if (heroSection) {
            heroSection.style.background = 'transparent';
            heroSection.style.transition = 'background 0.3s ease-in-out';
        }
    }

    getQueries() {
        if (window.PEXELS_QUERIES && Array.isArray(window.PEXELS_QUERIES)) {
            return window.PEXELS_QUERIES;
        }
        return [
            'ocean', 'nature', 'landscape', 'mountains', 'forest', 'sunset', 'beach', 'sky',
            'lake', 'river', 'valley', 'desert', 'canyon', 'waterfall', 'meadow', 'field',
            'coast', 'cliff', 'island', 'bay', 'harbor', 'lighthouse', 'bridge', 'path',
            'trail', 'garden', 'park', 'tree', 'flower', 'cloud', 'storm', 'rainbow',
            'aurora', 'milky way', 'stars', 'moon', 'sunrise', 'twilight', 'mist', 'fog',
            'space', 'galaxy', 'nebula', 'planet', 'earth', 'mars', 'jupiter', 'saturn',
            'universe', 'cosmos', 'astronomy', 'solar system', 'black hole', 'supernova',
            'constellation', 'meteor', 'comet', 'asteroid', 'space station', 'satellite'
        ];
    }

    async init() {
        try {
            await this.loadRandomBackground();
        } catch (error) {
            console.error('Failed to load Pexels background:', error);
            this.useFallbackBackground();
        }
    }

    async loadRandomBackground() {
        const randomQuery = this.queries[Math.floor(Math.random() * this.queries.length)];

        const response = await fetch(`https://api.pexels.com/v1/search?query=${randomQuery}&orientation=landscape&size=small&per_page=15&page=1`, {
            headers: { 'Authorization': this.apiKey }
        });

        if (!response.ok) throw new Error(`Pexels API error: ${response.status}`);

        const data = await response.json();

        if (data.photos && data.photos.length > 0) {
            this.imageBatch = data.photos.map(photo => photo.src.large2x || photo.src.large || photo.src.medium);
            this.currentIndex = 0;
            this.startBackgroundRotation();
        } else {
            throw new Error('No photos found');
        }
    }

    startBackgroundRotation() {
        if (!this.imageBatch.length) return;

        // Show first image immediately
        this.applyBackgroundImage(this.imageBatch[this.currentIndex]);

        // Clear previous interval if any
        if (this.rotationInterval) clearInterval(this.rotationInterval);

        // Rotate images every 3 seconds
        this.rotationInterval = setInterval(() => {
            this.currentIndex = (this.currentIndex + 1) % this.imageBatch.length;
            this.applyBackgroundImage(this.imageBatch[this.currentIndex]);
        }, 4000);
    }

    applyBackgroundImage(imageUrl) {
        const heroSection = document.querySelector('.hero-section');
        if (!heroSection) return;

        // Create two background containers if they don't exist
        let bg1 = heroSection.querySelector('.pexels-bg1');
        let bg2 = heroSection.querySelector('.pexels-bg2');

        if (!bg1) {
            bg1 = document.createElement('div');
            bg1.className = 'pexels-bg1';
            Object.assign(bg1.style, this.getBgStyle());
            heroSection.appendChild(bg1);
        }

        if (!bg2) {
            bg2 = document.createElement('div');
            bg2.className = 'pexels-bg2';
            Object.assign(bg2.style, this.getBgStyle());
            heroSection.appendChild(bg2);
        }

        // Determine which one is currently visible
        const showing = bg1.style.opacity == '1' ? bg1 : bg2;
        const hiding = showing === bg1 ? bg2 : bg1;

        // Set new image on hidden container
        hiding.style.backgroundImage = `url(${imageUrl})`;
        hiding.style.opacity = '0';

        // Force reflow for smooth transition
        void hiding.offsetWidth;

        // Fade in new container, fade out old container
        hiding.style.transition = 'opacity 1s ease-in-out';
        showing.style.transition = 'opacity 1s ease-in-out';
        hiding.style.opacity = '1';
        showing.style.opacity = '0';

        // Ensure hero content stays above background
        const content = heroSection.querySelector('.max-w-7xl');
        if (content) content.style.position = 'relative';

        // Apply blurred background to right content if exists
        if (content) {
            const flexContainer = content.querySelector('.flex');
            if (flexContainer) {
                const rightContent = flexContainer.children[1];
                if (rightContent && rightContent.classList.contains('lg:w-1/2')) {
                    rightContent.style.background = 'rgba(255, 255, 255, 0.02)';
                    rightContent.style.backdropFilter = 'blur(8px)';
                    rightContent.style.borderRadius = '30px';
                    rightContent.style.padding = '2rem';
                    rightContent.style.margin = '1rem 0';
                    rightContent.style.boxShadow = 'none';
                    rightContent.style.minWidth = '70%';
                }
            }
        }

        // Add overlay if not exists
        let overlay = heroSection.querySelector('.pexels-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.className = 'pexels-overlay';
            overlay.style.cssText = `
                position: absolute;
                top: 0; left: 0; right: 0; bottom: 0;
                background: linear-gradient(
                    135deg,
                    rgba(0,0,0,0.4) 0%,
                    rgba(0,0,0,0.2) 25%,
                    rgba(0,0,0,0.3) 50%,
                    rgba(0,0,0,0.2) 75%,
                    rgba(0,0,0,0.4) 100%
                );
                z-index: 1;
                pointer-events: none;
                opacity: 1;
            `;
            heroSection.appendChild(overlay);
        }

        // Remove gradient-bg class and add pexels-bg class
        heroSection.classList.remove('gradient-bg');
        heroSection.classList.add('pexels-bg');
    }

    // Helper function to get common background container styles
    getBgStyle() {
        return {
            position: 'absolute',
            top: '0', left: '0', right: '0', bottom: '0',
            zIndex: '0',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundAttachment: 'fixed',
            opacity: '0',
            transition: 'opacity 1s ease-in-out'
        };
    }

    useFallbackBackground() {
        const heroSection = document.querySelector('.hero-section');
        if (!heroSection) return;

        heroSection.style.background = this.fallbackGradient;
        heroSection.style.backgroundImage = 'none';
        heroSection.classList.add('gradient-bg');
        heroSection.classList.remove('pexels-bg');

        const existingBg1 = heroSection.querySelector('.pexels-bg1');
        const existingBg2 = heroSection.querySelector('.pexels-bg2');
        const existingOverlay = heroSection.querySelector('.pexels-overlay');

        if (existingBg1) existingBg1.remove();
        if (existingBg2) existingBg2.remove();
        if (existingOverlay) existingOverlay.remove();

        const content = heroSection.querySelector('.max-w-7xl');
        if (content) {
            const flexContainer = content.querySelector('.flex');
            if (flexContainer) {
                const rightContent = flexContainer.children[1];
                if (rightContent && rightContent.classList.contains('lg:w-1/2')) {
                    rightContent.style.background = '';
                    rightContent.style.backdropFilter = '';
                    rightContent.style.borderRadius = '';
                    rightContent.style.padding = '';
                    rightContent.style.margin = '';
                    rightContent.style.boxShadow = '';
                }
            }
        }

        // Stop rotation if fallback is used
        if (this.rotationInterval) clearInterval(this.rotationInterval);
    }

    async refreshBackground() {
        if (this.apiKey) {
            try {
                await this.loadRandomBackground();
            } catch (error) {
                console.error('Failed to refresh background:', error);
            }
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        window.pexelsBackground = new PexelsBackground();
    }, 100);
});

// Export for external use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PexelsBackground;
}