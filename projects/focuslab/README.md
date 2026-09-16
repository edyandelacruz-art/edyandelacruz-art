# FocusLab

FocusLab is an adaptive cognitive-learning platform that trains students to capture, filter, switch, retain, and recover academic information under controlled sensory and attentional load.

## Product thesis

FocusLab does not classify students as fixed visual or auditory learners. It measures performance under different learning conditions and progressively trains attention control, working memory, inhibition, switching, processing speed, sustained attention, divided attention, and recall.

## Live preview

**Public alpha:** https://focuslab-3x5ppr.v2.appdeploy.ai/

This preview is currently deployed through AppDeploy for rapid QA. Vercel remains the intended production hosting path once the workspace/project connection is available.

## MVP game set — all six implemented

1. Runner — reaction and peripheral visual load
2. Tetris — spatial planning and sustained load
3. Road Dodge — tracking and inhibition
4. Pong — prediction and visual tracking
5. Snake — planning and working memory
6. Memory Grid — visual working memory and recall

All game environments run through the same `GameHost` contract so the adaptive engine and measurement layer remain independent from a specific game.

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

## Real content pipeline

Session Setup accepts real academic text plus optional source/YouTube metadata. The local content engine:

1. normalizes and segments the learning text;
2. extracts candidate concepts directly from source sentences;
3. generates up to eight source-grounded cloze questions;
4. sends the original source text to browser narration;
5. sends generated questions to Training Arena;
6. stores content id, title, and source type in the session summary.

Direct YouTube transcript retrieval is not yet connected. A URL is currently stored only as source metadata; the product does not pretend the transcript has been fetched.

## Question / audio policies

FocusLab treats pause behavior as an experimental variable:

- `pause_all`: audio and game pause during the question.
- `pause_content`: academic audio pauses while the game continues.
- `continue_all`: audio and game continue while the learner answers.

Every response records the active policy so comprehension is not confused with interference or dual-task cost.

## Product screens

Seven 1440×1024 high-fidelity desktop screens are defined in Figma:

- Home
- Session Setup
- Training Arena
- Results
- Progress
- Explore
- Profile / Calibration

## Technology direction

- Next.js / React
- Vercel target hosting
- AppDeploy alpha preview / QA
- Supabase Auth + PostgreSQL + RLS
- HTML5 / Canvas minigames
- Temporary localStorage persistence adapter
- Local source-grounded content engine
- Figma product system
- Future AI semantic question generation and validation

## Design source

Figma: https://www.figma.com/design/VvK2nW8scKV7lHRd2gVP9f

## Current build — v0.5.0-alpha.2

- Product architecture defined
- Six-game runtime implemented
- Eight-skill cognitive model defined
- Adaptive pause/intensity model defined
- Seven desktop screens completed in Figma
- Full product navigation implemented
- Editable real text-source workflow implemented
- Source segmentation and grounded-question generation implemented
- Session Setup passes content + selected game into Training Arena
- Learning accuracy, response latency, game score, collisions/errors, level, pause policy, and source identity captured
- Local session persistence implemented as a temporary backend adapter
- Results consume the latest real session summary
- Public preview deployed successfully
- Deployment QA reports no frontend or backend errors
- Supabase project creation remains blocked by the free-plan active-project limit
- Dedicated GitHub repository creation is not exposed by the connected GitHub action set; this folder remains the temporary GitHub source-of-truth record
- Vercel project connection remains pending

See [ROADMAP.md](./ROADMAP.md) for detailed phase status.

## Product principle

**Content first. Game second. Measurement always visible.**
