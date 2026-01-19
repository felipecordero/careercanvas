class PexelsBackground {
    constructor() {
        this.apiKey = null;
        this.currentImage = null;
        this.defaultImage = window.DEFAULT_HERO_IMAGE || '/images/hero-default-bg.jpg';
        this.fallbackGradient =
          'linear-gradient(135deg, var(--color-primary-dark) 0%, var(--color-primary) 20%, var(--color-primary-light) 40%, var(--color-primary) 60%, var(--color-primary-dark) 75%, var(--color-primary-dark) 90%, var(--color-primary) 100%)';

        this.waitForConfig();
    }

    /* ------------------------
       Loader state helpers
    ------------------------ */
    startLoading(hero) {
        hero.classList.add('bg-loading');
    }

    stopLoading(hero) {
        hero.classList.remove('bg-loading');
        hero.classList.add('bg-loaded');
    }

    waitForConfig() {
        setTimeout(() => {
            if (window.PEXELS_API_KEY) {
                this.apiKey = window.PEXELS_API_KEY;
                this.loadRandomBackground();
            } else {
                this.useDefaultImage();
            }
        }, 100);
    }

    async loadRandomBackground() {
        // You already fallback without API key
        this.useDefaultImage();
    }

    useDefaultImage() {
        const hero = document.querySelector('.hero-section');
        if (!hero) return;

        this.startLoading(hero);
        this.currentImage = this.defaultImage;
        this.applyBackground(hero);
    }

    applyBackground(hero) {
        this.startLoading(hero);

        const bgContainer = document.createElement('div');
        bgContainer.className = 'pexels-bg-container';
        bgContainer.style.cssText = `
          position:absolute;
          inset:0;
          z-index:0;
          opacity:0;
          transition:opacity .8s ease;
        `;

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

            requestAnimationFrame(() => {
                bgContainer.style.opacity = '1';
                this.stopLoading(hero);
            });
        };

        img.onerror = () => {
            hero.style.background = this.fallbackGradient;
            this.stopLoading(hero);
        };
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.pexelsBackground = new PexelsBackground();
});
