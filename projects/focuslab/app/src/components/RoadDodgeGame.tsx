'use client';
import { useEffect, useRef } from 'react';
interface Props {
  speed: number;
  paused: boolean;
  sessionKey: number;
  onStats: (score: number, collisions: number) => void;
}
export default function RoadDodgeGame({ speed, paused, sessionKey, onStats }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const speedRef = useRef(speed), pausedRef = useRef(paused), statsRef = useRef({ score: 0, collisions: 0 }), onStatsRef = useRef(onStats);
  useEffect(() => { speedRef.current = speed; }, [speed]);
  useEffect(() => { pausedRef.current = paused; }, [paused]);
  useEffect(() => { onStatsRef.current = onStats; }, [onStats]);
  useEffect(() => { statsRef.current = { score: 0, collisions: 0 }; onStatsRef.current(0, 0); }, [sessionKey]);
  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext('2d');
    if (!ctx) return;
    let lane = 1, raf = 0, lastHit = -999, frame = 0;
    const lanes = [270, 380, 490];
    let obs = [{ lane: 0, y: -70 }, { lane: 2, y: -260 }];
    const key = (e: KeyboardEvent) => {
      if (pausedRef.current) return;
      if (e.code === 'ArrowLeft') { lane = Math.max(0, lane - 1); e.preventDefault(); }
      if (e.code === 'ArrowRight') { lane = Math.min(2, lane + 1); e.preventDefault(); }
    };
    window.addEventListener('keydown', key);
    const pointer = (e: PointerEvent) => {
      if (pausedRef.current) return;
      const r = c.getBoundingClientRect();
      lane = e.clientX - r.left < r.width / 2 ? Math.max(0, lane - 1) : Math.min(2, lane + 1);
    };
    c.addEventListener('pointerdown', pointer);
    const draw = () => {
      raf = requestAnimationFrame(draw);
      ctx.fillStyle = '#07101d'; ctx.fillRect(0, 0, c.width, c.height);
      ctx.fillStyle = '#111a2f'; ctx.fillRect(220, 0, 320, c.height);
      ctx.strokeStyle = 'rgba(255,255,255,.16)'; ctx.setLineDash([16, 14]);
      for (const x of [326, 434]) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, c.height); ctx.stroke(); }
      ctx.setLineDash([]);
      if (!pausedRef.current) {
        frame++;
        obs.forEach(o => (o.y += 2.1 + speedRef.current * 0.48));
        obs.forEach(o => {
          if (o.y > c.height + 50) {
            o.y = -80 - Math.random() * 180;
            o.lane = Math.floor(Math.random() * 3);
            statsRef.current.score++;
            onStatsRef.current(statsRef.current.score, statsRef.current.collisions);
          }
        });
        const py = 215;
        obs.forEach(o => {
          if (o.lane === lane && o.y + 48 > py && o.y < py + 52 && frame - lastHit > 45) {
            statsRef.current.collisions++;
            lastHit = frame;
            onStatsRef.current(statsRef.current.score, statsRef.current.collisions);
          }
        });
      }
      ctx.shadowColor = '#74f1ff'; ctx.shadowBlur = 16; ctx.fillStyle = '#74f1ff'; ctx.fillRect(lanes[lane] - 18, 215, 36, 52); ctx.shadowBlur = 0;
      ctx.fillStyle = '#ff8da6'; obs.forEach(o => ctx.fillRect(lanes[o.lane] - 19, o.y, 38, 48));
      ctx.fillStyle = '#aab7cf'; ctx.font = '13px system-ui'; ctx.fillText('← → / toca izquierda o derecha', 18, 26);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener('keydown', key); c.removeEventListener('pointerdown', pointer); };
  }, [sessionKey]);
  return <canvas ref={canvasRef} width={760} height={280} className="game-canvas" aria-label="Road Dodge FocusLab" />;
}
