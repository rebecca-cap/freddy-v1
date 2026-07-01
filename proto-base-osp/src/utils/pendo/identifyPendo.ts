import type { GetUserInfoResponse } from '@api/useCredential/responseTypes'
import { getPendoRuntimeConfig } from './initializePendo'

/**
 * Sends visitor + account identification to Pendo.
 *
 * Called from UserContext once user info has loaded. Safe to call before the
 * agent script has finished downloading — the bootstrap stub queues calls.
 *
 * Field-name convention: snake_case per Pendo's documented norms.
 *
 * Sensitive fields intentionally excluded: Permissions[], UserDefinedGridViews[],
 * MobilePhone, OfficePhone, AllowedImpersonationModes[]. `is_internal` and
 * `role` cover the segmentation we need without leaking data.
 *
 * Payload size: total visitor + account metadata must stay under 64KB. We send
 * a small fixed shape (~200 bytes/user) — well within limits.
 *
 * SPA route tracking note: Pendo's agent auto-detects history.pushState (which
 * React Router uses), so we deliberately do NOT call pendo.pageLoad() on route
 * changes — that would double-count.
 */
export const identifyPendo = (user: GetUserInfoResponse | undefined): void => {
  if (typeof window === 'undefined') return
  if (!window.pendo) return
  if (!user?.Data) return

  const { tenant, deployment, environment } = getPendoRuntimeConfig()
  // No tenant means Pendo isn't configured for this deployment. Skip rather
  // than identifying users into a bucket where they can't be segmented.
  if (!tenant) return

  const data = user.Data
  const fullName = `${data.First ?? ''} ${data.Last ?? ''}`.trim()

  pendo.initialize({
    visitor: {
      id: String(data.CredentialId),
      email: data.Email ?? null,
      full_name: fullName || null,
      role: data.IsInternalUser ? 'Internal' : 'External',
      is_internal: !!data.IsInternalUser,
      counter_party_id: data.CounterPartyId ? String(data.CounterPartyId) : null,
      counter_party_name: data.CounterPartyDisplay ?? null,
    },
    account: {
      id: tenant,
      name: tenant,
      deployment: deployment ?? null,
      environment: environment ?? null,
    },
    // Privacy-conservative defaults for commodities-trading data. Tighten or
    // loosen here once we see what real Replay/Analytics output looks like.
    excludeAllText: true,
    excludeTitle: true,
  })
}

/**
 * Clears the current Pendo visitor session. Called from UserContext.handleLogout
 * so the next user logging in on the same browser doesn't inherit the previous
 * visitor's identity until next page reload.
 *
 * Defensive: if the agent stub hasn't loaded yet (e.g. Pendo wasn't configured
 * for this deployment), clearSession won't exist — optional-chain past it.
 */
export const clearPendoSession = (): void => {
  if (typeof window === 'undefined') return
  if (!window.pendo) return
  pendo.clearSession?.()
}
