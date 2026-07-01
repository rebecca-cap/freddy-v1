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
    /*
      NOTE: <ScoutProvider> is NOT here. It is hoisted ABOVE the router
      (around <GateKeeper/> in src/modules/_Main/index.jsx) so it survives the
      excalibrr internal page navigation without remounting — which is what
      keeps the single global timer continuous and all thread/alert state alive
      across pages (TMR-3 / ALR-5). The chrome surfaces (name tag/indicator in
      UserSummary, alert cards in ControlPanel) render via `userControlPane`
      and are descendants of that hoisted provider, so useScout() resolves.
      The QuoteBook page (and its Panel/grid wiring) are likewise descendants.
    */
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
