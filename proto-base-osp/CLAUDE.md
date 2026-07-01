# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Important Rules

- **Do NOT run `yarn build`** - The user will always handle build verification manually. Skip any verification steps that involve running the build.

## Development Commands

### Core Commands
```bash
yarn start               # Start development server (port 3000)
yarn build              # Build for production
yarn test               # Run tests with Vitest
yarn dep-purge          # Clean install (removes node_modules, build, .yalc)
```

### Testing
```bash
yarn test               # Run all tests in watch mode
npx vitest run          # Run tests once
npx vitest --ui         # Run tests with UI
npx vitest <filename>   # Run specific test file
```

### Cypress E2E Testing
```bash
npx cypress open        # Open Cypress test runner
npx cypress run         # Run E2E tests headlessly
```

### Storybook
```bash
yarn storybook          # Start Storybook dev server
yarn build-storybook    # Build Storybook for production
```

### Build Version Generation
```bash
yarn generate-build-version  # Generate build version before build
```

## Project Architecture

### Technology Stack
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite 3
- **Testing**: Vitest + Cypress
- **State Management**: @tanstack/react-query for server state
- **UI Library**: Ant Design 4.20
- **Grid Component**: AG Grid Enterprise
- **Styling**: Less with custom theming system
- **Charts**: @nivo for data visualization
- **Code Editor**: Monaco Editor
- **Routing**: React Router v6

### Directory Structure
```
src/
├── api/                    # API hooks and types (useX pattern)
├── components/shared/      # Reusable UI components
├── contexts/              # React Context providers
├── hooks/                 # Custom React hooks
├── modules/               # Feature modules (page-level components)
├── utils/                 # Utility functions and helpers
└── assets/                # Static assets (images, fonts, themes)
```

### Key Architectural Patterns

#### API Layer
- Uses `@tanstack/react-query` for data fetching
- API hooks follow `useX` naming pattern (e.g., `usePrices`, `useContracts`)
- Each API hook folder contains:
  - `index.ts` - Main hook implementation
  - `types.ts` - TypeScript definitions
  - `responseTypes.ts` - API response types

#### Module Organization
- Feature-based module structure in `src/modules/`
- Each module can contain:
  - `page.tsx` - Main page component
  - `components/` - Feature-specific components
  - `api/` - Feature-specific API hooks
  - Column definitions for grids (`columnDefs.tsx`)

#### Page Configuration
- Centralized page routing in `src/modules/pageConfig.tsx`
- Permission-based navigation structure
- Nested route support with breadcrumbs

#### Component Patterns
- Shared components in `src/components/shared/`
- Grid components heavily use AG Grid Enterprise
- Formula editor uses Monaco Editor
- Theming system supports multiple client brands

#### State Management
- Server state: @tanstack/react-query
- Local UI state: React useState/useReducer
- Global state: React Context (UserContext, ThemeContext, etc.)

### Path Aliases
Uses TypeScript path mapping for clean imports:
```typescript
@api/*          -> src/api/*
@components/*   -> src/components/*
@modules/*      -> src/modules/*
@utils/*        -> src/utils/*
@hooks/*        -> src/hooks/*
@contexts/*     -> src/contexts/*
@assets/*       -> src/assets/*
@tests/*        -> src/tests/*
@pages/*        -> src/pages/*
@constants/*    -> src/constants/*
```

### Grid System
- Primary grid component: AG Grid Enterprise
- Standard column definitions in `columnDefs.tsx` files
- Bulk editing capabilities with drawer components
- Custom cell editors and renderers

### Theming
- Multi-tenant theming system in `src/components/shared/Theming/`
- Brand-specific themes (BP, DKB, Sunoco, etc.)
- Less-based styling with CSS variables
- Theme switching via localStorage

### Testing Setup
- Vitest for unit tests with jsdom environment
- Cypress for E2E testing
- Test setup in `vitest.setup.js`
- Mock configurations for external dependencies
- Jest compatibility with global jest object

### Build Configuration
- Vite configuration in `vite.config.js`
- TypeScript configuration in `tsconfig.json`
- Build outputs to `build/` directory
- Source maps disabled for production builds
- Build memory optimization with NODE_OPTIONS=--max_old_space_size=10240

### Environment Configuration
- Development server runs on port 3000 (configurable via VITE_PORT)
- Host mode enabled for network access
- Cypress E2E base URL: http://localhost:3000/

## Code Quality

### TypeScript
- Strict mode enabled with noImplicitAny disabled
- Path aliases configured
- Custom type definitions in `global.d.ts`

### ESLint Configuration
- Extends react-app configuration
- Import sorting with eslint-plugin-simple-import-sort
- Airbnb and Prettier configurations

## Important Dependencies

### Core Libraries
- `@gravitate-js/excalibrr` - Custom component library
- `ag-grid-enterprise` - Data grid component
- `@monaco-editor/react` - Code editor
- `@tanstack/react-query` - Server state management

### Development Tools
- `@vitejs/plugin-react` - Vite React support
- `vite-tsconfig-paths` - TypeScript path mapping
- `vite-plugin-svgr` - SVG component generation

## FE Folder Structure Guidelines

This section describes our **standard frontend feature folder structure** for React projects.

### 📂 Folder Layout (Visual)
```javascript
modules/
 └── 📂 {Category}/
     └── 📂 {FeatureName}/
         ├── 📂 api/
         │   ├── 📡 use{FeatureName}.ts          # 📡  API hooks
         │   └── 📝 types.schema.ts              # 📝  API types & schemas
         ├── 📂 components/
         │   ├── 📂 ComponentA/
         │   │   └── 🧩 ComponentA.tsx           # 🧩  Example component in its own folder
         │   ├── 🧩 ComponentB.tsx               # 🧩  Example component as a single file
         │   └── 📂 Grid/
         │       ├── 🛠 ActionButtons.tsx        # 🛠  Grid control bar actions
         │       ├── 📋 Columns/
         │       │   └── columnDefs.tsx          # 📋  Column definitions
         │       ├── ⚡ GridEvents.ts             # ⚡  Grid event handlers
         │       └── 📊 {FeatureName}Grid.tsx    # 📊  Grid rendering logic
         ├── 🎨 styles.css                       # 🎨  Styles for the feature
         ├── 🏠 {FeatureName}Page.tsx            # 🏠  Main feature component
         └── 📂 utils/
             ├── 📜 Constants.ts                 # 📜  Constants & Config
             └── 🛠 Utils.ts                     # 🛠  Utility functions
```

### Guiding Principles
- Keep **API** (data) peeled away from **UI** (components).
- Favor **small, composable** pieces with clear names.
- Co‑locate everything inside the feature folder.

### Directory Descriptions

#### modules/
**Description:** Monorepo root bucket for all app modules.
**How to use:** Each product area becomes a **Category** folder under `modules/`.

#### {Category}/
**Description:** Logical area (e.g., `Contracts`, `Market`, `Billing`).
**How to use:** Group related **features** here. Keep category spelling consistent across the app.

#### {FeatureName}/
**Description:** Self-contained feature boundary (UI + data + helpers).
**How to use:** One feature per folder. Keep everything feature-scoped here.

#### api/
**Description:** Data layer for the feature. Hooks and types only—no UI.
**How to use:** Keep API concerns isolated. No DOM or component imports.

##### use{FeatureName}.ts
**Description:** React hook(s) for fetching/mutating this feature's data.
**How to use:**
- Name hooks `useThing`, `useThingList`, `useCreateThing`, etc.
- Prefer React Query (or your fetch library) patterns.
- Co-locate query keys; return typed data + status.

```javascript
// Example
import { useQuery, useMutation } from "@tanstack/react-query";
import type { Thing } from "./types.schema";

export function useThings() {
  return useQuery({ queryKey: ["things"], queryFn: fetchThings });
}

export function useCreateThing() {
  return useMutation({ mutationFn: createThing });
}
```

##### types.schema.ts
**Description:** Types for requests/responses, schemas, enums.
**How to use:** Export types used in `use{FeatureName}.ts` and components.

```javascript
// Example
export type Thing = { id: string; name: string; active: boolean };
export type CreateThingInput = Pick<Thing, "name" | "active">;
```

#### components/
**Description:** Feature-only UI components.
**How to use:** Keep presentational + small state. No cross-feature imports.

##### ComponentA/ (folder)
**Description:** A component that needs its own folder (extra files/tests/styles).
**How to use:** Use when the component has subparts or grows complex.

##### ComponentA.tsx
**Description:** The component implementation.
**How to use:** Export default; keep props typed.

```javascript
// Example
type Props = { title: string };
export default function ComponentA({ title }: Props) {
  return <div>{title}</div>;
}
```