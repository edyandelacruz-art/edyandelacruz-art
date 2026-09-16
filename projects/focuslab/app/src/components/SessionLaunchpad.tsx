'use client';

import { useMemo, useState } from 'react';
import type { GameName, LearningContent, TrainingCondition } from '@/types/training';
import { buildContentPackage } from '@/lib/contentEngine';
import { avatarFor, type LearnerProfile } from '@/lib/profileStore';
import { buildYouTubeSearchUrl, parseYouTubeVideo } from '@/lib/youtube';

type Props = {
  profile: LearnerProfile;
  initialGame: GameName;
  onBack: () => void;
  onLaunch: (params: {
    game: GameName;
    skill: string;
    condition: TrainingCondition;
    content: LearningContent;
  }) => void;
};

type SkillOption = { value: string; label: string };
type GameCard = {
  name: GameName;
  title: string;
  description: string;
  skill: string;
  scene: 'runner' | 'tetris' | 'road' | 'pong' | 'snake' | 'memory';
};

const SKILLS: SkillOption[] = [
  { value: 'Selective attention', label: 'Atención selectiva' },
  { value: 'Working memory', label: 'Memoria de trabajo' },
  { value: 'Inhibitory control', label: 'Control inhibitorio' },
  { value: 'Sustained attention', label: 'Atención sostenida' },
  { value: 'Switching', label: 'Cambio atencional' },
  { value: 'Recall', label: 'Recuperación' },
];

const GAME_CARDS: GameCard[] = [
  { name: 'Runner', title: 'Runner', description: 'Escucha mientras avanzas.', skill: 'Selective attention', scene: 'runner' },
  { name: 'Tetris', title: 'Tetris', description: 'Planifica y conserva información.', skill: 'Working memory', scene: 'tetris' },
  { name: 'Road Dodge', title: 'Road Dodge', description: 'Esquiva y controla impulsos.', skill: 'Inhibitory control', scene: 'road' },
  { name: 'Pong', title: 'Pong', description: 'Sigue el objetivo sin perder el foco.', skill: 'Sustained attention', scene: 'pong' },
  { name: 'Snake', title: 'Snake', description: 'Planifica y recupera información.', skill: 'Recall', scene: 'snake' },
  { name: 'Memory Grid', title: 'Memory Grid', description: 'Observa y repite patrones.', skill: 'Working memory', scene: 'memory' },
];

function GameArt({ type }: { type: GameCard['scene'] }) {
  if (type === 'runner') {
    return <div className="lp-art lp-runner"><i className="lp-moon"/><i className="lp-hill a"/><i className="lp-hill b"/><i className="lp-runner-kid"/><i className="lp-runner-block"/></div>;
  }
  if (type === 'road') {
    return <div className="lp-art lp-road"><i className="lp-road-sun"/><i className="lp-road-track"/><i className="lp-road-car"/><i className="lp-road-obstacle one"/><i className="lp-road-obstacle two"/></div>;
  }
  if (type === 'memory') {
    return <div className="lp-art lp-memory">{Array.from({ length: 16 }).map((_, index) => <i key={index} className={[2,5,9,10].includes(index) ? 'hot' : ''}/>)}</div>;
  }
  if (type === 'tetris') {
    return <div className="lp-art lp-tetris"><i className="b1"/><i className="b2"/><i className="b3"/><i className="b4"/><i className="b5"/><i className="b6"/></div>;
  }
  if (type === 'pong') {
    return <div className="lp-art lp-pong"><i className="lp-midline"/><i className="lp-paddle left"/><i className="lp-paddle right"/><i className="lp-ball"/></div>;
  }
  return <div className="lp-art lp-snake"><i className="s1"/><i className="s2"/><i className="s3"/><i className="s4"/><i className="food"/></div>;
}

export default function SessionLaunchpad({ profile, initialGame, onBack, onLaunch }: Props) {
  const avatar = avatarFor(profile.avatarId);
  const [game, setGame] = useState<GameName>(initialGame);
  const selected = useMemo(() => GAME_CARDS.find(item => item.name === game) ?? GAME_CARDS[0], [game]);
  const [skill, setSkill] = useState(selected.skill);
  const [condition, setCondition] = useState<TrainingCondition>('dual_task');
  const [sourceMode, setSourceMode] = useState<'youtube' | 'text'>('youtube');
  const [youtubeInput, setYoutubeInput] = useState('');
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [error, setError] = useState('');
  const [pasteStatus, setPasteStatus] = useState('');

  const youtubeVideo = useMemo(() => parseYouTubeVideo(youtubeInput), [youtubeInput]);
  const selectedSkillLabel = SKILLS.find(item => item.value === skill)?.label ?? skill;

  const chooseGame = (item: GameCard) => {
    setGame(item.name);
    setSkill(item.skill);
    setCondition('dual_task');
  };

  const searchYouTube = () => {
    const query = youtubeInput.trim();
    if (!query) {
      setError('Escribe un tema para buscar o pega un enlace de YouTube.');
      return;
    }
    if (youtubeVideo) {
      window.open(youtubeVideo.canonicalUrl, '_blank', 'noopener,noreferrer');
      return;
    }
    window.open(buildYouTubeSearchUrl(query), '_blank', 'noopener,noreferrer');
  };

  const pasteYouTube = async () => {
    try {
      const value = await navigator.clipboard.readText();
      setYoutubeInput(value);
      setPasteStatus(value ? 'Enlace pegado' : 'El portapapeles está vacío');
      setError('');
    } catch {
      setPasteStatus('No pude leer el portapapeles. Pega el enlace manualmente.');
    }
  };

  const start = () => {
    try {
      if (sourceMode === 'youtube' && !youtubeVideo) {
        throw new Error('Vincula un video válido de YouTube antes de iniciar.');
      }
      const cleanText = text.trim();
      if (!cleanText) {
        throw new Error(sourceMode === 'youtube'
          ? 'Pega la transcripción o un texto fiel al video para generar preguntas trazables.'
          : 'Pega el contenido que quieres estudiar.');
      }

      const content = buildContentPackage({
        title: title.trim() || (sourceMode === 'youtube' ? 'Sesión con YouTube' : 'Texto de estudio'),
        text: cleanText,
        sourceRef: sourceMode === 'youtube' ? youtubeVideo?.canonicalUrl : undefined,
      });
      setError('');
      onLaunch({ game, skill, condition, content });
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : 'No pudimos preparar la sesión.');
    }
  };

  return (
    <main className="launchpad-page">
      <i className="launchpad-glow one"/><i className="launchpad-glow two"/>

      <header className="launchpad-head">
        <div>
          <button type="button" className="launchpad-back" onClick={onBack}>‹ Inicio</button>
          <span className="launchpad-kicker">NUEVA SESIÓN</span>
          <h1>Elige qué estudiar y cómo entrenarlo.</h1>
          <p>Dos decisiones claras. El resto lo organiza FocusLab.</p>
        </div>
        <div className="launchpad-companion">
          <div className="launchpad-bubble">Primero la fuente. Después el juego.</div>
          <span aria-label={avatar.name}>{avatar.emoji}</span>
        </div>
      </header>

      <section className="launchpad-source">
        <div className="source-tabs" role="tablist" aria-label="Fuente de contenido">
          <button type="button" className={sourceMode === 'youtube' ? 'active youtube' : ''} onClick={() => { setSourceMode('youtube'); setError(''); }}>▶ YouTube</button>
          <button type="button" className={sourceMode === 'text' ? 'active' : ''} onClick={() => { setSourceMode('text'); setError(''); }}>Texto</button>
        </div>

        {sourceMode === 'youtube' ? (
          <div className="youtube-source-card">
            <div className="youtube-input-shell">
              <span className="youtube-icon">▶</span>
              <input
                value={youtubeInput}
                onChange={event => { setYoutubeInput(event.target.value); setPasteStatus(''); setError(''); }}
                placeholder="Busca un tema o pega un enlace de YouTube"
                aria-label="Buscar o pegar video de YouTube"
              />
              <div className="youtube-command-actions">
                <button type="button" onClick={pasteYouTube}>Pegar</button>
                <button type="button" className="primary" onClick={searchYouTube}>{youtubeVideo ? 'Abrir' : 'Buscar'}</button>
              </div>
            </div>
            {pasteStatus && <p className="source-inline-status">{pasteStatus}</p>}

            {youtubeVideo ? (
              <div className="youtube-preview-card">
                <div className="youtube-preview-frame">
                  <iframe
                    src={youtubeVideo.embedUrl}
                    title="Vista previa del video enlazado"
                    loading="lazy"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
                <div className="youtube-preview-meta">
                  <span>VIDEO ENLAZADO</span>
                  <strong>{title.trim() || 'Video de YouTube'}</strong>
                  <small>{youtubeVideo.canonicalUrl}</small>
                  <div>
                    <button type="button" onClick={() => window.open(youtubeVideo.canonicalUrl, '_blank', 'noopener,noreferrer')}>Abrir en YouTube</button>
                    <button type="button" onClick={() => { setYoutubeInput(''); setPasteStatus(''); }}>Cambiar video</button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="youtube-empty-state">
                <strong>{youtubeInput.trim() ? 'Todavía no es un enlace de video.' : 'Busca o pega un video.'}</strong>
                <span>{youtubeInput.trim() ? 'Pulsa Buscar para abrir resultados en YouTube y luego pega el enlace elegido.' : 'FocusLab validará el enlace y mostrará el video antes de iniciar.'}</span>
              </div>
            )}

            <div className="source-material-block">
              <div className="source-material-heading">
                <div><strong>Contenido para las preguntas</strong><span>Debe corresponder al video.</span></div>
                <em>OBLIGATORIO</em>
              </div>
              <input className="launchpad-title-input" value={title} onChange={event => setTitle(event.target.value)} placeholder="Nombre de la sesión (opcional)"/>
              <textarea className="launchpad-textarea" value={text} onChange={event => setText(event.target.value)} rows={5} placeholder="Pega aquí la transcripción o un texto fiel al video. FocusLab generará las preguntas únicamente desde este contenido."/>
              <p className="source-honesty-note">El enlace queda asociado a la sesión. Hasta conectar un proveedor de transcript, FocusLab no inventará ni afirmará haber extraído automáticamente el contenido del video.</p>
            </div>
          </div>
        ) : (
          <div className="text-source-card">
            <input className="launchpad-title-input" value={title} onChange={event => setTitle(event.target.value)} placeholder="Nombre de la sesión (opcional)"/>
            <textarea className="launchpad-textarea" value={text} onChange={event => setText(event.target.value)} rows={8} placeholder="Pega aquí el contenido que quieres estudiar. FocusLab generará preguntas trazables desde este texto."/>
          </div>
        )}

        {error && <p className="launchpad-error">{error}</p>}
      </section>

      <section className="launchpad-games">
        <div className="launchpad-section-head">
          <div><span>ELIGE TU MUNDO</span><h2>¿Con qué quieres entrenar?</h2></div>
          <small>Seleccionado: {selected.title}</small>
        </div>
        <div className="game-picker-grid">
          {GAME_CARDS.map(item => (
            <button type="button" key={item.name} className={`visual-game-card ${condition === 'dual_task' && game === item.name ? 'selected' : ''}`} onClick={() => chooseGame(item)}>
              <GameArt type={item.scene}/>
              <div className="visual-game-copy"><strong>{item.title}</strong><span>{item.description}</span></div>
              <i className="game-check">✓</i>
            </button>
          ))}
        </div>
      </section>

      <section className="launchpad-options">
        <div className="launchpad-option-group">
          <span>HABILIDAD</span>
          <div className="skill-chip-row">
            {SKILLS.map(item => <button type="button" key={item.value} className={skill === item.value ? 'active' : ''} onClick={() => setSkill(item.value)}>{item.label}</button>)}
          </div>
        </div>
        <div className="launchpad-option-group compact">
          <span>CONDICIÓN</span>
          <div className="condition-chip-row">
            <button type="button" className={condition === 'dual_task' ? 'active' : ''} onClick={() => setCondition('dual_task')}>Con juego</button>
            <button type="button" className={condition === 'baseline' ? 'active' : ''} onClick={() => setCondition('baseline')}>Baseline</button>
          </div>
        </div>
      </section>

      <div className="launchpad-dock">
        <div className="launchpad-choice">
          <span>{condition === 'baseline' ? 'BASELINE' : selected.title}</span>
          <strong>{selectedSkillLabel}</strong>
        </div>
        <button className="launchpad-start" type="button" onClick={start}>{condition === 'baseline' ? 'Crear baseline' : 'Empezar'} <span>→</span></button>
      </div>
    </main>
  );
}
