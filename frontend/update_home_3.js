const fs = require('fs');
const file = 'C:/Users/naazm/OneDrive/Documents/Nexora project/NEXORA/NEXORA/frontend/home.html';
let html = fs.readFileSync(file, 'utf8');

// Regex to match the <aside class="journey-panel">...</aside> block
const panelRegex = /<!-- Innovation Journey Panel -->[\s\S]*?<\/aside>/;
html = html.replace(panelRegex, '');

fs.writeFileSync(file, html);
console.log('Journey panel removed.');
