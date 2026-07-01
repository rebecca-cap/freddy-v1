/**
 * Pendo Web SDK bootstrap.
 *
 * Loads the Pendo agent script using the official stub-based snippet so that
 * `pendo.initialize(...)` and `pendo.identify(...)` calls can be made even
 * before the agent finishes loading — calls are queued on `pendo._q` and
 * replayed once the real agent is ready.
 *
 * Called from CacheBuster.jsx with values fetched from /meta.json. The runtime
 * config (tenant, deployment, environment) is also stashed here so that
 * identifyPendo() can read it once user info is available — avoids threading
 * config through React context just for analytics.
 *
 * Per-deployment values arrive via the existing meta.template.json -> envsubst
 * -> meta.json runtime injection pattern; see frontend/entrypoint.sh.
 */

// Free-form label sent to Pendo as `account.environment`. Common values:
// 'dev', 'rc', 'demo', 'test', 'production'. The only value with special
// behavior in this file is 'production', which loads the production Pendo
// agent — anything else falls back to the staging agent script.
export type PendoEnvironment = string

interface PendoRuntimeConfig {
  apiKey?: string
  environment?: PendoEnvironment
  tenant?: string
  deployment?: string
}

let runtimeConfig: PendoRuntimeConfig = {}

export const getPendoRuntimeConfig = (): PendoRuntimeConfig => runtimeConfig

const isPlaceholder = (value: string | undefined): boolean =>
  !value || value.startsWith('${')

export const initializePendo = (
  apiKey: string | undefined,
  environment: string | undefined,
  tenant: string | undefined,
  deployment: string | undefined
): void => {
  // No-op when the deployment didn't set Pendo env vars (local dev, or any
  // overlay that hasn't enabled Pendo yet). envsubst leaves the literal
  // `${VAR}` text in place when the env var is unset, so we treat that as
  // missing too.
  if (isPlaceholder(apiKey)) {
    return
  }

  runtimeConfig = {
    apiKey,
    // Pass the env-var value through verbatim so analysts get a meaningful
    // `account.environment` value in Pendo (e.g. 'dev', 'rc', 'demo', 'test',
    // 'production'). The agent-variant choice below keys off literal
    // 'production' only — everything else loads pendo-staging.js.
    environment: isPlaceholder(environment) ? undefined : environment,
    tenant: isPlaceholder(tenant) ? undefined : tenant,
    deployment: isPlaceholder(deployment) ? undefined : deployment,
  }

  if (typeof window === 'undefined') return
  // Idempotent: bail if the agent has already been bootstrapped (e.g. HMR).
  if (window.pendo) return

  const sdkFileName = runtimeConfig.environment === 'production' ? 'pendo.js' : 'pendo-staging.js'

  // Set up window.pendo as a stub with method-queueing so callers can invoke
  // pendo.initialize() / pendo.identify() / pendo.track() immediately, before
  // the agent script finishes loading. Calls land on _q and are replayed once
  // the real agent is ready. Functionally equivalent to Pendo's official
  // Install Settings snippet, rewritten in modern syntax.
  interface PendoStub {
    _q: unknown[][]
    // biome-ignore lint/suspicious/noExplicitAny: stub methods accept dynamic call shapes for queueing.
    [method: string]: any
  }

  const stub: PendoStub = { _q: [] }
  const queueableMethods = ['initialize', 'identify', 'updateOptions', 'pageLoad', 'track', 'trackAgent']
  for (const method of queueableMethods) {
    stub[method] = (...args: unknown[]) => {
      stub._q[method === 'initialize' ? 'unshift' : 'push']([method, ...args])
    }
  }
  window.pendo = stub as unknown as pendo.Pendo

  const script = document.createElement('script')
  script.async = true
  script.src = `https://cdn.pendo.io/agent/static/${apiKey}/${sdkFileName}`
  const firstScript = document.getElementsByTagName('script')[0]
  firstScript?.parentNode?.insertBefore(script, firstScript)
}
