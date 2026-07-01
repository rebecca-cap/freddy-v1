// Freddy bootstrap — mock seam for the proto-base.
// Imported FIRST in src/index.tsx so it runs before any app code mounts.
//
// What it does:
// 1. Sets window.__FREDDY_MOCKS__ — read by the patched useApi/useAuth in
//    the freddy-branch of @gravitate-js/excalibrr.
// 2. Monkey-patches window.fetch so raw fetch() calls (e.g.
//    EnvironmentConfigProvider, Main's sso/List) also route through the
//    fixture registry.
//
// Toggle by VITE_FREDDY_MOCKS at build time. Default: enabled in this
// proto-base (the whole point of this copy).

import { fixtures } from './fixtures'

declare global {
  interface Window {
    __FREDDY_MOCKS__?: {
      enabled: boolean
      handlers: Record<string, (path: string, init?: unknown) => Promise<unknown>>
      wildcard?: (path: string, init?: unknown) => Promise<unknown>
    }
    __freddyOriginalFetch__?: typeof fetch
  }
}

// VITE inlines import.meta.env at build time. Default to enabled here.
const enabled =
  (import.meta as any).env?.VITE_FREDDY_MOCKS !== '0' &&
  (import.meta as any).env?.VITE_FREDDY_MOCKS !== 'false'

if (enabled) {
  // Build the registry from fixtures. Each entry becomes a handler that
  // ignores path/init and resolves the fixture value, wrapped in the safe-
  // fallback Proxy so missing keys on partial fixtures don't crash consumers.
  const handlers: Record<string, (path: string, init?: unknown) => Promise<unknown>> = {}
  for (const [path, factory] of Object.entries(fixtures)) {
    // Factories may opt into receiving (path, init) — most ignore them.
    // EntityReport-style endpoints branch on the request body's ReportName.
    handlers[path] = async (p, init) =>
      wrapWithSafeFallback(await (factory as any)(p, init))
  }

  // Wildcard: any unhandled path returns a recursive Proxy "safe stub" that
  // tolerates a wide range of consumer access patterns without throwing:
  //   - response.Data / CodeValues / Items / Records / Results → []
  //   - response.Metadata / MetaData → {} (recursive proxy)
  //   - response.AnythingElse → another safe stub (recursive proxy)
  //   - response.map/.filter/.find/.length/iterator → behaves like []
  // This kills most "Cannot read properties of undefined" crashes when a
  // consumer reaches into a key we haven't seeded a fixture for.
  const makeSafeStub = (): any => {
    const arrayLikeMethods: Record<string, (...args: any[]) => any> = {
      map: () => [],
      filter: () => [],
      forEach: () => undefined,
      reduce: (_fn: any, initial: any) => initial,
      reduceRight: (_fn: any, initial: any) => initial,
      some: () => false,
      every: () => true,
      find: () => undefined,
      findIndex: () => -1,
      indexOf: () => -1,
      lastIndexOf: () => -1,
      includes: () => false,
      slice: () => [],
      concat: (...args: any[]) => ([] as any[]).concat(...args),
      flat: () => [],
      flatMap: () => [],
      join: () => '',
      sort: () => [],
      reverse: () => [],
    }

    const target: any = function () {}

    return new Proxy(target, {
      get(_t, prop) {
        if (prop === 'length') return 0
        if (prop === Symbol.iterator) {
          return function* () {
            /* yields nothing */
          }
        }
        if (prop === Symbol.asyncIterator) {
          return async function* () {
            /* yields nothing */
          }
        }
        if (prop === Symbol.toPrimitive) {
          return (hint: string) => (hint === 'number' ? 0 : '')
        }
        if (prop === 'toJSON') return () => ({})
        if (prop === 'toString') return () => ''
        if (prop === 'valueOf') return () => 0
        if (prop === 'then') return undefined // not a thenable
        if (typeof prop === 'string' && prop in arrayLikeMethods) {
          return arrayLikeMethods[prop]
        }
        if (
          prop === 'Data' ||
          prop === 'CodeValues' ||
          prop === 'Items' ||
          prop === 'Records' ||
          prop === 'Results'
        ) {
          return []
        }
        // For Metadata / MetaData and any other string key: return another
        // recursive safe stub so chained access (response.Foo.Bar.map(...))
        // continues to be tolerant.
        return makeSafeStub()
      },
      has() {
        return true
      },
      apply() {
        return makeSafeStub()
      },
    })
  }

  const wildcard = async (path: string) => {
    // eslint-disable-next-line no-console
    console.warn(`[freddy] no fixture for "${path}" — returning safe stub (recursive proxy tolerant of .Data/.map/.length/etc.)`)
    return makeSafeStub()
  }

  // Wrap a real fixture object in a Proxy so:
  //   - Known keys return the real value (recursively wrapped if also an object)
  //   - Missing keys fall through to a safe stub (so partial fixtures don't
  //     crash when consumers reach for keys we forgot to seed)
  // Arrays and primitives pass through unchanged. Skip wrapping when the
  // value is already a Proxy or a non-plain object (e.g. Date, Map).
  function wrapWithSafeFallback(value: any): any {
    if (value === null || value === undefined) return value
    if (Array.isArray(value)) return value
    if (typeof value !== 'object') return value
    // Skip non-plain objects so we don't accidentally wrap things like Dates
    if (Object.getPrototypeOf(value) !== Object.prototype) return value
    // Keys that must NEVER fall through to the safe stub: JSON serializer
    // hooks, primitive coercion, thenable detection, and Symbol props.
    // If we returned safe-stub values for these, JSON.stringify(proxy) would
    // pick up `toJSON: () => ({})` and serialize the whole fixture as `{}`.
    const RESERVED_KEYS = new Set([
      'toJSON', 'toString', 'valueOf', 'then', 'constructor', 'prototype',
      Symbol.toPrimitive as any, Symbol.toStringTag as any, Symbol.iterator as any,
      Symbol.asyncIterator as any,
    ])
    return new Proxy(value, {
      get(target, prop) {
        // Use bracket access (not `in`) because some fixtures are themselves
        // Proxies without a `has` trap — `'Data' in proxy` would lie.
        const v = (target as any)[prop]
        if (v !== undefined) {
          // Recursively wrap nested plain objects so .Data.Foo.Bar all stay safe
          if (v && typeof v === 'object' && !Array.isArray(v) && Object.getPrototypeOf(v) === Object.prototype) {
            return wrapWithSafeFallback(v)
          }
          return v
        }
        // Reserved JS internals: pass through (undefined) — don't shadow them
        // with safe-stub values, or JSON.stringify will serialize as {}.
        if (RESERVED_KEYS.has(prop as any) || typeof prop === 'symbol') return undefined
        // Missing data key — fall back to safe stub so partial fixtures don't crash
        return makeSafeStub()[prop]
      },
    })
  }

  window.__FREDDY_MOCKS__ = {
    enabled: true,
    handlers,
    wildcard,
  }

  // --- Monkey-patch window.fetch ---
  // Match by extracting the path *after* /api/ (or after the host if no /api/).
  // Returns a real Response object so callers calling .json() / .ok work.
  const originalFetch = window.fetch.bind(window)
  window.__freddyOriginalFetch__ = originalFetch

  function extractApiPath(input: RequestInfo | URL): string | null {
    let urlStr: string
    if (typeof input === 'string') urlStr = input
    else if (input instanceof URL) urlStr = input.toString()
    else urlStr = (input as Request).url
    try {
      const url = new URL(urlStr, window.location.origin)
      const idx = url.pathname.indexOf('/api/')
      if (idx >= 0) return url.pathname.slice(idx + '/api/'.length)
      // No /api/ in path — match the trailing path segment for fallback.
      return url.pathname.replace(/^\//, '')
    } catch {
      return null
    }
  }

  window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    const path = extractApiPath(input)
    if (path !== null) {
      const handler = handlers[path]
      // Registered fixtures serialize correctly (their wrapper keeps real keys).
      // For UNHANDLED paths we must NOT serialize the makeSafeStub() Proxy: its
      // `toJSON` returns {}, so JSON.stringify drops .Data — which crashes typed
      // (openapi-fetch) consumers doing `response.Data.forEach(...)` and trips
      // react-query v4's "data cannot be undefined". Serialize a concrete empty
      // envelope covering the common consumer shapes instead. (The Proxy stub is
      // still used for the excalibrr useApi seam, which reads it directly.)
      let data: unknown
      if (handler) {
        data = await handler(path)
      } else {
        // eslint-disable-next-line no-console
        console.warn(`[freddy] no fixture for "${path}" — returning empty envelope`)
        data = {
          Data: [], CodeValues: [], Items: [], Records: [], Results: [],
          Metadata: {}, MetaData: {}, TotalRecords: 0, Query: null, Validations: [],
        }
      }
      return new Response(JSON.stringify(data), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    }
    return originalFetch(input, init)
  }

  // Pre-seed localStorage values that gate "show me data" UX in pages
  // where the user would otherwise have to click a tab/toggle to reveal
  // anything. These are demo affordances, not data.
  // QuoteBook: selectedGroupTabs filters rows by group; default is empty,
  // which produces "0 Results" until you click a tab. Seed with the IDs
  // the QuoteBook fixture uses so rows render on first load.
  if (!localStorage.getItem('QuoteBook::selectedGroupTabs')) {
    localStorage.setItem('QuoteBook::selectedGroupTabs', JSON.stringify(['1', '2', '-1']))
  }

  // Mark we're alive — visible in DevTools console as a single line.
  // eslint-disable-next-line no-console
  console.info('[freddy] mock mode enabled · fixtures:', Object.keys(fixtures).length)
}

export {}
