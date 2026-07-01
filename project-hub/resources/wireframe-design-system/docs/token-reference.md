# Design Token Reference

Complete reference for all CSS custom properties (design tokens) in the Gravitate Wireframe Design System.

---

## Table of Contents

1. [Colors](#colors)
   - [Primary & Status Colors](#primary--status-colors)
   - [Neutral Scale](#neutral-scale)
   - [Semantic Aliases](#semantic-aliases)
2. [Typography](#typography)
   - [Font Families](#font-families)
   - [Type Scale](#type-scale)
   - [Font Weights](#font-weights)
   - [Line Heights](#line-heights)
   - [Letter Spacing](#letter-spacing)
3. [Spacing](#spacing)
   - [Spacing Scale](#spacing-scale)
   - [Component Spacing](#component-spacing)
   - [Layout Spacing](#layout-spacing)
4. [Borders & Elevation](#borders--elevation)
   - [Border Radius](#border-radius)
   - [Border Width](#border-width)
   - [Elevation System](#elevation-system)
   - [Focus Ring](#focus-ring)
5. [Layout Tokens](#layout-tokens)
6. [Transitions & Animation](#transitions--animation)
7. [Z-Index Scale](#z-index-scale)
8. [Utility Classes Reference](#utility-classes-reference)

---

## Colors

### Primary & Status Colors

Core brand and status colors for interactive elements and feedback.

| Token | Value | Swatch | Usage |
|-------|-------|--------|-------|
| `--wf-color-primary` | `#2563eb` | ![#2563eb](https://via.placeholder.com/20/2563eb/2563eb) | Primary actions, links, focus states |
| `--wf-color-primary-dim` | `#1e40af` | ![#1e40af](https://via.placeholder.com/20/1e40af/1e40af) | Hover/active states |
| `--wf-color-success` | `#16a34a` | ![#16a34a](https://via.placeholder.com/20/16a34a/16a34a) | Success states, confirmations |
| `--wf-color-success-dim` | `#15803d` | ![#15803d](https://via.placeholder.com/20/15803d/15803d) | Success hover/active |
| `--wf-color-warning` | `#d97706` | ![#d97706](https://via.placeholder.com/20/d97706/d97706) | Warnings, pending states |
| `--wf-color-warning-dim` | `#b45309` | ![#b45309](https://via.placeholder.com/20/b45309/b45309) | Warning hover/active |
| `--wf-color-error` | `#dc2626` | ![#dc2626](https://via.placeholder.com/20/dc2626/dc2626) | Errors, destructive actions |
| `--wf-color-error-dim` | `#b91c1c` | ![#b91c1c](https://via.placeholder.com/20/b91c1c/b91c1c) | Error hover/active |

**CSS Usage:**
```css
.my-button {
  background-color: var(--wf-color-primary);
}

.my-button:hover {
  background-color: var(--wf-color-primary-dim);
}

.error-text {
  color: var(--wf-color-error);
}
```

---

### Neutral Scale

Grayscale palette for text, backgrounds, and borders.

| Token | Value | Swatch | Usage |
|-------|-------|--------|-------|
| `--wf-color-neutral-900` | `#111827` | ![#111827](https://via.placeholder.com/20/111827/111827) | Primary text, headings |
| `--wf-color-neutral-700` | `#374151` | ![#374151](https://via.placeholder.com/20/374151/374151) | Secondary text, labels |
| `--wf-color-neutral-500` | `#6b7280` | ![#6b7280](https://via.placeholder.com/20/6b7280/6b7280) | Placeholder text, icons |
| `--wf-color-neutral-300` | `#d1d5db` | ![#d1d5db](https://via.placeholder.com/20/d1d5db/d1d5db) | Borders, dividers |
| `--wf-color-neutral-100` | `#f3f4f6` | ![#f3f4f6](https://via.placeholder.com/20/f3f4f6/f3f4f6) | Subtle backgrounds, hover |
| `--wf-color-neutral-50` | `#f9fafb` | ![#f9fafb](https://via.placeholder.com/20/f9fafb/f9fafb) | Page backgrounds, cards |

**Extended Grayscale (from tokens.css):**

| Token | Value | Swatch |
|-------|-------|--------|
| `--wf-color-white` | `#ffffff` | ![#ffffff](https://via.placeholder.com/20/ffffff/ffffff) |
| `--wf-color-gray-50` | `#f9fafb` | ![#f9fafb](https://via.placeholder.com/20/f9fafb/f9fafb) |
| `--wf-color-gray-100` | `#f3f4f6` | ![#f3f4f6](https://via.placeholder.com/20/f3f4f6/f3f4f6) |
| `--wf-color-gray-200` | `#e5e7eb` | ![#e5e7eb](https://via.placeholder.com/20/e5e7eb/e5e7eb) |
| `--wf-color-gray-300` | `#d1d5db` | ![#d1d5db](https://via.placeholder.com/20/d1d5db/d1d5db) |
| `--wf-color-gray-400` | `#9ca3af` | ![#9ca3af](https://via.placeholder.com/20/9ca3af/9ca3af) |
| `--wf-color-gray-500` | `#6b7280` | ![#6b7280](https://via.placeholder.com/20/6b7280/6b7280) |
| `--wf-color-gray-600` | `#4b5563` | ![#4b5563](https://via.placeholder.com/20/4b5563/4b5563) |
| `--wf-color-gray-700` | `#374151` | ![#374151](https://via.placeholder.com/20/374151/374151) |
| `--wf-color-gray-800` | `#1f2937` | ![#1f2937](https://via.placeholder.com/20/1f2937/1f2937) |
| `--wf-color-gray-900` | `#111827` | ![#111827](https://via.placeholder.com/20/111827/111827) |
| `--wf-color-black` | `#000000` | ![#000000](https://via.placeholder.com/20/000000/000000) |

---

### Semantic Aliases

Purpose-driven color assignments for consistent usage.

**Border Colors:**
| Token | Resolves To | Usage |
|-------|-------------|-------|
| `--wf-color-border` | `--wf-color-neutral-300` | Default borders |
| `--wf-color-border-light` | `--wf-color-neutral-100` | Subtle borders |
| `--wf-color-border-focus` | `--wf-color-primary` | Focus state borders |

**Surface Colors:**
| Token | Value | Usage |
|-------|-------|-------|
| `--wf-color-surface` | `#ffffff` | Cards, modals, inputs |
| `--wf-color-surface-raised` | `--wf-color-neutral-50` | Elevated surfaces |
| `--wf-color-surface-sunken` | `--wf-color-neutral-100` | Inset, disabled |

**Text Colors:**
| Token | Resolves To | Usage |
|-------|-------------|-------|
| `--wf-color-text-primary` | `--wf-color-neutral-900` | Main content, headings |
| `--wf-color-text-secondary` | `--wf-color-neutral-700` | Supporting text, labels |
| `--wf-color-text-tertiary` | `--wf-color-neutral-500` | Hints, placeholders |
| `--wf-color-text-inverse` | `#ffffff` | Text on dark backgrounds |

**Background Colors:**
| Token | Resolves To | Usage |
|-------|-------------|-------|
| `--wf-color-background` | `--wf-color-neutral-50` | Page background |
| `--wf-color-background-overlay` | `rgba(17, 24, 39, 0.5)` | Modal overlays |

---

## Typography

### Font Families

| Token | Value | Usage |
|-------|-------|-------|
| `--wf-font-family` | System font stack | All UI text |
| `--wf-font-mono` | Monospace font stack | Code, data |

**Full Font Stack:**
```css
--wf-font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
                  'Helvetica Neue', Arial, 'Noto Sans', sans-serif,
                  'Apple Color Emoji', 'Segoe UI Emoji';

--wf-font-mono: ui-monospace, SFMono-Regular, 'SF Mono', Menlo,
                Consolas, 'Liberation Mono', monospace;
```

---

### Type Scale

7-level scale for clear visual hierarchy.

| Token | Value | Pixels | Usage |
|-------|-------|--------|-------|
| `--wf-text-xs` | `0.6875rem` | 11px | Fine print, badges, timestamps |
| `--wf-text-sm` | `0.75rem` | 12px | Captions, helper text, table cells |
| `--wf-text-base` | `0.875rem` | 14px | Body text, default size |
| `--wf-text-md` | `1rem` | 16px | Emphasized body, large inputs |
| `--wf-text-lg` | `1.125rem` | 18px | Section headings, card titles |
| `--wf-text-xl` | `1.5rem` | 24px | Page headings, modal titles |
| `--wf-text-2xl` | `2rem` | 32px | Hero text, major headings |

**CSS Usage:**
```css
.page-title {
  font-size: var(--wf-text-xl);
}

.helper-text {
  font-size: var(--wf-text-sm);
}
```

---

### Font Weights

| Token | Value | Usage |
|-------|-------|-------|
| `--wf-font-normal` | `400` | Regular body text |
| `--wf-font-medium` | `500` | Subtle emphasis, labels |
| `--wf-font-semibold` | `600` | Strong emphasis, buttons, headings |
| `--wf-font-bold` | `700` | Maximum emphasis |

---

### Line Heights

| Token | Value | Usage |
|-------|-------|-------|
| `--wf-leading-tight` | `1.25` | Headings, single-line elements |
| `--wf-leading-normal` | `1.5` | Body text, default |
| `--wf-leading-relaxed` | `1.75` | Long-form content |

---

### Letter Spacing

| Token | Value | Usage |
|-------|-------|-------|
| `--wf-tracking-tight` | `-0.025em` | Large headings |
| `--wf-tracking-normal` | `0` | Body text |
| `--wf-tracking-wide` | `0.025em` | All caps, labels |

---

## Spacing

### Spacing Scale

8px base unit system with half-step for fine adjustments.

| Token | Value | Pixels | Usage |
|-------|-------|--------|-------|
| `--wf-space-0` | `0` | 0px | No spacing |
| `--wf-space-1` | `0.25rem` | 4px | Tight spacing, inline elements |
| `--wf-space-2` | `0.5rem` | 8px | Base unit, compact layouts |
| `--wf-space-3` | `0.75rem` | 12px | Small gaps, icon padding |
| `--wf-space-4` | `1rem` | 16px | Default padding, form gaps |
| `--wf-space-5` | `1.25rem` | 20px | Medium spacing |
| `--wf-space-6` | `1.5rem` | 24px | Section padding, card gutters |
| `--wf-space-8` | `2rem` | 32px | Large gaps, section breaks |
| `--wf-space-10` | `2.5rem` | 40px | Major section spacing |
| `--wf-space-12` | `3rem` | 48px | Page sections |
| `--wf-space-16` | `4rem` | 64px | Large section breaks, hero |

**CSS Usage:**
```css
.card {
  padding: var(--wf-space-4);
  gap: var(--wf-space-3);
}

.section {
  margin-bottom: var(--wf-space-8);
}
```

---

### Component Spacing

Pre-defined spacing for common component patterns.

| Token | Resolves To | Usage |
|-------|-------------|-------|
| `--wf-space-input-x` | `--wf-space-3` (12px) | Horizontal input padding |
| `--wf-space-input-y` | `--wf-space-2` (8px) | Vertical input padding |
| `--wf-space-card` | `--wf-space-4` (16px) | Default card padding |
| `--wf-space-card-lg` | `--wf-space-6` (24px) | Large card padding |
| `--wf-space-modal` | `--wf-space-6` (24px) | Modal content padding |
| `--wf-space-stack-sm` | `--wf-space-2` (8px) | Tight stacking |
| `--wf-space-stack` | `--wf-space-4` (16px) | Default stacking |
| `--wf-space-stack-lg` | `--wf-space-6` (24px) | Loose stacking |

---

### Layout Spacing

Page-level and major layout spacing.

| Token | Resolves To | Usage |
|-------|-------------|-------|
| `--wf-space-page-x` | `--wf-space-6` (24px) | Page horizontal padding |
| `--wf-space-page-y` | `--wf-space-8` (32px) | Page vertical padding |
| `--wf-space-gutter` | `--wf-space-6` (24px) | Grid gutter width |

---

## Borders & Elevation

### Border Radius

| Token | Value | Pixels | Usage |
|-------|-------|--------|-------|
| `--wf-radius-none` | `0` | 0px | Sharp corners |
| `--wf-radius-sm` | `0.25rem` | 4px | Buttons, inputs, small elements |
| `--wf-radius-md` | `0.5rem` | 8px | Cards, modals, dropdowns |
| `--wf-radius-lg` | `0.75rem` | 12px | Large containers, panels |
| `--wf-radius-full` | `9999px` | Pill | Pills, avatars, badges |

---

### Border Width

| Token | Value | Usage |
|-------|-------|-------|
| `--wf-border-width` | `1px` | Default border width |
| `--wf-border-width-2` | `2px` | Emphasis, focus states |
| `--wf-border-width-3` | `3px` | Strong emphasis |

---

### Elevation System

Wireframe-appropriate elevation using borders instead of shadows.

| Token | Value | Usage |
|-------|-------|-------|
| `--wf-elevation-0` | `none` | Flat, no elevation |
| `--wf-elevation-1` | `1px solid border` | Cards, containers |
| `--wf-elevation-2` | `2px solid border` | Dropdowns, popovers |
| `--wf-elevation-3` | `2px solid primary` | Modals, focus rings |

**Pre-defined Border Styles:**
| Token | Usage |
|-------|-------|
| `--wf-border-input` | Default input border |
| `--wf-border-input-hover` | Input hover border |
| `--wf-border-input-focus` | Input focus border |
| `--wf-border-input-error` | Input error border |
| `--wf-border-card` | Card border |
| `--wf-border-table` | Table cell border |
| `--wf-divider` | Horizontal divider |
| `--wf-divider-light` | Subtle divider |

---

### Focus Ring

Accessible focus indicator for keyboard navigation.

| Token | Value |
|-------|-------|
| `--wf-focus-ring` | `0 0 0 2px surface, 0 0 0 4px primary` |
| `--wf-focus-ring-offset` | `2px` |

**CSS Usage:**
```css
.interactive-element:focus {
  outline: none;
  box-shadow: var(--wf-focus-ring);
}
```

---

## Layout Tokens

### Container Widths

| Token | Value | Usage |
|-------|-------|-------|
| `--wf-container-sm` | `640px` | Small content |
| `--wf-container-md` | `768px` | Medium content |
| `--wf-container-lg` | `1024px` | Standard content |
| `--wf-container-xl` | `1280px` | Wide content |
| `--wf-container-2xl` | `1536px` | Extra wide content |

### Component Dimensions

| Token | Value | Usage |
|-------|-------|-------|
| `--wf-sidebar-width` | `256px` | Sidebar width |
| `--wf-sidebar-width-collapsed` | `64px` | Collapsed sidebar |
| `--wf-header-height` | `64px` | Header height |
| `--wf-header-height-sm` | `48px` | Compact header |

---

## Transitions & Animation

| Token | Value | Usage |
|-------|-------|-------|
| `--wf-transition-fast` | `150ms ease` | Quick interactions |
| `--wf-transition-normal` | `200ms ease` | Standard transitions |
| `--wf-transition-slow` | `300ms ease` | Complex animations |

**CSS Usage:**
```css
.button {
  transition: background-color var(--wf-transition-fast);
}

.modal {
  transition: transform var(--wf-transition-normal);
}
```

---

## Z-Index Scale

Layered stacking context for overlapping elements.

| Token | Value | Usage |
|-------|-------|-------|
| `--wf-z-dropdown` | `100` | Dropdown menus |
| `--wf-z-sticky` | `200` | Sticky headers |
| `--wf-z-fixed` | `300` | Fixed elements |
| `--wf-z-modal-backdrop` | `400` | Modal backdrop |
| `--wf-z-modal` | `500` | Modal content |
| `--wf-z-popover` | `600` | Popovers |
| `--wf-z-tooltip` | `700` | Tooltips |

---

## Utility Classes Reference

### Display Utilities

| Class | CSS |
|-------|-----|
| `.wf-hidden` | `display: none` |
| `.wf-block` | `display: block` |
| `.wf-inline-block` | `display: inline-block` |
| `.wf-inline` | `display: inline` |
| `.wf-flex` | `display: flex` |
| `.wf-inline-flex` | `display: inline-flex` |

### Flexbox Utilities

| Class | CSS |
|-------|-----|
| `.wf-flex-row` | `flex-direction: row` |
| `.wf-flex-col` | `flex-direction: column` |
| `.wf-flex-wrap` | `flex-wrap: wrap` |
| `.wf-flex-nowrap` | `flex-wrap: nowrap` |
| `.wf-flex-1` | `flex: 1 1 0%` |
| `.wf-flex-auto` | `flex: 1 1 auto` |
| `.wf-flex-none` | `flex: none` |
| `.wf-flex-grow` | `flex-grow: 1` |
| `.wf-flex-shrink-0` | `flex-shrink: 0` |

### Alignment Utilities

| Class | CSS |
|-------|-----|
| `.wf-items-start` | `align-items: flex-start` |
| `.wf-items-center` | `align-items: center` |
| `.wf-items-end` | `align-items: flex-end` |
| `.wf-items-stretch` | `align-items: stretch` |
| `.wf-items-baseline` | `align-items: baseline` |
| `.wf-justify-start` | `justify-content: flex-start` |
| `.wf-justify-center` | `justify-content: center` |
| `.wf-justify-end` | `justify-content: flex-end` |
| `.wf-justify-between` | `justify-content: space-between` |
| `.wf-justify-around` | `justify-content: space-around` |
| `.wf-justify-evenly` | `justify-content: space-evenly` |

### Gap Utilities

| Class | Value |
|-------|-------|
| `.wf-gap-0` | `0` |
| `.wf-gap-1` | `4px` |
| `.wf-gap-2` | `8px` |
| `.wf-gap-3` | `12px` |
| `.wf-gap-4` | `16px` |
| `.wf-gap-5` | `20px` |
| `.wf-gap-6` | `24px` |
| `.wf-gap-8` | `32px` |

Also available: `.wf-gap-x-*` and `.wf-gap-y-*` variants.

### Padding Utilities

| Class | Value |
|-------|-------|
| `.wf-p-0` to `.wf-p-6` | All sides padding |
| `.wf-px-0` to `.wf-px-6` | Horizontal padding |
| `.wf-py-0` to `.wf-py-6` | Vertical padding |
| `.wf-pt-*`, `.wf-pb-*`, `.wf-pl-*`, `.wf-pr-*` | Individual sides |

### Margin Utilities

| Class | Value |
|-------|-------|
| `.wf-m-0` to `.wf-m-6` | All sides margin |
| `.wf-mx-0` to `.wf-mx-6` | Horizontal margin |
| `.wf-my-0` to `.wf-my-6` | Vertical margin |
| `.wf-mt-*`, `.wf-mb-*`, `.wf-ml-*`, `.wf-mr-*` | Individual sides |
| `.wf-m-auto`, `.wf-mx-auto`, `.wf-my-auto` | Auto margin |

### Text Alignment

| Class | CSS |
|-------|-----|
| `.wf-text-left` | `text-align: left` |
| `.wf-text-center` | `text-align: center` |
| `.wf-text-right` | `text-align: right` |
| `.wf-text-justify` | `text-align: justify` |

### Width & Height

| Class | CSS |
|-------|-----|
| `.wf-w-full` | `width: 100%` |
| `.wf-w-auto` | `width: auto` |
| `.wf-w-fit` | `width: fit-content` |
| `.wf-w-1\/2` | `width: 50%` |
| `.wf-w-1\/3` | `width: 33.333%` |
| `.wf-w-2\/3` | `width: 66.667%` |
| `.wf-w-1\/4` | `width: 25%` |
| `.wf-w-3\/4` | `width: 75%` |
| `.wf-h-full` | `height: 100%` |
| `.wf-h-auto` | `height: auto` |
| `.wf-h-screen` | `height: 100vh` |
| `.wf-min-h-screen` | `min-height: 100vh` |

### Overflow

| Class | CSS |
|-------|-----|
| `.wf-overflow-auto` | `overflow: auto` |
| `.wf-overflow-hidden` | `overflow: hidden` |
| `.wf-overflow-visible` | `overflow: visible` |
| `.wf-overflow-scroll` | `overflow: scroll` |
| `.wf-overflow-x-auto` | `overflow-x: auto` |
| `.wf-overflow-y-auto` | `overflow-y: auto` |

### Position

| Class | CSS |
|-------|-----|
| `.wf-relative` | `position: relative` |
| `.wf-absolute` | `position: absolute` |
| `.wf-fixed` | `position: fixed` |
| `.wf-sticky` | `position: sticky` |
| `.wf-inset-0` | `top/right/bottom/left: 0` |
| `.wf-top-0`, `.wf-right-0`, `.wf-bottom-0`, `.wf-left-0` | Individual |

### Cursor

| Class | CSS |
|-------|-----|
| `.wf-cursor-pointer` | `cursor: pointer` |
| `.wf-cursor-default` | `cursor: default` |
| `.wf-cursor-not-allowed` | `cursor: not-allowed` |
| `.wf-cursor-wait` | `cursor: wait` |

### Visual Utilities

| Class | Description |
|-------|-------------|
| `.wf-truncate` | Truncate text with ellipsis |
| `.wf-sr-only` | Screen reader only (visually hidden) |
| `.wf-not-sr-only` | Undo screen reader only |
