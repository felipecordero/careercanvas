class PexelsBackground {
    constructor() {
        this.apiKey = null;
        this.queries = this.getQueries();
        this.currentImage = null;
        this.usedImages = new Set();
        this.defaultImage = this.getDefaultImage();
        this.fallbackGradient =
          'linear-gradient(135deg, var(--color-primary-dark) 0%, var(--color-primary) 20%, var(--color-primary-light) 40%, var(--color-primary) 60%, var(--color-primary-dark) 75%, var(--color-primary-dark) 90%, var(--color-primary) 100%)';

        this.waitForConfig();
    }

    /* ------------------------
       Loader helpers
    ------------------------ */
    startLoading(hero) {
        hero.classList.add('bg-loading');
        hero.classList.remove('bg-loaded');
    }

    stopLoading(hero) {
        hero.classList.remove('bg-loading');
        hero.classList.add('bg-loaded');
    }

    getDefaultImage() {
        return window.DEFAULT_HERO_IMAGE || '/images/hero-default-bg.jpg';
    }

    getQueries() {
        return window.PEXELS_QUERIES || ['nature'];
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
        const hero = document.querySelector('.hero-section');
        if (!hero) return;

        this.startLoading(hero);
        this.currentImage = this.defaultImage;
        this.applyBackgroundImage(hero, true);
    }

    async loadRandomBackground() {
        // keeping your structure intact
        throw new Error('No API key, fallback');
    }

    applyBackgroundImage(hero, isDefaultImage = false) {
        this.startLoading(hero);

        const bgContainer = document.createElement('div');
        bgContainer.className = 'pexels-bg-container';
        bgContainer.style.cssText = `
          position:absolute;
          inset:0;
          opacity:0;
          transition:opacity .8s ease;
          z-index:0;
        `;

        hero.style.position = 'relative';
        hero.appendChild(bgContainer);

        const img = new Image();
        img.src = this.currentImage;

        img.onload = () => {
            img.style.cssText = `
              width:100%;
              height:100%;
              object-fit:cover;
              position:absolute;
              top:0;
              left:0;
            `;
            bgContainer.appendChild(img);

            setTimeout(() => {
                bgContainer.style.opacity = '1';
                this.stopLoading(hero);
            }, 300);
        };

        img.onerror = () => {
            this.useFallbackBackground(hero);
        };
    }

    useFallbackBackground(hero) {
        hero.style.background = this.fallbackGradient;
        this.stopLoading(hero);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.pexelsBackground = new PexelsBackground();
});
