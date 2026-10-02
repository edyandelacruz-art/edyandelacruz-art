export type InferenceRoute = 'external-openai-compatible' | 'appdeploy-paid-fallback' | 'unavailable';

export type InferencePolicyInput = {
  externalConfigured: boolean;
  paidFallbackAllowed: boolean;
};

/**
 * Single source of truth for GoalMind inference routing.
 *
 * Safety invariant: AppDeploy AI is NEVER selected merely because an external
 * endpoint is missing or unhealthy. Paid inference is selected only when the
 * operator explicitly opts in through GOALMIND_LLM_ALLOW_APPDEPLOY_FALLBACK.
 */
export function selectInferenceRoute(input: InferencePolicyInput): InferenceRoute {
  if (input.externalConfigured) return 'external-openai-compatible';
  if (input.paidFallbackAllowed) return 'appdeploy-paid-fallback';
  return 'unavailable';
}

/**
 * Determines whether an external-provider failure may cross the paid boundary.
 * Kept separate from route selection so handlers cannot accidentally treat a
 * transient external failure as permission to spend credits.
 */
export function selectFailureRoute(paidFallbackAllowed: boolean): Exclude<InferenceRoute, 'external-openai-compatible'> {
  return paidFallbackAllowed ? 'appdeploy-paid-fallback' : 'unavailable';
}
