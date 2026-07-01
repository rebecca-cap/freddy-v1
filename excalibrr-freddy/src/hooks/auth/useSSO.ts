import { generateRandomString } from '@utils/general'
import { useEffect, useState } from 'react'

import { type ResponseTokens, SSOIdentityProvider } from './types'
import { generateCodeChallenge } from './util'

export type UseSSOParams = {
  providers?: SSOIdentityProvider[]
  callbackUrl?: string // A redirect url to the page that will handle proxying the OAuth2 code back to the server
  authenticateUrl?: string // A url representing the backend endpoint that will handle the OAuth2 code
  onSuccess?: (tokens: ResponseTokens) => void
}

export function useSSO({
  providers = [],
  authenticateUrl,
  callbackUrl,
  onSuccess,
}: UseSSOParams = {}) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const isUsingSSO = !!authenticateUrl && !!callbackUrl

  useEffect(() => {
    async function handleCallback() {
      setLoading(true)
      if (!isUsingSSO) {
        setLoading(false)
        throw new Error('SSO not configured')
      }

      const currentUrl = window.location.href.split('?')[0]
      if (currentUrl !== callbackUrl) {
        setLoading(false)
        return
      }

      const urlParams = new URLSearchParams(window.location.search)
      const error = urlParams.get('error')
      const errorDescription = urlParams.get('error_description')

      if (error) {
        setError(errorDescription || error)
        setLoading(false)
        return
      }

      const code = urlParams.get('code')
      const state = urlParams.get('state')
      const savedState = sessionStorage.getItem('oauth_state')
      const providerId = sessionStorage.getItem('provider_id')

      window.history.replaceState({}, document.title, currentUrl)

      if (code && state === savedState && providerId) {
        const verifier = sessionStorage.getItem('code_verifier')

        try {
          const response = await fetch(authenticateUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              AuthCode: code,
              CodeVerifier: verifier,
              IdentityProviderId: parseInt(providerId),
              callbackUrl,
            }),
          })

          if (!response.ok) {
            setError('Failed to complete authentication')
            setLoading(false)
            throw new Error(`Authentication failed: ${response.statusText}`)
          }

          const data = await response.json()
          if (onSuccess) {
            onSuccess(data)
          }
        } catch (error) {
          console.error('Authentication failed:', error)
          setError('Failed to complete authentication')
        } finally {
          sessionStorage.removeItem('oauth_state')
          sessionStorage.removeItem('provider_id')
          sessionStorage.removeItem('code_verifier')
          setLoading(false)
        }
      } else {
        setError('Failed to complete authentication')
        setLoading(false)
      }
    }
    handleCallback()
  }, [])

  async function initiateFlow(
    providerId: SSOIdentityProvider['IdentityProviderId']
  ) {
    if (!isUsingSSO) {
      throw new Error('SSO not configured')
    }

    const provider = providers.find((p) => p.IdentityProviderId === providerId)
    if (!provider) {
      throw new Error('Provider not found')
    }

    const codeVerifier = generateRandomString(64)
    const codeChallenge = await generateCodeChallenge(codeVerifier)
    const state = generateRandomString(32)

    sessionStorage.setItem('code_verifier', codeVerifier)
    sessionStorage.setItem('oauth_state', state)
    sessionStorage.setItem(
      'provider_id',
      provider.IdentityProviderId.toString()
    )

    const baseParams = {
      client_id: provider.ClientId,
      response_type: 'code',
      redirect_uri: callbackUrl,
      scope: provider.Scopes || '',
      state,
      code_challenge: codeChallenge,
      code_challenge_method: 'S256',
    }

    const allParams = {
      ...baseParams,
      ...provider.AdditionalParams,
    }

    window.location.href = `${provider.AuthorizeUrl}?${new URLSearchParams(
      allParams
    )}`
  }
  const resetState = () => {
    setError(null)
    setLoading(false)
  }

  return {
    error,
    loading,
    providers,
    initiateFlow,
    resetState,
    callbackUrl,
  }
}
