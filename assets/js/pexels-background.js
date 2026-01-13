// Pexels Background Image System
// Fetches random landscape images from Pexels API for hero background
// Enhanced with default image fallback and iOS/mobile support

class PexelsBackground {
    constructor() {
        this.apiKey = null;
        this.queries = this.getQueries();
        this.currentImage = null;
        this.usedImages = new Set();
        this.defaultImage = this.getDefaultImage();
        this.fallbackGradient = 'linear-gradient(135deg, var(--color-primary-dark) 0%, var(--color-primary) 20%, var(--color-primary-light) 40%, var(--color-primary) 60%, var(--color-primary-dark) 75%, var(--color-primary-dark) 90%, var(--color-primary) 100%)';
        
        // Hide gradient immediately to prevent flash
        this.hideGradientBackground();
        
        // Wait for configuration to be loaded, then initialize
        this.waitForConfig();
    }

    // Get default image from configuration
    getDefaultImage() {
        if (window.DEFAULT_HERO_IMAGE) {
            return window.DEFAULT_HERO_IMAGE;
        }
        return '/images/hero-default-bg.jpg';
    }

    // Detect iOS devices (all browsers on iOS use WebKit)
    isIOS() {
        return /iPad|iPhone|iPod/.test(navigator.userAgent) || 
               (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    }
    
    // Detect any mobile device
    isMobileDevice() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
               window.innerWidth <= 768;
    }

    waitForConfig() {
        const checkConfig = () => {
            if (window.PEXELS_API_KEY) {
                this.apiKey = window.PEXELS_API_KEY;
                console.log('Pexels API key found');
                this.init();
            } else {
                if (!this.configCheckStartTime) {
                    this.configCheckStartTime = Date.now();
                }
                
                if (Date.now() - this.configCheckStartTime > 2000) {
                    console.log('No Pexels API key configured, using default image');
                    this.useDefaultImage();
                } else {
                    setTimeout(checkConfig, 100);
                }
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
            this.useDefaultImage();
        }
    }

    async useDefaultImage() {
        console.log('useDefaultImage called');
        console.log('Default image path:', this.defaultImage);
        
        try {
            const imageExists = await this.checkImageExists(this.defaultImage);
            
            if (imageExists) {
                console.log('✅ Default image exists and loaded successfully');
                this.currentImage = this.defaultImage;
                this.applyBackgroundImage(true);
            } else {
                console.warn('❌ Default image not found at:', this.defaultImage);
                console.log('Falling back to gradient');
                this.useFallbackBackground();
            }
        } catch (error) {
            console.error('Error in useDefaultImage:', error);
            this.useFallbackBackground();
        }
    }

    checkImageExists(imageUrl) {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve(true);
            img.onerror = () => resolve(false);
            img.src = imageUrl;
        });
    }

    async loadRandomBackground() {
        const randomQuery = this.queries[Math.floor(Math.random() * this.queries.length)];
        const randomPage = Math.floor(Math.random() * 10) + 1;
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
            const availablePhotos = data.photos.filter(photo => !this.usedImages.has(photo.id));
            
            if (availablePhotos.length === 0) {
                this.usedImages.clear();
                const randomPhoto = data.photos[Math.floor(Math.random() * data.photos.length)];
                this.currentImage = randomPhoto.src.large2x || randomPhoto.src.large || randomPhoto.src.medium;
                this.usedImages.add(randomPhoto.id);
            } else {
                const randomPhoto = availablePhotos[Math.floor(Math.random() * availablePhotos.length)];
                this.currentImage = randomPhoto.src.large2x || randomPhoto.src.large || randomPhoto.src.medium;
                this.usedImages.add(randomPhoto.id);
            }
            
            this.applyBackgroundImage(false);
        } else {
            throw new Error('No photos found');
        }
    }

    applyBackgroundImage(isDefaultImage = false) {
        const heroSection = document.querySelector('.hero-section');
        if (!heroSection) return;

        // Detect iOS and mobile devices
        const isIOSDevice = this.isIOS();
        const isMobile = this.isMobileDevice();
        
        console.log('Applying background - iOS:', isIOSDevice, 'Mobile:', isMobile);

        // Create background container
        const bgContainer = document.createElement('div');
        bgContainer.className = 'pexels-bg-container';
        bgContainer.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            width: 100%;
            height: 100%;
            z-index: 0;
            opacity: 0;
            transition: opacity 0.8s ease-in-out;
            overflow: hidden;
        `;

        // Ensure hero section has proper positioning
        if (heroSection.style.position === '' || heroSection.style.position === 'static') {
            heroSection.style.position = 'relative';
        }

        // Create overlay
        const overlayOpacity = isDefaultImage ? 0.3 : 0.2;
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
                rgba(0, 0, 0, ${overlayOpacity}) 25%,
                rgba(0, 0, 0, 0.3) 50%,
                rgba(0, 0, 0, ${overlayOpacity}) 75%,
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

        // Preload the image
        const img = new Image();
        
        img.onload = () => {
            console.log('✅ Image loaded successfully:', this.currentImage);
            
            // **KEY FIX: Use <img> tag for iOS/mobile instead of CSS background**
            if (isIOSDevice || isMobile) {
                console.log('Using <img> tag for mobile/iOS');
                
                // Create actual img element for better mobile performance
                const bgImage = document.createElement('img');
                bgImage.src = this.currentImage;
                bgImage.alt = 'Hero background';
                bgImage.style.cssText = `
                    position: absolute !important;
                    top: 0 !important;
                    left: 0 !important;
                    width: 100% !important;
                    height: 100% !important;
                    min-width: 100% !important;
                    min-height: 100% !important;
                    object-fit: cover !important;
                    object-position: center !important;
                    display: block !important;
                    margin: 0 !important;
                    padding: 0 !important;
                `;
                
                // iOS performance optimizations
                if (isIOSDevice) {
                    bgImage.style.transform = 'translateZ(0)';
                    bgImage.style.webkitTransform = 'translateZ(0)';
                    bgImage.style.webkitBackfaceVisibility = 'hidden';
                    bgImage.style.backfaceVisibility = 'hidden';
                    console.log('Applied iOS optimizations');
                }
                
                bgContainer.appendChild(bgImage);
                console.log('Image element appended to container');
            } else {
                // Desktop: use CSS background-image
                console.log('Using CSS background-image for desktop');
                bgContainer.style.backgroundImage = `url(${this.currentImage})`;
                bgContainer.style.backgroundSize = 'cover';
                bgContainer.style.backgroundPosition = 'center';
                bgContainer.style.backgroundRepeat = 'no-repeat';
                bgContainer.style.backgroundAttachment = 'fixed';
            }
            
            // Remove gradient-bg class and add pexels-bg class
            heroSection.classList.remove('gradient-bg');
            heroSection.classList.add('pexels-bg');
            
            if (isDefaultImage) {
                heroSection.classList.add('default-bg');
            }
            
            if (isIOSDevice) {
                heroSection.classList.add('ios-device');
            }
            if (isMobile) {
                heroSection.classList.add('mobile-device');
            }
            
            console.log('Hero section classes:', heroSection.className);
            
            // Fade in
            setTimeout(() => {
                bgContainer.style.opacity = '1';
                overlay.style.opacity = '1';
                console.log('Background image faded in');
            }, 50);
        };
        
        img.onerror = () => {
            console.error('❌ Failed to load image:', this.currentImage);
            console.log('Attempting fallback...');
            this.useFallbackBackground();
        };
        
        console.log('Starting to load image:', this.currentImage);
        img.src = this.currentImage;
    }

    useFallbackBackground() {
        const heroSection = document.querySelector('.hero-section');
        if (!heroSection) return;

        console.log('Using gradient fallback');

        heroSection.style.background = this.fallbackGradient;
        heroSection.style.backgroundImage = 'none';
        heroSection.classList.add('gradient-bg');
        heroSection.classList.remove('pexels-bg');
        heroSection.classList.remove('default-bg');
        
        const existingBgContainer = heroSection.querySelector('.pexels-bg-container');
        const existingOverlay = heroSection.querySelector('.pexels-overlay');
        if (existingBgContainer) {
            existingBgContainer.remove();
        }
        if (existingOverlay) {
            existingOverlay.remove();
        }
        
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
    }

    async refreshBackground() {
        if (this.apiKey) {
            try {
                await this.loadRandomBackground();
            } catch (error) {
                console.error('Failed to refresh background:', error);
                this.useDefaultImage();
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

// Export for potential external use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PexelsBackground;
}
