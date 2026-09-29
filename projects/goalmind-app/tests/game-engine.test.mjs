import assert from 'node:assert/strict';
import test from 'node:test';
import { GoalMindGameEngine } from '../.test-dist/domain/game-engine.js';

const questions = [
  { id:'q1', subject:'historia', topic:'Demo', difficulty:'Intermedio', prompt:'Q1', answers:['A','B','C','D'], correctAnswer:1, explanation:'B' },
  { id:'q2', subject:'historia', topic:'Demo', difficulty:'Intermedio', prompt:'Q2', answers:['A','B','C','D'], correctAnswer:0, explanation:'A' }
];

const config = { subject:'historia', difficulty:'Intermedio', secondsPerQuestion:8, questionCount:2 };

test('correct answers score and increase streak', () => {
  const game = new GoalMindGameEngine(config, questions);
  game.start();
  const record = game.answer(1, 2000);
  assert.equal(record.isCorrect, true);
  assert.ok(record.points > 100);
  assert.equal(game.snapshot().streak, 1);
});

test('incorrect answer resets streak and scores zero', () => {
  const game = new GoalMindGameEngine(config, questions);
  game.start();
  game.answer(1, 1000);
  game.next();
  const record = game.answer(3, 1500);
  assert.equal(record.isCorrect, false);
  assert.equal(record.points, 0);
  assert.equal(game.snapshot().streak, 0);
});

test('timeout cannot be correct and game returns final metrics', () => {
  const game = new GoalMindGameEngine(config, questions);
  game.start();
  game.answer(null, 8000, true);
  game.next();
  game.answer(0, 4000);
  game.next();
  const result = game.result();
  assert.equal(result.answeredCount, 2);
  assert.equal(result.correctCount, 1);
  assert.equal(result.accuracy, 0.5);
  assert.equal(result.averageElapsedMs, 6000);
});
