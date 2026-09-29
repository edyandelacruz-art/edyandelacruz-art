# Stitch handoff procedure

When the actual Stitch export arrives:

1. Freeze the export as `references/stitch/<version>/`.
2. Inventory every screen and every state.
3. Extract tokens: color, typography, spacing, radius, elevation, motion.
4. Map Stitch components to implementation components.
5. Rebuild the frontend against `GoalMindGameEngine`; do not copy business logic into UI components.
6. Run visual checks at 390×844 first, then tablet and teacher desktop.
7. Compare screenshots against the Stitch source before accepting each screen.
8. Only after visual acceptance connect persisted data and realtime rooms.
