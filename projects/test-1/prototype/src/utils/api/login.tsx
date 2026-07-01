// Freddy: replaced for proto-base. Original hardcoded a dev-VPN auth URL
// that doesn't resolve outside Gravitate's network and would hang the boot.
// In mock mode the freddy-branch of useAuth pre-seeds tokens, so this code
// path is rarely entered — but keeping the surface in case anything imports it.

interface AuthPayload {
  username: string
  password: string
}

const FREDDY_MOCK_TOKEN = 'freddy.mock.token'

export const login = async (_payload: AuthPayload) => {
  localStorage.setItem('token', FREDDY_MOCK_TOKEN)
  localStorage.setItem('refresh', FREDDY_MOCK_TOKEN)
}

export const hitLogin = async (_payload: AuthPayload) => {
  return new Response(
    JSON.stringify({
      access_token: FREDDY_MOCK_TOKEN,
      refresh_token: FREDDY_MOCK_TOKEN,
    }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  )
}
