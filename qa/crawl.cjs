#!/usr/bin/env node
/* Freddy QA crawler.
 *
 * Walks every page reachable from the sidebar of the proto-base, captures
 * console errors / page errors / failed network / missing-fixture warnings
 * per route, and writes a structured report under qa-reports/.
 *
 * Usage:
 *   node crawl.cjs                 # full crawl, default concurrency 4
 *   CONCURRENCY=8 node crawl.cjs   # tune parallelism
 *   BASE_URL=http://localhost:3001 node crawl.cjs
 */

const path = require('path')
const fs = require('fs')
const PCORE = require('./node_modules/puppeteer-core')

const BASE_URL = process.env.BASE_URL || 'http://localhost:3001'
const CONCURRENCY = parseInt(process.env.CONCURRENCY || '4', 10)
const PAGE_TIMEOUT = parseInt(process.env.PAGE_TIMEOUT_MS || '20000', 10)
const SETTLE_MS = parseInt(process.env.SETTLE_MS || '5000', 10)
const STUCK_LOADER_WAIT_MS = parseInt(process.env.STUCK_LOADER_WAIT_MS || '2000', 10)
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'

// Parse --routes flag from argv. Accepts comma-separated list of paths.
function parseRoutesFlag(argv) {
  const idx = argv.findIndex((a) => a === '--routes' || a.startsWith('--routes='))
  if (idx === -1) return null
  let val
  if (argv[idx].startsWith('--routes=')) val = argv[idx].slice('--routes='.length)
  else val = argv[idx + 1]
  if (!val) return null
  return val
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
    .map((p) => (p.startsWith('/') ? p : '/' + p))
}
const ROUTE_FILTER = parseRoutesFlag(process.argv.slice(2))

const REPORTS_ROOT = path.join(__dirname, '..', 'qa-reports')
const stamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 16)
const REPORT_DIR = path.join(REPORTS_ROOT, stamp)
const SCREENSHOTS_DIR = path.join(REPORT_DIR, 'screenshots')
fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true })

// External / known-noise message patterns we filter so they don't drown
// the real signals. Add more as patterns surface.
const NOISE_PATTERNS = [
  /^Download the React DevTools/,
  /^FullCalendar VDOM already loaded/,
  /^Amplitude API key is missing/,
  /^\[react-ga\] ReactGA\.initialize must be called/,
  /^You already have the latest version/,
  /^Warning: forwardRef render functions accept exactly two parameters/,
  /^AG Grid: Did not find icon undefined/,
  /^\[freddy\] mock mode enabled/,
  /^gravi-version /,
  /^\[vite\] (connecting|connected)/,
  /^componentWillUpdate has been renamed/,
  /sentry\.io.*429/i,
  /^Warning: Instance created by `useForm` is not connected/,
]
const FIXTURE_WARN = /^\[freddy\] no fixture for "(.+?)"/

function isNoise(msg) {
  return NOISE_PATTERNS.some((re) => re.test(msg))
}

function safeName(p) {
  return p.replace(/^\//, '').replace(/[^a-z0-9_-]/gi, '_') || 'index'
}

async function discoverRoutes(browser) {
  const page = await browser.newPage()
  await page.setViewport({ width: 1440, height: 900 })
  await page.goto(BASE_URL + '/', { waitUntil: 'networkidle2', timeout: 60000 })
  await new Promise((r) => setTimeout(r, 5000))

  // Expand the sidebar
  await page.evaluate(() => {
    const btn = document.querySelector('[aria-label="menu-unfold"]')?.closest('button')
    if (btn) btn.click()
  })
  await new Promise((r) => setTimeout(r, 2000))

  // Open every collapsed submenu so all leaf links render
  for (let i = 0; i < 6; i++) {
    const expanded = await page.evaluate(() => {
      const carets = [...document.querySelectorAll('[aria-label="caret-down"]')]
      let n = 0
      for (const c of carets) {
        const btn = c.closest('button') || c.closest('[role="button"]') || c.parentElement
        if (btn) { btn.click(); n++ }
      }
      return n
    })
    if (expanded === 0) break
    await new Promise((r) => setTimeout(r, 800))
  }

  // Collect all sidebar anchors with hrefs that look like in-app routes
  const routes = await page.evaluate(() => {
    const aside =
      document.querySelector('aside') ||
      document.querySelector('section.ant-layout-sider') ||
      document.querySelector('nav')
    if (!aside) return []
    const anchors = [...aside.querySelectorAll('a[href]')]
    const seen = new Set()
    const out = []
    for (const a of anchors) {
      const href = a.getAttribute('href')
      if (!href || href.startsWith('http') || href.startsWith('mailto')) continue
      if (href === '/' || href === '#' || seen.has(href)) continue
      // skip parameterized routes — we can't visit them without an id
      if (href.includes(':')) continue
      seen.add(href)
      out.push({ path: href, title: (a.textContent || '').trim().slice(0, 60) })
    }
    return out
  })

  await page.close()
  return routes
}

async function crawlOne(browser, route) {
  const page = await browser.newPage()
  await page.setViewport({ width: 1440, height: 900 })

  const consoleErrors = []
  const pageErrors = []
  const failedRequests = []
  const missingFixtures = new Set()
  const allConsole = []

  page.on('console', (msg) => {
    const text = msg.text()
    allConsole.push({ type: msg.type(), text })
    const m = text.match(FIXTURE_WARN)
    if (m) missingFixtures.add(m[1])
    if (isNoise(text)) return
    if (msg.type() === 'error') consoleErrors.push(text)
  })
  page.on('pageerror', (err) => pageErrors.push({ message: err.message, stack: err.stack?.split('\n').slice(0, 8).join('\n') }))
  page.on('requestfailed', (req) => {
    const url = req.url()
    if (url.includes('sentry.io') || url.includes('amplitude')) return
    failedRequests.push({ url, reason: req.failure()?.errorText })
  })

  let finalUrl = ''
  let rootLen = 0
  let crashed = false
  let stuckLoaders = []
  let emptyGrids = []
  try {
    await page.goto(BASE_URL + route.path, { waitUntil: 'domcontentloaded', timeout: PAGE_TIMEOUT })
    await new Promise((r) => setTimeout(r, SETTLE_MS))
    finalUrl = page.url()
    rootLen = await page.evaluate(() => document.querySelector('#root')?.innerHTML?.length || 0)

    // Stuck-loader detection: wait an extra beat then count visible loaders.
    await new Promise((r) => setTimeout(r, STUCK_LOADER_WAIT_MS))
    stuckLoaders = await page.evaluate(() => {
      const selectors = [
        '.ant-spin-spinning',
        '.ant-spin-dot-spin',
        '[aria-busy="true"]',
        '[data-testid*="loading" i]',
        '[class*="skeleton" i]:not([class*="hidden"])',
      ]
      const out = []
      for (const sel of selectors) {
        let nodes
        try { nodes = document.querySelectorAll(sel) } catch (_) { continue }
        let count = 0
        for (const n of nodes) {
          const rect = n.getBoundingClientRect()
          if (rect.width > 0 && rect.height > 0) count++
        }
        if (count > 0) out.push({ selector: sel, count })
      }
      return out
    })

    // Empty-grid detection: grid containers exist but no data rows rendered.
    emptyGrids = await page.evaluate(() => {
      const rowSelectors = [
        '.ant-table-tbody > tr.ant-table-row:not(.ant-table-placeholder)',
        '.ag-row',
        '[role="row"]:not([role*="header"])',
      ]
      const containerSelectors = ['.ant-table', '.ag-root', '[role="grid"]']
      let rowCount = 0
      for (const sel of rowSelectors) {
        try {
          const nodes = document.querySelectorAll(sel)
          for (const n of nodes) {
            const rect = n.getBoundingClientRect()
            if (rect.width > 0 && rect.height > 0) rowCount++
          }
        } catch (_) { /* invalid selector — skip */ }
      }
      const out = []
      for (const sel of containerSelectors) {
        let gridCount = 0
        try {
          const nodes = document.querySelectorAll(sel)
          for (const n of nodes) {
            const rect = n.getBoundingClientRect()
            if (rect.width > 0 && rect.height > 0) gridCount++
          }
        } catch (_) { continue }
        if (gridCount > 0 && rowCount === 0) {
          out.push({ containerSelector: sel, gridCount })
        }
      }
      return out
    })

    const screenshotName = `${safeName(route.path)}.png`
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, screenshotName), fullPage: false })
  } catch (e) {
    crashed = true
    pageErrors.push({ message: 'NAVIGATION_TIMEOUT_OR_CRASH: ' + e.message })
  }

  await page.close()

  return {
    path: route.path,
    title: route.title,
    finalUrl,
    rootLen,
    crashed,
    consoleErrors,
    pageErrors,
    failedRequests,
    missingFixtures: [...missingFixtures].sort(),
    consoleEventCount: allConsole.length,
    stuckLoaders,
    emptyGrids,
  }
}

;(async () => {
  console.log(`[freddy-qa] BASE_URL=${BASE_URL} CONCURRENCY=${CONCURRENCY}`)
  console.log(`[freddy-qa] report dir: ${REPORT_DIR}`)

  const browser = await PCORE.launch({
    headless: true,
    executablePath: CHROME,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  })

  console.log('[freddy-qa] discovering routes…')
  let routes = await discoverRoutes(browser)
  // also include the home route
  if (!routes.find((r) => r.path === '/')) routes.unshift({ path: '/', title: 'Home' })
  console.log(`[freddy-qa] found ${routes.length} routes`)

  if (ROUTE_FILTER && ROUTE_FILTER.length) {
    const wanted = new Set(ROUTE_FILTER)
    const filtered = routes.filter((r) => wanted.has(r.path))
    // Allow specifying routes that weren't auto-discovered.
    for (const p of ROUTE_FILTER) {
      if (!filtered.find((r) => r.path === p)) filtered.push({ path: p, title: '(adhoc)' })
    }
    routes = filtered
    console.log(`[freddy-qa] --routes filter active: ${routes.length} routes will be crawled`)
  }
  fs.writeFileSync(path.join(REPORT_DIR, 'routes.json'), JSON.stringify(routes, null, 2))

  // Pool with N parallel workers
  const results = []
  let cursor = 0
  async function worker(id) {
    while (true) {
      const i = cursor++
      if (i >= routes.length) break
      const route = routes[i]
      console.log(`[w${id}] ${i + 1}/${routes.length} ${route.path}`)
      const result = await crawlOne(browser, route)
      results.push(result)
      // write per-route as we go so a crash mid-run doesn't lose data
      fs.writeFileSync(
        path.join(REPORT_DIR, `${safeName(route.path)}.json`),
        JSON.stringify(result, null, 2)
      )
    }
  }
  await Promise.all(Array.from({ length: CONCURRENCY }, (_, i) => worker(i + 1)))

  await browser.close()

  // Build aggregate summary
  results.sort((a, b) => a.path.localeCompare(b.path))
  const totalCrashes = results.filter((r) => r.crashed).length
  const totalPageErrors = results.reduce((sum, r) => sum + r.pageErrors.length, 0)
  const totalConsoleErrors = results.reduce((sum, r) => sum + r.consoleErrors.length, 0)
  const allMissing = new Set()
  for (const r of results) for (const m of r.missingFixtures) allMissing.add(m)

  const md = [
    `# Freddy QA crawl — ${stamp}`,
    ``,
    `**Base URL:** ${BASE_URL}`,
    `**Routes crawled:** ${results.length}`,
    `**Crashes (navigation):** ${totalCrashes}`,
    `**Page errors (uncaught):** ${totalPageErrors}`,
    `**Console errors (filtered):** ${totalConsoleErrors}`,
    `**Distinct missing fixtures:** ${allMissing.size}`,
    ``,
    `## Pages with errors (sorted by severity)`,
    ``,
    `| Path | Title | Crash | PageErr | ConsoleErr | MissingFx |`,
    `|------|-------|-------|---------|------------|-----------|`,
    ...results
      .filter((r) => r.crashed || r.pageErrors.length || r.consoleErrors.length)
      .sort((a, b) => (b.crashed - a.crashed) || (b.pageErrors.length - a.pageErrors.length) || (b.consoleErrors.length - a.consoleErrors.length))
      .map(
        (r) =>
          `| \`${r.path}\` | ${r.title} | ${r.crashed ? '💥' : ''} | ${r.pageErrors.length} | ${r.consoleErrors.length} | ${r.missingFixtures.length} |`
      ),
    ``,
    `## Pages clean (no page errors, no console errors)`,
    ``,
    ...results.filter((r) => !r.crashed && !r.pageErrors.length && !r.consoleErrors.length).map((r) => `- \`${r.path}\` ${r.title}`),
    ``,
    `## All distinct missing fixtures`,
    ``,
    ...[...allMissing].sort().map((m) => `- \`${m}\``),
    ``,
    `## Detailed errors by page`,
    ``,
    ...results.flatMap((r) => {
      if (!r.crashed && !r.pageErrors.length && !r.consoleErrors.length) return []
      return [
        `### \`${r.path}\` — ${r.title}`,
        `- final URL: ${r.finalUrl}`,
        `- root length: ${r.rootLen}`,
        ...(r.crashed ? ['- 💥 NAV CRASH'] : []),
        ...r.pageErrors.map((e, i) => `- **pageerror ${i + 1}:** ${e.message}` + (e.stack ? `\n\`\`\`\n${e.stack}\n\`\`\`` : '')),
        ...r.consoleErrors.slice(0, 10).map((e, i) => `- **console.error ${i + 1}:** ${e.slice(0, 400)}`),
        ...(r.missingFixtures.length ? [`- missing fixtures: ${r.missingFixtures.map((m) => `\`${m}\``).join(', ')}`] : []),
        ``,
      ]
    }),
  ].join('\n')

  fs.writeFileSync(path.join(REPORT_DIR, 'index.md'), md)
  fs.writeFileSync(path.join(REPORT_DIR, 'summary.json'), JSON.stringify({
    stamp,
    base: BASE_URL,
    routes: results.length,
    totalCrashes,
    totalPageErrors,
    totalConsoleErrors,
    distinctMissingFixtures: allMissing.size,
    missingFixtures: [...allMissing].sort(),
  }, null, 2))

  // Unified report.json keyed by route, with pass/fail status.
  const totalStuckLoaders = results.filter((r) => (r.stuckLoaders || []).length > 0).length
  const totalEmptyGrids = results.filter((r) => (r.emptyGrids || []).length > 0).length
  const routesObj = {}
  let passCount = 0
  let failCount = 0
  for (const r of results) {
    const errors = [
      ...r.pageErrors,
      ...(r.crashed ? [{ message: 'NAVIGATION_CRASH' }] : []),
    ]
    const isFail =
      errors.length > 0 ||
      (r.stuckLoaders && r.stuckLoaders.length > 0) ||
      (r.emptyGrids && r.emptyGrids.length > 0)
    if (isFail) failCount++
    else passCount++
    routesObj[r.path] = {
      status: isFail ? 'fail' : 'pass',
      rootLen: r.rootLen,
      errors,
      consoleErrors: r.consoleErrors,
      stuckLoaders: r.stuckLoaders || [],
      emptyGrids: r.emptyGrids || [],
      missingFixtures: r.missingFixtures,
    }
  }
  fs.writeFileSync(
    path.join(REPORT_DIR, 'report.json'),
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        summary: {
          total: results.length,
          pass: passCount,
          fail: failCount,
          errors: totalPageErrors + totalCrashes,
          stuckLoaders: totalStuckLoaders,
          emptyGrids: totalEmptyGrids,
        },
        routes: routesObj,
      },
      null,
      2
    )
  )

  console.log('')
  console.log(`[freddy-qa] DONE. Report: ${path.join(REPORT_DIR, 'index.md')}`)
  console.log(`[freddy-qa] Routes: ${results.length} | Crashes: ${totalCrashes} | PageErrors: ${totalPageErrors} | ConsoleErrors: ${totalConsoleErrors}`)
  console.log(`[freddy-qa] Distinct missing fixtures: ${allMissing.size}`)
})().catch((e) => {
  console.error('CRAWL FAILED:', e)
  process.exit(1)
})
