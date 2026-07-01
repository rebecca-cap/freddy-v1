# Scout (module)

Self-contained module for the Scout assistant — the conversational helper
prototyped in `Kit Round 4 - Gizmo Option A/gizmo-demo.html`.

> **This is a prototype with a faked brain.** No real LLM is wired up.
> `services/fakeLlm.ts` returns canned responses with simulated latency so the
> UI can be built and demoed without backend or model dependencies. Replace
> when (and only when) we're ready to talk to a real model.

## Layout

```
src/modules/Scout/
├── index.ts                  Public entry — re-exports the public surface.
├── README.md                 You are here.
├── components/               UI building blocks. All placeholders today.
│   ├── ScoutTrigger.tsx     Toolbar button that opens Scout.
│   ├── ScoutPanel.tsx       Side panel host for the conversation.
│   ├── ScoutModal.tsx       Full / large modal host (antd Modal).
│   ├── ScoutMessageList.tsx Scrollable list of bubbles.
│   ├── ScoutBubble.tsx      Single message bubble (user / assistant).
│   ├── ScoutComposer.tsx    Input + send + attachment controls.
│   ├── ScoutChips.tsx       Suggested prompts / quick actions.
│   ├── ScoutLibrary.tsx     Saved-conversation / history surface.
│   └── ScoutActivity.tsx    "Scout is thinking…" / typing indicator.
├── state/
│   └── ScoutContext.tsx     React Context provider + `useScout` hook.
├── services/
│   └── fakeLlm.ts            `askScout(prompt)` — fake LLM with latency.
├── assets/
│   ├── scout-hi 1.png       Hero / welcome illustration.
│   └── Scout-head 2.png     Mascot head (for trigger button & avatars).
└── styles/
    └── scout.css            Module-wide styles. Component-local CSS sits
                              next to its component when added later.
```

## Conventions (per repo)

- **State:** React Context + hooks. No Redux / Zustand — see `SCOUT_NOTES.md`
  at the repo root.
- **UI library:** antd 4.20 + Excalibrr theme. Reuse antd `Modal` / `Button` /
  `Input` rather than rolling new primitives.
- **Styling:** Plain CSS. No CSS modules, no Tailwind. Theme via CSS custom
  properties (`--theme-color-2`, `--gray-100`, etc.).
- **Imports:** Treat `./index.ts` as the only public surface. Anything not
  re-exported there is internal to the module.

## How it gets used (later, not yet)

1. Mount `<ScoutProvider>` once, high in the tree — likely in
   `QuoteBookPage` or one level above it.
2. Drop `<ScoutTrigger />` into `QuoteBookActionButtons.tsx` (insertion
   point already scouted at line 118–119 — see repo-root `SCOUT_NOTES.md`).
3. Render `<ScoutModal />` and/or `<ScoutPanel />` somewhere stable; both
   read open/close state from the provider.

Until those wiring steps happen, this module is dormant — nothing renders,
nothing imports it, the build is unaffected.

## Faking the brain

`askScout(prompt)` is intentionally trivial. When demos need richer behavior:

- Add canned response routing (regex / keyword → reply) inside `fakeLlm.ts`.
- Keep the call signature stable so swapping in a real client is a one-file
  change.
- Resist the temptation to "almost real" — keep the fake obvious so reviewers
  don't mistake it for actual model output.

## Wireframe reference

`/Users/frankoverland/Documents/Claude/Projects/Ai Opportunities/Kit Round 4 - Gizmo Option A/gizmo-demo.html`
