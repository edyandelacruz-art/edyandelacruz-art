import type { SessionSummary } from '@/types/training';

const KEY = 'focuslab.sessions.v1';

export function loadSessions(): SessionSummary[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as SessionSummary[]) : [];
  } catch {
    return [];
  }
}

export function saveSession(session: SessionSummary): SessionSummary[] {
  const current = loadSessions();
  const next = [session, ...current].slice(0, 100);
  window.localStorage.setItem(KEY, JSON.stringify(next));
  return next;
}
