/* ============================================================
   NEXORA – Idea Analyzer  |  analyzer.js
   Unified with future_simulator interaction model
   ============================================================ */

'use strict';

// ── DOM refs ──────────────────────────────────────────────────
const $ = id => document.getElementById(id);

const backBtn        = $('backBtn');
const ideaInput      = $('ideaInput');
const charCount      = $('charCount');
const analyzeBtn     = $('analyzeBtn');
const btnText        = $('btnText');
const inputSection   = $('inputSection');

const resultsPanel   = $('resultsPanel');
const ideaBannerText = $('ideaBannerText');
const editIdeaBtn    = $('editIdeaBtn');

const confFill       = $('confFill');
const confValue      = $('confValue');
const scoreGrid      = $('scoreGrid');
const summaryText    = $('summaryText');
const suggestionsList= $('suggestionsList');

const errorSection   = $('errorSection');
const errorText      = $('errorText');
const retryBtn       = $('retryBtn');

const nextModuleBar  = $('nextModuleBar');

const loadingOverlay = $('loadingOverlay');
const loaderText     = $('loaderText');
const loaderBar      = $('loaderBar');

// ── Particle field (matches future_simulator) ─────────────────
(function buildParticles() {
  const field = $('particleField');
  if (!field) return;
  const COLORS = ['#00f0ff', '#7c3aed', '#f72585', '#00ff88'];
  for (let i = 0; i < 55; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 3 + 1;
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    Object.assign(p.style, {
      width:  size + 'px',
      height: size + 'px',
      left:   Math.random() * 100 + '%',
      background: color,
      boxShadow: `0 0 ${size * 3}px ${color}`,
      animationDuration: (Math.random() * 18 + 10) + 's',
      animationDelay:    (Math.random() * 15) + 's',
    });
    field.appendChild(p);
  }
})();

// ── Back navigation ────────────────────────────────────────────
// Analyzer is Module 01 — "Back" returns to the previous page in
// history (e.g. the dashboard), while the breadcrumb "home" icon
// in the journey-nav always returns to the dashboard directly.
if (backBtn) {
  backBtn.addEventListener('click', () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href = '../index.html';
    }
  });
}

// ── Char counter ───────────────────────────────────────────────
function updateCharCount() {
  if (!ideaInput || !charCount) return;
  const len = ideaInput.value.length;
  charCount.textContent = `${len} character${len !== 1 ? 's' : ''}`;
}
if (ideaInput) ideaInput.addEventListener('input', updateCharCount);

// ── Restore previously entered idea ───────────────────────────
(function restoreIdea() {
  const saved = sessionStorage.getItem('nexora_idea') || '';
  if (ideaInput && saved) ideaInput.value = saved;
  updateCharCount();
})();

// ── Loading sequence (matches future_simulator) ────────────────
const LOADER_STEPS = [
  'Reading your idea…',
  'Evaluating innovation potential…',
  'Assessing market demand signals…',
  'Calculating feasibility factors…',
  'Mapping complexity layers…',
  'Cross-referencing competitor landscape…',
  'Synthesizing AI insights…',
];

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function showLoader() {
  loadingOverlay.classList.remove('hidden');
  loaderBar.style.width = '0%';
  for (let i = 0; i < LOADER_STEPS.length; i++) {
    loaderText.textContent = LOADER_STEPS[i];
    loaderBar.style.width = ((i + 1) / LOADER_STEPS.length * 100) + '%';
    await sleep(380 + Math.random() * 220);
  }
}

function hideLoader() {
  loadingOverlay.classList.add('hidden');
}

// ── Mock data generator ────────────────────────────────────────
function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }

function hashString(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h * 31 + str.charCodeAt(i)) >>> 0;
  }
  return h;
}

function generateMockData(idea) {
  const seed = hashString(idea.toLowerCase());
  const rnd  = (offset) => ((seed >> offset) % 100 + 100) % 100;

  const innovation = clamp(58 + (rnd(0) % 38), 40, 98);
  const feasibility = clamp(50 + (rnd(5) % 42), 35, 97);
  const demand = clamp(48 + (rnd(10) % 45), 35, 98);

  // Complexity is inversely related to feasibility
  let complexity, complexityNote;
  if (feasibility >= 75) { complexity = 'Low'; complexityNote = 'Quick Build'; }
  else if (feasibility >= 55) { complexity = 'Medium'; complexityNote = 'Balanced Build'; }
  else { complexity = 'High'; complexityNote = 'Advanced Build'; }

  const manageability = { Low: 90, Medium: 65, High: 35 }[complexity];

  const confidence = clamp(68 + (rnd(15) % 27), 60, 97);

  const avg = Math.round((innovation + feasibility + demand) / 3);

  let outlook;
  if (avg >= 80) outlook = 'exceptionally strong';
  else if (avg >= 68) outlook = 'solid';
  else if (avg >= 55) outlook = 'promising but uneven';
  else outlook = 'early-stage and untested';

  const trimmedIdea = idea.length > 140 ? idea.slice(0, 140).trim() + '…' : idea;

  const summary = `Your idea — "${trimmedIdea}" — shows an ${outlook} profile. ` +
    `Innovation scores ${innovation}%, feasibility ${feasibility}%, and market demand ${demand}%, ` +
    `with an estimated ${complexity.toLowerCase()} build complexity. ` +
    `Overall, this concept ${avg >= 65 ? 'is worth pursuing further with a focused MVP' : 'would benefit from sharper scoping before development begins'}.`;

  const suggestionBank = [
    `Narrow the first release to a single core workflow that proves the idea's value in under a week of use.`,
    `Run 5–10 quick user interviews to validate the core assumption before writing production code.`,
    `Sketch a simple wireframe or prototype to test usability with real users early.`,
    `Identify your nearest competitors and define one clear differentiator to lead with.`,
    `Plan your monetization model now — even if launch is free, know how revenue will eventually work.`,
    `Reduce scope for v1 — cut any feature that isn't essential to the core value proposition.`,
    `Set up basic analytics from day one so you can measure real usage, not assumptions.`,
    `Consider partnerships or integrations that could accelerate distribution.`,
  ];
  // Pick 4 suggestions deterministically based on seed
  const suggestions = [];
  const used = new Set();
  for (let i = 0; i < 4; i++) {
    let idx = (seed + i * 7) % suggestionBank.length;
    while (used.has(idx)) idx = (idx + 1) % suggestionBank.length;
    used.add(idx);
    suggestions.push(suggestionBank[idx]);
  }
  if (complexity === 'High') {
    suggestions[0] = `Prototype the riskiest technical component first — validate feasibility before committing to the full build.`;
  }

  // Risk distribution (for doughnut chart)
  const technicalRisk = complexity === 'High' ? clamp(60 + (rnd(20) % 25), 0, 100)
                        : complexity === 'Medium' ? clamp(35 + (rnd(20) % 25), 0, 100)
                        : clamp(15 + (rnd(20) % 20), 0, 100);
  const marketRisk     = clamp(100 - demand, 5, 95);
  const financialRisk  = clamp(100 - feasibility + (rnd(25) % 10), 5, 95);
  const adoptionRisk   = clamp(100 - Math.round((innovation + demand) / 2), 5, 95);

  return {
    innovation,
    feasibility,
    demand,
    complexity,
    complexityNote,
    manageability,
    confidence,
    summary,
    suggestions,
    riskDistribution: {
      technical: technicalRisk,
      market: marketRisk,
      financial: financialRisk,
      adoption: adoptionRisk,
    },
  };
}

// ── Try backend, fall back to mock (matches future_simulator) ──
async function fetchAnalysis(idea) {
  try {
    const response = await fetch('https://nexora-bc4j.onrender.com/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idea }),
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) throw new Error('Backend error');
    return await response.json();
  } catch {
    // Backend unavailable — use mock data
    return generateMockData(idea);
  }
}

// ── Animated counters ───────────────────────────────────────────
function animateValue(el, target, suffix = '') {
  const start = 0;
  const duration = 1100;
  const startTime = performance.now();
  function update(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(start + (target - start) * eased) + suffix;
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

// ── Score cards ──────────────────────────────────────────────────
function getScoreLabel(score) {
  if (score >= 88) return 'Exceptional';
  if (score >= 78) return 'Strong';
  if (score >= 68) return 'Moderate';
  return 'Developing';
}

function complexityColor(c) {
  if (c === 'Low')  return '#00ff88';
  if (c === 'High') return '#ff3b5c';
  return '#ffbe00';
}
function complexityGlow(c) {
  if (c === 'Low')  return 'rgba(0,255,136,0.3)';
  if (c === 'High') return 'rgba(255,59,92,0.3)';
  return 'rgba(255,190,0,0.3)';
}

function createScoreCard(card, index) {
  const div = document.createElement('div');
  div.className = 'score-card glass-card';
  div.style.setProperty('--card-color', card.color);
  div.style.setProperty('--card-glow', card.glow);
  div.style.animationDelay = (index * 0.08) + 's';

  if (card.value !== null) {
    div.innerHTML = `
      <div class="score-card-icon"><i class="${card.icon}"></i></div>
      <div class="score-card-label">${card.label}</div>
      <div class="score-card-value" id="scoreVal-${index}">0${card.suffix || ''}</div>
      <div class="score-bar-wrap"><div class="score-bar-fill" data-target="${card.value}"></div></div>
      <div class="score-card-chip">${card.note}</div>
    `;
  } else {
    div.innerHTML = `
      <div class="score-card-icon"><i class="${card.icon}"></i></div>
      <div class="score-card-label">${card.label}</div>
      <div class="score-card-value" style="font-size:28px;">${card.text}</div>
      <div class="score-bar-wrap"><div class="score-bar-fill" data-target="0" style="width:100%;"></div></div>
      <div class="score-card-chip">${card.note}</div>
    `;
  }
  return div;
}

function renderScoreCards(data) {
  const cards = [
    {
      label: 'Innovation Score',
      icon: 'fa-solid fa-lightbulb',
      value: data.innovation,
      suffix: '%',
      color: '#00f0ff',
      glow: 'rgba(0,240,255,0.3)',
      note: getScoreLabel(data.innovation),
    },
    {
      label: 'Feasibility Score',
      icon: 'fa-solid fa-gears',
      value: data.feasibility,
      suffix: '%',
      color: '#a855f7',
      glow: 'rgba(168,85,247,0.3)',
      note: getScoreLabel(data.feasibility),
    },
    {
      label: 'Market Demand',
      icon: 'fa-solid fa-arrow-trend-up',
      value: data.demand,
      suffix: '%',
      color: '#f72585',
      glow: 'rgba(247,37,133,0.3)',
      note: getScoreLabel(data.demand),
    },
    {
      label: 'Complexity',
      icon: 'fa-solid fa-layer-group',
      value: null,
      text: data.complexity,
      color: complexityColor(data.complexity),
      glow: complexityGlow(data.complexity),
      note: data.complexityNote,
    },
  ];

  scoreGrid.innerHTML = '';
  cards.forEach((card, i) => {
    const el = createScoreCard(card, i);
    scoreGrid.appendChild(el);
  });

  // Animate bars + numeric counters after mount
  setTimeout(() => {
    cards.forEach((card, i) => {
      const el = scoreGrid.children[i];
      const bar = el.querySelector('.score-bar-fill');
      if (card.value !== null) {
        bar.style.width = card.value + '%';
        const valEl = el.querySelector(`#scoreVal-${i}`);
        animateValue(valEl, card.value, '%');
      }
    });
  }, 100);
}

// ── Confidence meter ─────────────────────────────────────────────
function renderConfidence(confidence) {
  requestAnimationFrame(() => {
    confFill.style.width = confidence + '%';
  });
  animateValue(confValue, confidence, '%');
}

// ── Summary + suggestions ─────────────────────────────────────────
function renderSummary(data) {
  summaryText.textContent = data.summary;

  suggestionsList.innerHTML = '';
  data.suggestions.forEach((s, i) => {
    const li = document.createElement('li');
    li.style.animationDelay = (i * 0.08) + 's';
    li.innerHTML = `
      <span class="sug-num">${String(i + 1).padStart(2, '0')}</span>
      <span>${s}</span>
    `;
    suggestionsList.appendChild(li);
  });
}

// ── Charts ─────────────────────────────────────────────────────────
let chartInstances = {};

function destroyCharts() {
  Object.values(chartInstances).forEach(c => c?.destroy());
  chartInstances = {};
}

const CHART_DEFAULTS = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: { color: 'rgba(232,234,246,0.55)', font: { family: 'Inter', size: 11 }, boxWidth: 12, padding: 16 },
    },
    tooltip: {
      backgroundColor: 'rgba(5,8,18,0.92)',
      borderColor: 'rgba(0,240,255,0.3)',
      borderWidth: 1,
      titleColor: '#00f0ff',
      bodyColor: 'rgba(232,234,246,0.8)',
      padding: 10,
    },
  },
};

function renderRadarChart(data) {
  const canvas = $('radarChart');
  if (!canvas || typeof Chart === 'undefined') return;

  const complexityScore = data.manageability;

  chartInstances.radar = new Chart(canvas.getContext('2d'), {
    type: 'radar',
    data: {
      labels: ['Innovation', 'Feasibility', 'Demand', 'Manageability'],
      datasets: [{
        label: 'Idea Profile',
        data: [data.innovation, data.feasibility, data.demand, complexityScore],
        borderColor: '#00f0ff',
        backgroundColor: 'rgba(0,240,255,0.10)',
        borderWidth: 2,
        pointBackgroundColor: '#00f0ff',
        pointBorderColor: '#050812',
        pointBorderWidth: 1.5,
        pointRadius: 4,
        pointHoverRadius: 6,
      }],
    },
    options: {
      ...CHART_DEFAULTS,
      scales: {
        r: {
          min: 0,
          max: 100,
          beginAtZero: true,
          grid: { color: 'rgba(255,255,255,0.06)' },
          angleLines: { color: 'rgba(255,255,255,0.08)' },
          ticks: { display: false, stepSize: 25 },
          pointLabels: {
            color: 'rgba(232,234,246,0.55)',
            font: { family: 'Inter', size: 11 },
          },
        },
      },
      plugins: {
        ...CHART_DEFAULTS.plugins,
        legend: { display: false },
        tooltip: {
          ...CHART_DEFAULTS.plugins.tooltip,
          callbacks: { label: ctx => ` ${ctx.parsed.r}%` },
        },
      },
    },
  });
}

function renderBarChart(data) {
  const canvas = $('barChart');
  if (!canvas || typeof Chart === 'undefined') return;

  chartInstances.bar = new Chart(canvas.getContext('2d'), {
    type: 'bar',
    data: {
      labels: ['Innovation', 'Feasibility', 'Demand', 'Manageability'],
      datasets: [{
        label: 'Score (%)',
        data: [data.innovation, data.feasibility, data.demand, data.manageability],
        backgroundColor: ctx => {
          const gradient = ctx.chart.ctx.createLinearGradient(0, 0, 0, 220);
          gradient.addColorStop(0, 'rgba(124,58,237,0.7)');
          gradient.addColorStop(1, 'rgba(124,58,237,0.05)');
          return gradient;
        },
        borderColor: '#7c3aed',
        borderWidth: 1,
        borderRadius: 4,
      }],
    },
    options: {
      ...CHART_DEFAULTS,
      plugins: {
        ...CHART_DEFAULTS.plugins,
        legend: { display: false },
      },
      scales: {
        x: {
          ticks: { color: 'rgba(232,234,246,0.4)', font: { size: 10 } },
          grid:  { color: 'rgba(255,255,255,0.04)' },
        },
        y: {
          min: 0,
          max: 100,
          ticks: { color: 'rgba(232,234,246,0.4)', font: { size: 10 }, callback: v => v + '%' },
          grid:  { color: 'rgba(255,255,255,0.04)' },
        },
      },
    },
  });
}

function renderDoughnutChart(data) {
  const canvas = $('doughnutChart');
  if (!canvas || typeof Chart === 'undefined') return;

  const r = data.riskDistribution;

  chartInstances.doughnut = new Chart(canvas.getContext('2d'), {
    type: 'doughnut',
    data: {
      labels: ['Technical', 'Market', 'Financial', 'Adoption'],
      datasets: [{
        data: [r.technical, r.market, r.financial, r.adoption],
        backgroundColor: ['#00f0ff', '#a855f7', '#ffbe00', '#ff3b5c'],
        borderColor: '#050812',
        borderWidth: 2,
        hoverOffset: 6,
      }],
    },
    options: {
      ...CHART_DEFAULTS,
      cutout: '62%',
      plugins: {
        ...CHART_DEFAULTS.plugins,
        legend: {
          ...CHART_DEFAULTS.plugins.legend,
          position: 'bottom',
        },
        tooltip: {
          ...CHART_DEFAULTS.plugins.tooltip,
          callbacks: { label: ctx => ` ${ctx.label}: ${ctx.parsed}% risk` },
        },
      },
    },
  });
}

function renderCharts(data) {
  destroyCharts();
  renderRadarChart(data);
  renderBarChart(data);
  renderDoughnutChart(data);
}

// ── Main analyze flow ─────────────────────────────────────────────
async function runAnalysis() {
  const idea = ideaInput.value.trim();

  if (idea.length < 10) {
    ideaInput.focus();
    ideaInput.style.borderColor = 'var(--red)';
    setTimeout(() => { ideaInput.style.borderColor = ''; }, 900);
    return;
  }

  sessionStorage.setItem('nexora_idea', idea);

  analyzeBtn.disabled = true;
  btnText.textContent = 'Analyzing…';
  resultsPanel.classList.add('hidden');
  errorSection.classList.add('hidden');
  nextModuleBar.classList.add('hidden');

  await showLoader();
  const data = await fetchAnalysis(idea);
  hideLoader();

  // Idea banner
  ideaBannerText.textContent = idea;

  // Render everything
  renderConfidence(data.confidence);
  renderScoreCards(data);
  renderSummary(data);
  renderCharts(data);

  // Show results
  resultsPanel.classList.remove('hidden');
  nextModuleBar.classList.remove('hidden');
  resultsPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });

  analyzeBtn.disabled = false;
  btnText.textContent = 'Re-Analyze';
}

analyzeBtn.addEventListener('click', runAnalysis);

// Allow Ctrl/Cmd + Enter to trigger analysis from the textarea
if (ideaInput) {
  ideaInput.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      runAnalysis();
    }
  });
}

// ── Edit idea ─────────────────────────────────────────────────────
if (editIdeaBtn) {
  editIdeaBtn.addEventListener('click', () => {
    inputSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    ideaInput.focus();
  });
}

// ── Retry ────────────────────────────────────────────────────────
if (retryBtn) {
  retryBtn.addEventListener('click', () => {
    errorSection.classList.add('hidden');
    runAnalysis();
  });
}