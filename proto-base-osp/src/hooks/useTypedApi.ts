/**
 * Typed API Client using OpenAPI-generated types
 *
 * This provides type-safe API calls with full autocomplete for paths,
 * request bodies, and response types. Works with React Query v4.
 *
 * Usage:
 *   const api = useTypedApi()
 *
 *   // Direct fetch with full type inference
 *   const { data, error } = await api.POST('/api/Admin/UserManagement/ReadUsers')
 *
 *   // With React Query (use the typed fetch in your query fn)
 *   const { data } = useQuery(['users'], () => api.POST('/api/Admin/UserManagement/ReadUsers'))
 */

import type { paths, components } from '@/types/api'
import createFetchClient, { type Middleware } from 'openapi-fetch'
import { useMemo, useRef } from 'react'
import { useAuth } from '@gravitate-js/excalibrr'

// Re-export types for convenience
export type { paths, components }

/**
 * Type inference utilities for extracting request/response types from paths
 *
 * Usage:
 *   type UsersResponse = InferResponse<'/api/Admin/UserManagement/ReadUsers'>
 *   type CreateUserBody = InferRequestBody<'/api/Admin/UserManagement/CreateOrUpdateUsers'>
 */

// Infer request body type from a path
export type InferRequestBody<
  Path extends keyof paths,
  Method extends keyof paths[Path] = 'post',
> = paths[Path][Method] extends {
  requestBody?: { content: { 'application/json': infer Body } }
}
  ? Body
  : paths[Path][Method] extends {
        requestBody: { content: { 'application/json': infer Body } }
      }
    ? Body
    : never

// Infer successful response type from a path (checks all common content types)
export type InferResponse<
  Path extends keyof paths,
  Method extends keyof paths[Path] = 'post',
> = paths[Path][Method] extends {
  responses: {
    200: { content: { 'application/json': infer Response } }
  }
}
  ? Response
  : paths[Path][Method] extends {
        responses: {
          200: { content: { 'text/json': infer Response } }
        }
      }
    ? Response
    : paths[Path][Method] extends {
          responses: {
            200: { content: { 'text/plain': infer Response } }
          }
        }
      ? Response
      : paths[Path][Method] extends {
            responses: {
              200: { content: { 'application/x-msgpack': infer Response } }
            }
          }
        ? Response
        : unknown

// Infer query parameters from a path
export type InferQueryParams<
  Path extends keyof paths,
  Method extends keyof paths[Path] = 'post',
> = paths[Path][Method] extends {
  parameters?: { query?: infer Query }
}
  ? Query
  : never

// Infer path parameters from a path
export type InferPathParams<
  Path extends keyof paths,
  Method extends keyof paths[Path] = 'post',
> = paths[Path][Method] extends {
  parameters?: { path?: infer PathParams }
}
  ? PathParams
  : never

/**
 * Token refresh state — shared across all client instances so only one
 * refresh request runs at a time, even when multiple 401s arrive concurrently.
 */
let refreshPromise: Promise<boolean> | null = null
const requestClones = new WeakMap<Request, Request>()

async function refreshAccessToken(
  baseUrl: string,
  onAuthFailure?: () => void,
): Promise<boolean> {
  const refreshToken = localStorage.getItem('refresh')
  if (!refreshToken) {
    onAuthFailure?.()
    return false
  }

  try {
    const response = await fetch(`${baseUrl}/api/token/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: refreshToken }),
    })

    if (!response.ok) {
      onAuthFailure?.()
      return false
    }

    const data = await response.json()
    if (data.access_token) {
      localStorage.setItem('token', data.access_token)
    }
    return true
  } catch {
    return false
  }
}

/**
 * Create the openapi-fetch client with authentication and token refresh middleware.
 *
 * On 401 responses the middleware will automatically refresh the JWT via
 * /api/token/refresh and retry the original request once. Concurrent 401s
 * share a single refresh call so the endpoint is not hammered.
 */
function createAuthenticatedClient(baseUrl: string, onAuthFailure?: () => void) {
  const client = createFetchClient<paths>({
    baseUrl,
  })

  const authMiddleware: Middleware = {
    async onRequest({ request }) {
      const token = localStorage.getItem('token')
      if (token) {
        request.headers.set('Authorization', `Bearer ${token}`)
      }
      // Set default content type for JSON
      if (!request.headers.has('Content-Type')) {
        request.headers.set('Content-Type', 'application/json')
      }
      // Impersonation headers (same source as AuthProvider defaultHeaders)
      const impersonationMode = localStorage.getItem('Gravitate-Impersonation-Mode')
      if (impersonationMode) {
        request.headers.set('Gravitate-Impersonation-Mode', impersonationMode)
      }
      const currentCounterParty = localStorage.getItem('Gravitate-Current-CounterParty')
      if (currentCounterParty) {
        request.headers.set('Gravitate-Current-CounterParty', currentCounterParty)
      }
      // Save a clone before fetch consumes the body — used for 401 retry
      requestClones.set(request, request.clone())
      return request
    },

    async onResponse({ request, response }) {
      if (response.status !== 401) {
        requestClones.delete(request)
        return response
      }

      const savedClone = requestClones.get(request)
      requestClones.delete(request)
      if (!savedClone) return response

      // Coordinate concurrent refreshes — only one runs at a time
      if (!refreshPromise) {
        refreshPromise = refreshAccessToken(baseUrl, onAuthFailure).finally(() => {
          refreshPromise = null
        })
      }

      const refreshed = await refreshPromise
      if (!refreshed) return response

      // Retry the original request with the fresh token
      const newToken = localStorage.getItem('token')
      if (newToken) {
        savedClone.headers.set('Authorization', `Bearer ${newToken}`)
      }
      return fetch(savedClone)
    },
  }

  client.use(authMiddleware)

  return client
}

/**
 * Typed API client type
 */
export type TypedApiClient = ReturnType<typeof createAuthenticatedClient>

/**
 * Main hook for typed API access
 *
 * Returns an openapi-fetch client with methods: GET, POST, PUT, DELETE, PATCH
 * All methods are fully typed based on the OpenAPI schema.
 *
 * Example with React Query v4:
 * ```ts
 * const api = useTypedApi()
 *
 * // In a query
 * const usersQuery = useQuery({
 *   queryKey: ['users'],
 *   queryFn: async () => {
 *     const { data, error } = await api.POST('/api/Admin/UserManagement/ReadUsers')
 *     if (error) throw error
 *     return data
 *   }
 * })
 *
 * // In a mutation
 * const createUserMutation = useMutation({
 *   mutationFn: async (users: InferRequestBody<'/api/Admin/UserManagement/CreateOrUpdateUsers'>) => {
 *     const { data, error } = await api.POST('/api/Admin/UserManagement/CreateOrUpdateUsers', {
 *       body: users
 *     })
 *     if (error) throw error
 *     return data
 *   }
 * })
 * ```
 */
export function useTypedApi(): TypedApiClient {
  const { baseUrl, clearTokens } = useAuth()
  const clearTokensRef = useRef(clearTokens)
  clearTokensRef.current = clearTokens

  const client = useMemo(() => {
    // Remove trailing /api from baseUrl since paths already include /api prefix
    const normalizedBaseUrl = baseUrl.replace(/\/api\/?$/, '')
    return createAuthenticatedClient(normalizedBaseUrl, () => clearTokensRef.current())
  }, [baseUrl])

  return client
}

/**
 * Create a standalone typed API client (for use outside React components)
 *
 * Example:
 * ```ts
 * const api = createTypedApi('https://dev.pe.gravitate.energy/api')
 * const { data } = await api.POST('/api/Admin/UserManagement/ReadUsers')
 * ```
 */
function createTypedApi(baseUrl: string): TypedApiClient {
  return createAuthenticatedClient(baseUrl)
}

/**
 * Helper to unwrap API response and throw on error
 *
 * Use this in React Query queryFn/mutationFn for cleaner code:
 * ```ts
 * const { data } = useQuery({
 *   queryKey: ['users'],
 *   queryFn: () => unwrap(api.POST('/api/Admin/UserManagement/ReadUsers'))
 * })
 * ```
 */
export async function unwrap<T>(
  promise: Promise<{ data?: T; error?: unknown; response: Response }>
): Promise<T> {
  const { data, error, response } = await promise

  if (error) {
    throw error
  }

  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`)
  }

  return data as T
}

/**
 * Type-safe query key generator
 *
 * Creates consistent query keys for React Query cache operations.
 *
 * Example:
 * ```ts
 * // Create a query key
 * const key = queryKey('/api/Admin/UserManagement/ReadUsers')
 * // Result: ['/api/Admin/UserManagement/ReadUsers']
 *
 * // With parameters
 * const key = queryKey('/api/Admin/UserManagement/ReadUsers', { someParam: 'value' })
 * // Result: ['/api/Admin/UserManagement/ReadUsers', { someParam: 'value' }]
 *
 * // Invalidate queries
 * queryClient.invalidateQueries({ queryKey: queryKey('/api/Admin/UserManagement/ReadUsers') })
 * ```
 */
export function queryKey<Path extends keyof paths>(
  path: Path,
  params?: Record<string, unknown>
): readonly [Path] | readonly [Path, Record<string, unknown>] {
  return params ? ([path, params] as const) : ([path] as const)
}

