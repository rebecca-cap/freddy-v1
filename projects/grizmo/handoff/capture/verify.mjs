// Verify the assembled index.html: load all images, check integrity, screenshot.
import { chromium } from 'playwright'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const file = join(root, 'index.html')

const browser = await chromium.launch({ headless: true })
const page = await browser.newPage({ viewport: { width: 1320, height: 1400 } })
await page.goto('file://' + file, { waitUntil: 'networkidle' })

// eager-load every image and scroll through, then poll for completion (no hang)
await page.evaluate(async () => {
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
  document.querySelectorAll('img').forEach((i) => i.setAttribute('loading', 'eager'))
  const h = document.body.scrollHeight
  for (let y = 0; y < h; y += 500) { window.scrollTo(0, y); await sleep(80) }
  window.scrollTo(0, 0)
  const deadline = Date.now() + 12000
  while (Date.now() < deadline) {
    const pending = [...document.images].filter((i) => i.id !== 'lightbox-img' && (!i.complete || i.naturalWidth === 0))
    if (pending.length === 0) break
    await sleep(250)
  }
})
await page.waitForTimeout(300)

const report = await page.evaluate(() => {
  const imgs = [...document.images].filter((i) => i.id !== 'lightbox-img')
  const broken = imgs.filter((i) => !i.complete || i.naturalWidth === 0).map((i) => i.getAttribute('src'))
  const navAnchors = [...document.querySelectorAll('.nav a')].map((a) => a.getAttribute('href').slice(1))
  const deadAnchors = navAnchors.filter((id) => !document.getElementById(id))
  const text = document.body.innerText
  const tokensLeft = (text.match(/\{\{[^}]+\}\}/g) || [])
  const placeholders = (text.match(/\[(section|missing|state)[^\]]*\]/gi) || [])
  return {
    figures: document.querySelectorAll('.shot').length,
    images: imgs.length,
    brokenImages: broken,
    sections: document.querySelectorAll('section.section').length,
    navLinks: navAnchors.length,
    deadAnchors,
    tokensLeft,
    placeholders,
  }
})

// expected screenshots from manifest
const manifest = JSON.parse(readFileSync(join(root, 'manifest.json'), 'utf8'))
report.expectedStates = manifest.filter((s) => !s.skipped).length

await page.screenshot({ path: join(root, 'assets', 'screenshots', '_final-doc.png'), fullPage: true })

report.pass =
  report.brokenImages.length === 0 &&
  report.deadAnchors.length === 0 &&
  report.tokensLeft.length === 0 &&
  report.placeholders.length === 0 &&
  report.sections === report.navLinks

console.log(JSON.stringify(report, null, 2))
await browser.close()
process.exit(report.pass ? 0 : 1)
