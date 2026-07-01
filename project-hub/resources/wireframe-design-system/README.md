# Gravitate Wireframe Design System

A comprehensive, pure HTML/CSS design system for creating consistent, interactive low-fidelity wireframes for Gravitate applications.

## Purpose

This design system enables rapid creation of wireframes that:
- Communicate layout, hierarchy, and interaction patterns
- Maintain visual consistency across multiple projects
- Are interactive (real buttons, form inputs, states) without JavaScript dependencies
- Map cleanly to Gravitate's production Excalibrr design system

## Quick Start

1. **Include the CSS** in your HTML file:
```html
<link rel="stylesheet" href="wireframe.css">
```

2. **Use the component classes** to build your wireframe:
```html
<div class="wf-page">
  <header class="wf-page-header">
    <h1 class="wf-text wf-text-h1">Page Title</h1>
    <button class="wf-button wf-button-primary">Action</button>
  </header>
  <main class="wf-page-content">
    <div class="wf-card">
      <div class="wf-card-body">
        Your content here
      </div>
    </div>
  </main>
</div>
```

3. **Browse component examples** in `components/[category]/[Component].html`

4. **Use full-page patterns** from `patterns/` as starting templates

## File Structure

```
WireframeDesignSystem/
├── wireframe.css              # Main CSS (imports all)
├── README.md                  # This file
│
├── tokens/                    # Design tokens
│   ├── colors.css            # Color palette
│   ├── typography.css        # Font scales
│   ├── spacing.css           # Spacing scale
│   ├── borders.css           # Borders & radius
│   ├── utilities.css         # Utility classes
│   └── index.css             # Base styles
│
├── components/                # Component library
│   ├── layout/               # Row, Column, Container, Page
│   ├── typography/           # Text, Label
│   ├── controls/             # Button, Input, Select, etc.
│   ├── data-display/         # DataGrid, Card, Badge, etc.
│   ├── navigation/           # Tabs, Breadcrumb, Sidebar, etc.
│   ├── feedback/             # Modal, Toast, Alert, etc.
│   ├── status/               # Progress, Loader, Skeleton
│   └── specialized/          # ActionBar, FilterBar, etc.
│
├── patterns/                  # Full-page templates
│   ├── DashboardLayout.html
│   ├── MasterDetailLayout.html
│   ├── FormWizard.html
│   ├── SettingsPage.html
│   ├── DataTablePage.html
│   └── ComparisonMatrix.html
│
└── docs/                      # Documentation
    ├── index.html            # Documentation homepage
    ├── getting-started.md    # Quick start guide
    ├── component-guide.md    # Component reference
    ├── token-reference.md    # Design tokens
    ├── pattern-guide.md      # Layout patterns
    └── migration-guide.md    # Wireframe to production
```

## Component Categories

### Layout
Basic structural components for page composition.
- **Row** (`.wf-row`) - Horizontal flex container
- **Column** (`.wf-column`) - Vertical flex container
- **Container** (`.wf-container`) - Content wrapper
- **Page** (`.wf-page`) - Full page layout

### Typography
Text styling components.
- **Text** (`.wf-text`) - Universal text element
- **Label** (`.wf-label-group`) - Key-value pairs

### Controls
Interactive form elements.
- **Button** (`.wf-button`) - Actions
- **Input** (`.wf-input`) - Text input
- **Select** (`.wf-select`) - Dropdowns
- **Checkbox** (`.wf-checkbox`) - Multiple selection
- **Radio** (`.wf-radio`) - Single selection
- **Toggle** (`.wf-toggle`) - On/off switch

### Data Display
Components for showing data.
- **DataGrid** (`.wf-datagrid`) - Tables
- **Card** (`.wf-card`) - Content containers
- **MetricCard** (`.wf-metric-card`) - Dashboard metrics
- **Badge** (`.wf-badge`) - Status indicators
- **Avatar** (`.wf-avatar`) - User images

### Navigation
Components for moving between views.
- **Tabs** (`.wf-tabs`) - Tab navigation
- **Breadcrumb** (`.wf-breadcrumb`) - Path display
- **Sidebar** (`.wf-sidebar`) - App navigation
- **Menu** (`.wf-menu`) - Dropdowns
- **Stepper** (`.wf-stepper`) - Multi-step progress

### Feedback
Components for user communication.
- **Modal** (`.wf-modal`) - Centered dialogs
- **Drawer** (`.wf-drawer`) - Side panels
- **Toast** (`.wf-toast`) - Notifications
- **Alert** (`.wf-alert`) - Inline messages
- **Tooltip** (`.wf-tooltip`) - Hover hints

### Status
Components showing state.
- **Progress** (`.wf-progress`) - Progress bars
- **Loader** (`.wf-loader`) - Loading spinners
- **Skeleton** (`.wf-skeleton`) - Loading placeholders
- **EmptyState** (`.wf-empty-state`) - No data

### Specialized
Complex composite patterns.
- **ActionBar** (`.wf-action-bar`) - Grid toolbars
- **FilterBar** (`.wf-filter-bar`) - Filter controls
- **DetailPanel** (`.wf-detail-panel`) - Side details
- **FormSection** (`.wf-form-section`) - Form groups
- **WizardFooter** (`.wf-wizard-footer`) - Step navigation

## Design Tokens

### Colors
```css
/* Primary */
--wf-color-primary: #2563eb;

/* Status */
--wf-color-success: #22c55e;
--wf-color-warning: #f59e0b;
--wf-color-error: #ef4444;

/* Neutral Scale */
--wf-gray-900: #111827;  /* Text */
--wf-gray-500: #6b7280;  /* Secondary */
--wf-gray-300: #d1d5db;  /* Borders */
--wf-gray-100: #f3f4f6;  /* Backgrounds */
```

### Spacing
Based on 8px grid:
- `--wf-space-1`: 4px
- `--wf-space-2`: 8px
- `--wf-space-4`: 16px
- `--wf-space-6`: 24px
- `--wf-space-8`: 32px

### Typography
- **h1**: 24px, semibold
- **h2**: 18px, semibold
- **body**: 14px, normal
- **label**: 12px, medium, uppercase
- **helper**: 12px, normal

## Migration to Production

This wireframe system maps to Gravitate's Excalibrr production components:

| Wireframe | Production |
|-----------|------------|
| `.wf-row` | `<Horizontal>` |
| `.wf-column` | `<Vertical>` |
| `.wf-text` | `<Texto>` |
| `.wf-button` | `<GraviButton>` |
| `.wf-datagrid` | `<GraviGrid>` |
| `.wf-modal` | `<Modal>` |

See `docs/migration-guide.md` for detailed mapping.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

Internal use only - Gravitate Energy

---

Created January 2026 for the Gravitate Design System initiative.
