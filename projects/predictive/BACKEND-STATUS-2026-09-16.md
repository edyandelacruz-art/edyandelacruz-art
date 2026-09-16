# Predictive — Backend status — 2026-09-16

## Supabase project

- Project: `Predictive`
- Region: `sa-east-1`
- Project ref: `jicbvnoomzajivgonpon`
- RLS enabled on the predictive data model.

## Live event ingestion

### TheSportsDB
- Edge function: `sync-sportsdb`
- Sports: football, tennis, basketball.
- Version 2 expands the sync window from yesterday through the next six days.
- Includes team/player badges when the provider supplies them.
- Runs automatically every 30 minutes.

### Sporting Events
- Edge function: `sync-sporting-events`
- Expands open football fixture coverage.
- Runs automatically every 30 minutes.

## Football model

### Historical refresh
Edge function: `refresh-football-model`

Coverage:
- Premier League (`E0`)
- La Liga (`SP1`)
- Serie A (`I1`)
- Bundesliga (`D1`)
- Ligue 1 (`F1`)
- Seasons 2024/25, 2025/26, 2026/27

Latest successful refresh:
- 3,698 historical records loaded in the refresh run.
- 121 team ratings recalculated.

Derived variables:
- Elo with home advantage.
- Rolling form.
- Attack/defense strength.
- Home/away attack and defense splits.
- Goals, shots and shots on target aggregates.
- Recent-match history.

### Event prediction
Edge function: `predict-football-event`

Current model: `football-ensemble-v2.1`

Components:
- Poisson score model.
- Dixon-Coles low-score correction.
- Elo 3-way probability component.
- Empirical shrinkage toward the league mean for small samples.
- Data-quality confidence score.

Outputs:
- Home / draw / away probability.
- Derived expected goals.
- Over/under.
- Both teams to score.
- Clean-sheet probabilities.
- Double chance.
- Most likely scores.
- Explanation and historical data coverage.

Verified example: Barcelona vs Racing Santander. The system correctly matched provider aliases to historical identities and applied shrinkage because Racing had only five current-season data points.

## Tennis model — research mode

Research source is explicitly marked NON-COMMERCIAL (`CC BY-NC-SA 4.0`) and must be replaced with a commercial provider before monetization.

### Historical refresh
Edge function: `refresh-tennis-model`

Coverage:
- ATP 2025–2026
- WTA 2025–2026

Latest successful refresh:
- 8,483 source rows read.
- 8,482 unique matches loaded.
- 1,041 player ratings recalculated.

Derived variables:
- Global Elo.
- Hard-court Elo.
- Clay-court Elo.
- Grass-court Elo.
- Hold percentage.
- Return points won percentage.
- First-serve in percentage.
- First-serve won percentage.
- Second-serve won percentage.
- Break points saved percentage.
- Ace and double-fault rates.
- Last-10 form.
- Recent minutes / fatigue proxy.

### Match prediction
Edge function: `predict-tennis-match`

Current model: `tennis-ensemble-v1`

Outputs:
- Player 1 / Player 2 match probability.
- First-set probability.
- Straight-set probabilities.
- Three-set probability for BO3.
- Surface and global Elo components.
- Serve/return, form and fatigue components.
- Confidence and data quality.

Verified example on hard court:
- Jannik Sinner: 57.8%
- Carlos Alcaraz: 42.2%

This is a model estimate based on the research dataset, not a betting recommendation.

## Automation

Active cron jobs:

| Job | Schedule |
|---|---|
| `predictive_sportsdb_sync` | every 30 min |
| `predictive_sporting_events_sync` | every 30 min |
| `predictive_football_model_refresh` | every 6 h |
| `predictive_football_league_stats_refresh` | every 6 h |
| `predictive_tennis_model_refresh` | daily |

Public triggers are cooldown-protected and invoke the JWT-protected heavy refresh functions server-to-server with Supabase credentials held only in the Edge Function environment.

## UI

Edge function: `predictive-ui`

Current UI supports:
- Real event agenda.
- Date / sport / competition / text filters.
- Real badge display when available.
- Football model calculation for a selected event.
- 1X2, model confidence, expected goals, Elo, form, independent markets and likely scores.
- Integrated Predictive chat surface.

## AI

Edge function: `sports-chat`

Current state:
- Local analytical fallback is active.
- Gemini/Groq adapters are prepared but no external API key is stored yet.
- Antigravity is reserved for the deep-analysis path rather than every chat request.
