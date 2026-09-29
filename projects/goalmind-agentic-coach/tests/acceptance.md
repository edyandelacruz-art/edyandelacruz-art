# GoalMind Agentic Coach — Acceptance

## 1. Intent -> federated retrieval -> match

Input:

`Estoy en 8.º y quiero practicar fotosíntesis durante 10 minutos.`

Expected:

- Coach returns grade, subject, focus and objectives.
- Scout consults at least one connected source set.
- Response includes source metadata from GoalMind, Wikipedia and/or OpenAlex when available.
- Game Master returns opponent name, OVR and seconds per question.
- Referee returns at least 3 valid questions, each with exactly 4 alternatives and one correct index 0-3.
- Plan is persisted and returns `planId`.

## 2. Persistent memory

After creating a plan, call `GET /api/coach/history?guestId=<same guestId>`.

Expected: the plan appears without regenerating it.

## 3. Adaptive result memory

Complete a match and call `POST /api/coach/result`.

Expected: the performance is saved in `study_results:<guestId>` and can be returned by `get_recent_learning` on the next Coach run.

## 4. Guardrail

Input: `hola`

Expected: 400 error explaining that more study intent is required; no LLM call should be needed.

## 5. Source integrity

Expected:

- `sourceRefs` in generated questions may only reference IDs returned by Scout.
- External source outages must not break the local GoalMind catalog.
- No external source metadata is represented as a full verified textbook source when only title/metadata is available.
