// Cluster 3 — grid integration + cross-page chrome.
import { launch, freshPage, drive, shot, writeManifest } from './_lib.mjs'

const browser = await launch()
const manifest = []

async function run(spec, prep) {
  const page = await freshPage(browser)
  try {
    await prep(page)
    await page.waitForTimeout(spec.settle ?? 600)
    await shot(page, spec, manifest)
  } catch (e) {
    manifest.push({ id: spec.id, title: spec.title, section: spec.section, file: `${spec.id}.png`, skipped: true, reason: String(e).slice(0, 120), annotations: [] })
    console.log(`ERR  ${spec.id}: ${String(e).slice(0, 120)}`)
  } finally {
    await page.context().close()
  }
}

// 1. Grid cell highlighting — scope (real cell click)
await run(
  { id: 'c3-cell-scope', title: 'Grid cell highlighting — scope', section: 'scoping', target: 'viewport',
    annotate: [
      { selector: '.scout-cell--scope', label: 'Scope cell', note: 'Green tint = covered by current context.' },
      { selector: '.scout-ctx-chips', label: 'Resulting chip', note: 'The click became the conversation scope.' },
    ] },
  async (page) => {
    await drive.open(page)
    const cell = page.locator('.ag-cell').filter({ hasText: /\$\d/ }).first()
    await cell.click().catch(() => {})
    await page.waitForTimeout(500)
  },
)

// 2. Grid +Add mode
await run(
  { id: 'c3-cell-addmode', title: 'Grid +Add pick mode', section: 'scoping', target: 'viewport',
    annotate: [
      { selector: '.scout-cell--scope', label: 'Picked / eligible', note: 'Same row OR one scope-group column.' },
      { selector: '.scout-cell--disabled', label: 'Disabled', note: 'Off-axis / identity cells can’t be picked.' },
    ] },
  async (page) => {
    await drive.open(page)
    const cell = page.locator('.ag-cell').filter({ hasText: /\$\d/ }).first()
    await cell.click().catch(() => {})
    await drive.setAddMode(page, true)
    await page.waitForTimeout(500)
  },
)

// 3. Per-row ready indicator dots
await run(
  { id: 'c3-ready-dots', title: 'Per-row ready indicator', section: 'threading', target: 'viewport',
    annotate: [{ selector: '.scout-row-ready-cell', label: 'Ready dots', note: 'Lights when that row’s background answer is ready.' }] },
  async (page) => {
    const rowId = await page.evaluate(() => document.querySelector('.ag-center-cols-container .ag-row')?.getAttribute('row-id'))
    await page.evaluate((rid) => {
      const a = window.__scout__.actions, s = window.__scout__.getState()
      const id = a.ensureThreadForRow(rid || 'row-1', 'Dallas Hub · ULSD')
      a.startThreadThinking(id, (s.simNow || Date.now()) + 20000)
      a.tickTimer((s.simNow || Date.now()) + 25000)
    }, rowId)
    await page.waitForTimeout(700)
  },
)

// 4. Bottom prototype timer bar (in-progress countdown)
await run(
  { id: 'c3-timer-bar', title: 'Prototype timer bar', section: 'crosspage', target: '.scout-proto-timer', pad: 10,
    annotate: [
      { selector: '.scout-proto-timer__label', label: 'Label', note: '“PROTOTYPE TIMER (simulated latency)”.' },
      { selector: '.scout-proto-timer__summary', label: 'Countdown', note: 'Soonest ready answer.' },
    ] },
  async (page) => {
    await page.evaluate(() => {
      const a = window.__scout__.actions, s = window.__scout__.getState()
      const id = a.ensureThreadForRow('row-9', 'Row')
      a.startThreadThinking(id, (s.simNow || Date.now()) + 20000)
    })
    await page.waitForTimeout(500)
  },
)

// 5. Sidebar-docked mode
await run(
  { id: 'c3-sidebar', title: 'Sidebar-docked mode', section: 'anatomy', target: 'viewport',
    annotate: [
      { selector: '.scout-panel', label: 'Docked panel', note: 'Full height; pushes the grid left.' },
    ] },
  async (page) => {
    await drive.open(page)
    await page.evaluate(() => window.__scout__.actions.setPanelMode('sidebar'))
    await page.waitForTimeout(700)
  },
)

// 6. Cross-page name tag (best-effort)
await run(
  { id: 'c3-name-tag', title: 'Cross-page name tag', section: 'crosspage', target: 'viewport',
    annotate: [{ selector: '[class*="name-tag"], [class*="nametag"], [class*="scout-status"]', label: 'Scout status', note: '“Scout is thinking / ready”.' }] },
  async (page) => {
    await page.evaluate(() => {
      const a = window.__scout__.actions, s = window.__scout__.getState()
      const id = a.ensureThreadForRow('row-7', 'Row')
      a.startThreadThinking(id, (s.simNow || Date.now()) + 20000)
      a.tickTimer((s.simNow || Date.now()) + 25000)
    })
    await page.waitForTimeout(600)
  },
)

// 7. Control Panel alert cards (best-effort)
await run(
  { id: 'c3-control-panel', title: 'Control Panel alert cards', section: 'crosspage', target: 'viewport',
    annotate: [{ selector: '[class*="alert-card"], [class*="scout-alert"]', label: 'Ready alert cards', note: 'Click jumps back into the thread.' }] },
  async (page) => {
    await page.evaluate(() => {
      const a = window.__scout__.actions, s = window.__scout__.getState()
      const id = a.ensureThreadForRow('row-5', 'Dallas Hub · ULSD')
      a.startThreadThinking(id, (s.simNow || Date.now()) + 20000)
      a.tickTimer((s.simNow || Date.now()) + 25000)
    })
    await page.locator('.control-panel-trigger, [class*="control-panel"]').first().click().catch(() => {})
    await page.waitForTimeout(700)
  },
)

// 8. "How cell colors work" tour (best-effort)
await run(
  { id: 'c3-tour', title: 'How cell colors work', section: 'scoping', target: 'viewport',
    annotate: [{ selector: '[class*="tour"], [class*="legend"]', label: 'Cell-color help', note: 'Explains identity vs scope coloring.' }] },
  async (page) => {
    await drive.open(page)
    const link = page.getByText(/how cell colors work/i).first()
    await link.click().catch(() => {})
    await page.waitForTimeout(500)
  },
)

writeManifest('manifest.cluster3.json', manifest)
await browser.close()
