# GoalMind MVP

Playable, mobile-first proof of concept for a gamified educational penalty-shootout app.

## Run locally
Any static server works:

```bash
python3 -m http.server 4173
```

Open `http://localhost:4173`.

## Included now
- Student home and zero-login training flow
- Subject/difficulty/timer setup
- Interactive goal with A–D response zones
- 5-question timed game loop
- Goal/save/timeout states
- Score, speed bonus and streak
- Results + learning interpretation
- Teacher lobby mock
- Progress mock
- PWA manifest/service worker
- Project-local product-design skill

## Validation performed
- JavaScript syntax check
- Mobile viewport visual review at 390×844
- End-to-end browser flow: correct answer → goal, wrong answer → save, timeout → feedback, final results

## Next implementation layer
Supabase content/auth/realtime, teacher question bank, rooms, analytics, then Capacitor Android wrapper/APK.
