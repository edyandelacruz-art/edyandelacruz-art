# GoalMind Frontend Contract

The visual implementation is replaceable. The game domain is not.

## Source of truth

When a real Google Stitch export is provided, its screens, assets, spacing, typography, navigation and component states become the visual source of truth.

The frontend must consume the core through these concepts:

- `GameConfig`
- `Question`
- `GoalMindGameEngine`
- `AnswerRecord`
- `GameSnapshot`
- `GameResult`

## Required gameplay states

1. ready
2. playing
3. feedback: goal
4. feedback: save
5. feedback: timeout
6. finished

The visual layer may animate them however Stitch specifies, but it must not duplicate scoring rules or independently mutate game state.

## Goal mapping

- A → upper-left
- B → upper-right
- C → lower-left
- D → lower-right

This mapping belongs to the UI adapter and can later support swipe/shot gestures without changing question data.

## Non-negotiable fidelity rule

Do not replace Stitch layouts with generic cards, default component libraries, or a new aesthetic for implementation convenience. If an interaction is technically difficult, implement the approved interaction rather than redesigning around the difficulty.
