# FocusLab — Master Product Specification

Status: canonical product specification
Date: 2026-09-16

## 1. Product definition

FocusLab is a mobile-first adaptive cognitive-learning platform that trains learners to capture, filter, switch, retain and recover academic information while interacting with controlled game load.

The product must not present fixed learning-style labels. It measures performance under specific task conditions and adapts future sessions from observed behavior.

## 2. Experience goal

FocusLab must feel like a premium cognitive-training game, not a school dashboard.

The reference experience is the visual direction approved through the generated mockups:

- deep navy / spatial background;
- electric cyan, violet and selective magenta highlights;
- large rounded cards;
- soft glass / luminous edge treatment;
- very little text per screen;
- one obvious primary action;
- contextual speech bubbles instead of long instructions;
- avatar companion present across onboarding, home and training;
- motion used for guidance and feedback, not decoration;
- mobile-first layout with large touch targets.

## 3. Core principle

**Content first. Game second. Measurement only when the data really exists.**

## 4. Primary user flow

1. Welcome / splash.
2. Choose avatar.
3. Enter display name.
4. Home.
5. Start new session.
6. Choose learning objective / cognitive skill.
7. Choose content source.
8. Choose training condition.
9. Choose game.
10. Train.
11. Answer contextual questions.
12. Finish session.
13. See simple real results.
14. Receive next-session recommendation.

## 5. Onboarding

### 5.1 Avatar selection

Initial avatar set:

- Owl — Wisdom
- Robot — Focus
- Fox — Curiosity
- Astronaut — Discipline
- Cat — Calm
- Gamer — Growth

Requirements:

- six large visual choices;
- selected avatar receives a cyan/violet glow ring;
- optional short trait label below each avatar;
- contextual bubble: `Puedes cambiar tu avatar luego`;
- single name field;
- single primary button: `Continuar`;
- no analytics, menus or secondary configuration on this screen.

### 5.2 Avatar behavior

The avatar is a companion, not a decorative profile photo.

It may:

- greet the learner;
- explain one action at a time;
- surface short contextual bubbles;
- celebrate valid progress;
- warn about session state;
- point toward the next interaction.

The companion must never cover the game or the answer buttons during active training.

## 6. Home

Home should immediately answer only three questions:

1. Who am I?
2. What can I do now?
3. Where can I see my progress?

Required visible elements:

- avatar + learner name;
- short greeting;
- large `Nueva sesión` CTA;
- `Continuar` only when an unfinished session exists;
- three large shortcuts: `Juegos`, `Habilidades`, `Progreso`;
- compact bottom navigation: `Inicio`, `Entrenar`, `Explorar`, `Perfil`;
- one contextual bubble when helpful.

Do not show fabricated scores, decorative percentages or dense dashboards.

## 7. Cognitive targets

FocusLab trains eight explicit targets:

1. Selective Attention
2. Divided Attention
3. Working Memory
4. Inhibitory Control
5. Switching
6. Sustained Attention
7. Processing Speed
8. Recall

No skill score is displayed unless it is derived from stored sessions.

## 8. MVP game system

### 8.1 Runner — Auditory Attention

Goal: maintain a simple continuous visuomotor task while listening to academic audio.

Visual behavior:

- side-scrolling luminous platform world;
- selected avatar may become the playable runner;
- minimal HUD;
- question appears as a large bottom overlay;
- answer choices are large touch targets;
- bubble guidance can appear before the first trial only.

Primary measures:

- academic accuracy;
- response latency;
- game score;
- collisions;
- active pause policy.

### 8.2 Tetris — Working Memory

Goal: maintain spatial planning while holding and retrieving information.

Visual behavior:

- large neon board;
- next-piece panel;
- minimal level / points panel;
- question overlay floats over the lower-middle game area;
- four large answer buttons;
- game continues or pauses according to active policy.

### 8.3 Road Dodge — Inhibitory Control

Goal: avoid distractors and inhibit incorrect actions under competing visual load.

Visual behavior:

- forward neon road;
- car near bottom center;
- obstacles and reward markers;
- question card centered above the player vehicle;
- answer choices must not block lane visibility more than necessary.

### 8.4 Pong — Visual Attention

Goal: track a moving target and respond to visual information.

Visual behavior:

- clean luminous playfield;
- high-contrast ball and paddles;
- short question beneath the game board;
- directional / conceptual answer buttons.

### 8.5 Snake — Recall

Goal: retrieve previously presented information while maintaining spatial planning.

Visual behavior:

- dark grid with luminous snake;
- colored targets / stimuli;
- recall question appears below the grid;
- simple color / concept answer buttons.

### 8.6 Memory Grid — Visual Memory

Goal: observe and reproduce a short spatial sequence.

Visual behavior:

- large 4x4 grid;
- cells illuminate with cyan / violet highlights;
- clear phase labels such as `Observa` and `Repite`;
- minimal level and step indicators;
- no dense HUD.

## 9. Question overlays

Questions are not a separate school screen. They are part of the game experience.

Rules:

- large readable prompt;
- maximum four answer options in MVP;
- large mobile-first touch targets;
- one question at a time;
- subtle background dimming rather than full visual reset;
- no unnecessary explanatory text;
- answer feedback must be brief and non-blocking.

Pause policies:

- `pause_all`: content and game pause;
- `pause_content`: academic content pauses, game continues;
- `continue_all`: both continue.

The active policy must be stored with every response.

## 10. Content model

Current supported source:

- editable academic text;
- optional URL as reference metadata.

Current local pipeline:

`text -> normalize -> segment -> grounded questions -> narration -> training -> session trace`

Future verified pipeline:

`provider / YouTube -> verified transcript -> semantic concepts -> AI questions -> grounding validation -> calibrated items`

A URL alone must never be labeled as a retrieved transcript.

## 11. Result screen

The result screen must be intentionally simple.

Show only data that really exists, such as:

- learning accuracy;
- average response time;
- game score / task errors;
- final adaptive level;
- baseline comparison when a valid matched baseline exists;
- one next-step recommendation.

Do not display arbitrary composite scores such as an unvalidated `Focus Index` or `Cognitive Score`.

## 12. Progress

Progress should prioritize clarity over analytics density.

Initial progress views:

- sessions completed;
- observed accuracy by trained skill;
- observed accuracy by difficulty / final level;
- matched baseline vs dual-task comparisons;
- later: delayed recall, switching cost and longitudinal trends.

Empty state is valid and preferred to fake data.

## 13. Visual system

### Color direction

- Background: deep navy / near-black blue.
- Primary: electric cyan.
- Secondary: violet.
- Accent: selective magenta.
- Success: mint / aqua green.
- Warning: warm yellow / amber.
- Error: soft coral-red.

### Geometry

- large radii;
- soft cards;
- circular avatar and icon containers;
- pill-shaped small controls;
- luminous borders used sparingly;
- layered depth rather than flat enterprise cards.

### Motion

Use motion for:

- screen entrance;
- selected avatar confirmation;
- speech bubble entrance;
- button press feedback;
- question overlay appearance;
- correct / incorrect microfeedback;
- progress transitions.

Avoid continuous decorative animation that competes with the cognitive task.

## 14. Navigation

Mobile-first bottom navigation:

- Inicio
- Entrenar
- Explorar
- Perfil

Progress may be accessed from Home and Explore rather than forcing a fifth primary tab.

Desktop may use a compact sidebar, but the information architecture must remain identical.

## 15. Technology target

Recommended implementation stack:

- Next.js / React
- TypeScript
- Tailwind CSS
- shadcn/ui for accessible UI primitives
- Motion for transitions and microinteractions
- Phaser for game runtime
- Howler.js for reliable audio control
- Zustand for lightweight application/session state
- Supabase for Auth + PostgreSQL + Storage when capacity is available

## 16. Engineering rules

1. Game rendering must remain independent from cognitive analytics.
2. Academic and game performance are stored separately.
3. No UI redesign may silently remove measurement events.
4. No fake analytics values.
5. No fixed learner-type labels.
6. One major adaptive dimension should change at a time when possible.
7. Source identity must be traceable.
8. Mobile touch interaction is first-class.
9. Avatar guidance must never obscure the task.
10. Accessibility and reduced-motion behavior must be supported.

## 17. Product acceptance criterion

A new user should be able to open FocusLab, select an avatar, understand the home screen in under a few seconds, begin a training session without reading instructions, play one of the six games, answer learning questions through contextual overlays, finish the session and understand the real result without needing a tutorial.

That is the experience the approved image references represent, and implementation should be judged against this standard.
