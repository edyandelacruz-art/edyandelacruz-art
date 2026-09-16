# Predictive — Development Log — 2026-09-16

## Product definition

- Defined Predictive as a multi-sport probabilistic analytics platform rather than a static tips interface.
- Established separate models per sport.
- Defined independent probability markets and model explainability as first-class features.

## Infrastructure

- Created dedicated Supabase project `Predictive` in `sa-east-1`.
- Created core data schema for users, events, participants, predictions, markets, model versions, sources and sync runs.
- Enabled RLS on exposed tables and verified security advisors.
- Added foreign-key indexes identified by Supabase performance advisors.
- Created Vercel project `predictive-sports` during early deployment work.
- Created Netlify project `predictive-sports-edyan` as the target static frontend because Supabase Edge serves HTML as `text/plain` under its gateway.
- Exported a standalone Netlify SPA package (`index.html`, `_headers`, `_redirects`, `netlify.toml`).

## Live sports data

- Added TheSportsDB fixture synchronization.
- Added Sporting Events open fixtures source.
- Scheduled event synchronization every 30 minutes.
- Created read-only public event endpoint.
- Added manual refresh endpoint.
- Expanded TheSportsDB sync window beyond only the current day.
- Added a team-asset cache in Supabase.
- Added `enrich-team-assets` worker to resolve missing crests from TheSportsDB using strict identity matching and aliases.
- Increased known football participant badges from 45 to 65 during the first three enrichment batches; enrichment continues on a scheduled job.
- Added OpenFootball Clubs (CC0) as a team-identity/alias reference source.

## Predictive engine

### Football

- Loaded 7,384 historical matches across 11 European leagues.
- Created 243 domestic team ratings and 594 global club Elo records.
- `football-ensemble-v2.2`: domestic Elo + Poisson + Dixon-Coles + shrinkage.
- `football-global-elo-v1`: cross-league global Elo model that does not directly mix domestic Elo scales.
- Historical fields include goals, shots, shots on target, corners, yellow cards and red cards.
- Added 220 team market profiles and 11 league market profiles.
- Deployed `predict-football-markets` using historical team/opponent profiles with shrinkage.
- Added advanced market families for:
  - goals and team-goal lines;
  - corners and team corners;
  - yellow cards and red-card probabilities;
  - total/team shots;
  - total/team shots on target.
- Total count markets use a Negative Binomial distribution when empirical league variance exceeds the mean; team count lines currently use Poisson.
- Added model-derived fair decimal odds (`1 / p`) without bookmaker margin as a mathematical reference, not a recommendation.
- Added immutable prediction snapshots and automatic evaluation infrastructure for Brier Score, Log Loss and accuracy.
- Added `penaltyblog` (MIT) as a benchmark/reference implementation for Poisson and Dixon-Coles validation; it is not an opaque runtime dependency.

### Tennis

- Loaded 8,482 unique ATP/WTA historical matches and 1,041 player ratings.
- Added global Elo and hard/clay/grass Elo.
- Added hold %, return %, first/second serve, form and recent workload.
- Deployed `tennis-ensemble-v1` and Tennis Lab comparison UI.
- Historical tennis research source remains explicitly non-commercial until replaced with a commercial/live provider.

## Deterministic analyst

- Removed Gemini, Groq and Antigravity from the product path.
- Replaced external LLM chat behavior with `predictive-engine`.
- The chat now reads only structured model outputs and data already computed by Predictive.
- Added intent-specific responses for result, goals, corners, cards, shots, shots on target, data quality and confidence.
- Added a permanent chat surface inside the dashboard hero plus the floating analyst panel.

## UX / UI

- Reworked the product direction from promotional mockup to dashboard/product UI.
- Added date, sport, competition and status filtering.
- Added event selection and model detail.
- Added hero analyst chat.
- Added all-market expandable sections with expected counts, probabilities and mathematical fair odds.
- Added badge cache/fallback behavior and stricter identity matching.
- Added source cards for Supabase, TheSportsDB, Sporting Events, ATP/WTA research, penaltyblog and OpenFootball.
- Adopted a dark product design direction inspired by shadcn `new-york`: consistent cards, one primary blue accent, compact data hierarchy and designed empty/loading states.

## Current next steps

1. Complete automated crest enrichment for the remaining football participants.
2. Move the exported static SPA into a dedicated Predictive GitHub repository when repository-creation access is available and connect that repo to Netlify.
3. Add live ATP/WTA player-vs-player fixtures from a provider with a usable production license.
4. Add basketball historical data before exposing points/rebounds/assists markets; do not fabricate basketball probabilities from schedule-only data.
5. Continue live calibration as settled matches accumulate.
6. Extend market history to fouls, offsides and first-half stats when those fields are ingested consistently.
