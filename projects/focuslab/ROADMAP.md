# FocusLab Roadmap

## Phase 0 — Product definition — COMPLETE
- Product thesis
- Six-game MVP scope
- Eight cognitive skills
- Pause-policy model
- Learning vs cognitive score separation
- Adaptive target zone

## Phase 1 — UX / UI foundation — 90%
- [x] UX architecture
- [x] Home
- [x] Session Setup
- [x] Training Arena
- [x] Results
- [x] Progress
- [ ] Profile / accessibility settings
- [ ] Mobile-specific high-fidelity states
- [ ] Motion system

## Phase 2 — Frontend MVP — 72%
- [x] Next.js application shell
- [x] Product navigation
- [x] Shared multi-game host
- [x] Runner game
- [x] Tetris game
- [x] Road Dodge game
- [x] Timed questions
- [x] Pause-policy behavior
- [x] Adaptive difficulty engine
- [x] Session Setup passes selected game into Training Arena
- [x] Results/progress UI shell
- [ ] Implement Pong
- [ ] Implement Snake
- [ ] Implement Memory Grid
- [ ] Real content-source flow
- [ ] Final production build validation

## Phase 3 — Backend & identity — 20%
- [x] Initial Supabase schema drafted
- [x] RLS architecture drafted
- [ ] Create FocusLab Supabase project
- [ ] Authentication
- [ ] Persist sessions / questions / responses
- [ ] Student cognitive profile
- [ ] Teacher / admin role model

Current blocker: the Supabase organization already uses both free active project slots.

## Phase 4 — Content intelligence — 10%
- [ ] YouTube/source ingestion
- [ ] Transcript segmentation
- [ ] Concept extraction
- [ ] AI question generation
- [ ] Difficulty calibration
- [ ] Source-grounded question validation

## Phase 5 — Analytics — 15%
- [x] Metric model defined
- [ ] Dual-task cost computation
- [ ] Switching cost computation
- [ ] Load threshold curve
- [ ] Longitudinal skill trends
- [ ] Teacher analytics dashboard

## Phase 6 — Infrastructure — 20%
- [x] GitHub project record
- [x] Figma design source
- [ ] Dedicated FocusLab GitHub repository
- [ ] Vercel project connection
- [ ] Preview deployment
- [ ] Production deployment
- [ ] Monitoring / error tracking

## Current development target

**v0.4-alpha — Multi-game engine**

Completed in this target:
1. Shared game interface
2. Runner integration
3. Tetris integration
4. Road Dodge integration
5. Game selection wired from Session Setup to Training Arena

Next:
1. Dedicated repository / deployment path
2. Supabase slot or paid project availability
3. Persist training events
4. Pong + Snake + Memory Grid
5. Generate first real learner progress curve
