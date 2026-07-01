#!/usr/bin/env node
/* eslint-env node */
/* eslint-disable no-console */
const fs = require('fs')
const path = require('path')
const { Select } = require('enquirer')
const { spawn } = require('child_process')

const ENV_FILE = path.resolve(process.cwd(), '.env.development')
const BACKUP_FILE = `${ENV_FILE}.bak`
const DB_CONN_RELATIVE = 'backend/Scripting/DatabaseMigration/db_connections'
const FRONTEND_OVERRIDES = path.resolve(process.cwd(), 'scripts/env-overrides.json')

function ensureProtocolAndPath(u) {
  if (!u) return null
  if (/^https?:\/\//i.test(u)) return u
  const withProtocol = `https://${u}`
  return withProtocol.endsWith('/api') ? withProtocol : `${withProtocol}/api`
}

function toTitleCase(str) {
  return str
    .replace(/[_\-\.]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

function deriveFriendlyNameFromHost(host) {
  const parts = host.split('.')
  const envType = parts.includes('pe') ? ' (PE)' : parts.includes('osp') ? ' (OSP)' : ''
  const idxPe = parts.indexOf('pe')
  const idxOsp = parts.indexOf('osp')
  let leftLabelsEnd = parts.length
  if (idxPe > -1) leftLabelsEnd = idxPe
  if (idxOsp > -1) leftLabelsEnd = Math.min(leftLabelsEnd, idxOsp)
  const idxGrav = parts.indexOf('gravitate')
  if (idxGrav > -1) leftLabelsEnd = Math.min(leftLabelsEnd, idxGrav)
  const leftLabels = parts.slice(0, Math.max(1, leftLabelsEnd))
  const base = toTitleCase(leftLabels.join(' '))
  return `${base}${envType}`.trim() || host
}

function readJsonSafe(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'))
  } catch {
    console.warn(`⚠️ Skipping invalid JSON: ${filePath}`)
    return null
  }
}

function uniqBy(arr, keyFn) {
  const seen = new Set()
  const out = []
  for (const item of arr) {
    const key = keyFn(item)
    if (!seen.has(key)) {
      seen.add(key)
      out.push(item)
    }
  }
  return out
}

(async () => {
  // Collect from db_connections
  let candidates = []
  const dbDir = path.resolve(process.cwd(), '..', DB_CONN_RELATIVE)
  if (fs.existsSync(dbDir)) {
    const files = fs.readdirSync(dbDir).filter((f) => f.endsWith('.connection.json'))
    for (const f of files) {
      const data = readJsonSafe(path.join(dbDir, f))
      if (!Array.isArray(data)) continue
      for (const entry of data) {
        if (!entry.url) continue
        const fullUrl = ensureProtocolAndPath(entry.url)
        if (!fullUrl) continue
        const host = fullUrl.replace(/^https?:\/\//i, '').replace(/\/.*$/, '')
        const name = deriveFriendlyNameFromHost(host)
        candidates.push({ name, url: fullUrl })
      }
    }
  }

  // Load overrides only from frontend/scripts/env-overrides.json
  let overrides = []
  if (fs.existsSync(FRONTEND_OVERRIDES)) {
    const data = readJsonSafe(FRONTEND_OVERRIDES)
    if (Array.isArray(data)) {
      overrides = data
        .map((o) => ({
          name: String(o.name || '').trim(),
          url: ensureProtocolAndPath(String(o.url || '').trim()),
        }))
        .filter((o) => o.name && o.url)
    }
  }

  // Merge + sort
  let environments = uniqBy([...candidates, ...overrides], (e) => e.url.toLowerCase())
  environments.sort((a, b) => a.name.localeCompare(b.name))

  if (environments.length === 0) {
    console.error('❌ No environments found in db_connections or frontend/scripts/env-overrides.json.')
    process.exit(1)
  }

  const prompt = new Select({
    name: 'environment',
    message: 'Select the environment to set VITE_API_URL to:',
    choices: environments.map((e) => e.name),
  })

  const choice = await prompt.run()
  const selected = environments.find((e) => e.name === choice)

  // Update .env.development
  if (!fs.existsSync(ENV_FILE)) fs.writeFileSync(ENV_FILE, '', 'utf8')
  fs.copyFileSync(ENV_FILE, BACKUP_FILE)

  let content = fs
    .readFileSync(ENV_FILE, 'utf8')
    .split(/\r?\n/)
    .filter((line) => !/^VITE_API_URL\s*=/.test(line) && !/^VITE_API_URL3\s*=/.test(line))
    .join('\n')
    .trim()

  content = (content ? content + '\n' : '') + `VITE_API_URL=${selected.url}\n`
  fs.writeFileSync(ENV_FILE, content, 'utf8')

  console.log(`✅ Updated .env.development with ${selected.url}`)
  console.log('🚀 Starting yarn dev...\n')

  // Start the app
  const child = spawn('yarn', ['start'], { stdio: 'inherit', shell: true })
  child.on('close', (code) => {
    if (code !== 0) console.error(`❌ yarn start exited with code ${code}`)
  })
})()
