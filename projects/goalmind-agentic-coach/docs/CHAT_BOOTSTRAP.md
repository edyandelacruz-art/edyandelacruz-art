# GoalMind — Chat bootstrap / recovery

Purpose: prevent context loss when a new ChatGPT/Codex session is required.

## First action in a new chat

Before discussing deployment, load/connect the deployment connector FIRST. Preferred order:

1. Vercel connector
2. GitHub connector
3. Google Drive connector
4. AppDeploy connector when needed

If the Vercel connector is not usable in that session, do not waste time asking the user to repeat project context. Continue code work through GitHub and use this document as the handoff state.

## Canonical project context

- Product: GoalMind
- Canonical GitHub repository: `edyandelacruz-art/edyandelacruz-art`
- Working branch: `feature/goalmind-agentic-coach`
- PR: #6
- Do not merge `main` without explicit user approval.
- GitHub is source of truth for code.
- Google Drive is source of truth for human documentation.
- Master Drive folder: `ChatGPT/00_SISTEMA_MAESTRO_APPS_WEB_IA`
- Master protocol doc: `PROTOCOLO_MAESTRO_DESARROLLO_CONTINUO_APPS_WEB_IA_2026`

## Product architecture

Canonical loop:

`Student conversation/material -> Coach Orchestrator -> Scout -> Game Master -> Referee -> Match Engine -> Learning Memory -> next Coach turn`

The LLM is behind contracts and tools. Validation, permissions, persistence, game rules and match outcomes remain deterministic.

## Current functional direction

- `Preparar mi partido` must start a real conversation with GoalMind Coach, not behave like a static form.
- Coach chat uses an LLM-backed route before plan generation.
- Match result rules are deterministic: correct = goal; incorrect/timeout = save.
- After every goal/save/timeout, the game must PAUSE on a pedagogical feedback card.
- The student must press `Siguiente jugada` (or `Ver resultado` on the last question) before advancing.
- Feedback must show the explanation and correct answer so the learner can read before continuing.
- Progress must use real learning-memory data, never fake/demo statistics.
- Goal celebration must clean itself before the next question.
- Keeper/player visual target is a slim, athletic, human-proportioned coded character matching the approved premium reference. Do not solve this by pasting the reference image as the app.
- Current keeper remains an intermediate implementation and is not visual-parity complete.

## Current performance work

The match scene has been hardened with:
- requestAnimationFrame for shot/keeper movement
- GPU/compositor hints for animated actors
- containment/isolation around the arena
- explicit cleanup of movement state between questions
- player-controlled Next flow to avoid forced automatic transitions

## Known P0 issues

1. AppDeploy and GitHub are not yet guaranteed byte-for-byte identical.
2. There are competing frontend trees (`projects/goalmind-agentic-coach` and `projects/goalmind-mvp`) that must be consolidated into one canonical executable tree.
3. Teacher/class mode still contains demo-like behavior unless/until a real room/realtime backend is implemented.
4. Sound UI should not imply a real audio engine until one exists.
5. Coach conversations still need durable server-side conversation state/trace IDs.
6. Keeper character/animation is still a major visual-quality gap.

## Deployment / preview state

- Existing AppDeploy app id: `goalmind-mvp-tev8mi`
- Existing AppDeploy public URL: `https://goalmind-mvp-tev8mi.v2.appdeploy.ai/`
- Historical applied snapshot referenced in docs: `1790775505044`
- Do not claim newer changes are deployed unless the deployment is actually verified.
- Vercel deployment should use the current GoalMind branch and must be verified with mobile + desktop QA, build/runtime logs, and the Coach -> match -> feedback Next -> result flow.

## Latest GitHub state to verify at session start

At the time this bootstrap file was created, the branch existed and was active. Always fetch the branch head at the start of a new session before writing code. Do not assume an old commit is still current.

Recent work already versioned before this file:
- pedagogical feedback + explicit `Siguiente jugada`
- match animation/performance cleanup
- adaptive memory/result validation hardening

## Required behavior for future execution

Do concrete work, not status-only reporting. In each run:

1. Fetch current branch head and relevant source files.
2. Identify highest-value incomplete block.
3. Implement it on `feature/goalmind-agentic-coach`.
4. Deploy only when connector/session permissions actually allow it.
5. Verify mobile + desktop and runtime/build errors.
6. Update master Drive docs when real state changes.
7. Report only after a substantive block, verified preview, or genuine blocker.

## User interaction rule

The user does not want to repeat project history just because a new chat was opened. Use this file plus GitHub/Drive as the recovery source and continue from the current branch state.
