const BANK = {
  historia: {
    label: 'Historia', icon: '◫', subtitle: 'Segunda Guerra Mundial',
    questions: [
      { q:'¿Qué hecho se considera el inicio de la Segunda Guerra Mundial en Europa?', a:['Ataque a Pearl Harbor','Invasión de Polonia','Caída de Francia','Batalla de Stalingrado'], correct:1, note:'Alemania invadió Polonia el 1 de septiembre de 1939.' },
      { q:'¿Qué alianza enfrentó principalmente a las Potencias del Eje?', a:['Triple Entente','Pacto de Varsovia','Los Aliados','Liga de Naciones'], correct:2, note:'Los Aliados incluyeron, entre otros, Reino Unido, URSS, Estados Unidos y Francia.' },
      { q:'¿En qué año terminó la Segunda Guerra Mundial?', a:['1943','1944','1945','1946'], correct:2, note:'La guerra terminó en 1945, tras la rendición de Alemania y luego de Japón.' },
      { q:'¿Qué ciudad japonesa recibió la primera bomba atómica usada en guerra?', a:['Tokio','Nagasaki','Kioto','Hiroshima'], correct:3, note:'Hiroshima fue bombardeada el 6 de agosto de 1945.' },
      { q:'¿Qué batalla es asociada con un punto de inflexión en el frente oriental?', a:['Stalingrado','Dunkerque','El Alamein','Midway'], correct:0, note:'Stalingrado frenó el avance alemán y precedió una ofensiva soviética sostenida.' }
    ]
  },
  fisica: {
    label:'Física', icon:'↗', subtitle:'Movimiento y fuerzas',
    questions:[
      {q:'Si un móvil recorre distancias iguales en tiempos iguales, su movimiento es…',a:['MRU','MUA','Circular acelerado','Armónico'],correct:0,note:'En MRU la velocidad permanece constante.'},
      {q:'¿Qué magnitud representa el cambio de velocidad por unidad de tiempo?',a:['Rapidez','Desplazamiento','Aceleración','Fuerza'],correct:2,note:'La aceleración mide cómo cambia la velocidad con el tiempo.'},
      {q:'La unidad SI de fuerza es…',a:['Joule','Newton','Pascal','Watt'],correct:1,note:'El newton (N) es la unidad derivada de fuerza en el SI.'},
      {q:'Si la fuerza neta sobre un cuerpo es cero, entonces…',a:['Siempre está quieto','Su aceleración es cero','Su velocidad es cero','Pierde masa'],correct:1,note:'Por la segunda ley de Newton, fuerza neta cero implica aceleración cero.'},
      {q:'La pendiente de una gráfica posición-tiempo representa…',a:['Aceleración','Velocidad','Fuerza','Energía'],correct:1,note:'La razón de cambio de la posición respecto del tiempo es la velocidad.'}
    ]
  },
  biologia: {
    label:'Biología', icon:'⌬', subtitle:'Genética y célula',
    questions:[
      {q:'¿Qué molécula almacena la información genética hereditaria?',a:['ATP','ADN','Glucosa','Colesterol'],correct:1,note:'El ADN almacena la información genética de los organismos celulares.'},
      {q:'¿En qué orgánulo ocurre principalmente la respiración celular aerobia?',a:['Ribosoma','Lisosoma','Mitocondria','Aparato de Golgi'],correct:2,note:'Las mitocondrias realizan etapas clave de la respiración aerobia.'},
      {q:'Un alelo que se expresa en heterocigosis se denomina…',a:['Recesivo','Dominante','Letal','Ligado'],correct:1,note:'Un alelo dominante se manifiesta fenotípicamente en heterocigosis.'},
      {q:'La mitosis produce normalmente…',a:['Cuatro células haploides','Dos células genéticamente similares','Una célula diploide','Gametas'],correct:1,note:'La mitosis origina dos células hijas con dotación genética equivalente en condiciones normales.'},
      {q:'¿Qué estructura regula el intercambio de sustancias con el medio?',a:['Membrana plasmática','Nucleolo','Centríolo','Cromatina'],correct:0,note:'La membrana plasmática actúa como barrera selectiva.'}
    ]
  },
  matematicas: {
    label:'Matemáticas', icon:'∑', subtitle:'Funciones y álgebra',
    questions:[
      {q:'Si f(x)=2x+3, ¿cuánto vale f(4)?',a:['8','10','11','14'],correct:2,note:'f(4)=2(4)+3=11.'},
      {q:'¿Cuál de estas funciones es lineal afín?',a:['y=x²','y=3x−2','y=1/x','y=√x'],correct:1,note:'y=3x−2 tiene la forma mx+b.'},
      {q:'La pendiente de y=−4x+7 es…',a:['7','−4','4','−7'],correct:1,note:'En y=mx+b, el coeficiente de x es la pendiente m.'},
      {q:'Si 3x+5=20, entonces x es…',a:['3','4','5','6'],correct:2,note:'3x=15, por lo tanto x=5.'},
      {q:'¿Cuál es el dominio de f(x)=1/(x−2)?',a:['Todos los reales','x≠0','x≠2','x>2'],correct:2,note:'El denominador no puede ser cero, por eso x≠2.'}
    ]
  }
};

const state = {
  view:'home', subject:'historia', difficulty:'Intermedio', seconds:8, qIndex:0,
  score:0, streak:0, correct:0, answered:0, startedAt:null, elapsed:[], muted:false, timer:null,
  lock:false
};

const app = document.querySelector('#app');
const navItems = [...document.querySelectorAll('[data-nav]')];

function setNav(view){
  document.querySelectorAll('.nav-item').forEach(b=>b.classList.toggle('is-active',b.dataset.nav===view));
}
function render(){
  clearInterval(state.timer);
  setNav(state.view);
  if(state.view==='home') renderHome();
  if(state.view==='play') renderPlaySetup();
  if(state.view==='teacher') renderTeacher();
  if(state.view==='profile') renderProfile();
  if(state.view==='game') renderGame();
  if(state.view==='results') renderResults();
  window.scrollTo({top:0,behavior:'smooth'});
}

function renderHome(){
  app.innerHTML = `
    <section class="hero">
      <span class="eyebrow">Aprender compitiendo</span>
      <h1>Piensa rápido.<br><em>Dispara mejor.</em></h1>
      <p>Convierte cada pregunta en un penalti. La respuesta no es un botón: es una zona del arco.</p>
      <div class="cta-row"><button class="btn btn-primary" id="quickPlay">Jugar ahora</button><button class="btn btn-secondary" id="classMode">Partida de clase</button></div>
    </section>
    <section class="mini-match" aria-label="Vista previa del juego">
      <div class="mini-copy"><small>Demo interactiva</small><b>Pregunta → decisión → disparo</b></div>
      <div class="mini-goal"></div><div class="mini-ball">⚽</div>
    </section>
    <div class="section-title"><h2>Elige cómo entrar</h2><span>sin registro para el MVP</span></div>
    <div class="mode-grid">
      <button class="mode-card" id="trainMode"><span class="card-icon">⚡</span><strong>Entrenamiento</strong><p>Practica por asignatura y mejora tu racha.</p></button>
      <button class="mode-card" id="teacherMode"><span class="card-icon">▤</span><strong>Sala docente</strong><p>Genera un código y controla una partida.</p></button>
    </div>`;
  document.querySelector('#quickPlay').onclick=()=>go('play');
  document.querySelector('#trainMode').onclick=()=>go('play');
  document.querySelector('#classMode').onclick=()=>showToast('Modo clase listo en la demo docente');
  document.querySelector('#teacherMode').onclick=()=>go('teacher');
}

function renderPlaySetup(){
  const subjects = Object.entries(BANK).map(([key,s])=>`
    <button class="subject-card ${state.subject===key?'selected':''}" data-subject="${key}">
      <span class="card-icon">${s.icon}</span><strong>${s.label}</strong><p>${s.subtitle}</p>
    </button>`).join('');
  app.innerHTML = `
    <section class="page-head"><small>Entrenamiento</small><h1>Arma tu partido</h1><p>Empieza en segundos. Para este MVP usamos 5 penaltis por sesión.</p></section>
    <div class="section-title"><h2>Asignatura</h2><span>4 bancos demo</span></div>
    <div class="subject-grid">${subjects}</div>
    <div class="section-title"><h2>Dificultad</h2><span>ajusta presión</span></div>
    <div class="pill-row" id="difficultyPills">
      ${['Fundamentos','Intermedio','Reto'].map(d=>`<button class="pill ${state.difficulty===d?'active':''}" data-difficulty="${d}">${d}</button>`).join('')}
    </div>
    <div class="section-title"><h2>Tiempo por tiro</h2><span>5–12 s</span></div>
    <div class="pill-row" id="timePills">
      ${[5,8,10,12].map(t=>`<button class="pill ${state.seconds===t?'active':''}" data-seconds="${t}">${t} s</button>`).join('')}
    </div>
    <div class="setup-summary">
      <div class="summary-row"><span>Tema</span><b>${BANK[state.subject].subtitle}</b></div>
      <div class="summary-row"><span>Formato</span><b>5 penaltis · 4 opciones</b></div>
      <div class="summary-row"><span>Puntuación</span><b>Precisión + velocidad + racha</b></div>
      <button class="btn btn-primary" id="startGame">Entrar al estadio</button>
    </div>`;
  document.querySelectorAll('[data-subject]').forEach(b=>b.onclick=()=>{state.subject=b.dataset.subject;renderPlaySetup()});
  document.querySelectorAll('[data-difficulty]').forEach(b=>b.onclick=()=>{state.difficulty=b.dataset.difficulty;renderPlaySetup()});
  document.querySelectorAll('[data-seconds]').forEach(b=>b.onclick=()=>{state.seconds=Number(b.dataset.seconds);renderPlaySetup()});
  document.querySelector('#startGame').onclick=startGame;
}

function startGame(){
  Object.assign(state,{qIndex:0,score:0,streak:0,correct:0,answered:0,elapsed:[],startedAt:Date.now(),lock:false});
  state.view='game';render();
}

function renderGame(){
  const frag = document.querySelector('#goalTemplate').content.cloneNode(true);app.replaceChildren(frag);
  document.querySelector('.bottom-nav').style.transform='translateY(100%)';
  loadQuestion();
}

function loadQuestion(){
  state.lock=false;
  document.querySelector('#pitch').classList.remove('locked');
  const list=BANK[state.subject].questions,q=list[state.qIndex];
  document.querySelector('#hudScore').textContent=state.score;
  document.querySelector('#hudQuestion').textContent=`${state.qIndex+1}/${list.length}`;
  document.querySelector('#hudStreak').textContent=`×${Math.max(1,state.streak)}`;
  document.querySelector('#gameSubject').textContent=BANK[state.subject].label;
  document.querySelector('#gameDifficulty').textContent=state.difficulty;
  document.querySelector('#questionText').textContent=q.q;
  document.querySelectorAll('.answer-zone').forEach((z,i)=>{z.querySelector('span').textContent=q.a[i];z.onclick=()=>answer(i)});
  resetActors();
  runTimer();
}

function runTimer(){
  clearInterval(state.timer);const max=state.seconds*1000;const begin=performance.now();
  state.questionStart=begin;
  const tick=()=>{
    const left=Math.max(0,max-(performance.now()-begin)),ratio=left/max;
    const fill=document.querySelector('#timerFill'); if(!fill)return;
    fill.style.width=`${ratio*100}%`;fill.style.background=ratio<.3?'var(--danger)':ratio<.55?'var(--amber)':'var(--lime)';
    document.querySelector('#timerText').textContent=(left/1000).toFixed(1);
    if(left<=0){clearInterval(state.timer);answer(-1)}
  };tick();state.timer=setInterval(tick,100);
}

function answer(index){
  if(state.lock)return;state.lock=true;clearInterval(state.timer);document.querySelector('#pitch').classList.add('locked');
  const q=BANK[state.subject].questions[state.qIndex];const right=index===q.correct;
  const elapsed=Math.min(state.seconds,(performance.now()-state.questionStart)/1000);state.elapsed.push(elapsed);state.answered++;
  if(right){state.correct++;state.streak++;const speedBonus=Math.max(0,Math.round((state.seconds-elapsed)*12));state.score+=100+speedBonus+(state.streak-1)*20;} else state.streak=0;
  animateShot(index<0?q.correct:index,right,index<0);
  setTimeout(()=>showAnswerFeedback(right,q,index<0),520);
}

function animateShot(index,right,timeout){
  const ball=document.querySelector('#ball'),keeper=document.querySelector('#keeper');
  const targets=[{l:'29%',b:'69%'},{l:'71%',b:'69%'},{l:'29%',b:'49%'},{l:'71%',b:'49%'}];const t=targets[index]||targets[0];
  requestAnimationFrame(()=>{ball.classList.add('shooting');ball.style.left=t.l;ball.style.bottom=t.b;});
  const keeperTarget=right?((index+1)%4):index;const kt=targets[keeperTarget]||targets[0];
  keeper.style.left=kt.l;keeper.style.bottom=kt.b;keeper.style.transform=`translate(-50%,50%) rotate(${keeperTarget%2===0?-24:24}deg) scale(.88)`;
  const f=document.querySelector('#shotFeedback');f.textContent=timeout?'TIEMPO':right?'¡GOOOL!':'ATAJADO';f.className=`shot-feedback ${right?'goal':'save'}`;
  setTimeout(()=>f.classList.add('show'),300);
}

function showAnswerFeedback(right,q,timeout){
  const pitch=document.querySelector('#pitch');
  const card=document.createElement('div');card.className='answer-card';
  card.innerHTML=`<strong>${right?'+ GOL':'Revisa la jugada'}</strong><p>${timeout?'Se agotó el tiempo. ':''}${q.note}</p>`;
  Object.assign(card.style,{position:'absolute',zIndex:'20',left:'14px',right:'14px',bottom:'14px',padding:'13px 15px',borderRadius:'16px',background:'rgba(6,16,26,.94)',border:'1px solid rgba(255,255,255,.15)',boxShadow:'0 14px 34px rgba(0,0,0,.28)',fontSize:'12px',lineHeight:'1.45'});
  card.querySelector('strong').style.color=right?'var(--lime)':'var(--amber)';card.querySelector('p').style.margin='5px 0 0';card.querySelector('p').style.color='var(--muted)';pitch.appendChild(card);
  setTimeout(nextQuestion,1250);
}

function nextQuestion(){
  state.qIndex++;
  if(state.qIndex>=BANK[state.subject].questions.length){state.view='results';document.querySelector('.bottom-nav').style.transform='';render();return;}
  loadQuestion();
}
function resetActors(){
  const ball=document.querySelector('#ball'),keeper=document.querySelector('#keeper'),f=document.querySelector('#shotFeedback');
  if(ball){ball.className='ball';ball.style.left='50%';ball.style.bottom='45px';ball.style.opacity='1'}
  if(keeper){keeper.style.left='50%';keeper.style.bottom='6px';keeper.style.transform=''}
  if(f){f.className='shot-feedback';f.textContent=''}document.querySelector('.answer-card')?.remove();
}

function renderResults(){
  const total=BANK[state.subject].questions.length,acc=Math.round((state.correct/total)*100);const avg=state.elapsed.length?(state.elapsed.reduce((a,b)=>a+b,0)/state.elapsed.length).toFixed(1):'0.0';
  app.innerHTML=`
    <section class="result-hero"><div class="result-orb">${state.correct}/${total}</div><h1>${acc>=80?'Partidazo':acc>=60?'Buen partido':'Hay revancha'}</h1><p>${BANK[state.subject].label} · ${BANK[state.subject].subtitle}</p></section>
    <div class="stats-grid">
      <div class="stat-card highlight"><small>Puntos</small><strong>${state.score}</strong></div>
      <div class="stat-card"><small>Precisión</small><strong>${acc}%</strong></div>
      <div class="stat-card"><small>Tiempo medio</small><strong>${avg}s</strong></div>
      <div class="stat-card"><small>Goles</small><strong>${state.correct}</strong></div>
    </div>
    <div class="setup-summary"><div class="summary-row"><span>Lectura pedagógica</span><b>${acc>=80?'Dominio sólido':acc>=60?'Refuerzo puntual':'Revisar fundamentos'}</b></div><div class="summary-row"><span>Siguiente objetivo</span><b>${Math.min(total,state.correct+1)} goles</b></div><button class="btn btn-primary" id="again">Jugar revancha</button><button class="btn btn-secondary" id="change">Cambiar tema</button></div>`;
  document.querySelector('#again').onclick=startGame;document.querySelector('#change').onclick=()=>go('play');
}

function renderTeacher(){
  app.innerHTML=`
    <section class="page-head"><small>Modo docente</small><h1>Controla la cancha</h1><p>MVP local del lobby. El backend multijugador se conecta después sin cambiar la experiencia.</p></section>
    <div class="teacher-code"><small>Código de partida</small><strong>GOL742</strong><p>Historia · Segunda Guerra Mundial · 8 s</p></div>
    <div class="section-title"><h2>Estudiantes</h2><span>4 conectados · demo</span></div>
    <div class="student-list">
      ${[['AM','Ana M.','Listo'],['JC','Juan C.','Listo'],['SP','Sara P.','Listo'],['DL','David L.','Listo']].map(x=>`<div class="student-row"><span class="avatar">${x[0]}</span><div><b>${x[1]}</b><small>${x[2]}</small></div><span class="status-dot"></span></div>`).join('')}
    </div>
    <div class="setup-summary"><div class="summary-row"><span>Preguntas</span><b>5</b></div><div class="summary-row"><span>Tiempo</span><b>8 segundos</b></div><div class="summary-row"><span>Ranking</span><b>Precisión + velocidad</b></div><button class="btn btn-primary" id="teacherStart">Iniciar demo como estudiante</button></div>`;
  document.querySelector('#teacherStart').onclick=()=>{state.subject='historia';state.seconds=8;startGame()};
}

function renderProfile(){
  app.innerHTML=`<section class="page-head"><small>Progreso</small><h1>Tu temporada</h1><p>Datos demostrativos para visualizar el sistema de progreso del producto.</p></section>
  <div class="progress-ring"><div><strong>72%</strong><small>dominio global</small></div></div>
  <div class="stats-grid"><div class="stat-card highlight"><small>Partidos</small><strong>18</strong></div><div class="stat-card"><small>Mejor racha</small><strong>×7</strong></div><div class="stat-card"><small>Precisión</small><strong>76%</strong></div><div class="stat-card"><small>XP</small><strong>4.2K</strong></div></div>
  <div class="section-title"><h2>Por reforzar</h2><span>prioridad adaptativa</span></div>
  <div class="setup-summary"><div class="summary-row"><span>Física</span><b>Gráficas cinemáticas · 58%</b></div><div class="summary-row"><span>Historia</span><b>Frente oriental · 63%</b></div><div class="summary-row"><span>Biología</span><b>Genética mendeliana · 69%</b></div></div>`;
}

function go(view){document.querySelector('.bottom-nav').style.transform='';state.view=view;render()}
navItems.forEach(b=>b.addEventListener('click',()=>go(b.dataset.nav)));
document.querySelector('#soundToggle').onclick=()=>{state.muted=!state.muted;document.querySelector('#soundToggle').textContent=state.muted?'×':'◖';showToast(state.muted?'Sonido desactivado':'Sonido activado')};
document.addEventListener('keydown',e=>{if(state.view!=='game'||state.lock)return;const map={a:0,b:1,c:2,d:3};const v=map[e.key.toLowerCase()];if(v!==undefined)answer(v)});
function showToast(msg){let t=document.querySelector('.toast');if(!t){t=document.createElement('div');t.className='toast';document.body.appendChild(t)}t.textContent=msg;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),1500)}
if('serviceWorker' in navigator && location.protocol!=='file:') navigator.serviceWorker.register('./sw.js').catch(()=>{});
render();
