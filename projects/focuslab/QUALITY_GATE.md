# FocusLab — Quality Gate

A change cannot be called complete or deployed publicly until every applicable item below is checked.

## 1. Requirement fidelity
- [ ] The requested correction is implemented exactly, not approximately.
- [ ] The change is compared against `FOCUSLAB_MASTER_SPEC.md`.
- [ ] Approved visual references are used as the fidelity target when UI is affected.
- [ ] No requested feature was replaced with a simpler substitute merely to finish faster.

## 2. UX quality
- [ ] The screen has one obvious primary action.
- [ ] Text density is intentionally low.
- [ ] No unnecessary dashboard-style clutter remains.
- [ ] Mobile interaction is clear and touch-friendly.
- [ ] Contextual guidance uses bubbles/microcopy rather than long instructions where appropriate.
- [ ] Empty states are honest; no fake data is displayed.

## 3. Visual quality
- [ ] Depth, lighting, glow, motion, spacing and hierarchy match the approved FocusLab language.
- [ ] Avatars/games do not look like debug placeholders in a visually completed screen.
- [ ] Game scenes visually resemble the approved concept direction.
- [ ] Desktop and mobile screenshots have been inspected, not only generated.
- [ ] No obvious pixelation, clipping, overlap, stretched canvas, or unreadable text remains.

## 4. Engineering quality
- [ ] TypeScript/static checks pass for changed code.
- [ ] Production build passes before deployment.
- [ ] No duplicate/dead legacy path conflicts with the new flow.
- [ ] No silent regression in session state, persistence, controls, or navigation.
- [ ] Code is maintainable enough for the next iteration; no rushed hack is accepted as final architecture.

## 5. Measurement integrity
- [ ] Academic and game metrics remain separated.
- [ ] Response events retain required fields.
- [ ] Pause policy remains explicit and traceable.
- [ ] Source identity remains traceable.
- [ ] No invented composite score or fabricated progress was introduced.
- [ ] Baseline comparisons are shown only when a valid matched baseline exists.

## 6. Game-specific QA
For every modified game:
- [ ] Keyboard controls work where applicable.
- [ ] Touch/pointer controls work on mobile.
- [ ] Pause behavior follows the active policy.
- [ ] Score/error reporting still reaches the training session.
- [ ] Question overlays do not make the game unusable.
- [ ] Visual presentation meets the approved design direction.

## 7. Deployment gate
- [ ] The stable version remains recoverable.
- [ ] Changed user-visible workflows have QA coverage.
- [ ] Build has passed.
- [ ] Runtime QA shows no relevant frontend/network/backend errors.
- [ ] Visual inspection has passed.

Only after all applicable checks pass may the change be described as **complete**, **ready**, or **approved for deployment**.
