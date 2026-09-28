# Open-model mirror manifest — 2026-09-28

This branch records reproducible upstream references for open/open-weight models relevant to HILO and future projects.

## Kimi K3
- Official repo: https://github.com/MoonshotAI/Kimi-K3
- Pinned upstream tree/commit: 3cb39dfd32e51c3328e2e4b4af21341247d06c43
- License: Kimi K3 License (see upstream LICENSE)
- Purpose: frontier open-weight reasoning / long-horizon agentic work
- Weights: stored upstream; do not commit giant weight files into GitHub. Use the official model host/model card and preserve license notices.

## GLM-5 / GLM-5.3
- Official repo: https://github.com/zai-org/GLM-5
- Pinned upstream tree/commit: c8ad661c6cf4cb0a78064987bc42f97e14355929
- License: custom GLM license (see upstream LICENSE)
- Purpose: strong open-weight coding, reasoning and agentic workloads
- Weights: stored upstream; GLM-5.3 is hundreds of GB, so keep a reproducible downloader rather than committing weights to GitHub.

## Qwen3.6
- Official repo: https://github.com/AlibabaCloud-Official/Qwen3.6
- License for open-weight model releases: Apache-2.0 according to the official repository/model cards.
- Useful initial models for HILO: Qwen3.6-27B and Qwen3.6-35B-A3B.
- Weights: official Hugging Face / ModelScope releases.

## Preservation policy
1. Preserve the original license and copyright notices.
2. Pin upstream commit/model revision whenever a model is approved for HILO.
3. Keep source/configuration/scripts in Git; keep giant weights in model storage or the official host.
4. Record SHA256 checksums for downloaded model files.
5. Never rely on a mutable `latest` reference for production.
6. HILO must access models through a provider/runtime adapter so models remain replaceable.

## Why weights are not copied here
GitHub is not suitable for multi-GB/TB model shards. The correct archival pattern is to keep the exact upstream revision, license, download manifest and checksums, then reconstruct the local model store when needed.
