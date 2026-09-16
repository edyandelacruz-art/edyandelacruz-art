'use client';

import { useEffect, useRef } from 'react';
import { prepareHiDpiCanvas, GAME_WIDTH, GAME_HEIGHT } from '@/lib/canvasHiDpi';
import { createGameArt, drawGameArt } from '@/lib/gameArt';

type P={x:number;y:number};
interface Props { speed:number; paused:boolean; sessionKey:number; onStats:(score:number,collisions:number)=>void; }

export default function SnakeGame({ speed, paused, sessionKey, onStats }: Props) {
  const canvasRef=useRef<HTMLCanvasElement|null>(null),pausedRef=useRef(paused),speedRef=useRef(speed),onStatsRef=useRef(onStats);
  useEffect(()=>{pausedRef.current=paused;},[paused]);useEffect(()=>{speedRef.current=speed;},[speed]);useEffect(()=>{onStatsRef.current=onStats;},[onStats]);

  useEffect(()=>{
    const c=canvasRef.current;if(!c)return;const prepared=prepareHiDpiCanvas(c);if(!prepared)return;const {ctx}=prepared;const art=createGameArt('Snake');
    const size=16,cols=34,rows=15,ox=(GAME_WIDTH-cols*size)/2,oy=30;
    let snake:P[]=[{x:8,y:8},{x:7,y:8},{x:6,y:8}],dir:P={x:1,y:0},next={...dir},food:P={x:22,y:8},score=0,errors=0,last=performance.now(),raf=0;
    const spawn=()=>{do{food={x:Math.floor(Math.random()*cols),y:Math.floor(Math.random()*rows)};}while(snake.some(p=>p.x===food.x&&p.y===food.y));};
    const key=(e:KeyboardEvent)=>{const m:Record<string,P>={ArrowUp:{x:0,y:-1},ArrowDown:{x:0,y:1},ArrowLeft:{x:-1,y:0},ArrowRight:{x:1,y:0}};const n=m[e.code];if(n&&!(n.x===-dir.x&&n.y===-dir.y)){next=n;e.preventDefault();}};
    window.addEventListener('keydown',key);
    const step=()=>{dir=next;const h={x:snake[0].x+dir.x,y:snake[0].y+dir.y};const hit=h.x<0||h.x>=cols||h.y<0||h.y>=rows||snake.some(p=>p.x===h.x&&p.y===h.y);if(hit){errors++;snake=[{x:8,y:8},{x:7,y:8},{x:6,y:8}];dir={x:1,y:0};next={...dir};onStatsRef.current(score,errors);return;}snake.unshift(h);if(h.x===food.x&&h.y===food.y){score++;spawn();onStatsRef.current(score,errors);}else snake.pop();};
    const draw=(now:number)=>{raf=requestAnimationFrame(draw);if(!pausedRef.current&&now-last>Math.max(70,230-speedRef.current*18)){step();last=now;}const bg=ctx.createLinearGradient(0,0,0,GAME_HEIGHT);bg.addColorStop(0,'#112958');bg.addColorStop(1,'#061027');ctx.fillStyle=bg;ctx.fillRect(0,0,GAME_WIDTH,GAME_HEIGHT);drawGameArt(ctx,art,GAME_WIDTH,GAME_HEIGHT,.92,.5);ctx.save();ctx.shadowColor='rgba(0,0,0,.55)';ctx.shadowBlur=28;ctx.fillStyle='rgba(5,16,38,.72)';ctx.beginPath();ctx.roundRect(ox-20,oy-18,cols*size+40,rows*size+36,28);ctx.fill();ctx.restore();ctx.strokeStyle='rgba(96,226,241,.06)';for(let x=0;x<=cols;x++){ctx.beginPath();ctx.moveTo(ox+x*size,oy);ctx.lineTo(ox+x*size,oy+rows*size);ctx.stroke();}for(let y=0;y<=rows;y++){ctx.beginPath();ctx.moveTo(ox,oy+y*size);ctx.lineTo(ox+cols*size,oy+y*size);ctx.stroke();}snake.forEach((p,i)=>{ctx.save();ctx.shadowColor=i===0?'#8afff0':'#57d9ca';ctx.shadowBlur=i===0?18:8;const g=ctx.createLinearGradient(ox+p.x*size,oy+p.y*size,ox+(p.x+1)*size,oy+(p.y+1)*size);g.addColorStop(0,i===0?'#a2fff1':'#62e6bf');g.addColorStop(1,i===0?'#55a8ff':'#33aeb8');ctx.fillStyle=g;ctx.beginPath();ctx.roundRect(ox+p.x*size+1,oy+p.y*size+1,size-2,size-2,5);ctx.fill();ctx.restore();});ctx.save();ctx.shadowColor='#ff668c';ctx.shadowBlur=20;const fruit=ctx.createRadialGradient(ox+food.x*size+size/2-2,oy+food.y*size+size/2-2,1,ox+food.x*size+size/2,oy+food.y*size+size/2,7);fruit.addColorStop(0,'#fff0d7');fruit.addColorStop(.4,'#ff9a74');fruit.addColorStop(1,'#f04478');ctx.fillStyle=fruit;ctx.beginPath();ctx.arc(ox+food.x*size+size/2,oy+food.y*size+size/2,7,0,Math.PI*2);ctx.fill();ctx.restore();ctx.fillStyle='rgba(233,244,255,.8)';ctx.font='600 13px system-ui';ctx.fillText('DIRIGE · FLECHAS',20,27);ctx.fillStyle='#6fe8c7';ctx.font='800 12px system-ui';ctx.fillText(`RECOLECTADOS ${score}`,20,48);ctx.fillStyle='#ff8aa5';ctx.fillText(`CHOQUES ${errors}`,650,48);};
    spawn();draw(performance.now());return()=>{cancelAnimationFrame(raf);window.removeEventListener('keydown',key);};
  },[sessionKey]);

  return <canvas ref={canvasRef} width={760} height={280} className="game-canvas premium-game-canvas" aria-label="Snake FocusLab"/>;
}
