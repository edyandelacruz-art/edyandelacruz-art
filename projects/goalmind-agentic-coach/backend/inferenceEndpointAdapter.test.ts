import { describe, expect, it, vi } from 'vitest';
import { runEndpointInference } from './inferenceEndpointAdapter';

describe('runEndpointInference', () => {
  it('returns 503 and never calls paid inference when no provider is authorized', async () => {
    const runExternal = vi.fn(async () => 'external');
    const runPaid = vi.fn(async () => 'paid');

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

  it('uses external inference first when configured', async () => {
    const runPaid = vi.fn(async () => 'paid');
    const result = await runEndpointInference(
      { externalConfigured: true, paidFallbackAllowed: false },
      async () => 'external',
      runPaid,
    );

    expect(result).toEqual({
      ok: true,
      value: 'external',
      inferenceProvider: 'external-openai-compatible',
    });
    expect(runPaid).not.toHaveBeenCalled();
  });

  it('does not convert unexpected paid-provider errors into a fake 503 policy state', async () => {
    await expect(runEndpointInference(
      { externalConfigured: false, paidFallbackAllowed: true },
      async () => 'external',
      async () => { throw new Error('paid runtime failed'); },
    )).rejects.toThrow('paid runtime failed');
  });

  it('allows paid fallback after an external failure only with explicit authorization', async () => {
    const runPaid = vi.fn(async () => 'paid');
    const result = await runEndpointInference(
      { externalConfigured: true, paidFallbackAllowed: true },
      async () => { throw new Error('external failed'); },
      runPaid,
    );

    expect(result).toEqual({
      ok: true,
      value: 'paid',
      inferenceProvider: 'appdeploy-paid-fallback',
    });
    expect(runPaid).toHaveBeenCalledTimes(1);
  });
});
