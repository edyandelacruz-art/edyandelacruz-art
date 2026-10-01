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
test('enforces bounded prompts and conversation windows before network I/O', () => {
  assert.throws(() => __test.normalizeRequest({ system: '', messages: [{ role: 'user', content: 'x' }] }), /system prompt is empty/);
  assert.throws(() => __test.normalizeRequest({ system: 's', messages: [] }), /at least one message/);
  assert.throws(() => __test.normalizeRequest({ system: 's'.repeat(__test.MAX_SYSTEM_CHARS + 1), messages: [{ role: 'user', content: 'x' }] }), /system prompt is too large/);
  assert.throws(() => __test.normalizeRequest({ system: 's', messages: [{ role: 'user', content: 'x'.repeat(__test.MAX_MESSAGE_CHARS + 1) }] }), /message is too large/);
  assert.throws(() => __test.normalizeRequest({ system: 's', messages: Array.from({ length: __test.MAX_MESSAGES + 1 }, () => ({ role: 'user' as const, content: 'x' })) }), /too many messages/);
});
test('bounds serialized request bytes and clamps generation controls', () => {
  const body = JSON.parse(__test.buildRequestBody({ system: 'coach', messages: [{ role: 'user', content: 'hola' }], maxTokens: 99999, temperature: 99 }, 'qwen3:4b'));
  assert.equal(body.max_tokens, 2048);
  assert.equal(body.temperature, 1.5);
  assert.equal(body.stream, false);
  const nearLimit = 'ñ'.repeat(Math.floor(__test.MAX_MESSAGE_CHARS / 2));
  assert.doesNotThrow(() => __test.buildRequestBody({ system: 's', messages: [{ role: 'user', content: nearLimit }] }, 'qwen3:4b'));
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
