'use client';

import { useMemo, useState } from 'react';
import { AVATARS, type AvatarId, type LearnerProfile } from '@/lib/profileStore';

interface OnboardingProps {
  onComplete: (profile: LearnerProfile) => void;
}

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [avatarId, setAvatarId] = useState<AvatarId>('robot');
  const [name, setName] = useState('');
  const selected = useMemo(() => AVATARS.find((avatar) => avatar.id === avatarId) ?? AVATARS[1], [avatarId]);

  const complete = () => {
    const cleanName = name.trim();
    if (!cleanName) return;
    onComplete({ name: cleanName, avatarId, createdAt: new Date().toISOString() });
  };

  return (
    <main className="neo-page onboarding-page">
      <div className="orb orb-a" />
      <div className="orb orb-b" />
      <div className="orb orb-c" />

      <header className="neo-brand">
        <div className="neo-logo">◉</div>
        <div>
          <strong>Focus<span>Lab</span></strong>
          <small>Entrena tu atención</small>
        </div>
      </header>

      <section className="onboarding-card neo-glass">
        <div className="onboarding-topline">
          <span>PASO 1 DE 3</span>
          <div className="progress-dots"><i className="active" /><i /><i /></div>
        </div>

        <div className="companion-bubble onboarding-bubble">
          <span className="bubble-face">{selected.emoji}</span>
          <p>Puedes cambiar tu avatar luego.</p>
        </div>

        <div className="onboarding-title">
          <h1>Elige tu <em>avatar</em></h1>
          <p>Te acompañará durante tus sesiones.</p>
        </div>

        <div className="avatar-grid">
          {AVATARS.map((avatar) => (
            <button
              type="button"
              key={avatar.id}
              className={`avatar-choice ${avatarId === avatar.id ? 'selected' : ''}`}
              onClick={() => setAvatarId(avatar.id)}
              aria-label={`Elegir avatar ${avatar.name}`}
            >
              <span className={`avatar-orb avatar-${avatar.accent}`}>
                <b>{avatar.emoji}</b>
                {avatarId === avatar.id && <i className="avatar-check">✓</i>}
              </span>
              <strong>{avatar.name}</strong>
              <small>{avatar.trait}</small>
            </button>
          ))}
        </div>

        <label className="neo-field">
          <span>TU NOMBRE</span>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Escribe tu nombre…"
            onKeyDown={(event) => { if (event.key === 'Enter') complete(); }}
          />
        </label>

        <button type="button" className="neo-primary" disabled={!name.trim()} onClick={complete}>
          Continuar <span>→</span>
        </button>
      </section>

      <p className="neo-quote">PEQUEÑOS ENFOQUES · GRANDES CAMBIOS</p>
    </main>
  );
}
