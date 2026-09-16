# FocusLab — Open Source Stack

Status: approved engineering foundations
Date: 2026-09-16

This document records the external open-source foundations selected to help build the approved FocusLab experience. These projects provide infrastructure and primitives; FocusLab keeps its own product identity, design language, analytics and cognitive-training logic.

## 1. Game runtime — Phaser

Repository: https://github.com/phaserjs/phaser

Use in FocusLab:

- Runner scene
- Road Dodge scene
- Pong scene
- Snake scene
- Memory Grid scene
- Tetris scene
- input handling
- scene lifecycle
- animation / tweening
- WebGL / Canvas rendering
- mobile game interaction

FocusLab requirement: every Phaser game talks to the app through a shared `FocusGameAdapter`; analytics must never depend on Phaser internals.

## 2. UI primitives — shadcn/ui

Repository: https://github.com/shadcn-ui/ui

Use in FocusLab:

- dialogs
- accessible buttons
- sheets / popovers
- form primitives
- focus management
- keyboard behavior

FocusLab requirement: do not use default shadcn appearance. Components must be restyled to the canonical FocusLab design system.

## 3. Styling — Tailwind CSS

Repository: https://github.com/tailwindlabs/tailwindcss

Use in FocusLab:

- responsive layout
- spacing
- typography
- glow / gradient composition
- mobile-first states
- design tokens

## 4. UI motion — Motion

Repository: https://github.com/motiondivision/motion

Use in FocusLab:

- avatar selection spring
- bubble entrance / exit
- screen transitions
- question overlay entrance
- correct / incorrect microfeedback
- button press feedback
- progress animation

FocusLab requirement: animation must support reduced-motion and must never compete with the cognitive task.

## 5. Audio runtime — Howler.js

Repository: https://github.com/goldfire/howler.js

Use in FocusLab:

- game sound effects
- UI feedback sounds
- reliable pause / resume
- audio volume state
- future content audio provider abstraction

FocusLab requirement: training content audio and game audio must remain separately controllable.

## 6. Client state — Zustand

Repository: https://github.com/pmndrs/zustand

Use in FocusLab:

- selected avatar
- display name
- current training session
- selected skill
- selected game
- audio state
- temporary UI state

Persistent learning data should not remain only in Zustand when cloud storage becomes available.

## 7. Backend client — Supabase JS

Repository: https://github.com/supabase/supabase-js

Use when backend capacity is available:

- authentication
- profile persistence
- avatar/profile settings
- training sessions
- response events
- content sources
- storage
- teacher/student role data

FocusLab requirement: RLS on exposed tables and no service-role credential in the browser.

## 8. Avatar prototyping — DiceBear

Repository: https://github.com/dicebear/dicebear

Use in FocusLab:

- optional early deterministic avatar fallback
- profile placeholder generation
- rapid avatar picker prototyping

Important: the canonical FocusLab companion art direction is custom and should ultimately match the approved owl / robot / fox / astronaut / cat / gamer set. DiceBear is a fallback/prototyping aid, not the final visual identity.

## 9. Application framework — Next.js

Repository: https://github.com/vercel/next.js

Use in FocusLab:

- application shell
- routing
- React rendering
- static / server architecture as product evolves
- Vercel deployment target

## Integration order

1. Keep existing Next.js app shell.
2. Add canonical design tokens.
3. Add shared UI primitives.
4. Add avatar state and onboarding.
5. Add Motion microinteractions.
6. Introduce Phaser game adapter.
7. Migrate games one by one.
8. Introduce Howler audio controller.
9. Move local state into structured Zustand stores where useful.
10. Connect Supabase when project capacity is available.

## Rule

Use these repositories to improve implementation quality, not to make FocusLab look like another product. FocusLab owns the visual identity defined in `DESIGN_SYSTEM.md` and the behavior defined in `FOCUSLAB_MASTER_SPEC.md`.
