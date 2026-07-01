import { ThemeConfigDisplay } from '@components/shared/Theming/themeconfigs'
import { useQuery } from '@tanstack/react-query'
import { isDefinedAndNotNull } from '@utils/index'
import React, { createContext, useContext, useEffect, useMemo } from 'react'

import { getAPIURL } from '../../modules/_Main'

export const endpoints = {
  theme: `${getAPIURL()}configuration`,
}

export type ConfigurationResponse = {
  DecimalPrecision: number
  Theme: {
    Default: ThemeConfigDisplay
    Options: ThemeConfigDisplay[]
  }
}

const EnvironmentConfigContext = createContext<{
  configQuery: ReturnType<typeof useQuery>
  fmt: typeof fmt
} | null>(null)

/**
  * A little guard function to determine if the input is from a user or ag-grid. This let's us pass the formatter directly
  * to a column without having to proxy the call explicitly. eg:
  * `valueFormatter: fmt.currency` instead of `valueFormatter: (params) => fmt.* currency(params.value)`

  * For reasons unknown to mortals, typeof null == 'object' in javascript, which ag grid columns can pass intermittently as 
  * data is being fetched from the api - hence the exclusion of undefined and null values first. 
 */
const isCellRendererParams = (input: any) => isDefinedAndNotNull(input) && typeof input === 'object' && 'value' in input

type CreateFormatterParams = ConstructorParameters<typeof Intl.NumberFormat>

const createFormatter = (...formatterParams: CreateFormatterParams) => {
  return (rawInput: any, precisionOverride?: number) => {
    const number = isCellRendererParams(rawInput) ? rawInput.value : rawInput
    if (Number.isNaN(number) || !isDefinedAndNotNull(number)) return ''

    const formatter = new Intl.NumberFormat(formatterParams[0], {
      ...formatterParams[1],
      minimumFractionDigits: precisionOverride ?? formatterParams[1]?.minimumFractionDigits,
      maximumFractionDigits: precisionOverride ?? formatterParams[1]?.maximumFractionDigits,
    })

    return formatter.format(number)
  }
}

export function EnvironmentConfigProvider({ children }: { children: React.ReactNode }) {
  const configQuery = useQuery(
    [endpoints.theme],
    async () => {
      const resp = await fetch(endpoints.theme, { method: 'POST' })
      const json = (await resp.json()) as ConfigurationResponse
      return json
    },
    {
      refetchOnWindowFocus: false,
    }
  )

  // Whenever config changes, we'll recreate the formatters with the new decimal precision
  const fmt = useMemo(() => {
    return {
      currency: createFormatter('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: configQuery?.data?.DecimalPrecision,
        maximumFractionDigits: configQuery?.data?.DecimalPrecision,
      }),

      decimal: createFormatter('en-US', {
        minimumFractionDigits: configQuery?.data?.DecimalPrecision,
        maximumFractionDigits: configQuery?.data?.DecimalPrecision,
      }),

      integer: createFormatter('en-US'),

      currentPrecision: configQuery?.data?.DecimalPrecision,

      marginDecimal: (value: number): string => {
        if (!value) return '.0000'
        const num = value.toFixed(4)
        if (num.startsWith('0.')) {
          return num.slice(1, num.length)
        }
        if (num.startsWith('-0.')) {
          return `-${num.slice(2, num.length)}`
        }
        return num
      },
    }
  }, [configQuery?.data?.DecimalPrecision])

  // Hack: We use these formatters a lot in ag-grid column definitions, but those are
  // usually cached via useMemo. This makes the formatters available globally on the
  // window object so that we can use them without needing imports / context sharing.

  // We're still returning the fmt object from the context though so it can still be used
  // the 'react' way if needed.

  // const {fmt} = useEnvironmentConfig() [ as long as you're within the provider ]
  useEffect(() => {
    Object.defineProperty(window, 'fmt', {
      value: fmt,
      configurable: true,
    })
  }, [fmt.currency, fmt.decimal, fmt.integer])

  return <EnvironmentConfigContext.Provider value={{ configQuery, fmt }}>{children}</EnvironmentConfigContext.Provider>
}

export const useEnvironmentConfig = () => {
  const ctx = useContext(EnvironmentConfigContext)
  if (!ctx) {
    throw new Error('useEnvironmentConfig must be used within a EnvironmentConfigProvider')
  }
  return ctx
}
