const fs = require('fs');
const file = 'C:/Users/naazm/OneDrive/Documents/Nexora project/NEXORA/NEXORA/frontend/home.html';
let html = fs.readFileSync(file, 'utf8');

// We need to completely replace the <section class="hero-wrapper"> block
const heroRegex = /<section class="hero-wrapper">[\s\S]*?<\/section>/;

const newHeroHTML = `
        <section class="hero-wrapper">
            <!-- Globe Background Container -->
            <div class="hero-globe-bg">
                <svg viewBox="0 0 400 400" preserveAspectRatio="xMidYMid meet">
                    <!-- Outer glows and faint rings -->
                    <circle cx="200" cy="200" r="160" fill="none" stroke="var(--cyan)" stroke-width="0.5" opacity="0.1" />
                    <ellipse cx="200" cy="200" rx="180" ry="60" fill="none" stroke="var(--purple)" stroke-width="0.5" opacity="0.1" transform="rotate(-15 200 200)" />
                    <!-- Main wireframe grid -->
                    <path d="M40 200 A160 160 0 0 1 360 200 A160 160 0 0 1 40 200" fill="none" stroke="var(--cyan)" stroke-width="0.5" stroke-dasharray="2 4" opacity="0.3" />
                    <path d="M120 200 A80 160 0 0 1 280 200 A80 160 0 0 1 120 200" fill="none" stroke="var(--cyan)" stroke-width="0.5" stroke-dasharray="2 4" opacity="0.3" />
                    <path d="M200 40 A160 160 0 0 1 200 360" fill="none" stroke="var(--cyan)" stroke-width="0.5" stroke-dasharray="2 4" opacity="0.3" />
                    <path d="M40 200 A160 60 0 0 1 360 200 A160 60 0 0 1 40 200" fill="none" stroke="var(--cyan)" stroke-width="0.5" stroke-dasharray="2 4" opacity="0.3" />
                    <!-- Dots/Particles -->
                    <circle cx="80" cy="120" r="1" fill="var(--cyan)" filter="drop-shadow(0 0 2px var(--cyan))" />
                    <circle cx="320" cy="100" r="1.5" fill="var(--purple)" filter="drop-shadow(0 0 2px var(--purple))" />
                    <circle cx="100" cy="280" r="1" fill="var(--cyan)" />
                    <circle cx="280" cy="300" r="1" fill="var(--cyan)" />
                </svg>
            </div>

            <div class="hero-content">
                <h1 class="hero-title">NEXORA</h1>
                
                <div class="hero-tagline">
                    <span class="line-left"></span>
                    FROM IDEA TO IMPACT
                    <span class="line-right"></span>
                </div>

                <p class="hero-sub">
                    Your AI-Powered Command Center for Innovation,<br>Architecture, and Impact.
                </p>

                <form class="idea-form" id="landingForm">
                    <div class="input-container">
                        <i class="fa-solid fa-wand-magic-sparkles input-icon"></i>
                        <input
                            class="idea-input"
                            id="ideaInput"
                            type="text"
                            placeholder="Describe your next breakthrough idea..."
                            autocomplete="off"
                        >
                        <button class="analyze-btn" type="submit">
                            Analyze Idea <i class="fa-solid fa-arrow-right"></i>
                        </button>
                    </div>
                </form>
            </div>
        </section>
`;

html = html.replace(heroRegex, newHeroHTML);

// Now update CSS
const cssUpdates = `
        /* Premium Hero Updates (Refined) */
        .hero-wrapper {
            position: relative;
            display: flex;
            width: 100%;
            min-height: 80vh;
            align-items: center;
            justify-content: center;
            overflow: hidden;
        }

        .hero-globe-bg {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 800px;
            height: 800px;
            z-index: 0;
            pointer-events: none;
            animation: slowRotate 100s linear infinite;
        }
        @keyframes slowRotate {
            to { transform: translate(-50%, -50%) rotate(360deg); }
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
            padding: 0 24px;
            margin-top: -40px;
        }

        .hero-title {
            font-family: 'Orbitron', sans-serif;
            font-size: clamp(60px, 12vw, 150px);
            font-weight: 900;
            letter-spacing: 4px;
            line-height: 1;
            margin-bottom: 24px;
            /* Glowing glossy text effect */
            background: linear-gradient(180deg, #ffffff 0%, #00f0ff 40%, #0088ff 70%, #7c3aed 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            position: relative;
            transform: scaleX(1.15); /* Wide stretch */
            filter: drop-shadow(0 0 20px rgba(0, 240, 255, 0.4)) drop-shadow(0 0 60px rgba(124, 58, 237, 0.3));
        }

        .hero-tagline {
            display: flex;
            align-items: center;
            gap: 20px;
            font-family: var(--font-display);
            font-size: 18px;
            letter-spacing: 8px;
            color: #ffffff;
            margin-bottom: 24px;
            text-shadow: 0 0 10px rgba(255,255,255,0.5);
        }
        .hero-tagline .line-left,
        .hero-tagline .line-right {
            width: 40px;
            height: 2px;
        }
        .hero-tagline .line-left { background: linear-gradient(90deg, transparent, var(--cyan)); }
        .hero-tagline .line-right { background: linear-gradient(90deg, var(--cyan), transparent); }

        .hero-sub {
            font-size: 16px;
            color: var(--muted);
            line-height: 1.6;
            margin-bottom: 48px;
        }

        /* Input Form */
        .idea-form {
            width: 100%;
            max-width: 700px;
            position: relative;
        }
        .input-container {
            display: flex;
            align-items: center;
            background: rgba(5, 8, 18, 0.6);
            border: 1px solid rgba(0, 240, 255, 0.2);
            border-radius: 999px;
            padding: 8px 8px 8px 24px;
            backdrop-filter: blur(10px);
            box-shadow: 0 0 30px rgba(0, 240, 255, 0.05), inset 0 0 20px rgba(0, 240, 255, 0.02);
            transition: border-color 0.3s, box-shadow 0.3s;
        }
        .input-container:focus-within {
            border-color: rgba(0, 240, 255, 0.5);
            box-shadow: 0 0 40px rgba(0, 240, 255, 0.15), inset 0 0 20px rgba(0, 240, 255, 0.05);
        }
        .input-icon {
            color: var(--cyan);
            font-size: 18px;
            margin-right: 16px;
            filter: drop-shadow(0 0 8px var(--cyan));
        }
        .idea-input {
            flex: 1;
            background: transparent;
            border: none;
            outline: none;
            color: var(--text);
            font-family: var(--font-body);
            font-size: 15px;
            padding: 12px 0;
        }
        .idea-input::placeholder { color: var(--muted); }

        .analyze-btn {
            background: linear-gradient(90deg, var(--cyan), #0ea5e9);
            border: none;
            border-radius: 999px;
            color: #000;
            font-family: var(--font-display);
            font-size: 13px;
            font-weight: 700;
            padding: 14px 28px;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 10px;
            transition: opacity 0.2s, box-shadow 0.2s;
            box-shadow: 0 0 20px rgba(0, 240, 255, 0.4);
        }
        .analyze-btn:hover {
            opacity: 0.9;
            box-shadow: 0 0 30px rgba(0, 240, 255, 0.6);
        }
`;

// Remove the old CSS we injected for hero/journey and replace with new
// Wait, last time I replaced a specific chunk.
// Let's replace the whole style block again by matching <style> ... </style>
// Since we have other styles, let's just find the end of the <style> tag and insert it, but first remove all old hero styles.
html = html.replace(/\.hero-wrapper[\s\S]*?(?=\/\* Card Visuals \*\/)/, cssUpdates);

// Note: Ensure old eyebrow css isn't breaking anything, but it shouldn't matter since we removed <div class="eyebrow">
fs.writeFileSync(file, html);
console.log('Update 4 complete.');
