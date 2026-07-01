// Shared capture helpers for the Scout handoff doc.
// Drives the running app via the real UI + the window.__scout__ dev hook,
// screenshots each state, and records annotation bounding-boxes as % of the
// shot so the HTML can place callout markers precisely.
import { chromium } from 'playwright'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { writeFileSync } from 'fs'

export const __dirname = dirname(fileURLToPath(import.meta.url))
export const SHOTS_DIR = join(__dirname, '..', 'assets', 'screenshots')
export const BASE = 'http://localhost:5181'
export const ROUTE = '/PricingEngine/QuoteBookEOD'
export const VIEWPORT = { width: 1680, height: 1020 }

export async function launch() {
  const browser = await chromium.launch({ headless: true })
  return browser
}

export async function freshPage(browser) {
  const ctx = await browser.newContext({ viewport: VIEWPORT, deviceScaleFactor: 2 })
  const page = await ctx.newPage()
  await page.goto(BASE + ROUTE, { waitUntil: 'domcontentloaded' })
  await page.waitForFunction(() => !!window.__scout__, null, { timeout: 20000 })
  await page.waitForTimeout(800) // let the grid settle
  return page
}

// --- dev-hook drive helpers (run inside the page) ---
export const drive = {
  open: (page) => page.evaluate(() => window.__scout__.actions.setOpen(true)),
  setView: (page, view) => page.evaluate((v) => window.__scout__.actions.setView(v), view),
  minimize: (page) => page.evaluate(() => window.__scout__.actions.minimize()),
  openCloseConfirm: (page) => page.evaluate(() => window.__scout__.actions.openCloseConfirm()),
  addToast: (page, text, kind = 'success') =>
    page.evaluate(({ text, kind }) => window.__scout__.actions.addToast({ id: 't1', text, kind }), { text, kind }),
  setAddMode: (page, on) => page.evaluate((o) => window.__scout__.actions.setAddContextMode(o), on),
  // Fast-forward the simulated clock so every in-progress thread flips to ready.
  forceReady: (page) =>
    page.evaluate(() => {
      const s = window.__scout__.getState()
      window.__scout__.actions.tickTimer((s.simNow || Date.now()) + 25000)
    }),
}

// Click a welcome suggestion chip by text, then wait for the answer to render.
export async function askChip(page, textRegex) {
  const chip = page
    .locator('.scout-panel .scout-chip')
    .filter({ hasText: textRegex })
    .first()
  await chip.click()
  // Wait for a scout answer body to appear (fakeLlm internal timing).
  await page.locator('.scout-msg--scout .scout-body').first().waitFor({ timeout: 15000 }).catch(() => {})
  await page.waitForTimeout(400)
}

// Add a context chip via the dev hook (row or cell).
export async function addContext(page, chip) {
  await page.evaluate((c) => window.__scout__.actions.addContext(c), chip)
  await page.waitForTimeout(200)
}

/**
 * Take one annotated screenshot.
 * spec = {
 *   id, title, section,
 *   target: '.scout-panel-frame' | '.scout-panel' | 'viewport' | <selector>,
 *   annotate: [{ selector, label, note }],   // boxes to mark; missing selectors are skipped
 *   pad: number                              // optional px padding around target element shot
 * }
 * prep(page) must have already driven the app to the desired state.
 */
export async function shot(page, spec, manifest) {
  const { id, title, section, annotate = [] } = spec
  let target = spec.target || '.scout-panel-frame'
  const file = `${id}.png`
  const path = join(SHOTS_DIR, file)

  // Resolve the screenshot region rect (in viewport coords).
  let region = null // {x,y,width,height}
  if (target === 'viewport') {
    region = { x: 0, y: 0, width: VIEWPORT.width, height: VIEWPORT.height }
  } else {
    // fall back through candidates
    const candidates = target === '.scout-panel-frame' ? ['.scout-panel-frame', '.scout-panel'] : [target]
    let el = null
    for (const sel of candidates) {
      const loc = page.locator(sel).first()
      if (await loc.count()) { el = loc; target = sel; break }
    }
    if (!el) {
      manifest.push({ id, title, section, file, target, skipped: true, reason: `target ${spec.target} not found`, annotations: [] })
      console.log(`SKIP ${id}: target ${spec.target} not found`)
      return
    }
    region = await el.boundingBox()
  }

  // Compute annotation boxes relative to the shot region (as %).
  const annotations = []
  let n = 0
  for (const a of annotate) {
    const loc = page.locator(a.selector).first()
    if (!(await loc.count())) continue
    const box = await loc.boundingBox().catch(() => null)
    if (!box) continue
    n += 1
    annotations.push({
      n,
      label: a.label,
      note: a.note || '',
      xPct: +(((box.x - region.x) / region.width) * 100).toFixed(2),
      yPct: +(((box.y - region.y) / region.height) * 100).toFixed(2),
      wPct: +((box.width / region.width) * 100).toFixed(2),
      hPct: +((box.height / region.height) * 100).toFixed(2),
    })
  }

  // Screenshot.
  if (target === 'viewport') {
    await page.screenshot({ path })
  } else {
    const pad = spec.pad || 0
    if (pad) {
      await page.screenshot({
        path,
        clip: {
          x: Math.max(0, region.x - pad),
          y: Math.max(0, region.y - pad),
          width: Math.min(VIEWPORT.width, region.width + pad * 2),
          height: Math.min(VIEWPORT.height, region.height + pad * 2),
        },
      })
      // when padded, annotation coords shift; recompute against padded origin
      const ox = Math.max(0, region.x - pad)
      const oy = Math.max(0, region.y - pad)
      const pw = Math.min(VIEWPORT.width, region.width + pad * 2)
      const ph = Math.min(VIEWPORT.height, region.height + pad * 2)
      for (const an of annotations) {
        // convert back to absolute then to padded-region %
        const absX = region.x + (an.xPct / 100) * region.width
        const absY = region.y + (an.yPct / 100) * region.height
        const absW = (an.wPct / 100) * region.width
        const absH = (an.hPct / 100) * region.height
        an.xPct = +(((absX - ox) / pw) * 100).toFixed(2)
        an.yPct = +(((absY - oy) / ph) * 100).toFixed(2)
        an.wPct = +((absW / pw) * 100).toFixed(2)
        an.hPct = +((absH / ph) * 100).toFixed(2)
      }
    } else {
      await page.locator(target).first().screenshot({ path })
    }
  }

  const dims = await page.evaluate(() => ({ dpr: window.devicePixelRatio }))
  manifest.push({
    id,
    title,
    section,
    file,
    target,
    viewport: VIEWPORT,
    dpr: dims.dpr,
    annotations,
  })
  console.log(`OK   ${id}  (${annotations.length} annotations)`)
}

export function writeManifest(name, manifest) {
  const out = join(__dirname, '..', name)
  writeFileSync(out, JSON.stringify(manifest, null, 2))
  console.log(`\nwrote ${name}: ${manifest.length} states`)
}
