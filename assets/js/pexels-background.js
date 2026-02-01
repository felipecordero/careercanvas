// Pexels Background Image System
// Fetches random landscape images from Pexels API for hero background

class PexelsBackground {
    constructor() {
        this.apiKey = null;
        this.queries = this.getQueries();
        this.currentImage = null;
        this.currentPhoto = null;
        this.usedImages = new Set(); // Track used images to avoid repeats
        this.fallbackGradient = 'linear-gradient(135deg, var(--color-primary-dark) 0%, var(--color-primary) 20%, var(--color-primary-light) 40%, var(--color-primary) 60%, var(--color-primary-dark) 75%, var(--color-primary-dark) 90%, var(--color-primary) 100%)';
        
        // Hide gradient immediately to prevent flash
        this.hideGradientBackground();
        
        // Wait for configuration to be loaded, then initialize
        this.waitForConfig();
    }

    waitForConfig() {
        const checkConfig = () => {
            if (window.PEXELS_API_KEY) {
                this.apiKey = window.PEXELS_API_KEY;
                this.init();
            } else {
                // Wait a bit more for the configuration to load
                setTimeout(checkConfig, 100);
            }
        };
        
        // Start checking after a short delay to allow config to load
        setTimeout(checkConfig, 100);
    }

    hideGradientBackground() {
        const heroSection = document.querySelector('.hero-section');
        if (heroSection) {
            // Immediately hide the gradient to prevent flash
            heroSection.style.background = 'transparent';
            heroSection.style.transition = 'background 0.3s ease-in-out';
        }
    }


    getQueries() {
        // Get queries from Hugo config, with fallback to default list
        if (window.PEXELS_QUERIES && Array.isArray(window.PEXELS_QUERIES)) {
            return window.PEXELS_QUERIES;
        }
        
        // Fallback queries if not configured
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
        
        // Random page number (1-10) to get different results
        const randomPage = Math.floor(Math.random() * 10) + 1;
        
        // Random per_page (1-15) to get different result sets
        const randomPerPage = Math.floor(Math.random() * 15) + 1;
        
        const response = await fetch(`https://api.pexels.com/v1/search?query=${randomQuery}&orientation=landscape&size=small&per_page=${randomPerPage}&page=${randomPage}`, {
            headers: {
                'Authorization': this.apiKey
            }
        });

        if (!response.ok) {
            throw new Error(`Pexels API error: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.photos && data.photos.length > 0) {
            // Filter out already used images
            const availablePhotos = data.photos.filter(photo => !this.usedImages.has(photo.id));
            
            // If all photos are used, reset the used images set (after many images)
            if (availablePhotos.length === 0) {
                this.usedImages.clear();
                const randomPhoto = data.photos[Math.floor(Math.random() * data.photos.length)];
                this.currentImage = randomPhoto.src.large2x || randomPhoto.src.large || randomPhoto.src.medium;
                this.currentPhoto = randomPhoto;
                this.usedImages.add(randomPhoto.id);
            } else {
                // Pick a random photo from available ones
                const randomPhoto = availablePhotos[Math.floor(Math.random() * availablePhotos.length)];
                this.currentImage = randomPhoto.src.large2x || randomPhoto.src.large || randomPhoto.src.medium;
                this.currentPhoto = randomPhoto;
                this.usedImages.add(randomPhoto.id);
            }
            
            this.applyBackgroundImage();
        } else {
            throw new Error('No photos found');
        }
    }

    setCredit(photo) {
        const creditEl = document.getElementById('pexels-credit');
        if (!creditEl) return;

        const photographer = photo?.photographer;
        const url = photo?.url;

        // Keep credit always visible (no appear/disappear).
        // If photo metadata is missing (e.g. fallback background), show a stable default.
        if (photographer && url) {
            creditEl.textContent = `Photo by ${photographer} / Pexels`;
            creditEl.href = url;
        } else {
            creditEl.textContent = 'Photo / Pexels';
            creditEl.href = 'https://www.pexels.com';
        }

        creditEl.hidden = false;
    }

    applyBackgroundImage() {
        const heroSection = document.querySelector('.hero-section');
        if (!heroSection) return;

        // Create a background container for smooth transitions
        const bgContainer = document.createElement('div');
        bgContainer.className = 'pexels-bg-container';
        bgContainer.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 0;
            opacity: 0;
            transition: opacity 0.8s ease-in-out;
        `;

        // Create overlay to maintain text readability
        const overlay = document.createElement('div');
        overlay.className = 'pexels-overlay';
        overlay.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(
                135deg,
                rgba(0, 0, 0, 0.4) 0%,
                rgba(0, 0, 0, 0.2) 25%,
                rgba(0, 0, 0, 0.3) 50%,
                rgba(0, 0, 0, 0.2) 75%,
                rgba(0, 0, 0, 0.4) 100%
            );
            z-index: 1;
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.8s ease-in-out;
        `;

        // Add elements to hero section
        heroSection.appendChild(bgContainer);
        heroSection.appendChild(overlay);

        // Ensure content stays above everything
        const content = heroSection.querySelector('.max-w-7xl');
        if (content) {
            content.style.position = 'relative';
            content.style.zIndex = '10';
            
            // Find the right side content container (text content) - more specific selector
            const flexContainer = content.querySelector('.flex');
            if (flexContainer) {
                const rightContent = flexContainer.children[1]; // Second child (right content)
                if (rightContent && rightContent.classList.contains('lg:w-1/2')) {
                    // Add blurred background to the right side text container
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

        // Preload the image to ensure smooth transition
        const img = new Image();
        img.onload = () => {
            // Apply the background to the container
            bgContainer.style.backgroundImage = `url(${this.currentImage})`;
            bgContainer.style.backgroundSize = 'cover';
            bgContainer.style.backgroundPosition = 'center';
            bgContainer.style.backgroundRepeat = 'no-repeat';
            
            // Remove gradient-bg class and add pexels-bg class
            heroSection.classList.remove('gradient-bg');
            heroSection.classList.add('pexels-bg');
            
            // Simple fade-in effect for background and overlay only
            setTimeout(() => {
                bgContainer.style.opacity = '1';
                overlay.style.opacity = '1';
            }, 50);

            this.setCredit(this.currentPhoto);
        };
        
        img.src = this.currentImage;
    }

    useFallbackBackground() {
        const heroSection = document.querySelector('.hero-section');
        if (!heroSection) return;

        // Restore gradient background
        heroSection.style.background = this.fallbackGradient;
        heroSection.style.backgroundImage = 'none';
        heroSection.classList.add('gradient-bg');
        heroSection.classList.remove('pexels-bg');
        
        // Remove any existing background container and overlay
        const existingBgContainer = heroSection.querySelector('.pexels-bg-container');
        const existingOverlay = heroSection.querySelector('.pexels-overlay');
        if (existingBgContainer) {
            existingBgContainer.remove();
        }
        if (existingOverlay) {
            existingOverlay.remove();
        }

        this.setCredit(null);
        
        // Remove blurred background styles from right content container
        const content = heroSection.querySelector('.max-w-7xl');
        if (content) {
            const flexContainer = content.querySelector('.flex');
            if (flexContainer) {
                const rightContent = flexContainer.children[1]; // Second child (right content)
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
    }

    // Method to refresh background with new random image
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
    // Small delay to ensure other scripts are loaded
    setTimeout(() => {
        window.pexelsBackground = new PexelsBackground();
    }, 100);
});

// Export for potential external use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PexelsBackground;
}
