import './styles.css'

import { ThemeContextProvider } from '@gravitate-js/excalibrr'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React, { useEffect, useMemo } from 'react'

import { EnvironmentConfigProvider, useEnvironmentConfig } from './api/useEnvironmentConfig'
import CacheBuster from './components/shared/CacheBuster'
import { getFilteredThemes, themeConfigs } from './components/shared/Theming/themeconfigs'
import { Main } from './modules/_Main'

const queryClient = new QueryClient({ defaultOptions: { queries: { refetchOnWindowFocus: false, retry: false } } })

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* <ReactQueryDevtools initialIsOpen /> */}
      <EnvironmentConfigProvider>
        <ThemeWrapper themeConfigs={themeConfigs} />
      </EnvironmentConfigProvider>
    </QueryClientProvider>
  )
}

function ThemeWrapper({ themeConfigs }) {
  const { configQuery } = useEnvironmentConfig()

  const filteredConfigs = useMemo(() => getFilteredThemes(configQuery?.data), [configQuery?.data])

  useEffect(() => {
    const keys = Object.keys(filteredConfigs || {})
    if (!keys.length) return // wait for real data

    const stored = localStorage.getItem('TYPE_OF_THEME') || ''
    const isValid = keys.includes(stored)

    // Prefer the declared default within the *filtered* set; else the first
    const declaredDefault = keys.find((k) => (filteredConfigs as any)[k]?.default)
    const fallback = declaredDefault ?? keys[0]

    // Only set when missing or invalid — do NOT override a valid user selection
    if (!stored || !isValid) {
      localStorage.setItem('TYPE_OF_THEME', fallback)
    }
  }, [filteredConfigs])

  if (!filteredConfigs || Object.keys(filteredConfigs).length === 0) {
    return null // first render before config arrives
  }

  return (
    <ThemeContextProvider themeConfigs={filteredConfigs}>
      <CacheBuster>
        {({ loading, isLatestVersion, refreshCacheAndReload }) => {
          if (loading) return null
          if (!loading && !isLatestVersion) {
            refreshCacheAndReload()
          }
          return <Main />
        }}
      </CacheBuster>
    </ThemeContextProvider>
  )
}
