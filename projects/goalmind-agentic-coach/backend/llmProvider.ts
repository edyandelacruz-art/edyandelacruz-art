import { secrets } from '@appdeploy/sdk';

export type LlmChatMessage = { role: 'user' | 'assistant'; content: string };
export type ExternalLlmStatus = { configured: boolean; provider: 'openai-compatible'; paidFallbackAllowed: boolean };
type ExternalLlmConfig = { baseUrl: string; model: string; apiKey?: string; paidFallbackAllowed: boolean };
type ChatCompletionResponse = { choices?: Array<{ message?: { content?: string | null } }> };

const BASE_URL_SECRET = 'GOALMIND_LLM_BASE_URL';
const MODEL_SECRET = 'GOALMIND_LLM_MODEL';
const API_KEY_SECRET = 'GOALMIND_LLM_API_KEY';
const PAID_FALLBACK_SECRET = 'GOALMIND_LLM_ALLOW_APPDEPLOY_FALLBACK';
const DEFAULT_LOCAL_MODEL = 'qwen3:4b';
const MAX_RESPONSE_BYTES = 1_000_000;
const MAX_REQUEST_BYTES = 256_000;
const MAX_SYSTEM_CHARS = 24_000;
const MAX_MESSAGE_CHARS = 12_000;
const MAX_MESSAGES = 48;

function isPrivateIpv4(hostname: string): boolean {
  const parts = hostname.split('.').map(Number);
  if (parts.length !== 4 || parts.some(part => !Number.isInteger(part) || part < 0 || part > 255)) return false;
  const [a, b] = parts;
  return a === 10 || a === 127 || (a === 169 && b === 254) || (a === 172 && b >= 16 && b <= 31) || (a === 192 && b === 168);
}
function isPrivateHostname(hostname: string): boolean {
  const host = hostname.toLowerCase().replace(/^\[|\]$/g, '');
  return host === 'localhost' || host === '::1' || host.endsWith('.local') || isPrivateIpv4(host);
}
function ensureOpenAiBaseUrl(value: string): string {
  const trimmed = value.trim().replace(/\/+$/, '');
  if (!trimmed) throw new Error('GOALMIND_LLM_BASE_URL is empty.');
  const parsed = new URL(trimmed);
  const host = parsed.hostname.toLowerCase();
  const isLoopback = host === 'localhost' || host === '127.0.0.1' || host === '::1' || host === '[::1]';
  if (parsed.protocol !== 'https:' && !(parsed.protocol === 'http:' && isLoopback)) throw new Error('External LLM endpoint must use HTTPS unless it is localhost.');
  if (parsed.username || parsed.password) throw new Error('Do not embed credentials in GOALMIND_LLM_BASE_URL.');
  if (parsed.hash || parsed.search) throw new Error('GOALMIND_LLM_BASE_URL must not contain query parameters or fragments.');
  if (isPrivateHostname(host) && !isLoopback) throw new Error('External LLM endpoint must not target private or link-local networks. Use an authenticated HTTPS gateway.');
  return trimmed.endsWith('/v1') ? trimmed : `${trimmed}/v1`;
}
function parseBoolean(value: string | undefined): boolean { return /^(1|true|yes|on)$/i.test(String(value || '').trim()); }
function assertJsonContentType(value: string | null): void {
  if (!value || !/^application\/(?:[a-z0-9.+-]*\+)?json(?:\s*;|$)/i.test(value)) throw new Error('External LLM returned a non-JSON response.');
}
function assertSafeContentLength(value: string | null): void {
  if (!value) return;
  const bytes = Number(value);
  if (Number.isFinite(bytes) && bytes > MAX_RESPONSE_BYTES) throw new Error('External LLM response is too large.');
}
function normalizeRequest(input: { system: string; messages: LlmChatMessage[] }): { system: string; messages: LlmChatMessage[] } {
  const system = String(input.system || '').trim();
  if (!system) throw new Error('External LLM system prompt is empty.');
  if (system.length > MAX_SYSTEM_CHARS) throw new Error('External LLM system prompt is too large.');
  if (!Array.isArray(input.messages) || input.messages.length === 0) throw new Error('External LLM requires at least one message.');
  if (input.messages.length > MAX_MESSAGES) throw new Error('External LLM conversation has too many messages.');
  const messages = input.messages.map(message => {
    if (message.role !== 'user' && message.role !== 'assistant') throw new Error('External LLM message role is invalid.');
    const content = String(message.content || '').trim();
    if (!content) throw new Error('External LLM message is empty.');
    if (content.length > MAX_MESSAGE_CHARS) throw new Error('External LLM message is too large.');
    return { role: message.role, content };
  });
  return { system, messages };
}
function buildRequestBody(input: { system: string; messages: LlmChatMessage[]; maxTokens?: number; temperature?: number }, model: string): string {
  const normalized = normalizeRequest(input);
  const body = JSON.stringify({ model, messages: [{ role: 'system', content: normalized.system }, ...normalized.messages], stream: false, temperature: Math.max(0, Math.min(1.5, Number(input.temperature) || 0.35)), max_tokens: Math.max(64, Math.min(2048, Math.floor(Number(input.maxTokens) || 700))) });
  if (new TextEncoder().encode(body).byteLength > MAX_REQUEST_BYTES) throw new Error('External LLM request is too large.');
  return body;
}
async function readJsonBodyWithLimit(response: Response): Promise<ChatCompletionResponse> {
  const reader = response.body?.getReader();
  if (!reader) {
    const text = await response.text();
    if (new TextEncoder().encode(text).byteLength > MAX_RESPONSE_BYTES) throw new Error('External LLM response is too large.');
    try { return JSON.parse(text) as ChatCompletionResponse; } catch { throw new Error('External LLM returned invalid JSON.'); }
  }
  const decoder = new TextDecoder();
  let bytes = 0;
  let text = '';
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    bytes += value.byteLength;
    if (bytes > MAX_RESPONSE_BYTES) { await reader.cancel(); throw new Error('External LLM response is too large.'); }
    text += decoder.decode(value, { stream: true });
  }
  text += decoder.decode();
  try { return JSON.parse(text) as ChatCompletionResponse; } catch { throw new Error('External LLM returned invalid JSON.'); }
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
  return { baseUrl: ensureOpenAiBaseUrl(rawBaseUrl), model, apiKey, paidFallbackAllowed };
}
export async function getExternalLlmStatus(): Promise<ExternalLlmStatus> {
  const config = await readExternalConfig();
  return { configured: Boolean(config), provider: 'openai-compatible', paidFallbackAllowed: config?.paidFallbackAllowed || false };
}
export async function generateExternalChatReply(input: { system: string; messages: LlmChatMessage[]; maxTokens?: number; temperature?: number }): Promise<{ text: string; paidFallbackAllowed: boolean } | null> {
  const config = await readExternalConfig();
  if (!config) return null;
  const body = buildRequestBody(input, config.model);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 60_000);
  try {
    const response = await fetch(`${config.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json', ...(config.apiKey ? { Authorization: `Bearer ${config.apiKey}` } : {}) },
      body,
      signal: controller.signal,
    });
    if (!response.ok) throw new Error(`External LLM returned HTTP ${response.status}.`);
    assertJsonContentType(response.headers.get('content-type'));
    assertSafeContentLength(response.headers.get('content-length'));
    const payload = await readJsonBodyWithLimit(response);
    const text = String(payload.choices?.[0]?.message?.content || '').trim().slice(0, 8_000);
    if (!text) throw new Error('External LLM returned an empty completion.');
    return { text, paidFallbackAllowed: config.paidFallbackAllowed };
  } finally { clearTimeout(timeout); }
}
export const __test = { ensureOpenAiBaseUrl, isPrivateIpv4, isPrivateHostname, parseBoolean, assertJsonContentType, assertSafeContentLength, normalizeRequest, buildRequestBody, readJsonBodyWithLimit, MAX_RESPONSE_BYTES, MAX_REQUEST_BYTES, MAX_SYSTEM_CHARS, MAX_MESSAGE_CHARS, MAX_MESSAGES };
