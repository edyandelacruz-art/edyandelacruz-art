# GoalMind — deployment record: accessibility hardening

Date: 2026-09-30
AppDeploy app: `goalmind-mvp-tev8mi`
AppDeploy snapshot: `1790753755531`
Public URL: `https://goalmind-mvp-tev8mi.v2.appdeploy.ai/`
Git branch: `feature/goalmind-agentic-coach`

## Applied to the executable preview

The UX/accessibility acceptance gate is now partially enforced in the running UI rather than existing only as documentation.

- Coach result container: `role=status`, `aria-live=polite`, `aria-atomic=true`.
- Material status container: `role=status`, `aria-live=polite`, `aria-atomic=true`.
- Material source selector now exposes `tablist` / `tab` semantics and `aria-selected`.
- Coach submit is disabled while a plan is being generated, exposes `aria-busy=true`, and shows a visible busy label. This also blocks duplicate submits from the control itself.
- Keyboard users receive a high-visibility `:focus-visible` outline on buttons, links and form controls.
- Disabled buttons have an explicit visual state.
- Existing reduced-motion CSS remains active.

## Verification

AppDeploy reported deployment `ready` after the change. Its post-deploy QA snapshot reported:

- frontend errors: 0;
- backend errors: 0;
- network errors: 0;
- mobile screenshot generated;
- desktop screenshot generated.

This record does **not** claim the complete acceptance gate has passed. The remaining high-value checks include full keyboard traversal of the match, live announcements for goal/save/timeout, semantic association of input errors, and an end-to-end result-persistence/idempotency audit.

## Source-of-truth note

The executable AppDeploy snapshot currently contains UI code (`app.js`, `styles.css`) that is not yet mirrored byte-for-byte in this Git branch. GitHub remains the intended code source of truth, so source reconciliation is an explicit outstanding task rather than being silently treated as complete.
