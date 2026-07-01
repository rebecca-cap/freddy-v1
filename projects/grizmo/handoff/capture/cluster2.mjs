// Cluster 2 — Library / Chats inbox / modals / nudges.
import { launch, freshPage, drive, askChip, shot, writeManifest } from './_lib.mjs'

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

const SAVE_STATE = {
  sourceMessageId: null, scope: 'agg', name: '', description: '', subject: 'valuation',
  steps: [
    { id: 's1', label: 'Why are 23 rows flagged?', promptId: 'agg-flagged' },
    { id: 's2', label: 'Where am I leaving margin?', promptId: 'agg-move' },
  ],
  editorOpen: true, editingItemId: null,
}

// 1. Chats inbox (multiple conversations)
await run(
  { id: 'c2-chats-inbox', title: 'Chats inbox', section: 'threading', target: '.scout-panel-frame',
    annotate: [
      { selector: '.scout-inbox__card', label: 'Conversation card', note: 'Question-led; preview + timestamp.' },
      { selector: '.scout-inbox__card-question', label: 'Lead question', note: 'What was asked.' },
      { selector: '.scout-view-nav__unseen', label: 'Unseen badge', note: 'Counts ready answers.' },
      { selector: '.scout-inbox__new', label: 'New chat', note: 'Start a fresh conversation.' },
    ] },
  async (page) => {
    await drive.open(page)
    await askChip(page, FLAGGED)
    await page.evaluate(() => {
      const a = window.__scout__.actions, s = window.__scout__.getState()
      const t2 = a.createThread('row-20', 'Houston Terminal · CARBOB')
      a.startThreadThinking(t2, (s.simNow || Date.now()) + 20000)
      a.tickTimer((s.simNow || Date.now()) + 25000)
      a.setView('activity')
    })
    await page.waitForTimeout(500)
  },
)

// 2. Library (populated)
await run(
  { id: 'c2-library', title: 'Library — saved prompts & paths', section: 'library', target: '.scout-panel-frame',
    annotate: [
      { selector: '.scout-library__toolbar', label: 'Search & filters', note: 'Search, starred-only, ownership filter.' },
      { selector: '.scout-library-card__tag--kind', label: 'Kind pill', note: '“Path · N steps” or “Prompt”.' },
      { selector: '.scout-library-card__cta', label: 'Run / Open', note: 'Run a path; open a prompt.' },
      { selector: '.scout-library-card__star', label: 'Star', note: 'Favorite (always visible).' },
      { selector: '.scout-library-card__description', label: 'Description', note: '2-line clamp.' },
    ] },
  async (page) => { await drive.open(page); await drive.setView(page, 'library') },
)

// 3. Library — empty / no matches
await run(
  { id: 'c2-library-empty', title: 'Library — no matches', section: 'library', target: '.scout-panel-frame',
    annotate: [{ selector: '.scout-library__body', label: 'Empty state', note: '“No matches · Clear filters.”' }] },
  async (page) => {
    await drive.open(page); await drive.setView(page, 'library')
    await page.evaluate(() => window.__scout__.actions.setSearch('library', 'zzzqqq'))
    await page.waitForTimeout(300)
  },
)

// 4. Save modal — Details tab
await run(
  { id: 'c2-save-details', title: 'Save modal — Details', section: 'library', target: '.scout-save-modal',
    annotate: [
      { selector: '.scout-save-modal__tabs', label: 'Details / Share tabs', note: 'Two-tab save.' },
      { selector: '.scout-save-modal__field', label: 'Name & description', note: 'Name required.' },
      { selector: '.scout-save-modal__steps', label: 'Step list', note: 'Rename / reorder / drop.' },
      { selector: '.scout-save-modal__flatten', label: 'Flatten on save', note: 'Collapse to a single prompt.' },
      { selector: '.scout-save-modal__save', label: 'Save', note: 'Disabled until valid.' },
    ] },
  async (page) => { await drive.open(page); await page.evaluate((st) => window.__scout__.actions.openSaveModal(st), SAVE_STATE) },
)

// 5. Save modal — Share tab
await run(
  { id: 'c2-save-share', title: 'Save modal — Share', section: 'library', target: '.scout-save-modal',
    annotate: [
      { selector: '.scout-share-picker__scopes', label: 'Audience scope', note: 'Only me / Team / Specific people.' },
      { selector: '.scout-share-picker__scope', label: 'Scope card', note: 'Pick who can see it.' },
    ] },
  async (page) => {
    await drive.open(page); await page.evaluate((st) => window.__scout__.actions.openSaveModal(st), SAVE_STATE)
    await page.waitForTimeout(300)
    await page.locator('.scout-save-modal__tab').filter({ hasText: /share/i }).first().click().catch(() => {})
    await page.waitForTimeout(300)
  },
)

// 6. Inline path editor (steps focused)
await run(
  { id: 'c2-path-editor', title: 'Inline path editor', section: 'library', target: '.scout-save-modal__steps', pad: 14,
    annotate: [
      { selector: '.scout-save-modal__step-edit', label: 'Inline rename', note: 'Edit each step’s text.' },
      { selector: '.scout-save-modal__step-actions', label: 'Reorder / drop', note: 'Up · down · remove (restorable).' },
    ] },
  async (page) => { await drive.open(page); await page.evaluate((st) => window.__scout__.actions.openSaveModal(st), SAVE_STATE) },
)

// 7. Share modal (standalone)
await run(
  { id: 'c2-share-modal', title: 'Share modal', section: 'library', target: '.scout-share-modal',
    annotate: [
      { selector: '.scout-share-modal__item-name', label: 'Item being shared', note: 'Saved prompt / path.' },
      { selector: '.scout-share-picker__scopes', label: 'Audience', note: 'Same picker as Save → Share.' },
      { selector: '.scout-share-modal__share', label: 'Share', note: 'Confirm.' },
    ] },
  async (page) => {
    await drive.open(page)
    await page.evaluate(() => {
      const s = window.__scout__.getState(); const item = (s.library?.items || [])[0]
      if (item) window.__scout__.actions.openShareModal(item.id)
    })
  },
)

// 8. Path-candidate nudge
await run(
  { id: 'c2-path-candidate', title: 'Path-candidate nudge', section: 'library', target: '.scout-panel-frame',
    annotate: [{ selector: '[class*="candidate"]', label: 'Save-as-path nudge', note: 'Appears after ≥2 same-scope questions.' }] },
  async (page) => {
    await drive.open(page)
    await askChip(page, FLAGGED)
    await page.waitForTimeout(300)
    // ask a second aggregate question via a follow-up chip
    const fu = page.locator('.scout-followups .scout-chip, .scout-followups button').first()
    await fu.click().catch(() => {})
    await page.locator('.scout-msg--scout .scout-body').nth(1).waitFor({ timeout: 12000 }).catch(() => {})
    await drive.forceReady(page)
    await page.waitForTimeout(600)
  },
)

// 9. Toast
await run(
  { id: 'c2-toast', title: 'Toast notification', section: 'conversation', target: 'viewport',
    annotate: [{ selector: '[class*="toast"]', label: 'Toast', note: 'Single, auto-dismiss; success/warn/error.' }] },
  async (page) => { await drive.open(page); await drive.addToast(page, 'Saved “Margin check” to your Library', 'success') },
)

writeManifest('manifest.cluster2.json', manifest)
await browser.close()
