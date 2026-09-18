/* ============================================================
   NEXORA – Future Impact Simulator  |  future_simulator.js
   ============================================================ */

'use strict';

// ── DOM refs ──────────────────────────────────────────────────
const $  = id => document.getElementById(id);
const $q = sel => document.querySelector(sel);

const simulateBtn   = $('simulateBtn');
const btnText       = $('btnText');
const resultsPanel  = $('resultsPanel');
const loadingOverlay = $('loadingOverlay');
const loaderText    = $('loaderText');
const loaderBar     = $('loaderBar');

// ── Restore previously entered idea ──────────────────────────
(function restoreIdea() {
  const saved = sessionStorage.getItem('nexora_idea') || '';
  const projectIdeaInput = $('projectIdea');
  if (projectIdeaInput && saved) {
    projectIdeaInput.value = saved;
  }
})();

// ── Particle field ────────────────────────────────────────────
(function buildParticles() {
  const field = $('particleField');
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

// ── Inject SVG gradient defs ──────────────────────────────────
document.body.insertAdjacentHTML('afterbegin', `
  <svg class="svg-defs" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%"   stop-color="#7c3aed"/>
        <stop offset="100%" stop-color="#00f0ff"/>
      </linearGradient>
    </defs>
  </svg>
`);

// ── Chart instances (for destroy on re-run) ───────────────────
let chartInstances = {};

// ── Loading sequence ──────────────────────────────────────────
const LOADER_STEPS = [
  'Initializing quantum model…',
  'Scanning market signals…',
  'Running Monte Carlo simulations…',
  'Calculating risk vectors…',
  'Projecting growth trajectories…',
  'Synthesizing AI insights…',
  'Finalizing future report…',
];

async function showLoader() {
  loadingOverlay.classList.remove('hidden');
  loaderBar.style.width = '0%';
  for (let i = 0; i < LOADER_STEPS.length; i++) {
    loaderText.textContent = LOADER_STEPS[i];
    loaderBar.style.width = ((i + 1) / LOADER_STEPS.length * 100) + '%';
    await sleep(420 + Math.random() * 200);
  }
}

function hideLoader() {
  loadingOverlay.classList.add('hidden');
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

// ── Mock data generator ───────────────────────────────────────
function generateMockData(idea, industry, stage) {
  const base = {
    fintech: { success: 74, mvp: '4 Months', users: '1,500–3,000', ttm: '8 Months', roi: '240%' },
    healthtech: { success: 68, mvp: '6 Months', users: '800–1,500', ttm: '10 Months', roi: '310%' },
    edtech: { success: 71, mvp: '3 Months', users: '2,000–5,000', ttm: '6 Months', roi: '190%' },
    saas: { success: 78, mvp: '3 Months', users: '500–1,200', ttm: '7 Months', roi: '280%' },
    consumer: { success: 65, mvp: '2 Months', users: '5,000–15,000', ttm: '5 Months', roi: '160%' },
    ecommerce: { success: 61, mvp: '2 Months', users: '3,000–8,000', ttm: '4 Months', roi: '140%' },
    ai: { success: 82, mvp: '5 Months', users: '800–2,000', ttm: '9 Months', roi: '420%' },
  }[industry] || { success: 72, mvp: '4 Months', users: '1,000–2,500', ttm: '7 Months', roi: '220%' };

  const stageBonus = { idea: 0, validation: 4, mvp: 8, launched: 14 }[stage] || 0;
  const successProb = Math.min(96, base.success + stageBonus + Math.floor(Math.random() * 8));

  // Risk levels vary by industry
  const riskMatrix = {
    fintech:   { technical: 'medium', market: 'low',    financial: 'high',   adoption: 'medium' },
    healthtech:{ technical: 'high',   market: 'medium', financial: 'high',   adoption: 'high'   },
    edtech:    { technical: 'low',    market: 'medium', financial: 'medium', adoption: 'medium' },
    saas:      { technical: 'medium', market: 'medium', financial: 'medium', adoption: 'low'    },
    consumer:  { technical: 'low',    market: 'high',   financial: 'medium', adoption: 'high'   },
    ecommerce: { technical: 'low',    market: 'high',   financial: 'high',   adoption: 'medium' },
    ai:        { technical: 'high',   market: 'low',    financial: 'high',   adoption: 'medium' },
  }[industry] || { technical: 'medium', market: 'medium', financial: 'medium', adoption: 'medium' };

  // Chart data – realistic growth curves
  const months = ['M1','M2','M3','M4','M5','M6','M7','M8','M9','M10','M11','M12'];
  const userGrowth = months.map((_, i) => Math.round((i * i * 18 + i * 50) * (successProb / 80)));
  const revGrowth  = months.map((_, i) => Math.round((i * i * 2.5 + i * 8) * (successProb / 80)));
  const adoptOpt   = months.map((_, i) => Math.min(100, Math.round(i * 9.5)));
  const adoptReal  = months.map((_, i) => Math.min(80,  Math.round(i * 6.8)));
  const adoptPess  = months.map((_, i) => Math.min(55,  Math.round(i * 4.5)));

  // AI Insights tailored by industry
  const insightBank = {
    fintech: [
      'Partner with established banks early to bypass regulatory friction.',
      'KYC/AML compliance is non-negotiable — budget 20% of dev time for it.',
      'Freemium with a clear upgrade hook drives the best fintech retention.',
      'Focus your first 3 months on a single, painful workflow users do daily.',
      'Trust signals (security badges, audit reports) halve your churn in B2C.',
    ],
    healthtech: [
      'Validate with clinicians before writing a single line of production code.',
      'HIPAA/GDPR compliance architecture must be designed in from day one.',
      'Insurance reimbursement pathway can 10x your TAM — explore it early.',
      'A pilot with one hospital or clinic is worth 100 user interviews.',
      'Design for the most tech-averse user in the care pathway, not the most tech-savvy.',
    ],
    edtech: [
      'Bite-sized learning units (under 7 min) consistently outperform long-form.',
      'Retention, not acquisition, is the edtech metric that predicts LTV.',
      'School/district partnerships unlock B2B revenue and social proof simultaneously.',
      'Gamification elements reduce dropout by up to 40% — use them deliberately.',
      'Curriculum alignment to standards dramatically speeds up institutional adoption.',
    ],
    ai: [
      'Validate with early users before scaling infrastructure costs.',
      'Prioritize your unique data moat — it\'s your defensible competitive edge.',
      'Reduce technical complexity through phased model releases.',
      'Explainability features drive enterprise trust and accelerate procurement.',
      'Optimize for latency first; accuracy improvements mean nothing if the UX is slow.',
    ],
  };
  const insights = (insightBank[industry] || [
    'Validate with early users before scaling.',
    'Prioritize the differentiating feature in your first release.',
    'Reduce technical complexity through phased releases.',
    'Build retention mechanics before growth mechanics.',
    'Design your monetization model alongside the product, not after.',
  ]).slice(0, 5);

  // Scenarios
  const scenarios = {
    optimistic: {
      title: '🟢 Optimistic Scenario',
      color: '#00ff88',
      outcomes: [
        'Rapid early adoption exceeds projections by 3×',
        'Strong word-of-mouth creates viral growth loop',
        'Revenue breakeven achieved within 14 months',
        'Strategic acqui-hire or partnership interest at month 18',
      ],
      risks: [
        'Scaling infrastructure faster than planned is costly',
        'Team burn-out from hyper-growth execution',
        'Copycat competitors emerge within 6 months',
      ],
      opportunities: [
        'First-mover advantage in an underserved segment',
        'Data flywheel accelerates product quality',
        'Fundraising leverage at favorable valuation',
      ],
    },
    realistic: {
      title: '🟡 Realistic Scenario',
      color: '#ffbe00',
      outcomes: [
        'Steady user growth with expected acquisition costs',
        'MVP validated in 3–4 months with 200–500 beta users',
        'Break-even projected at 18–24 months post-launch',
        'Series A viability after 12 months of traction data',
      ],
      risks: [
        'Feature creep delays launch by 4–6 weeks',
        'Customer acquisition costs exceed initial estimates',
        'One major competitor pivots into your space',
      ],
      opportunities: [
        'Niche communities can be activated as early evangelists',
        'Strategic content marketing reduces paid CAC over time',
        'API/platform layer opens B2B revenue alongside B2C',
      ],
    },
    pessimistic: {
      title: '🔴 Pessimistic Scenario',
      color: '#ff3b5c',
      outcomes: [
        'User adoption slower than modeled due to behavior change friction',
        'Runway runs short before product-market fit is confirmed',
        'Forced pivot required at month 8–10',
        'Team attrition affects delivery velocity',
      ],
      risks: [
        'Regulatory changes impact core product functionality',
        'Key technical dependencies become unavailable or costly',
        'Market downturn freezes discretionary spending in the segment',
      ],
      opportunities: [
        'Pivot data reveals an adjacent opportunity with less competition',
        'Lean phase builds operational discipline and unit economics clarity',
        'Bridge funding available if 2–3 core KPIs show directional movement',
      ],
    },
  };

  return {
    successProb,
    failProb: 100 - successProb,
    mvp: base.mvp,
    earlyUsers: base.users,
    ttm: base.ttm,
    roi: base.roi,
    risks: [
      {
        name: 'Technical Risk',
        level: riskMatrix.technical,
        icon: '⚙️',
        desc: 'Complexity of implementation, tech stack choices, and engineering talent availability.',
        mitigation: 'Prototype the hardest component first. Validate feasibility before full-stack commitment.',
      },
      {
        name: 'Market Risk',
        level: riskMatrix.market,
        icon: '📊',
        desc: 'Uncertainty in market readiness, demand validation, and incumbent response.',
        mitigation: 'Run a 2-week paid acquisition experiment before building to validate willingness to pay.',
      },
      {
        name: 'Financial Risk',
        level: riskMatrix.financial,
        icon: '💰',
        desc: 'Capital requirements, burn rate management, and path to sustainable unit economics.',
        mitigation: 'Target a 18-month runway and build a financial model with three burn scenarios.',
      },
      {
        name: 'Adoption Risk',
        level: riskMatrix.adoption,
        icon: '👥',
        desc: 'Behavioral change required from users, onboarding friction, and churn risk.',
        mitigation: 'Design a concierge onboarding for the first 50 users and treat it as a research sprint.',
      },
    ],
    timeline: [
      { icon: '🔬', label: 'Research', duration: '2–3 Weeks', desc: 'Market research, competitive analysis, user interviews' },
      { icon: '🏗️', label: 'MVP Dev', duration: '6–10 Weeks', desc: 'Core feature loop, architecture, and first deployable build' },
      { icon: '🧪', label: 'Testing', duration: '2–3 Weeks', desc: 'QA, performance tuning, and private user testing' },
      { icon: '🚀', label: 'Beta Launch', duration: '4–6 Weeks', desc: 'Invite-only beta, rapid iteration, NPS measurement' },
      { icon: '🌐', label: 'Public Launch', duration: '2 Weeks', desc: 'Full release, press, and growth channel activation' },
      { icon: '📈', label: 'Scaling', duration: '6–12 Months', desc: 'Growth loops, team expansion, and Series A prep' },
    ],
    chartData: { months, userGrowth, revGrowth, adoptOpt, adoptReal, adoptPess },
    insights,
    scenarios,
  };
}

// ── Try backend, fall back to mock ───────────────────────────
async function fetchSimulation(idea, industry, stage) {
  try {
    const response = await fetch('http://localhost:5000/api/future-simulator', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idea, industry, stage }),
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) throw new Error('Backend error');
    return await response.json();
  } catch {
    // Backend unavailable — use mock data
    return generateMockData(idea, industry, stage);
  }
}

// ── Render helpers ────────────────────────────────────────────
function animateValue(el, target, suffix = '') {
  const start = 0;
  const duration = 1200;
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

function renderProjection(data) {
  // Ring animation
  const circumference = 452;
  const offset = circumference - (data.successProb / 100) * circumference;
  const ring = $('successRing');
  // Defer to allow CSS transition
  requestAnimationFrame(() => {
    ring.style.strokeDashoffset = offset;
  });

  const probEl = $('successProb');
  animateValue(probEl, data.successProb, '%');
  $('failProb').textContent = data.failProb + '%';
  $('mvpTime').textContent = data.mvp;
  $('earlyUsers').textContent = data.earlyUsers;
  $('timeToMarket').textContent = data.ttm;
  $('roiEstimate').textContent = data.roi;
}

const LEVEL_VALS = { low: 28, medium: 58, high: 88 };

function renderRisks(risks) {
  const grid = $('riskGrid');
  grid.innerHTML = '';
  risks.forEach((r, i) => {
    const card = document.createElement('div');
    card.className = `risk-card risk-card--${r.level} glass-card`;
    card.style.animationDelay = (i * 0.1) + 's';
    card.innerHTML = `
      <div class="risk-header">
        <span class="risk-name">${r.icon} ${r.name}</span>
        <span class="risk-badge risk-badge--${r.level}">${r.level.toUpperCase()}</span>
      </div>
      <div class="risk-bar-wrap">
        <div class="risk-bar risk-bar--${r.level}" data-target="${LEVEL_VALS[r.level]}"></div>
      </div>
      <div class="risk-desc">${r.desc}</div>
      <div class="risk-mitigation">${r.mitigation}</div>
    `;
    grid.appendChild(card);
  });
  // Animate bars after render
  setTimeout(() => {
    grid.querySelectorAll('.risk-bar').forEach(bar => {
      bar.style.width = bar.dataset.target + '%';
    });
  }, 80);
}

function renderTimeline(phases) {
  const track = $('timelineTrack');
  track.innerHTML = '';
  phases.forEach((p, i) => {
    const phase = document.createElement('div');
    phase.className = 'tl-phase';
    phase.style.animationDelay = (i * 0.12) + 's';
    phase.innerHTML = `
      <div class="tl-dot-wrap">
        <div class="tl-dot">${p.icon}</div>
        ${i < phases.length - 1 ? '<div class="tl-connector"></div>' : ''}
      </div>
      <div class="tl-label">${p.label}</div>
      <div class="tl-duration">${p.duration}</div>
      <div class="tl-desc">${p.desc}</div>
    `;
    track.appendChild(phase);
  });
}

function destroyCharts() {
  Object.values(chartInstances).forEach(c => c?.destroy());
  chartInstances = {};
}

const CHART_DEFAULTS = {
  responsive: true,
  maintainAspectRatio: true,
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
  scales: {
    x: {
      ticks: { color: 'rgba(232,234,246,0.4)', font: { size: 10 } },
      grid:  { color: 'rgba(255,255,255,0.04)' },
    },
    y: {
      ticks: { color: 'rgba(232,234,246,0.4)', font: { size: 10 } },
      grid:  { color: 'rgba(255,255,255,0.04)' },
    },
  },
};

function renderCharts(cd) {
  destroyCharts();

  // User Growth
  const ugCtx = $('userGrowthChart').getContext('2d');
  chartInstances.userGrowth = new Chart(ugCtx, {
    type: 'line',
    data: {
      labels: cd.months,
      datasets: [{
        label: 'Users',
        data: cd.userGrowth,
        borderColor: '#00f0ff',
        backgroundColor: 'rgba(0,240,255,0.08)',
        borderWidth: 2,
        pointRadius: 3,
        pointBackgroundColor: '#00f0ff',
        fill: true,
        tension: 0.4,
      }],
    },
    options: { ...CHART_DEFAULTS },
  });

  // Revenue
  const revCtx = $('revenueChart').getContext('2d');
  chartInstances.revenue = new Chart(revCtx, {
    type: 'bar',
    data: {
      labels: cd.months,
      datasets: [{
        label: 'Revenue (K)',
        data: cd.revGrowth,
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
    options: { ...CHART_DEFAULTS },
  });

  // Adoption Trend
  const adoptCtx = $('adoptionChart').getContext('2d');
  chartInstances.adoption = new Chart(adoptCtx, {
    type: 'line',
    data: {
      labels: cd.months,
      datasets: [
        {
          label: 'Optimistic',
          data: cd.adoptOpt,
          borderColor: '#00ff88',
          borderWidth: 2,
          pointRadius: 2,
          fill: false,
          tension: 0.4,
        },
        {
          label: 'Realistic',
          data: cd.adoptReal,
          borderColor: '#ffbe00',
          borderWidth: 2,
          pointRadius: 2,
          fill: false,
          tension: 0.4,
        },
        {
          label: 'Pessimistic',
          data: cd.adoptPess,
          borderColor: '#ff3b5c',
          borderWidth: 2,
          pointRadius: 2,
          borderDash: [4, 4],
          fill: false,
          tension: 0.4,
        },
      ],
    },
    options: {
      ...CHART_DEFAULTS,
      scales: {
        ...CHART_DEFAULTS.scales,
        y: {
          ...CHART_DEFAULTS.scales.y,
          ticks: { ...CHART_DEFAULTS.scales.y.ticks, callback: v => v + '%' },
        },
      },
    },
  });
}

function renderInsights(insights) {
  const grid = $('insightsGrid');
  grid.innerHTML = '';
  insights.forEach((text, i) => {
    const card = document.createElement('div');
    card.className = 'insight-card';
    card.style.animationDelay = (i * 0.1) + 's';
    card.innerHTML = `
      <div class="insight-num">0${i + 1}</div>
      <div class="insight-text">${text}</div>
    `;
    grid.appendChild(card);
  });
}

// ── Scenario panel ────────────────────────────────────────────
let currentScenarios = {};

function renderScenario(key) {
  const s = currentScenarios[key];
  if (!s) return;
  const panel = $('scenarioPanel');
  panel.style.animation = 'none';
  panel.offsetHeight; // reflow
  panel.style.animation = '';
  panel.innerHTML = `
    <div class="scenario-title" style="color:${s.color}">${s.title}</div>
    <div class="scenario-cols">
      <div>
        <div class="scenario-col-title scenario-col-title--outcomes">EXPECTED OUTCOMES</div>
        <ul class="scenario-list">${s.outcomes.map(o => `<li>${o}</li>`).join('')}</ul>
      </div>
      <div>
        <div class="scenario-col-title scenario-col-title--risks">RISKS</div>
        <ul class="scenario-list">${s.risks.map(r => `<li>${r}</li>`).join('')}</ul>
      </div>
      <div>
        <div class="scenario-col-title scenario-col-title--opps">OPPORTUNITIES</div>
        <ul class="scenario-list">${s.opportunities.map(o => `<li>${o}</li>`).join('')}</ul>
      </div>
    </div>
  `;
}

document.addEventListener('click', e => {
  const tab = e.target.closest('.scenario-tab');
  if (!tab) return;
  document.querySelectorAll('.scenario-tab').forEach(t => t.classList.remove('active'));
  tab.classList.add('active');
  renderScenario(tab.dataset.scenario);
});

// ── Main simulation flow ──────────────────────────────────────
simulateBtn.addEventListener('click', async () => {
  const idea     = $('projectIdea').value.trim() || 'AI-powered personal finance coach';
  const industry = $('industrySelect').value;
  const stage    = $('stageSelect').value;

  sessionStorage.setItem('nexora_idea', idea);

  simulateBtn.disabled = true;
  btnText.textContent  = 'Simulating…';
  resultsPanel.classList.add('hidden');

  await showLoader();
  const data = await fetchSimulation(idea, industry, stage);
  hideLoader();

  // Store scenarios for tab switching
  currentScenarios = data.scenarios;

  // Render all sections
  renderProjection(data);
  renderRisks(data.risks);
  renderTimeline(data.timeline);
  renderCharts(data.chartData);
  renderInsights(data.insights);

  // Default to realistic scenario
  document.querySelectorAll('.scenario-tab').forEach(t => t.classList.remove('active'));
  document.querySelector('[data-scenario="realistic"]').classList.add('active');
  renderScenario('realistic');

  // Show results
  resultsPanel.classList.remove('hidden');
  resultsPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });

  simulateBtn.disabled = false;
  btnText.textContent  = 'Re-Simulate';
});

// ── Auto-run disabled per request ───────────────────