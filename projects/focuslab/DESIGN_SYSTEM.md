# FocusLab — Visual Design System

Status: canonical UI direction
Date: 2026-09-16

## Design objective

Recreate the approved FocusLab mockup direction in the actual product: premium, playful, cognitively calm, neon-spatial, mobile-first and immediately understandable.

## 1. Visual personality

FocusLab should feel like a high-quality game companion for learning, not a classroom LMS and not a generic SaaS dashboard.

Keywords:

- luminous
- calm
- futuristic
- friendly
- playful
- focused
- premium
- minimal

## 2. Color tokens

Suggested starting tokens:

```css
--fl-bg-950: #06101f;
--fl-bg-900: #0a1630;
--fl-surface: rgba(17, 36, 70, 0.78);
--fl-surface-strong: rgba(18, 39, 75, 0.94);
--fl-cyan: #59e8f6;
--fl-cyan-bright: #76f4ff;
--fl-violet: #8d72ff;
--fl-magenta: #d76cff;
--fl-mint: #73efc0;
--fl-yellow: #ffd85c;
--fl-error: #ff718a;
--fl-text: #f8fbff;
--fl-muted: #9baed0;
```

The actual implementation may tune values after device testing, but the hue relationships should remain stable.

## 3. Background treatment

Use a deep navy background with restrained atmospheric elements:

- radial cyan/violet glow regions;
- soft floating spheres / planets;
- subtle cloud shapes near screen edges;
- occasional small star points;
- very low contrast environmental decoration behind content.

Game screens may increase environmental illustration but the task must retain the highest visual priority.

## 4. Glass / card style

Primary cards:

- large radius: 24–36px;
- translucent dark navy fill;
- thin blue/cyan edge;
- soft internal highlight;
- subtle shadow;
- optional blurred background;
- glow only for selected or active elements.

Avoid using this effect on every small element. Hierarchy must remain obvious.

## 5. Buttons

### Primary CTA

- wide;
- high contrast;
- cyan-to-violet gradient;
- dark text;
- strong radius;
- slight outer glow;
- clear press state.

Examples:

- `Continuar`
- `Nueva sesión`
- `Iniciar sesión`

### Secondary action

- dark translucent pill;
- thin cyan edge;
- white or light-blue text.

### Game answer button

- large rectangular rounded tile;
- minimum comfortable touch target;
- optional icon / emoji only when it improves comprehension;
- selected answer uses brighter cyan/violet highlight.

## 6. Typography

Direction:

- geometric sans-serif;
- large bold headings;
- medium-weight labels;
- generous spacing;
- short copy.

Rules:

- no dense paragraphs inside training screens;
- game title + skill may occupy one or two lines maximum;
- contextual instruction should usually be under 8 words;
- metadata should use small uppercase labels sparingly.

## 7. Avatar system

### Selection screen

Six large circular or rounded avatar tiles arranged in a visually balanced grid.

Selected state:

- cyan-violet glow ring;
- subtle scale increase;
- check badge;
- optional floating sparkle.

### Companion bubble

Speech bubbles should:

- emerge near the avatar;
- contain one short sentence;
- use a rounded glass panel;
- use a small companion icon;
- enter with soft spring motion;
- disappear automatically when the action is understood.

Examples:

- `Puedes cambiar tu avatar luego`
- `Empieza con una sesión corta`
- `Escucha y responde`
- `Mantén el ritmo`
- `Recuerda mientras juegas`

## 8. Home layout

Priority order:

1. Logo / avatar identity.
2. Greeting.
3. One large hero card.
4. Primary CTA.
5. Three shortcuts.
6. Bottom navigation.

The hero card may feature the chosen companion avatar with a short message and no analytics clutter.

## 9. Game HUD language

Each game uses the same structural HUD language:

### Header
- FocusLab logo or compact mark;
- current avatar pill;
- timer when relevant.

### Title area
- game name;
- cognitive target;
- one short instruction.

### Game area
- largest object on screen.

### Question state
- overlay or card appears without navigating away;
- background game remains visible;
- answer buttons are clear and large.

### Footer controls
- pause;
- audio;
- minimal score/progress only when meaningful.

## 10. Individual game direction

### Runner
- side-scrolling floating platform world;
- stars / collectibles;
- soft neon obstacles;
- character silhouette must remain readable.

### Tetris
- luminous block colors;
- dark grid;
- next-piece module;
- compact score/level module;
- question overlay never hides the full board.

### Road Dodge
- strong vanishing-point road;
- luminous lane edges;
- cones / barriers / reward tokens;
- vehicle anchored low on screen.

### Pong
- very clean arena;
- cyan and violet paddles;
- bright white ball with motion trail;
- minimal distraction around playfield.

### Snake
- clean grid;
- luminous segmented snake;
- colored stimulus targets;
- recall overlay below or above grid.

### Memory Grid
- 4x4 luminous tile grid;
- observation / recall phases clearly separated;
- cyan/violet highlighted cells;
- one step indicator.

## 11. Motion system

Suggested motion language:

- 160–260ms UI transitions;
- soft spring for avatar and speech bubbles;
- 90–140ms press feedback;
- question overlay: fade + slight vertical lift;
- success: controlled glow pulse;
- error: small directional shake, no aggressive red flash.

Reduced-motion setting must disable nonessential animation.

## 12. Information-density rule

A screen should generally have:

- one primary task;
- one primary CTA;
- no more than 3 secondary choices before scrolling;
- no decorative metric that has no real data source.

Training screens are the strictest: every visible element must justify its presence.

## 13. Responsive behavior

Primary reference is mobile portrait.

Tablet and desktop should scale content without turning the product into an enterprise dashboard.

Desktop may:

- center the mobile-like training canvas;
- use additional horizontal room for secondary context;
- preserve the same visual hierarchy.

## 14. Accessibility

- touch targets >= comfortable mobile size;
- sufficient text contrast;
- avoid relying only on color for state;
- keyboard access for desktop;
- screen-readable labels for controls;
- reduced-motion support;
- audio controls always reachable.

## 15. Non-negotiable visual acceptance

The implemented UI should immediately resemble the approved image direction in:

- color atmosphere;
- rounded luminous cards;
- avatar companion system;
- simple page hierarchy;
- speech bubble guidance;
- game-specific illustrations;
- minimal dense analytics;
- mobile-first interaction.

If the implementation begins to look like a generic admin dashboard, it has drifted away from the approved design.
