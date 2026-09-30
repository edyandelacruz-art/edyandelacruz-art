# GoalMind Coach — durable conversation contract

Status: P0 implementation contract
Date: 2026-09-30

## Problem

The executable AppDeploy preview currently exposes a conversational `POST /api/coach/chat`, while the canonical GitHub backend does not yet contain that endpoint. Conversation state must not depend on browser-only history. Before importing/reconciling the executable endpoint, the contract below is the acceptance gate.

## Identity and traceability

Every Coach conversation MUST have:

- `guestId`: existing validated GoalMind player/session identity.
- `conversationId`: server-generated opaque ID. Client may send it only to continue an existing conversation; it MUST NOT be trusted as ownership proof.
- `traceId`: server-generated per-request ID used to correlate Coach → Scout → Game Master → Referee → Memory work.
- `turnId`: server-generated per-turn ID.

The server MUST verify that `conversationId` belongs to `guestId` before reading or appending turns.

## Request

`POST /api/coach/chat`

```json
{
  "guestId": "string",
  "conversationId": "optional string",
  "message": "string",
  "materialContext": {
    "sourceIds": ["optional canonical source ids"]
  }
}
```

Rules:

- Reject invalid `guestId`.
- Trim and bound `message`; reject empty/oversized messages.
- Never accept arbitrary client-authored prior messages as authoritative memory.
- If `conversationId` is absent, create a conversation server-side.
- If present, load recent turns from server persistence after ownership validation.

## Response

```json
{
  "conversationId": "opaque server id",
  "turnId": "opaque server id",
  "traceId": "opaque request trace id",
  "reply": "Coach response",
  "ready": false,
  "normalizedGoal": null,
  "missingContext": ["grade"],
  "suggestedActions": []
}
```

When `ready=true`, `normalizedGoal` MUST be a bounded structured object suitable for `/api/coach/plan`; the frontend must not synthesize or silently rewrite it.

## Persistence model

Suggested AppDeploy collections (names may change only with a migration note):

- `coach_conversations:<guestId>` — conversation metadata: id, createdAt, updatedAt, status, normalizedGoal.
- `coach_turns:<conversationId>` — role, bounded text, createdAt, turnId, traceId.

Do not persist secrets, raw model internals, chain-of-thought, or unrestricted uploaded-file contents in conversation records.

Retention must be documented before production. Until authentication exists, guest conversations are pseudonymous and MUST remain isolated by validated `guestId`.

## Handoff to plan

`/api/coach/plan` SHOULD accept `conversationId` plus the server-produced normalized goal. The backend MUST reload/validate the conversation and MUST NOT rely solely on a client-supplied transcript.

Pipeline trace should expose product-safe milestones only:

1. Coach — intent normalized.
2. Scout — evidence retrieved.
3. Game Master — match constructed.
4. Referee — questions validated.
5. Memory — plan/result persisted.

Never expose model chain-of-thought.

## Idempotency

A repeated browser submission or network retry MUST NOT create duplicate turns or duplicate plans. Implementation MUST introduce an idempotency key or equivalent server-side deduplication for chat turns and plan handoff before the conversational flow is marked production-ready.

## Acceptance tests

1. New valid guest creates one conversation and one turn.
2. Continuing the same conversation appends exactly one turn.
3. Another guest cannot read or append to the conversation.
4. Invalid/empty/oversized messages are rejected.
5. Retrying the same turn does not duplicate persistence.
6. `ready=false` cannot trigger plan construction.
7. `ready=true` returns a structured normalized goal and plan handoff validates it server-side.
8. API response contains `conversationId`, `turnId`, and `traceId` but no chain-of-thought.
9. Conversation survives page reload because authoritative state is server-side.
10. Existing `/api/coach/plan`, result memory, and match flow remain backward-compatible during migration.

## Reconciliation gate

This document does **not** claim the AppDeploy endpoint is reconciled. The executable snapshot must still be imported atomically (`index.html`, `app.js`, `styles.css`, `backend/index.ts`, `tests/tests.json`) and compared before GitHub is declared the complete source of truth for the current preview.
