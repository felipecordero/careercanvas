// Dynamic Color System
// Randomly selects color palettes and applies them to the website
// Similar to how Pexels background images work

// Color palettes configuration
// These are fallback palettes - will be overridden by Hugo config if available
let COLOR_PALETTES = [
    {
        name: "professional",
        main_color: "#474A51",    // Graphite Gray
        second_color: "#E52521",  // Mario Red
        third_color: "#3CB043"    // Luigi Green
    },
    {
        name: "ocean",
        main_color: "#1E40AF",    // Vibrant Blue
        second_color: "#06B6D4",  // Cyan
        third_color: "#10B981"    // Emerald
    },
    {
        name: "sunset",
        main_color: "#DC2626",    // Vibrant Red
        second_color: "#F59E0B",  // Amber
        third_color: "#EF4444"    // Red Orange
    },
    {
        name: "forest",
        main_color: "#059669",    // Deep Emerald
        second_color: "#10B981",  // Green
        third_color: "#F59E0B"    // Golden Yellow
    },
    {
        name: "fire",
        main_color: "#EA580C",    // Orange
        second_color: "#DC2626",  // Red
        third_color: "#F59E0B"    // Amber
    },
    {
        name: "steel",
        main_color: "#374151",    // Steel Gray
        second_color: "#6B7280",  // Medium Gray
        third_color: "#10B981"    // Emerald
    },
    {
        name: "navy",
        main_color: "#1E3A8A",    // Navy Blue
        second_color: "#3B82F6",  // Bright Blue
        third_color: "#F59E0B"    // Amber
    },
    {
        name: "charcoal",
        main_color: "#1F2937",    // Charcoal
        second_color: "#EF4444",  // Red
        third_color: "#22C55E"    // Green
    },
    {
        name: "slate",
        main_color: "#475569",    // Slate Blue
        second_color: "#0EA5E9",  // Sky Blue
        third_color: "#F97316"    // Orange
    },
    {
        name: "midnight",
        main_color: "#0F172A",    // Midnight Blue
        second_color: "#8B5CF6",  // Purple
        third_color: "#06B6D4"    // Cyan
    },
];

// Utility functions
const ColorUtils = {
    // Get a random palette
    getRandomPalette: () => {
        const randomIndex = Math.floor(Math.random() * COLOR_PALETTES.length);
        return COLOR_PALETTES[randomIndex];
    },

    // Get a specific palette by name
    getPaletteByName: (name) => {
        return COLOR_PALETTES.find(palette => palette.name === name);
    },

    // Apply colors to CSS custom properties
    applyColors: (palette) => {
        const root = document.documentElement;
        
        console.log(`🎨 Applying palette: ${palette.name}`, palette);
        
        // Set CSS custom properties - use the same names as in CSS
        root.style.setProperty('--color-primary', palette.main_color);
        root.style.setProperty('--color-second', palette.second_color);
        root.style.setProperty('--color-third', palette.third_color);
        
        // Also set legacy property names for backward compatibility
        root.style.setProperty('--main-color', palette.main_color);
        root.style.setProperty('--second-color', palette.second_color);
        root.style.setProperty('--third-color', palette.third_color);
        
        // Add a data attribute to track current palette
        root.setAttribute('data-color-palette', palette.name);
        
        // Verify the colors were applied
        const appliedPrimary = getComputedStyle(root).getPropertyValue('--color-primary').trim();
        console.log(`🎨 Primary color applied: ${appliedPrimary} (expected: ${palette.main_color})`);
        
        console.log(`🎨 Applied color palette: ${palette.name}`);
    },

    // Generate complementary colors (for future use)
    generateComplementary: (baseColor) => {
        // This could be expanded to generate complementary colors
        // For now, we'll use predefined palettes
        return baseColor;
    },

    // Smooth transition between color palettes
    transitionToPalette: (palette, duration = 1000) => {
        const root = document.documentElement;
        
        // Add transition class
        root.classList.add('color-transition');
        
        // Apply new colors
        ColorUtils.applyColors(palette);
        
        // Remove transition class after animation
        setTimeout(() => {
            root.classList.remove('color-transition');
        }, duration);
    }
};

// Main initialization function
function initializeDynamicColors() {
    console.log('🎨 Initializing dynamic color system...');
    
    // Use Hugo config palettes if available, otherwise use fallback palettes
    if (window.HUGO_COLOR_PALETTES && window.HUGO_COLOR_PALETTES.length > 0) {
        COLOR_PALETTES = window.HUGO_COLOR_PALETTES;
        console.log('🎨 Using Hugo config color palettes:', COLOR_PALETTES.length, 'palettes');
    } else {
        console.log('🎨 Using fallback color palettes:', COLOR_PALETTES.length, 'palettes');
    }
    
    // Check if we should use a specific palette from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const requestedPalette = urlParams.get('palette');
    
    let selectedPalette;
    
    if (requestedPalette) {
        // Use requested palette if valid
        selectedPalette = ColorUtils.getPaletteByName(requestedPalette);
        if (!selectedPalette) {
            console.warn(`Requested palette "${requestedPalette}" not found, using random palette`);
            selectedPalette = ColorUtils.getRandomPalette();
        }
    } else {
        // Use random palette
        selectedPalette = ColorUtils.getRandomPalette();
    }
    
    // Apply the selected palette
    ColorUtils.applyColors(selectedPalette);
    
    // Store current palette for potential use by other scripts
    window.currentColorPalette = selectedPalette;
    
    return selectedPalette;
}

// Color palette cycling (for testing or user interaction)
function cycleColorPalette() {
    const currentPaletteName = document.documentElement.getAttribute('data-color-palette');
    const currentIndex = COLOR_PALETTES.findIndex(p => p.name === currentPaletteName);
    const nextIndex = (currentIndex + 1) % COLOR_PALETTES.length;
    
    ColorUtils.transitionToPalette(COLOR_PALETTES[nextIndex]);
    window.currentColorPalette = COLOR_PALETTES[nextIndex];
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Small delay to ensure other scripts have loaded
    setTimeout(initializeDynamicColors, 100);
});

// Also initialize on window load as backup
window.addEventListener('load', function() {
    // Check if colors were already initialized
    if (!document.documentElement.getAttribute('data-color-palette')) {
        console.log('🎨 Colors not initialized on DOMContentLoaded, initializing on window load');
        initializeDynamicColors();
    }
});

// Export for potential use by other scripts
window.DynamicColors = {
    initialize: initializeDynamicColors,
    cycle: cycleColorPalette,
    apply: ColorUtils.applyColors,
    getRandom: ColorUtils.getRandomPalette,
    getByName: ColorUtils.getPaletteByName,
    palettes: COLOR_PALETTES
};

// Debug function (remove in production)
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    window.debugColors = {
        list: () => console.table(COLOR_PALETTES),
        current: () => console.log(window.currentColorPalette),
        cycle: cycleColorPalette,
        apply: (name) => {
            const palette = ColorUtils.getPaletteByName(name);
            if (palette) {
                ColorUtils.applyColors(palette);
                window.currentColorPalette = palette;
            } else {
                console.error(`Palette "${name}" not found`);
            }
        },
        test: () => {
            console.log('🎨 Testing color system...');
            console.log('Available palettes:', COLOR_PALETTES.map(p => p.name));
            console.log('Current palette:', document.documentElement.getAttribute('data-color-palette'));
            console.log('Current primary color:', getComputedStyle(document.documentElement).getPropertyValue('--color-primary'));
            console.log('Hugo palettes available:', window.HUGO_COLOR_PALETTES ? window.HUGO_COLOR_PALETTES.length : 'No');
        },
        forceRandom: () => {
            const randomPalette = ColorUtils.getRandomPalette();
            console.log('🎨 Forcing random palette:', randomPalette.name);
            ColorUtils.applyColors(randomPalette);
            window.currentColorPalette = randomPalette;
        }
    };
    console.log('🎨 Dynamic Colors loaded! Use window.debugColors for testing');
    console.log('🎨 Try: window.debugColors.test() or window.debugColors.forceRandom()');
}
