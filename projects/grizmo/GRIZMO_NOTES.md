# Grizmo — Repo Notes

Read-only recon of `/Users/frankoverland/freddy/projects/grizmo/prototype/` for the Gizmo Option A port. Source-of-truth wireframe: `/Users/frankoverland/Documents/Claude/Projects/Ai Opportunities/Kit Round 4 - Gizmo Option A/gizmo-demo.html`. Generated 2026-05-22.

## 1. Framework / language / package manager / build tool

- **Framework + language:** React + TypeScript. Entry: `prototype/src/index.tsx` (mounts `<App />` from `prototype/src/App.tsx`).
- **Package manager:** Yarn (Berry / 3.2.1). `packageManager: "yarn@3.2.1"` in `prototype/package.json:148`. Lockfile: `prototype/yarn.lock`. `.yarnrc.yml` present.
- **Build tool:** Vite. Config: `prototype/vite.config.js`. Scripts: `start: "vite"`, `build: "vite build"` in `prototype/package.json`. Dev server runs on `VITE_PORT=5181` per repo CLAUDE.md.

## 2. Styling approach

Plain CSS + antd 4.20 + Excalibrr theme system. **No** CSS modules, **no** Tailwind, **no** styled-components / Emotion.

- Global stylesheet: `prototype/src/styles.css`, imported in `prototype/src/App.tsx:1`.
- antd v4.20 used throughout (`Modal`, `Tabs`, `Form`, `Drawer`, etc.). Less preprocessing for antd theme overrides configured in `prototype/vite.config.js:43–47`.
- Theme: `ThemeContextProvider` from `@gravitate-js/excalibrr` wraps the app (`prototype/src/App.tsx:3, 52`). Theming is driven by CSS custom properties (e.g., `--theme-color-2`, `--gray-100`); current theme persisted to `localStorage` under `TYPE_OF_THEME`.
- Component-local styles are imported as plain CSS at the top of the component file (no `*.module.css`).

## 3. State library

React Context + TanStack React Query v4. No Redux, Zustand, MobX, Jotai, Recoil.

- Contexts live under `prototype/src/contexts/` (e.g., `UserContext`, `ContractManagement`). Pattern: `createContext` + provider + `useContext` consumer hook.
- Server state: `QueryClientProvider` in `prototype/src/App.tsx:16`; `useQuery` / `useQueryClient` used throughout.
- Form state: antd `Form.useForm()` (e.g., `prototype/src/contexts/ContractManagement/index.tsx:14`).
- Local UI state: `useState` / `useReducer` at the component level.

## 4. Quote book data grid

| Item | Location |
|------|----------|
| Page component | `prototype/src/modules/PricingEngine/QuoteBook/page.tsx:21` — `QuoteBookPage` |
| Grid component | `prototype/src/modules/PricingEngine/QuoteBook/components/Grid/index.tsx:59` — `QuoteBookGrid` |
| Grid wrapper | `GraviGrid` from `@gravitate-js/excalibrr` (used in `EndOfDay.tsx:81`, etc.) — **not** raw `AgGridReact` |
| Column defs | `prototype/src/modules/PricingEngine/QuoteBook/components/Grid/components/columns/columnDefs.tsx` — assembled from section builders: `InitialColumns`, `PriceInfoColumns`, `PriorColumns`, `CurrentColumns`, `AllocationColumn`, `ProposedColumns` |

**Where rows come from:** `Grid/index.tsx:94` — `const { data: quotes, isFetching } = useQuotes(publicationMode)`. The `useQuotes` hook lives at `prototype/src/modules/PricingEngine/QuoteBook/api/useQuoteBook.ts:38` and calls `api.post(endpoints.overview, { PublicationMode })`. Dynamic fetch via React Query; not static seed.

**Custom cell renderers** (representative examples):
- `QuoteHistoryButton` — `Grid/components/columns/sections/PriceInfoColumns.tsx:56–60`. `LineChartOutlined` icon button that opens a history drawer.
- `NetOrGrossDisplay` — `Grid/components/columns/sections/PriceInfoColumns.tsx:82–86`. Net/gross conversion display with antd `Popover`.
- `StrategyColumnDef` — `Grid/components/columns/ColumnBuilders.tsx:22`. Diff icons + currency formatting.

## 5. Top toolbar — where a Grizmo trigger button would live

**Primary candidate (recommended):** `prototype/src/modules/PricingEngine/QuoteBook/components/Grid/components/QuoteBookActionButtons.tsx:25` — `QuoteBookActionButtons`. Passed to `GraviGrid` as `controlBarProps` from `Grid/index.tsx:162`. Page-scoped (right place for a quote-book-specific Grizmo action).

**Existing controls** in this toolbar:
1. "Publishing For" `Select` (EndOfDay / CurrentPeriod) — line 71
2. "Show spread rows" `Switch` — line 87
3. "Show analytics" `Switch` — line 104
4. "Last Save" timestamp display — line 120
5. (Sibling `QuoteBookPublishFooter` carries Publish / Reset / Save — separate component, not this toolbar)

**Structure for adding a button:** JSX siblings inside a single `<Horizontal verticalCenter style={{ gap: '1rem' }}>` (line 67). Not config-driven — just add a sibling element.

**Suggested insertion point:** between line 118 and line 119 — i.e., immediately before the "Last Save" display, after the analytics `Switch`. Wrap in `<Tooltip>` to match existing pattern.

## 6. Modal / portal pattern

antd `Modal` and `Drawer` exclusively. No custom wrapper, no `createPortal`, no `useModal` hook, no central modal provider.

**Canonical examples to mirror:**
- `prototype/src/components/shared/Uploaders/UploadStatusModal/UploadStatusModal.tsx:31–58` — clean antd `Modal` with `visible` + `onCancel` + custom footer/content.
- `prototype/src/components/shared/Uploaders/ErrorsDrawer.tsx:12` — antd `Drawer` with `visible` + `onClose`.

**State pattern:** Local `useState` at the parent; visible state drilled to the modal as props (e.g., `visible`, `setVisible`, `isVisible`, `onCancel`). Example from `ConfirmRevalueModal.tsx`:

```tsx
const [isVisible, setIsVisible] = useState(false)
<Modal visible={isVisible} onCancel={() => setIsVisible(false)} />
```

**Recommendation for Grizmo:** Reuse the antd `Modal` directly. Host `useState` in `QuoteBookPage` (or the nearest sensible parent of the toolbar trigger) and pass `visible` + `onCancel` into the new `GrizmoModal` component. No need to introduce a hook or context unless the modal needs to be opened from multiple unrelated pages.

## 7. Keyboard shortcut infrastructure

Minimal — no library, no central registry.

- No `react-hotkeys-hook`, `react-hotkeys`, `mousetrap`, or `tinykeys` in `package.json`.
- One existing ad-hoc shortcut: `prototype/src/modules/ContractManagement/components/TradeInfoForm/index.tsx:23–61` — `useEffect` + `window.addEventListener('keydown', ...)`. Pressing **T** inside a date input auto-fills today's date.
- Only ~5 total `keydown`/`keypress` listeners across `prototype/src/` (mostly ag-grid native `onkeydown` cell-editor wiring, not React-level shortcuts).

**Recommendation for Grizmo:** If only one global shortcut is needed (e.g., `Cmd+G` to open the modal), a single `useEffect` + `keydown` listener mounted in `QuoteBookPage` (or app shell) is sufficient and matches the existing ad-hoc pattern. If more than one shortcut is anticipated, introduce a minimal `useKeyboardShortcut(combo, handler, deps)` hook in `prototype/src/hooks/` and let each consumer register its own — avoid pulling in a library for a prototype.

## Quick links

- Wireframe: `/Users/frankoverland/Documents/Claude/Projects/Ai Opportunities/Kit Round 4 - Gizmo Option A/gizmo-demo.html`
- Repo CLAUDE.md: `./CLAUDE.md`
- Project context (always current): `./project-context.md`
- Reference index: `./resources/REFERENCES.md`
- Toolbar insertion file: `prototype/src/modules/PricingEngine/QuoteBook/components/Grid/components/QuoteBookActionButtons.tsx:118`
- Modal pattern to copy: `prototype/src/components/shared/Uploaders/UploadStatusModal/UploadStatusModal.tsx`
