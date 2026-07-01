// Cluster 1 — entry + panel core states.
import { launch, freshPage, drive, askChip, addContext, shot, writeManifest } from './_lib.mjs'

const FLAGGED = /flag/i
const browser = await launch()
const manifest = []

async function run(spec, prep) {
  const page = await freshPage(browser)
  try {
    await prep(page)
    await page.waitForTimeout(spec.settle ?? 500)
    await shot(page, spec, manifest)
  } catch (e) {
    manifest.push({ id: spec.id, title: spec.title, section: spec.section, file: `${spec.id}.png`, skipped: true, reason: String(e).slice(0, 120), annotations: [] })
    console.log(`ERR  ${spec.id}: ${String(e).slice(0, 120)}`)
  } finally {
    await page.context().close()
  }
}

// 1. Trigger + intro bubble (panel closed)
await run(
  { id: 'c1-trigger', title: 'Trigger & first-run intro bubble', section: 'overview', target: 'viewport',
    annotate: [
      { selector: '#scout-trigger', label: 'Ask Scout trigger', note: 'Toolbar entry point; also opens on ⌘G.' },
      { selector: '[class*="intro"]', label: 'First-run intro bubble', note: 'One-time tip anchored to the trigger.' },
    ] },
  async (page) => {},
)

// 2. Welcome / zero-chats
await run(
  { id: 'c1-welcome', title: 'Welcome / zero-chats state', section: 'conversation', target: '.scout-panel-frame',
    annotate: [
      { selector: '.scout-view-nav', label: 'Chats / Library tabs', note: 'Two-tab nav; Chats is list-first.' },
      { selector: '.scout-ctx-chips', label: 'Context bar', note: '“Nothing in focus · click a cell.”' },
      { selector: '.scout-chips__row', label: 'Suggestion chips', note: 'Closed prompts to get started.' },
      { selector: '.scout-composer', label: 'Composer', note: 'Free-text ask.' },
    ] },
  async (page) => { await drive.open(page) },
)

// 3. Thinking (live steps) — shoot shortly after asking
await run(
  { id: 'c1-thinking', title: 'Thinking — live reasoning steps', section: 'conversation', target: '.scout-panel-frame', settle: 0,
    annotate: [
      { selector: '.scout-msg--scout', label: 'Scout is thinking', note: 'Steps reveal progressively, then auto-collapse.' },
    ] },
  async (page) => {
    await drive.open(page)
    const chip = page.locator('.scout-panel .scout-chip').filter({ hasText: FLAGGED }).first()
    await chip.click()
    await page.waitForTimeout(700) // mid-thinking
  },
)

// 4. Answered — full Scout bubble
await run(
  { id: 'c1-answered', title: 'Answered — full Scout answer', section: 'conversation', target: '.scout-panel-frame',
    annotate: [
      { selector: '.scout-row-tag', label: 'Scope tag', note: 'What rows the answer covers.' },
      { selector: '.scout-conf', label: 'Confidence', note: 'High / Medium / Low + caveat.' },
      { selector: '.scout-body__breakdown', label: 'Breakdown block', note: 'One of: paragraph, list, table, breakdown, CSV-link.' },
      { selector: '.scout-action-chips', label: 'Action chips', note: 'Scenario-specific next steps.' },
      { selector: '.scout-details', label: 'Details disclosure', note: 'Steps + sources, collapsed.' },
      { selector: '.scout-answer-footer', label: 'Feedback footer', note: '👍/👎 + ⋯ overflow.' },
      { selector: '.scout-followups', label: 'Follow-ups', note: '“TRY A FOLLOW-UP”.' },
    ] },
  async (page) => { await drive.open(page); await askChip(page, FLAGGED); await drive.forceReady(page); await page.waitForTimeout(800) },
)

// 5. Follow-ups (focused)
await run(
  { id: 'c1-followups', title: 'Follow-up suggestions', section: 'conversation', target: '.scout-followups', pad: 14,
    annotate: [{ selector: '.scout-followups', label: 'Suggested follow-ups', note: 'Tap to continue the thread.' }] },
  async (page) => { await drive.open(page); await askChip(page, FLAGGED); await page.waitForTimeout(400) },
)

// 6. Answer footer (focused)
await run(
  { id: 'c1-footer', title: 'Answer footer — feedback & overflow', section: 'conversation', target: '.scout-answer-footer', pad: 12,
    annotate: [
      { selector: '.scout-answer-footer__btn', label: 'Thumbs', note: '👍 / 👎 rating.' },
      { selector: '.scout-answer-footer__more', label: 'Overflow ⋯', note: 'Copy, export, save…' },
    ] },
  async (page) => { await drive.open(page); await askChip(page, FLAGGED); await page.waitForTimeout(400) },
)

// 7. Feedback form (after 👎)
await run(
  { id: 'c1-feedback-form', title: 'Feedback form (after 👎)', section: 'conversation', target: '.scout-panel-frame',
    annotate: [{ selector: '[class*="feedback"]', label: 'Inline feedback', note: 'Reason picker + optional note.' }] },
  async (page) => {
    await drive.open(page); await askChip(page, FLAGGED); await page.waitForTimeout(400)
    const btns = page.locator('.scout-answer-footer__btn')
    await btns.nth(1).click().catch(() => {})
    await page.waitForTimeout(400)
  },
)

// 8. Feedback receipt (after submit) — best-effort
await run(
  { id: 'c1-feedback-receipt', title: 'Feedback receipt', section: 'conversation', target: '.scout-panel-frame',
    annotate: [{ selector: '[class*="receipt"]', label: 'Receipt', note: 'Confirms feedback logged.' }] },
  async (page) => {
    await drive.open(page); await askChip(page, FLAGGED); await page.waitForTimeout(400)
    const btns = page.locator('.scout-answer-footer__btn')
    await btns.nth(1).click().catch(() => {})
    await page.waitForTimeout(300)
    // try to submit whatever form appears
    const submit = page.locator('.scout-panel button').filter({ hasText: /send|submit|done/i }).first()
    await submit.click().catch(() => {})
    await page.waitForTimeout(400)
  },
)

// 9. Details expanded
await run(
  { id: 'c1-details', title: 'Details expanded — steps & sources', section: 'conversation', target: '.scout-panel-frame',
    annotate: [
      { selector: '.scout-details', label: 'Reasoning + sources', note: 'Transparency: how Scout got here.' },
    ] },
  async (page) => {
    await drive.open(page); await askChip(page, FLAGGED); await page.waitForTimeout(400)
    await page.locator('.scout-details__toggle').first().click().catch(() => {})
    await page.waitForTimeout(400)
  },
)

// 10. Context bar — empty (focused)
await run(
  { id: 'c1-context-empty', title: 'Context bar — empty', section: 'scoping', target: '.scout-ctx-chips', pad: 10,
    annotate: [
      { selector: '.scout-ctx-chips__empty', label: 'Empty hint', note: '“Nothing in focus · click a cell.”' },
      { selector: '.scout-ctx-chips__add', label: '+ Add a cell', note: 'Enters focused pick mode.' },
    ] },
  async (page) => { await drive.open(page); await askChip(page, FLAGGED); await page.waitForTimeout(300) },
)

// 11. Context bar — populated
await run(
  { id: 'c1-context-populated', title: 'Context bar — populated', section: 'scoping', target: '.scout-ctx-chips', pad: 10,
    annotate: [{ selector: '.scout-ctx-chip', label: 'Context chip', note: 'Removable scope pill (row / cell / selection).' }] },
  async (page) => {
    await drive.open(page); await askChip(page, FLAGGED); await page.waitForTimeout(300)
    await addContext(page, { id: 'ctx1', kind: 'row', rowId: 'row-1', label: 'Dallas Hub · ULSD' })
  },
)

// 12. View nav (focused)
await run(
  { id: 'c1-viewnav', title: 'View navigation', section: 'ia', target: '.scout-view-nav', pad: 8,
    annotate: [
      { selector: '.scout-view-nav__tab', label: 'Tabs', note: 'Chats / Library.' },
    ] },
  async (page) => { await drive.open(page) },
)

// 13. Header controls (focused)
await run(
  { id: 'c1-header', title: 'Panel header & controls', section: 'anatomy', target: '.scout-panel__title-row', pad: 8,
    annotate: [
      { selector: '.scout-panel__g', label: 'Mark + wordmark', note: 'Drag handle in floating mode.' },
      { selector: '.scout-panel__savepath', label: 'Save as path', note: 'Disabled until saveable.' },
      { selector: '.scout-panel__clear', label: 'Clear', note: 'Archive + empty (undoable).' },
      { selector: '.scout-panel__mode', label: 'Mode', note: 'Float ↔ dock.' },
      { selector: '.scout-panel__minimize', label: 'Minimize', note: 'Collapse to mini-bubble.' },
      { selector: '.scout-panel__close', label: 'Close', note: 'Opens discard confirm.' },
    ] },
  async (page) => { await drive.open(page) },
)

// 14. Composer (focused)
await run(
  { id: 'c1-composer', title: 'Composer', section: 'anatomy', target: '.scout-composer', pad: 12,
    annotate: [
      { selector: '.scout-composer__textarea', label: 'Input', note: 'Grows to multi-line; ⌘Enter sends.' },
      { selector: '.scout-composer__send', label: 'Send', note: 'Disabled while empty/busy.' },
      { selector: '.scout-composer__undo', label: 'Undo', note: 'Reverses the last turn.' },
    ] },
  async (page) => { await drive.open(page) },
)

// 15. Minimized mini-bubble
await run(
  { id: 'c1-mini', title: 'Minimized mini-bubble', section: 'crosspage', target: '.scout-mini', pad: 16,
    annotate: [{ selector: '.scout-mini', label: 'Resume pill', note: 'Anchored above the trigger; reopens with state intact.' }] },
  async (page) => {
    await drive.open(page); await askChip(page, FLAGGED); await page.waitForTimeout(300)
    await drive.minimize(page); await page.waitForTimeout(500)
  },
)

writeManifest('manifest.cluster1.json', manifest)
await browser.close()
