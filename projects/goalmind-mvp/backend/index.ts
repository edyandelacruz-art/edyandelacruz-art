import { ai, db, router, json, error } from '@appdeploy/sdk';

type GeneratedQuestion = {
  q: string;
  a: string[];
  correct: number;
  note: string;
  sourceRefs?: string[];
};

type SourceMeta = {
  id: string;
  origin: 'GoalMind' | 'Wikipedia' | 'OpenAlex' | 'Materials';
  title: string;
  description: string;
  url?: string;
  year?: number;
};

type CoachBody = { guestId?: string; message?: string; count?: number };
type MaterialBody = {
  guestId?: string;
  sourceType?: 'text' | 'youtube' | 'image';
  sourceName?: string;
  content?: string;
  url?: string;
  images?: Array<{ data: string; mimeType: string }>;
};
type ResultBody = {
  guestId?: string;
  planId?: string | null;
  subject?: string;
  topic?: string;
  accuracy?: number;
  score?: number;
  avgSeconds?: number;
  correct?: number;
  total?: number;
};

type StoredMaterial = {
  id?: string;
  createdAt?: string;
  sourceType?: string;
  sourceName?: string;
  content?: string;
  url?: string;
};

const TOPIC_CATALOG = [
  { id: 'gm-math-quadratic', title: 'Función cuadrática', subject: 'Matemáticas', grades: '9-11', description: 'Vértice, raíces, formas algebraicas, gráfica y modelación.' },
  { id: 'gm-math-fractions', title: 'Fracciones y números racionales', subject: 'Matemáticas', grades: '6-8', description: 'Equivalencia, operaciones, proporcionalidad y problemas.' },
  { id: 'gm-physics-kinematics', title: 'Cinemática', subject: 'Física', grades: '9-11', description: 'Posición, velocidad, aceleración y gráficas de movimiento.' },
  { id: 'gm-bio-genetics', title: 'Genética mendeliana', subject: 'Biología', grades: '8-11', description: 'Genes, alelos, dominancia, cruces y probabilidades.' },
  { id: 'gm-bio-photosynthesis', title: 'Fotosíntesis', subject: 'Biología', grades: '6-10', description: 'Reactivos, productos, cloroplasto, fase luminosa y ciclo de Calvin.' },
  { id: 'gm-history-ww2', title: 'Segunda Guerra Mundial', subject: 'Historia', grades: '9-11', description: 'Causas, frentes, actores, cronología y consecuencias.' },
  { id: 'gm-chem-stoich', title: 'Estequiometría', subject: 'Química', grades: '9-11', description: 'Mol, relaciones molares, reactivo limitante y rendimiento.' },
  { id: 'gm-language-reading', title: 'Comprensión lectora', subject: 'Lenguaje', grades: '6-11', description: 'Idea central, inferencia, evidencia, intención y estructura textual.' },
];

const coachResultSchema = {
  type: 'object',
  properties: {
    title: { type: 'string' }, subject: { type: 'string' }, grade: { type: 'string' }, focus: { type: 'string' }, level: { type: 'string' },
    durationMinutes: { type: 'number' }, secondsPerQuestion: { type: 'number' },
    opponent: { type: 'object', properties: { name: { type: 'string' }, rating: { type: 'number' }, style: { type: 'string' } }, required: ['name', 'rating', 'style'] },
    objectives: { type: 'array', items: { type: 'string' } }, route: { type: 'array', items: { type: 'string' } },
    questions: { type: 'array', items: { type: 'object', properties: {
      q: { type: 'string' }, a: { type: 'array', items: { type: 'string' } }, correct: { type: 'number' }, note: { type: 'string' }, sourceRefs: { type: 'array', items: { type: 'string' } },
    }, required: ['q', 'a', 'correct', 'note', 'sourceRefs'] } },
  },
  required: ['title', 'subject', 'grade', 'focus', 'level', 'durationMinutes', 'secondsPerQuestion', 'opponent', 'objectives', 'route', 'questions'],
};

const imageTextSchema = {
  type: 'object',
  properties: { title: { type: 'string' }, text: { type: 'string' } },
  required: ['title', 'text'],
};

function cleanGuestId(value: unknown) {
  const guestId = String(value || '').trim();
  return /^[a-zA-Z0-9-]{12,80}$/.test(guestId) ? guestId : '';
}
function stripTags(value: unknown) { return String(value || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim(); }
function isYoutubeUrl(value: string) {
  try { return ['youtube.com', 'www.youtube.com', 'm.youtube.com', 'youtu.be'].includes(new URL(value).hostname.toLowerCase()); }
  catch { return false; }
}

function normalizeQuestions(value: unknown, count: number, allowedIds: Set<string>) {
  const data = value as { title?: unknown; questions?: unknown };
  const raw = Array.isArray(data?.questions) ? data.questions : [];
  const fallbackRef = [...allowedIds][0];
  const questions: GeneratedQuestion[] = raw.map(item => {
    const q = item as Partial<GeneratedQuestion>;
    const sourceRefs = Array.isArray(q.sourceRefs)
      ? q.sourceRefs.map(String).filter(id => allowedIds.has(id)).slice(0, 4)
      : [];
    if (!sourceRefs.length && fallbackRef) sourceRefs.push(fallbackRef);
    return {
      q: String(q.q || '').trim(), a: Array.isArray(q.a) ? q.a.slice(0, 4).map(v => String(v).trim()) : [],
      correct: Number(q.correct), note: String(q.note || '').trim(), sourceRefs,
    };
  }).filter(q => q.q.length > 0 && q.a.length === 4 && q.a.every(Boolean) && Number.isInteger(q.correct) && q.correct >= 0 && q.correct <= 3 && q.note.length > 0 && q.sourceRefs && q.sourceRefs.length > 0).slice(0, count);
  return { title: String(data?.title || 'Mi material').trim().slice(0, 80), questions };
}

async function searchFederated(query: string): Promise<SourceMeta[]> {
  const clean = query.trim().slice(0, 180);
  const lower = clean.toLowerCase();
  const local: SourceMeta[] = TOPIC_CATALOG
    .filter(topic => `${topic.title} ${topic.subject} ${topic.description}`.toLowerCase().includes(lower) || lower.split(/\s+/).some(token => token.length > 3 && `${topic.title} ${topic.description}`.toLowerCase().includes(token)))
    .slice(0, 3).map(topic => ({ id: topic.id, origin: 'GoalMind', title: topic.title, description: `${topic.subject} · grados ${topic.grades}. ${topic.description}` }));

  const wikipediaTask = (async () => {
    const response = await fetch(`https://es.wikipedia.org/w/rest.php/v1/search/page?q=${encodeURIComponent(clean)}&limit=4`, { headers: { 'Api-User-Agent': 'GoalMind/0.4 educational-study-agent' } });
    if (!response.ok) return [] as SourceMeta[];
    const data = await response.json() as { pages?: Array<{ id?: number; title?: string; description?: string; excerpt?: string; key?: string }> };
    return (data.pages || []).slice(0, 4).map(page => ({ id: `wiki-${page.id || page.key || page.title}`, origin: 'Wikipedia' as const, title: String(page.title || 'Wikipedia'), description: stripTags(page.description || page.excerpt).slice(0, 420), url: page.key ? `https://es.wikipedia.org/wiki/${encodeURIComponent(page.key)}` : undefined }));
  })();

  const openAlexTask = (async () => {
    const response = await fetch(`https://api.openalex.org/works?search=${encodeURIComponent(clean)}&per-page=4&select=id,doi,display_name,publication_year,cited_by_count`, { headers: { 'User-Agent': 'GoalMind/0.4 educational-study-agent' } });
    if (!response.ok) return [] as SourceMeta[];
    const data = await response.json() as { results?: Array<{ id?: string; doi?: string | null; display_name?: string; publication_year?: number; cited_by_count?: number }> };
    return (data.results || []).slice(0, 4).map(work => ({ id: String(work.id || work.doi || work.display_name || 'openalex'), origin: 'OpenAlex' as const, title: String(work.display_name || 'Trabajo académico'), description: `Trabajo académico${work.publication_year ? ` · ${work.publication_year}` : ''}${typeof work.cited_by_count === 'number' ? ` · ${work.cited_by_count} citas` : ''}`, url: work.doi || work.id, year: work.publication_year }));
  })();

  const [wiki, openAlex] = await Promise.allSettled([wikipediaTask, openAlexTask]);
  return [...local, ...(wiki.status === 'fulfilled' ? wiki.value : []), ...(openAlex.status === 'fulfilled' ? openAlex.value : [])].slice(0, 10);
}

async function recentLearning(guestId: string) {
  const results = await db.list(`study_results:${guestId}`, { limit: 8 });
  return results.items.slice(-8).map(item => ({ subject: item.subject, topic: item.topic, accuracy: item.accuracy, avgSeconds: item.avgSeconds, score: item.score, createdAt: item.createdAt }));
}

async function getMaterial(guestId: string, token: string): Promise<StoredMaterial | null> {
  const result = await db.list(`study_materials:${guestId}`, { limit: 40 });
  return (result.items.find(item => item.id === token) as StoredMaterial | undefined) || null;
}

export const handler = router({
  'GET /api/_healthcheck': [async () => json({ message: 'Success', version: '0.4-agentic-materials' })],

  'POST /api/material/store': [async ({ body }) => {
    const input = (body || {}) as MaterialBody;
    const guestId = cleanGuestId(input.guestId);
    if (!guestId) return error('Sesión de jugador inválida.', 400);
    let content = '';
    let sourceName = String(input.sourceName || 'Mi material').trim().slice(0, 120);
    let sourceType = String(input.sourceType || 'text');
    let sourceUrl = '';
    try {
      if (input.sourceType === 'youtube') {
        const url = String(input.url || '').trim();
        if (!isYoutubeUrl(url)) return error('Usa un enlace válido de YouTube.', 400);
        const scraped = await ai.scrape({ url });
        if (scraped.status >= 400) return error('No pudimos leer contenido público del video.', 502);
        content = scraped.text.trim().slice(0, 60000);
        if (content.length < 240) return error('YouTube no expuso suficiente contenido público. Puedes pegar la transcripción como texto.', 422);
        sourceName = scraped.title?.trim().slice(0, 120) || sourceName;
        sourceUrl = url;
      } else if (input.sourceType === 'image') {
        const images = Array.isArray(input.images) ? input.images.slice(0, 5).filter(x => x?.data && x?.mimeType?.startsWith('image/')) : [];
        if (!images.length) return error('No recibimos una imagen válida.', 400);
        const extracted = await ai.extract({ images, prompt: 'Extrae fielmente el contenido académico visible. Conserva fórmulas, términos, datos y estructura suficiente para generar preguntas. No inventes información.', schema: imageTextSchema, maxRetries: 2, maxTokens: 3000, thinkingMode: 'FAST' });
        const data = extracted.data as { title?: unknown; text?: unknown };
        content = String(data?.text || '').trim().slice(0, 60000);
        sourceName = String(data?.title || sourceName).trim().slice(0, 120);
      } else {
        content = String(input.content || '').trim().slice(0, 60000);
        if (content.length < 120) return error('El material tiene muy poco contenido para crear un buen entrenamiento.', 400);
        sourceType = 'text';
      }
      if (content.length < 120) return error('No pudimos extraer suficiente contenido del material.', 422);
      const [id] = await db.add(`study_materials:${guestId}`, [{ createdAt: new Date().toISOString(), sourceType, sourceName, url: sourceUrl || undefined, content }]);
      if (!id) return error('No pudimos guardar el material.', 500);
      return json({ token: id, sourceName, sourceType, chars: content.length });
    } catch (err) {
      console.error('GoalMind material ingest failed', err);
      return error('No pudimos procesar este material.', 502);
    }
  }],

  'POST /api/coach/plan': [async ({ body }) => {
    const input = (body || {}) as CoachBody;
    const guestId = cleanGuestId(input.guestId);
    const message = String(input.message || '').trim().slice(0, 1600);
    const count = input.count === 10 ? 10 : 5;
    if (!guestId) return error('No pudimos identificar esta sesión de jugador.', 400);
    if (message.length < 12) return error('Cuéntame un poco más: tema, grado, objetivo o dificultad que buscas.', 400);

    const tokenMatch = message.match(/\[GMATERIAL:([a-zA-Z0-9-]+)\]/);
    const material = tokenMatch ? await getMaterial(guestId, tokenMatch[1]) : null;
    const materialSource: SourceMeta | null = material ? { id: `material-${tokenMatch![1]}`, origin: 'Materials', title: String(material.sourceName || 'Material del estudiante'), description: `${material.sourceType || 'archivo'} privado · ${String(material.content || '').length} caracteres`, url: material.url } : null;
    const materialContext = material ? `\n\nMATERIAL PRIVADO DEL ESTUDIANTE (prioridad alta; úsalo como fuente):\n${String(material.content || '').slice(0, 36000)}` : '';
    let retrievedSources: SourceMeta[] = materialSource ? [materialSource] : [];
    const trace: string[] = ['Coach: intención interpretada'];
    if (materialSource) trace.push('Scout: material privado cargado');

    try {
      const result = await ai.run({
        system: `Eres GoalMind Coach, manager pedagógico agéntico. Roles internos: Coach interpreta intención; Scout recupera fuentes; Game Master diseña el partido; Referee valida antes de publicar. Debes usar search_sources al menos una vez. Consulta get_recent_learning cuando sea útil. Si existe MATERIAL PRIVADO, úsalo como fuente prioritaria. No inventes sourceRefs: solo IDs devueltos por search_sources. Cada pregunta tiene exactamente cuatro opciones, una sola correcta, explicación breve y referencias. Ajusta rival, dificultad y tiempo al grado y rendimiento. Produce ${count} preguntas en español.`,
        prompt: `Petición del estudiante: ${message.replace(/\[GMATERIAL:[^\]]+\]/g, '').trim()}${materialContext}`,
        tools: [
          { name: 'search_sources', description: 'Busca el tema en GoalMind Library, Wikipedia y OpenAlex; incluye el material privado ya cargado cuando exista.', parameters: { type: 'object', properties: { query: { type: 'string' } }, required: ['query'] } },
          { name: 'get_recent_learning', description: 'Devuelve resultados recientes para adaptar nivel y rival.', parameters: { type: 'object', properties: {} } },
          { name: 'emit_result', description: 'Entrega el plan final verificado y preguntas listas para jugar.', parameters: coachResultSchema },
        ],
        onToolCall: async (name, args) => {
          if (name === 'search_sources') {
            trace.push('Scout: repositorios consultados');
            const publicSources = await searchFederated(String(args.query || message));
            const merged = [...(materialSource ? [materialSource] : []), ...publicSources];
            retrievedSources = Array.from(new Map(merged.map(source => [source.id, source])).values()).slice(0, 11);
            return retrievedSources;
          }
          if (name === 'get_recent_learning') {
            trace.push('Coach: historial de juego consultado');
            return recentLearning(guestId);
          }
          return { ok: false, reason: 'unknown_tool' };
        },
        maxSteps: 6,
        maxTokens: count === 10 ? 6200 : 4300,
        thinkingMode: 'FAST',
      });

      const rawPlan = result.data as Record<string, unknown> | undefined;
      if (!rawPlan) return error('El Coach no pudo cerrar un plan válido.', 422);
      const allowedIds = new Set(retrievedSources.map(source => source.id));
      const normalized = normalizeQuestions({ title: rawPlan.title, questions: rawPlan.questions }, count, allowedIds);
      if (normalized.questions.length < 3) return error('El Referee rechazó demasiadas preguntas. Intenta especificar mejor el tema.', 422);
      const plan = {
        title: String(rawPlan.title || normalized.title).slice(0, 100), subject: String(rawPlan.subject || 'Tema personalizado').slice(0, 60), grade: String(rawPlan.grade || 'No especificado').slice(0, 40), focus: String(rawPlan.focus || message).slice(0, 180), level: String(rawPlan.level || 'Intermedio').slice(0, 30),
        durationMinutes: Math.max(3, Math.min(60, Number(rawPlan.durationMinutes) || 10)), secondsPerQuestion: Math.max(5, Math.min(20, Number(rawPlan.secondsPerQuestion) || 8)), opponent: rawPlan.opponent,
        objectives: Array.isArray(rawPlan.objectives) ? rawPlan.objectives.slice(0, 5).map(String) : [], route: Array.isArray(rawPlan.route) ? rawPlan.route.slice(0, 6).map(String) : [], questions: normalized.questions,
      };
      trace.push('Game Master: partido construido'); trace.push('Referee: preguntas y referencias verificadas');
      const [planId] = await db.add(`study_plans:${guestId}`, [{ createdAt: new Date().toISOString(), request: message, plan, sources: retrievedSources.slice(0, 11), materialToken: tokenMatch?.[1] || null }]);
      if (!planId) return error('No pudimos guardar el plan de estudio.', 500);
      trace.push('Memory: plan guardado');
      return json({ planId, plan, sources: retrievedSources, trace, steps: result.steps });
    } catch (err) {
      console.error('GoalMind Coach failed', err);
      return error('El Coach no pudo preparar este partido. Prueba con un tema más concreto.', 502);
    }
  }],

  'GET /api/coach/history': [async ({ query }) => {
    const guestId = cleanGuestId(query.guestId); if (!guestId) return error('Sesión inválida.', 400);
    const plans = await db.list(`study_plans:${guestId}`, { limit: 6 });
    return json({ items: plans.items.slice(-6).reverse().map(item => ({ id: item.id, createdAt: item.createdAt, request: item.request, title: item.plan && typeof item.plan === 'object' && 'title' in item.plan ? String((item.plan as { title?: unknown }).title || '') : '', subject: item.plan && typeof item.plan === 'object' && 'subject' in item.plan ? String((item.plan as { subject?: unknown }).subject || '') : '' })) });
  }],

  'POST /api/coach/result': [async ({ body }) => {
    const input = (body || {}) as ResultBody; const guestId = cleanGuestId(input.guestId); if (!guestId) return error('Sesión inválida.', 400);
    const rawAccuracy = Number(input.accuracy) || 0;
    const normalizedAccuracy = rawAccuracy <= 1 ? rawAccuracy * 100 : rawAccuracy;
    const record = { createdAt: new Date().toISOString(), planId: input.planId || null, subject: String(input.subject || '').slice(0, 80), topic: String(input.topic || '').slice(0, 120), accuracy: Math.max(0, Math.min(100, normalizedAccuracy)), score: Math.max(0, Number(input.score) || 0), avgSeconds: Math.max(0, Math.min(60, Number(input.avgSeconds) || 0)), correct: Math.max(0, Number(input.correct) || 0), total: Math.max(0, Number(input.total) || 0) };
    const [id] = await db.add(`study_results:${guestId}`, [record]); if (!id) return error('No pudimos guardar el resultado.', 500);
    return json({ id, saved: true, accuracy: record.accuracy });
  }],
});
