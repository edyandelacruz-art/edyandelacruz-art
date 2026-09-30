# GoalMind — Architecture, product and development-engine audit

Date: 2026-09-30
Branch: `feature/goalmind-agentic-coach`
PR: #6
Public preview: `https://goalmind-mvp-tev8mi.v2.appdeploy.ai/`
Applied AppDeploy snapshot at audit close: `1790775505044`

## Executive diagnosis

GoalMind has a real core now: material ingestion, federated retrieval, LLM-backed Coach, validated question banks, playable match and adaptive result memory. The main risk is no longer absence of functionality; it is **architectural and product drift**. Too many surfaces still look like finished features while some are demo-only, two frontend implementations are evolving in parallel, and the current AppDeploy executable is not yet reproduced byte-for-byte in GitHub.

The product should be tightened around one canonical loop:

`Student conversation/material -> Coach Orchestrator -> Scout evidence -> Game Master plan -> Referee validation -> Match Engine -> Learning Memory -> next Coach turn`

Everything visible in the UI must either participate in that loop or be clearly marked unavailable until its backend exists.

## Work completed in this audit cycle

- Fixed persistent goal celebration: celebration overlay, goal glow and net-hit state are explicitly removed before the next question.
- Narrowed/elongated the goalkeeper presentation toward the approved athletic reference. This is an intermediate coded SVG treatment, **not final visual parity** with the approved reference.
- Added `POST /api/coach/chat` backed by `ai.run` so `Preparar mi partido` starts a real conversation with the Coach before plan generation.
- The Coach now asks for missing context, returns a normalized study goal and only enables construction when it has enough information.
- Existing `POST /api/coach/plan` remains the planning/orchestration stage after the conversation.
- Replaced fake static Progreso statistics with real `GET /api/learning/recent` data.
- Updated QA contract for Coach conversation, memory, and celebration cleanup.
- AppDeploy QA after the final cycle: no frontend, backend or network errors; mobile and desktop screenshots generated.

## Fable / Claude architecture alignment

The repository mirrors are treated as **architecture references, not executable runtimes or model weights**. The useful pattern to preserve is manager/orchestrator control with explicit tools, bounded workers, evidence, verification and persistence.

### Target responsibility split

**Coach Orchestrator**
- Owns the conversation and user-facing personality.
- Normalizes the student's goal.
- Decides which tools/workers are needed.
- Does not silently invent evidence.
- Does not directly own persistence implementation.

**Scout**
- Only retrieves evidence.
- Sources: GoalMind Library, private GMATERIAL, Wikipedia/OpenAlex and future approved curricular repositories.
- Returns typed source records and stable IDs.
- Never generates final questions.

**Game Master**
- Converts goal + learning memory + evidence into match parameters.
- Owns rival, OVR, time pressure, number/order/difficulty of questions and progression rules.
- Output must be schema validated.

**Referee**
- Deterministic final gate over AI output.
- Requires exactly four choices, one correct option, explanation, valid sourceRefs and no out-of-allowlist references.
- Should eventually validate duplicate/near-duplicate questions, ambiguity and reading-level constraints.

**Learning Memory**
- Owns durable result records and mastery summaries.
- LLMs read summaries; they are not the source of truth.
- Accuracy remains normalized 0–100 in persistence.

**Match Engine**
- Deterministic gameplay only.
- Correct answer = goal; incorrect/timeout = save.
- AI cannot arbitrarily reverse the outcome.
- Visual celebration/keeper animation is presentation over a deterministic result.

## Current architecture gaps

### P0 — source-of-truth split

The applied AppDeploy snapshot and GitHub are still not byte-for-byte identical. `projects/goalmind-agentic-coach/frontend/appdeploy/app.js` remains a reconciliation manifest. At the same time `projects/goalmind-mvp` contains another V2 implementation (`app-v2.js`, premium match CSS and related files). Two frontends must not keep evolving independently.

Required action: import exact AppDeploy executable files into the feature branch, compare them, choose one canonical frontend tree, then retire the duplicate tree to legacy only after verification.

### P0 — product surfaces that imply functionality that is not real

- **Modo docente / Partida de clase** currently shows a local demo lobby and fake connected students. This must either gain a real room/realtime backend or be visibly disabled/marked as preview. It must not look connected when it is not.
- **Sound toggle** changes UI state but does not yet represent a real audio engine. Implement actual sound/haptics or remove the control from production UI.
- **Home mini-match** is decorative; acceptable as marketing preview, but it should not be presented as proof of gameplay functionality.
- **Legacy `/api/questions/generate`** remains for rollback/compatibility. Keep it isolated and stop new UI work from depending on it.

### P0 — goalkeeper visual parity

The current keeper is coded SVG and now slimmer, but it still reads as an illustrated vector character rather than the approved premium sports-game reference. Do not mark this complete. The next visual implementation should use a proper articulated vector/skeletal character or a small canvas/WebGL rig with:
- narrower torso and longer limbs;
- stronger shoulder/hip anatomy;
- separate joints for shoulder/elbow/hip/knee;
- pose-specific dive silhouettes instead of rotating the whole body as one rigid object;
- perspective-aware scaling and landing/recovery states;
- no baked screenshot background.

### P0 — Coach conversation persistence

The new conversational Coach is real and LLM-backed, but transcript state currently lives primarily in the browser session. Add a server-side `conversationId`, bounded turn persistence, timestamps, trace ID and explicit lifecycle (`active`, `ready_to_plan`, `planned`, `closed`). This prevents losing the coaching context on refresh/device switch and creates an auditable agent trace.

## Development-engine audit

### What is working

- Feature branch + open PR; main is not merged automatically.
- AppDeploy supports rapid branch-like runtime iterations and rollback snapshots.
- Backend already uses bounded `ai.run` rather than an unbounded autonomous loop.
- AI output is post-validated before entering the game.
- QA contract includes mobile and desktop workflows.
- Public preview is available and current runtime reports clean frontend/backend/network QA.

### What must change

1. **One canonical executable tree.** GitHub must contain the exact deploy source. No parallel `app.js` versus `app-v2.js` evolution.
2. **PR preview discipline.** Every relevant PR revision should map to a reproducible preview version and evidence set: URL, snapshot/commit, mobile screenshot, desktop screenshot, console/network result and smoke-test result.
3. **Automated contract tests.** Add CI that checks schema validators, material tokens, source allowlist, accuracy normalization and deterministic match outcomes independent of browser visuals.
4. **Visual regression.** Store approved reference criteria and compare the match scene at 390x844 and desktop. QA should fail if the keeper/goal/HUD regress structurally.
5. **Observability.** Generate one trace ID per Coach request and carry it through Scout, Game Master, Referee and result persistence. Log step, duration, source count, validation rejections and model failure without logging private material contents.
6. **Failure budgets.** Define timeouts/retry limits for Wikipedia/OpenAlex/LLM calls and keep deterministic fallback behavior. External search failure must not corrupt the match.
7. **Security boundary.** Keep private material separated by guest/user namespace, cap payloads, sanitize stored labels, retain no secrets in source and define retention/deletion rules before real student accounts.
8. **No fake UI.** A control is shipped only when its action is implemented and testable. Otherwise it is disabled, hidden or explicitly labeled upcoming.

## Recommended target modules

```text
apps/goalmind/
  frontend/
    coach/
    materials/
    match/
    progress/
    shared/
  backend/
    coach/
      chat.ts
      orchestrator.ts
    scout/
      library.ts
      wikipedia.ts
      openalex.ts
      material.ts
    game-master/
      planner.ts
    referee/
      validator.ts
    memory/
      results.ts
      mastery.ts
      conversations.ts
    api/
  contracts/
    coach.schema.ts
    source.schema.ts
    question.schema.ts
    match.schema.ts
  tests/
    unit/
    integration/
    e2e/
    visual/
```

The LLM should sit **behind contracts**, not be the architecture. The application core owns validation, permissions, persistence, game rules and state transitions.

## Priority sequence

### P0 now
1. Reconcile exact AppDeploy snapshot into GitHub and collapse duplicate frontend engines.
2. Finish keeper rig to visual-reference quality and add pose-specific dives/recovery.
3. Persist Coach conversations server-side with trace IDs.
4. Remove or clearly disable fake Teacher/Class and non-functional sound surfaces.
5. Run real E2E against Coach -> plan -> match -> result -> Progreso and Material -> Coach -> match.

### P1
- Real teacher rooms/realtime only after a room/session data model exists.
- Authentication and stable learner profiles.
- Topic/mastery model instead of only recent-result averages.
- GoalMind curricular repository with traceable content ownership/versioning.
- Audio/haptic engine and user preference persistence.

### P2
- Career/championship progression.
- Async challenges and realtime 1v1.
- Clubs/school leagues with child-safe social boundaries.
- Android packaging only after web state, auth and persistence are stable.

## Release gate

GoalMind is not V2-ready merely because the URL opens. A V2 release requires:
- canonical GitHub code equals deployed executable;
- Coach conversation + planning + sources + Referee + memory work end-to-end;
- private material flow passes E2E;
- no fake connected/data surfaces;
- approved match visual reference passes mobile visual QA;
- keeper is no longer the obvious visual-quality bottleneck;
- console/network clean;
- rollback version recorded;
- Drive documentation synchronized.
