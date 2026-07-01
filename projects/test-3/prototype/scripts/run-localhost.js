#!/usr/bin/env node
/* eslint-env node */
/* eslint-disable no-console */
const fs = require('fs')
const path = require('path')
const { spawn } = require('child_process')

const ENV_FILE = path.resolve(process.cwd(), '.env.development')
const BACKUP_FILE = `${ENV_FILE}.bak`
const FRONTEND_OVERRIDES = path.resolve(process.cwd(), 'scripts/env-overrides.json')
const DEFAULT_LOCALHOST = 'http://localhost:44361/api'

function ensureProtocolAndPath(u) {
  if (!u) return null
  if (/^https?:\/\//i.test(u)) return u.endsWith('/api') ? u : `${u.replace(/\/+$/, '')}/api`
  const withProtocol = `http://${u}`
  return withProtocol.endsWith('/api') ? withProtocol : `${withProtocol}/api`
}

function readJsonSafe(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'))
  } catch {
    console.warn(`⚠️ Skipping invalid JSON: ${filePath}`)
    return null
  }
}

function getLocalhostUrlFromOverrides() {
  if (!fs.existsSync(FRONTEND_OVERRIDES)) return null
  const data = readJsonSafe(FRONTEND_OVERRIDES)
  if (!Array.isArray(data)) return null

  // Find an entry whose name is exactly "Localhost" (case-insensitive)
  const match = data.find(
    (o) =>
      String(o?.name || '')
        .trim()
        .toLowerCase() === 'localhost' && o?.url
  )
  if (!match) return null

  const url = ensureProtocolAndPath(String(match.url).trim())
  return url || null
}

function writeEnvAndStart(finalUrl) {
  if (!fs.existsSync(ENV_FILE)) fs.writeFileSync(ENV_FILE, '', 'utf8')
  try {
    fs.copyFileSync(ENV_FILE, BACKUP_FILE)
  } catch {
    // non-fatal
  }

  let content = fs
    .readFileSync(ENV_FILE, 'utf8')
    .split(/\r?\n/)
    .filter((line) => !/^VITE_API_URL\s*=/.test(line))
    .join('\n')
    .trim()

  content = (content ? content + '\n' : '') + `VITE_API_URL=${finalUrl}\n`
  fs.writeFileSync(ENV_FILE, content, 'utf8')

  console.log(`✅ Updated .env.development with ${finalUrl}`)
  console.log('🚀 Starting yarn dev...\n')

  const child = spawn('yarn', ['start'], { stdio: 'inherit', shell: true })
  child.on('close', (code) => {
    if (code !== 0) console.error(`❌ yarn start exited with code ${code}`)
  })
}

(function main() {
  const fromOverrides = getLocalhostUrlFromOverrides()
  const finalUrl = fromOverrides || DEFAULT_LOCALHOST
  writeEnvAndStart(finalUrl)
})()
