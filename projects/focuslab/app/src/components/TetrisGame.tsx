'use client';

import { useEffect, useRef } from 'react';

interface Props { speed:number; paused:boolean; sessionKey:number; onStats:(score:number,collisions:number)=>void; }
type Cell = 0 | 1;
type Piece = { x:number; y:number; shape:number[][] };
const SHAPES=[[[1,1,1,1]],[[1,1],[1,1]],[[0,1,0],[1,1,1]],[[1,0,0],[1,1,1]],[[0,0,1],[1,1,1]],[[0,1,1],[1,1,0]],[[1,1,0],[0,1,1]]];

export default function TetrisGame({ speed, paused, sessionKey, onStats }: Props) {
  const canvasRef=useRef<HTMLCanvasElement|null>(null),speedRef=useRef(speed),pausedRef=useRef(paused),onStatsRef=useRef(onStats);
  useEffect(()=>{speedRef.current=speed;},[speed]);useEffect(()=>{pausedRef.current=paused;},[paused]);useEffect(()=>{onStatsRef.current=onStats;},[onStats]);

  useEffect(()=>{
    const canvas=canvasRef.current;if(!canvas)return;const ctx=canvas.getContext('2d');if(!ctx)return;
    const cols=10,rows=16,cell=15,boardW=cols*cell,boardH=rows*cell,ox=canvas.width/2-boardW/2,oy=22;
    let board:Cell[][]=Array.from({length:rows},()=>Array(cols).fill(0) as Cell[]),score=0,collisions=0,last=performance.now(),raf=0;
    const spawn=():Piece=>({x:3,y:0,shape:SHAPES[Math.floor(Math.random()*SHAPES.length)].map(r=>[...r])});let piece=spawn();
    const valid=(p:Piece,nx=p.x,ny=p.y,shape=p.shape)=>shape.every((r,yy)=>r.every((v,xx)=>!v||(nx+xx>=0&&nx+xx<cols&&ny+yy<rows&&(ny+yy<0||board[ny+yy][nx+xx]===0))));
    const rotate=(s:number[][])=>s[0].map((_,i)=>s.map(r=>r[i]).reverse());
    const lock=()=>{piece.shape.forEach((r,yy)=>r.forEach((v,xx)=>{if(v&&piece.y+yy>=0)board[piece.y+yy][piece.x+xx]=1;}));const before=board.length;board=board.filter(r=>r.some(v=>!v));const cleared=before-board.length;while(board.length<rows)board.unshift(Array(cols).fill(0) as Cell[]);if(cleared){score+=cleared*10;onStatsRef.current(score,collisions);}piece=spawn();if(!valid(piece)){collisions++;board=Array.from({length:rows},()=>Array(cols).fill(0) as Cell[]);onStatsRef.current(score,collisions);}};
    const drop=()=>{if(valid(piece,piece.x,piece.y+1))piece.y++;else lock();};
    const key=(e:KeyboardEvent)=>{if(pausedRef.current)return;if(['ArrowLeft','ArrowRight','ArrowDown','ArrowUp','Space'].includes(e.code))e.preventDefault();if(e.code==='ArrowLeft'&&valid(piece,piece.x-1))piece.x--;if(e.code==='ArrowRight'&&valid(piece,piece.x+1))piece.x++;if(e.code==='ArrowDown')drop();if(e.code==='ArrowUp'||e.code==='Space'){const r=rotate(piece.shape);if(valid(piece,piece.x,piece.y,r))piece.shape=r;}};
    window.addEventListener('keydown',key);
    const paint=(x:number,y:number,active:boolean)=>{const px=ox+x*cell+1,py=oy+y*cell+1;ctx.save();ctx.shadowColor=active?'#6debf2':'rgba(83,166,226,.5)';ctx.shadowBlur=active?15:7;const g=ctx.createLinearGradient(px,py,px+cell,py+cell);g.addColorStop(0,active?'#7bf4ee':'#4578ad');g.addColorStop(1,active?'#8064ff':'#294569');ctx.fillStyle=g;ctx.beginPath();ctx.roundRect(px,py,cell-2,cell-2,4);ctx.fill();ctx.fillStyle='rgba(255,255,255,.14)';ctx.fillRect(px+2,py+2,cell-6,2);ctx.restore();};
    const draw=(now:number)=>{raf=requestAnimationFrame(draw);if(!pausedRef.current&&now-last>Math.max(150,720-speedRef.current*70)){drop();last=now;}const bg=ctx.createLinearGradient(0,0,0,canvas.height);bg.addColorStop(0,'#112b5d');bg.addColorStop(1,'#061026');ctx.fillStyle=bg;ctx.fillRect(0,0,canvas.width,canvas.height);const glow=ctx.createRadialGradient(canvas.width/2,130,15,canvas.width/2,130,220);glow.addColorStop(0,'rgba(87,229,244,.13)');glow.addColorStop(1,'rgba(70,61,190,0)');ctx.fillStyle=glow;ctx.fillRect(120,0,520,280);ctx.save();ctx.shadowColor='rgba(0,0,0,.6)';ctx.shadowBlur=28;ctx.fillStyle='rgba(5,15,34,.84)';ctx.beginPath();ctx.roundRect(ox-18,oy-14,boardW+36,boardH+28,24);ctx.fill();ctx.restore();ctx.strokeStyle='rgba(113,174,231,.08)';for(let x=0;x<=cols;x++){ctx.beginPath();ctx.moveTo(ox+x*cell,oy);ctx.lineTo(ox+x*cell,oy+boardH);ctx.stroke();}for(let y=0;y<=rows;y++){ctx.beginPath();ctx.moveTo(ox,oy+y*cell);ctx.lineTo(ox+boardW,oy+y*cell);ctx.stroke();}board.forEach((r,y)=>r.forEach((v,x)=>v&&paint(x,y,false)));piece.shape.forEach((r,yy)=>r.forEach((v,xx)=>v&&paint(piece.x+xx,piece.y+yy,true)));ctx.fillStyle='rgba(232,243,255,.82)';ctx.font='600 13px system-ui';ctx.fillText('MUEVE · ← →   ROTA · ↑',20,27);ctx.fillStyle='#73edf2';ctx.font='800 12px system-ui';ctx.fillText(`PUNTOS ${score}`,20,48);ctx.fillStyle='#a987ff';ctx.fillText(`REINICIOS ${collisions}`,640,48);ctx.fillStyle='rgba(119,147,193,.7)';ctx.font='700 10px system-ui';ctx.fillText('SIGUIENTE',535,95);const mini=14;ctx.fillStyle='#a978ff';for(let i=0;i<3;i+=1){ctx.beginPath();ctx.roundRect(548+i*mini,112,mini-2,mini-2,3);ctx.fill();}};
    raf=requestAnimationFrame(draw);return()=>{cancelAnimationFrame(raf);window.removeEventListener('keydown',key);};
  },[sessionKey]);

  return <canvas ref={canvasRef} width={760} height={280} className="game-canvas premium-game-canvas" aria-label="Tetris FocusLab"/>;
}
