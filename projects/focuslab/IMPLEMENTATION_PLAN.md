# FocusLab — Implementation Plan

Status: active implementation plan
Date: 2026-09-16

## Goal

Turn the approved FocusLab visual references into the actual product without losing measurement integrity.

## Target architecture

### Application shell
- Next.js / React
- TypeScript
- Tailwind CSS
- shadcn/ui primitives where useful
- Motion for transitions and microinteractions
- Zustand for lightweight app/session state

### Game runtime
- Phaser for game scenes, animation, physics/input and mobile-friendly canvas rendering
- One shared adapter contract between every game and the FocusLab analytics layer

### Audio
- Howler.js for game/audio effects and reliable audio state control
- Web Speech / provider narration as a replaceable source layer

### Persistence
- localStorage adapter during alpha
- Supabase Auth + PostgreSQL + Storage when backend capacity is available

## Repository / dependency direction

Recommended open-source foundations:

- `phaserjs/phaser` — game runtime
- `shadcn-ui/ui` — accessible UI primitives
- `tailwindlabs/tailwindcss` — styling system
- `motiondivision/motion` — UI animation
- `goldfire/howler.js` — audio runtime
- `pmndrs/zustand` — client state
- `supabase/supabase-js` — future auth/database/storage client
- `dicebear/dicebear` — optional avatar generation/prototyping

These projects are dependencies/reference foundations; FocusLab should not copy their branding or visual identity.

## Phase A — Rebuild visual shell to approved mockup direction

### A1. Design tokens
- [ ] create central color tokens
- [ ] create radius scale
- [ ] create glow/shadow tokens
- [ ] create spacing scale
- [ ] create typography scale
- [ ] create reduced-motion tokens

### A2. Shared UI components
- [ ] `FocusCard`
- [ ] `GlowButton`
- [ ] `AvatarOrb`
- [ ] `CompanionBubble`
- [ ] `BottomNav`
- [ ] `ProgressDots`
- [ ] `GameHeader`
- [ ] `QuestionOverlay`
- [ ] `AnswerTile`
- [ ] `EmptyState`

### A3. Avatar onboarding
- [ ] welcome screen
- [ ] six avatar options
- [ ] selected glow state
- [ ] display-name field
- [ ] companion help bubble
- [ ] persist avatar + display name

### A4. Home
- [ ] avatar greeting
- [ ] hero training card
- [ ] `Nueva sesión`
- [ ] conditional `Continuar`
- [ ] three shortcut cards
- [ ] bottom navigation
- [ ] remove dashboard-style information overload

## Phase B — Game runtime migration

### B1. Shared game bridge
Define a stable contract:

```ts
interface FocusGameAdapter {
  start(): void;
  pause(): void;
  resume(): void;
  stop(): void;
  setDifficulty(value: number): void;
  getMetrics(): {
    score: number;
    errors: number;
    events?: Record<string, number>;
  };
}
```

The analytics system must never depend directly on a specific Phaser scene.

### B2. Phaser migration priority
1. Runner
2. Road Dodge
3. Pong
4. Snake
5. Memory Grid
6. Tetris

Each migration must preserve the same measurement event model currently used by FocusLab.

## Phase C — Rebuild each game to approved visual reference

### Runner
- [ ] floating neon platform environment
- [ ] avatar-based runner character
- [ ] collectible stars
- [ ] readable obstacles
- [ ] bottom question overlay

### Tetris
- [ ] luminous board
- [ ] cyan/violet/magenta blocks
- [ ] next-piece panel
- [ ] compact level/score
- [ ] floating question panel

### Road Dodge
- [ ] perspective road
- [ ] mobile lane controls
- [ ] cones/barriers/rewards
- [ ] car feedback
- [ ] central question card

### Pong
- [ ] minimal luminous arena
- [ ] motion trail on ball
- [ ] cyan/violet paddles
- [ ] question / answer region below playfield

### Snake
- [ ] luminous grid
- [ ] avatar/snake head variant
- [ ] colored memory stimuli
- [ ] recall overlay

### Memory Grid
- [ ] 4x4 board
- [ ] observation phase
- [ ] recall phase
- [ ] progressive sequence length
- [ ] step dots

## Phase D — Training session UX

- [ ] game header consistent across all six games
- [ ] avatar companion pill
- [ ] timer only when meaningful
- [ ] audio state always visible
- [ ] pause state visible
- [ ] contextual bubble only before / between trials
- [ ] question overlay does not navigate away from game
- [ ] `pause_all`, `pause_content`, `continue_all` preserved

## Phase E — Real result UX

- [ ] show learning accuracy from actual response events
- [ ] show real average latency
- [ ] show game score/errors
- [ ] show valid baseline cost only if matched baseline exists
- [ ] one recommendation at a time
- [ ] no arbitrary composite metric
- [ ] honest empty states

## Phase F — Backend

When backend capacity is available:

- [ ] create FocusLab Supabase project
- [ ] Auth
- [ ] learner profile
- [ ] avatar persistence
- [ ] training sessions
- [ ] response events
- [ ] content sources
- [ ] baseline matching
- [ ] RLS
- [ ] student / teacher / admin model

## Phase G — Content intelligence

- [ ] provider interface for transcript retrieval
- [ ] verified transcript storage
- [ ] semantic concept extraction
- [ ] semantic question generation
- [ ] source-grounding validator
- [ ] question difficulty calibration

## Phase H — Analytics protocols

- [ ] switching-cost protocol
- [ ] delayed recall protocol
- [ ] baseline repeat reliability
- [ ] within-session load exposure history
- [ ] longitudinal skill trends
- [ ] teacher analytics

## Definition of done for the redesign

The visual redesign is considered complete when:

1. onboarding includes avatar selection;
2. Home resembles the approved image direction rather than the current dashboard shell;
3. every game has a distinct illustrated environment but a shared UI grammar;
4. questions appear as elegant contextual overlays;
5. companion bubbles replace long instructions;
6. no fake metrics remain;
7. mobile portrait is fully usable;
8. desktop remains consistent rather than becoming an enterprise dashboard;
9. measurement events from the current alpha are preserved;
10. QA passes across all six game workflows.

## Immediate build order

1. Design tokens + shared visual primitives
2. Avatar onboarding
3. New Home
4. Runner visual rebuild
5. Shared question overlay
6. Road Dodge + Pong visual rebuild
7. Snake + Memory Grid visual rebuild
8. Tetris visual rebuild
9. Result screen simplification
10. mobile QA

This implementation order is now the canonical FocusLab redesign path.
