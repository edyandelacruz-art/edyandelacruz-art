import { scoreAnswer } from './scoring.js';
import type { AnswerIndex, AnswerRecord, GameConfig, GameResult, GameSnapshot, Question } from './types.js';

export class GoalMindGameEngine {
  readonly #config: GameConfig;
  readonly #questions: readonly Question[];
  #index = 0;
  #score = 0;
  #streak = 0;
  #bestStreak = 0;
  #records: AnswerRecord[] = [];
  #status: GameSnapshot['status'] = 'ready';

  constructor(config: GameConfig, questions: readonly Question[]) {
    if (questions.length === 0) throw new Error('A game requires at least one question.');
    if (config.secondsPerQuestion <= 0) throw new Error('secondsPerQuestion must be greater than zero.');
    if (config.questionCount <= 0) throw new Error('questionCount must be greater than zero.');

    this.#config = { ...config, questionCount: Math.min(config.questionCount, questions.length) };
    this.#questions = questions.slice(0, this.#config.questionCount);
  }

  start(): GameSnapshot {
    if (this.#status !== 'ready') throw new Error('Game can only be started once.');
    this.#status = 'playing';
    return this.snapshot();
  }

  currentQuestion(): Question {
    const question = this.#questions[this.#index];
    if (!question) throw new Error('No current question is available.');
    return question;
  }

  answer(selectedAnswer: AnswerIndex | null, elapsedMs: number, timedOut = false): AnswerRecord {
    if (this.#status !== 'playing') throw new Error('Game is not accepting answers.');

    const question = this.currentQuestion();
    const safeElapsed = Math.max(0, Math.min(elapsedMs, this.#config.secondsPerQuestion * 1000));
    const isCorrect = !timedOut && selectedAnswer === question.correctAnswer;
    const points = scoreAnswer({
      correct: isCorrect,
      elapsedMs: safeElapsed,
      limitMs: this.#config.secondsPerQuestion * 1000,
      streakBeforeAnswer: this.#streak,
    });

    const record: AnswerRecord = {
      questionId: question.id,
      selectedAnswer,
      correctAnswer: question.correctAnswer,
      isCorrect,
      elapsedMs: safeElapsed,
      points,
      timedOut,
    };

    this.#records.push(record);
    this.#score += points;
    this.#streak = isCorrect ? this.#streak + 1 : 0;
    this.#bestStreak = Math.max(this.#bestStreak, this.#streak);
    this.#status = 'feedback';
    return record;
  }

  next(): GameSnapshot {
    if (this.#status !== 'feedback') throw new Error('Advance is only allowed after feedback.');

    const isLast = this.#index >= this.#questions.length - 1;
    if (isLast) {
      this.#status = 'finished';
      return this.snapshot();
    }

    this.#index += 1;
    this.#status = 'playing';
    return this.snapshot();
  }

  result(): GameResult {
    if (this.#status !== 'finished') throw new Error('Result is only available after the game finishes.');
    const correctCount = this.#records.filter((r) => r.isCorrect).length;
    const answeredCount = this.#records.length;
    const totalElapsed = this.#records.reduce((sum, r) => sum + r.elapsedMs, 0);

    return {
      score: this.#score,
      correctCount,
      answeredCount,
      accuracy: answeredCount === 0 ? 0 : correctCount / answeredCount,
      bestStreak: this.#bestStreak,
      averageElapsedMs: answeredCount === 0 ? 0 : Math.round(totalElapsed / answeredCount),
      answers: [...this.#records],
    };
  }

  snapshot(): GameSnapshot {
    return {
      status: this.#status,
      config: this.#config,
      currentQuestionIndex: this.#index,
      totalQuestions: this.#questions.length,
      score: this.#score,
      streak: this.#streak,
      bestStreak: this.#bestStreak,
      correctCount: this.#records.filter((r) => r.isCorrect).length,
      answeredCount: this.#records.length,
      answers: [...this.#records],
    };
  }
}
