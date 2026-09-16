import type { DualTaskComparison, SessionSummary } from '@/types/training';

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

export function findMatchedBaseline(
  session: SessionSummary,
  sessions = loadSessions()
): SessionSummary | undefined {
  if (session.condition !== 'dual_task' || !session.contentFingerprint) return undefined;
  return sessions.find(
    candidate =>
      candidate.condition === 'baseline' &&
      candidate.contentFingerprint === session.contentFingerprint &&
      candidate.skill === session.skill &&
      candidate.responseCount > 0
  );
}

export function compareWithBaseline(
  session: SessionSummary,
  sessions = loadSessions()
): DualTaskComparison | undefined {
  const baseline = findMatchedBaseline(session, sessions);
  if (!baseline) return undefined;

  const accuracyCostPoints = (baseline.learningAccuracy - session.learningAccuracy) * 100;
  const latencyCostPercent = baseline.averageLatencyMs > 0
    ? ((session.averageLatencyMs - baseline.averageLatencyMs) / baseline.averageLatencyMs) * 100
    : null;

  return {
    baselineSessionId: baseline.id,
    accuracyCostPoints,
    latencyCostPercent,
  };
}
