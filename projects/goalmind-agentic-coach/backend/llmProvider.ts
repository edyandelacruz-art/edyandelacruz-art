import { secrets } from '@appdeploy/sdk';

export type LlmChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};

export type ExternalLlmStatus = {
  configured: boolean;
  provider: 'openai-compatible';
  paidFallbackAllowed: boolean;
};

type ExternalLlmConfig = {
  baseUrl: string;
  model: string;
  apiKey?: string;
  paidFallbackAllowed: boolean;
};

type ChatCompletionResponse = {
  choices?: Array<{
    message?: {
      content?: string | null;
    };
  }>;
};

const BASE_URL_SECRET = 'GOALMIND_LLM_BASE_URL';
const MODEL_SECRET = 'GOALMIND_LLM_MODEL';
const API_KEY_SECRET = 'GOALMIND_LLM_API_KEY';
const PAID_FALLBACK_SECRET = 'GOALMIND_LLM_ALLOW_APPDEPLOY_FALLBACK';
const DEFAULT_LOCAL_MODEL = 'qwen3:4b';

function ensureOpenAiBaseUrl(value: string): string {
  const trimmed = value.trim().replace(/\/+$/, '');
  if (!trimmed) throw new Error('GOALMIND_LLM_BASE_URL is empty.');

  const parsed = new URL(trimmed);
  const isLocal = parsed.hostname === 'localhost' || parsed.hostname === '127.0.0.1' || parsed.hostname === '::1';
  if (parsed.protocol !== 'https:' && !(parsed.protocol === 'http:' && isLocal)) {
    throw new Error('External LLM endpoint must use HTTPS unless it is localhost.');
  }
  if (parsed.username || parsed.password) throw new Error('Do not embed credentials in GOALMIND_LLM_BASE_URL.');

  return trimmed.endsWith('/v1') ? trimmed : `${trimmed}/v1`;
}

function parseBoolean(value: string | undefined): boolean {
  return /^(1|true|yes|on)$/i.test(String(value || '').trim());
}

async function readOptionalSecret(name: string, names: string[]): Promise<string | undefined> {
  if (!names.includes(name)) return undefined;
  const value = await secrets.readSecret(name);
  return value.trim() || undefined;
}

async function readExternalConfig(): Promise<ExternalLlmConfig | null> {
  const names = await secrets.listSecretNames();
  if (!names.includes(BASE_URL_SECRET)) return null;

  const rawBaseUrl = await secrets.readSecret(BASE_URL_SECRET);
  const model = (await readOptionalSecret(MODEL_SECRET, names)) || DEFAULT_LOCAL_MODEL;
  const apiKey = await readOptionalSecret(API_KEY_SECRET, names);
  const paidFallbackAllowed = parseBoolean(await readOptionalSecret(PAID_FALLBACK_SECRET, names));

  return {
    baseUrl: ensureOpenAiBaseUrl(rawBaseUrl),
    model,
    apiKey,
    paidFallbackAllowed,
  };
}

export async function getExternalLlmStatus(): Promise<ExternalLlmStatus> {
  const config = await readExternalConfig();
  return {
    configured: Boolean(config),
    provider: 'openai-compatible',
    paidFallbackAllowed: config?.paidFallbackAllowed || false,
  };
}

export async function generateExternalChatReply(input: {
  system: string;
  messages: LlmChatMessage[];
  maxTokens?: number;
  temperature?: number;
}): Promise<{ text: string; paidFallbackAllowed: boolean } | null> {
  const config = await readExternalConfig();
  if (!config) return null;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 60_000);

  try {
    const response = await fetch(`${config.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(config.apiKey ? { Authorization: `Bearer ${config.apiKey}` } : {}),
      },
      body: JSON.stringify({
        model: config.model,
        messages: [
          { role: 'system', content: input.system },
          ...input.messages.map(message => ({ role: message.role, content: message.content })),
        ],
        stream: false,
        temperature: Math.max(0, Math.min(1.5, Number(input.temperature) || 0.35)),
        max_tokens: Math.max(64, Math.min(2048, Math.floor(Number(input.maxTokens) || 700))),
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`External LLM returned HTTP ${response.status}.`);
    }

    const payload = await response.json() as ChatCompletionResponse;
    const text = String(payload.choices?.[0]?.message?.content || '').trim().slice(0, 8_000);
    if (!text) throw new Error('External LLM returned an empty completion.');

    return { text, paidFallbackAllowed: config.paidFallbackAllowed };
  } finally {
    clearTimeout(timeout);
  }
}

export const __test = {
  ensureOpenAiBaseUrl,
  parseBoolean,
};
