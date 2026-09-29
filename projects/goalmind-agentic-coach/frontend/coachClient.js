import { api } from '@appdeploy/client';

export function getGoalMindGuestId() {
  let guestId = localStorage.getItem('goalmind_guest_id');
  if (!guestId) {
    const token = globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2, 12)}`;
    guestId = `gm-${token}`.replace(/[^a-zA-Z0-9-]/g, '').slice(0, 72);
    localStorage.setItem('goalmind_guest_id', guestId);
  }
  return guestId;
}

export async function askGoalMindCoach(message, count = 5) {
  const prompt = String(message || '').trim();
  if (prompt.length < 12) {
    throw new Error('Cuéntame un poco más sobre lo que quieres estudiar.');
  }

  const response = await api.post('/api/coach/plan', {
    guestId: getGoalMindGuestId(),
    message: prompt,
    count: count === 10 ? 10 : 5,
  });

  return response.data;
}

export async function loadGoalMindCoachHistory() {
  const guestId = encodeURIComponent(getGoalMindGuestId());
  const response = await api.get(`/api/coach/history?guestId=${guestId}`);
  return Array.isArray(response.data?.items) ? response.data.items : [];
}

export async function saveGoalMindMatchResult(result) {
  const response = await api.post('/api/coach/result', {
    guestId: getGoalMindGuestId(),
    planId: result.planId || null,
    subject: result.subject || '',
    topic: result.topic || '',
    accuracy: Number(result.accuracy || 0),
    score: Number(result.score || 0),
    avgSeconds: Number(result.avgSeconds || 0),
    correct: Number(result.correct || 0),
    total: Number(result.total || 0),
  });

  return response.data;
}

export function installCoachBank(bankRegistry, coachResponse) {
  if (!coachResponse?.plan?.questions?.length) {
    throw new Error('El Coach no devolvió preguntas jugables.');
  }

  bankRegistry.agentico = {
    label: coachResponse.plan.subject || 'GoalMind Coach',
    icon: '✦',
    subtitle: coachResponse.plan.title || 'Partido agéntico',
    questions: coachResponse.plan.questions,
  };

  return {
    subjectKey: 'agentico',
    difficulty: coachResponse.plan.level || 'Intermedio',
    seconds: Math.max(5, Math.min(20, Number(coachResponse.plan.secondsPerQuestion || 8))),
    planId: coachResponse.planId || null,
    sources: coachResponse.sources || [],
    trace: coachResponse.trace || [],
  };
}
