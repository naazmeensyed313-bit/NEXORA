const fs = require('fs');
const file = 'C:/Users/naazm/OneDrive/Documents/Nexora project/NEXORA/NEXORA/frontend/home.html';
let html = fs.readFileSync(file, 'utf8');

// Remove Globe SVG from HTML
const globeRegex = /<!-- Globe SVG -->[\s\S]*?<\/div>\s*<div class="eyebrow"/;
html = html.replace(globeRegex, '<div class="eyebrow"');

// We need to replace the CSS rules for .globe-container, .hero-wrapper, .hero-content, .hero-title-wrapper, .hero-title, and .journey-panel
// The easiest way is to find the start of /* Premium Hero & Globe */ and the end of @media (max-width: 1024px) block that we added earlier.
// Let's just find the exact string we injected and replace it.

const startMarker = '/* Premium Hero & Globe */';
const endMarker = '/* Innovation Journey Panel */';

if (html.includes(startMarker)) {
    let before = html.substring(0, html.indexOf(startMarker));
    
    // Find where the journey panel CSS starts, and replace everything before it.
    let afterJourney = html.substring(html.indexOf(endMarker));
    
    // We also want to replace the .journey-panel class inside the 'afterJourney' part.
    // Let's just use string replacement on the whole thing.
}

// Since I have the exact string from my previous update script, I can use that to replace.
const cssUpdates = `
        /* Premium Hero Updates */
        .hero-wrapper {
            position: relative;
            display: flex;
            max-width: 1300px;
            width: 100%;
            margin: 0 auto;
            align-items: center;
            justify-content: center;
            padding: 80px 48px;
            min-height: 400px;
        }
        .hero-content {
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
            position: relative;
            z-index: 2;
            width: 100%;
            max-width: 800px;
        }
        
        .hero-title-wrapper {
            position: relative;
            display: inline-block;
            text-align: center;
        }

        .hero-title {
            font-family: 'Orbitron', sans-serif;
            font-size: clamp(60px, 10vw, 130px);
            font-weight: 900;
            letter-spacing: 12px;
            line-height: 1.1;
            background: linear-gradient(180deg, #ffffff 0%, #00f0ff 40%, #0088ff 70%, #7c3aed 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            position: relative;
            margin-bottom: 24px;
            transform: scaleX(1.1);
        }
        .hero-title::after {
            content: 'NEXORA';
            position: absolute;
            left: 0;
            top: 0;
            z-index: -1;
            background: linear-gradient(to right, #00f0ff, #7c3aed, #00f0ff);
            background-size: 200% auto;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            filter: blur(25px);
            animation: shineGlow 4s linear infinite;
        }
        @keyframes shineGlow {
            to { background-position: 200% center; }
        }

        /* Innovation Journey Panel */
        .journey-panel {
            position: absolute;
            right: 48px;
            top: 50%;
            transform: translateY(-50%);
            width: 300px;
            background: rgba(10, 15, 30, 0.5);
            border: 1px solid rgba(0, 240, 255, 0.15);
            border-radius: 24px;
            padding: 24px 32px;
            backdrop-filter: blur(16px);
            box-shadow: 0 0 40px rgba(0, 0, 0, 0.5), inset 0 0 20px rgba(0, 240, 255, 0.05);
            z-index: 2;
        }
`;

// Regex replacement
html = html.replace(/\/\* Premium Hero & Globe \*\/[\s\S]*?(?=\.journey-panel-title \{)/, cssUpdates);

// Now we need to update the @media query at the bottom.
const oldMedia = /@media \(max-width: 1024px\) \{[\s\S]*?\}/;
const newMedia = `@media (max-width: 1200px) {
            .hero-wrapper { flex-direction: column; padding-top: 40px; }
            .journey-panel { position: relative; right: auto; top: auto; transform: none; margin-top: 40px; width: 100%; max-width: 400px; }
            .hero-title { transform: scaleX(1); letter-spacing: 4px; }
            .idea-form { margin: 0 auto 60px; }
            .journey-list::before { left: 11px; }
        }`;
html = html.replace(oldMedia, newMedia);

fs.writeFileSync(file, html);
console.log('Update 2 complete.');
