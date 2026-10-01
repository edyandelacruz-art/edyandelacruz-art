import assert from 'node:assert/strict';
import test from 'node:test';
import { __test } from './llmProvider';

test('normalizes an HTTPS OpenAI-compatible endpoint to /v1', () => {
  assert.equal(__test.ensureOpenAiBaseUrl('https://llm.example.com/'), 'https://llm.example.com/v1');
  assert.equal(__test.ensureOpenAiBaseUrl('https://llm.example.com/v1'), 'https://llm.example.com/v1');
});
test('allows plain HTTP only for loopback development', () => {
  assert.equal(__test.ensureOpenAiBaseUrl('http://localhost:11434'), 'http://localhost:11434/v1');
  assert.throws(() => __test.ensureOpenAiBaseUrl('http://llm.example.com'), /HTTPS/);
});
test('rejects credentials, private targets, queries and fragments', () => {
  assert.throws(() => __test.ensureOpenAiBaseUrl('https://user:password@llm.example.com'), /credentials/);
  for (const url of ['https://10.0.0.2:11434','https://172.16.0.2:11434','https://192.168.1.10:11434','https://169.254.169.254','https://model.local']) assert.throws(() => __test.ensureOpenAiBaseUrl(url), /private|link-local/);
  assert.throws(() => __test.ensureOpenAiBaseUrl('https://llm.example.com?target=x'), /query parameters/);
  assert.throws(() => __test.ensureOpenAiBaseUrl('https://llm.example.com/#x'), /fragments/);
});
test('paid AppDeploy fallback remains opt-in', () => {
  assert.equal(__test.parseBoolean(undefined), false); assert.equal(__test.parseBoolean('false'), false); assert.equal(__test.parseBoolean('true'), true);
});
test('accepts JSON content types and rejects HTML or missing content type', () => {
  assert.doesNotThrow(() => __test.assertJsonContentType('application/json'));
  assert.doesNotThrow(() => __test.assertJsonContentType('application/problem+json'));
  assert.throws(() => __test.assertJsonContentType('text/html'), /non-JSON/);
  assert.throws(() => __test.assertJsonContentType(null), /non-JSON/);
});
test('rejects declared external LLM responses above the safety limit', () => {
  assert.doesNotThrow(() => __test.assertSafeContentLength(String(__test.MAX_RESPONSE_BYTES)));
  assert.throws(() => __test.assertSafeContentLength(String(__test.MAX_RESPONSE_BYTES + 1)), /too large/);
});
test('enforces the response limit even without Content-Length', async () => {
  const valid = new Response(JSON.stringify({ choices: [{ message: { content: 'ok' } }] }));
  const payload = await __test.readJsonBodyWithLimit(valid);
  assert.equal(payload.choices?.[0]?.message?.content, 'ok');
  const oversized = new Response('x'.repeat(__test.MAX_RESPONSE_BYTES + 1));
  await assert.rejects(() => __test.readJsonBodyWithLimit(oversized), /too large/);
});
test('rejects malformed JSON bodies', async () => {
  await assert.rejects(() => __test.readJsonBodyWithLimit(new Response('{broken')), /invalid JSON/);
});
