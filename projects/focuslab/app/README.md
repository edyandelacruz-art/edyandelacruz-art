# FocusLab app workspace

This folder is the GitHub source workspace for the FocusLab v0.7 visual rebuild.

## Current implementation block

Implemented in branch `focuslab-v0.7-onboarding`:

- persistent learner profile;
- six-avatar onboarding interaction;
- selected avatar glow/check state;
- learner display name;
- companion bubble;
- simplified neon Home;
- primary `Nueva sesión` CTA;
- conditional `Continuar` CTA;
- Juegos / Habilidades / Progreso shortcuts;
- mobile-first bottom navigation.

## Source of truth

Canonical product behavior lives one level up:

- `../FOCUSLAB_MASTER_SPEC.md`
- `../DESIGN_SYSTEM.md`
- `../IMPLEMENTATION_PLAN.md`
- `../OPEN_SOURCE_STACK.md`

## Integration model

GitHub is the canonical source. Figma is the design reference. AppDeploy is the current alpha runtime. Supabase and Vercel are planned production services once account capacity/workspace access is available.

## Visual asset note

The first coded avatar pass uses interchangeable functional avatar placeholders. The component contract is intentionally asset-agnostic so final 3D avatar art matching the approved image direction can replace the placeholders without changing profile state or navigation logic.
