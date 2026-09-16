'use client';

import { useEffect, useRef } from 'react';
import { prepareHiDpiCanvas, GAME_WIDTH, GAME_HEIGHT } from '@/lib/canvasHiDpi';
import { createGameArt, drawGameArt } from '@/lib/gameArt';

interface RunnerGameProps {
  speed: number;
  paused: boolean;
  sessionKey: number;
  onStats: (score: number, collisions: number) => void;
}

export default function RunnerGame({ speed, paused, sessionKey, onStats }: RunnerGameProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const statsRef = useRef({ score: 0, collisions: 0 });
  const jumpRef = useRef(false);
  const speedRef = useRef(speed);
  const pausedRef = useRef(paused);
  const onStatsRef = useRef(onStats);

  useEffect(() => { speedRef.current = speed; }, [speed]);
  useEffect(() => { pausedRef.current = paused; }, [paused]);
  useEffect(() => { onStatsRef.current = onStats; }, [onStats]);
  useEffect(() => { statsRef.current = { score: 0, collisions: 0 }; onStatsRef.current(0, 0); }, [sessionKey]);

  useEffect(() => {
    const jump = () => { if (!pausedRef.current) jumpRef.current = true; };
    const onKey = (event: KeyboardEvent) => {
      if (event.code === 'Space' || event.code === 'ArrowUp') { event.preventDefault(); jump(); }
    };
    const canvas = canvasRef.current;
    const onPointer = (event: PointerEvent) => { event.preventDefault(); jump(); };
    window.addEventListener('keydown', onKey);
    canvas?.addEventListener('pointerdown', onPointer);
    return () => { window.removeEventListener('keydown', onKey); canvas?.removeEventListener('pointerdown', onPointer); };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const prepared = prepareHiDpiCanvas(canvas);
    if (!prepared) return;
    const { ctx } = prepared;
    const art = createGameArt('Runner');

    let frame = 0;
    let raf = 0;
    const ground = 224;
    const player = { x: 112, y: ground - 62, w: 42, h: 62, vy: 0 };
    let obstacle = { x: GAME_WIDTH + 120, y: ground - 48, w: 34, h: 48 };
    let lastHit = -1000;

    const rounded = (x: number, y: number, w: number, h: number, r: number) => {
      ctx.beginPath(); ctx.roundRect(x, y, w, h, r); ctx.fill();
    };

    const draw = () => {
      raf = requestAnimationFrame(draw);
      ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

      const sky = ctx.createLinearGradient(0, 0, 0, GAME_HEIGHT);
      sky.addColorStop(0, '#132d63'); sky.addColorStop(.52, '#0d1d44'); sky.addColorStop(1, '#071329');
      ctx.fillStyle = sky; ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

      const moon = ctx.createRadialGradient(620, 48, 4, 620, 48, 62);
      moon.addColorStop(0, '#efffff'); moon.addColorStop(.28, '#79dff7'); moon.addColorStop(1, 'rgba(87,118,221,0)');
      ctx.fillStyle = moon; ctx.beginPath(); ctx.arc(620, 48, 62, 0, Math.PI * 2); ctx.fill();

      const parallax = (frame * speedRef.current * .22) % 760;
      ctx.fillStyle = '#102f5a';
      for (let i = -1; i < 4; i += 1) {
        const x = i * 290 - parallax * .28;
        ctx.beginPath(); ctx.moveTo(x, ground); ctx.quadraticCurveTo(x + 110, 120, x + 250, ground); ctx.closePath(); ctx.fill();
      }
      ctx.fillStyle = '#0a2347';
      for (let i = -1; i < 5; i += 1) {
        const x = i * 220 - parallax * .52;
        ctx.beginPath(); ctx.moveTo(x, ground); ctx.quadraticCurveTo(x + 80, 155, x + 190, ground); ctx.closePath(); ctx.fill();
      }

      ctx.fillStyle = '#081833'; ctx.fillRect(0, ground, GAME_WIDTH, GAME_HEIGHT - ground);
      const floorGlow = ctx.createLinearGradient(0, ground - 6, 0, ground + 26);
      floorGlow.addColorStop(0, 'rgba(95,240,247,.85)'); floorGlow.addColorStop(.15, 'rgba(95,240,247,.12)'); floorGlow.addColorStop(1, 'rgba(95,240,247,0)');
      ctx.fillStyle = floorGlow; ctx.fillRect(0, ground - 6, GAME_WIDTH, 32);
      ctx.fillStyle = '#71eff5'; ctx.fillRect(0, ground - 2, GAME_WIDTH, 3);

      for (let x = -((frame * speedRef.current * 2) % 78); x < GAME_WIDTH; x += 78) {
        ctx.fillStyle = 'rgba(95,136,210,.12)'; ctx.fillRect(x, ground + 22, 46, 3);
      }

      drawGameArt(ctx, art, GAME_WIDTH, GAME_HEIGHT, 1, 0.34);

      if (!pausedRef.current) {
        frame += 1;
        if (jumpRef.current && player.y >= ground - player.h - 1) { player.vy = -11; jumpRef.current = false; }
        player.vy += .58; player.y += player.vy;
        if (player.y > ground - player.h) { player.y = ground - player.h; player.vy = 0; }
        obstacle.x -= speedRef.current * 1.22;
        if (obstacle.x < -obstacle.w) {
          obstacle = { ...obstacle, x: GAME_WIDTH + 100 + Math.random() * 180 };
          statsRef.current.score += 1; onStatsRef.current(statsRef.current.score, statsRef.current.collisions);
        }
        const hit = player.x < obstacle.x + obstacle.w && player.x + player.w > obstacle.x && player.y < obstacle.y + obstacle.h && player.y + player.h > obstacle.y;
        if (hit && frame - lastHit > 55) { statsRef.current.collisions += 1; lastHit = frame; onStatsRef.current(statsRef.current.score, statsRef.current.collisions); }
      }

      ctx.save(); ctx.globalAlpha = .28; ctx.fillStyle = '#000'; ctx.beginPath(); ctx.ellipse(player.x + 23, ground + 3, 31, 7, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore();
      ctx.save(); ctx.shadowColor = '#5debf1'; ctx.shadowBlur = 22;
      const suit = ctx.createLinearGradient(player.x, player.y, player.x + player.w, player.y + player.h);
      suit.addColorStop(0, '#75f5ef'); suit.addColorStop(.55, '#5888ff'); suit.addColorStop(1, '#8a5bf5');
      ctx.fillStyle = suit; rounded(player.x + 9, player.y + 20, 26, 34, 12);
      ctx.fillStyle = '#dffcff'; ctx.beginPath(); ctx.arc(player.x + 22, player.y + 13, 12, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#183b75'; ctx.beginPath(); ctx.arc(player.x + 22, player.y + 14, 7, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = '#74eef5'; ctx.lineWidth = 5; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(player.x + 14, player.y + 49); ctx.lineTo(player.x + 6, player.y + 60); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(player.x + 30, player.y + 49); ctx.lineTo(player.x + 39, player.y + 59); ctx.stroke();
      ctx.restore();

      ctx.save(); ctx.shadowColor = '#ff7f91'; ctx.shadowBlur = 18;
      const block = ctx.createLinearGradient(obstacle.x, obstacle.y, obstacle.x + obstacle.w, obstacle.y + obstacle.h);
      block.addColorStop(0, '#ffbd72'); block.addColorStop(.45, '#ff767f'); block.addColorStop(1, '#8f426e');
      ctx.fillStyle = block; rounded(obstacle.x, obstacle.y, obstacle.w, obstacle.h, 8);
      ctx.fillStyle = 'rgba(255,255,255,.3)'; rounded(obstacle.x + 5, obstacle.y + 5, obstacle.w - 10, 6, 3); ctx.restore();

      ctx.fillStyle = 'rgba(224,238,255,.78)'; ctx.font = '600 13px system-ui'; ctx.fillText('SALTA · ESPACIO / ↑ / TOQUE', 20, 27);
      ctx.fillStyle = 'rgba(104,241,244,.9)'; ctx.font = '800 12px system-ui'; ctx.fillText(`RACHA ${statsRef.current.score}`, 20, 48);
    };

    draw();
    return () => cancelAnimationFrame(raf);
  }, [sessionKey]);

  return <canvas ref={canvasRef} width={760} height={280} className="game-canvas premium-game-canvas" aria-label="Runner FocusLab" />;
}
