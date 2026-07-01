# Component Guide

Complete reference for all Gravitate Wireframe Design System components.

---

## Table of Contents

1. [Layout Components](#layout-components)
   - [Row](#row)
   - [Column](#column)
   - [Container](#container)
   - [Page](#page)
   - [Card](#card)
   - [Section](#section)
   - [Divider](#divider)
2. [Typography](#typography)
   - [Headings](#headings)
   - [Body Text](#body-text)
   - [Labels](#labels)
   - [Text Modifiers](#text-modifiers)
3. [Controls](#controls)
   - [Button](#button)
   - [Input](#input)
   - [Select](#select)
   - [Checkbox](#checkbox)
   - [Radio](#radio)
   - [Toggle](#toggle)
   - [Field Wrapper](#field-wrapper)
4. [Data Display](#data-display)
   - [DataGrid](#datagrid)
   - [Card (Data)](#card-data)
   - [MetricCard](#metriccard)
   - [Badge](#badge)
   - [Avatar](#avatar)
   - [List](#list)
5. [Navigation](#navigation)
   - [Tabs](#tabs)
   - [Breadcrumb](#breadcrumb)
   - [Sidebar](#sidebar)
   - [Menu](#menu)
   - [Stepper](#stepper)
   - [Pagination](#pagination)
   - [Navbar](#navbar)
6. [Feedback](#feedback)
   - [Modal](#modal)
   - [Drawer](#drawer)
   - [Toast](#toast)
   - [Alert](#alert)
   - [Tooltip](#tooltip)
7. [Status](#status)
   - [Progress](#progress)
   - [Loader](#loader)
   - [Skeleton](#skeleton)
   - [EmptyState](#emptystate)

---

## Layout Components

### Row

Horizontal flex container for arranging items in a row.

**CSS Classes:**

- `.wf-row` - Base horizontal flex container

**Modifiers:**

- `.wf-align-start` - Align items to start
- `.wf-align-center` - Align items to center
- `.wf-align-end` - Align items to end
- `.wf-align-stretch` - Stretch items to fill
- `.wf-align-baseline` - Align items to baseline
- `.wf-wrap` - Allow wrapping
- `.wf-nowrap` - Prevent wrapping

**Usage:**

```html
<div class="wf-row wf-gap-4 wf-align-center">
  <div>Item 1</div>
```
  <div>Item 2</div>
  <div>Item 3</div>
</div>
```

---

### Column

Vertical flex container for stacking items.

**CSS Classes:**
- `.wf-column` - Base vertical flex container

**Modifiers:**
- `.wf-align-start` - Align items to start
- `.wf-align-center` - Align items to center
- `.wf-align-end` - Align items to end
- `.wf-align-stretch` - Stretch items to fill

**Usage:**
```html
<div class="wf-column wf-gap-4">
  <div>Row 1</div>
  <div>Row 2</div>
  <div>Row 3</div>
</div>
```

---

### Container

Content container with max-width and padding.

**CSS Classes:**
- `.wf-container` - Base container

**Size Variants:**
- `.wf-container-sm` - Max-width 640px
- `.wf-container-md` - Max-width 768px
- `.wf-container-lg` - Max-width 1024px
- `.wf-container-xl` - Max-width 1280px
- `.wf-container-2xl` - Max-width 1536px
- `.wf-container-full` - Full width

**Padding Variants:**
- `.wf-container-tight` - 8px horizontal padding
- `.wf-container-relaxed` - 24px horizontal padding
- `.wf-container-spacious` - 32px horizontal padding

**Usage:**
```html
<div class="wf-container wf-container-lg">
  <p>Centered content with max-width</p>
</div>
```

---

### Page

Full page layout structure with header, content, and optional sidebar.

**CSS Classes:**
- `.wf-page` - Base page container (full viewport height)
- `.wf-page-with-sidebar` - Page with sidebar layout

**Sub-components:**
- `.wf-page-header` - Page header with title and actions
- `.wf-page-title` - Title container
- `.wf-page-actions` - Actions container
- `.wf-page-content` - Main content area

**Content Padding Variants:**
- `.wf-page-content-tight` - 16px padding
- `.wf-page-content-spacious` - 32px padding
- `.wf-page-content-none` - No padding

**Usage:**
```html
<div class="wf-page wf-page-with-sidebar">
  <aside class="wf-sidebar">
    <!-- Sidebar content -->
  </aside>
  <main class="wf-main">
    <header class="wf-page-header">
      <div class="wf-page-title">
        <h1 class="wf-text-h1">Page Title</h1>
      </div>
      <div class="wf-page-actions">
        <button class="wf-button wf-button-primary">Action</button>
      </div>
    </header>
    <div class="wf-page-content">
      <!-- Page content -->
    </div>
  </main>
</div>
```

---

### Card

Elevated container for grouped content.

**CSS Classes:**
- `.wf-card` - Base card container

**Sub-components:**
- `.wf-card-header` - Card header with title
- `.wf-card-title` - Card title
- `.wf-card-subtitle` - Card subtitle
- `.wf-card-body` - Card content area
- `.wf-card-footer` - Card footer with actions

**Variants:**
- `.wf-card-elevated` - Shadow elevation
- `.wf-card-clickable` - Hover effect for clickable cards
- `.wf-card-selected` - Selected state
- `.wf-card-flat` - No border or shadow
- `.wf-card-compact` - Reduced padding

**Usage:**
```html
<div class="wf-card">
  <div class="wf-card-header">
    <h3 class="wf-card-title">Card Title</h3>
  </div>
  <div class="wf-card-body">
    <p>Card content goes here.</p>
  </div>
  <div class="wf-card-footer">
    <button class="wf-button wf-button-secondary">Cancel</button>
    <button class="wf-button wf-button-primary">Save</button>
  </div>
</div>
```

---

### Section

Content section with optional header.

**CSS Classes:**
- `.wf-section` - Section container
- `.wf-section-header` - Section header row
- `.wf-section-title` - Section title
- `.wf-section-content` - Section content

**Usage:**
```html
<section class="wf-section">
  <div class="wf-section-header">
    <h2 class="wf-section-title">Section Title</h2>
    <button class="wf-button wf-button-secondary">Action</button>
  </div>
  <div class="wf-section-content">
    <!-- Section content -->
  </div>
</section>
```

---

### Divider

Horizontal or vertical separator.

**CSS Classes:**
- `.wf-divider` - Horizontal divider
- `.wf-divider-vertical` - Vertical divider

**Usage:**
```html
<!-- Horizontal divider -->
<hr class="wf-divider">

<!-- Vertical divider in a row -->
<div class="wf-row wf-align-stretch">
  <div>Left content</div>
  <div class="wf-divider-vertical"></div>
  <div>Right content</div>
</div>
```

---

## Typography

### Headings

**CSS Classes:**
- `.wf-text-h1` - Page title (24px, bold)
- `.wf-text-h2` - Section header (18px, semibold)
- `.wf-text-h3` - Subsection (16px, semibold)
- `.wf-text-h4` - Card titles (14px, semibold)

**Usage:**
```html
<h1 class="wf-text-h1">Page Title</h1>
<h2 class="wf-text-h2">Section Header</h2>
<h3 class="wf-text-h3">Subsection</h3>
<h4 class="wf-text-h4">Card Title</h4>
```

---

### Body Text

**CSS Classes:**
- `.wf-text-body` - Default body text (14px)
- `.wf-text-helper` - Helper/description text (12px, muted)
- `.wf-text-caption` - Small annotations (11px, muted)

**Usage:**
```html
<p class="wf-text-body">Main paragraph text.</p>
<p class="wf-text-helper">Helper text or description.</p>
<span class="wf-text-caption">Timestamp or annotation</span>
```

---

### Labels

**CSS Classes:**
- `.wf-text-label` - Form labels (12px, uppercase, medium weight)

**Usage:**
```html
<label class="wf-text-label">Field Label</label>
```

---

### Text Modifiers

**Weight Modifiers:**
- `.wf-text-normal` - 400 weight
- `.wf-text-medium` - 500 weight
- `.wf-text-semibold` - 600 weight
- `.wf-text-bold` - 700 weight

**Color Modifiers:**
- `.wf-text-primary` - Primary dark text
- `.wf-text-secondary` - Muted gray text
- `.wf-text-success` - Green success text
- `.wf-text-warning` - Orange warning text
- `.wf-text-error` - Red error text
- `.wf-text-link` - Blue link text
- `.wf-text-inverse` - White text (for dark backgrounds)
- `.wf-text-disabled` - Disabled gray text

**Alignment:**
- `.wf-text-left` - Left align
- `.wf-text-center` - Center align
- `.wf-text-right` - Right align

**Transform:**
- `.wf-text-uppercase` - Uppercase with letter spacing
- `.wf-text-capitalize` - Capitalize each word
- `.wf-text-truncate` - Truncate with ellipsis

**Usage:**
```html
<span class="wf-text-body wf-text-semibold wf-text-success">Success!</span>
<p class="wf-text-body wf-text-truncate">Long text that gets truncated...</p>
```

---

## Controls

### Button

Interactive button component.

**CSS Classes:**
- `.wf-button` - Base button styles

**Variants:**
- `.wf-button-primary` - Primary action (blue)
- `.wf-button-secondary` - Secondary action (gray border)
- `.wf-button-success` - Success action (green)
- `.wf-button-danger` - Destructive action (red)
- `.wf-button-ghost` - Ghost/transparent button

**Sizes:**
- `.wf-button-sm` - Small button
- `.wf-button-lg` - Large button

**States:**
- `.wf-button-loading` - Loading spinner state
- `disabled` attribute - Disabled state

**Usage:**
```html
<button class="wf-button wf-button-primary">Primary</button>
<button class="wf-button wf-button-secondary">Secondary</button>
<button class="wf-button wf-button-danger">Delete</button>
<button class="wf-button wf-button-ghost">Cancel</button>
<button class="wf-button wf-button-primary wf-button-sm">Small</button>
<button class="wf-button wf-button-primary wf-button-loading">Loading</button>
<button class="wf-button wf-button-primary" disabled>Disabled</button>
```

---

### Input

Text input field.

**CSS Classes:**
- `.wf-input` - Base input styles

**States:**
- `:hover` - Darker border on hover
- `:focus` - Blue border with focus ring
- `:disabled` - Gray background, not allowed cursor

**Usage:**
```html
<input type="text" class="wf-input" placeholder="Enter text...">
<input type="email" class="wf-input" placeholder="Email address">
<input type="text" class="wf-input" disabled placeholder="Disabled">
```

---

### Select

Dropdown select field.

**CSS Classes:**
- `.wf-select` - Base select styles

**Usage:**
```html
<select class="wf-select">
  <option value="">Select an option</option>
  <option value="1">Option 1</option>
  <option value="2">Option 2</option>
  <option value="3">Option 3</option>
</select>
```

---

### Checkbox

Checkbox input with custom styling.

**CSS Classes:**
- `.wf-checkbox` - Checkbox wrapper (label element)
- `.wf-checkbox-input` - Hidden native input
- `.wf-checkbox-box` - Visual checkbox
- `.wf-checkbox-label` - Label text
- `.wf-checkbox-group` - Group of checkboxes

**Usage:**
```html
<label class="wf-checkbox">
  <input type="checkbox" class="wf-checkbox-input">
  <span class="wf-checkbox-box"></span>
  <span class="wf-checkbox-label">Accept terms</span>
</label>

<!-- Checkbox group -->
<div class="wf-checkbox-group">
  <label class="wf-checkbox">
    <input type="checkbox" class="wf-checkbox-input" checked>
    <span class="wf-checkbox-box"></span>
    <span class="wf-checkbox-label">Option A</span>
  </label>
  <label class="wf-checkbox">
    <input type="checkbox" class="wf-checkbox-input">
    <span class="wf-checkbox-box"></span>
    <span class="wf-checkbox-label">Option B</span>
  </label>
</div>
```

---

### Radio

Radio button input with custom styling.

**CSS Classes:**
- `.wf-radio` - Radio wrapper (label element)
- `.wf-radio-input` - Hidden native input
- `.wf-radio-circle` - Visual radio circle
- `.wf-radio-label` - Label text
- `.wf-radio-group` - Group of radios

**Usage:**
```html
<div class="wf-radio-group">
  <label class="wf-radio">
    <input type="radio" name="choice" class="wf-radio-input" checked>
    <span class="wf-radio-circle"></span>
    <span class="wf-radio-label">Option A</span>
  </label>
  <label class="wf-radio">
    <input type="radio" name="choice" class="wf-radio-input">
    <span class="wf-radio-circle"></span>
    <span class="wf-radio-label">Option B</span>
  </label>
</div>
```

---

### Toggle

Toggle switch for boolean values.

**CSS Classes:**
- `.wf-toggle` - Toggle wrapper (label element)
- `.wf-toggle-input` - Hidden native checkbox
- `.wf-toggle-track` - Toggle track background
- `.wf-toggle-label` - Label text

**Usage:**
```html
<label class="wf-toggle">
  <input type="checkbox" class="wf-toggle-input" checked>
  <span class="wf-toggle-track"></span>
  <span class="wf-toggle-label">Enable notifications</span>
</label>
```

---

### Field Wrapper

Wrapper for form fields with label, input, and helper text.

**CSS Classes:**
- `.wf-field` - Field wrapper
- `.wf-field-label` - Field label
- `.wf-field-helper` - Helper text
- `.wf-field-error-message` - Error message
- `.wf-field-error` - Error state modifier
- `.wf-required` - Required indicator (*)

**Usage:**
```html
<div class="wf-field">
  <label class="wf-field-label">
    Email Address <span class="wf-required">*</span>
  </label>
  <input type="email" class="wf-input" placeholder="you@example.com">
  <span class="wf-field-helper">We'll never share your email.</span>
</div>

<!-- Error state -->
<div class="wf-field wf-field-error">
  <label class="wf-field-label">Username</label>
  <input type="text" class="wf-input" value="a">
  <span class="wf-field-error-message">Username must be at least 3 characters.</span>
</div>
```

---

## Data Display

### DataGrid

Table-like data display component.

**CSS Classes:**
- `.wf-datagrid` - Grid container
- `.wf-datagrid-header` - Header row
- `.wf-datagrid-body` - Body container
- `.wf-datagrid-row` - Data row
- `.wf-datagrid-cell` - Cell

**Cell Variants:**
- `.wf-datagrid-cell-checkbox` - Checkbox cell
- `.wf-datagrid-cell-number` - Right-aligned numeric
- `.wf-datagrid-cell-actions` - Actions cell
- `.wf-datagrid-cell-sortable` - Sortable header

**Row States:**
- `.wf-datagrid-row-selected` - Selected row

**Grid Variants:**
- `.wf-datagrid-striped` - Alternating row colors
- `.wf-datagrid-compact` - Reduced padding
- `.wf-datagrid-borderless` - No outer border

**Pagination:**
- `.wf-datagrid-pagination` - Pagination container
- `.wf-datagrid-pagination-btn` - Page button
- `.wf-datagrid-pagination-btn-active` - Active page

**Usage:**
```html
<div class="wf-datagrid">
  <div class="wf-datagrid-header">
    <div class="wf-datagrid-cell wf-datagrid-cell-checkbox">
      <input type="checkbox">
    </div>
    <div class="wf-datagrid-cell wf-datagrid-cell-sortable">Name</div>
    <div class="wf-datagrid-cell">Email</div>
    <div class="wf-datagrid-cell wf-datagrid-cell-number">Amount</div>
  </div>
  <div class="wf-datagrid-body">
    <div class="wf-datagrid-row">
      <div class="wf-datagrid-cell wf-datagrid-cell-checkbox">
        <input type="checkbox">
      </div>
      <div class="wf-datagrid-cell">John Doe</div>
      <div class="wf-datagrid-cell">john@example.com</div>
      <div class="wf-datagrid-cell wf-datagrid-cell-number">$1,234</div>
    </div>
  </div>
  <div class="wf-datagrid-pagination">
    <span class="wf-datagrid-pagination-info">1-10 of 100</span>
    <div class="wf-datagrid-pagination-controls">
      <button class="wf-datagrid-pagination-btn">Prev</button>
      <button class="wf-datagrid-pagination-btn wf-datagrid-pagination-btn-active">1</button>
      <button class="wf-datagrid-pagination-btn">2</button>
      <button class="wf-datagrid-pagination-btn">Next</button>
    </div>
  </div>
</div>
```

---

### MetricCard

Display key metrics with trends.

**CSS Classes:**
- `.wf-metric-card` - Card container
- `.wf-metric-header` - Header with icon
- `.wf-metric-icon` - Icon container
- `.wf-metric-title` - Metric label
- `.wf-metric-value` - Large numeric value
- `.wf-metric-subtitle` - Subtitle/description
- `.wf-metric-trend` - Trend indicator

**Trend Variants:**
- `.wf-metric-trend-up` - Green positive
- `.wf-metric-trend-down` - Red negative
- `.wf-metric-trend-neutral` - Gray neutral

**Card Variants:**
- `.wf-metric-card-elevated` - Shadow elevation
- `.wf-metric-card-compact` - Reduced padding
- `.wf-metric-card-success` - Green left border
- `.wf-metric-card-warning` - Orange left border
- `.wf-metric-card-error` - Red left border
- `.wf-metric-card-primary` - Blue left border

**Usage:**
```html
<div class="wf-metric-card">
  <div class="wf-metric-header">
    <span class="wf-metric-icon">$</span>
    <span class="wf-metric-title">Total Revenue</span>
  </div>
  <div class="wf-metric-value">$48,352</div>
  <div class="wf-metric-subtitle">
    <span class="wf-metric-trend wf-metric-trend-up">+12.5%</span>
    vs last month
  </div>
</div>
```

---

### Badge

Small status indicators.

**CSS Classes:**
- `.wf-badge` - Base badge

**Color Variants:**
- `.wf-badge-primary` - Blue
- `.wf-badge-success` - Green
- `.wf-badge-warning` - Yellow/Orange
- `.wf-badge-error` - Red

**Size Variants:**
- `.wf-badge-sm` - Small badge
- `.wf-badge-lg` - Large badge

**Dot Badge:**
- `.wf-badge-dot` - Simple colored dot
- `.wf-badge-dot-success` - Green dot
- `.wf-badge-dot-warning` - Orange dot
- `.wf-badge-dot-error` - Red dot
- `.wf-badge-dot-primary` - Blue dot

**Usage:**
```html
<span class="wf-badge">Default</span>
<span class="wf-badge wf-badge-success">Active</span>
<span class="wf-badge wf-badge-warning">Pending</span>
<span class="wf-badge wf-badge-error">Error</span>

<!-- Dot badges -->
<span class="wf-badge-dot wf-badge-dot-success"></span>
```

---

### Avatar

User avatar with image or initials.

**CSS Classes:**
- `.wf-avatar` - Base avatar
- `.wf-avatar-initials` - Initials text
- `.wf-avatar-image` - Avatar image

**Size Variants:**
- `.wf-avatar-sm` - 32px
- Default - 40px
- `.wf-avatar-lg` - 56px
- `.wf-avatar-xl` - 80px

**Status Indicator:**
- `.wf-avatar-wrapper` - Wrapper for status
- `.wf-avatar-status` - Status dot
- `.wf-avatar-status-online` - Green online
- `.wf-avatar-status-offline` - Gray offline
- `.wf-avatar-status-busy` - Red busy
- `.wf-avatar-status-away` - Orange away

**Avatar Group:**
- `.wf-avatar-group` - Overlapping avatars

**Usage:**
```html
<!-- Initials avatar -->
<div class="wf-avatar">
  <span class="wf-avatar-initials">JD</span>
</div>

<!-- Image avatar -->
<div class="wf-avatar">
  <img src="user.jpg" alt="User" class="wf-avatar-image">
</div>

<!-- Avatar with status -->
<div class="wf-avatar-wrapper">
  <div class="wf-avatar">
    <span class="wf-avatar-initials">JD</span>
  </div>
  <span class="wf-avatar-status wf-avatar-status-online"></span>
</div>

<!-- Avatar group -->
<div class="wf-avatar-group">
  <div class="wf-avatar"><span class="wf-avatar-initials">A</span></div>
  <div class="wf-avatar"><span class="wf-avatar-initials">B</span></div>
  <div class="wf-avatar"><span class="wf-avatar-initials">+3</span></div>
</div>
```

---

### List

Simple list component.

**CSS Classes:**
- `.wf-list` - List container
- `.wf-list-item` - List item
- `.wf-list-item-content` - Item content
- `.wf-list-item-title` - Item title
- `.wf-list-item-description` - Item description
- `.wf-list-item-meta` - Meta information

**Variants:**
- `.wf-list-item-clickable` - Clickable items with hover
- `.wf-list-item-selected` - Selected state

**Usage:**
```html
<ul class="wf-list">
  <li class="wf-list-item wf-list-item-clickable">
    <div class="wf-avatar wf-avatar-sm">
      <span class="wf-avatar-initials">JD</span>
    </div>
    <div class="wf-list-item-content">
      <div class="wf-list-item-title">John Doe</div>
      <div class="wf-list-item-description">john@example.com</div>
    </div>
    <span class="wf-list-item-meta">2 hours ago</span>
  </li>
</ul>
```

---

## Navigation

### Tabs

Tab navigation for content switching.

**CSS Classes:**
- `.wf-tabs` - Tabs container
- `.wf-tabs-list` - Tab buttons container
- `.wf-tab` - Individual tab button
- `.wf-tab-active` - Active tab
- `.wf-tabs-content` - Tab content area

**Variants:**
- `.wf-tabs-card` - Card-style tabs
- `.wf-tabs-pill` - Pill-style tabs
- `.wf-tabs-vertical` - Vertical tabs

**Usage:**
```html
<div class="wf-tabs">
  <div class="wf-tabs-list">
    <button class="wf-tab wf-tab-active">General</button>
    <button class="wf-tab">Settings</button>
    <button class="wf-tab">Notifications</button>
    <button class="wf-tab" disabled>Disabled</button>
  </div>
  <div class="wf-tabs-content">
    <!-- Active tab content -->
  </div>
</div>
```

---

### Breadcrumb

Navigation path indicator.

**CSS Classes:**
- `.wf-breadcrumb` - Breadcrumb container
- `.wf-breadcrumb-item` - Breadcrumb link
- `.wf-breadcrumb-current` - Current page (not a link)
- `.wf-breadcrumb-separator` - Separator character
- `.wf-breadcrumb-ellipsis` - Collapsed indicator

**Usage:**
```html
<nav class="wf-breadcrumb">
  <a href="#" class="wf-breadcrumb-item">Home</a>
  <span class="wf-breadcrumb-separator">/</span>
  <a href="#" class="wf-breadcrumb-item">Products</a>
  <span class="wf-breadcrumb-separator">/</span>
  <span class="wf-breadcrumb-current">Edit Product</span>
</nav>
```

---

### Sidebar

Navigation sidebar for applications.

**CSS Classes:**
- `.wf-sidebar` - Sidebar container
- `.wf-sidebar-header` - Logo/brand area
- `.wf-sidebar-logo` - Logo text
- `.wf-sidebar-nav` - Navigation area
- `.wf-sidebar-item` - Navigation item
- `.wf-sidebar-item-active` - Active item
- `.wf-sidebar-icon` - Item icon
- `.wf-sidebar-label` - Item label
- `.wf-sidebar-group` - Item grouping
- `.wf-sidebar-group-label` - Group label
- `.wf-sidebar-divider` - Separator
- `.wf-sidebar-footer` - Footer area

**Variants:**
- `.wf-sidebar-collapsed` - Collapsed sidebar (icons only)
- `.wf-sidebar-dark` - Dark theme

**Usage:**
```html
<aside class="wf-sidebar">
  <div class="wf-sidebar-header">
    <span class="wf-sidebar-logo">App Name</span>
  </div>
  <nav class="wf-sidebar-nav">
    <a href="#" class="wf-sidebar-item wf-sidebar-item-active">
      <span class="wf-sidebar-icon">H</span>
      <span class="wf-sidebar-label">Home</span>
    </a>
    <div class="wf-sidebar-group">
      <span class="wf-sidebar-group-label">Management</span>
      <a href="#" class="wf-sidebar-item">
        <span class="wf-sidebar-icon">U</span>
        <span class="wf-sidebar-label">Users</span>
      </a>
    </div>
    <div class="wf-sidebar-divider"></div>
    <a href="#" class="wf-sidebar-item">
      <span class="wf-sidebar-icon">S</span>
      <span class="wf-sidebar-label">Settings</span>
    </a>
  </nav>
  <div class="wf-sidebar-footer">
    <span>Version 1.0</span>
  </div>
</aside>
```

---

### Menu

Dropdown menu component.

**CSS Classes:**
- `.wf-menu-container` - Positioning container
- `.wf-menu` - Menu dropdown
- `.wf-menu-right` - Right-aligned menu
- `.wf-menu-item` - Menu item
- `.wf-menu-item-danger` - Danger/delete item
- `.wf-menu-icon` - Item icon
- `.wf-menu-shortcut` - Keyboard shortcut
- `.wf-menu-divider` - Separator
- `.wf-menu-label` - Section label

**Usage:**
```html
<div class="wf-menu-container">
  <button class="wf-button wf-button-secondary">Options</button>
  <div class="wf-menu">
    <button class="wf-menu-item">
      <span class="wf-menu-icon">E</span>
      Edit
      <span class="wf-menu-shortcut">Ctrl+E</span>
    </button>
    <button class="wf-menu-item">
      <span class="wf-menu-icon">D</span>
      Duplicate
    </button>
    <div class="wf-menu-divider"></div>
    <button class="wf-menu-item wf-menu-item-danger">
      <span class="wf-menu-icon">X</span>
      Delete
    </button>
  </div>
</div>
```

---

### Stepper

Multi-step progress indicator.

**CSS Classes:**
- `.wf-stepper` - Stepper container
- `.wf-step` - Step item
- `.wf-step-indicator` - Step number circle
- `.wf-step-label` - Step label
- `.wf-step-description` - Step description
- `.wf-step-connector` - Line between steps

**Step States:**
- `.wf-step-completed` - Completed step
- `.wf-step-active` - Current step
- `.wf-step-error` - Error step

**Connector State:**
- `.wf-step-connector-completed` - Completed connector

**Variants:**
- `.wf-stepper-vertical` - Vertical layout
- `.wf-stepper-compact` - Smaller indicators

**Usage:**
```html
<div class="wf-stepper">
  <div class="wf-step wf-step-completed">
    <div class="wf-step-indicator">1</div>
    <div class="wf-step-label">Account</div>
  </div>
  <div class="wf-step-connector wf-step-connector-completed"></div>
  <div class="wf-step wf-step-active">
    <div class="wf-step-indicator">2</div>
    <div class="wf-step-label">Details</div>
  </div>
  <div class="wf-step-connector"></div>
  <div class="wf-step">
    <div class="wf-step-indicator">3</div>
    <div class="wf-step-label">Confirm</div>
  </div>
</div>
```

---

### Pagination

Page navigation controls.

**CSS Classes:**
- `.wf-pagination` - Pagination container
- `.wf-pagination-item` - Page button/link
- `.wf-pagination-active` - Current page
- `.wf-pagination-ellipsis` - Ellipsis indicator

**Usage:**
```html
<nav class="wf-pagination">
  <button class="wf-pagination-item" disabled>Prev</button>
  <button class="wf-pagination-item wf-pagination-active">1</button>
  <button class="wf-pagination-item">2</button>
  <button class="wf-pagination-item">3</button>
  <span class="wf-pagination-ellipsis">...</span>
  <button class="wf-pagination-item">10</button>
  <button class="wf-pagination-item">Next</button>
</nav>
```

---

### Navbar

Top navigation bar.

**CSS Classes:**
- `.wf-navbar` - Navbar container
- `.wf-navbar-brand` - Logo/brand area
- `.wf-navbar-nav` - Navigation items
- `.wf-navbar-item` - Nav item
- `.wf-navbar-item-active` - Active item
- `.wf-navbar-actions` - Right-side actions

**Usage:**
```html
<nav class="wf-navbar">
  <a href="#" class="wf-navbar-brand">
    <span>AppName</span>
  </a>
  <div class="wf-navbar-nav">
    <a href="#" class="wf-navbar-item wf-navbar-item-active">Dashboard</a>
    <a href="#" class="wf-navbar-item">Reports</a>
    <a href="#" class="wf-navbar-item">Settings</a>
  </div>
  <div class="wf-navbar-actions">
    <button class="wf-button wf-button-ghost">Help</button>
    <div class="wf-avatar wf-avatar-sm">
      <span class="wf-avatar-initials">JD</span>
    </div>
  </div>
</nav>
```

---

## Feedback

### Modal

Centered dialog overlay.

**CSS Classes:**
- `.wf-overlay` - Overlay container
- `.wf-overlay-visible` - Visible state
- `.wf-overlay-backdrop` - Semi-transparent backdrop
- `.wf-modal` - Modal container
- `.wf-modal-header` - Modal header
- `.wf-modal-title` - Modal title
- `.wf-modal-close` - Close button
- `.wf-modal-body` - Modal content
- `.wf-modal-footer` - Modal footer

**Size Variants:**
- `.wf-modal-sm` - 400px max width
- Default - 500px max width
- `.wf-modal-lg` - 700px max width
- `.wf-modal-xl` - 900px max width
- `.wf-modal-full` - Full screen

**Confirm Dialog:**
- `.wf-modal-confirm` - Confirm dialog style
- `.wf-confirm-icon` - Centered icon
- `.wf-confirm-icon-info/success/warning/danger`
- `.wf-confirm-title` - Confirm title
- `.wf-confirm-message` - Confirm message

**Usage:**
```html
<div class="wf-overlay wf-overlay-visible">
  <div class="wf-overlay-backdrop"></div>
  <div class="wf-modal">
    <div class="wf-modal-header">
      <h2 class="wf-modal-title">Modal Title</h2>
      <button class="wf-modal-close">&times;</button>
    </div>
    <div class="wf-modal-body">
      <p>Modal content goes here.</p>
    </div>
    <div class="wf-modal-footer">
      <button class="wf-button wf-button-secondary">Cancel</button>
      <button class="wf-button wf-button-primary">Confirm</button>
    </div>
  </div>
</div>
```

---

### Drawer

Slide-in panel from screen edge.

**CSS Classes:**
- `.wf-drawer` - Drawer container
- `.wf-drawer-header` - Drawer header
- `.wf-drawer-title` - Drawer title
- `.wf-drawer-close` - Close button
- `.wf-drawer-body` - Drawer content
- `.wf-drawer-footer` - Drawer footer

**Position Variants:**
- `.wf-drawer-right` - Slide from right (default)
- `.wf-drawer-left` - Slide from left
- `.wf-drawer-top` - Slide from top
- `.wf-drawer-bottom` - Slide from bottom
- `.wf-drawer-full` - Full screen

**Width Variants (for left/right):**
- `.wf-drawer-narrow` - 400px
- Default - 600px
- `.wf-drawer-wide` - 800px

**Usage:**
```html
<div class="wf-overlay wf-overlay-visible">
  <div class="wf-overlay-backdrop"></div>
  <div class="wf-drawer wf-drawer-right">
    <div class="wf-drawer-header">
      <h2 class="wf-drawer-title">Edit Item</h2>
      <button class="wf-drawer-close">&times;</button>
    </div>
    <div class="wf-drawer-body">
      <!-- Form fields -->
    </div>
    <div class="wf-drawer-footer">
      <button class="wf-button wf-button-secondary">Cancel</button>
      <button class="wf-button wf-button-primary">Save</button>
    </div>
  </div>
</div>
```

---

### Toast

Non-blocking notification.

**CSS Classes:**
- `.wf-toast-container` - Positioning container
- `.wf-toast` - Toast message
- `.wf-toast-icon` - Toast icon
- `.wf-toast-message` - Toast text
- `.wf-toast-close` - Close button

**Position Variants (container):**
- Default - bottom-right
- `.wf-toast-container-top-right`
- `.wf-toast-container-top-left`
- `.wf-toast-container-bottom-left`
- `.wf-toast-container-top-center`
- `.wf-toast-container-bottom-center`

**Type Variants:**
- `.wf-toast-info` - Blue info
- `.wf-toast-success` - Green success
- `.wf-toast-warning` - Orange warning
- `.wf-toast-error` - Red error

**Animation:**
- `.wf-toast-exiting` - Exit animation

**Usage:**
```html
<div class="wf-toast-container">
  <div class="wf-toast wf-toast-success">
    <span class="wf-toast-icon">Check</span>
    <span class="wf-toast-message">Changes saved successfully.</span>
    <button class="wf-toast-close">&times;</button>
  </div>
</div>
```

---

### Alert

Inline alert banner.

**CSS Classes:**
- `.wf-alert` - Alert container
- `.wf-alert-icon` - Alert icon
- `.wf-alert-content` - Content container
- `.wf-alert-title` - Alert title
- `.wf-alert-description` - Alert description
- `.wf-alert-close` - Close button
- `.wf-alert-actions` - Action buttons

**Type Variants:**
- `.wf-alert-info` - Blue info
- `.wf-alert-success` - Green success
- `.wf-alert-warning` - Orange warning
- `.wf-alert-error` - Red error

**Layout Variants:**
- `.wf-alert-simple` - Without title
- `.wf-alert-banner` - Full-width banner

**Usage:**
```html
<div class="wf-alert wf-alert-warning">
  <span class="wf-alert-icon">!</span>
  <div class="wf-alert-content">
    <h4 class="wf-alert-title">Warning</h4>
    <p class="wf-alert-description">Your session will expire in 5 minutes.</p>
    <div class="wf-alert-actions">
      <button class="wf-button wf-button-sm wf-button-primary">Extend Session</button>
    </div>
  </div>
  <button class="wf-alert-close">&times;</button>
</div>
```

---

### Tooltip

Contextual information on hover.

**CSS Classes:**
- `.wf-tooltip-container` - Wrapper element
- `.wf-tooltip` - Tooltip bubble
- `.wf-tooltip-arrow` - Arrow indicator
- `.wf-tooltip-visible` - Visible state

**Position Variants:**
- `.wf-tooltip-top` - Above element
- `.wf-tooltip-bottom` - Below element
- `.wf-tooltip-left` - Left of element
- `.wf-tooltip-right` - Right of element

**Other:**
- `.wf-tooltip-multiline` - Multi-line tooltip

**Usage:**
```html
<div class="wf-tooltip-container">
  <button class="wf-button wf-button-secondary">Hover me</button>
  <div class="wf-tooltip wf-tooltip-top">
    <span>Helpful tooltip text</span>
    <div class="wf-tooltip-arrow"></div>
  </div>
</div>
```

---

## Status

### Progress

Progress bar indicator.

**CSS Classes:**
- `.wf-progress` - Progress container
- `.wf-progress-label` - Label row
- `.wf-progress-bar` - Bar track
- `.wf-progress-fill` - Filled portion

**Color Variants:**
- `.wf-progress-success` - Green
- `.wf-progress-warning` - Orange
- `.wf-progress-error` - Red

**Size Variants:**
- `.wf-progress-sm` - 4px height
- Default - 8px height
- `.wf-progress-lg` - 12px height

**Other:**
- `.wf-progress-bar-only` - Hide labels
- `.wf-progress-indeterminate` - Animated indeterminate

**Usage:**
```html
<div class="wf-progress">
  <div class="wf-progress-label">
    <span>Uploading...</span>
    <span>65%</span>
  </div>
  <div class="wf-progress-bar">
    <div class="wf-progress-fill" style="width: 65%"></div>
  </div>
</div>
```

---

### Loader

Loading spinner indicator.

**CSS Classes:**
- `.wf-loader` - Loader container
- `.wf-loader-spinner` - Spinning element
- `.wf-loader-text` - Loading text

**Size Variants:**
- `.wf-loader-sm` - 16px spinner
- Default - 24px spinner
- `.wf-loader-lg` - 40px spinner

**Layout Variants:**
- `.wf-loader-horizontal` - Horizontal layout
- `.wf-loader-inline` - Inline display

**Color Variants:**
- `.wf-loader-success` - Green
- `.wf-loader-warning` - Orange
- `.wf-loader-error` - Red
- `.wf-loader-inverse` - White (for dark backgrounds)

**Overlay:**
- `.wf-loader-overlay` - Fullscreen loading overlay

**Usage:**
```html
<div class="wf-loader">
  <div class="wf-loader-spinner"></div>
  <span class="wf-loader-text">Loading...</span>
</div>

<!-- Large loader -->
<div class="wf-loader wf-loader-lg">
  <div class="wf-loader-spinner"></div>
</div>

<!-- Fullscreen overlay -->
<div class="wf-loader-overlay">
  <div class="wf-loader">
    <div class="wf-loader-spinner"></div>
    <span class="wf-loader-text">Please wait...</span>
  </div>
</div>
```

---

### Skeleton

Loading placeholder content.

**CSS Classes:**
- `.wf-skeleton` - Base skeleton with shimmer

**Text Skeletons:**
- `.wf-skeleton-text` - Text line (100% width)
- `.wf-skeleton-text-short` - 60% width
- `.wf-skeleton-text-xs` - 30% width
- `.wf-skeleton-heading` - Heading (24px height)
- `.wf-skeleton-heading-lg` - Large heading (32px height)

**Shape Skeletons:**
- `.wf-skeleton-rect` - Rectangle
- `.wf-skeleton-circle` - Circle
- `.wf-skeleton-avatar-sm/default/lg` - Avatar sizes
- `.wf-skeleton-button` - Button shape
- `.wf-skeleton-input` - Input field

**Compound Skeletons:**
- `.wf-skeleton-card` - Card skeleton
- `.wf-skeleton-card-image` - Card image area
- `.wf-skeleton-card-body` - Card body
- `.wf-skeleton-table-row` - Table row
- `.wf-skeleton-list-item` - List item

**Container:**
- `.wf-skeleton-lines` - Multiple text lines

**Usage:**
```html
<!-- Text skeleton -->
<div class="wf-skeleton-lines">
  <div class="wf-skeleton wf-skeleton-heading"></div>
  <div class="wf-skeleton wf-skeleton-text"></div>
  <div class="wf-skeleton wf-skeleton-text"></div>
  <div class="wf-skeleton wf-skeleton-text-short"></div>
</div>

<!-- Avatar with text -->
<div class="wf-skeleton-list-item">
  <div class="wf-skeleton wf-skeleton-avatar"></div>
  <div class="wf-skeleton-list-item-content">
    <div class="wf-skeleton wf-skeleton-text-short"></div>
    <div class="wf-skeleton wf-skeleton-text-xs"></div>
  </div>
</div>

<!-- Card skeleton -->
<div class="wf-skeleton-card">
  <div class="wf-skeleton wf-skeleton-card-image"></div>
  <div class="wf-skeleton-card-body">
    <div class="wf-skeleton wf-skeleton-heading"></div>
    <div class="wf-skeleton wf-skeleton-text"></div>
  </div>
</div>
```

---

### EmptyState

Empty content placeholder.

**CSS Classes:**
- `.wf-empty-state` - Empty state container
- `.wf-empty-state-icon` - Icon (emoji or icon font)
- `.wf-empty-state-icon-container` - Icon with background
- `.wf-empty-state-title` - Title text
- `.wf-empty-state-description` - Description text
- `.wf-empty-state-actions` - Action buttons

**Variants:**
- `.wf-empty-state-compact` - Smaller size
- `.wf-empty-state-inline` - For tables/lists
- `.wf-empty-state-bordered` - Dashed border
- `.wf-empty-state-error` - Error styling
- `.wf-empty-state-success` - Success styling
- `.wf-empty-state-warning` - Warning styling
- `.wf-empty-state-search` - Search no results

**Usage:**
```html
<div class="wf-empty-state">
  <div class="wf-empty-state-icon-container">
    <span>+</span>
  </div>
  <h3 class="wf-empty-state-title">No items yet</h3>
  <p class="wf-empty-state-description">
    Get started by creating your first item.
  </p>
  <div class="wf-empty-state-actions">
    <button class="wf-button wf-button-primary">Create Item</button>
  </div>
</div>

<!-- Compact empty state for tables -->
<div class="wf-empty-state wf-empty-state-compact wf-empty-state-inline">
  <span class="wf-empty-state-icon">Search</span>
  <h4 class="wf-empty-state-title">No results found</h4>
  <p class="wf-empty-state-description">Try adjusting your search criteria.</p>
</div>
```

---

## Utility Classes

### Status Indicator

Simple status dot with optional text.

**CSS Classes:**
- `.wf-status-dot` - Base status dot
- `.wf-status-dot-success` - Green
- `.wf-status-dot-warning` - Orange
- `.wf-status-dot-error` - Red
- `.wf-status-dot-info` - Blue
- `.wf-status-dot-pulse` - Pulsing animation
- `.wf-status-indicator` - Dot with text label

**Usage:**
```html
<span class="wf-status-dot wf-status-dot-success"></span>

<span class="wf-status-indicator">
  <span class="wf-status-dot wf-status-dot-success wf-status-dot-pulse"></span>
  Online
</span>
```
