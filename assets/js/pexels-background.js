class PexelsBackground {
  constructor() {
    this.hero = document.querySelector('.hero-section');
    this.defaultImage = window.DEFAULT_HERO_IMAGE || '/images/hero-default-bg.jpg';

    if (!this.hero) return;

    // 🔒 FAILSAFE: loader can NEVER stay forever
    setTimeout(() => {
      this.hideLoader();
    }, 3000);

    this.showLoader();
    this.loadBackground();
  }

  showLoader() {
    this.hero.classList.add('bg-loading');
  }

  hideLoader() {
    this.hero.classList.remove('bg-loading');
    this.hero.classList.add('bg-loaded');
  }

  loadBackground() {
    const img = new Image();
    img.src = this.defaultImage;

    img.onload = () => {
      this.applyImage(img);
    };

    img.onerror = () => {
      this.useGradientFallback();
    };
  }

  applyImage(img) {
    const container = document.createElement('div');
    container.className = 'pexels-bg-container';
    container.style.cssText = `
      position:absolute;
      inset:0;
      z-index:0;
      background-image:url(${img.src});
      background-size:cover;
      background-position:center;
      background-repeat:no-repeat;
      opacity:0;
      transition:opacity .6s ease;
    `;

    this.hero.appendChild(container);

    requestAnimationFrame(() => {
      container.style.opacity = '1';
      this.hideLoader();
    });
  }

  useGradientFallback() {
    this.hero.style.background =
      'linear-gradient(135deg, var(--color-primary-dark), var(--color-primary))';
    this.hideLoader();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new PexelsBackground();
});
