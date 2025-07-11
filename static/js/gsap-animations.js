// GSAP Hero Section Animations
document.addEventListener('DOMContentLoaded', function() {
    // Check if GSAP is loaded
    if (typeof gsap === 'undefined') {
        console.warn('GSAP not loaded. Loading from CDN...');
        loadGSAP();
        return;
    }
    
    initHeroAnimations();
    initParticleSystem();
    initMorphingShapes();
    initScrollEffects();
    initMouseTracking();
    
    // Initialize background animations for Hero section using reusable functions
    if (typeof AnimationUtils !== 'undefined') {
      AnimationUtils.initSectionBackgroundAnimations('.hero-section', {
        diagonalLines: {
          count: 4,
          opacity: 0.6,
          scaleX: 1.5
        },
        splineCurves: {
          count: 3,
          opacity: 0.4,
          scale: 1.2
        }
      });
    }
});

function loadGSAP() {
    // Try to load GSAP from node_modules first
    const localScript = document.createElement('script');
    localScript.src = '/node_modules/gsap/dist/gsap.min.js';
    localScript.onerror = function() {
        // Fallback to CDN if local file not found
        const cdnScript = document.createElement('script');
        cdnScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.13.0/gsap.min.js';
        cdnScript.onload = function() {
            loadScrollTrigger();
        };
        document.head.appendChild(cdnScript);
    };
    localScript.onload = function() {
        loadScrollTrigger();
    };
    document.head.appendChild(localScript);
}

function loadScrollTrigger() {
    const localScrollTrigger = document.createElement('script');
    localScrollTrigger.src = '/node_modules/gsap/dist/ScrollTrigger.min.js';
    localScrollTrigger.onerror = function() {
        // Fallback to CDN
        const cdnScript = document.createElement('script');
        cdnScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.13.0/ScrollTrigger.min.js';
        cdnScript.onload = function() {
            gsap.registerPlugin(ScrollTrigger);
            initHeroAnimations();
            initParticleSystem();
            initMorphingShapes();
            initScrollEffects();
            initMouseTracking();
        };
        document.head.appendChild(cdnScript);
    };
    localScrollTrigger.onload = function() {
        gsap.registerPlugin(ScrollTrigger);
        initHeroAnimations();
        initParticleSystem();
        initMorphingShapes();
        initScrollEffects();
        initMouseTracking();
    };
    document.head.appendChild(localScrollTrigger);
}

function initHeroAnimations() {
    const heroSection = document.querySelector('.hero-section');
    if (!heroSection) return;

    // Set initial states
    setInitialStates();

    // Create ScrollTrigger with toggleActions
    ScrollTrigger.create({
        trigger: heroSection,
        start: "top 80%",
        end: "bottom 20%",
        toggleActions: "play none none reverse",
        onEnter: () => {
            console.log('Hero section entered - playing animation');
            playHeroAnimation();
        },
        onEnterBack: () => {
            console.log('Hero section re-entered - playing animation');
            playHeroAnimation();
        },
        onLeave: () => {
            console.log('Hero section left - reversing animation');
        },
        onLeaveBack: () => {
            console.log('Hero section re-left - reversing animation');
        }
    });

    // Add floating animation to profile image
    const profileImage = heroSection.querySelector('.lg\\:w-1\\/2 .relative');
    if (profileImage) {
        gsap.to(profileImage, {
            y: -10,
            duration: 2,
            ease: "power1.inOut",
            yoyo: true,
            repeat: -1
        });
    }

    // Enhanced hover effects
    initEnhancedHoverEffects();
}

function playHeroAnimation() {
    const heroSection = document.querySelector('.hero-section');
    if (!heroSection) {
        console.error('Hero section not found');
        return;
    }

    // Reset all elements to initial state first
    setInitialStates();

    // Debug: Check if elements are found
    const textElements = [
        '.hero-section [data-animation="greeting"]',
        '.hero-section [data-animation="name"]',
        '.hero-section [data-animation="tagline"]',
        '.hero-section [data-animation="description"]',
        '.hero-section [data-animation="buttons"]',
        '.hero-section [data-animation="social"]'
    ];

    console.log('Found text elements:', textElements.map(selector => document.querySelector(selector)));

    // Create a fresh timeline
    const tl = gsap.timeline();

    tl.to(textElements, {
        opacity: 1,
        y: 0,
        rotationX: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power2.out"
    });

    // Profile image animation
    const profileImage = heroSection.querySelector('.lg\\:w-1\\/2 .relative');
    if (profileImage) {
        console.log('Profile image found');
        tl.to(profileImage, {
            opacity: 1,
            scale: 1,
            rotationY: 0,
            y: 0,
            duration: 1.2,
            ease: "back.out(1.7)"
        }, "-=0.5");
    } else {
        console.error('Profile image not found');
    }

    // Background decorations animation
    const bgDecorations = heroSection.querySelectorAll('.absolute.opacity-10 > div');
    console.log('Found background decorations:', bgDecorations.length);
    tl.to(bgDecorations, {
        opacity: 0.1,
        scale: 1,
        rotation: 0,
        duration: 1,
        stagger: 0.1,
        ease: "power2.out"
    }, "-=0.8");
}

function setInitialStates() {
    const heroSection = document.querySelector('.hero-section');
    if (!heroSection) return;

    // Set text elements to initial state
    const textElements = heroSection.querySelectorAll('[data-animation]');
    gsap.set(textElements, {
        opacity: 0,
        y: 50,
        rotationX: -15
    });

    // Set profile image to initial state
    const profileImage = heroSection.querySelector('.lg\\:w-1\\/2 .relative');
    if (profileImage) {
        gsap.set(profileImage, {
            opacity: 0,
            scale: 0.8,
            rotationY: -20,
            y: 100
        });
    }

    // Set background decorations to initial state
    const bgDecorations = heroSection.querySelectorAll('.absolute.opacity-10 > div');
    gsap.set(bgDecorations, {
        opacity: 0,
        scale: 0.5,
        rotation: -180
    });
}

function initParticleSystem() {
    const heroSection = document.querySelector('.hero-section');
    if (!heroSection) return;

    // Create particle container
    let particleContainer = heroSection.querySelector('.particle-container');
    if (!particleContainer) {
        particleContainer = document.createElement('div');
        particleContainer.className = 'particle-container absolute inset-0 pointer-events-none overflow-hidden';
        heroSection.appendChild(particleContainer);
    }

    // Clear existing particles
    particleContainer.innerHTML = '';

    // Create particles
    const particleCount = window.innerWidth < 768 ? 10 : 20;
    const particles = [];

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle absolute w-2 h-2 rounded-full';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.bottom = '-20px';
        particle.style.backgroundColor = Math.random() > 0.5 ? '#3B82F6' : '#8B5CF6';
        particle.style.opacity = '0.6';
        particleContainer.appendChild(particle);
        particles.push(particle);
    }

    // Animate particles with ScrollTrigger
    ScrollTrigger.create({
        trigger: heroSection,
        start: "top 80%",
        end: "bottom 20%",
        onEnter: () => animateParticles(particles),
        onEnterBack: () => animateParticles(particles)
    });
}

function animateParticles(particles) {
    particles.forEach((particle, index) => {
        gsap.to(particle, {
            y: -window.innerHeight - 100,
            x: Math.random() * 200 - 100,
            duration: 8 + Math.random() * 4,
            delay: index * 0.2,
            ease: "none",
            opacity: 0,
            onComplete: () => {
                particle.style.bottom = '-20px';
                particle.style.opacity = '0.6';
            }
        });
    });
}

function initMorphingShapes() {
    const heroSection = document.querySelector('.hero-section');
    if (!heroSection) return;

    // Create morphing shapes container
    let shapesContainer = heroSection.querySelector('.morphing-shapes');
    if (!shapesContainer) {
        shapesContainer = document.createElement('div');
        shapesContainer.className = 'morphing-shapes absolute inset-0 pointer-events-none overflow-hidden';
        heroSection.appendChild(shapesContainer);
    }

    // Animate shapes with ScrollTrigger
    ScrollTrigger.create({
        trigger: heroSection,
        start: "top 80%",
        end: "bottom 20%",
        onEnter: () => createAndAnimateMorphingShapes(shapesContainer),
        onEnterBack: () => createAndAnimateMorphingShapes(shapesContainer)
    });
}

function createAndAnimateMorphingShapes(shapesContainer) {
    // Clear existing shapes
    shapesContainer.innerHTML = '';

    // Create morphing shapes with random positions
    const shapes = [];
    const colors = [
        'linear-gradient(45deg, #3B82F6, #8B5CF6)',
        'linear-gradient(45deg, #8B5CF6, #EC4899)',
        'linear-gradient(45deg, #10B981, #3B82F6)'
    ];

    // Different dimensions for each shape
    const dimensions = [
        { width: '24rem', height: '24rem' }, // 384px - Large
        { width: '16rem', height: '16rem' }, // 256px - Medium
        { width: '12rem', height: '12rem' }  // 192px - Small
    ];

    for (let i = 0; i < 3; i++) {
        const shape = document.createElement('div');
        shape.className = 'morphing-shape absolute rounded-full';
        shape.style.background = colors[i];
        shape.style.width = dimensions[i].width;
        shape.style.height = dimensions[i].height;
        
        // Random positions within the hero section
        const randomX = Math.random() * 80 + 10; // 10% to 90% of width
        const randomY = Math.random() * 80 + 10; // 10% to 90% of height
        shape.style.left = randomX + '%';
        shape.style.top = randomY + '%';
        
        shape.style.opacity = '0.1';
        shape.style.transform = 'scale(0.5)';
        shapesContainer.appendChild(shape);
        shapes.push(shape);
    }

    // Create animated diagonal lines
    const diagonalLines = [];
    for (let i = 0; i < 4; i++) {
        const line = document.createElement('div');
        line.className = 'diagonal-line absolute';
        line.style.background = 'linear-gradient(45deg, transparent, rgba(59, 130, 246, 0.3), transparent)';
        line.style.height = '3px';
        line.style.width = '300px';
        line.style.opacity = '0';
        line.style.zIndex = '1';
        
        // Random positions and angles
        const randomX = Math.random() * 80 + 10; // 10% to 90% of width
        const randomY = Math.random() * 80 + 10; // 10% to 90% of height
        const randomAngle = Math.random() * 360;
        
        line.style.left = randomX + '%';
        line.style.top = randomY + '%';
        line.style.transform = `rotate(${randomAngle}deg)`;
        line.style.transformOrigin = 'center center';
        
        shapesContainer.appendChild(line);
        diagonalLines.push(line);
        console.log(`Created diagonal line ${i + 1} at ${randomX.toFixed(1)}%, ${randomY.toFixed(1)}% with angle ${randomAngle.toFixed(1)}°`);
    }

    // Create animated spline curves
    const splineCurves = [];
    for (let i = 0; i < 3; i++) {
        const curve = document.createElement('div');
        curve.className = 'spline-curve absolute';
        curve.style.width = '200px';
        curve.style.height = '200px';
        curve.style.border = '3px solid rgba(139, 92, 246, 0.2)';
        curve.style.borderRadius = '50%';
        curve.style.opacity = '0';
        curve.style.zIndex = '1';
        
        // Random positions
        const randomX = Math.random() * 80 + 10;
        const randomY = Math.random() * 80 + 10;
        curve.style.left = randomX + '%';
        curve.style.top = randomY + '%';
        
        shapesContainer.appendChild(curve);
        splineCurves.push(curve);
        console.log(`Created spline curve ${i + 1} at ${randomX.toFixed(1)}%, ${randomY.toFixed(1)}%`);
    }

    // Start the morphing animation
    animateMorphingShapes(shapes);
    animateDiagonalLines(diagonalLines);
    animateSplineCurves(splineCurves);
}

function animateMorphingShapes(shapes) {
    shapes.forEach((shape, index) => {
        const tl = gsap.timeline({ repeat: -1 });
        
        // Add delay based on index to stagger animations
        const delay = index * 2;
        
        // Animation cycle - slower and smoother
        tl.to(shape, {
            borderRadius: '50%',
            scale: 1,
            opacity: 0.15,
            duration: 6,
            ease: "power2.inOut",
            delay: delay
        })
        .to(shape, {
            borderRadius: '25%',
            rotation: 180,
            duration: 6,
            ease: "power2.inOut"
        }, "-=6")
        .to(shape, {
            borderRadius: '50%',
            rotation: 360,
            duration: 6,
            ease: "power2.inOut"
        }, "-=6")
        // Smooth vanish effect
        .to(shape, {
            opacity: 0,
            scale: 0.3,
            duration: 2,
            ease: "power2.inOut"
        })
        // Reposition and resize with smooth transition
        .call(() => {
            // Generate new random position
            const newX = Math.random() * 80 + 10;
            const newY = Math.random() * 80 + 10;
            
            // Generate new random dimensions
            const dimensions = [
                { width: '20rem', height: '20rem' }, // 320px
                { width: '14rem', height: '14rem' }, // 224px
                { width: '10rem', height: '10rem' }, // 160px
                { width: '28rem', height: '28rem' }, // 448px
                { width: '18rem', height: '18rem' }  // 288px
            ];
            const newDimension = dimensions[Math.floor(Math.random() * dimensions.length)];
            
            // Generate new random color
            const colors = [
                'linear-gradient(45deg, #3B82F6, #8B5CF6)',
                'linear-gradient(45deg, #8B5CF6, #EC4899)',
                'linear-gradient(45deg, #10B981, #3B82F6)',
                'linear-gradient(45deg, #F59E0B, #EF4444)',
                'linear-gradient(45deg, #06B6D4, #3B82F6)'
            ];
            const newColor = colors[Math.floor(Math.random() * colors.length)];
            
            // Apply new properties
            shape.style.left = newX + '%';
            shape.style.top = newY + '%';
            shape.style.width = newDimension.width;
            shape.style.height = newDimension.height;
            shape.style.background = newColor;
            shape.style.transform = 'scale(0.3) rotate(0deg)';
        })
        // Smooth reappear with new properties
        .to(shape, {
            opacity: 0.1,
            scale: 1,
            duration: 2.5,
            ease: "power2.out"
        });
    });
}

function animateDiagonalLines(lines) {
    lines.forEach((line, index) => {
        const tl = gsap.timeline({ repeat: -1, yoyo: true });
        
        tl.to(line, {
            opacity: 0.6,
            scaleX: 1.5,
            duration: 3,
            ease: "power2.inOut",
            delay: index * 0.5
        })
        .to(line, {
            rotation: line.style.transform.replace('rotate(', '').replace('deg)', '') + 180,
            duration: 6,
            ease: "none"
        }, 0);
    });
}

function animateSplineCurves(curves) {
    curves.forEach((curve, index) => {
        const tl = gsap.timeline({ repeat: -1, yoyo: true });
        
        tl.to(curve, {
            opacity: 0.4,
            scale: 1.2,
            borderRadius: '0%',
            duration: 5,
            ease: "power2.inOut",
            delay: index * 0.8
        })
        .to(curve, {
            rotation: 360,
            duration: 8,
            ease: "none"
        }, 0);
    });
}

function initScrollEffects() {
    const heroSection = document.querySelector('.hero-section');
    if (!heroSection) return;

    // Parallax effect for background elements
    gsap.to(heroSection.querySelectorAll('.absolute.opacity-10 > div'), {
        yPercent: -50,
        ease: "none",
        scrollTrigger: {
            trigger: heroSection,
            start: "top bottom",
            end: "bottom top",
            scrub: true
        }
    });

    // Text parallax effect
    gsap.to(heroSection.querySelectorAll('.hero-text-element, .hero-name'), {
        yPercent: -20,
        ease: "none",
        scrollTrigger: {
            trigger: heroSection,
            start: "top bottom",
            end: "bottom top",
            scrub: true
        }
    });
}

function initMouseTracking() {
    const heroSection = document.querySelector('.hero-section');
    if (!heroSection) return;

    let mouseX = 0, mouseY = 0;
    let isInHero = false;
    let rafId = null;

    // Enhanced mouse tracking with perspective effects
    heroSection.addEventListener('mouseenter', () => {
        isInHero = true;
        if (rafId) cancelAnimationFrame(rafId);
        updateMouseEffects();
    });

    heroSection.addEventListener('mouseleave', () => {
        isInHero = false;
        if (rafId) cancelAnimationFrame(rafId);
        
        // Reset all animated elements to neutral position
        const profileImage = heroSection.querySelector('.lg\\:w-1\\/2 .relative');
        const morphingShapes = heroSection.querySelectorAll('.morphing-shape');
        const diagonalLines = heroSection.querySelectorAll('.diagonal-line');
        const splineCurves = heroSection.querySelectorAll('.spline-curve');
        const bgElements = heroSection.querySelectorAll('.absolute.opacity-10 > div');
        
        gsap.to([profileImage, ...morphingShapes, ...diagonalLines, ...splineCurves, ...bgElements], {
            x: 0,
            y: 0,
            rotationX: 0,
            rotationY: 0,
            rotation: 0,
            scale: 1,
            scaleX: 1,
            duration: 0.8,
            ease: "power2.out"
        });
        
        // Reset glow effect
        gsap.to(heroSection, {
            boxShadow: 'none',
            duration: 0.5,
            ease: "power2.out"
        });
    });

    heroSection.addEventListener('mousemove', (e) => {
        if (!isInHero) return;
        
        const rect = heroSection.getBoundingClientRect();
        mouseX = (e.clientX - rect.left) / rect.width;
        mouseY = (e.clientY - rect.top) / rect.height;
        
        if (rafId) cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(updateMouseEffects);
    });

    function updateMouseEffects() {
        if (!isInHero) return;

        // Calculate normalized mouse position (-1 to 1)
        const normalizedX = (mouseX - 0.5) * 2;
        const normalizedY = (mouseY - 0.5) * 2;

        // Profile image with enhanced 3D effects
        const profileImage = heroSection.querySelector('.lg\\:w-1\\/2 .relative');
        if (profileImage) {
            const imageMoveX = normalizedX * 20;
            const imageMoveY = normalizedY * 15;
            const imageRotateX = normalizedY * 12;
            const imageRotateY = normalizedX * 15;
            
            gsap.to(profileImage, {
                x: imageMoveX,
                y: imageMoveY,
                rotationX: imageRotateX,
                rotationY: imageRotateY,
                scale: 1 + Math.abs(normalizedX + normalizedY) * 0.03,
                duration: 0.8,
                ease: "power2.out"
            });
        }

        // Morphing shapes with enhanced mouse tracking (fastest layer)
        const morphingShapes = heroSection.querySelectorAll('.morphing-shape');
        morphingShapes.forEach((shape, index) => {
            const shapeMoveX = normalizedX * (40 + index * 15);
            const shapeMoveY = normalizedY * (30 + index * 10);
            const shapeRotate = normalizedX * (25 + index * 8);
            const shapeScale = 1 + Math.abs(normalizedX + normalizedY) * (0.2 + index * 0.1);
            
            gsap.to(shape, {
                x: shapeMoveX,
                y: shapeMoveY,
                rotation: shapeRotate,
                scale: shapeScale,
                duration: 1.2,
                ease: "power2.out"
            });
        });

        // Diagonal lines with medium speed mouse tracking
        const diagonalLines = heroSection.querySelectorAll('.diagonal-line');
        diagonalLines.forEach((line, index) => {
            const lineMoveX = normalizedX * (25 + index * 8);
            const lineMoveY = normalizedY * (20 + index * 6);
            const lineRotate = normalizedX * (15 + index * 5);
            const lineScale = 1 + Math.abs(normalizedX + normalizedY) * (0.1 + index * 0.05);
            
            gsap.to(line, {
                x: lineMoveX,
                y: lineMoveY,
                rotation: lineRotate,
                scaleX: lineScale,
                duration: 1.5,
                ease: "power2.out"
            });
        });

        // Spline curves with slower mouse tracking (slowest layer)
        const splineCurves = heroSection.querySelectorAll('.spline-curve');
        splineCurves.forEach((curve, index) => {
            const curveMoveX = normalizedX * (15 + index * 5);
            const curveMoveY = normalizedY * (12 + index * 4);
            const curveRotate = normalizedX * (8 + index * 3);
            const curveScale = 1 + Math.abs(normalizedX + normalizedY) * (0.05 + index * 0.02);
            
            gsap.to(curve, {
                x: curveMoveX,
                y: curveMoveY,
                rotation: curveRotate,
                scale: curveScale,
                duration: 2,
                ease: "power2.out"
            });
        });

        // Background decorations with subtle parallax effect
        const bgElements = heroSection.querySelectorAll('.absolute.opacity-10 > div');
        bgElements.forEach((element, index) => {
            const parallaxX = normalizedX * (15 + index * 5);
            const parallaxY = normalizedY * (10 + index * 3);
            
            gsap.to(element, {
                x: parallaxX,
                y: parallaxY,
                scale: 1 + Math.abs(normalizedX + normalizedY) * 0.05,
                duration: 0.8,
                ease: "power2.out"
            });
        });

        // Add subtle glow effect based on mouse position
        const glowIntensity = Math.abs(normalizedX + normalizedY) * 0.3;
        gsap.to(heroSection, {
            boxShadow: `0 0 ${20 + glowIntensity * 50}px rgba(59, 130, 246, ${0.1 + glowIntensity * 0.2})`,
            duration: 0.5,
            ease: "power2.out"
        });
    }
}

function initEnhancedHoverEffects() {
    const heroSection = document.querySelector('.hero-section');
    if (!heroSection) return;

    // Enhanced button hover effects
    const buttons = heroSection.querySelectorAll('.hero-button');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', () => {
            gsap.to(button, {
                scale: 1.05,
                y: -5,
                duration: 0.3,
                ease: "power2.out"
            });
        });

        button.addEventListener('mouseleave', () => {
            gsap.to(button, {
                scale: 1,
                y: 0,
                duration: 0.3,
                ease: "power2.out"
            });
        });
    });

    // Enhanced social icons hover effects
    const socialIcons = heroSection.querySelectorAll('.space-x-6 a');
    socialIcons.forEach(icon => {
        icon.addEventListener('mouseenter', () => {
            gsap.to(icon, {
                scale: 1.2,
                rotation: 360,
                duration: 0.4,
                ease: "back.out(1.7)"
            });
        });

        icon.addEventListener('mouseleave', () => {
            gsap.to(icon, {
                scale: 1,
                rotation: 0,
                duration: 0.4,
                ease: "power2.out"
            });
        });
    });

    // Enhanced profile image hover effect
    const profileImage = heroSection.querySelector('.lg\\:w-1\\/2 .relative');
    if (profileImage) {
        profileImage.addEventListener('mouseenter', () => {
            gsap.to(profileImage, {
                scale: 1.05,
                rotationY: 5,
                duration: 0.4,
                ease: "power2.out"
            });
        });

        profileImage.addEventListener('mouseleave', () => {
            gsap.to(profileImage, {
                scale: 1,
                rotationY: 0,
                duration: 0.4,
                ease: "power2.out"
            });
        });
    }
}

// Enhanced typing effect with GSAP
function initTypingEffect() {
    const typewriterElement = document.querySelector('.typewriter');
    if (!typewriterElement) return;

    const text = typewriterElement.textContent;
    typewriterElement.textContent = '';
    typewriterElement.style.borderRight = '2px solid #93c5fd';

    const chars = text.split('');
    const timeline = gsap.timeline({ delay: 1.5 });

    chars.forEach((char, index) => {
        timeline.to(typewriterElement, {
            duration: 0.05,
            onUpdate: function() {
                typewriterElement.textContent = chars.slice(0, index + 1).join('');
            }
        });
    });

    // Enhanced blinking cursor effect
    gsap.to(typewriterElement, {
        borderRightColor: 'transparent',
        duration: 0.7,
        repeat: -1,
        yoyo: true,
        ease: "power2.inOut"
    });
}

// Initialize typing effect when page loads
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(initTypingEffect, 2000);
});

// Performance optimization: Pause animations when tab is not visible
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        gsap.globalTimeline.pause();
    } else {
        gsap.globalTimeline.resume();
    }
});

// Add window resize handler for responsive animations
window.addEventListener('resize', function() {
    // Refresh ScrollTrigger on resize
    ScrollTrigger.refresh();
}); 