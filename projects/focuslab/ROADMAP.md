# FocusLab Roadmap

## Overall audited development — 65%

See [AUDIT_2026-09-16.md](./AUDIT_2026-09-16.md) for the weighted calculation, corrections and evidence behind this number.

Canonical redesign documents:

- [FOCUSLAB_MASTER_SPEC.md](./FOCUSLAB_MASTER_SPEC.md)
- [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md)
- [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md)

The approved avatar/neon/game-companion mockups are now the official product direction.

## Phase 0 — Product definition — 100%
- [x] Product thesis
- [x] Six-game MVP scope
- [x] Eight cognitive skills
- [x] Pause-policy model
- [x] Learning vs cognitive-load measurement separation
- [x] Adaptive target zone concept
- [x] Baseline vs dual-task experimental framing
- [x] Canonical master specification
- [x] Canonical redesign direction

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
- [x] Approved avatar/neon mobile-first visual target documented
- [x] Avatar onboarding behavior specified
- [x] Shared question-overlay behavior specified
- [x] Shared game HUD language specified
- [ ] Implement avatar onboarding in code
- [ ] Replace dashboard-like Home with approved hero/shortcut design
- [ ] Implement shared bubble / glow / navigation primitives
- [ ] Rebuild all six game views to approved visual direction
- [ ] Mobile-specific high-fidelity implementation
- [ ] Motion system in production code

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
- [ ] Replace current visual shell with canonical redesign
- [ ] Introduce avatar state in app store
- [ ] Introduce reusable `QuestionOverlay` / `CompanionBubble`
- [ ] Migrate game presentation toward Phaser runtime
- [ ] Sync redesigned build to public alpha
- [ ] Full production-path regression test after sync

## Phase 3 — Backend & identity — 30%
- [x] Initial Supabase schema drafted
- [x] RLS architecture drafted
- [x] Local persistence adapter for training sessions
- [x] Session summaries stored in browser localStorage
- [ ] Create FocusLab Supabase project
- [ ] Authentication
- [ ] Replace local adapter with Supabase persistence
- [ ] Student cognitive profile persistence
- [ ] Avatar/profile persistence
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
- [ ] Empirical validation of interpretation rules

Important audit change: unvalidated `Focus Index` and `Cognitive score` composites were removed from the v0.6 local UI.

## Phase 6 — Infrastructure / release — 55%
- [x] GitHub project record
- [x] GitHub public profile updated
- [x] Figma design source
- [x] Deploy-ready package
- [x] Public alpha preview deployed
- [x] Remote build validation completed
- [x] Deployment QA currently reports no frontend, backend or network errors
- [x] Canonical master/design/implementation specifications stored in GitHub
- [ ] Dedicated FocusLab GitHub repository
- [ ] Push current source tree to that dedicated repository
- [ ] Vercel production project connection
- [ ] Supabase backend capacity
- [ ] Production monitoring / error tracking

Public alpha: https://focuslab-3x5ppr.v2.appdeploy.ai/

The alpha is online, but the latest local v0.6 source and the newly approved redesign direction are ahead of the currently applied deployment snapshot.

## Current local build

**v0.6 — honest analytics + baseline comparison + pre-redesign shell**

The current runtime is functional but visually transitional. It should not be treated as the final interface.

## Next development target

**v0.7 — approved visual redesign becomes real UI**

Priority order:
1. Shared design tokens + glow/card/button primitives
2. Avatar onboarding
3. Simplified Home matching approved mockups
4. Shared companion bubble system
5. Shared question-overlay system
6. Runner visual rebuild
7. Road Dodge and Pong rebuild
8. Snake and Memory Grid rebuild
9. Tetris rebuild
10. Mobile QA and motion pass
11. Sync redesigned build to public alpha
12. Preserve all v0.6 measurement events through the redesign

## Following target

**v0.8 — validated measurement + semantic content**

After the redesign is stable:
1. Switching-cost protocol
2. Delayed recall protocol
3. YouTube transcript/provider adapter
4. Semantic concept/question provider interface
5. Source-grounded semantic validation
6. Dedicated GitHub repository
7. Supabase/auth when capacity is available
8. Vercel production path
