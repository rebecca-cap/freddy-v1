export type TokenRefreshResponse = {
  token_type: string
  access_token: string
  expires_in: number
  access_token_expiration: number
  state: string
}

export type ResponseTokens = {
  access_token: string | null
  refresh_token: string | null
  token_type: string
}

export type SSOIdentityProvider = {
  IdentityProviderId: number
  Name: string
  ClientId: string
  Provider: string
  AuthorizeUrl: string
  Scopes: string
  AdditionalParams: Record<string, any>
}
