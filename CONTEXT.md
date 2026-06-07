# Spark — AI Agent Context File

> This file is the single source of truth for the Spark project.
> Paste it at the beginning of every new Cursor/Claude Code session to maintain full context.
> Last updated: June 2026

---

## What is Spark?

Spark is a social conversation card game with a built-in language learning layer.
It is designed to be played by a group sharing one device. One person reads the question aloud
and the group converses freely — no turns, no scoring, no structure required.

The core differentiator is a dual-mode system: players can use Spark purely as a social game,
or activate a language learning mode where questions are displayed with progressive immersion
based on the learner's level.

---

## Tech Stack

- **Phase 1 (current):** Vanilla HTML + CSS + JavaScript, hosted on GitHub Pages
- **Phase 2:** Add authentication (Google/Apple login), backend for feedback data
- **Phase 3:** Port to React Native with Expo for iOS App Store release

---

## Project Structure

```
spark/
├── index.html              ← Onboarding / mode selection
├── setup.html              ← Language, level, category selection
├── game.html               ← Main game screen
├── end.html                ← Session end screen
├── style.css
├── app.js                  ← Core logic
├── data/
│   ├── questions.json      ← All questions
│   └── categories.json     ← Category definitions
├── components/
│   ├── card.js             ← Question card component + swipe logic
│   ├── selector.js         ← Language and level selector
│   └── timer.js            ← Session border timer
├── assets/
│   └── icons/
└── CONTEXT.md              ← This file
```

---

## Notes for the AI Agent

- Project language: **English only** — all code comments, variable names, documentation, and UI copy must be in English
- Keep Phase 1 scope tight: no backend, no auth, local storage only
- Prioritize mobile-first layout — the game is played on a phone held by one person
- All components should be modular and easy to port to React Native in Phase 3
- Do not over-engineer: simple, readable vanilla JS is preferred over complex abstractions in Phase 1
- Always import Syne + DM Sans from Google Fonts — never substitute with system fonts
- Use the exact hex values from the color palette — do not approximate
- Glow effects use `filter: blur()` on absolutely positioned divs, not CSS shadows

See full spec in project documentation for user flows, categories, question schema, and visual identity.
