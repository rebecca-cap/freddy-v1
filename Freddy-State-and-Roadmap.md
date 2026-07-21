# Freddy: Current State & Roadmap

*Last updated: July 21, 2026*

**Goal:** a designer or PM creates a prototype in the hub, picks which product it's for (PE or OSP), pushes a branch, and the team automatically gets a shareable URL to the live prototype, with no manual steps.

## Where we are

Freddy is two pieces:

- **The `Freddy-Proto-Base` repo:** the frontend app. Each prototype is a branch, and the goal is that each branch deploys to its own URL. It's a self-contained, mock-backed copy of the Gravitate frontend. PE and OSP are **the same app** (same codebase, differing only by backend, which pages show, and theme, currently a dropdown in the user panel), so a prototype just declares which product it targets; there's no separate app per product.
- **The hub (`project-hub`):** runs locally. It shows a dashboard of every project and creates new ones, each as a git worktree of proto-base on its own branch. Today it's local-only: it spawns local dev servers and opens `file://` lo-fi links, and by design it does *not* push branches or build. The roadmap extends it to push and to surface each prototype's deployed URL, so the dashboard links point at the live demos.

Progress so far:

- **Runs without a backend.** It intercepts network calls to serve built-in fixtures and seeds mock auth before React mounts, so it can ship as a static site in a small Docker image. The current mechanism (a `window.fetch` monkey-patch in `bootstrap.ts`) is a stopgap and will be replaced with the standard mock seam we use in excalibrr and the prototypes repo.
- **Excalibrr npm migration is done on `master`.** `master` is on the published `@gravitate-js/excalibrr` at the production version (antd 5.23, excalibrr `^5.2.10`). **Decision (2026-07-21): this does not get force-propagated to every branch.** Two tracks instead — new prototypes are cut from `master` as-is (born current); existing prototypes stay on their antd-4 base and pull individual fixes via cherry-pick, not a full merge across the antd 4→5 boundary. See "Decisions made" below.
- **The deploy pipeline works, end to end, for `master`.** `master` now builds and deploys automatically to **https://proto-base.pe.gravitate.energy/** — that's Phases 0-2 proven out for the base branch. What's left for the full vision is the per-branch/per-prototype path: `prototype-<slug>.pe/osp.gravitate.energy` URLs for individual project branches (Phase 3), and the hub driving product choice + push (Phase 4).

What's left: extend the working pipeline from the single `master` URL to per-branch prototype URLs, and have the hub drive branch creation/push end to end. One security item is still open: the build config has committed secrets (npm token, Slack webhook) that must be rotated — confirm this happened as part of standing up the live pipeline; if not, it's still the first thing to close out.

## Roadmap at a glance

| Phase | Goal | Depends on | Status |
|---|---|---|---|
| **0: Secure & verify** | Rotate leaked secrets; confirm clean build + run from a clean checkout | Repo only | Confirm secret rotation happened |
| **1: Align branches (two-track)** | Master stays canonical + current; existing prototype branches stay on antd 4 and cherry-pick fixes on demand — no forced migration | Phase 0 | Master done; two-track decision made 2026-07-21 |
| **2: Build pipeline** | Auto-build a deployable image per branch | Phase 0; infra creds | **Working for `master`** |
| **3: Auto-deploy (the URL)** | Push a branch → live URL behind a login, on the PE or OSP subdomain | Phase 2; infra team | Proven for `master` (proto-base.pe.gravitate.energy); per-branch/per-slug URLs not started |
| **4: Hub workflow** | Product picker at creation + the config/instructions that make a prototype deployable; portable to any machine | Phase 3 | Not started |
| **5: Polish** | Shared index page of live demos, refreshed base | Phase 3 | Later |

Critical path to the first per-project URL: 0 → 1 → 2 → 3 (2 and 3 already proven for `master`; remaining work is making them per-branch).

---

# Technical deep-dive

*For engineers implementing the plan.*

## Key facts (verified)

- **Standalone app.** `src/freddy/bootstrap.ts` monkey-patches `window.fetch` (55 fixtures + safe-proxy fallback) and seeds mock auth tokens into `localStorage` before React mounts → static-serve Docker image (`serve -s build`, port 3000, matching the prototypes-repo model). **Slated for replacement** by the excalibrr / prototypes-repo mock seam (see Phase 1).
- **PE and OSP are one app.** Product is a runtime toggle (backend + visible pages + theme), currently a user-panel dropdown, not a separate codebase. A prototype just needs to declare its target product.
- **Excalibrr migration done on `master` only.** Commits `40b9362` + `743d4ae` moved `package.json` to `@gravitate-js/excalibrr: ^5.2.10` (lockfile `5.2.17`, = production), migrated antd 4→5, theming/app wiring, app-side auth seeding. The `file:../excalibrr-freddy` dep still survives on the stale `freddy/qa-pass-3-zero-noise` branch (merged, 0 ahead) and the grizmo branches, which still need the migration. Fork-only components (Day / Payroll / WeekPickerControl) have zero imports: no overlay folder; discard the fork once nothing references it.
- **CI today.** `.drone.jsonnet` (copied from prod frontend) builds a Docker image per branch → GAR `gravitate-registry/hold/bb_frontend_${branch}`. Contains a hardcoded live npm token + Slack webhook (also in the prod repo).
- **Deploy infra to reuse.** `Gravitate.Dotnet.DeploymentConfigs/pr-preview/`: ArgoCD ApplicationSet + Helm on dev AKS, wildcard DNS/TLS for `*.pe` / `*.osp.gravitate.energy` (KeyVault certs, AKS app-routing nginx), kube-green sleep, ACR pulls via managed identity. Caveat: pr-preview not fully live as of 2026-06-10, coordinate with infra.

## Decisions made

- Reuse the pr-preview infrastructure; don't build new.
- **OSP is the same app**, selected via the product toggle (backend/pages/theme), no second repo. A prototype declares its product; that picks the subdomain.
- **Excalibrr = straight npm dependency on `master`, never a fork/hot-edit branch (decided 2026-07-21).** Excalibrr is a shared design-system library other products depend on; Freddy doesn't own it, and a real change ships to every consumer. New prototypes consume the real, published version as-is. Visual needs get a local, scoped override inside proto-base first (antd `ConfigProvider` tokens, scoped CSS); an actual excalibrr-repo PR is reserved for changes that genuinely belong in the shared library, with cross-product sign-off, and should stay rare. No "freddy" fork/branch of excalibrr gets blessed for live-editing, on any antd line.
- **No forced migration of existing prototype branches (decided 2026-07-21).** Two tracks: new prototypes are cut from `master` (born current, antd 5 + published excalibrr); existing prototypes stay on their antd-4 base and get individual fixes via cherry-pick, not a full merge across the antd 4→5 boundary. Superseded the earlier "propagate migration everywhere" plan.
- Drop the `window.fetch` monkey-patch in favor of the standard excalibrr / prototypes-repo mock seam.
- URLs under the existing `*.pe` / `*.osp` wildcards: `prototype-<slug>.pe.gravitate.energy` (PE) / `prototype-<slug>.osp.gravitate.energy` (OSP), subdomain chosen by the product picked at creation. *(Open: confirm the exact prefix/slug scheme.)* Proven separately: `master` itself now deploys to `proto-base.pe.gravitate.energy`.
- Order: proto-base deploy → hub product picker → hub portability → index page → proto-base freshness.

## Phase 0: Secure & verify master *(repo-only)*

1. **Rotate** the leaked npm token + Slack webhook. Both are in git history of this repo and the prod frontend, coordinate an org-wide rotation.
2. **`.drone.jsonnet`:** hardcoded token → `{"NPM_TOKEN": {"from_secret": "npm_token"}}` + `--build-arg NPM_TOKEN=$NPM_TOKEN`; Slack webhook → `from_secret: slack_webhook`.
3. **Verify master locally:**
   - `git checkout master && rm -rf node_modules && NPM_TOKEN=… yarn install` (no `excalibrr-freddy` in resolution)
   - `yarn build`; `docker build . --build-arg NPM_TOKEN=$NPM_TOKEN` (proves the CI path)
   - `yarn start` → authenticated shell, mock-mode banner, no red console errors
4. **Align the Dockerfile with the working prototypes-repo build** (`Gravitate.SellingSolutions.Prototypes/dockerfiles/demo.Dockerfile`, which is what runs today, so model it rather than reinvent): `node:20-alpine` both stages, `yarn install --immutable`, static `serve -s build -l 3000`. The current proto-base Dockerfile is `node:16-alpine`, plain `yarn install`, serves on 5000, and injects env at runtime via `entrypoint.sh`; since the app is fully mocked there's nothing to inject at runtime, so drop the entrypoint, go fully static, and standardize on port 3000. Only the per-branch bits (image name/tag/trigger, handled in Phase 2) should differ. Re-verify the build after.
5. **Canonicalize:** keep `master` (origin/HEAD); fast-forward or delete `main`; delete the merged `freddy/qa-pass-3-zero-noise` worktree/branch.

## Phase 1: Align branches (two-track, no forced migration)

1. **Replace the fetch monkey-patch.** Swap the `window.fetch` patch in `bootstrap.ts` for the standard mock seam used in excalibrr and the prototypes repo. Keep the 55 fixtures and mock-auth seeding behavior; change the mechanism. (Applies to `master` / new-track prototypes.)
2. **Do not propagate the excalibrr npm migration to existing antd-4 branches.** Superseded: the old plan ("migrate everywhere") is replaced by the two-track decision above. `project/grizmo` and other in-flight antd-4 branches (and the stale `freddy/qa-pass-3-zero-noise` before deletion) stay on their base; pull individual upstream fixes via `git cherry-pick` on demand instead of rebasing/merging across the antd 4→5 boundary.
3. **New prototypes are cut from `master` directly**, already on antd 5 + published excalibrr — no migration step needed for them.
4. **Verify each active branch:** boot + QA crawl (`BASE_URL=http://localhost:3000 node ~/repos/freddy-v1/qa/crawl.cjs`) vs the zero-noise baseline in `~/repos/freddy-v1/qa-reports/`.
5. **Push missing local-only branches:** `project/test-2`, `project/test-3`, `project/quote-filter-bar` (PE); `project/index-special-pricing` (OSP-targeted). Includes promoting the demo that currently lives only in a worktree (not on a real branch) to a proper pushed branch.
6. **Reconcile local-only work with `master`:** any local QA commits sitting ahead of `master` (e.g. a `freddy/qa-pass-*` line) should go up as a PR so the fork and `master` stop diverging in both directions.

## Phase 2: Drone pipeline for deployable images *(working for `master`)*

Edit `.drone.jsonnet`:

1. **Image name:** `bb_frontend` → `freddy-proto-frontend`. (Branch-in-image-name is broken: `${DRONE_BRANCH,,}` only lowercases, so `project/grizmo` produces a nested GAR path.)
2. **Tags:** 7-char commit SHA (ArgoCD pins this) + sanitized branch tag (`SAFE_BRANCH=$(echo "$DRONE_BRANCH" | tr '[:upper:]/' '[:lower:]-')`).
3. **Push to ACR** `gravitateenergy.azurecr.io` (AKS pulls via managed identity, no pull-secret plumbing). New Drone secrets `acr_username` / `acr_password`. Keep or drop the GAR push.
4. **Trigger:** replace the exclude-list with `include: [master, project/, variant/]`.
5. **Drone admin:** activate repo; add secrets `npm_token`, `slack_webhook`, `acr_*`.

## Phase 3: proto-preview (ArgoCD ApplicationSet + Helm chart) *(`master` proven at proto-base.pe.gravitate.energy; per-branch/per-slug URLs below still to build)*

New `proto-preview/` tree in `Gravitate.Dotnet.DeploymentConfigs` (trimmed copy of `pr-preview/`):

- **`chart/templates/`:** `frontend.yaml` (port 3000, probes on `/`, ~50Mi/50m), `ingress.yaml` (single host, `/` → `frontend-svc:3000`, basic-auth annotations), `auth-secret.yaml`, `sleepinfo.yaml` (`sleep.enabled: false` to start; see lifecycle question below), `_helpers.tpl` (validate slug, build host).
- **`chart/environments/`:** one values file per product: `freddy-pe.yaml` (subdomain `pe`) and `freddy-osp.yaml` (subdomain `osp`); shared `images.frontend: freddy-proto-frontend`, host prefix `prototype`.
- **Product → subdomain.** The prototype declares its product (in branch config the hub writes, e.g. `.freddy-project.json`); the ApplicationSet maps `pe`/`osp` to the values file and the `*.pe` / `*.osp` wildcard. *(Confirm how the SCM generator reads the product field.)*
- **URLs:** `prototype-<branchNormalized>.pe.gravitate.energy` / `.osp.gravitate.energy` (e.g. `prototype-project-grizmo.pe.gravitate.energy`): existing wildcard DNS + KeyVault certs (`star-pe-…`, `star-osp-…`); no new DNS/cert work.
- **ApplicationSet `proto-preview`,** SCM Provider generator: `allBranches: true`, `repositoryMatch: ^Freddy-Proto-Base$`, `branchMatch: ^(project|variant)/`; params `slug={{.branchNormalized}}`, `headSha={{.short_sha_7}}`; namespace `proto-{{.branchNormalized}}`; automated prune + selfHeal + retry (rides out the image-build race). Branch deleted → env auto-pruned.
- **Open: environment lifecycle.** We ship with sleep disabled to start (static pods are ~free), but need to decide the running model: should idle prototypes sleep and wake on click, and should they auto-decommission after N days of no traffic (or once the branch is stale)? kube-green (`sleepinfo.yaml`) already handles the sleep/wake side; branch-delete already prunes. This is the piece we haven't settled.
- **Source of truth:** canonical ApplicationSet + new AppProject in the "Infrastructure - AKS Dev" Terraform repo (`argo.proto-preview.tf`); YAML mirror in `proto-preview/system/`.
- **Access control:** nginx basic-auth annotations (shared credential via the existing 1Password-operator pattern, `ss-test-environments` vault). Verify AKS webapprouting honors `auth-*` annotations first (test on a throwaway ingress); fallback: source-range allowlist, later oauth2-proxy/Entra.

**Infra-team dependencies:** GitHub App (`pr-preview-github-app`) on `Freddy-Proto-Base` with Contents:Read; Terraform PR review/apply; ACR push credential; 1Password item.

**Optional interim** (before ArgoCD): deploy one branch by hand: Cloud Run from the existing GAR image (`--no-allow-unauthenticated` + invoker grants), or a hand-written Deployment/Service/Ingress at `prototype-grizmo.pe.gravitate.energy` (rehearses the ingress/TLS/basic-auth assumptions).

## Phase 4: Hub workflow

The hub owns the create-a-prototype flow, so it has to produce branches the pipeline can deploy. This is a real expansion of scope: today the hub explicitly doesn't push or build (see "Where we are").

1. **Product picker at creation.** Add "which product (PE / OSP)?" to the new-prototype workflow; write the choice into the branch's config (e.g. `.freddy-project.json`) so Phase 3 can map it to a subdomain.
2. **Deploy-ready scaffolding.** The hub writes whatever each prototype needs to build and deploy (correct branch prefix, product field, any CI hints) so no manual setup is required after creation.
3. **Push + surface the URL.** Give the hub the ability to push the branch (or make the push step trivial), then show each project's deployed URL on the dashboard so the links open the live demos, not just local dev servers. Overlaps with the Phase 5 index page.
4. **Portability.** Make `project-hub` run on any machine: `FREDDY_ROOT` respected everywhere (`server/paths.ts` has it); replace ~96 hardcoded home-directory paths (`CLAUDE.md`, `.freddy-project.json`, resource paths) with relative/env-derived paths; fix `.decouple-prototype.sh`. Delete the empty `Freddy-Proto-Base/` placeholder in `freddy-v1`.

## Phase 5: Polish

1. **Deployed index page:** static "hub" page listing live prototype URLs (generated from the ArgoCD app list or a JSON in DeploymentConfigs), deployed the same way, one link to share.
2. **Proto-base sync (ongoing).** The proto-base has to stay current with whatever it's a prototype *of*. Rather than a one-time refresh, make this a repeatable workflow: take a chosen upstream, strip out the backend / turn on the mocks via a documented recipe, and land the result as the new proto-base. Default upstream is **main dev** for now (revisit prod-mock later with the team). The mock-off recipe becomes the reusable step, and the upstream should be configurable so we can point at a different environment when needed. Today's base is a ~2025-12 snapshot; `OSP-ProtoBase-Plan.html` has the existing sync notes to build the recipe from.

## Verification

- **Phase 0 / 1:** the Phase 0.3 checklist per branch + QA crawl diff vs `qa-reports/` baseline; manually check QuoteBook, CommandCenter, OrderDashboard, Admin grids, `/login` after clearing `localStorage`; confirm the new mock seam serves the same fixtures the fetch patch did.
- **Phase 2:** push a trivial commit to `project/grizmo` → Drone green → image in ACR with SHA + branch tags.
- **Phase 3:** `helm template` with test values for both products; after the ApplicationSet applies, push a branch → app appears in ArgoCD → `https://prototype-project-grizmo.pe.gravitate.energy` renders behind basic auth; an OSP-targeted branch lands on `.osp`; delete a test branch → env pruned.
- **Phase 4:** create a prototype in the hub, pick OSP, push → it deploys to the OSP subdomain with no manual steps.
- **End-to-end:** a designer creates a prototype, picks a product, pushes, and the team sees it at the URL.

## Critical files

- `~/repos/Freddy-Proto-Base/.drone.jsonnet`: secrets, image rename, tags, ACR, trigger
- `~/repos/Freddy-Proto-Base/Dockerfile`: align with the working model (NPM_TOKEN ARG already correct)
- `~/repos/Gravitate.SellingSolutions.Prototypes/dockerfiles/demo.Dockerfile`: the working build to model the proto-base Dockerfile after (node:20, `yarn install --immutable`, static `serve -s build`)
- `~/repos/Freddy-Proto-Base/src/freddy/bootstrap.ts`: the fetch-patch mock seam to be replaced
- `~/repos/Gravitate.Dotnet.DeploymentConfigs/pr-preview/chart/*`: copy basis for `proto-preview/`
- `~/repos/Gravitate.Dotnet.DeploymentConfigs/pr-preview/system/argocd-applicationset.yaml`: template for the SCM-provider ApplicationSet + `argo.proto-preview.tf`
- `project-hub` (`server/paths.ts`, `.freddy-project.json`, `.decouple-prototype.sh`): creation workflow, product picker, portability
