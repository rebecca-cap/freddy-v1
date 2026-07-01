# Freddy local workspace

Built per ~/Documents/Project Eddie/Project Eddie/Freddy Exploration/00-Freddy-Plan.html (Phase 1).

## Layout

- `excalibrr-freddy/` — Patched fork of @gravitate-js/excalibrr. Branch: `freddy/base`.
  Adds a mock-mode seam to useApi.ts and useAuth.tsx, gated on `window.__FREDDY_MOCKS__`.
- `proto-base/` — Stripped copy of Gravitate frontend. Boots standalone with mocked data, no backend.
- `fixtures/` — Mock data seeds shared across prototypes.

## Run proto-base
```
cd proto-base
yarn start  # Vite on :3000, accessible on local network (host: true)
```

## Refresh excalibrr after editing
```
cd excalibrr-freddy
yarn build
cd ../proto-base
yarn install --force  # picks up new dist
```

