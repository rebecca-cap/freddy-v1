# Getting Started with Gravitate Wireframe Design System

## Introduction

The Gravitate Wireframe Design System is a comprehensive CSS framework designed specifically for creating low-fidelity, interactive wireframe prototypes. It provides a complete set of components, design tokens, and utilities that enable rapid prototyping while maintaining visual consistency.

## Purpose and Philosophy

### Why Wireframes?

Wireframes serve as the blueprint for user interfaces, focusing on:

- **Structure over aesthetics** - Prioritize layout and information hierarchy
- **Rapid iteration** - Quick changes without design overhead
- **Clear communication** - Stakeholders understand this is a prototype, not final design
- **Functional validation** - Test interactions before investing in visual design

### Design Principles

1. **Low-fidelity by design** - Grayscale palette with minimal visual decoration keeps focus on functionality
2. **Consistent spacing** - 8px base unit system ensures harmonious layouts
3. **Clear hierarchy** - Typography scale creates visual structure
4. **Accessibility first** - WCAG-compliant contrast ratios and focus states
5. **Production-ready patterns** - Components mirror production equivalents for smooth transition

## File Structure

```
WireframeDesignSystem/
├── tokens/
│   ├── index.css          # Main entry point (imports all tokens)
│   ├── colors.css         # Color palette and semantic colors
│   ├── typography.css     # Font families, sizes, weights
│   ├── spacing.css        # Spacing scale and component spacing
│   ├── borders.css        # Border radius, widths, elevation
│   └── utilities.css      # Utility classes for layout
│
├── components/
│   ├── layout/
│   │   └── layout.css     # Row, Column, Container, Page, Card
│   ├── typography/
│   │   └── typography.css # Text variants, labels, headings
│   ├── controls/
│   │   └── controls.css   # Button, Input, Select, Checkbox, Radio, Toggle
│   ├── data-display/
│   │   └── data-display.css # DataGrid, Card, MetricCard, Badge, Avatar
│   ├── navigation/
│   │   └── navigation.css # Tabs, Breadcrumb, Sidebar, Menu, Stepper
│   ├── feedback/
│   │   └── feedback.css   # Modal, Drawer, Toast, Alert, Tooltip
│   └── status/
│       └── status.css     # Progress, Loader, Skeleton, EmptyState
│
└── docs/
    ├── getting-started.md  # This file
    ├── component-guide.md  # Complete component reference
    ├── token-reference.md  # Design token documentation
    ├── pattern-guide.md    # Layout patterns and templates
    └── migration-guide.md  # Wireframe to production guide
```

## How to Include CSS Files

### Option 1: Include All Tokens + Specific Components

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My Wireframe</title>

  <!-- Core tokens (required) -->
  <link rel="stylesheet" href="tokens/index.css">

  <!-- Components (include what you need) -->
  <link rel="stylesheet" href="components/layout/layout.css">
  <link rel="stylesheet" href="components/controls/controls.css">
  <link rel="stylesheet" href="components/data-display/data-display.css">
</head>
<body>
  <!-- Your wireframe content -->
</body>
</html>
```

### Option 2: Individual Token Files

If you only need specific tokens:

```html
<link rel="stylesheet" href="tokens/colors.css">
<link rel="stylesheet" href="tokens/typography.css">
<link rel="stylesheet" href="tokens/spacing.css">
```

## Basic HTML Template

Use this template as a starting point for new wireframes:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Wireframe - [Page Name]</title>

  <!-- Gravitate Wireframe Design System -->
  <link rel="stylesheet" href="tokens/index.css">
  <link rel="stylesheet" href="components/layout/layout.css">
  <link rel="stylesheet" href="components/typography/typography.css">
  <link rel="stylesheet" href="components/controls/controls.css">
  <link rel="stylesheet" href="components/data-display/data-display.css">
  <link rel="stylesheet" href="components/navigation/navigation.css">
  <link rel="stylesheet" href="components/feedback/feedback.css">
  <link rel="stylesheet" href="components/status/status.css">
</head>
<body>
  <!-- Page wrapper -->
  <div class="wf-page wf-page-with-sidebar">

    <!-- Sidebar -->
    <aside class="wf-sidebar">
      <div class="wf-sidebar-header">
        <span class="wf-sidebar-logo">App Name</span>
      </div>
      <nav class="wf-sidebar-nav">
        <a href="#" class="wf-sidebar-item wf-sidebar-item-active">
          <span class="wf-sidebar-icon">H</span>
          <span class="wf-sidebar-label">Dashboard</span>
        </a>
        <a href="#" class="wf-sidebar-item">
          <span class="wf-sidebar-icon">U</span>
          <span class="wf-sidebar-label">Users</span>
        </a>
        <a href="#" class="wf-sidebar-item">
          <span class="wf-sidebar-icon">S</span>
          <span class="wf-sidebar-label">Settings</span>
        </a>
      </nav>
    </aside>

    <!-- Main content -->
    <main class="wf-main">
      <!-- Page header -->
      <header class="wf-page-header">
        <div class="wf-page-title">
          <h1 class="wf-text-h1">Page Title</h1>
          <p class="wf-text-helper">Page description or subtitle</p>
        </div>
        <div class="wf-page-actions">
          <button class="wf-button wf-button-secondary">Cancel</button>
          <button class="wf-button wf-button-primary">Save</button>
        </div>
      </header>

      <!-- Page content -->
      <div class="wf-page-content">
        <div class="wf-card">
          <div class="wf-card-header">
            <h2 class="wf-card-title">Card Title</h2>
          </div>
          <div class="wf-card-body">
            <p class="wf-text-body">Your content goes here.</p>
          </div>
        </div>
      </div>
    </main>
  </div>
</body>
</html>
```

## Quick Reference

### Common Layout Classes

| Class | Purpose |
|-------|---------|
| `.wf-page` | Full page wrapper |
| `.wf-sidebar` | Navigation sidebar |
| `.wf-main` | Main content area |
| `.wf-row` | Horizontal flex container |
| `.wf-column` | Vertical flex container |
| `.wf-card` | Elevated content container |

### Common Spacing Classes

| Class | Value |
|-------|-------|
| `.wf-p-4` | 16px padding all sides |
| `.wf-gap-4` | 16px gap between children |
| `.wf-m-4` | 16px margin all sides |
| `.wf-px-4` | 16px horizontal padding |
| `.wf-py-4` | 16px vertical padding |

### Common Typography Classes

| Class | Purpose |
|-------|---------|
| `.wf-text-h1` | Page title (24px) |
| `.wf-text-h2` | Section header (18px) |
| `.wf-text-body` | Body text (14px) |
| `.wf-text-helper` | Helper/muted text (12px) |
| `.wf-text-label` | Form labels (12px, uppercase) |

## Next Steps

- **[Component Guide](./component-guide.md)** - Complete reference for all components
- **[Token Reference](./token-reference.md)** - CSS custom properties documentation
- **[Pattern Guide](./pattern-guide.md)** - Common layout patterns and templates
- **[Migration Guide](./migration-guide.md)** - Converting wireframes to production
