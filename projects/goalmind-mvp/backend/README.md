# GoalMind V2 backend

Standalone AppDeploy backend for the player V2.

## Live routes
- `GET /api/_healthcheck` — reports backend version.
- `POST /api/material/store` — ingests private text, YouTube public content, or images and stores extracted content scoped to a guest session.
- `POST /api/coach/plan` — GoalMind Coach manager loop: Scout retrieves GoalMind/Wikipedia/OpenAlex plus optional private material; Game Master creates the match; Referee validates questions and source references; Memory stores the plan.
- `GET /api/coach/history` — returns recent stored plans.
- `POST /api/coach/result` — stores match performance in canonical 0–100 accuracy so future Coach runs can adapt through `get_recent_learning`.

The backend is physically contained in this project and does not depend on a sibling GoalMind directory at deploy time.
