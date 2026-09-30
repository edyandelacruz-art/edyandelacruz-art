const keeperMarkup = `
  <defs>
    <linearGradient id="gmProSkin" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#e5ad85"/><stop offset=".55" stop-color="#c27a55"/><stop offset="1" stop-color="#8d4e37"/></linearGradient>
    <linearGradient id="gmProJersey" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#213332"/><stop offset=".45" stop-color="#101d1f"/><stop offset="1" stop-color="#050d10"/></linearGradient>
    <linearGradient id="gmProShorts" x1="0" x2="1"><stop stop-color="#182831"/><stop offset="1" stop-color="#071017"/></linearGradient>
    <linearGradient id="gmProGlove" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#f7fbfd"/><stop offset=".65" stop-color="#d4e2e8"/><stop offset="1" stop-color="#9db4c0"/></linearGradient>
    <filter id="gmProShadow" x="-35%" y="-25%" width="170%" height="165%"><feDropShadow dx="0" dy="9" stdDeviation="7" flood-color="#000" flood-opacity=".45"/></filter>
    <filter id="gmProGlow" x="-80%" y="-80%" width="260%" height="260%"><feGaussianBlur stdDeviation="2.4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  </defs>
  <ellipse cx="110" cy="251" rx="64" ry="10" fill="#02070a" opacity=".52"/>
  <g filter="url(#gmProShadow)">
    <path d="M86 44C86 23 96 11 111 11c16 0 27 13 27 34 0 24-11 39-27 39S86 68 86 44z" fill="url(#gmProSkin)"/>
    <path d="M86 39c2-19 12-30 27-30 14 0 24 9 27 27-8-7-18-10-29-9-10 1-18 5-25 12z" fill="#10191d"/>
    <path d="M95 31c9-12 27-16 41-4-7-13-20-19-33-13-7 3-12 9-14 17z" fill="#263238" opacity=".72"/>
    <ellipse cx="86" cy="50" rx="4.5" ry="8" fill="#b96e4d"/><ellipse cx="139" cy="50" rx="4.5" ry="8" fill="#b96e4d"/>
    <path d="M99 48q5-3 10 0M120 48q5-3 10 0" stroke="#5e392d" stroke-width="2" fill="none" stroke-linecap="round"/>
    <circle cx="105" cy="49" r="2.1" fill="#171a1b"/><circle cx="126" cy="49" r="2.1" fill="#171a1b"/>
    <path d="M115 52l-2 10 6 1" stroke="#945a42" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M104 70q11 6 22 0" stroke="#6d4033" stroke-width="2.2" fill="none" stroke-linecap="round"/>
    <path d="M101 80h23l5 15H97z" fill="#9d5b42"/>
    <path d="M70 101Q110 80 150 101L158 171Q110 187 62 171Z" fill="url(#gmProJersey)" stroke="#263b3d" stroke-width="2.6"/>
    <path d="M70 101Q110 82 150 101" stroke="#b8ff3a" stroke-width="5" fill="none" filter="url(#gmProGlow)"/>
    <path d="M83 108l9 64M137 108l-9 64" stroke="#284743" stroke-width="3" opacity=".65"/>
    <path d="M99 118h22" stroke="#b8ff3a" stroke-width="3.5" stroke-linecap="round"/>
    <text x="110" y="146" text-anchor="middle" font-size="31" font-weight="900" fill="#f4fbfd">1</text>
    <text x="110" y="164" text-anchor="middle" font-size="9" font-weight="900" letter-spacing="1.8" fill="#b8ff3a">GOALMIND</text>
    <path d="M72 105C59 106 50 114 42 124L25 145c-7 9-5 20 4 25 8 4 16 0 22-8l30-40z" fill="url(#gmProJersey)" stroke="#263b3d" stroke-width="2.4"/>
    <path d="M148 105c13 1 22 9 30 19l17 21c7 9 5 20-4 25-8 4-16 0-22-8l-30-40z" fill="url(#gmProJersey)" stroke="#263b3d" stroke-width="2.4"/>
    <path d="M72 111L48 142M148 111l24 31" stroke="#b8ff3a" stroke-width="4" opacity=".9"/>
    <g transform="translate(18 144) rotate(-12)"><path d="M4 0c-10 5-12 17-5 25 6 7 17 7 25-1l11-13L21-5z" fill="url(#gmProGlove)" stroke="#7d9ba8" stroke-width="2"/><path d="M3 7l19 14M9 1l19 14" stroke="#b8ff3a" stroke-width="2.5"/></g>
    <g transform="translate(202 144) scale(-1 1) rotate(-12)"><path d="M4 0c-10 5-12 17-5 25 6 7 17 7 25-1l11-13L21-5z" fill="url(#gmProGlove)" stroke="#7d9ba8" stroke-width="2"/><path d="M3 7l19 14M9 1l19 14" stroke="#b8ff3a" stroke-width="2.5"/></g>
    <path d="M63 169Q110 184 157 169L149 202Q130 208 113 199L110 188 107 199Q90 208 71 202Z" fill="url(#gmProShorts)" stroke="#03090e" stroke-width="2.5"/>
    <path d="M88 199C81 208 73 219 65 231L53 250 74 255 91 237 104 206Z" fill="url(#gmProSkin)" stroke="#7f4732" stroke-width="2"/>
    <path d="M132 199c7 9 15 20 23 32l12 19-21 5-17-18-13-31z" fill="url(#gmProSkin)" stroke="#7f4732" stroke-width="2"/>
    <path d="M57 238l21 5-5 14-23-5zM163 238l-21 5 5 14 23-5z" fill="#111f25"/>
    <path d="M56 240l22 5M164 240l-22 5" stroke="#b8ff3a" stroke-width="4"/>
    <path d="M45 249h31q8 4 1 11H39q-5-7 6-11zM175 249h-31q-8 4-1 11h38q5-7-6-11z" fill="#eef4f6" stroke="#758d98" stroke-width="2"/>
  </g>`;

function enhanceKeeper() {
  const keeper = document.querySelector('#keeper');
  if (!keeper || keeper.dataset.gmPro === '1') return;
  keeper.dataset.gmPro = '1';
  keeper.classList.add('gm-pro-keeper');
  keeper.setAttribute('viewBox', '0 0 220 270');
  keeper.setAttribute('aria-label', 'Arquero GoalMind');
  keeper.innerHTML = keeperMarkup;
}

function removeLegacyGoalCard() {
  document.querySelectorAll('.feedback-card').forEach(card => {
    if (card.textContent?.includes('+ GOL')) card.remove();
  });
}

function createCelebration() {
  const arena = document.querySelector('#arena');
  if (!arena || arena.querySelector('.goal-celebration')) return;
  arena.classList.add('goal-celebrating');
  const overlay = document.createElement('div');
  overlay.className = 'goal-celebration';
  overlay.setAttribute('role', 'status');
  overlay.setAttribute('aria-live', 'assertive');
  overlay.innerHTML = '<div class="goal-celebration-core"><span class="goal-celebration-word">¡GOOOOOL!</span><span class="goal-celebration-sub">Respuesta correcta</span></div>';
  const palette = ['#b7ff36', '#56eaff', '#ffffff', '#ffd15b'];
  for (let i = 0; i < 24; i += 1) {
    const bit = document.createElement('i');
    bit.className = 'goal-confetti';
    const angle = Math.PI * 2 * i / 24;
    const distance = 120 + (i % 5) * 26;
    bit.style.setProperty('--x', `${Math.cos(angle) * distance}px`);
    bit.style.setProperty('--y', `${Math.sin(angle) * distance + 70}px`);
    bit.style.setProperty('--r', `${i * 29}deg`);
    bit.style.setProperty('--d', `${0.75 + (i % 4) * 0.09}s`);
    bit.style.setProperty('--c', palette[i % palette.length]);
    overlay.appendChild(bit);
  }
  arena.appendChild(overlay);
  setTimeout(() => overlay.remove(), 1750);
}

function syncMatchEffects() {
  enhanceKeeper();
  removeLegacyGoalCard();
  const feedback = document.querySelector('#shotFeedback');
  if (!feedback) return;
  const isGoal = feedback.classList.contains('goal') && feedback.classList.contains('show');
  if (isGoal && feedback.dataset.celebrated !== '1') {
    feedback.dataset.celebrated = '1';
    feedback.classList.add('native-goal-hidden');
    document.querySelector('.net')?.classList.add('net-hit');
    createCelebration();
  }
  if (!isGoal) delete feedback.dataset.celebrated;
}

const observer = new MutationObserver(syncMatchEffects);
observer.observe(document.documentElement, { subtree: true, childList: true, attributes: true, attributeFilter: ['class'] });
syncMatchEffects();
