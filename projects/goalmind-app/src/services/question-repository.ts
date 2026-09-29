import type { Difficulty, Question, SubjectKey } from '../domain/types.js';

export interface QuestionQuery {
  subject: SubjectKey;
  difficulty?: Difficulty;
  topic?: string;
  limit?: number;
}

export interface QuestionRepository {
  list(query: QuestionQuery): Promise<readonly Question[]>;
}
