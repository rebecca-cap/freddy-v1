import { CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons'
import { Horizontal } from '@gravitate-js/excalibrr'
import { isSpreadRow } from '@modules/PricingEngine/Calculations/ManageQuoteRows/Tabs/QuoteSpreads/columnDefs'
import { PublicationModes } from '@modules/PricingEngine/QuoteBook/Api/types.schema'
import { numberColWidth } from '@modules/PricingEngine/QuoteBook/Components/Drawers/QuoteBookPublishConfirmDrawer/components/Grid/columns/util'
import React from 'react'

export function PrevToProposedColumn(publicationMode: PublicationModes) {
  if (publicationMode === 'EndOfDay') {
    return [
      {
        headerName: 'Prev. To Proposed',
        minWidth: 200,
        children: [
          {
            headerName: 'Price Delta',
            field: 'ProposedPrice',
            maxWidth: numberColWidth,
            valueGetter: (params) => {
              if (!params.data) return null // Guard for group rows
              const lastPrice = params.data.PriorQuotePeriod?.LastPrice
              if (lastPrice == null) return null
              if (isSpreadRow(params)) {
                const adjustmentValue = params?.data?.SpreadOverride ?? params?.data?.Adjustment

                return (params?.data?.StrategyBase?.Value || 0) + (adjustmentValue || 0) - lastPrice
              }
              if (params.data.ProposedPrice == null) return null
              return params.data.ProposedPrice - lastPrice
            },
            valueFormatter: (params) => params?.value ?? 'N/A',
            cellStyle: (params) => {
              let style = {}
              if (params.value < 0)
                style = { backgroundColor: 'var(--theme-warning-dim)', color: 'var(--theme-warning)' }
              if (params.value > 0)
                style = { backgroundColor: 'var(--theme-success-dim)', color: 'var(--theme-success)' }
              return { ...style }
            },
            cellRenderer: (params) => {
              const getCaret = (value: number) => {
                if (value < 0) return <CaretDownOutlined style={{ color: 'var(--theme-warning-dim)' }} />
                if (value > 0) return <CaretUpOutlined style={{ color: 'var(--theme-success)' }} />
                return null
              }
              return (
                <Horizontal gap='0.5rem' justifyContent='right'>
                  {fmt.currency(params?.value || 0)}
                  {getCaret(params?.value)}
                </Horizontal>
              )
            },
          },
        ],
      },
    ]
  }
  return []
}
