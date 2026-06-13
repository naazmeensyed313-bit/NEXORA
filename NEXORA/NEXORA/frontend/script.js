(function () {
    'use strict';

    const viewLinks = document.querySelectorAll('[data-view-link]');
    const views = document.querySelectorAll('[data-view]');
    const menuItems = document.querySelectorAll('.menu li[data-view-link]');
    const globalIdeaInput = document.getElementById('globalIdeaInput');
    const statusRibbon = document.getElementById('statusRibbon');

    let impactChart = null;
    let architectureInitialized = false;
    const innerModules = ['architecture', 'innovation', 'impact'];
    const GAUGE_CIRCUMFERENCE = 515;

    const starterIdea = localStorage.getItem('nexoraIdea') || '';

    initTiltCards();
    initArchitectureModuleButtons();
    initImpactSliders();
    bindViewLinks();

    if (globalIdeaInput) {
        globalIdeaInput.value = starterIdea;
        globalIdeaInput.addEventListener('input', () => {
            localStorage.setItem('nexoraIdea', globalIdeaInput.value.trim());
        });
    }

    document.getElementById('runSimulationBtn')?.addEventListener('click', simulateImpact);
    document.getElementById('viewInsightsBtn')?.addEventListener('click', () => {
        alert('Detailed competitive insights would open in NEXORA PRO.');
    });

    function bindViewLinks() {
        viewLinks.forEach((link) => {
            link.addEventListener('click', (event) => {
                event.preventDefault();
                const viewName = link.dataset.viewLink;
                if (!viewName) return;

                if (viewName === 'idea') {
                    window.location.href = 'idea_analyzer/analyzer.html';
                    return;
                }

                showView(viewName);
            });
        });
    }

    function showView(viewName) {
        document.body.className = `theme-${viewName}`;

        views.forEach((view) => {
            view.classList.toggle('active', view.dataset.view === viewName);
        });

        menuItems.forEach((item) => {
            item.classList.toggle('active', item.dataset.viewLink === viewName);
        });

        const isInner = innerModules.includes(viewName);
        statusRibbon?.classList.toggle('visible', isInner);
        statusRibbon?.setAttribute('aria-hidden', isInner ? 'false' : 'true');

        if (viewName === 'architecture') {
            requestAnimationFrame(() => initArchitecture3D());
        } else if (architectureInitialized) {
            window.NexoraArchitecture3D?.destroy();
            architectureInitialized = false;
        }

        if (isInner) runModuleAnalysis(viewName);
    }

    function initTiltCards() {
        document.querySelectorAll('[data-tilt]').forEach((card) => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const cx = rect.width / 2;
                const cy = rect.height / 2;
                const rotateX = ((y - cy) / cy) * -8;
                const rotateY = ((x - cx) / cx) * 8;
                card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
                card.style.boxShadow = `${-rotateY * 2}px ${rotateX * 2}px 30px rgba(0, 242, 254, 0.12)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
                card.style.boxShadow = '';
            });
        });
    }

    function initArchitectureModuleButtons() {
        document.querySelectorAll('.system-module-btn').forEach((btn) => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.system-module-btn').forEach((b) => b.classList.remove('active'));
                btn.classList.add('active');
                window.NexoraArchitecture3D?.highlightNode(btn.dataset.node);
            });
        });
    }

    function initArchitecture3D() {
        const canvas = document.getElementById('architectureCanvas3D');
        if (!canvas || typeof window.NexoraArchitecture3D === 'undefined') return;

        window.NexoraArchitecture3D.init(canvas);
        architectureInitialized = true;
    }

    function initImpactSliders() {
        const timePeriod = document.getElementById('timePeriod');
        const initialUsers = document.getElementById('initialUsers');
        const investment = document.getElementById('investment');
        const marketing = document.getElementById('marketing');

        timePeriod?.addEventListener('input', () => {
            document.getElementById('timePeriodVal').textContent = `${timePeriod.value} Years`;
            document.querySelectorAll('.step-dot').forEach((dot, i) => {
                dot.classList.toggle('active', i < Number(timePeriod.value));
            });
        });

        initialUsers?.addEventListener('input', () => {
            document.getElementById('initialUsersVal').textContent = Number(initialUsers.value).toLocaleString();
        });

        investment?.addEventListener('input', () => {
            const val = Number(investment.value);
            document.getElementById('investmentVal').textContent = val >= 1000000
                ? `$${(val / 1000000).toFixed(1)}M`
                : `$${Math.round(val / 1000)}K`;
        });

        marketing?.addEventListener('input', () => {
            document.getElementById('marketingVal').textContent = `${marketing.value}%`;
        });
    }

    function getIdea() {
        return globalIdeaInput?.value.trim()
            || localStorage.getItem('nexoraIdea')
            || 'AI powered smart waste management platform with IoT sensors and predictive analytics';
    }

    function getKeywords(idea) {
        return idea.toLowerCase().split(/[^a-z0-9]+/).filter((word) => word.length > 2);
    }

    function countMatches(words, options) {
        return options.reduce((count, option) => count + (words.includes(option) ? 1 : 0), 0);
    }

    function clamp(value, min, max) {
        return Math.max(min, Math.min(max, value));
    }

    function runModuleAnalysis(viewName) {
        if (viewName === 'innovation') detectInnovation();
        if (viewName === 'impact') simulateImpact();
    }

    function detectInnovation() {
        const idea = getIdea();
        const keywords = getKeywords(idea);

        const competitors = [
            { name: 'Waste Bot', icon: 'fa-robot', desc: 'Automated waste sorting robot for commercial facilities.', tags: ['waste', 'automation', 'robot', 'smart'], similarity: 45 },
            { name: 'SmartBin', icon: 'fa-trash-can', desc: 'IoT-enabled smart bins with fill-level monitoring.', tags: ['iot', 'sensor', 'waste', 'smart'], similarity: 35 },
            { name: 'Recycle Track', icon: 'fa-recycle', desc: 'Recycling analytics dashboard for municipalities.', tags: ['recycle', 'analytics', 'track', 'waste'], similarity: 28 },
            { name: 'EcoSense', icon: 'fa-leaf', desc: 'Environmental impact tracking for enterprises.', tags: ['environment', 'carbon', 'analytics', 'track'], similarity: 22 }
        ];

        const scored = competitors.map((c) => {
            const matches = c.tags.filter((t) => keywords.includes(t)).length;
            return { ...c, similarity: clamp(c.similarity - matches * 4 + (keywords.length > 5 ? 3 : 0), 12, 55) };
        }).sort((a, b) => b.similarity - a.similarity);

        const avgSimilarity = scored.reduce((s, c) => s + c.similarity, 0) / scored.length;
        const score = clamp(10 - avgSimilarity / 12 + keywords.length * 0.08, 5.5, 9.6);
        const scoreRounded = Math.round(score * 10) / 10;

        const scoreEl = document.getElementById('innovationScoreValue');
        if (scoreEl) scoreEl.textContent = scoreRounded.toFixed(1);

        const arc = document.getElementById('innovationGaugeArc');
        if (arc) {
            const offset = GAUGE_CIRCUMFERENCE - (scoreRounded / 10) * GAUGE_CIRCUMFERENCE;
            arc.style.strokeDashoffset = offset;
            arc.setAttribute('stroke', 'url(#gaugeGrad)');
        }

        const statusTag = document.getElementById('innovationStatusTag');
        if (statusTag) {
            if (scoreRounded >= 8) {
                statusTag.textContent = 'Highly Innovative';
                statusTag.className = 'status-tag highly-innovative';
            } else if (scoreRounded >= 6.5) {
                statusTag.textContent = 'Moderately Innovative';
                statusTag.className = 'status-tag';
                statusTag.style.cssText = 'background:rgba(45,156,219,0.15);color:#2D9CDB;border:1px solid rgba(45,156,219,0.35)';
            } else {
                statusTag.textContent = 'Needs Differentiation';
                statusTag.className = 'status-tag';
                statusTag.style.cssText = 'background:rgba(243,156,18,0.15);color:#F39C12;border:1px solid rgba(243,156,18,0.35)';
            }
        }

        const satPct = clamp(avgSimilarity * 1.4, 15, 85);
        const satLabel = satPct < 35 ? 'Low' : satPct < 65 ? 'Medium' : 'High';
        document.getElementById('saturationLevelLabel').textContent = satLabel;
        document.getElementById('saturationFill').style.width = `${satPct}%`;
        document.getElementById('saturationThumb').style.left = `${satPct}%`;

        const factors = [
            'Novel AI-driven approach to problem solving',
            'Unique integration of IoT and predictive analytics',
            'Strong differentiation from legacy competitors',
            'Scalable architecture with modular design'
        ];

        document.getElementById('uniquenessFactors').innerHTML = factors
            .map((f) => `<li><i class="fa-solid fa-circle-check"></i>${f}</li>`)
            .join('');

        document.getElementById('competitorList').innerHTML = scored.slice(0, 3).map((c) => `
            <div class="competitor-item">
                <div class="comp-icon"><i class="fa-solid ${c.icon}"></i></div>
                <div class="comp-body">
                    <strong>${c.name}</strong>
                    <p>${c.desc}</p>
                </div>
                <span class="similarity-pct">${c.similarity}%</span>
            </div>
        `).join('');
    }

    function simulateImpact() {
        const years = Number(document.getElementById('timePeriod')?.value || 5);
        const users = Number(document.getElementById('initialUsers')?.value || 25000);
        const invest = Number(document.getElementById('investment')?.value || 500000);
        const marketing = Number(document.getElementById('marketing')?.value || 65);

        const growthMult = 1 + (marketing / 100) * 0.8 + (invest / 2000000) * 0.5;
        const usersReached = users * Math.pow(growthMult, years) * (1 + years * 0.3);
        const revenue = (usersReached * 4.5 * (invest / 500000)) / 1000;
        const waste = usersReached * 0.0085;
        const co2 = waste * 0.656;

        document.getElementById('usersReached').textContent = formatUsers(usersReached);
        document.getElementById('revenuePotential').textContent = formatMoney(revenue);
        document.getElementById('wasteReduced').textContent = `${Math.round(waste).toLocaleString()} Tons`;
        document.getElementById('co2Reduced').textContent = `${Math.round(co2).toLocaleString()} Tons`;

        renderGrowthChart(years, growthMult);
    }

    function formatUsers(n) {
        if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M+`;
        if (n >= 1000) return `${Math.round(n / 1000)}K+`;
        return Math.round(n).toLocaleString();
    }

    function formatMoney(n) {
        if (n >= 1000000) return `$${(n / 1000000).toFixed(1)}M`;
        return `$${Math.round(n / 1000)}K`;
    }

    function renderGrowthChart(years, growthMult) {
        const canvas = document.getElementById('growthChart');
        if (!canvas || typeof Chart === 'undefined') return;

        const ctx = canvas.getContext('2d');
        if (impactChart) impactChart.destroy();

        const labels = [];
        const data = [];
        for (let i = 1; i <= years; i++) {
            labels.push(`Year ${i}`);
            data.push(Math.round(20 + i * 15 * growthMult + Math.pow(i, 1.6) * 8));
        }

        const gradient = ctx.createLinearGradient(0, 0, 0, 300);
        gradient.addColorStop(0, 'rgba(155, 81, 224, 0.35)');
        gradient.addColorStop(1, 'rgba(155, 81, 224, 0)');

        impactChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels,
                datasets: [{
                    label: 'Growth Index',
                    data,
                    borderColor: '#9B51E0',
                    backgroundColor: gradient,
                    fill: true,
                    tension: 0.45,
                    borderWidth: 3,
                    pointRadius: 5,
                    pointBackgroundColor: '#9B51E0',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointHoverRadius: 7
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        labels: { color: '#94a3b8', font: { family: 'Poppins', size: 11 } }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(11, 15, 25, 0.95)',
                        borderColor: '#9B51E0',
                        borderWidth: 1,
                        titleFont: { family: 'Orbitron' }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: { color: 'rgba(255, 255, 255, 0.04)' },
                        ticks: { color: '#64748b', font: { family: 'Poppins' } }
                    },
                    x: {
                        grid: { display: false },
                        ticks: { color: '#64748b', font: { family: 'Poppins' } }
                    }
                }
            }
        });
    }

    showView('dashboard');
})();
