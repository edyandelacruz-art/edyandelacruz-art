'use client';
import RunnerGame from './RunnerGame';
import TetrisGame from './TetrisGame';
import RoadDodgeGame from './RoadDodgeGame';
import PongGame from './PongGame';
import SnakeGame from './SnakeGame';
import MemoryGridGame from './MemoryGridGame';
import type { GameName } from '@/types/training';

interface Props {
  game: GameName;
  speed: number;
  paused: boolean;
  sessionKey: number;
  onStats: (score: number, collisions: number) => void;
}

export default function GameHost(props: Props) {
  switch (props.game) {
    case 'Tetris':
      return <TetrisGame {...props} />;
    case 'Road Dodge':
      return <RoadDodgeGame {...props} />;
    case 'Pong':
      return <PongGame {...props} />;
    case 'Snake':
      return <SnakeGame {...props} />;
    case 'Memory Grid':
      return <MemoryGridGame {...props} />;
    default:
      return <RunnerGame {...props} />;
  }
}
