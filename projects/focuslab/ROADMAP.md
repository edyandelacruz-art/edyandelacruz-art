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

The seven-screen desktop system is complete in Figma. Mobile-specific states and motion remain the main design tasks.

## Phase 2 — Frontend MVP — 96%
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
- [x] Editable source-text input
- [x] Prepared content passes into Training Arena
- [x] Results/progress UI shell
- [x] Explore library
- [x] Profile/calibration UI
- [x] Remote production-style build completed through AppDeploy
- [x] Public alpha deployed and QA-clean
- [ ] Replace remaining demonstration analytics with validated session-derived metrics

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

## Phase 4 — Content intelligence — 38%
- [x] Generic text-source ingestion contract
- [x] Text normalization and sentence segmentation
- [x] Local source-grounded cloze question generation
- [x] Source identity stored with session summary
- [ ] Direct YouTube transcript retrieval
- [ ] AI semantic concept extraction
- [ ] AI semantic question generation
- [ ] Source-grounded semantic validation
- [ ] Difficulty calibration by question complexity

The current local generator is intentionally simple and traceable. It is an alpha fallback, not a replacement for the planned semantic AI pipeline.

## Phase 5 — Analytics — 22%
- [x] Metric model defined
- [x] Session summary model
- [x] Learning accuracy captured from real session responses
- [x] Response latency captured
- [x] Game score / collision metrics captured
- [ ] Baseline condition for valid dual-task comparison
- [ ] Validated dual-task cost computation
- [ ] Switching cost computation
- [ ] Load threshold curve from persisted sessions
- [ ] Longitudinal skill trends
- [ ] Teacher analytics dashboard

This is the current development focus: replace decorative/illustrative analytics with measurements computed from matched baseline and dual-task sessions.

## Phase 6 — Infrastructure — 50%
- [x] GitHub project record
- [x] GitHub public profile updated with real repositories
- [x] Figma design source
- [x] Deploy-ready package prepared
- [x] Public alpha preview deployed
- [x] Remote build validation completed
- [x] Deployment QA reports no frontend/backend errors
- [ ] Dedicated FocusLab GitHub repository
- [ ] Vercel project connection / production host
- [ ] Supabase backend capacity
- [ ] Production monitoring / error tracking

Current public alpha: https://focuslab-3x5ppr.v2.appdeploy.ai/

The alpha is running on AppDeploy for rapid QA. Vercel remains the intended production hosting target, but the current Vercel connector does not expose a usable workspace/project path in this chat.

## Current build

**v0.5.0-alpha.2 — Six-game runtime + real text-content path + public preview**

Completed in this target:
1. Seven-screen desktop UX system
2. Six-game shared runtime
3. Game selection wired from Session Setup to Training Arena
4. Local session persistence adapter
5. Dynamic result summary from actual session data
6. Editable learning text source
7. Source segmentation and local grounded-question generation
8. Source identity retained in session traceability
9. Public alpha build and deployment
10. Clean automated deployment QA

## Next development target

**v0.6 — Validated analytics + semantic content**

Priority order:
1. Baseline training condition
2. Matched baseline vs dual-task cost computation
3. Session-derived progress curves
4. Switching-cost analytics
5. YouTube transcript/provider adapter
6. Semantic concept/question provider interface
7. Source-grounded question validation
8. Supabase/auth when backend capacity is available
9. Mobile UX + motion
10. Vercel production path
