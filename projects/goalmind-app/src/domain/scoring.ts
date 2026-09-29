export interface ScoreInput {
  correct: boolean;
  elapsedMs: number;
  limitMs: number;
  streakBeforeAnswer: number;
}

export function scoreAnswer(input: ScoreInput): number {
  if (!input.correct) return 0;

  const safeLimit = Math.max(1, input.limitMs);
  const remainingRatio = Math.max(0, Math.min(1, 1 - input.elapsedMs / safeLimit));
  const base = 100;
  const speedBonus = Math.round(60 * remainingRatio);
  const streakBonus = Math.min(100, input.streakBeforeAnswer * 10);

  return base + speedBonus + streakBonus;
}
