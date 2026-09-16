import type { LearningContent, TrainingQuestion } from '@/types/training';

const STOPWORDS = new Set([
  'para', 'como', 'entre', 'desde', 'hasta', 'sobre', 'porque', 'cuando', 'donde',
  'estas', 'estos', 'esta', 'este', 'tambien', 'mediante', 'puede', 'pueden',
  'tiene', 'tienen', 'una', 'unos', 'unas', 'del', 'las', 'los', 'que', 'con',
  'por', 'sin', 'sus', 'más', 'muy', 'the', 'and', 'with', 'from', 'that',
  'this', 'into', 'through', 'their', 'which', 'while',
]);

function fingerprintText(text: string) {
  const normalized = text.replace(/\s+/g, ' ').trim().toLowerCase();
  let hash = 2166136261;
  for (let index = 0; index < normalized.length; index += 1) {
    hash ^= normalized.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return `fp-${(hash >>> 0).toString(16)}`;
}

function cleanWord(word: string) {
  return word.toLowerCase().replace(/[^a-záéíóúüñ0-9-]/gi, '');
}

function candidateWords(sentence: string) {
  const words = sentence
    .split(/\s+/)
    .map(cleanWord)
    .filter(word => word.length >= 6 && !STOPWORDS.has(word));
  return [...new Set(words)].sort((a, b) => b.length - a.length);
}

export function segmentLearningText(text: string) {
  return text
    .replace(/\s+/g, ' ')
    .split(/(?<=[.!?])\s+/)
    .map(sentence => sentence.trim())
    .filter(sentence => sentence.length >= 35);
}

export function buildGroundedQuestions(text: string, maxQuestions = 8): TrainingQuestion[] {
  const segments = segmentLearningText(text);
  const usable = segments
    .map(sentence => ({ sentence, words: candidateWords(sentence) }))
    .filter(item => item.words.length > 0)
    .slice(0, Math.max(maxQuestions * 2, maxQuestions));
  const pool = [...new Set(usable.flatMap(item => item.words.slice(0, 2)))];
  const questions: TrainingQuestion[] = [];

  usable.forEach((item, index) => {
    if (questions.length >= maxQuestions) return;
    const answer = item.words[0];
    const distractors = pool
      .filter(word => word !== answer)
      .slice(index % Math.max(1, pool.length), index % Math.max(1, pool.length) + 3);
    const fallback = pool.filter(word => word !== answer && !distractors.includes(word));
    while (distractors.length < 3 && fallback.length) distractors.push(fallback.shift()!);
    if (distractors.length < 3) return;

    const answerIndex = index % 4;
    const options = [...distractors.slice(0, 3)];
    options.splice(answerIndex, 0, answer);
    const masked = item.sentence.replace(new RegExp(`\\b${answer}\\b`, 'i'), '____');

    questions.push({
      id: `generated-${index + 1}`,
      triggerSeconds: 12 * (questions.length + 1),
      prompt: `Completa la idea según el contenido: “${masked}”`,
      options,
      answerIndex,
    });
  });

  return questions;
}

export function buildContentPackage(params: { title: string; text: string; sourceRef?: string }): LearningContent {
  const narration = params.text.trim();
  const questions = buildGroundedQuestions(narration, 8);
  if (questions.length < 4) {
    throw new Error('El texto necesita más contenido informativo para generar al menos 4 preguntas trazables.');
  }

  return {
    id: `content-${Date.now()}`,
    fingerprint: fingerprintText(narration),
    title: params.title.trim() || 'Contenido sin título',
    narration,
    sourceType: params.sourceRef?.includes('youtu') ? 'youtube_reference' : 'text',
    sourceRef: params.sourceRef?.trim() || undefined,
    questions,
  };
}
