# Migration Guide: Wireframe to Production

This guide helps you transition from Gravitate Wireframe Design System prototypes to Excalibrr production components.

---

## Table of Contents

1. [Overview](#overview)
2. [Component Mapping](#component-mapping)
3. [Token Mapping](#token-mapping)
4. [Key Differences](#key-differences)
5. [Migration Tips](#migration-tips)
6. [Code Examples](#code-examples)

---

## Overview

The Gravitate Wireframe Design System is designed to mirror Excalibrr production components structurally. This intentional alignment means:

- **Similar component hierarchy** - Wireframe components have equivalent production counterparts
- **Consistent naming patterns** - Class prefixes differ (`wf-` vs production names), but concepts align
- **Matching layout primitives** - Row, Column, Container patterns work the same way
- **Aligned spacing scale** - 8px base unit system is consistent

### Migration Philosophy

1. **Structure transfers directly** - Your layout hierarchy and component nesting should largely remain the same
2. **Swap class names** - Replace wireframe classes with production equivalents
3. **Add visual polish** - Production components include richer styling, animations, and variants
4. **Enhance interactions** - Add JavaScript interactivity that wireframes simulated with static states

---

## Component Mapping

### Layout Components

| Wireframe Component | Production Component | Notes |
|---------------------|---------------------|-------|
| `.wf-row` | `<Horizontal>` | Direct equivalent; uses flexbox row |
| `.wf-column` | `<Vertical>` | Direct equivalent; uses flexbox column |
| `.wf-container` | `<Container>` | Similar max-width constraints |
| `.wf-page` | Page layout components | May use different structure |
| `.wf-card` | `<Card>` | Enhanced with more variants |
| `.wf-section` | Section components | Similar structure |
| `.wf-sidebar` | `<Sidebar>` / Navigation | Enhanced navigation patterns |
| `.wf-divider` | `<Divider>` | Direct equivalent |

### Typography

| Wireframe Component | Production Component | Notes |
|---------------------|---------------------|-------|
| `.wf-text-h1` | `<Texto variant="h1">` | Use Texto component |
| `.wf-text-h2` | `<Texto variant="h2">` | Use Texto component |
| `.wf-text-h3` | `<Texto variant="h3">` | Use Texto component |
| `.wf-text-body` | `<Texto variant="body">` | Default text |
| `.wf-text-helper` | `<Texto variant="helper">` | Helper/muted text |
| `.wf-text-label` | `<Texto variant="label">` | Form labels |
| `.wf-text-caption` | `<Texto variant="caption">` | Small annotations |

### Controls

| Wireframe Component | Production Component | Notes |
|---------------------|---------------------|-------|
| `.wf-button` | `<GraviButton>` | Rich button component |
| `.wf-button-primary` | `<GraviButton variant="primary">` | Primary action |
| `.wf-button-secondary` | `<GraviButton variant="secondary">` | Secondary action |
| `.wf-button-danger` | `<GraviButton variant="danger">` | Destructive action |
| `.wf-button-ghost` | `<GraviButton variant="ghost">` | Ghost/text button |
| `.wf-input` | `<TextInput>` | Text input field |
| `.wf-select` | `<SelectInput>` | Dropdown select |
| `.wf-checkbox` | `<Checkbox>` | Checkbox control |
| `.wf-radio` | `<Radio>` | Radio button |
| `.wf-toggle` | `<Toggle>` | Toggle switch |
| `.wf-field` | Form field wrapper | May use FormField pattern |

### Data Display

| Wireframe Component | Production Component | Notes |
|---------------------|---------------------|-------|
| `.wf-datagrid` | AG Grid / DataGrid | Feature-rich grid |
| `.wf-card` | `<Card>` | Content card |
| `.wf-metric-card` | `<MetricCard>` | KPI display |
| `.wf-badge` | `<Badge>` | Status indicator |
| `.wf-avatar` | `<Avatar>` | User avatar |
| `.wf-list` | `<List>` / Custom | List component |

### Navigation

| Wireframe Component | Production Component | Notes |
|---------------------|---------------------|-------|
| `.wf-tabs` | `<Tabs>` | Tab navigation |
| `.wf-breadcrumb` | `<Breadcrumb>` | Navigation path |
| `.wf-sidebar` | `<Sidebar>` | App sidebar |
| `.wf-menu` | `<Menu>` / `<Dropdown>` | Dropdown menu |
| `.wf-stepper` | `<Stepper>` | Multi-step indicator |
| `.wf-pagination` | `<Pagination>` | Page navigation |
| `.wf-navbar` | `<Navbar>` / Header | Top navigation |

### Feedback

| Wireframe Component | Production Component | Notes |
|---------------------|---------------------|-------|
| `.wf-modal` | `<Modal>` | Dialog modal |
| `.wf-drawer` | `<Drawer>` | Slide panel |
| `.wf-toast` | Toast system | Notification toasts |
| `.wf-alert` | `<Alert>` | Inline alerts |
| `.wf-tooltip` | `<Tooltip>` | Hover tooltips |

### Status

| Wireframe Component | Production Component | Notes |
|---------------------|---------------------|-------|
| `.wf-progress` | `<ProgressBar>` | Progress indicator |
| `.wf-loader` | `<Loader>` / Spinner | Loading state |
| `.wf-skeleton` | `<Skeleton>` | Loading placeholder |
| `.wf-empty-state` | `<EmptyState>` | No content state |

---

## Token Mapping

### Color Tokens

| Wireframe Token | Production Equivalent | Notes |
|-----------------|----------------------|-------|
| `--wf-color-primary` | Theme primary color | Brand primary |
| `--wf-color-primary-dim` | Theme primary dark | Hover/active |
| `--wf-color-success` | Theme success color | Green |
| `--wf-color-warning` | Theme warning color | Orange/amber |
| `--wf-color-error` | Theme error color | Red |
| `--wf-color-neutral-*` | Theme neutral scale | Grayscale |
| `--wf-color-border` | Theme border color | Border default |
| `--wf-color-surface` | Theme surface color | Card backgrounds |
| `--wf-color-text-primary` | Theme text primary | Main text |
| `--wf-color-text-secondary` | Theme text secondary | Muted text |

### Spacing Tokens

| Wireframe Token | Value | Production Equivalent |
|-----------------|-------|----------------------|
| `--wf-space-1` | 4px | spacing(1) / 0.25rem |
| `--wf-space-2` | 8px | spacing(2) / 0.5rem |
| `--wf-space-3` | 12px | spacing(3) / 0.75rem |
| `--wf-space-4` | 16px | spacing(4) / 1rem |
| `--wf-space-5` | 20px | spacing(5) / 1.25rem |
| `--wf-space-6` | 24px | spacing(6) / 1.5rem |
| `--wf-space-8` | 32px | spacing(8) / 2rem |

### Typography Tokens

| Wireframe Token | Value | Production Equivalent |
|-----------------|-------|----------------------|
| `--wf-text-xs` | 11px | fontSize.xs |
| `--wf-text-sm` | 12px | fontSize.sm |
| `--wf-text-base` | 14px | fontSize.base |
| `--wf-text-md` | 16px | fontSize.md |
| `--wf-text-lg` | 18px | fontSize.lg |
| `--wf-text-xl` | 24px | fontSize.xl |
| `--wf-text-2xl` | 32px | fontSize.2xl |

### Border Radius Tokens

| Wireframe Token | Value | Production Equivalent |
|-----------------|-------|----------------------|
| `--wf-radius-none` | 0 | borderRadius.none |
| `--wf-radius-sm` | 4px | borderRadius.sm |
| `--wf-radius-md` | 8px | borderRadius.md |
| `--wf-radius-lg` | 12px | borderRadius.lg |
| `--wf-radius-full` | 9999px | borderRadius.full |

---

## Key Differences

### 1. Class Prefixes vs Component Names

**Wireframe (CSS Classes):**
```html
<button class="wf-button wf-button-primary">Click Me</button>
```

**Production (React Components):**
```jsx
<GraviButton variant="primary">Click Me</GraviButton>
```

### 2. Static HTML vs Interactive Components

**Wireframe** - Static HTML with CSS classes representing states:
```html
<!-- Active tab shown with class -->
<button class="wf-tab wf-tab-active">Tab 1</button>
<button class="wf-tab">Tab 2</button>
```

**Production** - Components with state management:
```jsx
<Tabs value={activeTab} onChange={setActiveTab}>
  <Tab value="tab1">Tab 1</Tab>
  <Tab value="tab2">Tab 2</Tab>
</Tabs>
```

### 3. Manual Visibility vs Component Logic

**Wireframe** - Toggle visibility with CSS classes:
```html
<div class="wf-overlay wf-overlay-visible">
  <div class="wf-modal">...</div>
</div>
```

**Production** - Component controls visibility:
```jsx
<Modal open={isOpen} onClose={() => setIsOpen(false)}>
  ...
</Modal>
```

### 4. Inline Styles vs Props

**Wireframe** - Width/height often use inline styles:
```html
<div class="wf-datagrid-cell" style="width: 200px;">...</div>
```

**Production** - Use component props:
```jsx
<DataGridColumn width={200} field="name" />
```

### 5. Simple Animations vs Rich Transitions

**Wireframe** - Basic CSS transitions:
```css
.wf-modal {
  transition: transform 200ms ease;
}
```

**Production** - Rich animation libraries and motion:
```jsx
<Modal
  transitionDuration={200}
  animation="fade-scale"
>
```

### 6. Semantic vs Utility Styling

**Wireframe** - Mix of semantic and utility classes:
```html
<div class="wf-card wf-p-4 wf-gap-3">
```

**Production** - May prefer semantic props or styled-components:
```jsx
<Card padding="md" gap="sm">
```

---

## Migration Tips

### 1. Start with Layout Structure

Begin by converting your page layout:

```html
<!-- Wireframe -->
<div class="wf-page wf-page-with-sidebar">
  <aside class="wf-sidebar">...</aside>
  <main class="wf-main">
    <header class="wf-page-header">...</header>
    <div class="wf-page-content">...</div>
  </main>
</div>
```

```jsx
// Production
<PageLayout>
  <Sidebar>...</Sidebar>
  <Main>
    <PageHeader>...</PageHeader>
    <PageContent>...</PageContent>
  </Main>
</PageLayout>
```

### 2. Convert Components Inside-Out

Start with the innermost components (buttons, inputs) and work outward to containers:

1. Convert text elements to `<Texto>`
2. Convert buttons to `<GraviButton>`
3. Convert inputs to form components
4. Convert cards and containers
5. Convert page-level layout

### 3. Extract Repeated Patterns

If you have repeated structures in your wireframe, create reusable components:

```html
<!-- Wireframe: Repeated metric card pattern -->
<div class="wf-metric-card">
  <div class="wf-metric-header">
    <span class="wf-metric-title">...</span>
  </div>
  <div class="wf-metric-value">...</div>
  <div class="wf-metric-subtitle">...</div>
</div>
```

```jsx
// Production: Create reusable component
function MetricCard({ title, value, trend, trendLabel }) {
  return (
    <Card>
      <Texto variant="label">{title}</Texto>
      <Texto variant="h2">{value}</Texto>
      <Horizontal>
        <TrendIndicator value={trend} />
        <Texto variant="caption">{trendLabel}</Texto>
      </Horizontal>
    </Card>
  );
}
```

### 4. Add Interactivity Incrementally

The wireframe shows static states. Add interactivity step by step:

1. **State management** - Add useState hooks for component states
2. **Event handlers** - Add onClick, onChange, etc.
3. **API integration** - Replace mock data with real data
4. **Form validation** - Add validation logic
5. **Animations** - Add transitions and animations

### 5. Preserve Spacing Decisions

The wireframe spacing should mostly carry over. Map utility classes to equivalent props:

| Wireframe Class | Production Equivalent |
|-----------------|----------------------|
| `.wf-gap-4` | `gap="md"` or `gap={4}` |
| `.wf-p-4` | `padding="md"` or `p={4}` |
| `.wf-mb-4` | `marginBottom="md"` |

### 6. Handle Missing Components

If a wireframe pattern doesn't have a direct production equivalent:

1. Check if it's a composition of simpler components
2. Consider creating a custom component
3. Document the gap for the design system team

### 7. Test Responsive Behavior

Wireframe responsive classes should map to production breakpoints:

```html
<!-- Wireframe -->
<div class="wf-row wf-row-responsive">
```

```jsx
// Production
<Horizontal responsive breakpoint="md">
```

---

## Code Examples

### Example 1: Button Group

**Wireframe:**
```html
<div class="wf-row wf-gap-2">
  <button class="wf-button wf-button-secondary">Cancel</button>
  <button class="wf-button wf-button-primary">Save</button>
</div>
```

**Production:**
```jsx
<Horizontal gap="sm">
  <GraviButton variant="secondary" onClick={onCancel}>Cancel</GraviButton>
  <GraviButton variant="primary" onClick={onSave}>Save</GraviButton>
</Horizontal>
```

### Example 2: Form Field

**Wireframe:**
```html
<div class="wf-field">
  <label class="wf-field-label">
    Email <span class="wf-required">*</span>
  </label>
  <input type="email" class="wf-input" placeholder="you@example.com">
  <span class="wf-field-helper">We'll never share your email.</span>
</div>
```

**Production:**
```jsx
<FormField
  label="Email"
  required
  helperText="We'll never share your email."
>
  <TextInput
    type="email"
    placeholder="you@example.com"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
  />
</FormField>
```

### Example 3: Data Grid Row

**Wireframe:**
```html
<div class="wf-datagrid-row">
  <div class="wf-datagrid-cell wf-datagrid-cell-checkbox">
    <input type="checkbox">
  </div>
  <div class="wf-datagrid-cell">John Doe</div>
  <div class="wf-datagrid-cell">john@example.com</div>
  <div class="wf-datagrid-cell">
    <span class="wf-badge wf-badge-success">Active</span>
  </div>
</div>
```

**Production:**
```jsx
// Using AG Grid or similar
const columnDefs = [
  { field: 'select', headerCheckboxSelection: true, checkboxSelection: true },
  { field: 'name', headerName: 'Name' },
  { field: 'email', headerName: 'Email' },
  {
    field: 'status',
    headerName: 'Status',
    cellRenderer: (params) => (
      <Badge variant={params.value === 'active' ? 'success' : 'default'}>
        {params.value}
      </Badge>
    )
  },
];
```

### Example 4: Modal Dialog

**Wireframe:**
```html
<div class="wf-overlay wf-overlay-visible">
  <div class="wf-overlay-backdrop"></div>
  <div class="wf-modal">
    <div class="wf-modal-header">
      <h2 class="wf-modal-title">Confirm Delete</h2>
      <button class="wf-modal-close">&times;</button>
    </div>
    <div class="wf-modal-body">
      <p>Are you sure you want to delete this item?</p>
    </div>
    <div class="wf-modal-footer">
      <button class="wf-button wf-button-secondary">Cancel</button>
      <button class="wf-button wf-button-danger">Delete</button>
    </div>
  </div>
</div>
```

**Production:**
```jsx
<Modal
  open={isDeleteModalOpen}
  onClose={() => setIsDeleteModalOpen(false)}
  title="Confirm Delete"
>
  <Modal.Body>
    <Texto>Are you sure you want to delete this item?</Texto>
  </Modal.Body>
  <Modal.Footer>
    <GraviButton variant="secondary" onClick={() => setIsDeleteModalOpen(false)}>
      Cancel
    </GraviButton>
    <GraviButton variant="danger" onClick={handleDelete}>
      Delete
    </GraviButton>
  </Modal.Footer>
</Modal>
```

### Example 5: Navigation Sidebar

**Wireframe:**
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
    <a href="#" class="wf-sidebar-item">
      <span class="wf-sidebar-icon">U</span>
      <span class="wf-sidebar-label">Users</span>
    </a>
  </nav>
</aside>
```

**Production:**
```jsx
<Sidebar>
  <Sidebar.Header>
    <Logo />
    <Texto variant="h3">App Name</Texto>
  </Sidebar.Header>
  <Sidebar.Nav>
    <Sidebar.Item
      icon={<HomeIcon />}
      active={currentPath === '/'}
      onClick={() => navigate('/')}
    >
      Home
    </Sidebar.Item>
    <Sidebar.Item
      icon={<UsersIcon />}
      active={currentPath === '/users'}
      onClick={() => navigate('/users')}
    >
      Users
    </Sidebar.Item>
  </Sidebar.Nav>
</Sidebar>
```

---

## Checklist for Migration

Use this checklist when migrating a wireframe page:

- [ ] Convert page layout structure (sidebar, header, content)
- [ ] Replace typography classes with Texto components
- [ ] Convert all buttons to GraviButton
- [ ] Convert form inputs to form components
- [ ] Convert cards and containers
- [ ] Add state management for interactive elements
- [ ] Implement event handlers
- [ ] Connect to real data sources
- [ ] Add form validation
- [ ] Test responsive behavior
- [ ] Add loading states
- [ ] Add error states
- [ ] Test accessibility
- [ ] Review against design specs
