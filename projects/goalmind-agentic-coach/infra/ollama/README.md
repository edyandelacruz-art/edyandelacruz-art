# GoalMind local inference node

This folder turns a user-owned machine into the zero-per-call inference node for GoalMind. It intentionally binds Ollama to loopback only; do not expose port 11434 directly to the Internet.

## Start

Requirements: Docker with Compose and enough RAM/disk for the selected model.

```bash
docker compose up -d ollama
docker compose --profile bootstrap run --rm model-bootstrap
```

The bootstrap profile pulls `qwen3:4b`. Model weights live in the named Docker volume and survive container restarts.

## Verify locally

```bash
curl http://127.0.0.1:11434/api/tags
curl http://127.0.0.1:11434/v1/chat/completions \
  -H 'Content-Type: application/json' \
  -d '{"model":"qwen3:4b","messages":[{"role":"user","content":"Reply only: GOALMIND_OK"}],"stream":false}'
```

Expected: the model appears in `/api/tags` and the chat response contains `GOALMIND_OK`.

## Connect GoalMind safely

GoalMind's hosted backend cannot call this loopback address. Put an authenticated HTTPS reverse proxy/tunnel in front of this node, then configure backend secrets only:

- `GOALMIND_LLM_BASE_URL=https://<authenticated-endpoint>`
- `GOALMIND_LLM_MODEL=qwen3:4b`
- `GOALMIND_LLM_API_KEY=<token>` when the proxy expects a bearer token
- leave `GOALMIND_LLM_ALLOW_APPDEPLOY_FALLBACK` unset/false for zero accidental AppDeploy AI spend

Never commit tokens. Never publish Ollama's raw `11434` port. The public endpoint must use HTTPS and authentication before staging activation.

## Operations

```bash
docker compose ps
docker compose logs -f ollama
docker compose restart ollama
docker compose down
```

`docker compose down` preserves the model volume. Do not use `down -v` unless intentionally deleting downloaded weights.

## Current gate

This infrastructure is versioned but not proof that a machine is running it. GoalMind remains `external LLM ready / endpoint not activated` until a real HTTPS endpoint is configured and Coach → plan → match → result QA passes.
