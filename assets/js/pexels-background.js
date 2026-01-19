class PexelsBackground {
    constructor() {
        this.apiKey = null;
        this.queries = this.getQueries();
        this.currentImage = null;
        this.usedImages = new Set();
        this.defaultImage = this.getDefaultImage();
        this.fallbackGradient = 'linear-gradient(135deg, var(--color-primary-dark) 0%, var(--color-primary) 20%, var(--color-primary-light) 40%, var(--color-primary) 60%, var(--color-primary-dark) 75%, var(--color-primary-dark) 90%, var(--color-primary) 100%)';

        this.waitForConfig();
    }

    showLoader() {
        const loader = document.getElementById('page-loader');
        if (loader) loader.classList.remove('hidden');
    }

    hideLoader() {
        const loader = document.getElementById('page-loader');
        if (loader) loader.classList.add('hidden');
    }

    getDefaultImage() {
        return window.DEFAULT_HERO_IMAGE || '/images/hero-default-bg.jpg';
    }

    isIOS() {
        return /iPad|iPhone|iPod/.test(navigator.userAgent) ||
               (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    }

    isMobileDevice() {
        return window.innerWidth <= 768;
    }

    waitForConfig() {
        setTimeout(() => {
            if (window.PEXELS_API_KEY) {
                this.apiKey = window.PEXELS_API_KEY;
                this.init();
            } else {
                this.useDefaultImage();
            }
        }, 100);
    }

    async init() {
        try {
            await this.loadRandomBackground();
        } catch {
            this.useDefaultImage();
        }
    }

    async useDefaultImage() {
        this.showLoader();
        this.currentImage = this.defaultImage;
        this.applyBackgroundImage(true);
    }

    async loadRandomBackground() {
        this.showLoader();
        throw new Error('API disabled'); // default path
    }

    applyBackgroundImage(isDefaultImage = false) {
        const heroSection = document.querySelector('.hero-section');
        if (!heroSection) return;

        this.showLoader();

        const bgContainer = document.createElement('div');
        bgContainer.className = 'pexels-bg-container';
        bgContainer.style.cssText = `
          position:absolute; inset:0;
          opacity:0; transition:opacity .8s ease;
          z-index:0;
        `;

        heroSection.style.position = 'relative';
        heroSection.appendChild(bgContainer);

        const img = new Image();
        img.src = this.currentImage;
        img.onload = () => {
            bgContainer.appendChild(img);
            img.style.cssText = `
              width:100%; height:100%;
              object-fit:cover;
              position:absolute;
            `;

            setTimeout(() => {
                bgContainer.style.opacity = '1';
                this.hideLoader();
            }, 300);
        };

        img.onerror = () => this.useFallbackBackground();
    }

    useFallbackBackground() {
        const heroSection = document.querySelector('.hero-section');
        if (!heroSection) return;
        heroSection.style.background = this.fallbackGradient;
        this.hideLoader();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.pexelsBackground = new PexelsBackground();
});
