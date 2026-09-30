import assert from 'node:assert/strict';
import test from 'node:test';
import { __test } from './llmProvider';

test('normalizes an HTTPS OpenAI-compatible endpoint to /v1', () => {
  assert.equal(__test.ensureOpenAiBaseUrl('https://llm.example.com/'), 'https://llm.example.com/v1');
  assert.equal(__test.ensureOpenAiBaseUrl('https://llm.example.com/v1'), 'https://llm.example.com/v1');
});

test('allows plain HTTP only for loopback development', () => {
  assert.equal(__test.ensureOpenAiBaseUrl('http://localhost:11434'), 'http://localhost:11434/v1');
  assert.equal(__test.ensureOpenAiBaseUrl('http://127.0.0.1:11434'), 'http://127.0.0.1:11434/v1');
  assert.throws(() => __test.ensureOpenAiBaseUrl('http://llm.example.com'), /HTTPS/);
});

test('rejects credentials embedded in endpoint URLs', () => {
  assert.throws(
    () => __test.ensureOpenAiBaseUrl('https://user:password@llm.example.com'),
    /credentials/,
  );
});

test('rejects empty and malformed endpoint URLs', () => {
  assert.throws(() => __test.ensureOpenAiBaseUrl('   '), /empty/);
  assert.throws(() => __test.ensureOpenAiBaseUrl('not-a-url'));
});

test('paid AppDeploy fallback remains opt-in', () => {
  assert.equal(__test.parseBoolean(undefined), false);
  assert.equal(__test.parseBoolean('false'), false);
  assert.equal(__test.parseBoolean('0'), false);
  assert.equal(__test.parseBoolean('true'), true);
  assert.equal(__test.parseBoolean('YES'), true);
  assert.equal(__test.parseBoolean('on'), true);
});
