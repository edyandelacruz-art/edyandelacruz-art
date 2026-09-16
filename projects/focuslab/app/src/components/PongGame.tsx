'use client';
import { useEffect, useRef } from 'react';
interface Props {
  speed: number;
  paused: boolean;
  sessionKey: number;
  onStats: (score: number, collisions: number) => void;
}
export default function PongGame({ speed, paused, sessionKey, onStats }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const speedRef = useRef(speed), pausedRef = useRef(paused), onStatsRef = useRef(onStats);
  useEffect(() => { speedRef.current = speed; }, [speed]);
  useEffect(() => { pausedRef.current = paused; }, [paused]);
  useEffect(() => { onStatsRef.current = onStats; }, [onStats]);
  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext('2d');
    if (!ctx) return;
    let py = 110, score = 0, misses = 0, raf = 0;
    let ball = { x: 380, y: 140, vx: 3.2, vy: 2.2 };
    const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
    const key = (e: KeyboardEvent) => {
      if (pausedRef.current) return;
      if (e.code === 'ArrowUp') { py -= 26; e.preventDefault(); }
      if (e.code === 'ArrowDown') { py += 26; e.preventDefault(); }
      py = clamp(py, 0, c.height - 70);
    };
    const pointer = (e: PointerEvent) => {
      const r = c.getBoundingClientRect();
      py = clamp((e.clientY - r.top) * (c.height / r.height) - 35, 0, c.height - 70);
    };
    window.addEventListener('keydown', key);
    c.addEventListener('pointermove', pointer);
    const reset = (dir = 1) => {
      ball = { x: 380, y: 70 + Math.random() * 140, vx: (3 + speedRef.current * 0.22) * dir, vy: (Math.random() > 0.5 ? 1 : -1) * (1.8 + Math.random() * 1.8) };
    };
    const draw = () => {
      raf = requestAnimationFrame(draw);
      ctx.fillStyle = '#071022'; ctx.fillRect(0, 0, c.width, c.height);
      ctx.strokeStyle = 'rgba(116,241,255,.12)'; ctx.setLineDash([9, 11]); ctx.beginPath(); ctx.moveTo(c.width / 2, 0); ctx.lineTo(c.width / 2, c.height); ctx.stroke(); ctx.setLineDash([]);
      if (!pausedRef.current) {
        const m = 0.72 + speedRef.current * 0.08;
        ball.x += ball.vx * m; ball.y += ball.vy * m;
        if (ball.y < 8 || ball.y > c.height - 8) ball.vy *= -1;
        const aiY = clamp(ball.y - 35, 0, c.height - 70);
        if (ball.x > c.width - 42 && ball.x < c.width - 25 && ball.y > aiY && ball.y < aiY + 70) { ball.vx = -Math.abs(ball.vx); score++; onStatsRef.current(score, misses); }
        if (ball.x < 42 && ball.x > 25 && ball.y > py && ball.y < py + 70) { ball.vx = Math.abs(ball.vx); score++; onStatsRef.current(score, misses); }
        if (ball.x < 0) { misses++; onStatsRef.current(score, misses); reset(1); }
        if (ball.x > c.width) reset(-1);
      }
      ctx.fillStyle = '#74f1ff'; ctx.fillRect(24, py, 12, 70);
      const ai = clamp(ball.y - 35, 0, c.height - 70);
      ctx.fillStyle = '#ad8cff'; ctx.fillRect(c.width - 36, ai, 12, 70);
      ctx.shadowColor = '#fff'; ctx.shadowBlur = 12; ctx.fillStyle = '#eefdff'; ctx.beginPath(); ctx.arc(ball.x, ball.y, 7, 0, Math.PI * 2); ctx.fill(); ctx.shadowBlur = 0;
      ctx.fillStyle = '#aab7cf'; ctx.font = '13px system-ui'; ctx.fillText('↑ ↓ / mueve el puntero', 18, 25);
    };
    reset(); draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener('keydown', key); c.removeEventListener('pointermove', pointer); };
  }, [sessionKey]);
  return <canvas ref={canvasRef} width={760} height={280} className="game-canvas" aria-label="Pong FocusLab" />;
}
