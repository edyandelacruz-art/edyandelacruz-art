'use client';
import { useEffect, useRef } from 'react';
interface RunnerGameProps {
  speed: number;
  paused: boolean;
  sessionKey: number;
  onStats: (score: number, collisions: number) => void;
}
export default function RunnerGame({
  speed,
  paused,
  sessionKey,
  onStats,
}: RunnerGameProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const statsRef = useRef({ score: 0, collisions: 0 });
  const jumpRef = useRef(false);
  const speedRef = useRef(speed);
  const pausedRef = useRef(paused);
  const onStatsRef = useRef(onStats);
  useEffect(() => {
    speedRef.current = speed;
  }, [speed]);
  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);
  useEffect(() => {
    onStatsRef.current = onStats;
  }, [onStats]);
  useEffect(() => {
    statsRef.current = { score: 0, collisions: 0 };
    onStatsRef.current(0, 0);
  }, [sessionKey]);
  useEffect(() => {
    const jump = () => {
      if (!pausedRef.current) jumpRef.current = true;
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.code === 'Space' || event.code === 'ArrowUp') {
        event.preventDefault();
        jump();
      }
    };
    const canvas = canvasRef.current;
    const onPointer = (event: PointerEvent) => {
      event.preventDefault();
      jump();
    };
    window.addEventListener('keydown', onKey);
    canvas?.addEventListener('pointerdown', onPointer);
    return () => {
      window.removeEventListener('keydown', onKey);
      canvas?.removeEventListener('pointerdown', onPointer);
    };
  }, []);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let frame = 0;
    let raf = 0;
    const ground = 238;
    const player = { x: 74, y: ground - 34, w: 34, h: 34, vy: 0 };
    let obstacle = { x: canvas.width + 80, y: ground - 42, w: 26, h: 42 };
    let lastHit = -1000;
    const draw = () => {
      raf = requestAnimationFrame(draw);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#111938');
      gradient.addColorStop(1, '#0a0f24');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = 'rgba(255,255,255,.14)';
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += 44) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      ctx.strokeStyle = 'rgba(113,233,255,.7)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, ground);
      ctx.lineTo(canvas.width, ground);
      ctx.stroke();
      if (!pausedRef.current) {
        frame += 1;
        if (jumpRef.current && player.y >= ground - player.h - 1) {
          player.vy = -10.2;
          jumpRef.current = false;
        }
        player.vy += 0.55;
        player.y += player.vy;
        if (player.y > ground - player.h) {
          player.y = ground - player.h;
          player.vy = 0;
        }
        obstacle.x -= speedRef.current;
        if (obstacle.x < -obstacle.w) {
          obstacle = { ...obstacle, x: canvas.width + 70 + Math.random() * 160 };
          statsRef.current.score += 1;
          onStatsRef.current(statsRef.current.score, statsRef.current.collisions);
        }
        const hit =
          player.x < obstacle.x + obstacle.w &&
          player.x + player.w > obstacle.x &&
          player.y < obstacle.y + obstacle.h &&
          player.y + player.h > obstacle.y;
        if (hit && frame - lastHit > 50) {
          statsRef.current.collisions += 1;
          lastHit = frame;
          onStatsRef.current(statsRef.current.score, statsRef.current.collisions);
        }
      }
      ctx.shadowColor = 'rgba(109,223,255,.9)';
      ctx.shadowBlur = 18;
      ctx.fillStyle = '#7fe8ff';
      ctx.fillRect(player.x, player.y, player.w, player.h);
      ctx.shadowBlur = 0;
      ctx.fillStyle = '#ffbb7a';
      ctx.fillRect(obstacle.x, obstacle.y, obstacle.w, obstacle.h);
      ctx.fillStyle = 'rgba(255,255,255,.74)';
      ctx.font = '14px system-ui';
      ctx.fillText('ESPACIO / ↑ / TOQUE para saltar', 18, 26);
    };
    draw();
    return () => cancelAnimationFrame(raf);
  }, [sessionKey]);
  return (
    <canvas
      ref={canvasRef}
      width={760}
      height={280}
      className="game-canvas"
      aria-label="Juego runner: pulsa espacio, flecha arriba o toca para saltar"
    />
  );
}
