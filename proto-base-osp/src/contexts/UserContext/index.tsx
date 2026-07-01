import type { MetadataListResponseItem } from '@api/globalTypes'
import { useCredentialTyped } from '@api/useCredential/useCredentialTyped'
import type { GetUserInfoResponse, SecurityContext } from '@api/useCredential/responseTypes'
import { useApi, useAuth } from '@gravitate-js/excalibrr'
import { changeResponseToConfig } from '@hooks/useGridViewManager/api/util'
import { createPageConfig } from '@modules/pageConfig'
import { useQuery } from '@tanstack/react-query'
import { clearPendoSession, identifyPendo } from '@utils/pendo/identifyPendo'
import React, { createContext, type ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react'

import type { Permission } from './permissions'

export { Permission } from './permissions'

export type ReadPermissions = { Read: boolean }
export type WritePermission = { Write: boolean }
export type ManagePermission = { Manage: boolean }

export type PermissionActions = {
  Read?: boolean
  Write?: boolean
  Manage?: boolean
}

export type NestedPermissions = {
  [key: string]: PermissionActions
}

export type SuperUserPermission = {
  SuperUser?: boolean
}

export type PermissionsObjectBase = {
  [key: string]: PermissionActions | NestedPermissions | SuperUserPermission | undefined
}

export type KnownPermissions = {
  MarketPlatform?: {
    QuantityDistribution?: PermissionActions | undefined
    OnlineOrder?: PermissionActions | undefined
    SpecialOffer?: PermissionActions | undefined
    SpecialOfferAdmin?: PermissionActions | undefined
    SuperUser?: boolean | undefined
  }
  FormulaTemplates?: PermissionActions
  AuthorizationAllocation?: PermissionActions
}

export type PermissionsObject = PermissionsObjectBase & KnownPermissions
export type UserPayload = {
  user: GetUserInfoResponse | undefined
  securityContext?: SecurityContext
  scopes: object
  availablePageKeys?: string[]
  handleLogout: () => void
  impersonationCounterparties: MetadataListResponseItem[] | undefined
  userPermissions: PermissionsObject | undefined // Legacy - keep for existing code
  permissionSet: Set<string> | undefined // New - for gradual migration
  hasPermission: (permission: Permission | string) => boolean // New - convenience helper
}

const store = window.localStorage

const UserContext = createContext<UserPayload | null>(null)

function reducePermissionsToKeys(permissions) {
  return permissions.reduce((keys, permission) => {
    const { key, routes } = permission

    // Initialize the object with the route name as the key and an empty object as the value
    keys[key] = true

    // If there are sub-routes, recursively generate the keys and assign them to the empty object
    if (routes && routes.length > 0) {
      keys[key] = reducePermissionsToKeys(routes)
    }

    return keys
  }, {})
}
interface UserProviderProps {
  children: ReactNode
  setDefaultHeaders: (headers: object) => void
}

export function UserProvider({ children, setDefaultHeaders }: UserProviderProps) {
  const { clearTokens } = useAuth()
  const api = useApi()

  const { useUserInfoQuery, getImpersonationOptionsQuery } = useCredentialTyped()
  const { data: user } = useUserInfoQuery()
  const { data: impersonationCounterparties } = getImpersonationOptionsQuery()

  const { data: availablePageKeys, isLoading } = useQuery({
    queryKey: ['scopes'],

    queryFn: async () => {
      const data = await (api.post as (endpoint: string, body?: unknown) => Promise<{ Data?: unknown[] }>)(
        'Application/Menu/GetMenuItemsByQuery',
        { MenuName: 'MainMenu' }
      )
      const availablePageKeys1 = { ...reducePermissionsToKeys(data?.Data ?? []) }
      return availablePageKeys1
    },

    refetchOnWindowFocus: false,
  })
  /**
   * Excalibrr is only concerned with the top level keys here when adding modules
   * to the navigation in the pageConfig scan. Any visibility of sub pages is determined
   * by a 'hasPermission' property on that route, so I've cleaned up this hardcoded structure to reflect that behavior.
   */
  const initialScopes = reducePermissionsToKeys(Object.values(createPageConfig()))
  const [scopes, setScopes] = useState(initialScopes)
  const [userPermissions, setUserPermissions] = useState<PermissionsObject | undefined>()
  const [permissionSet, setPermissionSet] = useState<Set<string> | undefined>()

  /**
   * Staple the users avaialble pages to the scopes object whenever they're loaded so they can be used in the page config.
   * This is kind of a hack right now, but won't be needed once the page config becomes fully dynamic.
   * (Prefixing with '$' to denote meta data)
   */

  useEffect(() => {
    if (availablePageKeys) {
      setScopes({ ...availablePageKeys })
    }
  }, [availablePageKeys])

  // Identify the current user with Pendo whenever user info changes. Safe to
  // call before user is loaded (no-ops). The Pendo agent itself is bootstrapped
  // earlier in CacheBuster.jsx so visitor calls land in the queued stub if the
  // network script hasn't finished loading yet.
  useEffect(() => {
    identifyPendo(user)
  }, [user])

  useEffect(() => {
    if (user?.Data) {
      clearBackendSourcedUserCache()
      const isSingleMode =
        user?.Data?.AllowedImpersonationModes?.length === 1 && user?.Data?.AllowedImpersonationModes.includes('Single')
      const localStorageMode = localStorage.getItem('Gravitate-Impersonation-Mode') || (isSingleMode ? 'Single' : 'All')
      const localCounterParty =
        localStorage.getItem('Gravitate-Current-CounterParty') || (isSingleMode ? user?.Data?.CounterPartyId : 'All')

      const impersonationMode = isSingleMode ? 'Single' : localStorageMode
      const currentCounterParty = isSingleMode ? user?.Data?.CounterPartyId : localCounterParty

      localStorage.setItem('Gravitate-Impersonation-Mode', impersonationMode)
      localStorage.setItem('Gravitate-Current-CounterParty', currentCounterParty)
      setDefaultHeaders({
        'Gravitate-Impersonation-Mode': impersonationMode,
        'Gravitate-Current-CounterParty': currentCounterParty,
      })

      setPermissions()
      if (user?.Data?.UserDefinedGridViews?.length > 0) {
        const lists = {}
        user?.Data?.UserDefinedGridViews.forEach((view) => {
          lists[view.Name] ? (lists[view.Name] = [...lists[view.Name], view]) : (lists[view.Name] = [view])
        })
        const keys = Object.keys(lists)
        keys.forEach((key) => {
          const configs = lists[key].map((item) => changeResponseToConfig(item))
          configs.sort((a, b) => a.name.localeCompare(b.name))
          store.setItem(`gridViewList::${key}`, JSON.stringify(configs))
        })
      }
    }
  }, [user])

  function setPermissions() {
    const permissions = user?.Data?.Permissions

    // New: Simple set creation for O(1) permission lookups
    if (permissions) {
      setPermissionSet(new Set(permissions))
    }

    // Legacy: Keep nested object parsing for backward compatibility
    const userPermissionsObject = {}
    permissions?.forEach((permission) => {
      const lastUnderscoreIndex = permission.lastIndexOf('_')
      if (lastUnderscoreIndex === -1) {
        // No underscore found, skip this permission
        return
      }

      const featurePath = permission.substring(0, lastUnderscoreIndex)
      const action = permission.substring(lastUnderscoreIndex + 1)

      // Check if feature path contains underscores (nested structure)
      const parts = featurePath.split('_')
      if (parts.length >= 2) {
        // Two-level permission (e.g., MarketPlatform_QuantityDistribution)
        // Note: 3+ level permissions like MarketPlatform_SpecialOffer_OnlineOrder are also handled here
        // using only the first two parts for backwards compatibility with the legacy nested object
        const [category, feature] = parts
        userPermissionsObject[category] = userPermissionsObject[category] || {}
        userPermissionsObject[category][feature] = userPermissionsObject[category][feature] || {}
        userPermissionsObject[category][feature][action] = true
      } else {
        // Single-level permission (e.g., AllocationMapping_Write)
        userPermissionsObject[featurePath] = { ...userPermissionsObject[featurePath], [action]: true }
      }
    })

    setUserPermissions(userPermissionsObject)
  }

  const handleLogout = () => {
    clearPendoSession()
    clearTokens()
    api.post('token/logoff').then((r) => {})
    clearTokensOnLogout()
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    window.location.href = '/login'
    setScopes(undefined)
  }

  const hasPermission = useCallback(
    (permission: Permission | string): boolean => {
      return permissionSet?.has(permission) ?? false
    },
    [permissionSet]
  )

  const contextValue = useMemo(
    () => ({
      user,
      scopes,
      handleLogout,
      impersonationCounterparties,
      userPermissions,
      permissionSet,
      hasPermission,
    }),
    [user, scopes, handleLogout, impersonationCounterparties, userPermissions, permissionSet, hasPermission]
  )

  return <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
}

export const useUser = () => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('Context must be used within a Provider')
  }
  return context
}

function clearBackendSourcedUserCache() {
  for (const key of Object.keys(store)) {
    if (key.startsWith('gridViewList::')) store.removeItem(key)
  }
  store.removeItem('CommandCenter-PageViews')
}

function clearTokensOnLogout() {
  store.removeItem('tasMode')
  store.removeItem('onlyAssigned')
  store.removeItem('token')
  store.removeItem('refresh')
  store.removeItem('Gravitate-Impersonation-Mode')
  store.removeItem('Gravitate-Current-CounterParty')
  store.removeItem('Authorized')
  clearBackendSourcedUserCache()
}
