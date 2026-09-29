# GoalMind backend

This directory is the deployment boundary for the GoalMind Coach API. The agent runtime is mirrored from `projects/goalmind-agentic-coach/backend/index.ts` before public deployment.

V2 frontend routes expected here:
- `POST /api/coach/plan`
- `POST /api/coach/result`
- `GET /api/coach/history`

Material ingestion routes from the currently deployed MVP must be merged before release so PDF/YouTube/text support is preserved.
