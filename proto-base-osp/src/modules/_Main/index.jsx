import 'react-date-range/dist/styles.css'
import 'react-date-range/dist/theme/default.css'

import { UserProvider } from '@contexts/UserContext'
import { AuthProvider, useAuth, useLocalStorage } from '@gravitate-js/excalibrr'
import { UnsubscribePage } from '@modules/Public/Unsubscribe/page'
import * as Sentry from '@sentry/react'
import { useQuery } from '@tanstack/react-query'
import { Spin } from 'antd'
import React, { useEffect, useMemo, useState } from 'react'
import {
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
  Outlet,
  Route,
  RouterProvider,
} from 'react-router-dom'

import { AuthenticatedRoute } from './routes/AuthenticatedRoute'
import { SiteLogin } from './routes/Login'

// ReactGA.initialize('UA-218772036-1')

const handleLogout = () => {
  localStorage.removeItem('tasMode')
  localStorage.removeItem('onlyAssigned')
}

export function Main() {
  const apiURL = useMemo(() => getAPIURL())
  const { value: activeLink, setValue: setActiveLink } = useLocalStorage('next_page_redirect_link', '')

  const { data: ssoProviders } = useQuery({
    queryKey: ['ssoProviders'],
    queryFn: async () => {
      const resp = await fetch(`${apiURL}sso/List`, { method: 'POST' })
      return resp.json()
    },
  })

  const impersonationMode = localStorage.getItem('Gravitate-Impersonation-Mode')
  const currentCounterParty = localStorage.getItem('Gravitate-Current-CounterParty')

  const [defaultHeaders, setDefaultHeaders] = useState({
    'Gravitate-Impersonation-Mode': impersonationMode,
    'Gravitate-Current-CounterParty': currentCounterParty,
  })
  const ssoRedirectFunction = () => {
    window.location.href = activeLink || '/'
    window.history.replaceState({}, document.title, activeLink || '/')
    setActiveLink()
  }

  return (
    <Sentry.ErrorBoundary showDialog>
      <AuthProvider
        redirectFunction={ssoRedirectFunction}
        errorHandler={(resp) => {}}
        baseUrl={apiURL}
        logoutCallback={handleLogout}
        defaultHeaders={defaultHeaders}
        ssoConfig={{
          providers: ssoProviders,
          authenticateUrl: `${apiURL}sso/Authenticate`,
          callbackUrl: `${window.location.origin}/ssoAuth`,
        }}
      >
        <GateKeeper setDefaultHeaders={setDefaultHeaders} setActiveLink={setActiveLink} />
      </AuthProvider>
    </Sentry.ErrorBoundary>
  )
}

function GateKeeper({ setDefaultHeaders, setActiveLink }) {
  // createRoutesFromElements is needed to support the useNavigationBlock hook, but there is an issue with
  // the routes below not propagating errors to the error boundary above in Main 👆🏼. So as a fix, we're
  // adding wrapping all routes in an additional error boundary.
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route
        path='*'
        element={
          <Sentry.ErrorBoundary showDialog>
            <Outlet />
          </Sentry.ErrorBoundary>
        }
      >
        <Route path='login' exact element={<SiteLogin />} />
        <Route path='unsubscribe' exact element={<UnsubscribePage />} />
        <Route
          path='*'
          element={<AuthRedirect setDefaultHeaders={setDefaultHeaders} setActiveLink={setActiveLink} />}
        />
        <Route path='ssoAuth' element={<SiteLogin />} />
      </Route>
    )
  )

  return <RouterProvider router={router} />
}

function AuthRedirect({ setDefaultHeaders, setActiveLink }) {
  const { tokens, isLoading } = useAuth()
  if (isLoading) return <Spin />

  if (tokens?.accessToken) {
    return (
      <UserProvider setDefaultHeaders={setDefaultHeaders}>
        <AuthenticatedRoute />
      </UserProvider>
    )
  }

  let redirectUrl = '/login'

  let specialOffersPath = window.location.pathname
  if (specialOffersPath?.length > 1 && !specialOffersPath.includes('login') && !specialOffersPath.includes('sso')) {
    redirectUrl = `/login?code=${specialOffersPath}`
    setActiveLink(specialOffersPath)
    window.localStorage.removeItem('last_page_section')
  }
  return <Navigate to={redirectUrl} />
}

export function getAPIURL(urlOverride) {
  const url = urlOverride || import.meta.env.VITE_API_URL || window.location.href
  // starting on the 8th character after "http://" or "https://", find '/'
  const slash_loc = url.indexOf('/', 8)
  let cutURL = url.substr(0, slash_loc + 1)
  const hasTrailingSlash = cutURL.lastIndexOf('/') === cutURL.length - 1
  if (!hasTrailingSlash) {
    cutURL += '/'
  }

  return `${cutURL}api/`
}
