'use client';
import { useEffect, useRef } from 'react';
interface Props {
  speed: number;
  paused: boolean;
  sessionKey: number;
  onStats: (score: number, collisions: number) => void;
}
type Cell = 0 | 1;
type Piece = { x: number; y: number; shape: number[][] };
const SHAPES = [
  [[1, 1, 1, 1]],
  [[1, 1], [1, 1]],
  [[0, 1, 0], [1, 1, 1]],
  [[1, 0, 0], [1, 1, 1]],
  [[0, 0, 1], [1, 1, 1]],
  [[0, 1, 1], [1, 1, 0]],
  [[1, 1, 0], [0, 1, 1]],
];
export default function TetrisGame({ speed, paused, sessionKey, onStats }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const speedRef = useRef(speed);
  const pausedRef = useRef(paused);
  const onStatsRef = useRef(onStats);
  useEffect(() => { speedRef.current = speed; }, [speed]);
  useEffect(() => { pausedRef.current = paused; }, [paused]);
  useEffect(() => { onStatsRef.current = onStats; }, [onStats]);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const cols = 10, rows = 16, cell = 17, ox = canvas.width / 2 - (cols * cell) / 2, oy = 8;
    let board: Cell[][] = Array.from({ length: rows }, () => Array(cols).fill(0) as Cell[]);
    let score = 0, collisions = 0, last = performance.now(), raf = 0;
    const spawn = (): Piece => ({ x: 3, y: 0, shape: SHAPES[Math.floor(Math.random() * SHAPES.length)].map(r => [...r]) });
    let piece = spawn();
    const valid = (p: Piece, nx = p.x, ny = p.y, shape = p.shape) => shape.every((r, yy) => r.every((v, xx) => !v || (nx + xx >= 0 && nx + xx < cols && ny + yy < rows && (ny + yy < 0 || board[ny + yy][nx + xx] === 0))));
    const rotate = (s: number[][]) => s[0].map((_, i) => s.map(r => r[i]).reverse());
    const lock = () => {
      piece.shape.forEach((r, yy) => r.forEach((v, xx) => { if (v && piece.y + yy >= 0) board[piece.y + yy][piece.x + xx] = 1; }));
      const before = board.length;
      board = board.filter(r => r.some(v => !v));
      const cleared = before - board.length;
      while (board.length < rows) board.unshift(Array(cols).fill(0) as Cell[]);
      if (cleared) { score += cleared * 10; onStatsRef.current(score, collisions); }
      piece = spawn();
      if (!valid(piece)) {
        collisions++;
        board = Array.from({ length: rows }, () => Array(cols).fill(0) as Cell[]);
        onStatsRef.current(score, collisions);
      }
    };
    const drop = () => { if (valid(piece, piece.x, piece.y + 1)) piece.y++; else lock(); };
    const key = (e: KeyboardEvent) => {
      if (pausedRef.current) return;
      if (['ArrowLeft', 'ArrowRight', 'ArrowDown', 'ArrowUp', 'Space'].includes(e.code)) e.preventDefault();
      if (e.code === 'ArrowLeft' && valid(piece, piece.x - 1)) piece.x--;
      if (e.code === 'ArrowRight' && valid(piece, piece.x + 1)) piece.x++;
      if (e.code === 'ArrowDown') drop();
      if (e.code === 'ArrowUp' || e.code === 'Space') { const r = rotate(piece.shape); if (valid(piece, piece.x, piece.y, r)) piece.shape = r; }
    };
    window.addEventListener('keydown', key);
    const draw = (now: number) => {
      raf = requestAnimationFrame(draw);
      if (!pausedRef.current && now - last > Math.max(150, 720 - speedRef.current * 70)) { drop(); last = now; }
      ctx.fillStyle = '#081022'; ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = 'rgba(116,241,255,.08)';
      for (let x = 0; x <= cols; x++) { ctx.beginPath(); ctx.moveTo(ox + x * cell, oy); ctx.lineTo(ox + x * cell, oy + rows * cell); ctx.stroke(); }
      for (let y = 0; y <= rows; y++) { ctx.beginPath(); ctx.moveTo(ox, oy + y * cell); ctx.lineTo(ox + cols * cell, oy + y * cell); ctx.stroke(); }
      const paint = (x: number, y: number, a = 0.95) => { ctx.fillStyle = `rgba(116,241,255,${a})`; ctx.fillRect(ox + x * cell + 1, oy + y * cell + 1, cell - 2, cell - 2); };
      board.forEach((r, y) => r.forEach((v, x) => v && paint(x, y, 0.52)));
      piece.shape.forEach((r, yy) => r.forEach((v, xx) => v && paint(piece.x + xx, piece.y + yy)));
      ctx.fillStyle = '#aab7cf'; ctx.font = '13px system-ui'; ctx.fillText('← → mover · ↑ rotar · ↓ bajar', 18, 26);
    };
    raf = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('keydown', key); };
  }, [sessionKey]);
  return <canvas ref={canvasRef} width={760} height={280} className="game-canvas" aria-label="Tetris FocusLab" />;
}
