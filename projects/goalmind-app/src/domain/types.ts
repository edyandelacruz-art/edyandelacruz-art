export type Difficulty = 'Principiante' | 'Intermedio' | 'Avanzado' | 'Experto';
export type SubjectKey = 'historia' | 'fisica' | 'biologia' | 'matematicas';
export type AnswerIndex = 0 | 1 | 2 | 3;

export interface Question {
  id: string;
  subject: SubjectKey;
  grade?: number;
  component?: string;
  topic: string;
  difficulty: Difficulty;
  prompt: string;
  answers: readonly [string, string, string, string];
  correctAnswer: AnswerIndex;
  explanation: string;
  imageUrl?: string;
  tags?: readonly string[];
}

export interface GameConfig {
  subject: SubjectKey;
  difficulty: Difficulty;
  secondsPerQuestion: number;
  questionCount: number;
}

export interface AnswerRecord {
  questionId: string;
  selectedAnswer: AnswerIndex | null;
  correctAnswer: AnswerIndex;
  isCorrect: boolean;
  elapsedMs: number;
  points: number;
  timedOut: boolean;
}

export interface GameSnapshot {
  status: 'ready' | 'playing' | 'feedback' | 'finished';
  config: GameConfig;
  currentQuestionIndex: number;
  totalQuestions: number;
  score: number;
  streak: number;
  bestStreak: number;
  correctCount: number;
  answeredCount: number;
  answers: readonly AnswerRecord[];
}

export interface GameResult {
  score: number;
  correctCount: number;
  answeredCount: number;
  accuracy: number;
  bestStreak: number;
  averageElapsedMs: number;
  answers: readonly AnswerRecord[];
}
