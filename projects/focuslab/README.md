# FocusLab

FocusLab is an adaptive cognitive-learning platform that trains students to capture, filter, switch, retain, and recover academic information under controlled sensory and attentional load.

## Product thesis

FocusLab does not classify students as fixed visual or auditory learners. It measures performance under different learning conditions and progressively trains attention control, working memory, inhibition, switching, processing speed, sustained attention, divided attention, and recall.

## MVP game set

1. Runner — reaction and peripheral visual load — **implemented**
2. Tetris — spatial planning and sustained load — **implemented**
3. Road Dodge — tracking and inhibition — **implemented**
4. Pong — prediction and visual tracking — planned
5. Snake — planning and working memory — planned
6. Memory Grid — visual working memory and recall — planned

## Cognitive skill model

- Selective Attention
- Divided Attention
- Working Memory
- Inhibitory Control
- Switching
- Sustained Attention
- Processing Speed
- Recall

## Core product flow

`Content -> Skill -> Game -> Intensity -> Training Session -> Results -> Adaptive Next Session`

## Question / audio policies

FocusLab treats pause behavior as an experimental variable:

- `pause_all`: audio and game pause during the question.
- `pause_content`: academic audio pauses while the game continues.
- `continue_all`: audio and game continue while the learner answers.

Every response records the active policy so comprehension is not confused with interference or dual-task cost.

## Desktop product screens

- Home
- Session Setup
- Training Arena
- Results
- Progress
- Explore
- Profile / Calibration

## Technology direction

- Next.js / React
- Vercel
- Supabase Auth + PostgreSQL + RLS
- HTML5 / Canvas minigames
- Temporary localStorage persistence adapter
- Figma product system
- AI-assisted question generation and content processing

## Design source

Figma: https://www.figma.com/design/VvK2nW8scKV7lHRd2gVP9f

## Current build — v0.4-alpha

- Product architecture defined
- Six-game MVP scope defined
- Eight-skill cognitive model defined
- Adaptive pause/intensity model defined
- Seven desktop screens completed in Figma
- Next.js product shell implemented locally
- Product navigation implemented locally
- Shared multi-game host implemented
- Runner, Tetris and Road Dodge implemented
- Session Setup passes the selected game into Training Arena
- Learning accuracy, response latency, game score, collisions, level and pause policy captured from sessions
- Local session persistence implemented as a temporary backend adapter
- Result screen can consume the latest real session summary
- Static TypeScript validation passes using local declaration shims because package installation is unavailable in the execution environment
- Full dependency install / real Next.js production build still pending
- Supabase project creation blocked by the free-plan active-project limit
- Dedicated GitHub repository still to be initialized; this folder remains the temporary GitHub source-of-truth record

See [ROADMAP.md](./ROADMAP.md) for detailed phase status.

## Product principle

**Content first. Game second. Measurement always visible.**
