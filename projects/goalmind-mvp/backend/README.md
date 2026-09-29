# GoalMind V2 backend

Standalone AppDeploy backend for the player V2.

## Live routes
- `GET /api/_healthcheck` — reports backend version.
- `POST /api/material/store` — ingests private text, YouTube public content, or images and stores extracted content scoped to a guest session.
- `POST /api/coach/plan` — GoalMind Coach manager loop: Scout retrieves GoalMind/Wikipedia/OpenAlex plus optional private material; Game Master creates the match; Referee validates questions and source references; Memory stores the plan.
- `GET /api/coach/history` — returns recent stored plans.
- `POST /api/coach/result` — stores match performance in canonical 0–100 accuracy so future Coach runs can adapt through `get_recent_learning`.

## Material pipeline
The V2 frontend now opens a real Material panel. PDFs are read client-side, scanned PDFs fall back to page images, image material is extracted server-side, text files/pasted text are stored directly, and YouTube URLs are processed from recoverable public content. A stored material ID is injected into the Coach request as a private `GMATERIAL` token and returned to Scout as a `Materials` source.

The backend is physically contained in this project and does not depend on a sibling GoalMind directory at deploy time.
