# GoalMind V2 — acceptance gate

A V2 build is not considered ready unless every applicable check passes.

## Agent visibility
- Coach is the primary action on the first player screen.
- The user can describe topic, grade, objective and difficulty in natural language.
- Agent steps shown to the user are actions/statuses, never hidden chain-of-thought.
- Trace returned by the backend is rendered after the plan is created.

## Repository traceability
- GoalMind Library, Wikipedia and OpenAlex are visible as distinct sources.
- Private user material is represented as `Materials`, not disguised as a public source.
- After a plan is generated, source counts come from the sources actually returned by Scout.
- Referee strips every question `sourceRef` that does not belong to Scout's retrieved source set.
- Repository cards must never fabricate a successful retrieval.

## Material ingestion
- Material opens a real bottom-sheet flow; no toast/placeholder is acceptable.
- PDF text is extracted client-side; scanned PDFs fall back to page images.
- Images are converted to academic text server-side before entering the Coach context.
- TXT/MD/CSV/JSON and pasted text are supported.
- YouTube uses recoverable public content and fails visibly when insufficient content is exposed.
- Stored material is scoped by guest session and is referenced by a material token in the Coach prompt.
- `POST /api/material/store` and `POST /api/coach/plan` coexist in the same standalone backend entrypoint.

## Player scene
- The goal is the dominant visual interaction surface.
- A/B/C/D remain integrated into the goal, not detached quiz cards.
- Goal frame, net, goalkeeper and ball are fully visible at 390x844 without horizontal clipping.
- The goalkeeper uses an articulated SVG body and is not the legacy three-div CSS figure.
- Correct answer = goal; incorrect answer/timeout = save. Keeper randomness never overrides academic correctness.

## Mobile QA
- Review 390x844 before calling the interface ready.
- The Coach plan CTA is never obscured by fixed navigation.
- Fixed bottom navigation has explicit V2 button/active styles.
- Text remains readable at 360px width.
- Primary touch targets remain approximately 44px or larger.
- prefers-reduced-motion is respected.

## Persistence and adaptation
- A Coach plan has a planId and is stored under the guest session.
- Completed matches post a result to the memory endpoint.
- Accuracy is canonical 0–100 in persistence; fractional 0–1 values are normalized.
- Later Coach runs can call `get_recent_learning` and adjust level/rival using prior performance.
- Material and public-source metadata are stored with the generated study plan for traceability.

## Release gate
- Healthcheck reports the agentic-materials backend version.
- Material → Coach → sources → verified questions → match → result memory succeeds end-to-end.
- No public V2 deploy is announced until the deployment host accepts the build and the live URL is checked on mobile.
