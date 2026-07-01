# Scout — Behavioral Specification (agnostic source for the handoff doc)

> This is the **design-intent** record of Scout, an AI pricing co-pilot. It describes
> *what the product does and how it behaves* — surfaces, states, transitions, copy, and
> motion — so a developer can rebuild it in any stack. It deliberately avoids naming the
> prototype's code, files, frameworks, or internal data structures. Where a number is
> given (timings, sizes), it is the intended behavior, not an implementation mandate.

---

## 0. What Scout is

Scout is an **embedded AI co-pilot** that lives inside a pricing **Quote Book** — a dense
data grid where an analyst sets and publishes fuel prices per customer/location/product.
Scout answers questions about the rows on screen: *why is this flagged, where am I leaving
margin, how did the market move, where does this price rank vs a benchmark.* It explains
its reasoning, cites sources, states its confidence, and lets the analyst **save reusable
questions and multi-step "paths,"** **share them with teammates,** and run questions in the
**background across many rows at once**, surfacing a quiet alert when each answer is ready.

**The mental model, in one line:** *Ask in plain language → get an explainable, scoped
answer → save it for reuse → let Scout work in the background and tell you when it's done.*

**Design tone:** calm, trustworthy, "a thinking machine." Brand color is a deep violet
(**#715DAA**). Type is Lato. Motion is present but restrained — a slow shimmer while
thinking, gentle slides between views, never bouncy.

---

## 1. Overview & entry points

Scout is reachable four ways:

1. **Trigger button** in the Quote Book toolbar — labelled **"Ask Scout"** with a small
   8-bit mascot head. Clicking it opens the panel. On first visit a one-time **intro
   bubble** points at it: *"Hi, I'm Scout 👋 — Your pricing co-pilot. Ask about any row —
   costs, margins, deltas. Click to start, or press ⌘G."*
2. **Keyboard shortcut ⌘G / Ctrl+G** — opens the panel from anywhere (open-only; it does
   not toggle closed). Ignored while typing in another input.
3. **Per-row ready indicator** — a small three-dot marker in a pinned grid column that
   lights up when a background answer for that row is ready; clicking it jumps straight
   into that row's conversation.
4. **Cross-page alert** — when Scout finishes thinking while the analyst is on another
   page, a name-tag ("Scout is ready") and alert cards in the app's Control Panel invite
   them back.

---

## 2. Information architecture

- **One panel, two tabs:** **Chats** and **Library**. (An "Activity"/inbox concept is folded
  into Chats — the Chats tab *is* the list of conversations.)
- **Chats** is list-first: it shows every conversation ("chat"), and clicking one slides
  into that conversation. A back affordance ("‹ All Chats") returns to the list.
- **Library** holds saved **Prompts** (one reusable question) and **Paths** (an ordered
  sequence of questions), with search, a "starred only" filter, and an ownership filter
  (All / Yours / Shared with you).
- **Scoping** is the cross-cutting concept: what the analyst clicks in the grid becomes the
  conversation's **context** (a row, a cell, or a multi-cell selection), and Scout answers
  *about that scope*. With no context, Scout answers about the whole view.
- **Panel modes:** the panel can **float** (a draggable, resizable card docked top-right)
  or **dock as a sidebar** (full height, pushing the grid left). A control toggles modes.

---

## 3. Panel anatomy & layout

Top to bottom, the panel is:

1. **Title row** — mascot mark + **"Scout"** wordmark on the left; a control cluster on the
   right: **Save-as-path**, **Clear**, **Mode** (float/dock), **Minimize**, **Close**.
   Save-as-path and Clear are disabled (greyed) when there's nothing to act on. The title
   row is the **drag handle** in floating mode.
2. **View nav** — the **Chats / Library** tab strip. The Chats tab carries an **unseen
   count badge** when background answers are ready. Inside a conversation, a **"‹ All
   Chats" back** control replaces the tabs.
3. **Context chips bar** (Chats only) — shows the current scope as removable pills, or the
   empty hint **"Nothing in focus · click a cell"** plus a **"+ Add a cell"** affordance.
4. **Body** — the active view: welcome, conversation, chats list, or library. The body
   **slides** left/right when switching views (push/pop direction matches nav direction).
5. **Composer footer** (Chats only) — a growing multi-line input, placeholder **"Ask Scout
   about your quote book…"**, a **Send** button, and an **Undo** affordance (circular, to
   the left) that reverses the last turn.

**Geometry & behavior:**
- Floating panel sits top-right with a margin; **auto-fits its content height**, growing
  until a cap (~80% of viewport height) then the body scrolls.
- A **resize grip** at the bottom-right adjusts **height only** (never width); cursor is a
  vertical-resize. Width is fixed in floating mode.
- **Drag** by the title row repositions the floating panel; position persists across
  minimize, resets on discard.
- An animated **shimmer border** rings the panel (see §9).
- Surfaces that render **outside** the panel: the trigger, intro bubble, minimized
  mini-bubble, grid cell highlighting, per-row ready dots, the cross-page name tag, the
  Control-Panel alert cards, toasts, and the bottom prototype-timer bar.

---

## 4. Conversation lifecycle

**A turn has three phases: ask → thinking → answered.**

- **Ask:** the analyst clicks a suggestion chip, types a question, or runs a saved
  prompt/path. A right-aligned **user bubble** appears with their question.
- **Thinking:** a left-aligned **Scout bubble** appears showing **live thinking steps**
  (e.g. *"Reading flagged rows → Clustering causes → Checking policy bands"*). Steps reveal
  progressively; a subtle shimmer plays. When done, steps **auto-collapse** into a "Show
  details" disclosure.
- **Answered:** the bubble fills in, top to bottom:
  - **Row/scope tag** — an "All rows / This row" indicator of what the answer covers.
  - **Confidence line** — a colored dot + label: **High** (green), **Medium** (amber),
    **Low** (red), often with a short caveat (e.g. *"Medium confidence · Cluster counts are
    estimated"*).
  - **Answer body** — supports several block types: **paragraph**, **bullet list**,
    **table**, a labeled **breakdown** (e.g. *"FLAGS BY CLUSTER — Margin guard 11, Above
    peer band 8, Stale benchmark 4, Total flagged 23"*), and a **CSV-link** block for
    exports.
  - **Action chips** — scenario-specific next steps (e.g. *"Open 11 margin-guard rows,"
    "Open 8 over-band rows"*).
  - **Details disclosure** — *"› Show details · N steps · M sources"*; expands to the
    thinking steps and the cited sources (each source is a clickable pill).
  - **Answer footer** — 👍/👎 feedback and a **⋯ overflow** menu (copy, export, save, etc.).
  - **Follow-up chips** — under the heading **"TRY A FOLLOW-UP,"** suggested next questions
    (e.g. *"Where am I leaving margin?"*).

**Feedback flow:** 👎 opens an inline **feedback form** (reason picker — *wrong data /
misread / made up* — plus an optional note); submitting swaps it for a **receipt** ("Thanks
— this helps Scout improve").

**Clearing & undo:** **Clear** archives the current conversation and empties the surface;
an **Undo** affordance restores it. Starting a fresh question after a clear retires the undo
buffer.

---

## 5. Threading & background work

Scout is **multi-threaded**: each row (or the whole-view "stream") can hold its own
conversation that progresses **in the background**.

- **Thread states:** **in-progress** (thinking), **ready** (answer waiting, unseen),
  **viewed** (opened/seen). A small **unseen count** aggregates ready threads.
- **Simulated think time:** in the prototype a question takes a fixed **~20 seconds** to go
  from *in-progress* to *ready* (a stand-in for real model latency). One global clock drives
  every surface, so countdowns and status flips stay in lockstep across pages.
- **Ready alert surfaces** (all update together when a thread flips to ready): the per-row
  dot lights, the Chats unseen badge increments, the cross-page name-tag reads "Scout is
  ready," and a card appears in the Control Panel.
- **Chats inbox:** the Chats tab lists conversations as **question-led cards** — the lead
  question, a one-line answer preview, a timestamp (e.g. *"Jun 1 · 4:41 PM"*), a **status
  badge** (animated dots while thinking, a solid dot + accent rail when ready, muted when
  viewed), a **star** toggle, and a **⋯ menu** (favorite, delete, save). Clicking a card
  slides into that conversation.
- **Per-row indicator:** a pinned left-gutter marker of three dots — lit & pulsing when that
  row's answer is ready, a quiet shimmer while in-progress, absent when viewed or when the
  row has no thread. Clicking it opens that row's conversation.

---

## 6. Scoping & context

**Context chips** capture what the analyst is asking about:

- **Row chip** — "this whole row" (e.g. a customer/location/product line).
- **Cell chip** — one specific value (e.g. a single proposed price).
- **Selection chip** — a multi-cell pick within the scoping rules.

**Default click behavior (panel open):** clicking a grid cell **replaces** the current
(non-pinned) context with a new chip — a cell chip for a data column, a row chip for an
identity column. Once any chip is **explicitly pinned**, further clicks **append** instead
of replace. Clicking a chip's own target toggles it off. With the panel open, Scout's
scoping **intercepts** the grid's normal click behavior (so a click scopes Scout rather than
opening the row's drawer).

**+Add mode:** a "+ Add a cell" affordance enters a focused picking mode (cursor becomes a
copy cursor; eligible cells get a dashed outline). **Constraint:** a multi-cell pick must
share **one row** *or* **one scope-group column** — never a diagonal. Off-axis and identity
cells are disabled while picking. Escape exits the mode.

**Grid cell highlighting** (only while Scout is open):
- **Scope cells** — the cells the current context covers — get a soft **green** tint with an
  inset outline and accented text.
- **Identity cells** (the row's descriptive columns) get a faint grey overlay.
- **Column-group tints** — data columns are organized into **scope groups**: Cost,
  Proposed, Margin, Δ-vs-prior, Flags — each with its own subtle background tint.
- An explicit cell chip adds a **violet** outline badge on its exact cell.

**Legend & tour:** a **"How cell colors work"** text link (near the grid's toolbar) opens a
popover explaining identity vs scope coloring. (A color-key legend strip existed earlier
and was retired in favor of this lighter affordance.)

---

## 7. Library, Save & Share

- **Saved items are of two kinds:** **Prompt** (one reusable question) and **Path** (an
  ordered list of questions run in sequence). Each has a name, description, a **scope**
  (row-level vs aggregate/whole-view), a **subject tag**, a **star** (favorite), and
  optional **sharing**.
- **Library cards:** title + actions row; a meta row of pills (kind pill — *"Path · N
  steps"* or *"Prompt"* — plus scope and subject); a 2-line description; a footer with
  provenance on the left and the CTA (**Run** for paths, **Open** for prompts) on the right.
  Edit/Share reveal on hover; the **star is always visible**. Filters: **All / Yours /
  Shared with you**, a search field, and a **starred-only** toggle. Empty states: "nothing
  saved in this tab" and "no matches · Clear filters."
- **Running:** **Run** a path executes its steps **sequentially**, switching to the chat
  view and streaming each answer; **Open** a prompt drops its text into a new ask. A
  row-scoped item run **without a row in context** surfaces a warning ("Pick a row first").
- **Save modal** — two tabs:
  - **Details:** name (required), description, subject, and the **step list**. For a path,
    each step can be **renamed inline**, **reordered** (up/down), or **dropped** (with
    restore); a dropped step shows struck-through. Save is disabled until there's a name and
    at least one kept step.
  - **Share:** an audience picker — **scope cards** (e.g. *Only me / Team / Specific people*)
    plus a scrollable avatar list when "specific people" is chosen. The save modal's Share
    tab includes an "Only me" (private) option; the standalone Share modal omits it.
  The picker control is **shared** between the Save modal's Share tab and the standalone
  Share modal so the audience UI is identical.
- **Path-candidate nudge:** after the analyst runs **two or more questions of the same
  scope** in a row, Scout shows an inline prompt under the latest answer — *"Save these N
  questions on [this row / the quote book] as a path?"* — with a preview of the step labels,
  a **"Save as path"** button, and a dismiss ×. It appears once per qualifying run and
  collapses after saving or dismissing. Already-saved questions are excluded from later
  candidates.
- **Share modal** (from a card's ⋯) — header with the item name, the shared audience picker,
  and a confirm.

---

## 8. Cross-page chrome

These render outside the panel and persist as the analyst navigates:

- **Trigger + activity badge:** the "Ask Scout" toolbar button gains a small status badge
  reflecting Scout's activity (idle / thinking / ready).
- **Name tag:** a small tag near the user's name reads **"Scout is thinking"** /
  **"Scout is ready"** / idle, with an unseen dot.
- **Control-Panel alert cards:** Scout replaces the app's "Recent Alerts" empty state with
  cards for ready threads; clicking a card navigates back to the Quote Book and opens that
  thread.
- **Bottom prototype-timer bar:** a deliberately utilitarian fixed strip at the bottom
  (dashed top border, monospace, neutral greys + amber) reading *"PROTOTYPE TIMER (simulated
  latency — not part of Scout)"* with a soonest-ready countdown. It exists to make the fake
  latency legible during demos and is **not** part of the product.
- **Minimized mini-bubble:** minimizing collapses the panel to a small violet pill anchored
  just above the trigger ("Resume conversation"), with a gentle sheen; clicking it reopens
  the panel with state intact.
- **Intro bubble:** the one-time first-run tip described in §1.

---

## 9. Motion & micro-interactions

- **Shimmer border:** a multi-color (indigo→violet→magenta) ring orbits the panel edge —
  two glints rotating at different rates/directions — evoking "a thinking machine." Crisp
  2px ring at rest, no heavy glow.
- **Thinking shimmer:** live thinking steps and the inter-message "thinking…" divider use a
  gentle gradient-sweep while active.
- **Panel slide-in:** the panel enters with a short translate-up + fade (~200ms). View
  switches **push/pop** horizontally.
- **Idle sway:** the welcome mascot has a slow ~4.5s sway so the empty state feels alive.
- **Chip glimmer:** suggestion chips play a one-shot diagonal gradient glimmer on hover.
- **Reduced motion:** all of the above respect `prefers-reduced-motion` and fall back to
  static states.

---

## 10. Copy & lexicon

**Canonical terms:** *Scout* (the product), *chat* (a conversation — not "thread" in UI
copy), *Ask Scout*, *context* / *in focus* (the current scope), *Prompt* and *Path* (saved
items), *Run* (a path) / *Open* (a prompt), *confidence*, *sources*, *follow-up*.

**Key strings (verbatim where known):**
- Trigger: **"Ask Scout"**
- Intro bubble: *"Hi, I'm Scout 👋 …"*
- Welcome greeting: **"Hey, I'm Scout!"** + a line on what it answers.
- Suggestion chips (welcome): *"Why are 23 rows flagged?", "Where am I leaving margin?",
  "How did today's market move affect us?", "Where does Sinclair rank vs OPIS Unbranded?"*
- Context empty hint: **"Nothing in focus · click a cell"**; add affordance **"+ Add a cell"**.
- Composer placeholder: **"Ask Scout about your quote book…"**; send button **"Send"**.
- Confidence example: *"Medium confidence · Cluster counts are estimated"*.
- Follow-up heading: **"TRY A FOLLOW-UP"**.
- Details disclosure: *"Show details · N steps · M sources"*.
- Chats list back: **"‹ All Chats"**; tabs **"Chats" / "Library"**.
- Timer bar: *"PROTOTYPE TIMER (simulated latency — not part of Scout)"*.
- Minimized pill: **"Resume conversation"**.

(A full UX-copy audit exists and is the authority for tone and exact microcopy.)

---

## 11. Considerations & open questions

**Production considerations a rebuild must decide:**
- **Real model swap:** the prototype's answers, thinking steps, sources, and confidence are
  canned. A real build wires the ask path to a model/service; the **20s simulated latency**
  and the global demo clock disappear, replaced by real streaming + status.
- **Grid integration:** cell highlighting, scope groups, the per-row ready dot, and click
  interception must integrate with the real data grid's column model and event handling
  (clicks need to scope Scout *without* breaking the grid's own row interactions).
- **Persistence & identity:** saved prompts/paths, sharing, stars, and conversation history
  are in-memory in the prototype. A real build needs storage, an auth'd user, and a team
  roster for the share picker.
- **Scope rules:** the "one row OR one scope-group column, no diagonals" pick constraint and
  the replace-vs-append chip rule are product rules to preserve.
- **Confidence & sources are first-class:** every answer must carry an explicit confidence
  and citable sources — this is core to the product's trustworthiness, not decoration.
- **Cross-page state:** Scout's provider must sit **above** the app's router so threads and
  the clock survive navigation; mounting it per-page resets background work.

**Open behavioral questions surfaced in review:**
- Whether the per-row ready dot should appear for *every* backgrounded row or only
  explicitly-asked rows.
- Whether the timer bar should be hidden on auth/login surfaces.
- Whether path runs should let the user pick scope at save time vs inheriting the source
  scope.
- Whether feedback (👎) should ever suppress/retract the answer or only log.

---

## Appendix — captured visual states (for the screenshot gallery)

The handoff includes annotated screenshots of: trigger + intro bubble; welcome/zero-chats;
composer; thinking (live steps); answered (full bubble); follow-ups; answer footer;
feedback form; feedback receipt; details expanded; context chips (empty + populated); view
nav; header controls; mini-bubble; Chats inbox; Library (populated + empty); Save modal
(Details + Share tabs); inline path editor; Share modal; path-candidate nudge; close-confirm
modal; toast; grid cell highlighting (add-mode off + on); per-row ready dots; bottom timer
bar; sidebar-docked mode; and the cross-page name tag / alert cards where reachable.
