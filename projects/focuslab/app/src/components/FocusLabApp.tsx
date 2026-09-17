'use client';

import { useMemo, useState } from 'react';
import TrainingArena from './TrainingArena';
import Onboarding from './Onboarding';
import NeoHome from './NeoHome';
import SessionLaunchpad from './SessionLaunchpad';
import type {
  GameName,
  LearningContent,
  SessionSummary,
  TrainingCondition,
} from '@/types/training';
import {
  compareWithBaseline,
  loadSessions,
  saveSession,
} from '@/lib/trainingStore';
import {
  AVATARS,
  avatarFor,
  loadProfile,
  saveProfile,
  type AvatarId,
  type LearnerProfile,
} from '@/lib/profileStore';

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
        <button key={id} className={view === id ? 'active' : ''} onClick={() => onChange(id)}>
          {label}
        </button>
      ))}
    </nav>
  );
}

function ResultsView({
  summary,
  sessions,
  onProgress,
}: {
  summary?: SessionSummary;
  sessions: SessionSummary[];
  onProgress: () => void;
}) {
  if (!summary) {
    return (
      <div className="simple-view">
        <header className="simple-heading">
          <span>RESULTADOS</span>
          <h1>Aún no hay sesiones.</h1>
          <p>Completa una sesión para ver datos reales.</p>
        </header>
      </div>
    );
  }

  const comparison = compareWithBaseline(summary, sessions);

  return (
    <div className="simple-view">
      <header className="simple-heading">
        <span>RESULTADOS</span>
        <h1>{summary.game} · {summary.skill}</h1>
        <p>{summary.contentTitle}</p>
        {summary.sourceRef && (
          <button
            type="button"
            className="neo-secondary"
            onClick={() => window.open(summary.sourceRef, '_blank', 'noopener,noreferrer')}
          >
            Abrir fuente ↗
          </button>
        )}
      </header>

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
          <div className="comparison-row">
            <div><strong>{comparison.accuracyCostPoints.toFixed(1)} pts</strong><span>Costo de precisión</span></div>
            <div><strong>{comparison.latencyCostPercent === null ? '—' : `${comparison.latencyCostPercent.toFixed(0)}%`}</strong><span>Costo de latencia</span></div>
          </div>
        ) : (
          <p>No existe todavía una baseline comparable. FocusLab no estima un costo sin referencia válida.</p>
        )}
      </section>

      <button className="neo-primary launch-session" onClick={onProgress}>
        Ver progreso <span>→</span>
      </button>
    </div>
  );
}

function ProgressView({ sessions }: { sessions: SessionSummary[] }) {
  const skillRows = SKILLS.map((skill) => {
    const matches = sessions.filter((session) => session.skill === skill.name && session.responseCount > 0);
    return {
      ...skill,
      sessions: matches.length,
      accuracy: matches.length ? average(matches.map((session) => session.learningAccuracy)) : null,
    };
  });

  return (
    <div className="simple-view">
      <header className="simple-heading">
        <span>PROGRESO</span>
        <h1>{sessions.length ? `${sessions.length} sesiones` : 'Sin datos todavía'}</h1>
        <p>Solo se muestran medidas observadas.</p>
      </header>

      <section className="simple-card neo-glass">
        <h2>Habilidades entrenadas</h2>
        <div className="real-skill-list">
          {skillRows.map((row) => (
            <div className="real-skill-row" key={row.name}>
              <span>{row.label}</span>
              <div className="real-bar"><i style={{ width: `${row.accuracy === null ? 0 : Math.round(row.accuracy * 100)}%` }} /></div>
              <b>{row.accuracy === null ? '—' : percent(row.accuracy)}</b>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function ExploreView({ onTrain }: { onTrain: (game: GameName) => void }) {
  return (
    <div className="simple-view">
      <header className="simple-heading">
        <span>JUEGOS</span>
        <h1>Seis entornos, una misma medición.</h1>
        <p>El juego aporta carga; la habilidad define el objetivo.</p>
      </header>

      <section className="game-library">
        {GAMES.map((item) => (
          <button className="game-library-card neo-glass" key={item.name} onClick={() => onTrain(item.name)}>
            <span>JUGAR</span>
            <strong>{item.label}</strong>
            <small>{item.description}</small>
            <b>→</b>
          </button>
        ))}
      </section>
    </div>
  );
}

function ProfileView({
  profile,
  sessions,
  onAvatarChange,
}: {
  profile: LearnerProfile;
  sessions: SessionSummary[];
  onAvatarChange: (avatarId: AvatarId) => void;
}) {
  const avatar = avatarFor(profile.avatarId);
  const topGame = useMemo(() => {
    if (!sessions.length) return 'Sin datos';
    const counts = new Map<GameName, number>();
    sessions.forEach((session) => counts.set(session.game, (counts.get(session.game) ?? 0) + 1));
    return [...counts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'Sin datos';
  }, [sessions]);

  return (
    <div className="simple-view">
      <header className="profile-hero neo-glass">
        <div className="profile-avatar">{avatar.emoji}</div>
        <div>
          <span>PERFIL</span>
          <h1>{profile.name}</h1>
          <p>{avatar.name} · {avatar.trait}</p>
        </div>
      </header>

      <section className="simple-card neo-glass">
        <h2>Tu compañero</h2>
        <p>Puedes cambiar de avatar cuando quieras. Tu progreso y tus sesiones no se borran.</p>
        <div className="avatar-grid profile-avatar-grid">
          {AVATARS.map((item) => (
            <button
              type="button"
              key={item.id}
              className={`avatar-choice ${profile.avatarId === item.id ? 'selected' : ''}`}
              onClick={() => onAvatarChange(item.id)}
              aria-label={`Usar avatar ${item.name}`}
            >
              <span className={`avatar-orb avatar-${item.accent}`}>
                <b>{item.emoji}</b>
                {profile.avatarId === item.id && <i className="avatar-check">✓</i>}
              </span>
              <strong>{item.name}</strong>
              <small>{item.trait}</small>
            </button>
          ))}
        </div>
      </section>

      <section className="simple-card neo-glass">
        <h2>Estado del alpha</h2>
        <div className="profile-facts">
          <div><span>Sesiones guardadas</span><strong>{sessions.length}</strong></div>
          <div><span>Juego más usado</span><strong>{topGame}</strong></div>
          <div><span>Persistencia</span><strong>Local</strong></div>
          <div><span>Backend</span><strong>Pendiente</strong></div>
        </div>
      </section>
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
    return (
      <Onboarding
        onComplete={(next) => {
          saveProfile(next);
          setProfile(next);
        }}
      />
    );
  }

  if (view === 'train') {
    return (
      <TrainingArena
        game={game}
        content={content}
        skill={skill}
        condition={condition}
        onExit={(summary) => {
          const next = saveSession(summary);
          setSessions(next);
          setLastSession(summary);
          setView('results');
        }}
      />
    );
  }

  if (view === 'setup') {
    return (
      <SessionLaunchpad
        profile={profile}
        initialGame={game}
        onBack={() => setView('home')}
        onLaunch={(params) => {
          setGame(params.game);
          setSkill(params.skill);
          setCondition(params.condition);
          setContent(params.content);
          setView('train');
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

  const changeAvatar = (avatarId: AvatarId) => {
    const nextProfile = { ...profile, avatarId };
    saveProfile(nextProfile);
    setProfile(nextProfile);
  };

  return (
    <main className="secondary-shell">
      <SecondaryNav view={view} onChange={setView} />
      {view === 'results' && <ResultsView summary={lastSession} sessions={sessions} onProgress={() => setView('progress')} />}
      {view === 'progress' && <ProgressView sessions={sessions} />}
      {view === 'explore' && <ExploreView onTrain={(selected) => { setGame(selected); setView('setup'); }} />}
      {view === 'profile' && <ProfileView profile={profile} sessions={sessions} onAvatarChange={changeAvatar} />}
    </main>
  );
}
