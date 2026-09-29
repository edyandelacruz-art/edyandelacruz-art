import type { Question } from '../domain/types.js';
import type { QuestionQuery, QuestionRepository } from './question-repository.js';

export class MemoryQuestionRepository implements QuestionRepository {
  constructor(private readonly questions: readonly Question[]) {}

  async list(query: QuestionQuery): Promise<readonly Question[]> {
    const filtered = this.questions.filter((question) => {
      if (question.subject !== query.subject) return false;
      if (query.difficulty && question.difficulty !== query.difficulty) return false;
      if (query.topic && question.topic !== query.topic) return false;
      return true;
    });

    return filtered.slice(0, query.limit ?? filtered.length);
  }
}
