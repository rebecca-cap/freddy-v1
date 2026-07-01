import { UserControlPanel } from '@components/shared/Navigation/ControlPanel/UserControlPanel'
import { useUser } from '@contexts/UserContext'
import { NavigationContextProvider, useAuth } from '@gravitate-js/excalibrr'
import React, { useEffect, useMemo } from 'react'
import ReactGA from 'react-ga'
import { Outlet, useLocation } from 'react-router-dom'

import { createPageConfig } from '../../../pageConfig'

export function AuthenticatedRoute() {
  const { scopes, userPermissions } = useUser()
  const { clearTokens } = useAuth()
  const location = useLocation()

  // async hack: for now, page config needs to be reloaded once scopes become available
  const pageConfig = useMemo(createPageConfig, [scopes])

  useEffect(() => {
    ReactGA.pageview(location.pathname)
  }, [location.pathname])
  return (
    <NavigationContextProvider
      getScopes={async () => {
        if (userPermissions?.MarketPlatform?.SuperUser) {
          return { ...scopes, SuperUserAdmin: { MPIManagement: true } }
        }
        return scopes
      }}
      handleLogout={clearTokens}
      pageConfig={pageConfig}
      userControlPane={<UserControlPanel />}
      navStyle='vertical'
    >
      <Outlet />
    </NavigationContextProvider>
  )
}
