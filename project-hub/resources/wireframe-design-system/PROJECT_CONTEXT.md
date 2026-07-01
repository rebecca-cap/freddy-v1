# WireframeDesignSystem - Project Context
*Last Updated: 2026-01-27*

---

## Quick Orientation for Claude

> **First read:** `CLAUDE.md` (working agreement) → `DESIGN.md` (the *why* layer — product context, principles, decision trees, anti-patterns) → then this file. Do not pull component markup or write class names before reading those two.

This is a **comprehensive wireframe design system** for creating consistent, interactive low-fidelity prototypes for Gravitate applications. The system provides pure HTML/CSS components that can be used without JavaScript dependencies while maintaining interactive states through CSS.

**Key Features:**
- 60+ component variations across 8 categories
- 6 full-page pattern templates
- Complete documentation with guides and references
- Design tokens for colors, typography, spacing, borders
- Maps to Gravitate's Excalibrr production system

---

## Project Summary

**Project Name:** WireframeDesignSystem
**Owner:** Frank Overland
**Purpose:** Enable rapid, consistent creation of low-fidelity wireframes for Gravitate applications
**Status:** ✅ **COMPLETE** (v1.0.0)

---

## Current Status

### ✅ Completed

**Phase 1: Research & Audit**
- Audited Excalibrr MCP Server design system
- Analyzed Gravitate frontend application patterns
- Researched Monday Vibe design system for inspiration

**Phase 2: Architecture Definition**
- Defined design system principles
- Created token system (colors, typography, spacing, borders)
- Organized component architecture by category
- Documented pattern library requirements

**Phase 3: Component Library**
- Created 7 component categories:
  - Layout (Row, Column, Container, Page)
  - Typography (Text, Label)
  - Controls (Button, Input, Select, Checkbox, Radio, Toggle)
  - Data Display (DataGrid, Card, MetricCard, Badge, Avatar)
  - Navigation (Tabs, Breadcrumb, Sidebar, Menu, Stepper)
  - Feedback (Modal, Drawer, Toast, Alert, Tooltip)
  - Status (Progress, Loader, Skeleton, EmptyState)
  - Specialized (ActionBar, FilterBar, DetailPanel, FormSection, WizardFooter)

**Phase 4: Patterns & Examples**
- Created 6 full-page pattern templates:
  - DashboardLayout
  - MasterDetailLayout
  - FormWizard
  - SettingsPage
  - DataTablePage
  - ComparisonMatrix

**Phase 5: Documentation**
- Getting Started guide
- Component Guide (comprehensive reference)
- Token Reference (design tokens)
- Pattern Guide (layout patterns)
- Migration Guide (wireframe to production)
- Documentation Homepage (interactive)

---

## File Structure

```
WireframeDesignSystem/
├── wireframe.css              # Main CSS entry point
├── README.md                  # Project overview
├── PROJECT_CONTEXT.md         # This file
│
├── tokens/                    # Design tokens (6 files)
│   ├── colors.css
│   ├── typography.css
│   ├── spacing.css
│   ├── borders.css
│   ├── utilities.css
│   └── index.css
│
├── components/                # Component library (45+ files)
│   ├── layout/               # 7 files
│   ├── typography/           # 3 files
│   ├── controls/             # 7 files
│   ├── data-display/         # 6 files
│   ├── navigation/           # 6 files
│   ├── feedback/             # 6 files
│   ├── status/               # 5 files
│   └── specialized/          # 6 files
│
├── patterns/                  # Full-page templates (6 files)
│   ├── DashboardLayout.html
│   ├── MasterDetailLayout.html
│   ├── FormWizard.html
│   ├── SettingsPage.html
│   ├── DataTablePage.html
│   └── ComparisonMatrix.html
│
└── docs/                      # Documentation (6 files)
    ├── index.html
    ├── getting-started.md
    ├── component-guide.md
    ├── token-reference.md
    ├── pattern-guide.md
    └── migration-guide.md
```

---

## Key Decisions Made

| Decision | Rationale | Date |
|----------|-----------|------|
| Pure HTML/CSS (no React) | Enables use in any environment; no build step required | 2026-01-27 |
| `wf-` class prefix | Distinguishes wireframe classes from production (`gv-`) | 2026-01-27 |
| 8px spacing grid | Aligns with Monday Vibe and modern design systems | 2026-01-27 |
| Semantic color tokens | Focus on meaning (success, error) not aesthetics | 2026-01-27 |
| CSS imports structure | Single `wireframe.css` entry point with modular imports | 2026-01-27 |
| Component HTML examples | Each component has standalone preview file | 2026-01-27 |

---

## Usage Guide

### Quick Start
```html
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="wireframe.css">
</head>
<body>
  <div class="wf-page">
    <header class="wf-page-header">
      <h1 class="wf-text wf-text-h1">My Wireframe</h1>
    </header>
    <main class="wf-page-content">
      <!-- Your wireframe content -->
    </main>
  </div>
</body>
</html>
```

### Using Components
Browse `components/[category]/[Component].html` files for examples of each component with all variants and states.

### Using Patterns
Copy from `patterns/[PatternName].html` as starting templates for full pages.

### Documentation
Open `docs/index.html` for the full documentation site.

---

## Mapping to Production

This wireframe system is designed to map cleanly to Gravitate's Excalibrr production system:

| Wireframe Class | Excalibrr Component |
|-----------------|---------------------|
| `.wf-row` | `<Horizontal>` |
| `.wf-column` | `<Vertical>` |
| `.wf-text` | `<Texto>` |
| `.wf-button` | `<GraviButton>` |
| `.wf-datagrid` | `<GraviGrid>` |
| `.wf-modal` | `<Modal>` |
| `.wf-tabs` | `<Tabs>` |

See `docs/migration-guide.md` for complete mapping and transition guidance.

---

## Changelog

| Date | Update | Source |
|------|--------|--------|
| 2026-01-23 | Project initialized | Setup |
| 2026-01-27 | Complete design system delivered | Claude Orchestration |

---

## Session Log

### Session 1 (2026-01-23)
- Project directory initialized
- Context structure created

### Session 2 (2026-01-27)
**Completed:**
- Full design system audit (Excalibrr, Gravitate, Monday Vibe)
- Architecture definition and planning
- Complete component library (60+ variations)
- 6 full-page pattern templates
- Comprehensive documentation
- Main CSS entry point and README

**Key Deliverables:**
- `wireframe.css` - Main entry point
- `README.md` - Project documentation
- Component library with HTML previews
- Pattern templates for common layouts
- Documentation site with guides

---

*This document provides context for any future Claude sessions working on this project.*
