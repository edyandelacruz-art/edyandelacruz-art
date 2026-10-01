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
  assert.throws(() => __test.ensureOpenAiBaseUrl('https://user:password@llm.example.com'), /credentials/);
});

test('rejects private and link-local external targets', () => {
  for (const url of [
    'https://10.0.0.2:11434',
    'https://172.16.0.2:11434',
    'https://192.168.1.10:11434',
    'https://169.254.169.254',
    'https://model.local',
  ]) {
    assert.throws(() => __test.ensureOpenAiBaseUrl(url), /private|link-local/);
  }
});

test('rejects query parameters and fragments in endpoint URLs', () => {
  assert.throws(() => __test.ensureOpenAiBaseUrl('https://llm.example.com?target=x'), /query parameters/);
  assert.throws(() => __test.ensureOpenAiBaseUrl('https://llm.example.com/#x'), /fragments/);
});

test('classifies private IPv4 ranges', () => {
  assert.equal(__test.isPrivateIpv4('10.1.2.3'), true);
  assert.equal(__test.isPrivateIpv4('172.31.255.1'), true);
  assert.equal(__test.isPrivateIpv4('192.168.0.1'), true);
  assert.equal(__test.isPrivateIpv4('169.254.1.1'), true);
  assert.equal(__test.isPrivateIpv4('8.8.8.8'), false);
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
