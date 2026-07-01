// Merge the three cluster manifest fragments into manifest.json,
// adding marker-center coords (cxPct/cyPct) for each annotation.
import { readFileSync, writeFileSync, existsSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const frags = ['manifest.cluster1.json', 'manifest.cluster2.json', 'manifest.cluster3.json']

let all = []
for (const f of frags) {
  const p = join(root, f)
  if (!existsSync(p)) { console.warn('missing', f); continue }
  all = all.concat(JSON.parse(readFileSync(p, 'utf8')))
}

for (const s of all) {
  for (const a of s.annotations || []) {
    a.cxPct = +(a.xPct + a.wPct / 2).toFixed(2)
    a.cyPct = +(a.yPct + a.hPct / 2).toFixed(2)
  }
}

const captured = all.filter((s) => !s.skipped)
writeFileSync(join(root, 'manifest.json'), JSON.stringify(all, null, 2))
console.log(`merged ${all.length} states (${captured.length} captured, ${all.length - captured.length} skipped) → manifest.json`)
for (const s of all.filter((x) => x.skipped)) console.log('  SKIPPED:', s.id, '-', s.reason)
