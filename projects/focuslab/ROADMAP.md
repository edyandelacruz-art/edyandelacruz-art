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

## Phase 2 — Frontend MVP — 88%
- [x] Next.js application shell
- [x] Product navigation
- [x] Shared multi-game host
- [x] Runner
- [x] Tetris
- [x] Road Dodge
- [x] Pong
- [x] Snake
- [x] Memory Grid
- [x] Timed questions
- [x] Pause-policy behavior
- [x] Adaptive difficulty engine
- [x] Session Setup passes selected game into Training Arena
- [x] Results/progress UI shell
- [x] Explore library
- [x] Profile/calibration UI
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

## Phase 6 — Infrastructure — 25%
- [x] GitHub project record
- [x] GitHub public profile updated with real repositories
- [x] Figma design source
- [x] Deploy-ready local package prepared
- [ ] Dedicated FocusLab GitHub repository
- [ ] Vercel project connection
- [ ] Preview deployment
- [ ] Production deployment
- [ ] Monitoring / error tracking

## Current build

**v0.4.0-alpha.3 — Complete six-game alpha runtime**

Completed in this target:
1. Seven-screen desktop UX system
2. Shared game interface
3. Runner, Tetris, Road Dodge, Pong, Snake and Memory Grid
4. Game selection wired from Session Setup to Training Arena
5. Local session persistence adapter
6. Dynamic result summary from actual session data
7. Static TypeScript validation of the complete source

## Next development target

**v0.5 — Real learning-content pipeline**

Priority order:
1. Source ingestion contract (YouTube/material)
2. Transcript segmentation
3. Grounded question generation and validation
4. Supabase/auth when backend capacity is available
5. First validated dual-task and switching-cost curves
6. Mobile UX and motion system
7. Production build/deployment validation
