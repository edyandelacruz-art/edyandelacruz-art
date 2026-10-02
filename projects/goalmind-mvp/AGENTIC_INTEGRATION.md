# GoalMind V2 — integrated agentic runtime

The primary player frontend now expects the Coach runtime under the same GoalMind application boundary.

Required endpoints:

- `POST /api/coach/plan`
- `POST /api/coach/result`
- `GET /api/coach/history`

The current agent runtime uses:

1. Coach — intent manager.
2. Scout — GoalMind catalog + Wikipedia + OpenAlex retrieval.
3. Game Master — match/difficulty/opponent construction.
4. Referee — validates four-option questions and source references.
5. Memory — persists plans and match results by guest player id.

The frontend renders returned trace steps and actual source counts. It does not fabricate retrieval success.

Before public deployment, merge the existing PDF/YouTube/text question-generation routes into the same backend entrypoint so V2 does not regress material ingestion.
