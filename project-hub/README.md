# Project Hub

Local workspace for Freddy — a stripped-down Gravitate prototype clone. The Hub
lets a designer spin up isolated prototype projects, each one a git worktree of
`~/freddy/proto-base/` on its own branch, with a place for lo-fi rounds and
resources alongside.

## Layout

- `src/` — Vite + React + TypeScript + Tailwind + shadcn UI
- `server/` — Express API (port 3030), spawns prototype dev servers
- `data/` — local JSON persistence (gitignored)

## Prerequisites

Before creating your first project, make sure these exist on disk:

- `~/freddy/proto-base/` — clean git worktree on `main`
- `~/freddy/excalibrr-freddy/` — sibling required by the prototype's
  `package.json` (`file:../excalibrr-freddy`)

The Hub will create `~/freddy/projects/<slug>/` on demand and attach a worktree
of proto-base inside it.

## Setup

```bash
cd ~/freddy/project-hub
npm install
```

## Run

```bash
npm run dev        # both servers
# Hub UI:   http://localhost:5174
# API:      http://localhost:3030
```

Or use the convenience script (one-time `chmod +x start.sh`):

```bash
chmod +x start.sh
./start.sh
```

## Ports

The Hub UI is `:5174`, the Hub API is `:3030`. The proto-base main prototype
runs on `:5173`. The Excalibrr demo on `:3000` is decoupled and unrelated.
Each spawned project prototype is allocated a free port starting at `3002`
and persisted in `data/projects.json`.

## Lo-fi rounds

Each project has `design-system/lofi/round-N/` folders. The "Open" link in the
UI is a `file://` URL — most browsers will open it for local clicks. For richer
preview, just `open ~/freddy/projects/<slug>/design-system/lofi/round-N/` from
the terminal.

## What this is NOT

- It does not push branches anywhere
- It does not run `yarn build` for you
- It does not edit `~/freddy/proto-base` directly — only via worktrees
