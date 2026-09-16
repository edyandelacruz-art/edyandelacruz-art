# FocusLab Roadmap

## Overall audited development — 65%

See [AUDIT_2026-09-16.md](./AUDIT_2026-09-16.md) for the weighted calculation, corrections and evidence behind this number.

## Phase 0 — Product definition — 100%
- [x] Product thesis
- [x] Six-game MVP scope
- [x] Eight cognitive skills
- [x] Pause-policy model
- [x] Learning vs cognitive-load measurement separation
- [x] Adaptive target zone concept
- [x] Baseline vs dual-task experimental framing

## Phase 1 — UX / UI foundation — 88%
- [x] UX architecture
- [x] Home
- [x] Session Setup
- [x] Training Arena
- [x] Results
- [x] Progress
- [x] Explore
- [x] Profile / status
- [x] Modernized local UI pass with simpler hierarchy and stronger empty states
- [ ] Mirror the latest v0.6 UI changes back into Figma
- [ ] Mobile-specific high-fidelity states
- [ ] Motion system

## Phase 2 — Frontend MVP — 92%
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
- [x] Editable source-text input
- [x] Prepared content passes into Training Arena
- [x] Results / Progress / Explore / Profile
- [x] Baseline training condition
- [x] Local persistence
- [x] Session-derived Home and Progress metrics
- [x] Misleading decorative analytics removed
- [ ] Sync v0.6 source to the public alpha snapshot
- [ ] Full production-path regression test after that sync

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

Current blocker: both free Supabase active-project slots are occupied by existing projects.

## Phase 4 — Content intelligence — 40%
- [x] Generic text-source ingestion contract
- [x] Text normalization and sentence segmentation
- [x] Local source-grounded cloze question generation
- [x] Content fingerprinting
- [x] Source identity stored with session summary
- [x] YouTube URL stored explicitly as `youtube_reference` metadata
- [ ] Direct YouTube transcript retrieval
- [ ] AI semantic concept extraction
- [ ] AI semantic question generation
- [ ] Source-grounded semantic validation
- [ ] Difficulty calibration by question complexity

The current local generator is intentionally simple and traceable. It is an alpha fallback, not the planned semantic AI layer.

## Phase 5 — Analytics / research validity — 48%
- [x] Metric model defined
- [x] Session summary model
- [x] Learning accuracy captured
- [x] Response latency captured
- [x] Game score / collision metrics captured
- [x] Baseline condition implemented
- [x] Content fingerprint used to match baseline and dual-task sessions
- [x] Dual-task accuracy cost computed only when matched baseline exists
- [x] Dual-task latency cost computed only when matched baseline exists
- [x] Session-derived per-skill accuracy
- [x] Session-derived per-final-level accuracy
- [ ] Switching-cost protocol
- [ ] Delayed recall protocol
- [ ] Transfer-test protocol
- [ ] Full within-session load-threshold model
- [ ] Longitudinal learner trends in cloud storage
- [ ] Teacher/class analytics dashboard
- [ ] Empirical validation of composite interpretation rules

Important audit change: unvalidated `Focus Index` and `Cognitive score` composites were removed from the v0.6 local UI.

## Phase 6 — Infrastructure / release — 55%
- [x] GitHub project record
- [x] GitHub public profile updated
- [x] Figma design source
- [x] Deploy-ready package
- [x] Public alpha preview deployed
- [x] Remote build validation completed
- [x] Deployment QA currently reports no frontend, backend or network errors
- [ ] Dedicated FocusLab GitHub repository
- [ ] Push current source tree to that dedicated repository
- [ ] Vercel production project connection
- [ ] Supabase backend capacity
- [ ] Production monitoring / error tracking

Public alpha: https://focuslab-3x5ppr.v2.appdeploy.ai/

The alpha is online, but the latest v0.6 local source is ahead of the currently applied deployment snapshot.

## Current local build

**v0.6 — modern UI + honest analytics + baseline comparison**

Completed in this target:
1. Seven-screen product shell
2. Six-game shared runtime
3. Editable learning content flow
4. Local question generation
5. Baseline condition
6. Matched baseline vs dual-task comparison
7. Session-derived progress
8. Honest empty states when data is missing
9. Removal of arbitrary Focus Index and Cognitive score presentation
10. Removal of unconnected starting-load control
11. Removal of unenforced fixed-duration claim
12. Explicit distinction between YouTube reference and actual transcript

## Next development target

**v0.7 — validated measurement + semantic content**

Priority order:
1. Sync v0.6 to public alpha and re-run QA
2. Switching-cost protocol
3. Delayed recall protocol
4. YouTube transcript/provider adapter
5. Semantic concept/question provider interface
6. Source-grounded semantic validation
7. Dedicated GitHub repository
8. Supabase/auth when capacity is available
9. Mobile UX + motion
10. Vercel production path
