const fs = require('fs');
const file = 'C:/Users/naazm/OneDrive/Documents/Nexora project/NEXORA/NEXORA/frontend/home.html';
let html = fs.readFileSync(file, 'utf8');

// 1. CSS Injection
const cssToInject = `
        /* Premium Hero & Globe */
        .globe-container {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 800px;
            height: 800px;
            z-index: 0;
            pointer-events: none;
            opacity: 0.15;
            animation: rotateGlobe 60s linear infinite;
        }
        @keyframes rotateGlobe {
            0% { transform: translate(-50%, -50%) rotate(0deg); }
            100% { transform: translate(-50%, -50%) rotate(360deg); }
        }

        .hero-wrapper {
            display: flex;
            max-width: 1300px;
            width: 100%;
            margin: 0 auto;
            align-items: center;
            gap: 60px;
            padding: 40px 48px 80px;
        }
        .hero-content {
            flex: 1;
            position: relative;
            z-index: 2;
        }
        
        .hero-title-wrapper {
            position: relative;
            display: inline-block;
        }

        .hero-title {
            font-family: var(--font-display);
            font-size: clamp(60px, 8vw, 110px);
            font-weight: 900;
            letter-spacing: 6px;
            line-height: 1.1;
            background: linear-gradient(to right, #00f0ff, #0ea5e9, #7c3aed, #00f0ff);
            background-size: 200% auto;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            animation: shineText 4s linear infinite;
            filter: drop-shadow(0 0 30px rgba(0,240,255,0.4)) drop-shadow(0 0 80px rgba(124,58,237,0.3));
            margin-bottom: 24px;
        }
        @keyframes shineText {
            to { background-position: 200% center; }
        }

        /* Innovation Journey Panel */
        .journey-panel {
            width: 340px;
            background: rgba(10, 15, 30, 0.5);
            border: 1px solid rgba(0, 240, 255, 0.15);
            border-radius: 24px;
            padding: 32px;
            backdrop-filter: blur(16px);
            box-shadow: 0 0 40px rgba(0, 0, 0, 0.5), inset 0 0 20px rgba(0, 240, 255, 0.05);
            position: relative;
            z-index: 2;
        }
        .journey-panel-title {
            font-family: var(--font-display);
            font-size: 13px;
            letter-spacing: 3px;
            color: var(--cyan);
            margin-bottom: 32px;
            text-transform: uppercase;
        }
        .journey-list {
            display: flex;
            flex-direction: column;
            gap: 28px;
            position: relative;
        }
        .journey-list::before {
            content: '';
            position: absolute;
            left: 11px;
            top: 10px;
            bottom: 20px;
            width: 2px;
            background: linear-gradient(to bottom, var(--cyan), var(--purple));
            opacity: 0.3;
        }
        .journey-item {
            display: flex;
            gap: 20px;
            align-items: flex-start;
            position: relative;
            z-index: 1;
        }
        .journey-icon {
            width: 24px;
            height: 24px;
            border-radius: 50%;
            background: var(--bg);
            border: 2px solid var(--cyan);
            display: grid;
            place-items: center;
            color: var(--cyan);
            font-size: 10px;
            box-shadow: 0 0 15px rgba(0, 240, 255, 0.6);
            flex-shrink: 0;
            position: relative;
        }
        .journey-icon::after {
            content: '';
            position: absolute;
            inset: -4px;
            border-radius: 50%;
            border: 1px solid var(--cyan);
            opacity: 0.5;
            animation: pulse-ring 2s cubic-bezier(0.215, 0.61, 0.355, 1) infinite;
        }
        @keyframes pulse-ring {
            0% { transform: scale(1); opacity: 0.5; }
            100% { transform: scale(1.5); opacity: 0; }
        }
        .journey-text-title {
            font-size: 14px;
            font-weight: 600;
            color: var(--text);
            margin-bottom: 4px;
        }
        .journey-text-sub {
            font-size: 12px;
            color: var(--muted);
        }

        /* Card Visuals */
        .card-visual {
            height: 140px;
            margin-bottom: 24px;
            border-radius: 12px;
            background: rgba(0,0,0,0.2);
            border: 1px solid var(--glass-border);
            display: grid;
            place-items: center;
            position: relative;
            overflow: hidden;
        }
        .card-visual svg {
            width: 100%;
            height: 100%;
            opacity: 0.7;
            transition: opacity 0.3s, transform 0.3s;
        }
        .module-card:hover .card-visual svg {
            opacity: 1;
            transform: scale(1.05);
        }

        @media (max-width: 1024px) {
            .hero-wrapper { flex-direction: column; text-align: center; }
            .journey-panel { width: 100%; max-width: 400px; }
            .idea-form { margin: 0 auto 60px; }
            .journey-list::before { left: 11px; }
        }
`;

if (html.includes('/* Premium Hero & Globe */')) {
    // Already injected
} else {
    html = html.replace('</style>', cssToInject + '\n    </style>');
}

// 2. Hero Section Replacement
const oldHeroRegex = /<section class="hero">[\s\S]*?<\/section>/;
const newHero = `<section class="hero-wrapper">
            <div class="hero-content">
                <div class="hero-title-wrapper">
                    <!-- Globe SVG -->
                    <div class="globe-container">
                        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                            <g stroke="var(--cyan)" stroke-width="0.5" fill="none">
                                <circle cx="100" cy="100" r="90" opacity="0.3"/>
                                <ellipse cx="100" cy="100" rx="90" ry="40" opacity="0.5" />
                                <ellipse cx="100" cy="100" rx="40" ry="90" opacity="0.5" />
                                <ellipse cx="100" cy="100" rx="90" ry="10" opacity="0.3" />
                                <ellipse cx="100" cy="100" rx="10" ry="90" opacity="0.3" />
                                <path d="M 10 100 Q 100 0 190 100" stroke="var(--purple)" opacity="0.4"/>
                                <path d="M 10 100 Q 100 200 190 100" stroke="var(--purple)" opacity="0.4"/>
                            </g>
                        </svg>
                    </div>

                    <div class="eyebrow" style="position:relative; z-index:2;">
                        <i class="fa-solid fa-bolt"></i>
                        AI-Powered Innovation Platform
                    </div>
                    
                    <h1 class="hero-title">NEXORA</h1>
                </div>

                <p class="hero-sub" style="position:relative; z-index:2;">
                    Turn a raw idea into a <strong>fully execution-ready innovation</strong>.<br>
                    Know if it's worth building, how unique it is, how to architect it, and exactly what to build first.
                </p>

                <form class="idea-form" id="landingForm" style="position:relative; z-index:2; max-width:600px;">
                    <div class="input-wrapper">
                        <input
                            class="idea-input"
                            id="ideaInput"
                            type="text"
                            placeholder="Describe your next breakthrough idea..."
                            autocomplete="off"
                        >
                        <button class="analyze-btn" type="submit">
                            <i class="fa-solid fa-wand-magic-sparkles"></i>
                            <span>Analyze Idea</span>
                        </button>
                    </div>
                </form>
            </div>

            <!-- Innovation Journey Panel -->
            <aside class="journey-panel">
                <div class="journey-panel-title">Innovation Journey</div>
                <div class="journey-list">
                    <div class="journey-item">
                        <div class="journey-icon"><i class="fa-solid fa-lightbulb"></i></div>
                        <div>
                            <div class="journey-text-title">Idea</div>
                            <div class="journey-text-sub">Spark of innovation</div>
                        </div>
                    </div>
                    <div class="journey-item">
                        <div class="journey-icon"><i class="fa-solid fa-magnifying-glass"></i></div>
                        <div>
                            <div class="journey-text-title">Analyze</div>
                            <div class="journey-text-sub">AI-powered insights</div>
                        </div>
                    </div>
                    <div class="journey-item">
                        <div class="journey-icon"><i class="fa-solid fa-crosshairs"></i></div>
                        <div>
                            <div class="journey-text-title">Detect</div>
                            <div class="journey-text-sub">Market uniqueness</div>
                        </div>
                    </div>
                    <div class="journey-item">
                        <div class="journey-icon"><i class="fa-solid fa-diagram-project"></i></div>
                        <div>
                            <div class="journey-text-title">Architect</div>
                            <div class="journey-text-sub">Build the blueprint</div>
                        </div>
                    </div>
                    <div class="journey-item">
                        <div class="journey-icon"><i class="fa-solid fa-arrow-trend-up"></i></div>
                        <div>
                            <div class="journey-text-title">Forecast</div>
                            <div class="journey-text-sub">Predict future impact</div>
                        </div>
                    </div>
                </div>
            </aside>
        </section>`;

html = html.replace(oldHeroRegex, newHero);

// 3. Module Cards Replacement
const newModulesGrid = `<div class="modules-grid">

                <a href="idea_analyzer/analyzer.html" class="module-card card-analyzer" id="link-analyzer">
                    <div class="card-visual">
                        <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
                            <circle cx="50" cy="50" r="40" stroke="var(--card-color)" stroke-width="0.5" fill="none" opacity="0.2" stroke-dasharray="2 4"/>
                            <path d="M50 20 L80 40 L80 70 L50 90 L20 70 L20 40 Z" stroke="var(--card-color)" stroke-width="1" fill="none" opacity="0.6"/>
                            <line x1="50" y1="50" x2="50" y2="20" stroke="var(--card-color)" opacity="0.4"/>
                            <line x1="50" y1="50" x2="80" y2="40" stroke="var(--card-color)" opacity="0.4"/>
                            <line x1="50" y1="50" x2="20" y2="40" stroke="var(--card-color)" opacity="0.4"/>
                            <circle cx="50" cy="50" r="4" fill="var(--card-color)"/>
                            <circle cx="50" cy="20" r="3" fill="var(--card-color)"/>
                            <circle cx="80" cy="40" r="3" fill="var(--card-color)"/>
                            <circle cx="20" cy="40" r="3" fill="var(--card-color)"/>
                            <circle cx="80" cy="70" r="3" fill="var(--card-color)" opacity="0.5"/>
                            <circle cx="20" cy="70" r="3" fill="var(--card-color)" opacity="0.5"/>
                            <circle cx="50" cy="90" r="3" fill="var(--card-color)" opacity="0.5"/>
                        </svg>
                    </div>
                    <div class="card-icon" style="position:absolute; top:20px; left:20px; width:32px; height:32px; font-size:14px;"><i class="fa-solid fa-flask-vial"></i></div>
                    <div class="card-title">Idea Analyzer</div>
                    <p class="card-desc">Get AI-scored assessments across innovation, feasibility, complexity, and market demand — plus concrete next steps tailored to your idea.</p>
                    <span class="card-question"><i class="fa-solid fa-circle-question"></i> "Is this idea worth building?"</span>
                    <div class="card-arrow"><i class="fa-solid fa-arrow-right"></i></div>
                </a>

                <a href="innovation/innovation.html" class="module-card card-innovation" id="link-innovation">
                    <div class="card-visual">
                        <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
                            <circle cx="50" cy="50" r="40" stroke="var(--card-color)" stroke-width="1" fill="none" opacity="0.2"/>
                            <circle cx="50" cy="50" r="25" stroke="var(--card-color)" stroke-width="0.5" fill="none" opacity="0.4"/>
                            <circle cx="50" cy="50" r="10" stroke="var(--card-color)" stroke-width="2" fill="none" opacity="0.6"/>
                            <path d="M50 10 L50 90 M10 50 L90 50" stroke="var(--card-color)" stroke-width="0.5" opacity="0.3"/>
                            <!-- Radar sweep -->
                            <path d="M50 50 L50 10 A40 40 0 0 1 90 50 Z" fill="var(--card-color)" opacity="0.1">
                                <animateTransform attributeName="transform" type="rotate" from="0 50 50" to="360 50 50" dur="4s" repeatCount="indefinite"/>
                            </path>
                            <!-- Targets -->
                            <circle cx="70" cy="30" r="2" fill="var(--card-color)"><animate attributeName="opacity" values="0;1;0" dur="4s" repeatCount="indefinite" begin="0.5s"/></circle>
                            <circle cx="30" cy="60" r="2" fill="var(--card-color)"><animate attributeName="opacity" values="0;1;0" dur="4s" repeatCount="indefinite" begin="2s"/></circle>
                        </svg>
                    </div>
                    <div class="card-icon" style="position:absolute; top:20px; left:20px; width:32px; height:32px; font-size:14px;"><i class="fa-solid fa-crosshairs"></i></div>
                    <div class="card-title">Innovation Detector</div>
                    <p class="card-desc">Analyze market saturation, discover similar existing solutions, and identify differentiation opportunities that make your idea stand out.</p>
                    <span class="card-question"><i class="fa-solid fa-circle-question"></i> "Is this idea actually different?"</span>
                    <div class="card-arrow"><i class="fa-solid fa-arrow-right"></i></div>
                </a>

                <a href="architecture/architecture.html" class="module-card card-architecture" id="link-architecture">
                    <div class="card-visual">
                        <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
                            <rect x="40" y="15" width="20" height="15" rx="2" fill="none" stroke="var(--card-color)" stroke-width="1.5"/>
                            <rect x="20" y="45" width="20" height="15" rx="2" fill="none" stroke="var(--card-color)" stroke-width="1" opacity="0.7"/>
                            <rect x="60" y="45" width="20" height="15" rx="2" fill="none" stroke="var(--card-color)" stroke-width="1" opacity="0.7"/>
                            <rect x="40" y="75" width="20" height="15" rx="2" fill="none" stroke="var(--card-color)" stroke-width="1" opacity="0.4"/>
                            <!-- Connecting lines -->
                            <path d="M50 30 L50 40 L30 40 L30 45" stroke="var(--card-color)" fill="none" opacity="0.5"/>
                            <path d="M50 30 L50 40 L70 40 L70 45" stroke="var(--card-color)" fill="none" opacity="0.5"/>
                            <path d="M30 60 L30 70 L50 70 L50 75" stroke="var(--card-color)" fill="none" opacity="0.3"/>
                            <path d="M70 60 L70 70 L50 70" stroke="var(--card-color)" fill="none" opacity="0.3"/>
                        </svg>
                    </div>
                    <div class="card-icon" style="position:absolute; top:20px; left:20px; width:32px; height:32px; font-size:14px;"><i class="fa-solid fa-diagram-project"></i></div>
                    <div class="card-title">Algorithm Architect</div>
                    <p class="card-desc">Generate an animated, interactive system architecture diagram showing exactly how your idea connects — from users to AI engine.</p>
                    <span class="card-question"><i class="fa-solid fa-circle-question"></i> "How should I build this?"</span>
                    <div class="card-arrow"><i class="fa-solid fa-arrow-right"></i></div>
                </a>

                <a href="future_simulator/future_simulator.html" class="module-card card-simulator" id="link-simulator">
                    <div class="card-visual">
                        <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
                            <!-- Grid -->
                            <path d="M10 90 L90 90 M10 90 L10 10" stroke="var(--card-color)" stroke-width="1" opacity="0.4"/>
                            <path d="M10 70 L90 70 M10 50 L90 50 M10 30 L90 30" stroke="var(--card-color)" stroke-width="0.5" stroke-dasharray="2 2" opacity="0.1"/>
                            <!-- Bars -->
                            <rect x="20" y="60" width="10" height="30" fill="var(--card-color)" opacity="0.3"/>
                            <rect x="40" y="45" width="10" height="45" fill="var(--card-color)" opacity="0.5"/>
                            <rect x="60" y="20" width="10" height="70" fill="var(--card-color)" opacity="0.8"/>
                            <!-- Trend line -->
                            <path d="M10 80 L25 55 L45 40 L65 15 L85 5" stroke="var(--card-color)" stroke-width="2" fill="none" filter="drop-shadow(0 0 4px var(--card-color))"/>
                            <circle cx="85" cy="5" r="3" fill="var(--bg)" stroke="var(--card-color)" stroke-width="2"/>
                        </svg>
                    </div>
                    <div class="card-icon" style="position:absolute; top:20px; left:20px; width:32px; height:32px; font-size:14px;"><i class="fa-solid fa-rocket"></i></div>
                    <div class="card-title">Future Impact Simulator</div>
                    <p class="card-desc">Predict success probability, adoption, risks, and growth trajectory before you build — all in one AI-powered simulation deck.</p>
                    <span class="card-question"><i class="fa-solid fa-circle-question"></i> "What will my idea become?"</span>
                    <div class="card-arrow"><i class="fa-solid fa-arrow-right"></i></div>
                </a>

            </div>`;

const oldGridRegex = /<div class="modules-grid">[\s\S]*?<\/div>\s*<\/section>/;
html = html.replace(oldGridRegex, newModulesGrid + '\n        </section>');

// 4. Footer Adjustment (Remove NEXORA ... Hackathon Edition)
html = html.replace('<span>NEXORA · AI Innovation Platform · Hackathon Edition</span>', '');

fs.writeFileSync(file, html);
console.log('Update complete.');
