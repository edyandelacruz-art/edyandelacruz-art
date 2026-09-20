'use client';

import type { SessionSummary } from '@/types/training';
import { avatarFor, type LearnerProfile } from '@/lib/profileStore';

interface NeoHomeProps {
  profile: LearnerProfile;
  sessions: SessionSummary[];
  lastSession?: SessionSummary;
  onNewSession: () => void;
  onContinue: () => void;
  onGames: () => void;
  onSkills: () => void;
  onProgress: () => void;
  onProfile: () => void;
}

export default function NeoHome({
  profile,
  sessions,
  lastSession,
  onNewSession,
  onContinue,
  onGames,
  onSkills,
  onProgress,
  onProfile,
}: NeoHomeProps) {
  const avatar = avatarFor(profile.avatarId);

  return (
    <main className="neo-page home-page">
      <div className="orb orb-a" />
      <div className="orb orb-b" />
      <div className="orb orb-d" />

      <header className="neo-home-header">
        <div className="neo-brand compact-brand">
          <div className="neo-logo">◉</div>
          <div>
            <strong>Focus<span>Lab</span></strong>
            <small>Entrena tu atención</small>
          </div>
        </div>

        <button type="button" className="profile-pill" onClick={onProfile}>
          <span>{avatar.emoji}</span>
          <div><strong>{avatar.name}</strong><small>Tu compañero</small></div>
          <b>›</b>
        </button>
      </header>

      <section className="neo-greeting">
        <p>Hola, <strong>{profile.name}</strong></p>
        <span>Listo para entrenar ✦</span>
      </section>

      <section className="hero-training neo-glass">
        <div className="hero-avatar-wrap">
          <div className={`hero-avatar avatar-${avatar.accent}`}>{avatar.emoji}</div>
          <div className="companion-bubble hero-bubble">
            <span className="bubble-face">☺</span>
            <p>{sessions.length ? 'Sigamos desde donde vas.' : 'Empieza con una sesión corta.'}</p>
          </div>
        </div>

        <div className="hero-copy">
          <span className="neo-eyebrow">HOY</span>
          <h1>Entrena tu <em>atención</em></h1>
          <p>{lastSession ? `Última sesión: ${lastSession.game}.` : 'Sesiones simples para una mente más presente.'}</p>
          <button className="neo-primary hero-primary" type="button" onClick={onNewSession}>Nueva sesión <span>→</span></button>
          {lastSession && <button className="neo-secondary" type="button" onClick={onContinue}>▶ Continuar</button>}
        </div>
      </section>

      <section className="home-shortcuts">
        <button type="button" className="shortcut-card neo-glass" onClick={onGames}>
          <span className="shortcut-icon">🎮</span><strong>Juegos</strong><small>Entrena jugando</small><b>›</b>
        </button>
        <button type="button" className="shortcut-card neo-glass" onClick={onSkills}>
          <span className="shortcut-icon">🧠</span><strong>Habilidades</strong><small>Desarrolla tu mente</small><b>›</b>
        </button>
        <button type="button" className="shortcut-card neo-glass" onClick={onProgress}>
          <span className="shortcut-icon">▥</span><strong>Progreso</strong><small>{sessions.length ? `${sessions.length} sesiones` : 'Empieza a medir'}</small><b>›</b>
        </button>
      </section>

      <p className="neo-quote">UNA MENTE ATENTA TAMBIÉN CREA UN MUNDO MEJOR</p>

      <nav className="bottom-nav neo-glass" aria-label="Navegación principal">
        <button className="active"><span>⌂</span><small>Inicio</small></button>
        <button onClick={onNewSession}><span>◉</span><small>Entrenar</small></button>
        <button onClick={onGames}><span>◇</span><small>Explorar</small></button>
        <button onClick={onProfile}><span>○</span><small>Perfil</small></button>
      </nav>
    </main>
  );
}
