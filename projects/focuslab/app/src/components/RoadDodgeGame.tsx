'use client';

import { useEffect, useRef } from 'react';

interface Props { speed:number; paused:boolean; sessionKey:number; onStats:(score:number,collisions:number)=>void; }

export default function RoadDodgeGame({ speed, paused, sessionKey, onStats }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const speedRef = useRef(speed), pausedRef = useRef(paused), statsRef = useRef({ score: 0, collisions: 0 }), onStatsRef = useRef(onStats);
  useEffect(() => { speedRef.current = speed; }, [speed]);
  useEffect(() => { pausedRef.current = paused; }, [paused]);
  useEffect(() => { onStatsRef.current = onStats; }, [onStats]);
  useEffect(() => { statsRef.current = { score: 0, collisions: 0 }; onStatsRef.current(0,0); }, [sessionKey]);

  useEffect(() => {
    const c = canvasRef.current; if (!c) return; const ctx = c.getContext('2d'); if (!ctx) return;
    let lane = 1, raf = 0, lastHit = -999, frame = 0;
    const laneXs = [300, 380, 460];
    let obstacles = [{ lane: 0, y: -70 }, { lane: 2, y: -280 }];
    const key = (event: KeyboardEvent) => { if (pausedRef.current) return; if (event.code === 'ArrowLeft') { lane = Math.max(0,lane-1); event.preventDefault(); } if (event.code === 'ArrowRight') { lane = Math.min(2,lane+1); event.preventDefault(); } };
    const pointer = (event: PointerEvent) => { if (pausedRef.current) return; const r = c.getBoundingClientRect(); lane = event.clientX-r.left < r.width/2 ? Math.max(0,lane-1) : Math.min(2,lane+1); };
    window.addEventListener('keydown', key); c.addEventListener('pointerdown', pointer);

    const car = (x:number,y:number,w:number,h:number,colorA:string,colorB:string) => {
      ctx.save(); ctx.shadowColor = colorA; ctx.shadowBlur = 18;
      const g = ctx.createLinearGradient(x,y,x+w,y+h); g.addColorStop(0,colorA); g.addColorStop(1,colorB); ctx.fillStyle = g;
      ctx.beginPath(); ctx.roundRect(x,y,w,h,10); ctx.fill();
      ctx.fillStyle = 'rgba(222,249,255,.72)'; ctx.beginPath(); ctx.roundRect(x+7,y+8,w-14,13,5); ctx.fill();
      ctx.fillStyle = '#081225'; ctx.fillRect(x-3,y+13,5,14); ctx.fillRect(x+w-2,y+13,5,14); ctx.fillRect(x-3,y+h-20,5,14); ctx.fillRect(x+w-2,y+h-20,5,14);
      ctx.restore();
    };

    const draw = () => {
      raf = requestAnimationFrame(draw);
      const bg = ctx.createLinearGradient(0,0,0,c.height); bg.addColorStop(0,'#172c5c'); bg.addColorStop(.38,'#0b1d43'); bg.addColorStop(1,'#060f24'); ctx.fillStyle = bg; ctx.fillRect(0,0,c.width,c.height);
      const glow = ctx.createRadialGradient(380,48,4,380,48,150); glow.addColorStop(0,'rgba(105,234,244,.42)'); glow.addColorStop(1,'rgba(69,84,177,0)'); ctx.fillStyle=glow;ctx.fillRect(210,0,340,160);
      ctx.fillStyle='#0a1f3d';ctx.fillRect(0,70,c.width,210);
      for(let i=0;i<9;i+=1){const x=i*95-(frame*speedRef.current*.45)%95;ctx.fillStyle=i%2?'#173d67':'#112f55';ctx.fillRect(x,92,22,100);ctx.fillStyle='rgba(89,224,238,.5)';ctx.fillRect(x+7,106,8,18);}

      ctx.beginPath();ctx.moveTo(318,60);ctx.lineTo(520,280);ctx.lineTo(240,280);ctx.closePath();const road=ctx.createLinearGradient(0,60,0,280);road.addColorStop(0,'#1a2541');road.addColorStop(1,'#090f20');ctx.fillStyle=road;ctx.fill();ctx.strokeStyle='rgba(91,235,241,.7)';ctx.lineWidth=2;ctx.stroke();
      for(let i=0;i<12;i+=1){const p=((i*34+(frame*speedRef.current*2.6))%260)/260;const y=70+p*220;const spread=14+p*100;const h=4+p*9;ctx.fillStyle='rgba(237,249,255,.8)';ctx.fillRect(380-spread/3,y,3+p*4,h);ctx.fillRect(380+spread/3,y,3+p*4,h);}
      for(let i=0;i<7;i+=1){const y=86+i*36;const spread=80+i*31;ctx.fillStyle='rgba(92,231,240,.22)';ctx.fillRect(380-spread,y,8,18);ctx.fillRect(380+spread-8,y,8,18);}

      if(!pausedRef.current){frame+=1;obstacles.forEach(o=>o.y+=2.2+speedRef.current*.5);obstacles.forEach(o=>{if(o.y>c.height+60){o.y=-100-Math.random()*180;o.lane=Math.floor(Math.random()*3);statsRef.current.score++;onStatsRef.current(statsRef.current.score,statsRef.current.collisions);}});const py=205;obstacles.forEach(o=>{if(o.lane===lane&&o.y+48>py&&o.y<py+58&&frame-lastHit>48){statsRef.current.collisions++;lastHit=frame;onStatsRef.current(statsRef.current.score,statsRef.current.collisions);}});}

      obstacles.forEach(o=>{const scale=Math.max(.48,Math.min(1,(o.y+120)/310));const x=laneXs[o.lane]-18*scale;car(x,o.y,36*scale,48*scale,'#ff9a70','#c94169');});
      car(laneXs[lane]-23,205,46,62,'#66f2ee','#6048e8');
      ctx.fillStyle='rgba(229,241,255,.8)';ctx.font='600 13px system-ui';ctx.fillText('CAMBIA DE CARRIL · ← → / TOQUE',20,27);ctx.fillStyle='#79eef3';ctx.font='800 12px system-ui';ctx.fillText(`DISTANCIA ${statsRef.current.score}`,20,48);
    };
    draw();
    return()=>{cancelAnimationFrame(raf);window.removeEventListener('keydown',key);c.removeEventListener('pointerdown',pointer);};
  },[sessionKey]);

  return <canvas ref={canvasRef} width={760} height={280} className="game-canvas premium-game-canvas" aria-label="Road Dodge FocusLab"/>;
}
