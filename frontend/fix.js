const fs = require('fs');
const file = 'C:/Users/naazm/OneDrive/Documents/Nexora project/NEXORA/NEXORA/frontend/architecture/architecture.css';
let css = fs.readFileSync(file, 'utf8');
const startIdx = css.indexOf('.input-group {');
const endIdx = css.indexOf('/* ── Results panel ── */');

const replacement = `.input-group { display: flex; flex-direction: column; gap: 0.4rem; }
.input-group--sm { min-width: 160px; }
.input-label {
  font-size: 0.7rem;
  font-family: var(--font-display);
  letter-spacing: 0.12em;
  color: var(--text-muted);
}
.neon-input {
  background: rgba(0,240,255,0.04);
  border: 1px solid rgba(0,240,255,0.2);
  border-radius: var(--radius-sm);
  color: var(--text);
  font-family: var(--font-body);
  font-size: 0.9rem;
  padding: 0.7rem 1rem;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
  width: 100%;
}
.neon-input:focus {
  border-color: var(--cyan);
  box-shadow: 0 0 0 3px rgba(0,240,255,0.12);
}
.neon-select { cursor: pointer; appearance: none; }
.neon-select option { background: var(--bg-2); }

.btn-simulate {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  padding: 0.95rem 2rem;
  background: linear-gradient(135deg, var(--violet), var(--cyan));
  border: none;
  border-radius: var(--radius-sm);
  color: var(--bg);
  font-family: var(--font-display);
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 0.15em;
  cursor: pointer;
  overflow: hidden;
  transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s;
  box-shadow: var(--glow-cyan);
  text-decoration: none;
}
.btn-simulate:hover { opacity: 0.9; transform: translateY(-1px); box-shadow: 0 0 30px rgba(0,240,255,0.5), 0 0 80px rgba(124,58,237,0.25); }
.btn-simulate:active { transform: translateY(1px); }
.btn-simulate:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
.btn-icon { font-size: 1.1rem; }
.btn-shine {
  position: absolute;
  top: -50%; left: -75%;
  width: 50%; height: 200%;
  background: rgba(255,255,255,0.18);
  transform: skewX(-20deg);
  animation: shine 3s ease-in-out infinite;
}
@keyframes shine {
  0%,100% { left: -75%; opacity: 0; }
  50%      { left: 125%; opacity: 1; }
}

`;

if (startIdx !== -1 && endIdx !== -1) {
    css = css.substring(0, startIdx) + replacement + css.substring(endIdx);
    fs.writeFileSync(file, css);
    console.log('Fixed architecture.css');
} else {
    console.log('Indices not found', startIdx, endIdx);
}
