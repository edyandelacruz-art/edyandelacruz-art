'use client';

import { useEffect, useRef } from 'react';
import { prepareHiDpiCanvas, GAME_WIDTH, GAME_HEIGHT } from '@/lib/canvasHiDpi';
import { createGameArt, drawGameArt } from '@/lib/gameArt';

interface Props { speed:number; paused:boolean; sessionKey:number; onStats:(score:number,collisions:number)=>void; }

export default function PongGame({ speed, paused, sessionKey, onStats }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const speedRef = useRef(speed), pausedRef = useRef(paused), onStatsRef = useRef(onStats);
  useEffect(()=>{speedRef.current=speed;},[speed]);
  useEffect(()=>{pausedRef.current=paused;},[paused]);
  useEffect(()=>{onStatsRef.current=onStats;},[onStats]);

  useEffect(()=>{
    const c=canvasRef.current;if(!c)return;const prepared=prepareHiDpiCanvas(c);if(!prepared)return;const {ctx}=prepared;const art=createGameArt('Pong');
    let py=105,score=0,misses=0,raf=0,frame=0;
    let ball={x:380,y:140,vx:3.2,vy:2.2};
    const clamp=(v:number,a:number,b:number)=>Math.max(a,Math.min(b,v));
    const key=(e:KeyboardEvent)=>{if(pausedRef.current)return;if(e.code==='ArrowUp'){py-=26;e.preventDefault();}if(e.code==='ArrowDown'){py+=26;e.preventDefault();}py=clamp(py,18,GAME_HEIGHT-88);};
    const pointer=(e:PointerEvent)=>{const r=c.getBoundingClientRect();py=clamp((e.clientY-r.top)*(GAME_HEIGHT/r.height)-35,18,GAME_HEIGHT-88);};
    window.addEventListener('keydown',key);c.addEventListener('pointermove',pointer);
    const reset=(dir=1)=>{ball={x:380,y:70+Math.random()*140,vx:(3+speedRef.current*.22)*dir,vy:(Math.random()>.5?1:-1)*(1.8+Math.random()*1.8)};};
    const rounded=(x:number,y:number,w:number,h:number,r:number,fill:string,shadow?:string)=>{ctx.save();if(shadow){ctx.shadowColor=shadow;ctx.shadowBlur=18;}ctx.fillStyle=fill;ctx.beginPath();ctx.roundRect(x,y,w,h,r);ctx.fill();ctx.restore();};
    const draw=()=>{raf=requestAnimationFrame(draw);frame+=pausedRef.current?0:1;const bg=ctx.createLinearGradient(0,0,0,GAME_HEIGHT);bg.addColorStop(0,'#102a5e');bg.addColorStop(.5,'#0b1b41');bg.addColorStop(1,'#050d20');ctx.fillStyle=bg;ctx.fillRect(0,0,GAME_WIDTH,GAME_HEIGHT);drawGameArt(ctx,art,GAME_WIDTH,GAME_HEIGHT,.96,.52);const halo=ctx.createRadialGradient(380,140,10,380,140,260);halo.addColorStop(0,'rgba(88,220,244,.12)');halo.addColorStop(1,'rgba(85,70,200,0)');ctx.fillStyle=halo;ctx.fillRect(0,0,GAME_WIDTH,GAME_HEIGHT);ctx.save();ctx.strokeStyle='rgba(102,225,245,.18)';ctx.lineWidth=2;ctx.beginPath();ctx.roundRect(48,32,GAME_WIDTH-96,GAME_HEIGHT-64,30);ctx.stroke();ctx.restore();ctx.setLineDash([8,12]);ctx.strokeStyle='rgba(190,220,255,.16)';ctx.beginPath();ctx.moveTo(GAME_WIDTH/2,44);ctx.lineTo(GAME_WIDTH/2,GAME_HEIGHT-44);ctx.stroke();ctx.setLineDash([]);for(let i=0;i<5;i+=1){ctx.strokeStyle='rgba(91,222,239,.055)';ctx.beginPath();ctx.arc(380,140,60+i*38,0,Math.PI*2);ctx.stroke();}
      if(!pausedRef.current){const m=.72+speedRef.current*.08;ball.x+=ball.vx*m;ball.y+=ball.vy*m;if(ball.y<42||ball.y>GAME_HEIGHT-42)ball.vy*=-1;const aiY=clamp(ball.y-35,18,GAME_HEIGHT-88);if(ball.x>GAME_WIDTH-70&&ball.x<GAME_WIDTH-42&&ball.y>aiY&&ball.y<aiY+70){ball.vx=-Math.abs(ball.vx);score++;onStatsRef.current(score,misses);}if(ball.x<70&&ball.x>42&&ball.y>py&&ball.y<py+70){ball.vx=Math.abs(ball.vx);score++;onStatsRef.current(score,misses);}if(ball.x<0){misses++;onStatsRef.current(score,misses);reset(1);}if(ball.x>GAME_WIDTH){reset(-1);}}
      rounded(52,py,13,72,7,'#66eff2','#66eff2');const ai=clamp(ball.y-35,18,GAME_HEIGHT-88);rounded(GAME_WIDTH-65,ai,13,72,7,'#a978ff','#a978ff');ctx.save();ctx.shadowColor='#fff';ctx.shadowBlur=22;const orb=ctx.createRadialGradient(ball.x-3,ball.y-4,1,ball.x,ball.y,10);orb.addColorStop(0,'#ffffff');orb.addColorStop(.55,'#9cf8ff');orb.addColorStop(1,'#5b7cff');ctx.fillStyle=orb;ctx.beginPath();ctx.arc(ball.x,ball.y,9,0,Math.PI*2);ctx.fill();ctx.restore();ctx.fillStyle='rgba(230,241,255,.8)';ctx.font='600 13px system-ui';ctx.fillText('SIGUE LA ESFERA · ↑ ↓ / PUNTERO',20,27);ctx.fillStyle='#7cecf3';ctx.font='800 12px system-ui';ctx.fillText(`RALLY ${score}`,20,48);ctx.fillStyle='#a98fff';ctx.fillText(`ERRORES ${misses}`,650,48);};
    reset();draw();return()=>{cancelAnimationFrame(raf);window.removeEventListener('keydown',key);c.removeEventListener('pointermove',pointer);};
  },[sessionKey]);

  return <canvas ref={canvasRef} width={760} height={280} className="game-canvas premium-game-canvas" aria-label="Pong FocusLab"/>;
}
