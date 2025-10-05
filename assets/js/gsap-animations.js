// GSAP Animations System - Hero Section Only

// Configuration object for hero animations
const ANIMATION_CONFIG = {
    hero: {
        diagonalLines: { count: 4, opacity: 0.4, scaleX: 4.0 }
    }
};

// Common animation properties for hero
const COMMON_ANIMATIONS = {
    fadeIn: { opacity: 1, y: 0, rotationX: 0, duration: 0.8, ease: "power2.out" },
    scrollEnter: { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: "back.out(1.7)" }
};

// Central animation registry to prevent duplicates
const ANIMATION_REGISTRY = {
    registeredElements: new Set(),
    
    // Register an element to prevent duplicate animations
    registerElement: (element, type) => {
        const key = `${element.tagName}-${element.className.split(' ')[0]}-${type}`;
        if (ANIMATION_REGISTRY.registeredElements.has(key)) {
            return false; // Already registered
        }
        ANIMATION_REGISTRY.registeredElements.add(key);
        return true;
    },
    
    // Check if element is already animated
    isElementAnimated: (element, type) => {
        const key = `${element.tagName}-${element.className.split(' ')[0]}-${type}`;
        return ANIMATION_REGISTRY.registeredElements.has(key);
    }
};

// Utility functions for hero animations
const Utils = {
    // Create container with fallback
    createContainer: (parent, className, fallback) => {
        return parent.querySelector(className) || (() => {
            const container = document.createElement('div');
            container.className = fallback;
            parent.appendChild(container);
            return container;
        })();
    },

    // Random position generator
    randomPosition: (min = 10, max = 90) => ({
        x: Math.random() * (max - min) + min,
        y: Math.random() * (max - min) + min
    })
};

// Mouse tracking for quick fact lighting effects
function initQuickFactLighting() {
    const quickFactCards = document.querySelectorAll('.quick-fact-card');
    
    if (quickFactCards.length === 0) return;
    
    quickFactCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            
            card.style.setProperty('--mouse-x', `${x}%`);
            card.style.setProperty('--mouse-y', `${y}%`);
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.setProperty('--mouse-x', '50%');
            card.style.setProperty('--mouse-y', '50%');
        });
    });
}

// Main initialization
document.addEventListener('DOMContentLoaded', function() {
    if (typeof gsap === 'undefined') {
        console.warn('GSAP not loaded. Loading from CDN...');
        loadGSAP();
        return;
    }
    
    initializeHeroAnimations();
});


// GSAP loader with fallback
function loadGSAP() {
    const loadScript = (src, fallback, onLoad) => {
        console.log(`Loading GSAP from: ${src}`);
        const script = document.createElement('script');
        script.src = src;
        script.onerror = (error) => {
            console.warn(`Failed to load GSAP from ${src}, trying fallback: ${fallback}`);
            const fallbackScript = document.createElement('script');
            fallbackScript.src = fallback;
            fallbackScript.onload = () => {
                console.log('GSAP loaded from fallback successfully');
                onLoad();
            };
            fallbackScript.onerror = (fallbackError) => {
                console.error('Both GSAP sources failed to load:', error, fallbackError);
            };
            document.head.appendChild(fallbackScript);
        };
        script.onload = () => {
            console.log('GSAP loaded successfully from primary source');
            onLoad();
        };
        document.head.appendChild(script);
    };

    loadScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.13.0/gsap.min.js', 
        'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.13.0/gsap.min.js',
        () => {
            initializeHeroAnimations();
        });
}

// Main initialization function - Hero only (optimized)
function initializeHeroAnimations() {
    console.log('Initializing hero animation system...');
    
    const heroSection = document.querySelector('.hero-section');
    if (!heroSection) return;

    console.log('🎯 Initializing hero animations...');
    
    // Set initial states for all animated elements
    const animatedElements = heroSection.querySelectorAll('[data-animation]');
    const bgDecorations = heroSection.querySelectorAll('.absolute.opacity-10 > div');
    const quickFactCards = document.querySelectorAll('.quick-fact-card');
    const locationBadge = heroSection.querySelector('[data-animation="location-badge"]');
    
    // Only animate elements that exist
    if (animatedElements.length > 0) {
        gsap.set(animatedElements, { opacity: 0, y: 50, rotationX: -15 });
    }
    if (bgDecorations.length > 0) {
        gsap.set(bgDecorations, { opacity: 0, scale: 0.5, rotation: -180 });
    }
    if (quickFactCards.length > 0) {
        gsap.set(quickFactCards, { opacity: 0, y: 20, scale: 0.95 });
    }
    if (locationBadge) {
        gsap.set(locationBadge, { opacity: 0, y: 20 });
    }
    
    // Initialize floating background animations
    bgDecorations.forEach((circle, index) => {
        const delay = index * 0.5;
        const floatX = (Math.random() - 0.5) * 40;
        const floatY = (Math.random() - 0.5) * 30;
        const floatDuration = 3 + Math.random() * 2;
        
        gsap.timeline({ repeat: -1, yoyo: true, delay })
            .to(circle, { x: floatX, y: floatY, duration: floatDuration, ease: "power1.inOut" });
        
        gsap.to(circle, { rotation: 360, duration: 8 + Math.random() * 4, ease: "none", repeat: -1, delay });
        circle.setAttribute('data-natural-animation', 'true');
    });
    
    // Initialize mouse tracking
    initMouseTracking(heroSection);
    
    // Initialize background shapes
    initSectionBackgroundAnimations('.hero-section', ANIMATION_CONFIG.hero);
    
    // Initialize typewriter effect
    initTypingEffect();
    
    // Initialize quick fact lighting effects
    initQuickFactLighting();
    
    // Play hero entrance animation
    const tl = gsap.timeline();
    
    // Only animate elements that exist
    if (animatedElements.length > 0) {
        tl.to(animatedElements, { 
            opacity: 1, 
            y: 0, 
            rotationX: 0, 
            scale: 1,
            duration: 0.8, 
            stagger: 0.1,
            ease: "back.out(1.7)" 
        });
    }
    
    if (bgDecorations.length > 0) {
        tl.to(bgDecorations, { 
            opacity: 0.1, 
            scale: 1, 
            rotation: 0, 
            duration: 1, 
            stagger: 0.1 
        }, "-=0.6");
    }
    
    if (quickFactCards.length > 0) {
        tl.to(quickFactCards, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            stagger: 0.1,
            ease: "power2.out"
        }, "-=0.4");
    }
    
    if (locationBadge) {
        tl.to(locationBadge, {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: "back.out(1.7)"
        }, "-=0.3");
    }
}

// Enhanced typewriter effect with multiple concepts
let typingEffectInitialized = false;

function initTypingEffect() {
    if (typingEffectInitialized) return;
    
    const typewriterElement = document.querySelector('.typewriter');
    if (!typewriterElement) return;

    // Get the concepts from the HTML element (which comes from Hugo i18n)
    const originalText = typewriterElement.getAttribute('data-original-text') || typewriterElement.textContent;
    const concepts = originalText.split('. ').map(concept => concept.trim()).filter(concept => concept.length > 0);
    let currentConceptIndex = 0;
    
    typewriterElement.textContent = '';
    typewriterElement.style.color = 'transparent';
    
    const cursor = document.createElement('span');
    cursor.className = 'typing-cursor';
    Object.assign(cursor.style, {
        display: 'inline-block',
        width: '2px',
        height: '1.2em',
        backgroundColor: 'var(--color-primary-light)',
        marginLeft: '2px',
        verticalAlign: 'text-bottom'
    });
    
    typewriterElement.appendChild(cursor);

    // Cursor blinking animation
    gsap.to(cursor, {
        opacity: 0,
        duration: 0.7,
        ease: "power2.inOut",
        yoyo: true,
        repeat: -1
    });

    function typeConcept(concept, onComplete) {
        const chars = concept.split('');
        const timeline = gsap.timeline();
        
        // Type the concept
        chars.forEach((char, index) => {
            timeline.to(typewriterElement, {
                duration: 0.08,
                onUpdate: function() {
                    const textContent = chars.slice(0, index + 1).join('');
                    typewriterElement.textContent = textContent;
                    typewriterElement.appendChild(cursor);
                    typewriterElement.style.color = 'inherit';
                }
            });
        });
        
        // Pause after typing
        timeline.to(typewriterElement, { duration: 1.5 });
        
        // Erase the concept
        const reversedChars = [...chars].reverse();
        reversedChars.forEach((char, index) => {
            timeline.to(typewriterElement, {
                duration: 0.04,
                onUpdate: function() {
                    const textContent = reversedChars.slice(index + 1).reverse().join('');
                    typewriterElement.textContent = textContent;
                    typewriterElement.appendChild(cursor);
                }
            });
        });
        
        // Pause before next concept
        timeline.to(typewriterElement, { duration: 0.5 });
        
        timeline.call(onComplete);
    }

    function startTypingLoop() {
        if (currentConceptIndex >= concepts.length) {
            currentConceptIndex = 0;
        }
        
        typeConcept(concepts[currentConceptIndex], () => {
            currentConceptIndex++;
            setTimeout(startTypingLoop, 200);
        });
    }

    // Start the typing effect after a delay
    setTimeout(startTypingLoop, 1000);
    
    typingEffectInitialized = true;
}

function initMouseTracking(heroSection) {
    let mouseX = 0, mouseY = 0, isInHero = false;
    let updateTimeout = null;
    const throttleDelay = 16;

    const events = {
        mouseenter: () => { 
            isInHero = true; 
            updateMouseEffects(); 
        },
        mouseleave: () => { 
            isInHero = false; 
            resetMouseEffects(); 
        },
        mousemove: (e) => {
            if (!isInHero) return;
            const rect = heroSection.getBoundingClientRect();
            mouseX = (e.clientX - rect.left) / rect.width;
            mouseY = (e.clientY - rect.top) / rect.height;
            
            if (!updateTimeout) {
                updateTimeout = setTimeout(() => {
                    updateMouseEffects();
                    updateTimeout = null;
                }, throttleDelay);
            }
        }
    };

    Object.entries(events).forEach(([event, handler]) => {
        heroSection.addEventListener(event, handler);
    });

    function updateMouseEffects() {
        if (!isInHero) return;
        
        const normalizedX = (mouseX - 0.5) * 2;
        const normalizedY = (mouseY - 0.5) * 2;
        
        const elementTypes = [
            { selector: '.morphing-shape', sensitivity: { x: 40, y: 30, rotate: 25, scale: 0.2 } },
            { selector: '.diagonal-line', sensitivity: { x: 25, y: 20, rotate: 15, scale: 0.1 } },
            { selector: '.spline-curve', sensitivity: { x: 15, y: 12, rotate: 8, scale: 0.05 } }
        ];

        elementTypes.forEach(({ selector, sensitivity }) => {
            const elements = heroSection.querySelectorAll(selector);
            elements.forEach((el, index) => {
                if (el.hasAttribute('data-natural-animation')) return;
                
                const multiplier = index + 1;
                gsap.to(el, {
                    x: normalizedX * (sensitivity.x + index * 8),
                    y: normalizedY * (sensitivity.y + index * 6),
                    rotation: normalizedX * (sensitivity.rotate + index * 5),
                    scale: 1 + Math.abs(normalizedX + normalizedY) * (sensitivity.scale + index * 0.05),
                    duration: 1.2 + index * 0.3,
                    ease: "power2.out"
                });
            });
        });

        const glowIntensity = Math.abs(normalizedX + normalizedY) * 0.3;
        gsap.to(heroSection, {
            boxShadow: `0 0 ${20 + glowIntensity * 50}px var(--color-primary-light)`,
            duration: 0.5,
            ease: "power2.out"
        });
    }

    function resetMouseEffects() {
        const elementsToReset = heroSection.querySelectorAll('.morphing-shape, .diagonal-line, .spline-curve');
        const resetElements = Array.from(elementsToReset).filter(el => !el.hasAttribute('data-natural-animation'));
        
        gsap.to(resetElements, {
            x: 0, y: 0, rotation: 0, scale: 1,
            duration: 0.8, ease: "power2.out"
        });
        
        gsap.to(heroSection, { boxShadow: 'none', duration: 0.5, ease: "power2.out" });
    }
}

// Background animations system for hero
function createAndAnimateDiagonalLines(container, options = {}) {
    const config = { count: 4, background: 'linear-gradient(45deg, transparent, var(--color-primary-light), transparent)', height: 3, width: 1200, opacity: 0.4, scaleX: 4.0, duration: 4, rotationDuration: 8, ...options };
    
    const lines = Array.from({ length: config.count }, (_, i) => {
        const line = document.createElement('div');
        const pos = Utils.randomPosition();
        Object.assign(line.style, {
            position: 'absolute',
            background: config.background,
            height: config.height + 'px',
            width: config.width + 'px',
            opacity: '0',
            zIndex: '1',
            left: pos.x + '%',
            top: pos.y + '%',
            transform: `rotate(${Math.random() * 360}deg)`,
            transformOrigin: 'center center'
        });
        line.className = 'diagonal-line';
        container.appendChild(line);
        return line;
    });

    lines.forEach((line, index) => {
        gsap.timeline({ repeat: -1, yoyo: true })
            .to(line, { opacity: config.opacity, scaleX: config.scaleX, duration: config.duration, delay: index * 0.8, ease: "power2.inOut" })
            .to(line, { rotation: '+=180', duration: config.rotationDuration, ease: "none" }, 0);
    });

    return lines;
}

function createAndAnimateSplineCurves(container, options = {}) {
    const config = { count: 3, size: 180, border: '3px solid var(--color-primary)', opacity: 0.6, scale: 1.2, duration: 6, rotationDuration: 10, ...options };
    
    const curves = Array.from({ length: config.count }, (_, i) => {
        const curve = document.createElement('div');
        const pos = Utils.randomPosition();
        Object.assign(curve.style, {
            position: 'absolute',
            width: config.size + 'px',
            height: config.size + 'px',
            border: config.border,
            borderRadius: '50%',
            opacity: '0',
            zIndex: '1',
            left: pos.x + '%',
            top: pos.y + '%'
        });
        curve.className = 'spline-curve';
        container.appendChild(curve);
        return curve;
    });

    curves.forEach((curve, index) => {
        gsap.timeline({ repeat: -1, yoyo: true })
            .to(curve, { opacity: config.opacity, scale: config.scale, borderRadius: '0%', duration: config.duration, delay: index * 1.2, ease: "power2.inOut" })
            .to(curve, { rotation: 360, duration: config.rotationDuration, ease: "none" }, 0);
    });

    return curves;
}

function initSectionBackgroundAnimations(sectionSelector, options = {}) {
    const section = document.querySelector(sectionSelector);
    if (!section) {
        console.warn(`Section with selector "${sectionSelector}" not found. Skipping background animations.`);
        return;
    }

    const shapesContainer = Utils.createContainer(section, '.morphing-shapes', 'morphing-shapes absolute inset-0 pointer-events-none overflow-hidden');

    // Create background animations immediately for hero section
    shapesContainer.innerHTML = '';
    createAndAnimateDiagonalLines(shapesContainer, options.diagonalLines);
    createAndAnimateSplineCurves(shapesContainer, options.splineCurves);
}

// Performance optimizations
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        gsap.globalTimeline.pause();
    } else {
        gsap.globalTimeline.resume();
    }
});

window.addEventListener('resize', function() {
    // Refresh any GSAP animations if needed
    if (typeof gsap !== 'undefined') {
        gsap.globalTimeline.invalidate();
    }
});