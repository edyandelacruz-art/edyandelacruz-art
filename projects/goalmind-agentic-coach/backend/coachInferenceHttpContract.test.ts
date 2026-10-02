import { describe, expect, it, vi } from 'vitest';
import { runEndpointInference } from './inferenceEndpointAdapter';

/**
 * HTTP-facing contract shared by POST /api/coach/chat and POST /api/coach/plan.
 * This intentionally tests the exact adapter result that backend/index.ts maps
 * to json(...) or error(...), without requiring the AppDeploy runtime in CI.
 */
describe('Coach inference HTTP contract', () => {
  for (const endpoint of ['/api/coach/chat', '/api/coach/plan']) {
    it(`${endpoint}: no external endpoint + no paid opt-in => deterministic 503 and zero paid calls`, async () => {
      const runExternal = vi.fn(async () => ({ endpoint }));
      const runPaid = vi.fn(async () => ({ endpoint, paid: true }));

      const result = await runEndpointInference(
        { externalConfigured: false, paidFallbackAllowed: false },
        runExternal,
        runPaid,
      );

      expect(result).toEqual({
        ok: false,
        status: 503,
        code: 'GOALMIND_INFERENCE_UNAVAILABLE',
        message: 'GoalMind Coach no tiene un proveedor de IA autorizado disponible en este momento.',
      });
      expect(runExternal).not.toHaveBeenCalled();
      expect(runPaid).not.toHaveBeenCalled();
    });
  }

  it('external provider failure does not cross the paid boundary without explicit opt-in', async () => {
    const runPaid = vi.fn(async () => 'paid');

    const result = await runEndpointInference(
      { externalConfigured: true, paidFallbackAllowed: false },
      async () => { throw new Error('external unavailable'); },
      runPaid,
    );

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.status).toBe(503);
      expect(result.code).toBe('GOALMIND_INFERENCE_UNAVAILABLE');
    }
    expect(runPaid).not.toHaveBeenCalled();
  });
});
