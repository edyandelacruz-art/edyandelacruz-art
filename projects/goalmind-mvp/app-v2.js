import { api } from '@appdeploy/client';

const DEFAULT_QUESTIONS = [
  { q: '¿Cuál es el vértice de y=(x−2)²+3?', a: ['(−2,3)', '(2,3)', '(3,2)', '(2,−3)'], correct: 1, note: 'La forma y=(x−h)²+k tiene vértice (h,k).' },
  { q: 'En y=x²−6x+5, ¿cuál es el eje de simetría?', a: ['x=−3', 'x=3', 'x=6', 'x=5'], correct: 1, note: 'x=−b/(2a)=6/2=3.' },
  { q: '¿Qué indica a<0 en y=ax²+bx+c?', a: ['Abre hacia arriba', 'No tiene vértice', 'Abre hacia abajo', 'Es lineal'], correct: 2, note: 'Un coeficiente cuadrático negativo hace que la parábola abra hacia abajo.' },
  { q: 'Si el discriminante es 0, la ecuación cuadrática tiene…', a: ['Dos raíces reales distintas', 'Una raíz real doble', 'Dos raíces complejas', 'Ninguna raíz'], correct: 1, note: 'Δ=0 produce una solución real repetida.' },
  { q: '¿Cuál es la forma canónica de una función cuadrática?', a: ['y=mx+b', 'y=a(x−h)²+k', 'y=a/x', 'y=ax³+bx'], correct: 1, note: 'La forma canónica hace visible el vértice (h,k).' },
];

function getGuestId() {
  const key = 'goalmind_guest_id';
  const current = localStorage.getItem(key);
  if (current && /^[a-zA-Z0-9-]{12,80}$/.test(current)) return current;
  const fresh = `gm-${crypto.randomUUID()}`;
  localStorage.setItem(key, fresh);
  return fresh;
}

const state = {
  view: 'home',
  questions: DEFAULT_QUESTIONS,
  qIndex: 0,
  playerGoals: 0,
  opponentGoals: 0,
  correct: 0,
  answered: 0,
  streak: 0,
  seconds: 8,
  elapsed: [],
  timer: null,
  questionStart: 0,
  locked: false,
  planId: null,
  plan: null,
  sources: [],
  trace: [],
  guestId: getGuestId(),
};

const app = document.querySelector('#app');
const navButtons = [...document.querySelectorAll('[data-nav]')];

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function setNav(view) {
  navButtons.forEach(button => button.classList.toggle('active', button.dataset.nav === view));
}

function go(view) {
  clearInterval(state.timer);
  state.view = view;
  setNav(view);
  render();
}

navButtons.forEach(button => {
  button.onclick = () => go(button.dataset.nav);
});

function baseSourceCards() {
  return [
    { key: 'GoalMind', icon: 'GM', title: 'GoalMind Library', status: 'Catálogo interno' },
    { key: 'Wikipedia', icon: 'W', title: 'Wikipedia', status: 'API pública' },
    { key: 'OpenAlex', icon: 'OA', title: 'OpenAlex', status: 'API pública' },
    { key: 'Materials', icon: '+', title: 'Mis materiales', status: 'PDF · YouTube · texto' },
  ];
}

function sourceCounts() {
  return state.sources.reduce((acc, source) => {
    const key = source.origin || 'Otro';
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
}

function renderSourceCards() {
  const counts = sourceCounts();
  return baseSourceCards().map(source => {
    const count = counts[source.key] || 0;
    const status = count ? `${count} fuente${count === 1 ? '' : 's'} usada${count === 1 ? '' : 's'}` : source.status;
    const activeClass = count ? 'connected' : '';
    return `
      <div class="source-card">
        <span class="source-icon">${source.icon}</span>
        <div><b>${source.title}</b><small class="${activeClass}">${escapeHtml(status)}</small></div>
      </div>`;
  }).join('');
}

function renderHome() {
  app.innerHTML = `
    <section class="hero-copy">
      <span class="eyebrow">GoalMind Intelligence</span>
      <h1>¿Qué quieres dominar hoy?</h1>
      <p>Escríbelo como se lo dirías a un entrenador. El Coach busca fuentes, adapta el nivel y convierte el tema en partido.</p>
    </section>

    <section class="coach-card">
      <div class="coach-head">
        <div class="coach-orb">AI</div>
        <div><small>GOALMIND COACH</small><b>Entrenador agéntico</b></div>
        <span class="live-pill">● AGENTIC ON</span>
      </div>
      <div class="coach-input">
        <textarea id="coachPrompt" placeholder="Ej. Tengo examen mañana de función cuadrática de 10°. Me cuesta hallar el vértice. Quiero 15 minutos difíciles."></textarea>
        <div class="coach-actions">
          <button id="materialsBtn">＋ Material</button>
          <button id="sourcesBtn">⌘ Fuentes</button>
          <button class="send" id="coachSend">Preparar partido →</button>
        </div>
      </div>
      <div class="quick-prompts">
        <button>ICFES Matemáticas</button>
        <button>Genética mendeliana 10°</button>
        <button>Cinemática difícil</button>
        <button>Función cuadrática 10°</button>
      </div>
      <div class="agent-steps" id="agentSteps"></div>
      <div class="agent-error" id="agentError"></div>
    </section>

    ${renderPlanCard()}

    <section class="source-strip" id="sourceStrip">
      <div class="section-title"><h2>Fuentes conectadas</h2><span>Scout muestra lo que realmente usa</span></div>
      <div class="source-list" id="sourceList">${renderSourceCards()}</div>
    </section>

    <div class="section-title"><h2>Cómo quieres jugar</h2><span>el nivel vive en el rival</span></div>
    <section class="mode-grid">
      <button class="mode-card featured" id="soloMode"><span class="mode-icon">⚡</span><b>Partido adaptativo</b><p>El rival sube o baja según tu rendimiento.</p></button>
      <button class="mode-card" id="duelMode"><span class="mode-icon">⚔️</span><b>Duelo 1v1</b><p>Reta a un amigo en tiempo real o por turnos.</p></button>
      <button class="mode-card" id="cupMode"><span class="mode-icon">🏆</span><b>Campeonato</b><p>Fase de grupos, eliminatorias y final.</p></button>
      <button class="mode-card" id="teamMode"><span class="mode-icon">👥</span><b>Equipos</b><p>Juega por tu curso o crea tu propio club.</p></button>
    </section>`;

  const prompt = document.querySelector('#coachPrompt');
  document.querySelectorAll('.quick-prompts button').forEach(button => {
    button.onclick = () => {
      prompt.value = button.textContent;
      prompt.focus();
    };
  });
  document.querySelector('#coachSend').onclick = () => prepareWithCoach(prompt.value);
  document.querySelector('#soloMode').onclick = () => prepareWithCoach(prompt.value || 'Quiero un partido adaptativo de función cuadrática de grado 10 durante 10 minutos.');
  document.querySelector('#sourcesBtn').onclick = () => document.querySelector('#sourceStrip').scrollIntoView({ behavior: 'smooth', block: 'center' });
  document.querySelector('#materialsBtn').onclick = () => showToast('El flujo PDF · YouTube · texto se mantiene y se integrará al Coach en el siguiente deploy.');
  document.querySelector('#duelMode').onclick = () => showToast('Duelo 1v1: estructura preparada para Realtime.');
  document.querySelector('#cupMode').onclick = () => showToast('Campeonato: fase de grupos y eliminatorias en la siguiente capa.');
  document.querySelector('#teamMode').onclick = () => showToast('Equipos: clubes y ligas entran después del 1v1.');
  document.querySelector('#launchPlan')?.addEventListener('click', startGame);
}

function renderPlanCard() {
  if (!state.plan) return '<section class="plan-card" id="planCard"></section>';
  const opponent = state.plan.opponent || { name: 'GoalMind XI', rating: 70 };
  return `
    <section class="plan-card show" id="planCard">
      <div class="plan-head">
        <div><small>PLAN CREADO POR COACH</small><h3>${escapeHtml(state.plan.title)}</h3></div>
        <div class="opponent"><div><small>RIVAL</small><b>${escapeHtml(opponent.name)}</b></div><span class="opponent-badge">${Math.round(Number(opponent.rating) || 70)}</span></div>
      </div>
      <div class="plan-grid">
        <div class="plan-stat"><small>PREGUNTAS</small><b>${state.questions.length}</b></div>
        <div class="plan-stat"><small>TIEMPO</small><b>${state.seconds} s</b></div>
        <div class="plan-stat"><small>NIVEL</small><b>${escapeHtml(state.plan.level || 'Adaptativo')}</b></div>
      </div>
      <button class="primary" id="launchPlan">Entrar al estadio</button>
    </section>`;
}

function showWorkingSteps() {
  const el = document.querySelector('#agentSteps');
  el.classList.add('show');
  el.innerHTML = [
    'Coach interpreta tu objetivo',
    'Scout consulta repositorios',
    'Coach revisa tu historial',
    'Game Master ajusta rival y dificultad',
    'Referee verifica las preguntas',
  ].map((label, index) => `<div class="agent-step" data-loading-step="${index}"><i>·</i><span>${label}</span></div>`).join('');
}

function renderTrace(trace) {
  const el = document.querySelector('#agentSteps');
  el.classList.add('show');
  el.innerHTML = trace.map(label => `<div class="agent-step done"><i>✓</i><span>${escapeHtml(label)}</span></div>`).join('');
}

async function prepareWithCoach(message) {
  const clean = String(message || '').trim();
  const errorEl = document.querySelector('#agentError');
  const send = document.querySelector('#coachSend');
  errorEl.textContent = '';
  if (clean.length < 12) {
    errorEl.textContent = 'Cuéntame el tema, grado, objetivo o dificultad que buscas.';
    return;
  }
  showWorkingSteps();
  send.disabled = true;
  send.textContent = 'Coach trabajando…';
  try {
    const response = await api.post('/api/coach/plan', { guestId: state.guestId, message: clean, count: 5 });
    const data = response.data || {};
    if (!data.plan || !Array.isArray(data.plan.questions) || data.plan.questions.length < 3) throw new Error('El Coach no devolvió un partido válido.');
    state.planId = data.planId || null;
    state.plan = data.plan;
    state.questions = data.plan.questions;
    state.seconds = Math.max(5, Math.min(20, Number(data.plan.secondsPerQuestion) || 8));
    state.sources = Array.isArray(data.sources) ? data.sources : [];
    state.trace = Array.isArray(data.trace) ? data.trace : [];
    renderHome();
    renderTrace(state.trace);
    const planCard = document.querySelector('#planCard');
    setTimeout(() => planCard?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 80);
  } catch (err) {
    console.error('GoalMind Coach request failed', err);
    errorEl.textContent = 'No pude preparar ese partido. Prueba especificando mejor tema y grado.';
  } finally {
    if (send?.isConnected) {
      send.disabled = false;
      send.textContent = 'Preparar partido →';
    }
  }
}

function startGame() {
  Object.assign(state, {
    qIndex: 0,
    playerGoals: 0,
    opponentGoals: 0,
    correct: 0,
    answered: 0,
    streak: 0,
    elapsed: [],
    locked: false,
  });
  go('game');
}

function renderGame() {
  app.replaceChildren(document.querySelector('#gameTemplate').content.cloneNode(true));
  const opponent = state.plan?.opponent || { name: 'Algebra City', rating: 74 };
  document.querySelector('#opponentName').textContent = opponent.name;
  document.querySelector('#matchMode').textContent = `RANKED · OVR ${Math.round(Number(opponent.rating) || 74)}`;
  document.querySelector('#gameTopic').textContent = state.plan?.title || 'Entrenamiento GoalMind';
  loadQuestion();
}

function loadQuestion() {
  state.locked = false;
  const arena = document.querySelector('#arena');
  arena.classList.remove('locked');
  document.querySelector('.feedback-card')?.remove();
  const question = state.questions[state.qIndex];
  document.querySelector('#hudScore').textContent = state.playerGoals;
  document.querySelector('#opponentScore').textContent = state.opponentGoals;
  document.querySelector('#hudQuestion').textContent = `${state.qIndex + 1}/${state.questions.length}`;
  document.querySelector('#hudStreak').textContent = `×${Math.max(1, state.streak)}`;
  document.querySelector('#questionText').textContent = question.q;
  document.querySelectorAll('.answer-zone').forEach((zone, index) => {
    zone.querySelector('span').textContent = question.a[index] || '';
    zone.onclick = () => answer(index);
  });
  resetActors();
  runTimer();
}

function runTimer() {
  clearInterval(state.timer);
  const max = state.seconds * 1000;
  const begin = performance.now();
  state.questionStart = begin;
  state.timer = setInterval(() => {
    const left = Math.max(0, max - (performance.now() - begin));
    const ratio = left / max;
    const fill = document.querySelector('#timerFill');
    if (!fill) return;
    fill.style.width = `${ratio * 100}%`;
    fill.style.background = ratio < 0.3 ? 'var(--gm-danger)' : ratio < 0.55 ? 'var(--gm-amber)' : 'var(--gm-lime)';
    document.querySelector('#timerText').textContent = (left / 1000).toFixed(1);
    if (left <= 0) {
      clearInterval(state.timer);
      answer(-1);
    }
  }, 100);
}

function answer(index) {
  if (state.locked) return;
  state.locked = true;
  clearInterval(state.timer);
  document.querySelector('#arena').classList.add('locked');
  const question = state.questions[state.qIndex];
  const correct = index === Number(question.correct);
  const elapsed = Math.min(state.seconds, (performance.now() - state.questionStart) / 1000);
  state.elapsed.push(elapsed);
  state.answered += 1;
  if (correct) {
    state.playerGoals += 1;
    state.correct += 1;
    state.streak += 1;
  } else {
    state.opponentGoals += 1;
    state.streak = 0;
  }
  animateShot(index < 0 ? Number(question.correct) : index, correct, index < 0);
  setTimeout(() => showFeedback(correct, question, index < 0), 520);
}

function animateShot(index, correct, timeout) {
  const ball = document.querySelector('#ball');
  const keeper = document.querySelector('#keeper');
  const targets = [
    { left: '27%', bottom: '61%' },
    { left: '73%', bottom: '61%' },
    { left: '27%', bottom: '39%' },
    { left: '73%', bottom: '39%' },
  ];
  const target = targets[index] || targets[0];
  ball.classList.add('shooting');
  ball.style.left = target.left;
  ball.style.bottom = target.bottom;
  const keeperIndex = correct ? (index + 1) % 4 : index;
  const keeperTarget = targets[keeperIndex] || targets[0];
  keeper.style.left = keeperTarget.left;
  keeper.style.bottom = keeperIndex < 2 ? '19%' : '4%';
  keeper.style.transform = `rotate(${keeperIndex % 2 === 0 ? -47 : 47}deg) scale(.94)`;
  const feedback = document.querySelector('#shotFeedback');
  feedback.textContent = timeout ? 'TIEMPO' : correct ? 'GOOOL' : 'ATAJADO';
  feedback.className = `shot-feedback ${correct ? 'goal' : 'save'} show`;
}

function showFeedback(correct, question, timeout) {
  const card = document.createElement('div');
  card.className = 'feedback-card';
  card.innerHTML = `<b>${correct ? '+ GOL' : 'Revisa la jugada'}</b><p>${timeout ? 'Se agotó el tiempo. ' : ''}${escapeHtml(question.note)}</p>`;
  document.querySelector('#arena').appendChild(card);
  setTimeout(nextQuestion, 1250);
}

function nextQuestion() {
  state.qIndex += 1;
  if (state.qIndex >= state.questions.length) {
    finishMatch();
    return;
  }
  loadQuestion();
}

function resetActors() {
  const ball = document.querySelector('#ball');
  const keeper = document.querySelector('#keeper');
  const feedback = document.querySelector('#shotFeedback');
  if (ball) {
    ball.className = 'ball';
    ball.style.left = '50%';
    ball.style.bottom = '15px';
  }
  if (keeper) {
    keeper.style.left = '50%';
    keeper.style.bottom = '-15px';
    keeper.style.transform = '';
  }
  if (feedback) {
    feedback.className = 'shot-feedback';
    feedback.textContent = '';
  }
}

async function finishMatch() {
  clearInterval(state.timer);
  const avgSeconds = state.elapsed.length ? state.elapsed.reduce((sum, value) => sum + value, 0) / state.elapsed.length : 0;
  const accuracy = state.questions.length ? state.correct / state.questions.length : 0;
  state.summary = { avgSeconds, accuracy };
  try {
    await api.post('/api/coach/result', {
      guestId: state.guestId,
      planId: state.planId,
      subject: state.plan?.subject || 'Personalizado',
      topic: state.plan?.title || 'Partido GoalMind',
      accuracy,
      score: state.playerGoals,
      avgSeconds,
      correct: state.correct,
      total: state.questions.length,
    });
  } catch (err) {
    console.warn('GoalMind could not persist result', err);
  }
  go('results');
}

function renderResults() {
  const total = state.questions.length;
  const accuracy = Math.round((state.summary?.accuracy || 0) * 100);
  const avg = (state.summary?.avgSeconds || 0).toFixed(1);
  app.innerHTML = `
    <section class="result-shell">
      <span class="eyebrow">PARTIDO TERMINADO</span>
      <h1>${state.playerGoals > state.opponentGoals ? 'Victoria' : state.playerGoals === state.opponentGoals ? 'Empate' : 'Hay revancha'}</h1>
      <p>${escapeHtml(state.plan?.title || 'Entrenamiento GoalMind')}</p>
      <div class="result-score"><strong>${state.playerGoals} — ${state.opponentGoals}</strong><div>${escapeHtml(state.plan?.opponent?.name || 'Rival GoalMind')}</div></div>
      <div class="result-grid">
        <div><small>PRECISIÓN</small><b>${accuracy}%</b></div>
        <div><small>TIEMPO MEDIO</small><b>${avg}s</b></div>
        <div><small>ACIERTOS</small><b>${state.correct}/${total}</b></div>
        <div><small>FUENTES</small><b>${state.sources.length}</b></div>
      </div>
      <div class="result-actions"><button class="primary" id="rematch">Revancha</button><button id="newPlan">Nuevo plan con Coach</button></div>
    </section>`;
  document.querySelector('#rematch').onclick = startGame;
  document.querySelector('#newPlan').onclick = () => go('home');
}

function renderSimple(title, copy) {
  app.innerHTML = `<section class="hero-copy"><span class="eyebrow">GoalMind</span><h1>${title}</h1><p>${copy}</p></section>`;
}

function render() {
  clearInterval(state.timer);
  if (state.view === 'home' || state.view === 'play') renderHome();
  else if (state.view === 'game') renderGame();
  else if (state.view === 'results') renderResults();
  else if (state.view === 'compete') renderSimple('Competir', 'Duelo 1v1, campeonatos y equipos se conectarán a Realtime sin convertir el juego en un LMS.');
  else renderSimple('Tu progreso', 'El Coach utilizará tu historial por tema para ajustar rival, dificultad y siguientes preguntas.');
  window.scrollTo({ top: 0, behavior: 'instant' });
}

function showToast(message) {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 1800);
}

document.addEventListener('keydown', event => {
  if (state.view !== 'game' || state.locked) return;
  const index = { a: 0, b: 1, c: 2, d: 3 }[event.key.toLowerCase()];
  if (index !== undefined) answer(index);
});

render();
