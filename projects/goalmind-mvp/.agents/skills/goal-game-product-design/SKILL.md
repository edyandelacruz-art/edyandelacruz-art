---
name: goal-game-product-design
description: Product-design execution rules for GoalMind. Use for any UI, UX, CX, game-loop, accessibility, responsive, or visual-polish change in this project.
---
# GoalMind Product Design Skill

Before changing UI, read PRODUCT.md, DESIGN.md and CX.md.

Apply a combined workflow inspired by the project's vetted design toolchain:
- UI UX Pro Max: reason from product type, interaction pattern, accessibility and responsive requirements; use token architecture rather than arbitrary styling.
- Impeccable: shape first, critique hierarchy/clarity, audit accessibility/responsiveness, then polish; avoid AI-generic design tells and excessive nested cards.
- SkillUI: when a visual reference is supplied, extract its reusable language (tokens, type, spacing, component behavior) instead of copying screenshots blindly.
- UX Discovery Interviewer: distinguish user input from assumptions; keep a happy path, pain points, opportunities and open questions explicit.
- Playwright/browser QA: validate key flows and mobile viewport before calling UI complete.

Project-specific acceptance criteria:
1. The goal itself is the response control.
2. The primary play screen must be understandable without tutorial text.
3. Correct/incorrect/timeout states are visually distinct and readable quickly.
4. Minimum target size is 44 CSS px where feasible.
5. Keyboard focus is visible and A/B/C/D input works on desktop.
6. prefers-reduced-motion is respected.
7. Mobile width 360–430px is the primary viewport; desktop is a contained simulator.
8. No login wall in training MVP.
