# GoalMind V2 — acceptance gate

A V2 build is not considered ready unless all applicable checks pass.

## Agent visibility
- Coach is the primary action on the first player screen.
- The user can describe topic, grade, objective and difficulty in natural language.
- Agent steps shown to the user are actions/statuses, never hidden chain-of-thought.
- Trace returned by the backend is rendered after the plan is created.

## Repository traceability
- GoalMind Library, Wikipedia and OpenAlex are visible as distinct sources.
- After a plan is generated, the UI shows source counts actually returned by Scout.
- Question generation may cite only source IDs returned by Scout.
- Repository cards must not fabricate a successful retrieval.

## Player scene
- The goal is the dominant visual interaction surface.
- A/B/C/D remain integrated into the goal, not detached quiz cards.
- Goal frame, net, goalkeeper and ball are fully visible at 390x844 without horizontal clipping.
- The goalkeeper uses an articulated SVG body and is not the legacy three-div CSS figure.
- Correct answer = goal; incorrect answer/timeout = save. Keeper randomness never overrides academic correctness.

## Mobile QA
- Review 390x844 screenshot before calling the interface ready.
- The Coach plan CTA is never obscured by the fixed bottom navigation.
- Text remains readable at 360px width.
- Touch targets remain approximately 44px or larger for primary actions.
- prefers-reduced-motion is respected.

## Persistence
- A Coach plan has a planId.
- Completed matches post a result to the memory endpoint.
- Later Coach plans may use recent-learning history to adapt level/rival.
