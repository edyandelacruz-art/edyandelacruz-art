'use client';

import { useMemo, useState } from 'react';
import TrainingArena from './TrainingArena';
import Onboarding from './Onboarding';
import NeoHome from './NeoHome';
import type {
  GameName,
  LearningContent,
  SessionSummary,
  TrainingCondition,
} from '@/types/training';
import { compareWithBaseline, loadSessions, saveSession } from '@/lib/trainingStore';
import { buildContentPackage } from '@/lib/contentEngine';
import { avatarFor, loadProfile, saveProfile, type LearnerProfile } from '@/lib/profileStore';

type View = 'home' | 'setup' | 'train' | 'results' | 'progress' | 'explore' | 'profile';

type SkillDefinition = {
  name: string;
  label: string;
  description: string;
};

const SKILLS: SkillDefinition[] = [
  { name: 'Selective attention', label: 'Atención selectiva', description: 'Mantener la señal relevante e ignorar distractores.' },
  { name: 'Divided attention', label: 'Atención dividida', description: 'Sostener dos tareas relevantes a la vez.' },
  { name: 'Working memory', label: 'Memoria de trabajo', description: 'Retener información mientras haces otra acción.' },
  { name: 'Inhibitory control', label: 'Control inhibitorio', description: 'Frenar respuestas impulsivas y filtrar interferencia.' },
  { name: 'Switching', label: 'Cambio atencional', description: 'Mover el foco entre tareas o canales.' },
  { name: 'Sustained attention', label: 'Atención sostenida', description: 'Mantener calidad de respuesta durante el tiempo.' },
  { name: 'Processing speed', label: 'Velocidad de procesamiento', description: 'Responder rápido sin perder precisión.' },
  { name: 'Recall', label: 'Recuperación', description: 'Recordar información después de una demora.' },
];

const GAMES: Array<{ name: GameName; label: string; description: string }> = [
  { name: 'Runner', label: 'Runner', description: 'Atención auditiva + reacción.' },
  { name: 'Tetris', label: 'Tetris', description: 'Planificación espacial + memoria de trabajo.' },
  { name: 'Road Dodge', label: 'Road Dodge', description: 'Seguimiento + control inhibitorio.' },
  { name: 'Pong', label: 'Pong', description: 'Tracking visual + predicción.' },
  { name: 'Snake', label: 'Snake', description: 'Planificación + recuperación.' },
  { name: 'Memory Grid', label: 'Memory Grid', description: 'Memoria visual y secuencias.' },
];

const DEFAULT_SOURCE_TEXT = `Una célula eucariota funciona como un sistema coordinado. La membrana celular delimita la célula y regula el intercambio de sustancias con el entorno. Dentro de la célula, las mitocondrias transforman energía química y participan en la producción de ATP. El núcleo contiene la mayor parte del ADN y coordina muchas actividades mediante la expresión genética. Los ribosomas realizan la síntesis de proteínas. El retículo endoplasmático rugoso participa en la síntesis y transporte de proteínas, mientras que el retículo endoplasmático liso interviene en la síntesis de lípidos. El aparato de Golgi modifica, clasifica y empaqueta proteínas y otras moléculas para dirigirlas a diferentes destinos. Los lisosomas contienen enzimas que degradan materiales y ayudan al reciclaje celular. El citoesqueleto proporciona organización interna, forma y soporte para movimientos celulares. Ningún organelo trabaja de manera completamente aislada porque la célula mantiene su homeostasis coordinando estructuras, materiales e información.`;

function average(values: number[]) {
  return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;
}

function percent(value: number) {
  return `${Math.round(value * 100)}%`;
}

function latency(value: number) {
  return value ? `${(value / 1000).toFixed(1)} s` : '—';
}

function SecondaryNav({ view, onChange }: { view: View; onChange: (view: View) => void }) {
  const items: Array<[View, string]> = [
    ['home', 'Inicio'],
    ['setup', 'Entrenar'],
    ['explore', 'Juegos'],
    ['progress', 'Progreso'],
    ['profile', 'Perfil'],
  ];
  return (
    <nav className="secondary-nav neo-glass">
      {items.map(([id, label]) => (
        <button key={id} className={view === id ? 'active' : ''} onClick={() => onChange(id)}>{label}</button>
      ))}
    </nav>
  );
}

function SetupView({
  initialGame,
  onLaunch,
}: {
  initialGame: GameName;
  onLaunch: (params: { game: GameName; skill: string; condition: TrainingCondition; content: LearningContent }) => void;
}) {
  const [game, setGame] = useState<GameName>(initialGame);
  const [skill, setSkill] = useState(SKILLS[0].name);
  const [condition, setCondition] = useState<TrainingCondition>('dual_task');
  const [title, setTitle] = useState('Biología celular');
  const [sourceRef, setSourceRef] = useState('');
  const [text, setText] = useState(DEFAULT_SOURCE_TEXT);
  const [prepared, setPrepared] = useState<LearningContent | null>(() => buildContentPackage({ title: 'Biología celular', text: DEFAULT_SOURCE_TEXT }));
  const [error, setError] = useState('');

  const prepare = () => {
    try {
      const content = buildContentPackage({ title, text, sourceRef });
      setPrepared(content);
      setError('');
      return content;
    } catch (nextError) {
      setPrepared(null);
      setError(nextError instanceof Error ? nextError.message : 'No se pudo preparar el contenido.');
      return null;
    }
  };

  const start = () => {
    const content = prepared ?? prepare();
    if (!content) return;
    onLaunch({ game, skill, condition, content });
  };

  return (
    <div className="simple-view">
      <header className="simple-heading">
        <span>ENTRENAR</span>
        <h1>Crea tu sesión.</h1>
        <p>Contenido → habilidad → condición → juego.</p>
      </header>

      <section className="simple-card neo-glass">
        <div className="step-chip">1</div>
        <h2>Contenido</h2>
        <input value={title} onChange={event => setTitle(event.target.value)} placeholder="Título" />
        <input value={sourceRef} onChange={event => setSourceRef(event.target.value)} placeholder="URL opcional" />
        <textarea value={text} onChange={event => setText(event.target.value)} rows={6} />
        <button className="small-action" onClick={prepare}>Preparar contenido</button>
        {prepared && <p className="success-line">✓ {prepared.questions.length} preguntas listas</p>}
        {error && <p className="error-line">{error}</p>}
      </section>

      <section className="simple-card neo-glass">
        <div className="step-chip">2</div>
        <h2>Habilidad</h2>
        <div className="selection-grid skills-grid">
          {SKILLS.map(item => (
            <button key={item.name} className={skill === item.name ? 'selected' : ''} onClick={() => setSkill(item.name)}>
              <strong>{item.label}</strong><small>{item.description}</small>
            </button>
          ))}
        </div>
      </section>

      <section className="simple-card neo-glass">
        <div className="step-chip">3</div>
        <h2>Condición</h2>
        <div className="selection-grid two-col">
          <button className={condition === 'dual_task' ? 'selected' : ''} onClick={() => setCondition('dual_task')}><strong>Con juego</strong><small>Entrenamiento con carga secundaria.</small></button>
          <button className={condition === 'baseline' ? 'selected' : ''} onClick={() => setCondition('baseline')}><strong>Baseline</strong><small>Sin juego para crear referencia limpia.</small></button>
        </div>
      </section>

      {condition === 'dual_task' && (
        <section className="simple-card neo-glass">
          <div className="step-chip">4</div>
          <h2>Juego</h2>
          <div className="selection-grid games-grid">
            {GAMES.map(item => (
              <button key={item.name} className={game === item.name ? 'selected' : ''} onClick={() => setGame(item.name)}><strong>{item.label}</strong><small>{item.description}</small></button>
            ))}
          </div>
        </section>
      )}

      <button className="neo-primary launch-session" onClick={start}>Iniciar sesión <span>→</span></button>
    </div>
  );
}

function ResultsView({ summary, sessions, onProgress }: { summary?: SessionSummary; sessions: SessionSummary[]; onProgress: () => void }) {
  if (!summary) {
    return <div className="simple-view"><header className="simple-heading"><span>RESULTADOS</span><h1>Aún no hay sesiones.</h1><p>Completa una sesión para ver datos reales.</p></header></div>;
  }

  const comparison = compareWithBaseline(summary, sessions);
  return (
    <div className="simple-view">
      <header className="simple-heading"><span>RESULTADOS</span><h1>{summary.game} · {summary.skill}</h1><p>{summary.contentTitle}</p></header>
      <section className="result-grid">
        <article className="result-tile neo-glass"><strong>{percent(summary.learningAccuracy)}</strong><span>Precisión</span></article>
        <article className="result-tile neo-glass"><strong>{latency(summary.averageLatencyMs)}</strong><span>Respuesta media</span></article>
        <article className="result-tile neo-glass"><strong>{summary.condition === 'baseline' ? 'BASE' : summary.gameScore}</strong><span>{summary.condition === 'baseline' ? 'Condición' : 'Juego'}</span></article>
        <article className="result-tile neo-glass"><strong>{summary.condition === 'baseline' ? '—' : summary.collisions}</strong><span>Errores</span></article>
      </section>
      <section className="simple-card neo-glass">
        <h2>Interferencia</h2>
        {summary.condition === 'baseline' ? (
          <p>Esta sesión queda guardada como referencia para una futura sesión dual con el mismo contenido y habilidad.</p>
        ) : comparison ? (
          <div className="comparison-row"><div><strong>{comparison.accuracyCostPoints.toFixed(1)} pts</strong><span>Costo de precisión</span></div><div><strong>{comparison.latencyCostPercent === null ? '—' : `${comparison.latencyCostPercent.toFixed(0)}%`}</strong><span>Costo de latencia</span></div></div>
        ) : (
          <p>No existe todavía una baseline comparable. FocusLab no estima un costo sin referencia válida.</p>
        )}
      </section>
      <button className="neo-primary launch-session" onClick={onProgress}>Ver progreso <span>→</span></button>
    </div>
  );
}

function ProgressView({ sessions }: { sessions: SessionSummary[] }) {
  const skillRows = SKILLS.map(skill => {
    const matches = sessions.filter(session => session.skill === skill.name && session.responseCount > 0);
    return { ...skill, sessions: matches.length, accuracy: matches.length ? average(matches.map(session => session.learningAccuracy)) : null };
  });

  return (
    <div className="simple-view">
      <header className="simple-heading"><span>PROGRESO</span><h1>{sessions.length ? `${sessions.length} sesiones` : 'Sin datos todavía'}</h1><p>Solo se muestran medidas observadas.</p></header>
      <section className="simple-card neo-glass">
        <h2>Habilidades entrenadas</h2>
        <div className="real-skill-list">
          {skillRows.map(row => (
            <div className="real-skill-row" key={row.name}><span>{row.label}</span><div className="real-bar"><i style={{ width: `${row.accuracy === null ? 0 : Math.round(row.accuracy * 100)}%` }} /></div><b>{row.accuracy === null ? '—' : percent(row.accuracy)}</b></div>
          ))}
        </div>
      </section>
    </div>
  );
}

function ExploreView({ onTrain }: { onTrain: (game: GameName) => void }) {
  return (
    <div className="simple-view">
      <header className="simple-heading"><span>JUEGOS</span><h1>Seis entornos, una misma medición.</h1><p>El juego aporta carga; la habilidad define el objetivo.</p></header>
      <section className="game-library">
        {GAMES.map(item => (
          <button className="game-library-card neo-glass" key={item.name} onClick={() => onTrain(item.name)}><span>JUGAR</span><strong>{item.label}</strong><small>{item.description}</small><b>→</b></button>
        ))}
      </section>
    </div>
  );
}

function ProfileView({ profile, sessions }: { profile: LearnerProfile; sessions: SessionSummary[] }) {
  const avatar = avatarFor(profile.avatarId);
  const topGame = useMemo(() => {
    if (!sessions.length) return 'Sin datos';
    const counts = new Map<GameName, number>();
    sessions.forEach(session => counts.set(session.game, (counts.get(session.game) ?? 0) + 1));
    return [...counts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'Sin datos';
  }, [sessions]);

  return (
    <div className="simple-view">
      <header className="profile-hero neo-glass"><div className="profile-avatar">{avatar.emoji}</div><div><span>PERFIL</span><h1>{profile.name}</h1><p>{avatar.name} · {avatar.trait}</p></div></header>
      <section className="simple-card neo-glass"><h2>Estado del alpha</h2><div className="profile-facts"><div><span>Sesiones guardadas</span><strong>{sessions.length}</strong></div><div><span>Juego más usado</span><strong>{topGame}</strong></div><div><span>Persistencia</span><strong>Local</strong></div><div><span>Backend</span><strong>Pendiente</strong></div></div></section>
    </div>
  );
}

export default function FocusLabApp() {
  const [view, setView] = useState<View>('home');
  const [game, setGame] = useState<GameName>('Runner');
  const [skill, setSkill] = useState(SKILLS[0].name);
  const [condition, setCondition] = useState<TrainingCondition>('dual_task');
  const [content, setContent] = useState<LearningContent | undefined>();
  const [sessions, setSessions] = useState<SessionSummary[]>(() => loadSessions());
  const [lastSession, setLastSession] = useState<SessionSummary | undefined>(() => loadSessions()[0]);
  const [profile, setProfile] = useState<LearnerProfile | null>(() => loadProfile());

  if (!profile) {
    return <Onboarding onComplete={next => { saveProfile(next); setProfile(next); }} />;
  }

  if (view === 'train') {
    return (
      <TrainingArena
        game={game}
        content={content}
        skill={skill}
        condition={condition}
        onExit={summary => {
          const next = saveSession(summary);
          setSessions(next);
          setLastSession(summary);
          setView('results');
        }}
      />
    );
  }

  if (view === 'home') {
    return (
      <NeoHome
        profile={profile}
        sessions={sessions}
        lastSession={lastSession}
        onNewSession={() => setView('setup')}
        onContinue={() => setView(lastSession ? 'results' : 'setup')}
        onGames={() => setView('explore')}
        onSkills={() => setView('progress')}
        onProgress={() => setView('progress')}
        onProfile={() => setView('profile')}
      />
    );
  }

  return (
    <main className="secondary-shell">
      <SecondaryNav view={view} onChange={setView} />
      {view === 'setup' && <SetupView initialGame={game} onLaunch={params => { setGame(params.game); setSkill(params.skill); setCondition(params.condition); setContent(params.content); setView('train'); }} />}
      {view === 'results' && <ResultsView summary={lastSession} sessions={sessions} onProgress={() => setView('progress')} />}
      {view === 'progress' && <ProgressView sessions={sessions} />}
      {view === 'explore' && <ExploreView onTrain={selected => { setGame(selected); setView('setup'); }} />}
      {view === 'profile' && <ProfileView profile={profile} sessions={sessions} />}
    </main>
  );
}
