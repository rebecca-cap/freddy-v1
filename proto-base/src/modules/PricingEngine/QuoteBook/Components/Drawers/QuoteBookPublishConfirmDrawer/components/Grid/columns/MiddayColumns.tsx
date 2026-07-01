import { CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons'
import { Horizontal, Texto } from '@gravitate-js/excalibrr'
import { isSpreadRow } from '@modules/PricingEngine/Calculations/ManageQuoteRows/Tabs/QuoteSpreads/columnDefs'
import { PublicationModes } from '@modules/PricingEngine/QuoteBook/Api/types.schema'
import { numberColWidth } from '@modules/PricingEngine/QuoteBook/Components/Drawers/QuoteBookPublishConfirmDrawer/components/Grid/columns/util'
import { BulkDiffEditor } from '@modules/PricingEngine/QuoteBook/Components/Grid/Components/cellEditors/BulkDiffEditor'
import { getStrategyColumnDef } from '@modules/PricingEngine/QuoteBook/Components/Grid/Components/columns/ColumnBuilders'
import { getMiddayStyle } from '@modules/PricingEngine/QuoteBook/Components/Grid/Components/columns/helpers'
import { message } from 'antd'
import React from 'react'

export function MiddayColumns(publicationMode: PublicationModes) {
  if (publicationMode === 'IntraDay') {
    return [PreviousPrice(), Diff(), Price(), Margin(), PrevToProposed()]
  }
  return []
}

const PreviousPrice = () => ({
  field: 'PriorQuotePeriod.LastPrice',
  filter: 'agNumberColumnFilter',
  editable: false,
  headerName: 'Previous Price',
  cellStyle: (params) => ({
    fontWeight: 'bold',
  }),
  cellRenderer: (params) => {
    return (
      <Horizontal verticalCenter justifyContent='right'>
        <Texto style={{ gap: '0.5rem' }} className='flex items-center'>
          {`${fmt.currency(params?.data?.PriorQuotePeriod?.LastPrice)}`}
        </Texto>
      </Horizontal>
    )
  },
})
const Diff = () => ({
  ...getStrategyColumnDef({ field: 'Adjustment', propertyName: 'QuoteStrategyDiffName' }),
  editable: false,
  isBulkEditable: true,
  headerName: 'Diff',
  bulkCellEditor: BulkDiffEditor,
  type: 'rightAligned',
  filter: 'agNumberColumnFilter',
  cellStyle: (params) => {
    let style = {}
    if (isSpreadRow(params))
      style = {
        color: 'var(--gray-400)',
        fontStyle: 'italic',
        pointerEvents: 'none',
      }
    return { ...style, ...getMiddayStyle(params.value) }
  },
  cellRenderer: (params) => {
    return (
      <Horizontal verticalCenter justifyContent='right'>
        <Texto style={{ fontWeight: 600 }}>{fmt.currency(params.value)}</Texto>
        {params.value > 0 && (
          <CaretUpOutlined className='ml-1' style={{ fontSize: 15, color: 'var(--theme-success)' }} />
        )}
        {params.value < 0 && (
          <CaretDownOutlined className='ml-1' style={{ fontSize: 15, color: 'var(--theme-error)' }} />
        )}
      </Horizontal>
    )
  },
  valueSetter: (params) => {
    const newDiff = Number(params.newValue)
    if (!params.data || !params.newValue || isNaN(newDiff)) return false
    const newPrice = Number(params.data?.StrategyBase?.Value) + newDiff

    params.data.ProposedPrice = newPrice
    params.data.Adjustment = params.newValue
    return true
  },
})
const Price = () => ({
  editable: false,
  field: 'ProposedPrice',
  type: 'rightAligned',
  filter: 'agNumberColumnFilter',
  headerName: 'Price',
  cellStyle: (params) => {
    let style = {}
    if (isSpreadRow(params)) style = { color: 'var(--gray-400)', fontStyle: 'italic', pointerEvents: 'none' }
    if (params.data?.QuoteStrategyDiff < 0) style = { color: 'var(--theme-warning)' }
    return {
      ...style,
      fontWeight: 'bold',
    }
  },
  valueFormatter: fmt.currency,
  valueSetter: (params) => {
    const newPrice = Number(params.newValue)
    if (isNaN(newPrice)) return false

    if (newPrice < 0) {
      message.error('Price cannot be negative')
      return false
    }

    const newDiff = Number(params.newValue) - Number(params.data?.StrategyBase?.Value)
    params.data.Adjustment = newDiff
    params.data.ProposedPrice = params.newValue
    return true
  },
})
const Margin = () => ({
  minWidth: 90,
  field: 'Margin',
  type: 'rightAligned',
  filter: 'agNumberColumnFilter',
  editable: false,
  valueGetter: (params) => params?.data?.ProposedPrice - params?.data?.Cost,
  valueFormatter: fmt.currency,
  cellStyle: (params) => {
    const style: React.CSSProperties = { fontWeight: 'bold' }
    if (params.value < 0) {
      style.backgroundColor = 'var(--theme-error-dim)'
      style.color = 'var(--theme-error)'
    }
    if (params.value > 0) {
      style.backgroundColor = 'var(--theme-success-dim)'
      style.color = 'var(--theme-success)'
    }
    return style
  },
})
const PrevToProposed = () => ({
  headerName: 'Prev. To Proposed',
  minWidth: 200,
  children: [
    {
      headerName: 'Price Delta',
      field: 'ProposedPrice',
      maxWidth: numberColWidth,
      valueGetter: (params) => {
        if (!params.data) return null
        const lastPrice = params.data.PriorQuotePeriod?.LastPrice
        if (lastPrice == null || params.data.ProposedPrice == null) return null
        return params.data.ProposedPrice - lastPrice
      },
      valueFormatter: (params) => params?.value ?? 'N/A',
      cellStyle: (params) => {
        let style = {}
        if (params.value < 0) style = { backgroundColor: 'var(--theme-warning-dim)', color: 'var(--theme-warning)' }
        if (params.value > 0) style = { backgroundColor: 'var(--theme-success-dim)', color: 'var(--theme-success)' }
        return style
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
})
