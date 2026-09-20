'use client';
import { useEffect, useRef } from 'react';
interface Props {
  speed: number;
  paused: boolean;
  sessionKey: number;
  onStats: (score: number, collisions: number) => void;
}
type P = { x: number; y: number };
export default function SnakeGame({ speed, paused, sessionKey, onStats }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null), pausedRef = useRef(paused), speedRef = useRef(speed), onStatsRef = useRef(onStats);
  useEffect(() => { pausedRef.current = paused; }, [paused]);
  useEffect(() => { speedRef.current = speed; }, [speed]);
  useEffect(() => { onStatsRef.current = onStats; }, [onStats]);
  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext('2d');
    if (!ctx) return;
    const size = 14, cols = 36, rows = 18, ox = (c.width - cols * size) / 2, oy = 14;
    let snake: P[] = [{ x: 8, y: 9 }, { x: 7, y: 9 }, { x: 6, y: 9 }], dir: P = { x: 1, y: 0 }, next = { ...dir }, food: P = { x: 22, y: 8 }, score = 0, errors = 0, last = performance.now(), raf = 0;
    const spawn = () => {
      do { food = { x: Math.floor(Math.random() * cols), y: Math.floor(Math.random() * rows) }; } while (snake.some(p => p.x === food.x && p.y === food.y));
    };
    const key = (e: KeyboardEvent) => {
      const m: Record<string, P> = { ArrowUp: { x: 0, y: -1 }, ArrowDown: { x: 0, y: 1 }, ArrowLeft: { x: -1, y: 0 }, ArrowRight: { x: 1, y: 0 } };
      const n = m[e.code];
      if (n && !(n.x === -dir.x && n.y === -dir.y)) { next = n; e.preventDefault(); }
    };
    window.addEventListener('keydown', key);
    const step = () => {
      dir = next;
      const h = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };
      const hit = h.x < 0 || h.x >= cols || h.y < 0 || h.y >= rows || snake.some(p => p.x === h.x && p.y === h.y);
      if (hit) {
        errors++;
        snake = [{ x: 8, y: 9 }, { x: 7, y: 9 }, { x: 6, y: 9 }];
        dir = { x: 1, y: 0 }; next = { ...dir }; onStatsRef.current(score, errors); return;
      }
      snake.unshift(h);
      if (h.x === food.x && h.y === food.y) { score++; spawn(); onStatsRef.current(score, errors); } else snake.pop();
    };
    const draw = (now: number) => {
      raf = requestAnimationFrame(draw);
      if (!pausedRef.current && now - last > Math.max(70, 230 - speedRef.current * 18)) { step(); last = now; }
      ctx.fillStyle = '#071022'; ctx.fillRect(0, 0, c.width, c.height);
      ctx.strokeStyle = 'rgba(116,241,255,.055)';
      for (let x = 0; x <= cols; x++) { ctx.beginPath(); ctx.moveTo(ox + x * size, oy); ctx.lineTo(ox + x * size, oy + rows * size); ctx.stroke(); }
      for (let y = 0; y <= rows; y++) { ctx.beginPath(); ctx.moveTo(ox, oy + y * size); ctx.lineTo(ox + cols * size, oy + y * size); ctx.stroke(); }
      snake.forEach((p, i) => { ctx.fillStyle = i === 0 ? '#74f1ff' : 'rgba(116,241,255,.58)'; ctx.fillRect(ox + p.x * size + 1, oy + p.y * size + 1, size - 2, size - 2); });
      ctx.fillStyle = '#ffbd7c'; ctx.beginPath(); ctx.arc(ox + food.x * size + size / 2, oy + food.y * size + size / 2, 5, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#aab7cf'; ctx.font = '13px system-ui'; ctx.fillText('Flechas para dirigir', 18, 25);
    };
    spawn(); draw(performance.now());
    return () => { cancelAnimationFrame(raf); window.removeEventListener('keydown', key); };
  }, [sessionKey]);
  return <canvas ref={canvasRef} width={760} height={280} className="game-canvas" aria-label="Snake FocusLab" />;
}
