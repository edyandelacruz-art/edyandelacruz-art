import { selectFailureRoute, selectInferenceRoute, type InferenceRoute } from './inferencePolicy';

export class InferenceUnavailableError extends Error {
  readonly code = 'GOALMIND_INFERENCE_UNAVAILABLE';
  readonly status = 503;

  constructor(message = 'GoalMind inference is unavailable without an explicitly authorized provider.') {
    super(message);
    this.name = 'InferenceUnavailableError';
  }
}

export type InferenceRouterInput<T> = {
  externalConfigured: boolean;
  paidFallbackAllowed: boolean;
  runExternal: () => Promise<T>;
  runPaid: () => Promise<T>;
};

export type RoutedInference<T> = {
  value: T;
  route: Exclude<InferenceRoute, 'unavailable'>;
};

/**
 * Executable paid-boundary for GoalMind inference.
 *
 * Invariant: runPaid() is unreachable unless paidFallbackAllowed === true.
 * Missing configuration and external-provider failures are not authorization
 * to spend AppDeploy credits.
 */
export async function runWithInferencePolicy<T>(input: InferenceRouterInput<T>): Promise<RoutedInference<T>> {
  const route = selectInferenceRoute({
    externalConfigured: input.externalConfigured,
    paidFallbackAllowed: input.paidFallbackAllowed,
  });

  if (route === 'unavailable') throw new InferenceUnavailableError();

  if (route === 'appdeploy-paid-fallback') {
    return { value: await input.runPaid(), route };
  }

  try {
    return { value: await input.runExternal(), route: 'external-openai-compatible' };
  } catch (cause) {
    const failureRoute = selectFailureRoute(input.paidFallbackAllowed);
    if (failureRoute === 'unavailable') {
      const error = new InferenceUnavailableError('External GoalMind inference failed and paid fallback is not authorized.');
      (error as Error & { cause?: unknown }).cause = cause;
      throw error;
    }
    return { value: await input.runPaid(), route: failureRoute };
  }
}

export function isInferenceUnavailable(error: unknown): error is InferenceUnavailableError {
  return error instanceof InferenceUnavailableError || (
    Boolean(error) && typeof error === 'object' && (error as { code?: unknown }).code === 'GOALMIND_INFERENCE_UNAVAILABLE'
  );
}
