import type { DifficultyState, ResponseEvent } from '@/types/training';

export const INITIAL_DIFFICULTY: DifficultyState = {
  level: 1,
  gameSpeed: 3.2,
  questionTimeSeconds: 12,
  pausePolicy: 'pause_all',
  targetAccuracyMin: 0.7,
  targetAccuracyMax: 0.88,
};

export function adaptDifficulty(
  current: DifficultyState,
  recent: ResponseEvent[]
): DifficultyState {
  if (recent.length < 3) return current;
  const window = recent.slice(-3);
  const accuracy = window.filter(r => r.correct).length / window.length;
  const avgLatency =
    window.reduce((sum, r) => sum + r.responseMs, 0) / window.length;
  if (
    accuracy >= current.targetAccuracyMax &&
    avgLatency < current.questionTimeSeconds * 700
  ) {
    const nextLevel = Math.min(5, current.level + 1);
    return {
      ...current,
      level: nextLevel,
      gameSpeed: Math.min(7.2, current.gameSpeed + 0.55),
      questionTimeSeconds: Math.max(5, current.questionTimeSeconds - 1),
      pausePolicy:
        nextLevel >= 4
          ? 'continue_all'
          : nextLevel >= 3
            ? 'pause_content'
            : 'pause_all',
    };
  }
  if (accuracy < current.targetAccuracyMin) {
    return {
      ...current,
      gameSpeed: Math.max(2.6, current.gameSpeed - 0.45),
      questionTimeSeconds: Math.min(15, current.questionTimeSeconds + 1),
      pausePolicy: current.level <= 2 ? 'pause_all' : 'pause_content',
    };
  }
  return current;
}
