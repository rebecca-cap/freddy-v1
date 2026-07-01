import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react'

import type { ResponseTokens, SSOIdentityProvider } from './types'
import { useSSO } from './useSSO'

export type AuthProviderState = {
  defaultParams?: object
  defaultHeaders?: object
  tokens: {
    accessToken: string | null
    refreshToken: string | null
  }
  authenticate: Function
  clearTokens: Function
  isLoading: boolean
  baseUrl: string
  errorHandler?: Function
  sso?: ReturnType<typeof useSSO>
}

const AuthContext = createContext<AuthProviderState>({
  defaultParams: {},
  defaultHeaders: {},
  tokens: {
    accessToken: null,
    refreshToken: null,
  },
  authenticate: () => {},
  clearTokens: () => {},
  isLoading: true,
  baseUrl: '',
  sso: {
    error: null,
    loading: false,
    providers: [],
    initiateFlow: async () => {},
    resetState: () => {},
    callbackUrl: '',
  },
})

interface AuthProviderProps {
  children: ReactNode
  baseUrl: string
  defaultParams?: object
  logoutCallback?: () => void | null
  errorHandler?: () => void | null
  defaultHeaders?: object
  // all existing props on the context 👆🏼
  ssoConfig?: {
    providers: SSOIdentityProvider[]
    authenticateUrl: string
    callbackUrl: string
  }
}

export function AuthProvider({
  children,
  baseUrl,
  logoutCallback,
  errorHandler,
  defaultParams,
  defaultHeaders,
  ssoConfig,
}: AuthProviderProps) {
  const [isLoading, setLoading] = useState(true)
  const [accessToken, setAcccessToken] = useState<string | null>(null)
  const [refreshToken, setRefreshToken] = useState<string | null>(null)

  const sso = useSSO({
    ...ssoConfig,
    onSuccess: (tokens) => {
      authenticate(tokens)
      window.location.href = '/'
      window.history.replaceState({}, document.title, '/')
    },
  })

  useEffect(() => {
    // Freddy mock seam: in mock mode, seed a fake token so the app boots
    // past auth without a real /token/authorize round-trip.
    if (
      typeof window !== 'undefined' &&
      (window as any).__FREDDY_MOCKS__?.enabled
    ) {
      const fakeToken = 'freddy.mock.token'
      localStorage.setItem('token', fakeToken)
      localStorage.setItem('refresh', fakeToken)
      setAcccessToken(fakeToken)
      setRefreshToken(fakeToken)
      setLoading(false)
      return
    }

    const storedAccessToken = localStorage.getItem('token')
    const storedRefreshToken = localStorage.getItem('refresh')

    if (storedAccessToken) {
      setAcccessToken(storedAccessToken)
    }

    if (storedRefreshToken) {
      setRefreshToken(storedRefreshToken)
    }

    setLoading(false)
  }, [])

  function authenticate(responseTokens: ResponseTokens) {
    if (responseTokens.access_token) {
      setAcccessToken(responseTokens.access_token)
      localStorage.setItem('token', responseTokens.access_token)
    }

    if (responseTokens.refresh_token) {
      setRefreshToken(responseTokens.refresh_token)
      localStorage.setItem('refresh', responseTokens.refresh_token)
    }
    setLoading(false)
  }

  function clearTokens() {
    setAcccessToken(null)
    setRefreshToken(null)
    const lastUsername = sessionStorage.getItem('username')
    sessionStorage.clear()

    if (lastUsername) {
      sessionStorage.setItem('username', lastUsername)
    }
    if (logoutCallback) {
      logoutCallback()
    }
    setLoading(false)
  }

  return (
    <AuthContext.Provider
      value={{
        isLoading,
        tokens: {
          accessToken,
          refreshToken,
        },
        authenticate,
        clearTokens,
        baseUrl,
        errorHandler,
        defaultParams,
        defaultHeaders,
        sso,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
