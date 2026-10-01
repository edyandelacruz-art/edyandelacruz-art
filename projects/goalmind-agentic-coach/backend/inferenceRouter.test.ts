import assert from 'node:assert/strict';
import { test } from 'vitest';
import { InferenceUnavailableError, runWithInferencePolicy } from './inferenceRouter';

test('missing external endpoint cannot execute paid inference without opt-in', async () => {
  let paidCalls = 0;
  await assert.rejects(runWithInferencePolicy({ externalConfigured: false, paidFallbackAllowed: false, runExternal: async () => 'external', runPaid: async () => { paidCalls += 1; return 'paid'; } }), InferenceUnavailableError);
  assert.equal(paidCalls, 0);
});

test('external failure cannot cross paid boundary without opt-in', async () => {
  let paidCalls = 0;
  await assert.rejects(runWithInferencePolicy({ externalConfigured: true, paidFallbackAllowed: false, runExternal: async () => { throw new Error('offline'); }, runPaid: async () => { paidCalls += 1; return 'paid'; } }), InferenceUnavailableError);
  assert.equal(paidCalls, 0);
});

test('explicit opt-in allows paid inference when external endpoint is absent', async () => {
  let paidCalls = 0;
  const result = await runWithInferencePolicy({ externalConfigured: false, paidFallbackAllowed: true, runExternal: async () => 'external', runPaid: async () => { paidCalls += 1; return 'paid'; } });
  assert.equal(result.value, 'paid');
  assert.equal(result.route, 'appdeploy-paid-fallback');
  assert.equal(paidCalls, 1);
});

test('healthy external inference never calls paid provider', async () => {
  let paidCalls = 0;
  const result = await runWithInferencePolicy({ externalConfigured: true, paidFallbackAllowed: true, runExternal: async () => 'external', runPaid: async () => { paidCalls += 1; return 'paid'; } });
  assert.equal(result.value, 'external');
  assert.equal(result.route, 'external-openai-compatible');
  assert.equal(paidCalls, 0);
});

test('external failure may use paid provider only with explicit opt-in', async () => {
  let paidCalls = 0;
  const result = await runWithInferencePolicy({ externalConfigured: true, paidFallbackAllowed: true, runExternal: async () => { throw new Error('offline'); }, runPaid: async () => { paidCalls += 1; return 'paid'; } });
  assert.equal(result.value, 'paid');
  assert.equal(result.route, 'appdeploy-paid-fallback');
  assert.equal(paidCalls, 1);
});
