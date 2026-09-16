# FocusLab Roadmap

## Phase 0 — Product definition — COMPLETE
- Product thesis
- Six-game MVP scope
- Eight cognitive skills
- Pause-policy model
- Learning vs cognitive score separation
- Adaptive target zone

## Phase 1 — UX / UI foundation — 95%
- [x] UX architecture
- [x] Home
- [x] Session Setup
- [x] Training Arena
- [x] Results
- [x] Progress
- [x] Explore
- [x] Profile / calibration
- [ ] Mobile-specific high-fidelity states
- [ ] Motion system

## Phase 2 — Frontend MVP — 78%
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
- [x] Explore library
- [x] Profile/calibration UI
- [ ] Implement Pong
- [ ] Implement Snake
- [ ] Implement Memory Grid
- [ ] Real content-source flow
- [ ] Final production build validation

## Phase 3 — Backend & identity — 30%
- [x] Initial Supabase schema drafted
- [x] RLS architecture drafted
- [x] Local persistence adapter for training sessions
- [x] Session summaries stored in browser localStorage
- [ ] Create FocusLab Supabase project
- [ ] Authentication
- [ ] Replace local adapter with Supabase persistence
- [ ] Student cognitive profile persistence
- [ ] Teacher / admin role model

Current blocker: the Supabase organization already uses both free active project slots. Existing projects are not being paused automatically because that could interrupt other applications.

## Phase 4 — Content intelligence — 10%
- [ ] YouTube/source ingestion
- [ ] Transcript segmentation
- [ ] Concept extraction
- [ ] AI question generation
- [ ] Difficulty calibration
- [ ] Source-grounded question validation

## Phase 5 — Analytics — 22%
- [x] Metric model defined
- [x] Session summary model
- [x] Learning accuracy captured from real session responses
- [x] Response latency captured
- [x] Game score / collision metrics captured
- [ ] Validated dual-task cost computation
- [ ] Switching cost computation
- [ ] Load threshold curve from persisted sessions
- [ ] Longitudinal skill trends
- [ ] Teacher analytics dashboard

## Phase 6 — Infrastructure — 20%
- [x] GitHub project record
- [x] GitHub public profile updated with real repositories
- [x] Figma design source
- [ ] Dedicated FocusLab GitHub repository
- [ ] Vercel project connection
- [ ] Preview deployment
- [ ] Production deployment
- [ ] Monitoring / error tracking

## Current development target

**v0.4-alpha — Multi-game + local persistence**

Completed in this target:
1. Seven-screen desktop UX system
2. Shared game interface
3. Runner integration
4. Tetris integration
5. Road Dodge integration
6. Game selection wired from Session Setup to Training Arena
7. Local session persistence adapter
8. Dynamic result summary from actual session data

Next:
1. Dedicated repository / deployment path
2. Supabase slot or paid project availability
3. Pong + Snake + Memory Grid
4. Real content ingestion
5. Persist training events remotely
6. Generate first validated learner load-threshold curve
