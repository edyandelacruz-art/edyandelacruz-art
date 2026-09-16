'use client';
import { useEffect, useRef } from 'react';
interface Props {
  speed: number;
  paused: boolean;
  sessionKey: number;
  onStats: (score: number, collisions: number) => void;
}
export default function MemoryGridGame({ speed, paused, sessionKey, onStats }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null), pausedRef = useRef(paused), onStatsRef = useRef(onStats);
  useEffect(() => { pausedRef.current = paused; }, [paused]);
  useEffect(() => { onStatsRef.current = onStats; }, [onStats]);
  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext('2d');
    if (!ctx) return;
    const n = 4, size = 54, gap = 9, ox = c.width / 2 - (n * size + (n - 1) * gap) / 2, oy = 24;
    let targets = new Set<number>(), chosen = new Set<number>(), show = true, score = 0, errors = 0, roundStart = performance.now(), raf = 0;
    const newRound = () => {
      targets = new Set(); chosen = new Set();
      while (targets.size < 4) targets.add(Math.floor(Math.random() * 16));
      show = true; roundStart = performance.now();
    };
    const click = (e: PointerEvent) => {
      if (pausedRef.current || show) return;
      const r = c.getBoundingClientRect();
      const x = (e.clientX - r.left) * (c.width / r.width), y = (e.clientY - r.top) * (c.height / r.height);
      const col = Math.floor((x - ox) / (size + gap)), row = Math.floor((y - oy) / (size + gap));
      if (col < 0 || col >= n || row < 0 || row >= n) return;
      const id = row * n + col;
      if (chosen.has(id)) return;
      chosen.add(id);
      if (targets.has(id)) { score++; onStatsRef.current(score, errors); } else { errors++; onStatsRef.current(score, errors); }
      if (chosen.size >= 4) setTimeout(newRound, 300);
    };
    c.addEventListener('pointerdown', click);
    const draw = (now: number) => {
      raf = requestAnimationFrame(draw);
      if (!pausedRef.current && show && now - roundStart > Math.max(520, 1250 - speed * 70)) show = false;
      ctx.fillStyle = '#071022'; ctx.fillRect(0, 0, c.width, c.height);
      for (let i = 0; i < 16; i++) {
        const row = Math.floor(i / n), col = i % n, x = ox + col * (size + gap), y = oy + row * (size + gap), isTarget = targets.has(i), isChosen = chosen.has(i);
        ctx.fillStyle = show && isTarget ? '#74f1ff' : isChosen ? isTarget ? 'rgba(112,242,190,.78)' : 'rgba(255,120,150,.78)' : 'rgba(255,255,255,.055)';
        ctx.fillRect(x, y, size, size); ctx.strokeStyle = 'rgba(255,255,255,.08)'; ctx.strokeRect(x, y, size, size);
      }
      ctx.fillStyle = '#aab7cf'; ctx.font = '13px system-ui'; ctx.fillText(show ? 'Memoriza las 4 celdas' : 'Selecciona las 4 celdas recordadas', 18, 25);
    };
    newRound(); draw(performance.now());
    return () => { cancelAnimationFrame(raf); c.removeEventListener('pointerdown', click); };
  }, [sessionKey, speed]);
  return <canvas ref={canvasRef} width={760} height={280} className="game-canvas" aria-label="Memory Grid FocusLab" />;
}
