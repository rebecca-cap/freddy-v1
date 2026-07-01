import { MarketPlatformFormulaMetadata } from '@api/useMarketPlatformFormulas/types'
import { IFormulaMetadataResponse } from '@api/usePriceEngineFormulas/types'
import { Horizontal } from '@gravitate-js/excalibrr'
import { PriceStatusColors } from '@modules/Admin/ManagePriceEngineFormulas/components/Grid/columnDefs'
import React from 'react'

export function FormulaValue({ IsMissingPrices, Value, isLoading = false, isDraft = false, PriceStatus }) {
  if (IsMissingPrices === undefined && !isLoading) return <div />
  if (isDraft)
    return (
      <Horizontal className='p-3 bg-warning-dim' justifyContent='space-between'>
        You must first save the formula to calculate the value
      </Horizontal>
    )

  if (isLoading)
    return (
      <Horizontal className='p-3 bg-warning-dim' justifyContent='space-between'>
        Loading Quote Value...
      </Horizontal>
    )
  const backgroundColor = IsMissingPrices
    ? 'var(--theme-error-dim)'
    : PriceStatusColors[PriceStatus] ?? 'var(--theme-success-dim)'

  const text = IsMissingPrices ? 'Missing Prices No Value!' : `Quote Calculated Price: ${fmt.currency(Value)}`

  return (
    <Horizontal className='p-3' justifyContent='space-between' style={{ backgroundColor }}>
      {text}
    </Horizontal>
  )
}

interface INewVariableProps {
  values: any
  metadata: IFormulaMetadataResponse | MarketPlatformFormulaMetadata
}

export const initializeNewVariable = ({ values, metadata }: INewVariableProps) => {
  return {
    ...values,
    ...(values?.PriceTypeCvId && {
      PriceType: metadata?.PriceTypes?.find((pt) => pt.Value === values.PriceTypeCvId.toString())?.Text,
    }),
    ...(values?.ValueEffectiveDateRuleCvId && {
      ValueEffectiveDateRule: metadata?.DateRules?.find(
        (dr) => dr.Value === values.ValueEffectiveDateRuleCvId.toString()
      )?.Text,
    }),
    FormulaVariableId: Math.floor(Math.random() * 1000000), // fake a random ID until the variable is saved. (needed for ag grid)
    ValueSourceCvId: metadata?.Sources?.find((o) => o.Text === 'Database Price')?.Value, // Default source type to Datebase Price
  }
}
