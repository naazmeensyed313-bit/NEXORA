// NEXORA — Login functionality

'use strict';

(function () {
    // ── Particle field ──
    const field = document.getElementById('particleField');
    if (field) {
        const COLORS = ['#0ea5e9', '#00f0ff', '#7c3aed'];
        for (let i = 0; i < 40; i++) {
            const p = document.createElement('div');
            p.className = 'particle';
            const size = Math.random() * 3 + 1;
            const color = COLORS[Math.floor(Math.random() * COLORS.length)];
            Object.assign(p.style, {
                width: size + 'px',
                height: size + 'px',
                left: Math.random() * 100 + '%',
                background: color,
                boxShadow: `0 0 ${size * 2}px ${color}`,
                animationDuration: (Math.random() * 18 + 10) + 's',
                animationDelay: (Math.random() * 15) + 's',
            });
            field.appendChild(p);
        }
    }

    // ── Forms ──
    const phoneForm = document.getElementById('phoneLoginForm');
    const otpForm = document.getElementById('otpForm');
    const phoneInput = document.getElementById('phoneNumber');
    const sendOtpBtn = document.getElementById('sendOtpBtn');
    
    // OTP inputs logic
    const otpBoxes = document.querySelectorAll('.otp-box');
    
    otpBoxes.forEach((box, index) => {
        box.addEventListener('input', (e) => {
            if (e.target.value.length === 1) {
                if (index < otpBoxes.length - 1) {
                    otpBoxes[index + 1].focus();
                }
            }
        });
        
        box.addEventListener('keydown', (e) => {
            if (e.key === 'Backspace' && e.target.value === '') {
                if (index > 0) {
                    otpBoxes[index - 1].focus();
                }
            }
        });
    });

    phoneForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!phoneInput.value.trim()) return;
        
        // Mock sending OTP
        const btnText = sendOtpBtn.innerHTML;
        sendOtpBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
        
        setTimeout(() => {
            phoneForm.classList.add('hidden');
            otpForm.classList.remove('hidden');
            otpBoxes[0].focus();
        }, 800);
    });

    otpForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const btn = document.getElementById('verifyOtpBtn');
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Verifying...';
        
        // Mock successful login
        setTimeout(() => {
            sessionStorage.setItem('nexora_user', 'true');
            window.location.href = 'home.html';
        }, 1200);
    });

    // Google Login
    document.getElementById('googleLoginBtn').addEventListener('click', () => {
        const btn = document.getElementById('googleLoginBtn');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin" style="color: #3c4043;"></i> Connecting...';
        
        // Mock Google OAuth flow
        setTimeout(() => {
            sessionStorage.setItem('nexora_user', 'true');
            window.location.href = 'home.html';
        }, 1500);
    });

})();
