export type QueryParams = URLSearchParams | string

export type InitWithQueryParams = RequestInit & {
  queryParams?: QueryParams
  ignoreDefaults?: boolean
  responseType?: string
}

export function appendURLQueryParams(
  url: string,
  queryParams?: QueryParams,
  defaultParams = {},
  ignoreDefaults = false
) {
  let formattedUrl = url
  if (!queryParams && (!defaultParams || ignoreDefaults)) return url
  if (queryParams) {
    formattedUrl += `?${
      typeof queryParams === 'string'
        ? queryParams
        : queryParams?.toString() || ''
    }`
  }
  if (defaultParams && !ignoreDefaults) {
    formattedUrl += `${queryParams ? '&' : '?'}${new URLSearchParams(
      defaultParams
    )}`
  }

  return formattedUrl
}

export function shouldRefreshToken(
  error: { statusCode: number; json?: object } | number
) {
  if (typeof error === 'number') {
    return error === 401
  } else {
    return error?.statusCode === 401
  }
}

export async function generateCodeChallenge(verifier: string) {
  const encoder = new TextEncoder()
  const data = encoder.encode(verifier)
  const digest = await crypto.subtle.digest('SHA-256', data)

  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
}
