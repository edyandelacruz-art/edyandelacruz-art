# FocusLab

FocusLab is an adaptive cognitive-learning platform that trains learners to capture, filter, switch, retain and recover academic information under controlled sensory and attentional load.

## Current audited status

**Overall development: 65%**

Detailed audit: [AUDIT_2026-09-16.md](./AUDIT_2026-09-16.md)

Roadmap: [ROADMAP.md](./ROADMAP.md)

## Canonical product direction

The approved visual mockups are now the official implementation target.

- [FOCUSLAB_MASTER_SPEC.md](./FOCUSLAB_MASTER_SPEC.md) — complete product behavior and experience specification.
- [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) — visual language, avatar system, bubbles, game HUD and mobile-first UI rules.
- [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md) — technical build order and migration plan for turning the mockups into the real product.

The redesign target is intentionally different from the current alpha shell: simpler screens, avatar onboarding, contextual bubbles, stronger game-specific visuals and less dashboard-style information density.

## Public alpha

https://focuslab-3x5ppr.v2.appdeploy.ai/

The public alpha is online and its current QA reports no frontend, backend or network errors. The latest local v0.6 source is ahead of the currently applied public snapshot. The next implementation cycle will rebuild the interface toward the newly approved avatar/neon/game-companion design system before production hardening.

## Product thesis

FocusLab does not classify students as fixed visual or auditory learners. It measures performance under different learning conditions and progressively trains attention control, working memory, inhibition, switching, processing speed, sustained attention, divided attention and recall.

## Six-game MVP

1. Runner — reaction and peripheral visual load
2. Tetris — spatial planning and sustained load
3. Road Dodge — tracking and inhibition
4. Pong — prediction and visual tracking
5. Snake — planning and working memory
6. Memory Grid — visual working memory and recall

All six are implemented through a shared game-host contract. The next redesign cycle will migrate their presentation toward the approved game-specific visual references while preserving measurement events.

## Eight cognitive targets

- Selective Attention
- Divided Attention
- Working Memory
- Inhibitory Control
- Switching
- Sustained Attention
- Processing Speed
- Recall

## Current v0.6 capabilities

- Home, Session Setup, Training Arena, Results, Progress, Explore and Profile.
- Six playable game environments.
- Editable real academic text source.
- Local source segmentation and traceable cloze-question generation.
- Browser narration.
- Timed question overlays.
- Adaptive game speed, answer time and pause policy.
- Baseline session without secondary game task.
- Dual-task session with game load.
- Content fingerprinting.
- Matched baseline-vs-dual-task accuracy and latency cost.
- Local session persistence.
- Session-derived skill and final-level progress.
- Honest empty states when no data exists.

## Important audit corrections

The v0.6 local pass removed or corrected UI elements that could imply more certainty than the system currently has:

- Removed arbitrary `Focus Index` presentation.
- Removed arbitrary composite `Cognitive score` presentation.
- Removed an unconnected starting-load slider.
- Removed the unenforced fixed `12 min` duration claim.
- A YouTube URL is now `youtube_reference`, not `youtube_transcript`, until a transcript is actually retrieved.
- Interference cost is shown only when a matched baseline exists.

## Content pipeline

Current:

`real text -> normalize -> segment -> local grounded questions -> narration -> training -> session trace`

Planned:

`YouTube/provider -> verified transcript -> semantic concepts -> AI questions -> grounding validation -> calibrated items`

Direct YouTube transcript retrieval is not connected yet.

## Question / audio policies

- `pause_all`: audio and game pause during the question.
- `pause_content`: academic audio pauses while the game continues.
- `continue_all`: audio and game continue while the learner answers.

Every response records the active policy.

## Design source

Figma: https://www.figma.com/design/VvK2nW8scKV7lHRd2gVP9f

The Figma file remains useful as a design workspace, but the canonical approved redesign direction is now documented in the three specification files above.

## Target implementation stack

- Next.js / React
- TypeScript
- Tailwind CSS
- shadcn/ui
- Motion
- Phaser
- Howler.js
- Zustand
- Supabase when backend capacity is available

## Infrastructure state

- AppDeploy alpha: active.
- GitHub project documentation: active.
- Canonical master specification: active.
- Dedicated FocusLab GitHub repository: pending.
- Vercel production project: pending.
- Supabase project/auth: pending due to current free-project capacity.
- Production monitoring: pending.

## Product principle

**Content first. Game second. Measurement always visible — and only when the data really exists.**
