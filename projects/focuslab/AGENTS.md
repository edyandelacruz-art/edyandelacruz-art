# FocusLab — Mandatory Execution Rules

These rules are binding for any agent, developer, assistant, or automation modifying FocusLab.

## Priority rule

**Quality is always more important than speed.**

Never rush a correction, feature, redesign, commit, merge, percentage update, or deployment merely to show progress.

If a result is mediocre, incomplete, visually unfaithful, poorly tested, architecturally inconsistent, or below the approved reference, it must be revised before it is presented as complete.

## Required sequence for every meaningful change

1. Audit the current state before editing.
2. Compare the requested result against the canonical product specification and approved visual references.
3. Identify affected code, UX, metrics, persistence, tests, and deployment paths.
4. Implement deliberately; do not shortcut architecture for speed.
5. Validate TypeScript/build locally or with equivalent tooling before deployment.
6. Run functional QA for the changed workflow.
7. Perform a visual fidelity review on desktop and mobile when UI is affected.
8. Verify that no analytics fields, events, pause policies, source traceability, or session metrics were silently removed.
9. Only after all gates pass may the change be merged, deployed, or described as complete.

## Prohibited behaviors

- Do not deploy code that has not passed build validation.
- Do not call a visual redesign finished merely because the mechanics work.
- Do not substitute placeholders for approved visual quality without labeling them as placeholders.
- Do not invent metrics, scores, percentages, progress, or source states.
- Do not reduce fidelity to the approved mockups to save time.
- Do not compress several risky changes into one rushed deploy when they can be validated separately.
- Do not claim completion while known defects remain.
- Do not optimize for response speed, commit count, or visible activity.

## FocusLab-specific visual rule

The approved visual direction is authoritative. The experience after avatar selection must be judged by fidelity to the approved mockups: clear hierarchy, minimal text, premium child-friendly 3D/animated feel, visual game cards, contextual bubbles, strong depth, and simple interaction.

The six games must not look like generic debug canvases. Their mechanics may remain lightweight, but their presentation must match the FocusLab visual language before being considered visually complete.

## Deployment rule

Production or public alpha deployment is allowed only when `QUALITY_GATE.md` is satisfied for the affected scope.

A failed deployment is not a reason to rush a workaround. Diagnose the root cause, repair it, validate again, and then redeploy.
