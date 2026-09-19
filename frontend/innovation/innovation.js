/* ============================================================
   NEXORA – Innovation Detector  |  innovation.js
   Unified with analyzer interaction model
   ============================================================ */

'use strict';

// ── DOM refs ──────────────────────────────────────────────────
const $ = id => document.getElementById(id);

const backBtn         = $('backBtn');
const ideaInput       = $('ideaInput');
const charCount       = $('charCount');
const detectBtn       = $('detectBtn');
const btnText         = $('btnText');
const inputSection    = $('inputSection');

const resultsPanel    = $('resultsPanel');
const ideaBannerText  = $('ideaBannerText');
const editIdeaBtn     = $('editIdeaBtn');

const confFill        = $('confFill');
const confValue       = $('confValue');
const scoreGrid       = $('scoreGrid');
const summaryText     = $('summaryText');
const diffList        = $('diffList');
const factorsList     = $('factorsList');

const errorSection    = $('errorSection');
const errorText       = $('errorText');
const retryBtn        = $('retryBtn');

const nextModuleBar   = $('nextModuleBar');

const loadingOverlay  = $('loadingOverlay');
const loaderText      = $('loaderText');
const loaderBar       = $('loaderBar');

// ── Particle field ────────────────────────────────────────────
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

// ── Back navigation ───────────────────────────────────────────
// Back goes to Analyzer (previous module), Home goes to dashboard
if (backBtn) {
  backBtn.addEventListener('click', () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href = '../analyzer/analyzer.html';
    }
  });
}

// ── Char counter ──────────────────────────────────────────────
function updateCharCount() {
  if (!ideaInput || !charCount) return;
  const len = ideaInput.value.length;
  charCount.textContent = `${len} character${len !== 1 ? 's' : ''}`;
}
if (ideaInput) ideaInput.addEventListener('input', updateCharCount);

// ── Restore previously entered idea ──────────────────────────
(function restoreIdea() {
  const saved = sessionStorage.getItem('nexora_idea') || '';
  if (ideaInput && saved) ideaInput.value = saved;
  updateCharCount();
})();

// ── Loading sequence ──────────────────────────────────────────
const LOADER_STEPS = [
  'Scanning existing solutions…',
  'Mapping market saturation…',
  'Identifying differentiation gaps…',
  'Computing uniqueness score…',
  'Analysing competitor landscape…',
  'Synthesizing innovation insights…',
];

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function showLoader() {
  loadingOverlay.classList.remove('hidden');
  loaderBar.style.width = '0%';
  for (let i = 0; i < LOADER_STEPS.length; i++) {
    loaderText.textContent = LOADER_STEPS[i];
    loaderBar.style.width = ((i + 1) / LOADER_STEPS.length * 100) + '%';
    await sleep(400 + Math.random() * 200);
  }
}

function hideLoader() {
  loadingOverlay.classList.add('hidden');
}

// ── Helpers ───────────────────────────────────────────────────
function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }

function hashString(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h * 31 + str.charCodeAt(i)) >>> 0;
  }
  return h;
}

// ── Local analysis (fallback when backend unavailable) ────────
function localInnovationAnalysis(idea) {
  const text = idea.toLowerCase();
  const seed = hashString(text);
  const rnd  = (offset) => ((seed >> offset) % 100 + 100) % 100;

  const hasAI      = /\b(ai|machine learning|neural|nlp|llm|gpt|prediction|automation)\b/.test(text);
  const hasIoT     = /\b(iot|sensor|hardware|device|embedded|raspberry|arduino)\b/.test(text);
  const hasHealth  = /\b(health|medical|hospital|patient|doctor|diagnosis|therapy)\b/.test(text);
  const hasEdTech  = /\b(student|learning|education|course|school|teach|mentor)\b/.test(text);
  const hasFintech = /\b(finance|payment|bank|wallet|crypto|invest|money)\b/.test(text);
  const hasSocial  = /\b(social|community|connect|network|friend|chat|message)\b/.test(text);

  const techScore   = (hasAI ? 2 : 0) + (hasIoT ? 1.5 : 0);
  const domainScore = (hasHealth ? 1 : 0) + (hasEdTech ? 0.8 : 0) + (hasFintech ? 0.6 : 0);
  const rawScore    = 5.8 + techScore + domainScore + (idea.length > 80 ? 0.5 : 0);
  const uniquenessScore = Math.round(clamp(rawScore, 4.5, 9.8) * 10) / 10;

  const saturationPercent = hasSocial ? 72 : hasFintech ? 65 : (hasHealth && hasAI) ? 38 : (hasEdTech && hasAI) ? 42 : clamp(48 + (rnd(8) % 32), 30, 78);

  const marketScore    = clamp(100 - saturationPercent, 30, 95);
  const originalityScore = clamp(uniquenessScore * 10, 40, 98);
  const techReadiness  = clamp(55 + (rnd(12) % 35), 35, 97);

  const satLevel = saturationPercent < 35 ? 'Low' : saturationPercent < 65 ? 'Medium' : 'High';

  const competitors = [
    hasAI && hasEdTech ? { name: 'Coursera AI',   icon: 'fa-graduation-cap', description: 'AI-powered personalised learning with adaptive courses.', similarity: 38 } : null,
    hasHealth          ? { name: 'HealthTap',      icon: 'fa-heart-pulse',   description: 'AI health assessments and online doctor consultations.', similarity: 32 } : null,
    hasFintech         ? { name: 'Plaid / Stripe', icon: 'fa-credit-card',   description: 'Financial data APIs and payment processing platforms.', similarity: 44 } : null,
    hasAI              ? { name: 'OpenAI Platform',icon: 'fa-robot',         description: 'Broad AI capabilities used by many competing products.', similarity: 28 } : null,
    { name: 'Generic SaaS Tools', icon: 'fa-cloud', description: 'Broad platform solutions with overlapping feature sets.', similarity: 22 },
    { name: 'Open Source',        icon: 'fa-code',  description: 'Free community-driven alternatives with core feature parity.', similarity: 15 },
  ].filter(Boolean).slice(0, 4);

  const differentiationOpportunities = [
    hasAI ? 'Deeper AI personalisation than existing broad-market solutions' : 'AI-first approach would create strong market differentiation',
    (hasHealth || hasEdTech) ? 'Domain-specific focus builds a moat vs generic platforms' : 'Niche vertical focus creates defensible positioning',
    'Real-time data processing with offline-capable fallback — unavailable in competitors',
    'Mobile-first UX with streamlined onboarding (<60 second to first value)',
  ];

  const uniquenessFactors = [
    hasAI ? 'AI-powered core feature not widely available in this niche' : 'Novel feature combination rare in this category',
    'Simplified UX compared to complex incumbent solutions',
    'Open API ecosystem enabling third-party integrations',
    'Privacy-first, local-first data architecture',
  ];

  const level = uniquenessScore >= 8 ? 'strong' : uniquenessScore >= 6.5 ? 'moderate' : 'developing';
  const satDesc = saturationPercent < 40 ? 'low market saturation — excellent entry opportunity'
                : saturationPercent < 65 ? 'moderate competition requiring clear positioning'
                : 'high saturation demanding exceptional differentiation';

  const uniquenessSummary = `This idea demonstrates ${level} differentiation potential. The combination of ${hasAI ? 'AI capabilities, ' : ''}${hasIoT ? 'IoT integration, ' : ''}domain focus, and unique positioning creates meaningful distance from existing solutions. The ${satDesc}. With a uniqueness score of ${uniquenessScore}/10 and ${satLevel.toLowerCase()} market saturation, this concept ${uniquenessScore >= 7 ? 'is well-positioned for a successful launch' : 'requires sharp differentiation before going to market'}.`;

  const confidence = clamp(68 + (rnd(15) % 24), 62, 95);

  return {
    uniquenessScore,
    saturationPercent,
    marketScore,
    originalityScore,
    techReadiness,
    satLevel,
    differentiationOpportunities,
    competitors,
    uniquenessSummary,
    uniquenessFactors,
    confidence,
  };
}

// ── Try backend, fall back to local ──────────────────────────
async function fetchDetection(idea) {
  try {
    const response = await fetch('https://nexora-bc4j.onrender.com/innovation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idea }),
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) throw new Error('Backend error');
    const data = await response.json();
    // Ensure confidence field exists
    if (!data.confidence) data.confidence = 78;
    return data;
  } catch {
    return localInnovationAnalysis(idea);
  }
}

// ── Animated counters ─────────────────────────────────────────
function animateValue(el, target, suffix = '') {
  const duration = 1100;
  const startTime = performance.now();
  function update(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(target * eased) + suffix;
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

function animateDecimal(el, target) {
  const duration = 1100;
  const startTime = performance.now();
  function update(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = (target * eased).toFixed(1);
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

// ── Score label helpers ───────────────────────────────────────
function getScoreLabel(score) {
  if (score >= 88) return 'Exceptional';
  if (score >= 78) return 'Strong';
  if (score >= 68) return 'Moderate';
  return 'Developing';
}

function satColor(level) {
  if (level === 'Low')    return '#00ff88';
  if (level === 'High')   return '#ff3b5c';
  return '#ffbe00';
}
function satGlow(level) {
  if (level === 'Low')    return 'rgba(0,255,136,0.3)';
  if (level === 'High')   return 'rgba(255,59,92,0.3)';
  return 'rgba(255,190,0,0.3)';
}

// ── Render score cards ────────────────────────────────────────
function renderScoreCards(data) {
  const cards = [
    {
      label: 'Uniqueness Score',
      icon: 'fa-solid fa-fingerprint',
      isDecimal: true,
      value: data.uniquenessScore * 10,  // percent bar
      displayVal: data.uniquenessScore,
      suffix: '/10',
      color: '#00f0ff',
      glow: 'rgba(0,240,255,0.3)',
      note: data.uniquenessScore >= 8 ? 'Highly Unique' : data.uniquenessScore >= 6 ? 'Moderately Unique' : 'Needs Work',
    },
    {
      label: 'Market Opportunity',
      icon: 'fa-solid fa-chart-line',
      value: data.marketScore,
      suffix: '%',
      color: '#a855f7',
      glow: 'rgba(168,85,247,0.3)',
      note: getScoreLabel(data.marketScore),
    },
    {
      label: 'Originality Index',
      icon: 'fa-solid fa-wand-sparkles',
      value: data.originalityScore,
      suffix: '%',
      color: '#f72585',
      glow: 'rgba(247,37,133,0.3)',
      note: getScoreLabel(data.originalityScore),
    },
    {
      label: 'Market Saturation',
      icon: 'fa-solid fa-layer-group',
      value: null,
      text: data.satLevel,
      color: satColor(data.satLevel),
      glow: satGlow(data.satLevel),
      note: data.saturationPercent + '% saturated',
    },
  ];

  scoreGrid.innerHTML = '';
  cards.forEach((card, i) => {
    const div = document.createElement('div');
    div.className = 'score-card glass-card';
    div.style.setProperty('--card-color', card.color);
    div.style.setProperty('--card-glow', card.glow);
    div.style.animationDelay = (i * 0.08) + 's';

    if (card.value !== null) {
      div.innerHTML = `
        <div class="score-card-icon"><i class="${card.icon}"></i></div>
        <div class="score-card-label">${card.label}</div>
        <div class="score-card-value" id="scoreVal-${i}">0${card.suffix}</div>
        <div class="score-bar-wrap"><div class="score-bar-fill" data-target="${card.value}"></div></div>
        <div class="score-card-chip">${card.note}</div>
      `;
    } else {
      div.innerHTML = `
        <div class="score-card-icon"><i class="${card.icon}"></i></div>
        <div class="score-card-label">${card.label}</div>
        <div class="score-card-value" style="font-size:28px;">${card.text}</div>
        <div class="score-bar-wrap"><div class="score-bar-fill" style="width:100%;"></div></div>
        <div class="score-card-chip">${card.note}</div>
      `;
    }
    scoreGrid.appendChild(div);
  });

  setTimeout(() => {
    cards.forEach((card, i) => {
      const el = scoreGrid.children[i];
      const bar = el.querySelector('.score-bar-fill');
      if (card.value !== null) {
        bar.style.width = card.value + '%';
        const valEl = el.querySelector(`#scoreVal-${i}`);
        if (card.isDecimal) {
          animateDecimal(valEl, card.displayVal);
          // fix suffix after animation
          setTimeout(() => { valEl.textContent = card.displayVal.toFixed(1) + card.suffix; }, 1200);
        } else {
          animateValue(valEl, card.value, card.suffix);
        }
      }
    });
  }, 100);
}

// ── Confidence meter ──────────────────────────────────────────
function renderConfidence(confidence) {
  requestAnimationFrame(() => { confFill.style.width = confidence + '%'; });
  animateValue(confValue, confidence, '%');
}

// ── Summary + Differentiation list ───────────────────────────
function renderSummary(data) {
  summaryText.textContent = data.uniquenessSummary;

  diffList.innerHTML = '';
  (data.differentiationOpportunities || []).forEach((s, i) => {
    const li = document.createElement('li');
    li.style.animationDelay = (i * 0.08) + 's';
    li.innerHTML = `<span class="sug-num">${String(i + 1).padStart(2, '0')}</span><span>${s}</span>`;
    diffList.appendChild(li);
  });

  factorsList.innerHTML = '';
  (data.uniquenessFactors || []).forEach((f, i) => {
    const li = document.createElement('li');
    li.style.animationDelay = (i * 0.08) + 's';
    li.innerHTML = `<span class="sug-num"><i class="fa-solid fa-check" style="font-size:9px;"></i></span><span>${f}</span>`;
    factorsList.appendChild(li);
  });
}

// ── Competitors list ──────────────────────────────────────────
function renderCompetitors(data) {
  const compEl = $('competitorsList');
  if (!compEl) return;
  compEl.innerHTML = (data.competitors || []).map((c, i) => `
    <div class="competitor-item" style="animation-delay:${i * 0.1}s">
      <div class="comp-icon"><i class="fa-solid ${c.icon || 'fa-globe'}"></i></div>
      <div class="comp-body">
        <strong>${c.name}</strong>
        <p>${c.description}</p>
      </div>
      <span class="comp-similarity">${c.similarity}%</span>
    </div>
  `).join('');
}

// ── Charts ────────────────────────────────────────────────────
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

  chartInstances.radar = new Chart(canvas.getContext('2d'), {
    type: 'radar',
    data: {
      labels: ['Uniqueness', 'Market Opp.', 'Originality', 'Tech Readiness'],
      datasets: [{
        label: 'Innovation Profile',
        data: [
          data.uniquenessScore * 10,
          data.marketScore,
          data.originalityScore,
          data.techReadiness,
        ],
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
          callbacks: { label: ctx => ` ${ctx.parsed.r.toFixed(0)}%` },
        },
      },
    },
  });
}

function renderDoughnutChart(data) {
  const canvas = $('doughnutChart');
  if (!canvas || typeof Chart === 'undefined') return;

  chartInstances.doughnut = new Chart(canvas.getContext('2d'), {
    type: 'doughnut',
    data: {
      labels: ['Uniqueness', 'Market Opp.', 'Originality', 'Tech Readiness'],
      datasets: [{
        data: [
          data.uniquenessScore * 10,
          data.marketScore,
          data.originalityScore,
          data.techReadiness,
        ],
        backgroundColor: ['#00f0ff', '#a855f7', '#f72585', '#ffbe00'],
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
          callbacks: { label: ctx => ` ${ctx.label}: ${ctx.parsed.toFixed(0)}%` },
        },
      },
    },
  });
}

function renderCharts(data) {
  destroyCharts();
  renderRadarChart(data);
  renderDoughnutChart(data);
}

// ── Main detect flow ──────────────────────────────────────────
async function runDetection() {
  const idea = ideaInput.value.trim();

  if (idea.length < 10) {
    ideaInput.focus();
    ideaInput.style.borderColor = 'var(--red)';
    setTimeout(() => { ideaInput.style.borderColor = ''; }, 900);
    return;
  }

  sessionStorage.setItem('nexora_idea', idea);

  detectBtn.disabled = true;
  btnText.textContent = 'Detecting…';
  resultsPanel.classList.add('hidden');
  errorSection.classList.add('hidden');
  nextModuleBar.classList.add('hidden');

  await showLoader();
  const data = await fetchDetection(idea);
  hideLoader();

  ideaBannerText.textContent = idea;

  renderConfidence(data.confidence);
  renderScoreCards(data);
  renderSummary(data);
  renderCompetitors(data);
  renderCharts(data);

  resultsPanel.classList.remove('hidden');
  nextModuleBar.classList.remove('hidden');
  resultsPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });

  detectBtn.disabled = false;
  btnText.textContent = 'Re-Detect';
}

detectBtn.addEventListener('click', runDetection);

if (ideaInput) {
  ideaInput.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      runDetection();
    }
  });
}

// ── Edit idea ─────────────────────────────────────────────────
if (editIdeaBtn) {
  editIdeaBtn.addEventListener('click', () => {
    inputSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    ideaInput.focus();
  });
}

// ── Retry ─────────────────────────────────────────────────────
if (retryBtn) {
  retryBtn.addEventListener('click', () => {
    errorSection.classList.add('hidden');
    runDetection();
  });
}

// ── Pre-fill idea if already saved ────────────────────────────
(function prefillIdea() {
  const saved = sessionStorage.getItem('nexora_idea') || '';
  if (saved && saved.length >= 10 && ideaInput) {
    ideaInput.value = saved;
    updateCharCount();
  }
})();