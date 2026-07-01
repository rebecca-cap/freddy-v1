/**
 * Shared helper for FormData file uploads via raw fetch.
 *
 * The typed API client (openapi-fetch) does not support multipart/form-data uploads,
 * so these endpoints require raw fetch(). This helper centralizes auth, URL normalization,
 * and response.ok checking that all upload call sites need.
 */
export async function fetchUploadFile<T>(
  baseUrl: string,
  endpoint: string,
  formData: FormData,
): Promise<T> {
  const token = localStorage.getItem('token')
  const normalizedBaseUrl = baseUrl.replace(/\/api\/?$/, '')
  const response = await fetch(`${normalizedBaseUrl}${endpoint}`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: formData,
  })
  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({ message: response.statusText }))
    throw errorBody
  }
  return response.json()
}
