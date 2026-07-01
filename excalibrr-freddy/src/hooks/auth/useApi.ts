import { isDefined } from '@utils/general'
import { configureRefreshFetch } from 'refresh-fetch'
import { useAuth } from './useAuth'
import { TokenRefreshResponse } from './types'
import {
  appendURLQueryParams,
  shouldRefreshToken,
  type InitWithQueryParams,
} from './util'

const store = window.localStorage

export type UseApiParams = {
  baseURLOverride?: string
}

export function useApi(options?: UseApiParams) {
  const {
    tokens,
    authenticate,
    clearTokens,
    baseUrl,
    errorHandler,
    defaultParams,
    defaultHeaders,
  } = useAuth()

  async function fetchWrapper<T>(
    path: string,
    init?: InitWithQueryParams
  ): Promise<T> {
    // Freddy mock seam: when window.__FREDDY_MOCKS__.enabled is set, route
    // through the in-memory fixture registry instead of issuing real HTTP.
    // Falls through with a console warning when no handler matches, so
    // unmocked endpoints surface during prototype work.
    if (
      typeof window !== 'undefined' &&
      (window as any).__FREDDY_MOCKS__?.enabled
    ) {
      const registry = (window as any).__FREDDY_MOCKS__ as {
        enabled: boolean
        handlers?: Record<
          string,
          (path: string, init?: InitWithQueryParams) => Promise<unknown>
        >
        wildcard?: (
          path: string,
          init?: InitWithQueryParams
        ) => Promise<unknown>
      }
      const handler = registry.handlers?.[path] ?? registry.wildcard
      if (handler) {
        const result = await handler(path, init)
        return result as T
      }
      // eslint-disable-next-line no-console
      console.warn(`[freddy] no mock for "${path}" — returning {}`)
      return Promise.resolve({} as T)
    }

    const url = appendURLQueryParams(
      `${options?.baseURLOverride || baseUrl}${path}`,
      init?.queryParams,
      defaultParams,
      init?.ignoreDefaults
    )

    try {
      let headers = {
        ...init?.headers,
      }

      const token = store.getItem('token')

      if (isDefined(token)) {
        Object.assign(headers, {
          Authorization: `Bearer ${token}`,
        })
      }

      const resp = await fetch(url, {
        ...init,
        headers,
      })

      if (!resp.ok) {
        if (errorHandler) {
          errorHandler(resp)
        }

        const contentType = resp.headers.get('Content-Type')

        if (contentType === 'application/json') {
          try {
            const json = await resp.json()
            return Promise.reject({ statusCode: resp.status, json })
          } catch (error) {
            return Promise.reject({ statusCode: resp.status, json: {} })
          }
        }

        if (contentType === 'text/plain') {
          const text = await resp.text()
          return Promise.reject({ statusCode: resp.status, text })
        }

        return Promise.reject({ statusCode: resp.status })
      }

      if (
        (init?.headers &&
          (init.headers as Record<string, string>)['Content-Type'] ===
            'blob') ||
        resp.headers.get('Content-Type') === 'blob'
      ) {
        return (await resp.blob()) as unknown as T
      }

      if (init?.responseType === 'blob') {
        return (await resp.blob()) as unknown as T
      }

      try {
        // The content type wasn't blob, so we're assuming json for the response type
        return (await resp.json()) as T
      } catch (_error) {
        // If we get a 200, but json parsing failed we still want to resolve the promise with an empty object
        return Promise.resolve({} as T)
      }
    } catch (e) {
      if (errorHandler) {
        errorHandler()
      }
      return Promise.reject(e)
    }
  }

  async function refreshToken() {
    try {
      const data = { refresh_token: tokens.refreshToken }
      const resp = await fetchWrapper<TokenRefreshResponse>('token/refresh', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      authenticate({
        access_token: resp.access_token ?? tokens.accessToken,
        refresh_token: tokens.refreshToken,
      })
    } catch (error) {
      console.error('refresh failed')
      clearTokens()
      throw error
    }
  }

  const fetchWithRefresh = configureRefreshFetch({
    fetch: fetchWrapper,
    shouldRefreshToken,
    refreshToken,
  })

  const addDefaultParams = (body?: BodyInit | null, ignoreDefaults = false) => {
    if (defaultParams && !Array.isArray(body) && !ignoreDefaults) {
      return JSON.stringify({ ...defaultParams, ...(body as object) })
    }
    return JSON.stringify(body)
  }

  return {
    fetch: fetchWithRefresh,
    post: <T,>(
      path: string,
      body?: BodyInit | null,
      init?: InitWithQueryParams
    ) =>
      fetchWithRefresh<T>(path, {
        method: 'POST',
        body: addDefaultParams(body, init?.ignoreDefaults),
        headers: {
          'Content-Type': 'application/json',
          ...defaultHeaders,
          ...init?.headers,
        },
        ...init,
      }),
    postFormData: <T,>(
      path: string,
      body?: BodyInit | null,
      init?: InitWithQueryParams
    ) =>
      fetchWithRefresh<T>(path, {
        method: 'POST',
        body,
        ...init,
      }),
    postBlob: <Blob,>(
      path: string,
      body?: BodyInit | null,
      init?: InitWithQueryParams
    ) =>
      fetchWithRefresh<Blob>(path, {
        method: 'GET',
        body: JSON.stringify(body),
        headers: {
          ...init?.headers,
          'Content-Type': 'blob',
        },
        ...init,
      }),
    uploadFile: <T,>(
      path: string,
      body?: BodyInit | null,
      init?: RequestInit
    ) =>
      fetchWithRefresh<T>(path, {
        method: 'POST',
        body,
        headers: {
          ...init?.headers,
        },
        ...init,
      }),
  }
}
