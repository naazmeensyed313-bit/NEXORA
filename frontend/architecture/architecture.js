/* NEXORA — Architecture Builder JS
   Draws an animated SVG architecture diagram from backend API.
*/
(function () {
  'use strict';

  // ── Particle field ──
  (function buildParticles() {
    const field = document.getElementById('particleField');
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
        animationDelay:    (Math.random() * 15) + 's'
      });
      field.appendChild(p);
    }
  })();

  const idea = sessionStorage.getItem('nexora_idea') || 'Your innovative idea';
  const ideaBannerText = document.getElementById('ideaBannerText');
  if (ideaBannerText) ideaBannerText.textContent = idea;

  let NODES = [];
  let CONNECTIONS = [];
  let TECH_STACK = [];
  const POSITIONS = {};

  const TIER_COLORS = ['#00f0ff', '#00ff88', '#7c3aed', '#ffbe00', '#f72585', '#10b981'];

  async function fetchArchitectureData() {
    try {
      const res = await fetch('https://nexora-bc4j.onrender.com/architecture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idea })
      });
      if (!res.ok) throw new Error('API Error');
      return await res.json();
    } catch (error) {
      console.warn("Falling back to local generated data due to error:", error);
      return generateMockArchitecture();
    }
  }

  function generateMockArchitecture() {
    return {
      tiers: [
        {
          name: "Presentation Layer",
          nodes: [
            { name: "Web / Mobile", icon: "fa-desktop", desc: "User Interface", tech: ["React", "HTML/CSS"] }
          ]
        },
        {
          name: "Application Layer",
          nodes: [
            { name: "Backend API", icon: "fa-server", desc: "Business Logic", tech: ["Node.js", "Express"] }
          ]
        },
        {
          name: "Data Layer",
          nodes: [
            { name: "Database", icon: "fa-database", desc: "Persistent Storage", tech: ["PostgreSQL"] }
          ]
        }
      ]
    };
  }

  function processArchitectureData(data) {
    NODES = [];
    CONNECTIONS = [];
    TECH_STACK = [];
    
    if (!data.tiers) return;

    const spacingX = 250;
    const startY = 80;
    const spacingY = 120;

    data.tiers.forEach((tier, tIdx) => {
      const color = TIER_COLORS[tIdx % TIER_COLORS.length];
      const tierWidth = (tier.nodes.length - 1) * spacingX;
      const startX = 400 - tierWidth / 2;
      const y = startY + tIdx * spacingY;

      tier.nodes.forEach((node, nIdx) => {
        const id = `node_${tIdx}_${nIdx}`;
        const x = startX + nIdx * spacingX;

        NODES.push({
          id,
          label: node.name || 'Component',
          faIcon: node.icon || 'fa-server',
          color: color,
          desc: node.desc || 'System component',
          techs: node.tech || [],
          layer: tier.name || `Layer ${tIdx+1}`
        });

        POSITIONS[id] = { x, y };

        TECH_STACK.push({
          layer: tier.name,
          icon: node.icon ? `fa-solid ${node.icon}` : 'fa-solid fa-microchip',
          name: (node.tech || []).join(' + ') || node.name
        });

        // Connect to previous tier
        if (tIdx > 0) {
          const prevTier = data.tiers[tIdx - 1];
          prevTier.nodes.forEach((_, pIdx) => {
            CONNECTIONS.push({
              from: `node_${tIdx - 1}_${pIdx}`,
              to: id
            });
          });
        }
      });
    });
  }

  function renderSidebar() {
    const layerList = document.getElementById('layerList');
    if (layerList) {
      layerList.innerHTML = '';
      NODES.forEach(n => {
        const btn = document.createElement('button');
        btn.className = 'layer-btn';
        btn.dataset.nodeId = n.id;
        btn.innerHTML = `<i class="fa-solid ${n.faIcon}" style="color:${n.color}"></i><span>${n.label}</span>`;
        btn.addEventListener('click', () => highlightNode(n.id));
        layerList.appendChild(btn);
      });
    }

    const techEl = document.getElementById('techStackList');
    if (techEl) {
      techEl.innerHTML = TECH_STACK.map((t, i) => `
        <div class="tech-item" style="animation-delay:${i * 0.07}s">
          <i class="${t.icon}"></i>
          <div class="tech-item-body">
            <small>${t.layer}</small>
            <strong>${t.name}</strong>
          </div>
        </div>
      `).join('');
    }
  }

  // Draw SVG
  const canvasWrap = document.getElementById('archCanvas');
  let activeNode = null;
  let animating = false;
  let animInterval = null;

  function drawDiagram() {
    if (!canvasWrap) return;
    canvasWrap.innerHTML = '';

    const ns = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('viewBox', '0 0 800 500');
    svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');

    // Defs
    const defs = document.createElementNS(ns, 'defs');
    NODES.forEach(n => {
      const grad = document.createElementNS(ns, 'radialGradient');
      grad.setAttribute('id', `grad_${n.id}`);
      grad.setAttribute('cx', '40%'); grad.setAttribute('cy', '35%'); grad.setAttribute('r', '70%');
      const s1 = document.createElementNS(ns, 'stop'); s1.setAttribute('offset', '0%'); s1.setAttribute('stop-color', n.color); s1.setAttribute('stop-opacity', '0.25');
      const s2 = document.createElementNS(ns, 'stop'); s2.setAttribute('offset', '100%'); s2.setAttribute('stop-color', n.color); s2.setAttribute('stop-opacity', '0.06');
      grad.appendChild(s1); grad.appendChild(s2);
      defs.appendChild(grad);

      const filter = document.createElementNS(ns, 'filter');
      filter.setAttribute('id', `glow_${n.id}`);
      filter.setAttribute('x', '-50%'); filter.setAttribute('y', '-50%'); filter.setAttribute('width', '200%'); filter.setAttribute('height', '200%');
      const feGaus = document.createElementNS(ns, 'feGaussianBlur'); feGaus.setAttribute('stdDeviation', '6'); feGaus.setAttribute('result', 'coloredBlur');
      const feMerge = document.createElementNS(ns, 'feMerge');
      const fmn1 = document.createElementNS(ns, 'feMergeNode'); fmn1.setAttribute('in', 'coloredBlur');
      const fmn2 = document.createElementNS(ns, 'feMergeNode'); fmn2.setAttribute('in', 'SourceGraphic');
      feMerge.appendChild(fmn1); feMerge.appendChild(fmn2);
      filter.appendChild(feGaus); filter.appendChild(feMerge);
      defs.appendChild(filter);
    });
    svg.appendChild(defs);

    // Draw connections first
    CONNECTIONS.forEach((conn, i) => {
      const p1 = POSITIONS[conn.from];
      const p2 = POSITIONS[conn.to];
      if (!p1 || !p2) return;

      const boxH = 76;
      let startY = p1.y + boxH/2;
      let endY = p2.y - boxH/2;
      
      if (p1.y > p2.y) {
          startY = p1.y - boxH/2;
          endY = p2.y + boxH/2;
      }

      const midY = (startY + endY) / 2;

      const path = document.createElementNS(ns, 'path');
      path.setAttribute('d', `M ${p1.x} ${startY} C ${p1.x} ${midY}, ${p2.x} ${midY}, ${p2.x} ${endY}`);
      path.setAttribute('class', 'arch-connection');
      path.setAttribute('id', `conn_${conn.from}_${conn.to}`);
      path.setAttribute('stroke', 'rgba(155,93,229,0.3)');
      path.setAttribute('stroke-width', '2');
      path.setAttribute('stroke-dasharray', '6 4');
      svg.appendChild(path);
    });

    // Draw nodes
    NODES.forEach((node, i) => {
      const pos = POSITIONS[node.id];
      if (!pos) return;
      const g = document.createElementNS(ns, 'g');
      g.setAttribute('class', 'arch-node');
      g.setAttribute('id', `node_${node.id}`);
      g.setAttribute('transform', `translate(${pos.x}, ${pos.y})`);
      g.setAttribute('style', `--node-color: ${node.color}`);

      const boxW = 200;
      const boxH = 76;

      const rectBg = document.createElementNS(ns, 'rect');
      rectBg.setAttribute('x', -boxW/2); rectBg.setAttribute('y', -boxH/2);
      rectBg.setAttribute('width', boxW); rectBg.setAttribute('height', boxH);
      rectBg.setAttribute('rx', '12'); rectBg.setAttribute('fill', 'rgba(10, 14, 24, 0.8)');
      rectBg.setAttribute('stroke', node.color); rectBg.setAttribute('stroke-width', '1.5');
      rectBg.setAttribute('class', 'node-bg');
      g.appendChild(rectBg);

      const iconWrap = document.createElementNS(ns, 'foreignObject');
      iconWrap.setAttribute('x', -boxW/2 + 14); iconWrap.setAttribute('y', -boxH/2 + 14);
      iconWrap.setAttribute('width', '48'); iconWrap.setAttribute('height', '48');
      iconWrap.innerHTML = `<div xmlns="http://www.w3.org/1999/xhtml" style="display:flex;align-items:center;justify-content:center;width:100%;height:100%;background:${node.color}22;border-radius:10px;border:1px solid ${node.color}44;box-shadow:inset 0 0 10px ${node.color}22;">
        <i class="fa-solid ${node.faIcon}" style="color:${node.color};font-size:20px;"></i>
      </div>`;
      g.appendChild(iconWrap);

      const label = document.createElementNS(ns, 'text');
      label.setAttribute('x', -boxW/2 + 74); label.setAttribute('y', -2);
      label.setAttribute('fill', 'var(--text, #f0f4ff)'); label.setAttribute('font-family', 'var(--font-body, Inter, sans-serif)');
      label.setAttribute('font-size', '14'); label.setAttribute('font-weight', '600');
      label.textContent = node.label;
      g.appendChild(label);

      const subLabel = document.createElementNS(ns, 'text');
      subLabel.setAttribute('x', -boxW/2 + 74); subLabel.setAttribute('y', 18);
      subLabel.setAttribute('fill', 'var(--muted, #6b7fa3)'); subLabel.setAttribute('font-family', 'var(--font-body, Inter, sans-serif)');
      subLabel.setAttribute('font-size', '11');
      subLabel.textContent = node.layer;
      g.appendChild(subLabel);

      g.addEventListener('click', () => highlightNode(node.id));
      g.addEventListener('mouseenter', () => { g.style.transform = `translate(${pos.x}px, ${pos.y}px) scale(1.04)`; });
      g.addEventListener('mouseleave', () => { if (activeNode !== node.id) g.style.transform = `translate(${pos.x}px, ${pos.y}px) scale(1)`; });

      g.style.opacity = '0';
      g.style.transition = 'transform 0.3s, opacity 0.4s';
      setTimeout(() => { g.style.opacity = '1'; }, 100 + i * 100);

      svg.appendChild(g);
    });

    canvasWrap.appendChild(svg);
  }

  function highlightNode(nodeId) {
    activeNode = nodeId;
    const node = NODES.find(n => n.id === nodeId);
    if (!node) return;

    document.querySelectorAll('.layer-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.nodeId === nodeId);
    });

    document.querySelectorAll('.arch-connection').forEach(el => el.classList.remove('highlighted'));
    CONNECTIONS.forEach(c => {
      if (c.from === nodeId || c.to === nodeId) {
        const el = document.getElementById(`conn_${c.from}_${c.to}`);
        if (el) el.classList.add('highlighted');
      }
    });

    const detailContent = document.getElementById('nodeDetailContent');
    if (detailContent) {
      detailContent.innerHTML = `
        <div class="node-detail-header">
          <div class="node-detail-icon"><i class="fa-solid ${node.faIcon}"></i></div>
          <span class="node-detail-name">${node.label}</span>
        </div>
        <p class="node-detail-desc">${node.desc}</p>
        <div class="node-detail-techs">
          ${node.techs.map(t => `<span class="node-tech-badge">${t}</span>`).join('')}
        </div>
      `;
    }
  }

  function animateDataFlow() {
    if (animating) {
      clearInterval(animInterval);
      animating = false;
      document.getElementById('animateBtn').innerHTML = '<i class="fa-solid fa-play"></i>';
      document.querySelectorAll('.arch-connection').forEach(el => el.classList.remove('data-flow'));
      return;
    }

    animating = true;
    document.getElementById('animateBtn').innerHTML = '<i class="fa-solid fa-stop"></i>';

    let step = 0;
    animInterval = setInterval(() => {
      document.querySelectorAll('.arch-connection').forEach(el => el.classList.remove('data-flow'));
      if (step < CONNECTIONS.length) {
        const c = CONNECTIONS[step];
        const el = document.getElementById(`conn_${c.from}_${c.to}`);
        if (el) el.classList.add('data-flow');
      }
      step = (step + 1) % (CONNECTIONS.length + 1);
    }, 600);
  }

  document.getElementById('resetBtn')?.addEventListener('click', () => {
    activeNode = null;
    document.querySelectorAll('.layer-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.arch-connection').forEach(c => c.classList.remove('highlighted', 'data-flow'));
    const detail = document.getElementById('nodeDetailContent');
    if (detail) detail.innerHTML = '<p style="font-size:13px;color:var(--muted);">Click any node to see details.</p>';
  });

  document.getElementById('animateBtn')?.addEventListener('click', animateDataFlow);

  // Init logic
  const genBtn = document.getElementById('generateArchBtn');
  const initState = document.getElementById('archInitialState');
  const loadingState = document.getElementById('archLoadingState');
  
  if (genBtn && initState && loadingState) {
    genBtn.addEventListener('click', async () => {
      initState.style.display = 'none';
      loadingState.style.display = 'flex';
      
      const data = await fetchArchitectureData();
      processArchitectureData(data);
      renderSidebar();
      
      loadingState.style.display = 'none';
      drawDiagram();
      if(NODES.length > 0) setTimeout(() => highlightNode(NODES[0].id), 400);
    });
  } else {
    // Immediate fallback execution if elements missing
    fetchArchitectureData().then(data => {
      processArchitectureData(data);
      renderSidebar();
      drawDiagram();
      if(NODES.length > 0) setTimeout(() => highlightNode(NODES[0].id), 400);
    });
  }

})();
