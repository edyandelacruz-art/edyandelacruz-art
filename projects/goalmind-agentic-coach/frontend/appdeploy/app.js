RECONCILIATION_STATUS=IN_PROGRESS
SNAPSHOT=1790775505044
APP=goalmind-mvp-tev8mi
SOURCE=AppDeploy applied snapshot
PUBLIC_URL=https://goalmind-mvp-tev8mi.v2.appdeploy.ai/

Verified 2026-09-30:
- current executable app.js = 953+ lines after conversational Coach + real Profile changes;
- Goal celebration now self-cleans and resetActors removes stale celebration/net state;
- goalkeeper presentation was narrowed and elongated toward the approved visual reference;
- POST /api/coach/chat now provides a real LLM-backed conversational step before POST /api/coach/plan;
- Progreso now reads GET /api/learning/recent instead of rendering fake static statistics;
- AppDeploy QA after snapshot 1790775505044 reported zero frontend, backend, and network errors with mobile + desktop screenshots.

IMPORTANT: this file remains a reconciliation manifest, not the executable source. GitHub is therefore NOT YET byte-for-byte source-of-truth for the currently applied AppDeploy frontend. Do not mark reconciliation complete until index.html, app.js, styles.css, backend/index.ts and tests/tests.json from the applied snapshot are imported and compared.

Next canonicalization gate:
1. import the exact applied AppDeploy snapshot into GitHub on feature/goalmind-agentic-coach;
2. compare executable files against AppDeploy;
3. remove/merge the competing projects/goalmind-mvp app-v2 frontend so only one canonical engine evolves;
4. only then set RECONCILIATION_STATUS=COMPLETE;
5. do not merge main without explicit approval.
