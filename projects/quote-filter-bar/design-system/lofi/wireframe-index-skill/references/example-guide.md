# Example: Price Exceptions — Round 2 Wireframe Guide

This is a condensed excerpt from a real wireframe guide to illustrate the level of detail, rationale, and structure the skill should produce. The full guide was ~500 lines covering 5 wireframe files across a pricing exceptions feature.

---

## Header Block

```markdown
# Price Exceptions — Round 2 Wireframes

**Project:** Pricing Engine — Quote Book Exception Thresholds
**Round:** 2 (post-PM feedback from Reece + Agustin, Feb 26)
**Designer:** Frank Overland
**Date:** February 2026
```

Notice: the round line explains *why* this round exists — who gave the feedback that prompted it.

---

## Overview (excerpt)

> These wireframes represent the Price Exceptions feature as it will appear inside the existing Quote Book page. Every screen is a full-viewport (100vh) interactive HTML prototype that replicates the actual Quote Book layout: group tab bar, grid control bar, AG Grid, and publish footer. All wireframes use the shared Gravitate `wireframe.css` design system.
>
> The screens follow the MVP user flow: **Setup → Load → See → Filter → Drill Down**.

Key things to notice:
- Anchors the wireframes in the real product ("inside the existing Quote Book page")
- Describes the technology ("interactive HTML prototype")
- States the user flow the screens cover

---

## Color Language (excerpt)

> - **Hard exceptions** — Red. Row background `#fef2f2`, dot border `#fca5a5`, text `#991b1b`. Icon: red circle with ✕. These **block publishing**.
> - **Soft exceptions** — Amber/yellow. Row background `#fffbeb`, dot border `#fcd34d`, text `#92400e`. Icon: amber circle with !. These are **recorded but do not block**.

Notice: includes hex values (for dev reference), the icon treatment, AND the behavioral meaning ("block publishing" vs "recorded but do not block").

---

## File Inventory Table (excerpt)

> | File | Screen | Purpose |
> |------|--------|---------|
> | `wireframe.css` | — | Shared Gravitate wireframe design system |
> | `01-quotebook-setup.html` | Exception Setup | First-run configuration wizard |
> | `02-quotebook-exceptions.html` | Exceptions Active + Analytics | Daily-use view with analytics panel |
> | `05-exception-profiles.html` | ~~Exception Profile Management~~ | **Retired** — Redirects to `04?tab=profiles` |

Notice: retired files are documented, not silently removed.

---

## Per-File Documentation (excerpt — Setup screen)

> ### What this screen shows
>
> The first-run experience for configuring exception thresholds on a Quote Book. This is what a user sees before exceptions have been set up, and walks them through the entire setup flow.
>
> ### Initial State (Before Setup)
>
> When the page loads, exceptions are not yet configured. The user sees:
> - The Exceptions toggle is **off**
> - The scoreboard bar is **hidden**
> - Instead of the AG Grid, the main content area shows a **centered empty state**: a large gear icon, the heading "Exception thresholds not configured," explanatory text, and a primary "Set Up Exceptions" button
>
> ### Setup Wizard (Right Drawer)
>
> Clicking either "Set Up Exceptions" button opens a **420px right-side drawer** with a 3-step wizard:
>
> **Step 1 — Choose Profile:**
> - An info callout explains that profiles are preset threshold collections
> - Four selectable profile cards, each with a name, description, and metadata badges:
>   - **Standard Day** (pre-selected, "Recommended" badge, "7 components", "Org default")
>   - **Containment** ("Tight" badge)
>   - **Aggressive Sales** ("Wide" badge)
>   - **Custom** — Start from scratch
> - Cards have hover and selected states (blue border + blue background tint)
>
> **Step 2 — Set Thresholds:**
> - Seven threshold component cards, each containing:
>   - Component name with color-coded dot (Margin=blue, Cost=green...)
>   - Severity toggle — "Soft" and "Hard". Active state lights up in severity color
>   - Floor and Ceiling inputs with dollar values (e.g., $0.0500, $0.1500)
>   - Unit field — Disabled, shows "$/gal"
>   - Threshold bar visualization — horizontal range bar showing safe zone in green
>
> **Step 3 — Apply:**
> - Summary table: Profile (Standard Day), Components (7 of 7 active), Hard exceptions (2: Margin, Cost)
> - Warning callout: "Hard exceptions will block publishing."

Notice: drawer width is specified (420px). Every wizard step is documented with exact content. UI states (pre-selected, disabled, hover) are called out. Nothing is left to inference.

---

## Design Decisions (excerpt)

> 1. **Setup lives inside the Quote Book page** — Not a separate settings screen. The right-side drawer keeps the user in context.
> 2. **Hard vs Soft severity** — Hard blocks publishing, Soft records but doesn't block. Each component can be independently set to either.
> 3. **Snooze workflow** — Acknowledge-and-dismiss for a session. Values are recorded at publish time.
> 4. **Quote Config → Row inheritance** — Defaults set at the config level, copied to new rows, independently overridable.
> 5. **Two-surface profile architecture** — Profile swap (fast, in-the-moment) lives in the daily view's swap drawer; profile management (deliberate, configuration-level) lives in the threshold management page.

Notice: each decision is a clear statement followed by the reasoning. These can be referenced months later by a developer asking "why does it work this way?"

---

## How to View (excerpt)

> Open any `.html` file directly in a browser. Each is self-contained. No build step needed.
>
> Recommended sequence:
> 1. `01-quotebook-setup.html` — Start here. Click "Set Up Exceptions" and walk through the wizard.
> 2. `02-quotebook-exceptions.html` — Daily view. Toggle Analytics. Try filter chips. Click the profile chip for the swap drawer.
> 3. `03-quotebook-drilldown.html` — Click different rows. Explore Thresholds tab (note Save button and org limits) and History.
> 4. `04-threshold-management.html` — Power-user config. Browse both tabs. Try "Create from Current" in Profiles.

Notice: tells the reader what to *do* in each screen, not just what to look at.
