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

## Phase 2 — Frontend MVP — 60%
- [x] Next.js application shell
- [x] Product navigation
- [x] Runner game
- [x] Timed questions
- [x] Pause-policy behavior
- [x] Adaptive difficulty engine
- [x] Results/progress UI shell
- [ ] Implement Tetris
- [ ] Implement Road Dodge
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

## Next development target

**v0.4 — Multi-game engine + real persisted sessions**

Priority order:
1. Dedicated repository / deployment path
2. Supabase slot or paid project availability
3. Shared game interface
4. Tetris + Road Dodge
5. Persist training events
6. Generate first real learner progress curve
