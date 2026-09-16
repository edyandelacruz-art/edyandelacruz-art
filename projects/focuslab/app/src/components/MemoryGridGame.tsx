'use client';

import { useEffect, useRef } from 'react';

interface Props { speed:number; paused:boolean; sessionKey:number; onStats:(score:number,collisions:number)=>void; }

export default function MemoryGridGame({ speed, paused, sessionKey, onStats }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null), pausedRef = useRef(paused), onStatsRef = useRef(onStats);
  useEffect(()=>{pausedRef.current=paused;},[paused]);
  useEffect(()=>{onStatsRef.current=onStats;},[onStats]);

  useEffect(()=>{
    const c=canvasRef.current;if(!c)return;const ctx=c.getContext('2d');if(!ctx)return;
    const n=4,size=46,gap=12,boardW=n*size+(n-1)*gap,ox=c.width/2-boardW/2,oy=48;
    let targets=new Set<number>(),chosen=new Set<number>(),show=true,score=0,errors=0,roundStart=performance.now(),raf=0;
    const newRound=()=>{targets=new Set();chosen=new Set();while(targets.size<4)targets.add(Math.floor(Math.random()*16));show=true;roundStart=performance.now();};
    const click=(e:PointerEvent)=>{if(pausedRef.current||show)return;const r=c.getBoundingClientRect();const x=(e.clientX-r.left)*(c.width/r.width),y=(e.clientY-r.top)*(c.height/r.height);const col=Math.floor((x-ox)/(size+gap)),row=Math.floor((y-oy)/(size+gap));if(col<0||col>=n||row<0||row>=n)return;const id=row*n+col;if(chosen.has(id))return;chosen.add(id);if(targets.has(id)){score++;onStatsRef.current(score,errors);}else{errors++;onStatsRef.current(score,errors);}if(chosen.size>=4)setTimeout(newRound,350);};
    c.addEventListener('pointerdown',click);

    const tile=(x:number,y:number,active:boolean,good:boolean,bad:boolean)=>{ctx.save();ctx.shadowColor=active?'#69edf3':good?'#67efba':bad?'#ff6f91':'rgba(0,0,0,0)';ctx.shadowBlur=active||good||bad?18:0;const g=ctx.createLinearGradient(x,y,x+size,y+size);if(active){g.addColorStop(0,'#78f5ef');g.addColorStop(1,'#7a58f6');}else if(good){g.addColorStop(0,'#72efbe');g.addColorStop(1,'#34b9b9');}else if(bad){g.addColorStop(0,'#ff9b85');g.addColorStop(1,'#cb416f');}else{g.addColorStop(0,'#173460');g.addColorStop(1,'#0b1d3f');}ctx.fillStyle=g;ctx.beginPath();ctx.roundRect(x,y,size,size,12);ctx.fill();ctx.strokeStyle=active?'rgba(220,255,255,.65)':'rgba(121,165,225,.18)';ctx.stroke();ctx.fillStyle='rgba(255,255,255,.1)';ctx.beginPath();ctx.roundRect(x+5,y+5,size-10,8,4);ctx.fill();ctx.restore();};

    const draw=(now:number)=>{raf=requestAnimationFrame(draw);if(!pausedRef.current&&show&&now-roundStart>Math.max(520,1250-speed*70))show=false;const bg=ctx.createLinearGradient(0,0,0,c.height);bg.addColorStop(0,'#122a59');bg.addColorStop(1,'#061127');ctx.fillStyle=bg;ctx.fillRect(0,0,c.width,c.height);const halo=ctx.createRadialGradient(c.width/2,150,20,c.width/2,150,220);halo.addColorStop(0,'rgba(91,225,243,.13)');halo.addColorStop(1,'rgba(50,53,156,0)');ctx.fillStyle=halo;ctx.fillRect(100,0,560,280);ctx.save();ctx.shadowColor='rgba(0,0,0,.6)';ctx.shadowBlur=30;ctx.fillStyle='rgba(6,17,39,.82)';ctx.beginPath();ctx.roundRect(ox-24,oy-24,boardW+48,boardW+48,30);ctx.fill();ctx.restore();for(let i=0;i<16;i+=1){const row=Math.floor(i/n),col=i%n,x=ox+col*(size+gap),y=oy+row*(size+gap);const isTarget=targets.has(i),isChosen=chosen.has(i);tile(x,y,show&&isTarget,isChosen&&isTarget,isChosen&&!isTarget);}ctx.fillStyle='rgba(238,248,255,.9)';ctx.font='800 16px system-ui';ctx.fillText(show?'OBSERVA':'REPITE',20,29);ctx.fillStyle='#85a5d3';ctx.font='600 11px system-ui';ctx.fillText(show?'Memoriza las celdas iluminadas':'Toca las 4 celdas que recuerdas',20,47);ctx.fillStyle='#72edf2';ctx.font='800 12px system-ui';ctx.fillText(`ACIERTOS ${score}`,650,29);};

    newRound();draw(performance.now());return()=>{cancelAnimationFrame(raf);c.removeEventListener('pointerdown',click);};
  },[sessionKey,speed]);

  return <canvas ref={canvasRef} width={760} height={280} className="game-canvas premium-game-canvas" aria-label="Memory Grid FocusLab"/>;
}
