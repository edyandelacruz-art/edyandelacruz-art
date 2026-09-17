'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import GameHost from './GameHost';
import { adaptDifficulty, INITIAL_DIFFICULTY } from '@/lib/adaptiveEngine';
import type {
  GameName,
  LearningContent,
  ResponseEvent,
  SessionSummary,
  TrainingCondition,
  TrainingQuestion,
} from '@/types/training';

const QUESTIONS: TrainingQuestion[] = [
  { id: 'q1', triggerSeconds: 12, prompt: '¿Cuál es la función principal de la membrana celular?', options: ['Producir ADN', 'Regular el intercambio con el entorno', 'Fabricar ribosomas', 'Almacenar ATP'], answerIndex: 1 },
  { id: 'q2', triggerSeconds: 24, prompt: '¿Qué organelo se relaciona directamente con la producción de ATP?', options: ['Mitocondria', 'Lisosoma', 'Núcleo', 'Aparato de Golgi'], answerIndex: 0 },
  { id: 'q3', triggerSeconds: 36, prompt: '¿Dónde se encuentra la mayor parte del ADN de una célula eucariota?', options: ['En el citoplasma', 'En el núcleo', 'En la membrana', 'En los lisosomas'], answerIndex: 1 },
  { id: 'q4', triggerSeconds: 48, prompt: '¿Qué organelo modifica, clasifica y empaqueta proteínas?', options: ['Aparato de Golgi', 'Centríolo', 'Mitocondria', 'Peroxisoma'], answerIndex: 0 },
  { id: 'q5', triggerSeconds: 60, prompt: '¿Qué estructura participa directamente en la síntesis de proteínas?', options: ['Ribosoma', 'Lisosoma', 'Vacuola', 'Nucleolo externo'], answerIndex: 0 },
  { id: 'q6', triggerSeconds: 72, prompt: '¿Qué organelo contiene enzimas que degradan materiales celulares?', options: ['Lisosoma', 'Ribosoma', 'Centrosoma', 'Retículo liso'], answerIndex: 0 },
  { id: 'q7', triggerSeconds: 84, prompt: '¿Qué red celular participa en la síntesis y transporte de proteínas y lípidos?', options: ['Retículo endoplasmático', 'Membrana nuclear', 'Citoesqueleto solamente', 'Centrosoma'], answerIndex: 0 },
  { id: 'q8', triggerSeconds: 96, prompt: '¿Por qué la célula necesita coordinación entre sus organelos?', options: ['Para integrar funciones y mantener la homeostasis', 'Para eliminar todo el ATP', 'Para duplicar siempre su tamaño', 'Para impedir el intercambio de sustancias'], answerIndex: 0 },
];

const LESSON = 'Una célula eucariota funciona como un sistema coordinado. La membrana celular delimita la célula y regula el intercambio de sustancias con el entorno. Dentro de la célula, las mitocondrias transforman energía química y participan en la producción de ATP. El núcleo contiene la mayor parte del ADN y coordina muchas actividades mediante la expresión genética. Los ribosomas realizan la síntesis de proteínas. El retículo endoplasmático rugoso participa en la síntesis y transporte de proteínas, mientras que el retículo endoplasmático liso interviene, entre otras funciones, en la síntesis de lípidos. El aparato de Golgi modifica, clasifica y empaqueta proteínas y otras moléculas para dirigirlas a diferentes destinos. Los lisosomas contienen enzimas que degradan materiales y ayudan al reciclaje celular. El citoesqueleto proporciona organización interna, forma y soporte para movimientos celulares. Ningún organelo trabaja de manera completamente aislada: la célula mantiene su homeostasis porque estas estructuras intercambian materiales e información y coordinan sus funciones.';

export default function TrainingArena({
  onExit,
  game = 'Runner',
  content,
  condition = 'dual_task',
  skill = 'Selective attention',
}: {
  onExit?: (summary: SessionSummary) => void;
  game?: GameName;
  content?: LearningContent;
  condition?: TrainingCondition;
  skill?: string;
}) {
  const questions = content?.questions?.length ? content.questions : QUESTIONS;
  const lesson = content?.narration || LESSON;
  const contentTitle = content?.title || 'Biología celular';
  const [running, setRunning] = useState(false);
  const [sessionKey, setSessionKey] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [difficulty, setDifficulty] = useState(INITIAL_DIFFICULTY);
  const [activeQuestion, setActiveQuestion] = useState<TrainingQuestion | null>(null);
  const [asked, setAsked] = useState<string[]>([]);
  const [responses, setResponses] = useState<ResponseEvent[]>([]);
  const [gameScore, setGameScore] = useState(0);
  const [collisions, setCollisions] = useState(0);
  const [questionStart, setQuestionStart] = useState<number | null>(null);
  const [remaining, setRemaining] = useState(INITIAL_DIFFICULTY.questionTimeSeconds);
  const [lastResult, setLastResult] = useState<'correct' | 'wrong' | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const contentPaused = !!activeQuestion && (condition === 'baseline' || difficulty.pausePolicy !== 'continue_all');
  const gamePaused = condition === 'baseline' || (!!activeQuestion && difficulty.pausePolicy === 'pause_all');
  const accuracy = useMemo(() => responses.length ? responses.filter(r => r.correct).length / responses.length : 0, [responses]);
  const averageLatency = useMemo(() => responses.length ? responses.reduce((sum, item) => sum + item.responseMs, 0) / responses.length : 0, [responses]);
  const onStats = useCallback((score: number, hits: number) => { setGameScore(score); setCollisions(hits); }, []);

  useEffect(() => {
    if (!running || contentPaused) return;
    const id = window.setInterval(() => setElapsed(v => v + 0.25), 250);
    return () => window.clearInterval(id);
  }, [running, contentPaused]);

  useEffect(() => {
    if (!running || activeQuestion) return;
    const next = questions.find(q => !asked.includes(q.id) && elapsed >= q.triggerSeconds);
    if (!next) return;
    setActiveQuestion(next);
    setAsked(prev => [...prev, next.id]);
    setQuestionStart(performance.now());
    setRemaining(difficulty.questionTimeSeconds);
    if (condition === 'baseline' || difficulty.pausePolicy !== 'continue_all') window.speechSynthesis.pause();
  }, [running, elapsed, activeQuestion, asked, difficulty, questions, condition]);

  useEffect(() => {
    if (!activeQuestion) return;
    const id = window.setInterval(() => {
      setRemaining(value => {
        if (value <= 0.1) {
          window.clearInterval(id);
          return 0;
        }
        return Math.max(0, value - 0.1);
      });
    }, 100);
    return () => window.clearInterval(id);
  }, [activeQuestion]);

  const answer = useCallback((selectedIndex: number) => {
    if (!activeQuestion) return;
    const responseMs = questionStart ? performance.now() - questionStart : difficulty.questionTimeSeconds * 1000;
    const event: ResponseEvent = {
      questionId: activeQuestion.id,
      selectedIndex,
      correct: selectedIndex === activeQuestion.answerIndex,
      responseMs,
      level: difficulty.level,
      gameScore,
      collisions,
      pausePolicy: condition === 'baseline' ? 'pause_all' : difficulty.pausePolicy,
      questionTriggeredAtSeconds: activeQuestion.triggerSeconds,
      contentWasPlayingDuringAnswer: condition === 'dual_task' && difficulty.pausePolicy === 'continue_all',
      gameWasPlayingDuringAnswer: condition === 'dual_task' && difficulty.pausePolicy !== 'pause_all',
    };
    const nextResponses = [...responses, event];
    setResponses(nextResponses);
    setLastResult(event.correct ? 'correct' : 'wrong');
    setDifficulty(condition === 'dual_task' ? adaptDifficulty(difficulty, nextResponses) : INITIAL_DIFFICULTY);
    setActiveQuestion(null);
    setQuestionStart(null);
    window.speechSynthesis.resume();
  }, [activeQuestion, questionStart, difficulty, gameScore, collisions, responses, condition]);

  useEffect(() => {
    if (activeQuestion && remaining === 0) answer(-1);
  }, [remaining, activeQuestion, answer]);

  const start = () => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(lesson);
    utterance.lang = 'es-CO';
    utterance.rate = 0.92;
    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setSessionKey(value => value + 1);
    setRunning(true);
    setElapsed(0);
    setAsked([]);
    setResponses([]);
    setGameScore(0);
    setCollisions(0);
    setDifficulty(INITIAL_DIFFICULTY);
    setLastResult(null);
    setActiveQuestion(null);
    setQuestionStart(null);
  };

  const stop = () => {
    setRunning(false);
    setActiveQuestion(null);
    setQuestionStart(null);
    window.speechSynthesis.cancel();
    const summary: SessionSummary = {
      id: crypto.randomUUID(),
      completedAt: new Date().toISOString(),
      game,
      mode: 'audio_focus',
      condition,
      skill,
      learningAccuracy: accuracy,
      averageLatencyMs: averageLatency,
      gameScore,
      collisions,
      responseCount: responses.length,
      finalLevel: difficulty.level,
      pausePolicy: condition === 'baseline' ? 'pause_all' : difficulty.pausePolicy,
      contentId: content?.id || 'demo-cell-bio',
      contentFingerprint: content?.fingerprint,
      contentTitle,
      sourceType: content?.sourceType || 'text',
      sourceRef: content?.sourceRef,
    };
    onExit?.(summary);
  };

  const pauseLabel = condition === 'baseline'
    ? 'Baseline: sin tarea secundaria'
    : ({ pause_all: 'Pausa contenido + juego', pause_content: 'Pausa solo contenido', continue_all: 'Todo continúa' }[difficulty.pausePolicy]);

  return (
    <main className="shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">FOCUSLAB / ENTRENAMIENTO</p>
          <h1>{condition === 'baseline' ? 'Escucha y responde sin tarea secundaria.' : `${game} · ${skill}`}</h1>
          <p className="lead">{contentTitle}</p>
        </div>
        <div className="level-pill">Nivel {difficulty.level}</div>
      </header>

      <section className="metrics-grid">
        <article className="metric"><span>Precisión</span><strong>{Math.round(accuracy * 100)}%</strong></article>
        <article className="metric"><span>Respuesta</span><strong>{averageLatency ? `${(averageLatency / 1000).toFixed(1)}s` : '—'}</strong></article>
        <article className="metric"><span>{condition === 'baseline' ? 'Condición' : 'Juego'}</span><strong>{condition === 'baseline' ? 'BASE' : gameScore}</strong></article>
        <article className="metric"><span>{condition === 'baseline' ? 'Tarea secundaria' : 'Errores'}</span><strong>{condition === 'baseline' ? 'OFF' : collisions}</strong></article>
      </section>

      <section className="arena-card">
        <div className="arena-head">
          <div><p className="label">MODO</p><h2>{condition === 'baseline' ? 'Audio Focus × Baseline' : `Audio Focus × ${game}`}</h2></div>
          <div className="chips"><span>{pauseLabel}</span><span>{difficulty.questionTimeSeconds}s / pregunta</span></div>
        </div>

        <div className="content-strip">
          <div className={`signal ${running && !contentPaused ? 'live' : ''}`} />
          <div><strong>{running ? (contentPaused ? 'Audio pausado por pregunta' : 'Narración activa') : 'Lección lista'}</strong><p>{contentTitle}</p></div>
          <div className="controls">{!running ? <button className="primary" onClick={start}>Iniciar sesión</button> : <button className="ghost" onClick={stop}>Finalizar</button>}</div>
        </div>

        <div className="game-wrap">
          {condition === 'baseline' ? (
            <div className="baseline-stage" aria-label="Baseline sin tarea secundaria"><div className="baseline-orb" /><strong>BASELINE</strong><span>Escucha y responde sin carga visuomotora secundaria.</span></div>
          ) : (
            <GameHost game={game} speed={difficulty.gameSpeed} paused={!running || gamePaused} sessionKey={sessionKey} onStats={onStats} />
          )}

          {activeQuestion && (
            <div className="question-panel" role="dialog" aria-modal="true" aria-label="Pregunta de recuperación activa">
              <div className="question-top"><span>RECUPERACIÓN ACTIVA</span><strong>{remaining.toFixed(1)} s</strong></div>
              <h3>{activeQuestion.prompt}</h3>
              <div className="answers">{activeQuestion.options.map((option, index) => <button key={option} onClick={() => answer(index)}>{String.fromCharCode(65 + index)}. {option}</button>)}</div>
            </div>
          )}
        </div>

        <div className="footer-row"><p>{lastResult === 'correct' ? '✓ Última respuesta correcta' : lastResult === 'wrong' ? '✕ Última respuesta incorrecta' : 'La sesión registra precisión, latencia y carga activa.'}</p><p>{responses.length}/{questions.length} preguntas</p></div>
      </section>
    </main>
  );
}
