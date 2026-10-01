import { runWithInferencePolicy, isInferenceUnavailable } from './inferenceRouter';

export type EndpointInferenceConfig = {
  externalConfigured: boolean;
  paidFallbackAllowed: boolean;
};

export type EndpointInferenceSuccess<T> = {
  ok: true;
  value: T;
  inferenceProvider: 'external-openai-compatible' | 'appdeploy-paid-fallback';
};

export type EndpointInferenceUnavailable = {
  ok: false;
  status: 503;
  code: 'GOALMIND_INFERENCE_UNAVAILABLE';
  message: string;
};

export type EndpointInferenceResult<T> = EndpointInferenceSuccess<T> | EndpointInferenceUnavailable;

/**
 * HTTP-boundary adapter for Coach endpoints.
 *
 * This keeps provider authorization out of endpoint-specific branching and
 * converts the expected "no authorized inference provider" state into a
 * deterministic 503 result. Unexpected provider/runtime errors still throw so
 * they cannot be mislabeled as a configuration/cost-policy condition.
 */
export async function runEndpointInference<T>(
  config: EndpointInferenceConfig,
  runExternal: () => Promise<T>,
  runPaid: () => Promise<T>,
): Promise<EndpointInferenceResult<T>> {
  try {
    const routed = await runWithInferencePolicy({
      externalConfigured: config.externalConfigured,
      paidFallbackAllowed: config.paidFallbackAllowed,
      runExternal,
      runPaid,
    });

    return {
      ok: true,
      value: routed.value,
      inferenceProvider: routed.route,
    };
  } catch (cause) {
    if (!isInferenceUnavailable(cause)) throw cause;
    return {
      ok: false,
      status: 503,
      code: 'GOALMIND_INFERENCE_UNAVAILABLE',
      message: 'GoalMind Coach no tiene un proveedor de IA autorizado disponible en este momento.',
    };
  }
}
