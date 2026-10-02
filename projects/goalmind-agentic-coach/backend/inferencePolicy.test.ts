import { describe, expect, it } from 'vitest';
import { selectFailureRoute, selectInferenceRoute } from './inferencePolicy';

describe('GoalMind zero-credit inference policy', () => {
  it('uses the external provider when it is configured', () => {
    expect(selectInferenceRoute({ externalConfigured: true, paidFallbackAllowed: false }))
      .toBe('external-openai-compatible');
  });

  it('does not spend AppDeploy credits when no external endpoint exists', () => {
    expect(selectInferenceRoute({ externalConfigured: false, paidFallbackAllowed: false }))
      .toBe('unavailable');
  });

  it('allows AppDeploy paid inference only after explicit opt-in', () => {
    expect(selectInferenceRoute({ externalConfigured: false, paidFallbackAllowed: true }))
      .toBe('appdeploy-paid-fallback');
  });

  it('does not cross the paid boundary after an external-provider failure by default', () => {
    expect(selectFailureRoute(false)).toBe('unavailable');
  });

  it('permits paid fallback after external failure only with explicit opt-in', () => {
    expect(selectFailureRoute(true)).toBe('appdeploy-paid-fallback');
  });
});
