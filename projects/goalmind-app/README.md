# GoalMind App Core

This is the first production-oriented layer of GoalMind.

## What is stable here

- Framework-independent game state machine.
- Deterministic scoring and streak logic.
- Question repository contract.
- Initial Supabase schema contract with RLS enabled.
- Stitch handoff contract that explicitly preserves visual fidelity.

## What is intentionally not frozen yet

The final frontend. The real Stitch export has not been supplied yet, so no new visual language is being invented here.

## Verify

```bash
npm run verify
```

No runtime dependencies are required for the core tests.
