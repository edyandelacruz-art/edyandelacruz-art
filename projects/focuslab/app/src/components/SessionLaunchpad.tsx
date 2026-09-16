'use client';

import { useMemo, useState } from 'react';
import type { GameName, LearningContent } from '@/types/training';
import { buildContentPackage } from '@/lib/contentEngine';
import { avatarFor, type LearnerProfile } from '@/lib/profileStore';

type Props = {
  profile: LearnerProfile;
  initialGame: GameName;
  onBack: () => void;
  onLaunch: (game: GameName, skill: string, content: LearningContent) => void;
};

type GameCard = {
  name: GameName;
  eyebrow: string;
  title: string;
  description: string;
  skill: string;
  scene: 'runner' | 'tetris' | 'road' | 'pong' | 'snake' | 'memory';
};

const GAME_CARDS: GameCard[] = [
  { name: 'Runner', eyebrow: 'AUDIO + MOVIMIENTO', title: 'Runner', description: 'Corre, escucha y responde.', skill: 'Atención selectiva', scene: 'runner' },
  { name: 'Tetris', eyebrow: 'ESPACIO + MEMORIA', title: 'Tetris', description: 'Organiza mientras mantienes información.', skill: 'Memoria de trabajo', scene: 'tetris' },
  { name: 'Road Dodge', eyebrow: 'CONTROL + REACCIÓN', title: 'Road Dodge', description: 'Esquiva distractores y decide rápido.', skill: 'Control inhibitorio', scene: 'road' },
  { name: 'Pong', eyebrow: 'TRACKING VISUAL', title: 'Pong', description: 'Sigue el objetivo sin perder la pregunta.', skill: 'Atención sostenida', scene: 'pong' },
  { name: 'Snake', eyebrow: 'PLANEA + RECUERDA', title: 'Snake', description: 'Mantén la ruta y recupera información.', skill: 'Recuperación', scene: 'snake' },
  { name: 'Memory Grid', eyebrow: 'MEMORIA VISUAL', title: 'Memory Grid', description: 'Observa patrones y repítelos.', skill: 'Memoria visual', scene: 'memory' },
];

const SKILLS = ['Atención selectiva', 'Memoria de trabajo', 'Control inhibitorio', 'Atención sostenida', 'Cambio atencional', 'Recuperación'];
const DEFAULT_TEXT = 'Una célula eucariota funciona como un sistema coordinado. La membrana celular delimita la célula y regula el intercambio de sustancias con el entorno. Las mitocondrias transforman energía química y participan en la producción de ATP. El núcleo contiene la mayor parte del ADN y coordina muchas actividades mediante la expresión genética. Los ribosomas realizan la síntesis de proteínas. El aparato de Golgi modifica, clasifica y empaqueta proteínas y otras moléculas. Los lisosomas degradan materiales y ayudan al reciclaje celular. El citoesqueleto proporciona organización interna, forma y soporte para movimientos celulares.';

function GameScene({ type }: { type: GameCard['scene'] }) {
  if (type === 'runner') return <div className="launch-scene runner-scene"><i className="moon"/><i className="hill one"/><i className="hill two"/><i className="runner-character">●</i><i className="runner-obstacle"/><i className="runner-ground"/></div>;
  if (type === 'tetris') return <div className="launch-scene tetris-scene"><div className="tetris-board">{Array.from({ length: 28 }).map((_, index) => <i key={index} className={index % 5 === 0 || index > 20 ? 'lit' : ''}/>)}</div><span className="next-piece"><i/><i/><i/></span></div>;
  if (type === 'road') return <div className="launch-scene road-scene"><i className="road-horizon"/><i className="road-strip left"/><i className="road-strip right"/><i className="road-car"/><i className="road-block a"/><i className="road-block b"/></div>;
  if (type === 'pong') return <div className="launch-scene pong-scene"><i className="pong-mid"/><i className="pong-paddle p1"/><i className="pong-paddle p2"/><i className="pong-ball"/></div>;
  if (type === 'snake') return <div className="launch-scene snake-scene"><span className="snake-line">{[0,1,2,3,4,5].map(index => <i key={index}/>)}</span><i className="snake-fruit">●</i></div>;
  return <div className="launch-scene memory-scene">{Array.from({ length: 16 }).map((_, index) => <i key={index} className={[2,5,9,10].includes(index) ? 'lit' : ''}/>)}</div>;
}

export default function SessionLaunchpad({ profile, initialGame, onBack, onLaunch }: Props) {
  const avatar = avatarFor(profile.avatarId);
  const [game, setGame] = useState<GameName>(initialGame);
  const selected = useMemo(() => GAME_CARDS.find(item => item.name === game) ?? GAME_CARDS[0], [game]);
  const [skill, setSkill] = useState(selected.skill);
  const [sourceMode, setSourceMode] = useState<'youtube' | 'text'>('youtube');
  const [title, setTitle] = useState('Biología celular');
  const [sourceRef, setSourceRef] = useState('');
  const [text, setText] = useState(DEFAULT_TEXT);
  const [error, setError] = useState('');

  const chooseGame = (item: GameCard) => {
    setGame(item.name);
    setSkill(item.skill);
  };

  const start = () => {
    try {
      const content = buildContentPackage({ title, text, sourceRef: sourceMode === 'youtube' ? sourceRef : undefined });
      setError('');
      onLaunch(game, skill, content);
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : 'No pudimos preparar la sesión.');
    }
  };

  return (
    <main className="launchpad-page neo-page">
      <div className="orb orb-a"/><div className="orb orb-b"/><div className="orb orb-c"/>
      <header className="launchpad-top">
        <button className="launch-back" type="button" onClick={onBack}>‹</button>
        <div className="compact-brand launch-brand"><div className="neo-logo">◉</div><div><strong>Focus<span>Lab</span></strong><small>ELIGE TU MISIÓN</small></div></div>
        <div className="launch-avatar"><span>{avatar.emoji}</span><small>{profile.name}</small></div>
      </header>

      <section className="launchpad-intro">
        <div><span className="neo-eyebrow">NUEVA SESIÓN</span><h1>¿Qué quieres entrenar hoy?</h1><p>Elige el contenido y después tu juego.</p></div>
        <div className="companion-bubble launch-bubble"><span className="bubble-face">✦</span><p>Yo me encargo del resto.</p></div>
      </section>

      <section className="source-launch-card neo-glass">
        <div className="source-launch-head">
          <div><span className="launch-number">01</span><div><strong>Tu contenido</strong><small>Usa un video de YouTube o pega tu texto.</small></div></div>
          <div className="source-mode-toggle"><button className={sourceMode === 'youtube' ? 'active' : ''} onClick={() => setSourceMode('youtube')}>▶ YouTube</button><button className={sourceMode === 'text' ? 'active' : ''} onClick={() => setSourceMode('text')}>✎ Texto</button></div>
        </div>
        {sourceMode === 'youtube' && <div className="youtube-source-box"><div className="youtube-icon">▶</div><input value={sourceRef} onChange={(event: { target: { value: string } }) => setSourceRef(event.target.value)} placeholder="Pega aquí el enlace de YouTube" aria-label="Enlace de YouTube"/></div>}
        <div className="content-fields compact-content-fields">
          <input value={title} onChange={(event: { target: { value: string } }) => setTitle(event.target.value)} placeholder="Título de la sesión" aria-label="Título de la sesión"/>
          <textarea value={text} onChange={(event: { target: { value: string } }) => setText(event.target.value)} rows={sourceMode === 'youtube' ? 3 : 5} aria-label="Texto de aprendizaje" placeholder={sourceMode === 'youtube' ? 'Pega el texto o transcripción que acompañará al video…' : 'Pega aquí el contenido que quieres estudiar…'}/>
        </div>
        {sourceMode === 'youtube' && <p className="source-note">El video queda vinculado como referencia. La transcripción automática todavía no está conectada.</p>}
      </section>

      <section className="game-pick-section">
        <div className="game-pick-head"><span className="launch-number">02</span><div><strong>Elige tu juego</strong><small>Cada mundo entrena una carga distinta.</small></div></div>
        <div className="visual-game-grid">
          {GAME_CARDS.map(item => (
            <button type="button" key={item.name} className={`visual-game-card ${game === item.name ? 'selected' : ''}`} onClick={() => chooseGame(item)}>
              <GameScene type={item.scene}/>
              <div className="visual-game-copy"><span>{item.eyebrow}</span><strong>{item.title}</strong><small>{item.description}</small></div>
              <i className="game-check">✓</i>
            </button>
          ))}
        </div>
      </section>

      <section className="skill-strip neo-glass">
        <div><span className="launch-number">03</span><strong>Habilidad</strong></div>
        <div className="skill-pills">{SKILLS.map(item => <button type="button" key={item} className={skill === item ? 'active' : ''} onClick={() => setSkill(item)}>{item}</button>)}</div>
      </section>

      {error && <p className="launch-error">{error}</p>}
      <button className="neo-primary launch-main-cta" type="button" onClick={start}>Empezar con {selected.title} <span>→</span></button>
    </main>
  );
}
