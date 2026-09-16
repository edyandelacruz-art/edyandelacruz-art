# Predictive

Predictive is a live sports analytics and probabilistic prediction platform built around reproducible mathematical models, continuously refreshed sports data, and explainable AI.

## Current architecture

- **Frontend / deployment:** Vercel
- **Database and data services:** Supabase PostgreSQL + Edge Functions
- **Live fixtures:** TheSportsDB + open sporting-event feeds
- **Football history:** Football-Data.co.uk
- **Prediction core:** Elo, Poisson, Dixon-Coles adjustments, Monte Carlo simulation, calibrated probabilities
- **Tennis core:** global Elo, surface-specific Elo, serve/return metrics, form and fatigue features
- **AI layer:** local analytical fallback with adapters prepared for Gemini, Groq and Antigravity deep-analysis workflows

## Data principles

Predictive separates observed data from modeled variables. Missing xG, injury or lineup data is represented as unavailable rather than fabricated. Every prediction should retain its model version, source coverage and timestamp so historical performance can be audited.

## Live data flow

```text
Sports providers
      |
      v
Supabase sync functions
      |
      +--> events / participants / source payloads
      +--> historical match tables
      +--> Elo and rolling form tables
      |
      v
Prediction engine
      |
      +--> independent probabilities
      +--> confidence / data coverage
      +--> explanation
      |
      v
Vercel UI + integrated chat
```

## Status — 2026-09-16

- Supabase project `Predictive` online in `sa-east-1`.
- RLS enabled and security advisor clean.
- Live sports-event synchronization active.
- Public read endpoint for the agenda active.
- Sports chat endpoint active with local fallback.
- Automatic fixture synchronization scheduled every 30 minutes.
- Historical football ingestion pipeline implemented for Premier League, La Liga, Serie A, Bundesliga and Ligue 1 across 2024/25, 2025/26 and 2026/27.
- Football Elo and rolling team-strength recomputation implemented.
- Tennis historical/model pipeline is the next active implementation step.

## Public deployment

`https://predictive-sports-edyan.vercel.app`

## Important licensing note

Football historical data currently uses Football-Data.co.uk. Tennis research datasets based on Jeff Sackmann data are non-commercial (CC BY-NC-SA) and therefore must be replaced by a commercially licensed provider before monetizing a production tennis product.
