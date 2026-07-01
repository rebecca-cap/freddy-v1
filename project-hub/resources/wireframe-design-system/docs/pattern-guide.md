# Pattern Guide

High-level layout patterns and templates for common application pages using the Gravitate Wireframe Design System.

---

## Table of Contents

1. [Dashboard Layout](#dashboard-layout)
2. [Master-Detail Layout](#master-detail-layout)
3. [Form Wizard](#form-wizard)
4. [Settings Page](#settings-page)
5. [Data Table Page](#data-table-page)
6. [Comparison Matrix](#comparison-matrix)

---

## Dashboard Layout

A summary view with metrics, charts, and quick actions.

### When to Use

- Home page or landing page for applications
- Executive summaries with KPIs and trends
- Overview pages combining multiple data sources
- Quick-glance status monitoring

### Structure Diagram

```
+------------------------------------------------------------------+
| SIDEBAR |                    MAIN CONTENT                         |
|         |+-------------------------------------------------------+|
|  Logo   || PAGE HEADER                               [Actions]   ||
|         |+-------------------------------------------------------+|
| --------|+-------------------------------------------------------+|
| Nav     || METRICS ROW                                           ||
| Item 1  || +------------+ +------------+ +------------+ +------+ ||
| Item 2  || | Metric 1   | | Metric 2   | | Metric 3   | | ...  | ||
| Item 3  || +------------+ +------------+ +------------+ +------+ ||
| ...     |+-------------------------------------------------------+|
|         |+-------------------------------------------------------+|
|         || CONTENT GRID                                          ||
|         || +----------------------+  +----------------------+    ||
|         || | CHART CARD           |  | CHART CARD           |    ||
|         || |                      |  |                      |    ||
|         || +----------------------+  +----------------------+    ||
|         || +----------------------+  +----------------------+    ||
|         || | RECENT ACTIVITY      |  | QUICK ACTIONS        |    ||
|         || |  - Item 1            |  |  [Action A]          |    ||
|         || |  - Item 2            |  |  [Action B]          |    ||
|         || +----------------------+  +----------------------+    ||
+---------+|+-------------------------------------------------------+|
+------------------------------------------------------------------+
```

### Required Components

- `.wf-page` + `.wf-page-with-sidebar`
- `.wf-sidebar` with navigation items
- `.wf-page-header` with title and actions
- `.wf-metric-card` for KPIs
- `.wf-card` for content sections
- `.wf-row` and `.wf-column` for layout

### Example Code

```html
<div class="wf-page wf-page-with-sidebar">
  <!-- Sidebar -->
  <aside class="wf-sidebar">
    <div class="wf-sidebar-header">
      <span class="wf-sidebar-logo">Dashboard</span>
    </div>
    <nav class="wf-sidebar-nav">
      <a href="#" class="wf-sidebar-item wf-sidebar-item-active">
        <span class="wf-sidebar-icon">H</span>
        <span class="wf-sidebar-label">Overview</span>
      </a>
      <a href="#" class="wf-sidebar-item">
        <span class="wf-sidebar-icon">A</span>
        <span class="wf-sidebar-label">Analytics</span>
      </a>
      <a href="#" class="wf-sidebar-item">
        <span class="wf-sidebar-icon">R</span>
        <span class="wf-sidebar-label">Reports</span>
      </a>
    </nav>
  </aside>

  <!-- Main Content -->
  <main class="wf-main">
    <header class="wf-page-header">
      <div class="wf-page-title">
        <h1 class="wf-text-h1">Dashboard</h1>
        <p class="wf-text-helper">Welcome back, User</p>
      </div>
      <div class="wf-page-actions">
        <button class="wf-button wf-button-secondary">Export</button>
        <button class="wf-button wf-button-primary">New Report</button>
      </div>
    </header>

    <div class="wf-page-content">
      <!-- Metrics Row -->
      <div class="wf-row wf-gap-4 wf-mb-6">
        <div class="wf-metric-card wf-flex-1">
          <div class="wf-metric-header">
            <span class="wf-metric-title">Total Revenue</span>
          </div>
          <div class="wf-metric-value">$48,352</div>
          <div class="wf-metric-subtitle">
            <span class="wf-metric-trend wf-metric-trend-up">+12.5%</span>
            vs last month
          </div>
        </div>
        <div class="wf-metric-card wf-flex-1">
          <div class="wf-metric-header">
            <span class="wf-metric-title">Active Users</span>
          </div>
          <div class="wf-metric-value">2,847</div>
          <div class="wf-metric-subtitle">
            <span class="wf-metric-trend wf-metric-trend-up">+8.2%</span>
            vs last month
          </div>
        </div>
        <div class="wf-metric-card wf-flex-1">
          <div class="wf-metric-header">
            <span class="wf-metric-title">Orders</span>
          </div>
          <div class="wf-metric-value">1,294</div>
          <div class="wf-metric-subtitle">
            <span class="wf-metric-trend wf-metric-trend-down">-3.1%</span>
            vs last month
          </div>
        </div>
      </div>

      <!-- Content Grid -->
      <div class="wf-row wf-gap-4">
        <div class="wf-column wf-flex-1 wf-gap-4">
          <div class="wf-card">
            <div class="wf-card-header">
              <h3 class="wf-card-title">Revenue Trend</h3>
            </div>
            <div class="wf-card-body">
              <div class="wf-placeholder" style="height: 200px">Chart Placeholder</div>
            </div>
          </div>
          <div class="wf-card">
            <div class="wf-card-header">
              <h3 class="wf-card-title">Recent Activity</h3>
            </div>
            <div class="wf-card-body">
              <ul class="wf-list">
                <li class="wf-list-item">
                  <div class="wf-list-item-content">
                    <div class="wf-list-item-title">New order #1234</div>
                    <div class="wf-list-item-description">2 minutes ago</div>
                  </div>
                </li>
                <li class="wf-list-item">
                  <div class="wf-list-item-content">
                    <div class="wf-list-item-title">User registered</div>
                    <div class="wf-list-item-description">15 minutes ago</div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="wf-column wf-w-1\/3 wf-gap-4">
          <div class="wf-card">
            <div class="wf-card-header">
              <h3 class="wf-card-title">Quick Actions</h3>
            </div>
            <div class="wf-card-body wf-column wf-gap-2">
              <button class="wf-button wf-button-secondary wf-w-full">Create Invoice</button>
              <button class="wf-button wf-button-secondary wf-w-full">Add Customer</button>
              <button class="wf-button wf-button-secondary wf-w-full">Generate Report</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</div>
```

---

## Master-Detail Layout

List view with detail panel for selected items.

### When to Use

- Email/message interfaces
- File browsers and document managers
- Contact/customer management
- Any list where items need detailed viewing

### Structure Diagram

```
+------------------------------------------------------------------+
| SIDEBAR |                    MAIN CONTENT                         |
|         |+-------------------------------------------------------+|
|  Logo   || PAGE HEADER                               [Actions]   ||
|         |+-------------------------------------------------------+|
| --------|+------------------------++-----------------------------+|
| Nav     || MASTER LIST           || DETAIL PANEL                ||
| Items   || +------------------+  ||                             ||
|         || | Item 1 (active)  |  || Item Title                  ||
|         || +------------------+  || Subtitle / Meta             ||
|         || | Item 2           |  || --------------------------- ||
|         || +------------------+  || Content Area                ||
|         || | Item 3           |  ||                             ||
|         || +------------------+  || Field 1: Value              ||
|         || | Item 4           |  || Field 2: Value              ||
|         || +------------------+  || Field 3: Value              ||
|         || | ...              |  ||                             ||
|         || +------------------+  || [Edit] [Delete]             ||
+---------+|+------------------------++-----------------------------+|
+------------------------------------------------------------------+
```

### Required Components

- `.wf-page` + `.wf-page-with-sidebar`
- `.wf-sidebar` for navigation
- `.wf-page-header` with search/filter actions
- `.wf-list` for master list
- `.wf-card` for detail panel
- `.wf-description-list` for detail fields

### Example Code

```html
<div class="wf-page wf-page-with-sidebar">
  <!-- Sidebar navigation (same as dashboard) -->
  <aside class="wf-sidebar">
    <!-- ... sidebar content ... -->
  </aside>

  <main class="wf-main">
    <header class="wf-page-header">
      <div class="wf-page-title">
        <h1 class="wf-text-h1">Contacts</h1>
        <p class="wf-text-helper">248 total contacts</p>
      </div>
      <div class="wf-page-actions">
        <input type="search" class="wf-input" placeholder="Search contacts..." style="width: 250px;">
        <button class="wf-button wf-button-primary">Add Contact</button>
      </div>
    </header>

    <div class="wf-page-content wf-page-content-none">
      <div class="wf-row wf-h-full">
        <!-- Master List -->
        <div class="wf-column wf-w-1\/3" style="border-right: 1px solid var(--wf-color-border);">
          <ul class="wf-list" style="border: none; border-radius: 0;">
            <li class="wf-list-item wf-list-item-clickable wf-list-item-selected">
              <div class="wf-avatar wf-avatar-sm">
                <span class="wf-avatar-initials">JD</span>
              </div>
              <div class="wf-list-item-content">
                <div class="wf-list-item-title">John Doe</div>
                <div class="wf-list-item-description">john@example.com</div>
              </div>
              <span class="wf-badge wf-badge-success wf-badge-sm">Active</span>
            </li>
            <li class="wf-list-item wf-list-item-clickable">
              <div class="wf-avatar wf-avatar-sm">
                <span class="wf-avatar-initials">JS</span>
              </div>
              <div class="wf-list-item-content">
                <div class="wf-list-item-title">Jane Smith</div>
                <div class="wf-list-item-description">jane@example.com</div>
              </div>
            </li>
            <!-- More list items... -->
          </ul>
        </div>

        <!-- Detail Panel -->
        <div class="wf-column wf-flex-1 wf-p-6">
          <div class="wf-row wf-gap-4 wf-mb-6">
            <div class="wf-avatar wf-avatar-xl">
              <span class="wf-avatar-initials">JD</span>
            </div>
            <div class="wf-column wf-gap-1">
              <h2 class="wf-text-h2">John Doe</h2>
              <p class="wf-text-helper">Customer since January 2023</p>
              <span class="wf-badge wf-badge-success">Active</span>
            </div>
            <div class="wf-row wf-gap-2 wf-ml-auto">
              <button class="wf-button wf-button-secondary">Edit</button>
              <button class="wf-button wf-button-danger">Delete</button>
            </div>
          </div>

          <hr class="wf-divider">

          <div class="wf-description-list wf-description-list-horizontal wf-mt-4">
            <div class="wf-description-list-item">
              <dt class="wf-description-list-term">Email</dt>
              <dd class="wf-description-list-detail">john@example.com</dd>
            </div>
            <div class="wf-description-list-item">
              <dt class="wf-description-list-term">Phone</dt>
              <dd class="wf-description-list-detail">+1 (555) 123-4567</dd>
            </div>
            <div class="wf-description-list-item">
              <dt class="wf-description-list-term">Company</dt>
              <dd class="wf-description-list-detail">Acme Corporation</dd>
            </div>
            <div class="wf-description-list-item">
              <dt class="wf-description-list-term">Location</dt>
              <dd class="wf-description-list-detail">New York, NY</dd>
            </div>
          </div>

          <h3 class="wf-text-h3 wf-mt-6 wf-mb-3">Recent Orders</h3>
          <div class="wf-datagrid wf-datagrid-compact">
            <!-- DataGrid content -->
          </div>
        </div>
      </div>
    </div>
  </main>
</div>
```

---

## Form Wizard

Multi-step form with progress indication.

### When to Use

- Complex data entry workflows
- Onboarding flows
- Checkout processes
- Any form that benefits from progressive disclosure

### Structure Diagram

```
+------------------------------------------------------------------+
|                         WIZARD MODAL                              |
|  +--------------------------------------------------------------+ |
|  | STEPPER                                                      | |
|  | [1. Account] ---- [2. Details] ---- [3. Review] --- [4. Done]| |
|  +--------------------------------------------------------------+ |
|  +--------------------------------------------------------------+ |
|  | STEP TITLE                                                   | |
|  | Step description                                             | |
|  +--------------------------------------------------------------+ |
|  +--------------------------------------------------------------+ |
|  | FORM CONTENT                                                 | |
|  |                                                              | |
|  | +------------------+  +------------------+                   | |
|  | | Field 1          |  | Field 2          |                   | |
|  | +------------------+  +------------------+                   | |
|  | +------------------+  +------------------+                   | |
|  | | Field 3          |  | Field 4          |                   | |
|  | +------------------+  +------------------+                   | |
|  |                                                              | |
|  +--------------------------------------------------------------+ |
|  +--------------------------------------------------------------+ |
|  | FOOTER                          [Back]    [Cancel]   [Next] | |
|  +--------------------------------------------------------------+ |
+------------------------------------------------------------------+
```

### Required Components

- `.wf-modal` or `.wf-drawer` as container
- `.wf-stepper` for progress indication
- `.wf-field` for form fields
- `.wf-button` for navigation
- `.wf-row` and `.wf-column` for form layout

### Example Code

```html
<div class="wf-overlay wf-overlay-visible">
  <div class="wf-overlay-backdrop"></div>
  <div class="wf-modal wf-modal-lg">
    <!-- Stepper in Header -->
    <div class="wf-modal-header" style="flex-direction: column; align-items: stretch; gap: 16px;">
      <div class="wf-row wf-justify-between wf-items-center">
        <h2 class="wf-modal-title">Create Account</h2>
        <button class="wf-modal-close">&times;</button>
      </div>
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
          <div class="wf-step-label">Review</div>
        </div>
        <div class="wf-step-connector"></div>
        <div class="wf-step">
          <div class="wf-step-indicator">4</div>
          <div class="wf-step-label">Complete</div>
        </div>
      </div>
    </div>

    <!-- Step Content -->
    <div class="wf-modal-body">
      <h3 class="wf-text-h3 wf-mb-2">Personal Details</h3>
      <p class="wf-text-helper wf-mb-4">Tell us a bit more about yourself.</p>

      <div class="wf-row wf-gap-4">
        <div class="wf-field wf-flex-1">
          <label class="wf-field-label">First Name <span class="wf-required">*</span></label>
          <input type="text" class="wf-input" placeholder="John">
        </div>
        <div class="wf-field wf-flex-1">
          <label class="wf-field-label">Last Name <span class="wf-required">*</span></label>
          <input type="text" class="wf-input" placeholder="Doe">
        </div>
      </div>

      <div class="wf-field">
        <label class="wf-field-label">Company</label>
        <input type="text" class="wf-input" placeholder="Your company name">
        <span class="wf-field-helper">Optional</span>
      </div>

      <div class="wf-field">
        <label class="wf-field-label">Role</label>
        <select class="wf-select">
          <option value="">Select your role</option>
          <option value="developer">Developer</option>
          <option value="designer">Designer</option>
          <option value="manager">Manager</option>
          <option value="other">Other</option>
        </select>
      </div>
    </div>

    <!-- Navigation Footer -->
    <div class="wf-modal-footer">
      <button class="wf-button wf-button-ghost wf-mr-auto">Cancel</button>
      <button class="wf-button wf-button-secondary">Back</button>
      <button class="wf-button wf-button-primary">Continue</button>
    </div>
  </div>
</div>
```

---

## Settings Page

Settings/preferences page with categorized options.

### When to Use

- Application configuration
- User profile settings
- Account management
- Feature preferences

### Structure Diagram

```
+------------------------------------------------------------------+
| SIDEBAR |                    MAIN CONTENT                         |
|         |+-------------------------------------------------------+|
|  Logo   || PAGE HEADER                               [Save]      ||
|         |+-------------------------------------------------------+|
| --------|+------------------------++-----------------------------+|
| Nav     || SETTINGS NAV          || SETTINGS CONTENT            ||
|         || +------------------+  ||                             ||
|         || | General (active) |  || Section Title               ||
|         || +------------------+  || Description text            ||
|         || | Notifications    |  || +-----------------------+   ||
|         || +------------------+  || | Setting 1    [Toggle] |   ||
|         || | Security         |  || +-----------------------+   ||
|         || +------------------+  || | Setting 2    [Select] |   ||
|         || | Billing          |  || +-----------------------+   ||
|         || +------------------+  ||                             ||
|         ||                       || Another Section             ||
|         ||                       || +-----------------------+   ||
|         ||                       || | Setting 3    [Input]  |   ||
|         ||                       || +-----------------------+   ||
+---------+|+------------------------++-----------------------------+|
+------------------------------------------------------------------+
```

### Required Components

- `.wf-page` + `.wf-page-with-sidebar`
- `.wf-tabs` (vertical) for settings categories
- `.wf-card` for settings sections
- `.wf-toggle`, `.wf-select`, `.wf-input` for settings
- `.wf-row` with `.wf-justify-between` for setting rows

### Example Code

```html
<div class="wf-page wf-page-with-sidebar">
  <aside class="wf-sidebar">
    <!-- Main navigation sidebar -->
  </aside>

  <main class="wf-main">
    <header class="wf-page-header">
      <div class="wf-page-title">
        <h1 class="wf-text-h1">Settings</h1>
        <p class="wf-text-helper">Manage your account settings and preferences</p>
      </div>
      <div class="wf-page-actions">
        <button class="wf-button wf-button-primary">Save Changes</button>
      </div>
    </header>

    <div class="wf-page-content wf-page-content-none">
      <div class="wf-tabs wf-tabs-vertical">
        <!-- Settings Navigation -->
        <div class="wf-tabs-list" style="min-width: 200px;">
          <button class="wf-tab wf-tab-active">General</button>
          <button class="wf-tab">Notifications</button>
          <button class="wf-tab">Security</button>
          <button class="wf-tab">Billing</button>
          <button class="wf-tab">Integrations</button>
        </div>

        <!-- Settings Content -->
        <div class="wf-tabs-content wf-flex-1">
          <div class="wf-column wf-gap-6">
            <!-- Profile Section -->
            <div class="wf-card">
              <div class="wf-card-header">
                <div>
                  <h3 class="wf-card-title">Profile Information</h3>
                  <p class="wf-card-subtitle">Update your personal details</p>
                </div>
              </div>
              <div class="wf-card-body">
                <div class="wf-row wf-gap-4 wf-mb-4">
                  <div class="wf-field wf-flex-1 wf-mb-0">
                    <label class="wf-field-label">Display Name</label>
                    <input type="text" class="wf-input" value="John Doe">
                  </div>
                  <div class="wf-field wf-flex-1 wf-mb-0">
                    <label class="wf-field-label">Email</label>
                    <input type="email" class="wf-input" value="john@example.com">
                  </div>
                </div>
                <div class="wf-field wf-mb-0">
                  <label class="wf-field-label">Bio</label>
                  <textarea class="wf-input" rows="3" placeholder="Tell us about yourself..."></textarea>
                </div>
              </div>
            </div>

            <!-- Preferences Section -->
            <div class="wf-card">
              <div class="wf-card-header">
                <div>
                  <h3 class="wf-card-title">Preferences</h3>
                  <p class="wf-card-subtitle">Customize your experience</p>
                </div>
              </div>
              <div class="wf-card-body wf-column wf-gap-4">
                <div class="wf-row wf-justify-between wf-items-center">
                  <div>
                    <p class="wf-text-body wf-text-semibold">Dark Mode</p>
                    <p class="wf-text-helper">Use dark theme across the application</p>
                  </div>
                  <label class="wf-toggle">
                    <input type="checkbox" class="wf-toggle-input">
                    <span class="wf-toggle-track"></span>
                  </label>
                </div>
                <hr class="wf-divider wf-my-0">
                <div class="wf-row wf-justify-between wf-items-center">
                  <div>
                    <p class="wf-text-body wf-text-semibold">Language</p>
                    <p class="wf-text-helper">Select your preferred language</p>
                  </div>
                  <select class="wf-select" style="width: 200px;">
                    <option>English (US)</option>
                    <option>Spanish</option>
                    <option>French</option>
                  </select>
                </div>
                <hr class="wf-divider wf-my-0">
                <div class="wf-row wf-justify-between wf-items-center">
                  <div>
                    <p class="wf-text-body wf-text-semibold">Timezone</p>
                    <p class="wf-text-helper">Set your local timezone</p>
                  </div>
                  <select class="wf-select" style="width: 200px;">
                    <option>Pacific Time (PT)</option>
                    <option>Mountain Time (MT)</option>
                    <option>Eastern Time (ET)</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Danger Zone -->
            <div class="wf-card" style="border-color: var(--wf-color-error);">
              <div class="wf-card-header">
                <div>
                  <h3 class="wf-card-title wf-text-error">Danger Zone</h3>
                  <p class="wf-card-subtitle">Irreversible actions</p>
                </div>
              </div>
              <div class="wf-card-body">
                <div class="wf-row wf-justify-between wf-items-center">
                  <div>
                    <p class="wf-text-body wf-text-semibold">Delete Account</p>
                    <p class="wf-text-helper">Permanently delete your account and all data</p>
                  </div>
                  <button class="wf-button wf-button-danger">Delete Account</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</div>
```

---

## Data Table Page

Full-featured data table with filters and actions.

### When to Use

- CRUD interfaces (Create, Read, Update, Delete)
- Admin panels with data management
- Report views with tabular data
- Any searchable, filterable list

### Structure Diagram

```
+------------------------------------------------------------------+
| SIDEBAR |                    MAIN CONTENT                         |
|         |+-------------------------------------------------------+|
|  Logo   || PAGE HEADER                         [Export] [Create] ||
|         |+-------------------------------------------------------+|
| --------|+-------------------------------------------------------+|
| Nav     || FILTER BAR                                            ||
|         || [Search...]  [Status v]  [Date v]  [Clear Filters]    ||
|         |+-------------------------------------------------------+|
|         |+-------------------------------------------------------+|
|         || DATA GRID                                             ||
|         || +-----------------------------------------------------+||
|         || | [ ] | Name     | Email        | Status   | Actions  |||
|         || +-----------------------------------------------------+||
|         || | [ ] | John Doe | john@...     | Active   | [...] |||
|         || | [ ] | Jane S.  | jane@...     | Pending  | [...] |||
|         || | [ ] | Bob M.   | bob@...      | Inactive | [...] |||
|         || +-----------------------------------------------------+||
|         || | Showing 1-10 of 248       [<] [1] [2] [3] ... [>]  |||
|         |+-------------------------------------------------------+|
+---------++--------------------------------------------------------+
+------------------------------------------------------------------+
```

### Required Components

- `.wf-page` + `.wf-page-with-sidebar`
- `.wf-input` for search
- `.wf-select` for filters
- `.wf-datagrid` for data display
- `.wf-badge` for status indicators
- `.wf-menu` for row actions

### Example Code

```html
<div class="wf-page wf-page-with-sidebar">
  <aside class="wf-sidebar">
    <!-- Navigation sidebar -->
  </aside>

  <main class="wf-main">
    <header class="wf-page-header">
      <div class="wf-page-title">
        <h1 class="wf-text-h1">Users</h1>
        <p class="wf-text-helper">Manage user accounts</p>
      </div>
      <div class="wf-page-actions">
        <button class="wf-button wf-button-secondary">Export</button>
        <button class="wf-button wf-button-primary">Add User</button>
      </div>
    </header>

    <div class="wf-page-content">
      <!-- Filter Bar -->
      <div class="wf-card wf-mb-4">
        <div class="wf-card-body">
          <div class="wf-row wf-gap-4 wf-items-end">
            <div class="wf-field wf-flex-1 wf-mb-0">
              <label class="wf-field-label">Search</label>
              <input type="search" class="wf-input" placeholder="Search users...">
            </div>
            <div class="wf-field wf-mb-0" style="width: 150px;">
              <label class="wf-field-label">Status</label>
              <select class="wf-select">
                <option value="">All</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div class="wf-field wf-mb-0" style="width: 150px;">
              <label class="wf-field-label">Role</label>
              <select class="wf-select">
                <option value="">All Roles</option>
                <option value="admin">Admin</option>
                <option value="editor">Editor</option>
                <option value="viewer">Viewer</option>
              </select>
            </div>
            <button class="wf-button wf-button-ghost">Clear Filters</button>
          </div>
        </div>
      </div>

      <!-- Data Grid -->
      <div class="wf-datagrid">
        <div class="wf-datagrid-header">
          <div class="wf-datagrid-cell wf-datagrid-cell-checkbox">
            <input type="checkbox">
          </div>
          <div class="wf-datagrid-cell wf-datagrid-cell-sortable">Name</div>
          <div class="wf-datagrid-cell wf-datagrid-cell-sortable">Email</div>
          <div class="wf-datagrid-cell">Role</div>
          <div class="wf-datagrid-cell">Status</div>
          <div class="wf-datagrid-cell">Last Active</div>
          <div class="wf-datagrid-cell wf-datagrid-cell-actions">Actions</div>
        </div>
        <div class="wf-datagrid-body">
          <div class="wf-datagrid-row">
            <div class="wf-datagrid-cell wf-datagrid-cell-checkbox">
              <input type="checkbox">
            </div>
            <div class="wf-datagrid-cell">
              <div class="wf-row wf-gap-2 wf-items-center">
                <div class="wf-avatar wf-avatar-sm">
                  <span class="wf-avatar-initials">JD</span>
                </div>
                John Doe
              </div>
            </div>
            <div class="wf-datagrid-cell">john@example.com</div>
            <div class="wf-datagrid-cell">Admin</div>
            <div class="wf-datagrid-cell">
              <span class="wf-badge wf-badge-success">Active</span>
            </div>
            <div class="wf-datagrid-cell">2 hours ago</div>
            <div class="wf-datagrid-cell wf-datagrid-cell-actions">
              <button class="wf-button wf-button-ghost wf-button-sm">Edit</button>
              <button class="wf-button wf-button-ghost wf-button-sm">Delete</button>
            </div>
          </div>
          <!-- More rows... -->
        </div>
        <div class="wf-datagrid-pagination">
          <span class="wf-datagrid-pagination-info">Showing 1-10 of 248 users</span>
          <div class="wf-datagrid-pagination-controls">
            <button class="wf-datagrid-pagination-btn" disabled>Prev</button>
            <button class="wf-datagrid-pagination-btn wf-datagrid-pagination-btn-active">1</button>
            <button class="wf-datagrid-pagination-btn">2</button>
            <button class="wf-datagrid-pagination-btn">3</button>
            <span class="wf-pagination-ellipsis">...</span>
            <button class="wf-datagrid-pagination-btn">25</button>
            <button class="wf-datagrid-pagination-btn">Next</button>
          </div>
        </div>
      </div>
    </div>
  </main>
</div>
```

---

## Comparison Matrix

Side-by-side comparison of items or plans.

### When to Use

- Pricing/plan comparison
- Feature comparison tables
- Product comparisons
- Any side-by-side evaluation

### Structure Diagram

```
+------------------------------------------------------------------+
|                       COMPARISON PAGE                             |
+------------------------------------------------------------------+
| PAGE HEADER                                                       |
| Title and description                                             |
+------------------------------------------------------------------+
| COMPARISON GRID                                                   |
| +------------+------------+------------+------------+             |
| | Feature    | Plan A     | Plan B     | Plan C     |             |
| +------------+------------+------------+------------+             |
| | Price      | $10/mo     | $25/mo     | $50/mo     |             |
| | Users      | 1          | 5          | Unlimited  |             |
| | Storage    | 5 GB       | 25 GB      | 100 GB     |             |
| | Support    | Email      | Priority   | Dedicated  |             |
| | Analytics  | -          | Basic      | Advanced   |             |
| | API Access | -          | -          | Check      |             |
| +------------+------------+------------+------------+             |
| | Actions    | [Select]   | [Select]   | [Select]   |             |
| +------------+------------+------------+------------+             |
+------------------------------------------------------------------+
```

### Required Components

- `.wf-page` with centered layout
- `.wf-container` for content width
- Custom table or grid layout
- `.wf-card` for each plan column
- `.wf-badge` for highlighting
- `.wf-button` for actions

### Example Code

```html
<div class="wf-page">
  <main class="wf-main">
    <header class="wf-page-header wf-text-center" style="justify-content: center;">
      <div class="wf-page-title" style="text-align: center;">
        <h1 class="wf-text-h1">Choose Your Plan</h1>
        <p class="wf-text-helper">Select the plan that best fits your needs</p>
      </div>
    </header>

    <div class="wf-page-content">
      <div class="wf-container wf-container-xl">
        <!-- Toggle for billing period -->
        <div class="wf-row wf-justify-center wf-mb-8">
          <div class="wf-tabs wf-tabs-pill">
            <div class="wf-tabs-list">
              <button class="wf-tab wf-tab-active">Monthly</button>
              <button class="wf-tab">Yearly (Save 20%)</button>
            </div>
          </div>
        </div>

        <!-- Comparison Cards -->
        <div class="wf-row wf-gap-4 wf-items-stretch">
          <!-- Basic Plan -->
          <div class="wf-card wf-flex-1">
            <div class="wf-card-body wf-text-center wf-p-6">
              <h3 class="wf-text-h3 wf-mb-2">Basic</h3>
              <p class="wf-text-helper wf-mb-4">For individuals</p>
              <div class="wf-mb-4">
                <span class="wf-text-2xl wf-text-bold">$10</span>
                <span class="wf-text-helper">/month</span>
              </div>
              <button class="wf-button wf-button-secondary wf-w-full wf-mb-4">Select Plan</button>
              <hr class="wf-divider">
              <ul class="wf-column wf-gap-3 wf-text-left wf-mt-4">
                <li class="wf-row wf-gap-2 wf-items-center">
                  <span class="wf-text-success">check</span>
                  <span>1 User</span>
                </li>
                <li class="wf-row wf-gap-2 wf-items-center">
                  <span class="wf-text-success">check</span>
                  <span>5 GB Storage</span>
                </li>
                <li class="wf-row wf-gap-2 wf-items-center">
                  <span class="wf-text-success">check</span>
                  <span>Email Support</span>
                </li>
                <li class="wf-row wf-gap-2 wf-items-center wf-text-secondary">
                  <span>-</span>
                  <span>Analytics</span>
                </li>
                <li class="wf-row wf-gap-2 wf-items-center wf-text-secondary">
                  <span>-</span>
                  <span>API Access</span>
                </li>
              </ul>
            </div>
          </div>

          <!-- Pro Plan (Featured) -->
          <div class="wf-card wf-flex-1" style="border: 2px solid var(--wf-color-primary);">
            <div class="wf-card-body wf-text-center wf-p-6">
              <span class="wf-badge wf-badge-primary wf-mb-2">Most Popular</span>
              <h3 class="wf-text-h3 wf-mb-2">Pro</h3>
              <p class="wf-text-helper wf-mb-4">For small teams</p>
              <div class="wf-mb-4">
                <span class="wf-text-2xl wf-text-bold">$25</span>
                <span class="wf-text-helper">/month</span>
              </div>
              <button class="wf-button wf-button-primary wf-w-full wf-mb-4">Select Plan</button>
              <hr class="wf-divider">
              <ul class="wf-column wf-gap-3 wf-text-left wf-mt-4">
                <li class="wf-row wf-gap-2 wf-items-center">
                  <span class="wf-text-success">check</span>
                  <span>5 Users</span>
                </li>
                <li class="wf-row wf-gap-2 wf-items-center">
                  <span class="wf-text-success">check</span>
                  <span>25 GB Storage</span>
                </li>
                <li class="wf-row wf-gap-2 wf-items-center">
                  <span class="wf-text-success">check</span>
                  <span>Priority Support</span>
                </li>
                <li class="wf-row wf-gap-2 wf-items-center">
                  <span class="wf-text-success">check</span>
                  <span>Basic Analytics</span>
                </li>
                <li class="wf-row wf-gap-2 wf-items-center wf-text-secondary">
                  <span>-</span>
                  <span>API Access</span>
                </li>
              </ul>
            </div>
          </div>

          <!-- Enterprise Plan -->
          <div class="wf-card wf-flex-1">
            <div class="wf-card-body wf-text-center wf-p-6">
              <h3 class="wf-text-h3 wf-mb-2">Enterprise</h3>
              <p class="wf-text-helper wf-mb-4">For large organizations</p>
              <div class="wf-mb-4">
                <span class="wf-text-2xl wf-text-bold">$50</span>
                <span class="wf-text-helper">/month</span>
              </div>
              <button class="wf-button wf-button-secondary wf-w-full wf-mb-4">Contact Sales</button>
              <hr class="wf-divider">
              <ul class="wf-column wf-gap-3 wf-text-left wf-mt-4">
                <li class="wf-row wf-gap-2 wf-items-center">
                  <span class="wf-text-success">check</span>
                  <span>Unlimited Users</span>
                </li>
                <li class="wf-row wf-gap-2 wf-items-center">
                  <span class="wf-text-success">check</span>
                  <span>100 GB Storage</span>
                </li>
                <li class="wf-row wf-gap-2 wf-items-center">
                  <span class="wf-text-success">check</span>
                  <span>Dedicated Support</span>
                </li>
                <li class="wf-row wf-gap-2 wf-items-center">
                  <span class="wf-text-success">check</span>
                  <span>Advanced Analytics</span>
                </li>
                <li class="wf-row wf-gap-2 wf-items-center">
                  <span class="wf-text-success">check</span>
                  <span>Full API Access</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</div>
```

---

## Tips for Using Patterns

1. **Combine Patterns**: Many real applications use combinations of these patterns. A settings page might include a master-detail pattern for managing items within settings.

2. **Responsive Considerations**: Use `.wf-row-responsive` to stack content on mobile, and `.wf-hide-mobile` / `.wf-hide-desktop` classes to show/hide content based on viewport.

3. **Customize Spacing**: The patterns use default spacing, but adjust using gap and padding utilities like `.wf-gap-6`, `.wf-p-4` based on content density.

4. **State Management**: For wizards and interactive patterns, you'll need JavaScript to handle state changes. The CSS provides visual states (active, completed, etc.) that you toggle via classes.

5. **Empty States**: When lists or grids have no data, use `.wf-empty-state` components to provide helpful messaging and actions.
