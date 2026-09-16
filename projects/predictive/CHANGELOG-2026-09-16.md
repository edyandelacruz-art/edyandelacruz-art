# Predictive — Development Log — 2026-09-16

## Product definition

- Defined Predictive as a multi-sport probabilistic analytics platform rather than a static tips interface.
- Established separate models per sport.
- Defined independent probability markets and model explainability as first-class features.

## Infrastructure

- Created a dedicated Supabase project: `Predictive` (`sa-east-1`).
- Created core data schema for users, events, participants, predictions, markets, model versions, sources and sync runs.
- Enabled RLS on exposed tables and verified security advisors.
- Added foreign-key indexes identified by Supabase performance advisors.
- Deployed Vercel project `predictive-sports`.

## Live sports data

- Added TheSportsDB fixture synchronization with real team badges when supplied by the source.
- Added a second open sporting-events source to expand football coverage.
- Scheduled synchronization every 30 minutes.
- Created read-only public event endpoint.
- Added manual refresh endpoint.
- Verified live agenda responses with real events and competitions.

## Predictive engine

### Football
- Elo engine with home advantage.
- Poisson score distribution.
- Dixon-Coles compatible low-score architecture.
- Monte Carlo simulations.
- Independent markets: 1X2, over/under, BTTS and derived probabilities.
- Historical schema for goals, shots, shots on target, corners and cards.
- Rolling team form and attack/defense-strength schema.
- Implemented historical ingestion for five major European leagues across three seasons using Football-Data.co.uk.

### Tennis
- Defined global Elo and surface-specific Elo.
- Defined serve/return feature set.
- Added database schema for match-level service statistics, rankings, surface and player ratings.
- Preserved provider abstraction because current free historical research data is non-commercially licensed.

## AI

- Deployed `sports-chat` endpoint.
- Added local analytical fallback so chat works without an external model key.
- Prepared Gemini and Groq adapters for low-cost interactive chat.
- Defined Antigravity as a separate deep-analysis agent path rather than the default chat model.

## UX / UI

- Reworked the product direction from promotional mockup to dashboard/product UI.
- Added date, sport, competition and status filtering.
- Added real badge/art consumption from the sports data source.
- Added event selection, model detail and integrated chat surfaces.
- Adopted a dark product design direction inspired by shadcn `new-york`: consistent cards, one primary blue accent, compact data hierarchy and designed empty/loading states.

## Current next steps

1. Complete historical football refresh and verify team ratings.
2. Add model endpoint that enriches each scheduled football event with computed Elo/form/Poisson features.
3. Complete tennis historical refresh for research mode and swap to API-Tennis for commercial use.
4. Add model calibration tracking (Brier / Log Loss) using settled predictions.
5. Connect a Gemini or Groq API key for external chat.
6. Create a dedicated `predictive-sports` GitHub repository when repository-creation access is available and move this project snapshot there.
