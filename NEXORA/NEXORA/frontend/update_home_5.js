const fs = require('fs');
const file = 'C:/Users/naazm/OneDrive/Documents/Nexora project/NEXORA/NEXORA/frontend/home.html';
let html = fs.readFileSync(file, 'utf8');

// Fix 1: The old .hero-title and .hero CSS that shouldn't be there anymore.
// We'll replace the original .hero block and .hero-title blocks.
html = html.replace(/\.hero \{[\s\S]*?\}\s*/, '');
html = html.replace(/\.eyebrow \{[\s\S]*?\}\s*\.eyebrow i \{[\s\S]*?\}\s*/, '');
html = html.replace(/\.hero-title \{[\s\S]*?\}\s*/, ''); // Removes the first one
html = html.replace(/\.hero-sub \{[\s\S]*?\}\s*/, ''); // Removes the first one

// Fix 2: Add standard background-clip to the active .hero-title
html = html.replace('-webkit-background-clip: text;\n            -webkit-text-fill-color: transparent;', 
    '-webkit-background-clip: text;\n            background-clip: text;\n            -webkit-text-fill-color: transparent;\n            color: transparent;');

// Fix 3: Analyze button gradient
const oldBtn = /background: linear-gradient\(90deg, var\(--cyan\), #0ea5e9\);[\s\S]*?color: #000;/;
const newBtn = `background: linear-gradient(135deg, var(--purple), var(--cyan));
            border: none;
            border-radius: 999px;
            color: var(--bg);`;
html = html.replace(oldBtn, newBtn);

fs.writeFileSync(file, html);
console.log('Update 5 complete.');
