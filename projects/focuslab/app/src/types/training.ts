export type PausePolicy = 'pause_all' | 'pause_content' | 'continue_all';
export type TrainingMode = 'audio_focus' | 'visual_focus' | 'switch' | 'dual';
export type TrainingCondition = 'baseline' | 'dual_task';

export interface TrainingQuestion {
  id: string;
  triggerSeconds: number;
  prompt: string;
  options: string[];
  answerIndex: number;
}

export interface LearningContent {
  id: string;
  fingerprint: string;
  title: string;
  narration: string;
  sourceType: 'text' | 'youtube_reference' | 'youtube_transcript';
  sourceRef?: string;
  questions: TrainingQuestion[];
}

export interface DifficultyState {
  level: number;
  gameSpeed: number;
  questionTimeSeconds: number;
  pausePolicy: PausePolicy;
  targetAccuracyMin: number;
  targetAccuracyMax: number;
}

export interface ResponseEvent {
  questionId: string;
  selectedIndex: number;
  correct: boolean;
  responseMs: number;
  level: number;
  gameScore: number;
  collisions: number;
  pausePolicy: PausePolicy;
  questionTriggeredAtSeconds: number;
  contentWasPlayingDuringAnswer: boolean;
  gameWasPlayingDuringAnswer: boolean;
}

export type GameName =
  | 'Runner'
  | 'Tetris'
  | 'Road Dodge'
  | 'Pong'
  | 'Snake'
  | 'Memory Grid';

export interface SessionSummary {
  id: string;
  completedAt: string;
  game: GameName;
  mode: 'audio_focus';
  condition: TrainingCondition;
  skill: string;
  learningAccuracy: number;
  averageLatencyMs: number;
  gameScore: number;
  collisions: number;
  responseCount: number;
  finalLevel: number;
  pausePolicy: PausePolicy;
  contentId?: string;
  contentFingerprint?: string;
  contentTitle?: string;
  sourceType?: LearningContent['sourceType'];
  sourceRef?: string;
}

export interface DualTaskComparison {
  baselineSessionId: string;
  accuracyCostPoints: number;
  latencyCostPercent: number | null;
}
