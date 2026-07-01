import { ByChannelGridRow } from '@api/useAnalytics/types'
import { getComputedStyleValue } from '@components/TheArmory/helpers'
import { ByContractGridRow } from '@modules/Analytics/PricePerformance/ByContract/api/types'
import { getGroupValue } from '@modules/Analytics/PricePerformance/components/Grid/gridHelpers'
import { ColDef, ICellRendererParams, TooltipRendererParams, ValueGetterParams } from 'ag-grid-community'
import React from 'react'

import { getFormatter } from '../helpers'
import { AggCellRenderer } from './AggCellRenderer'

type RowGetter = (params: ICellRendererParams | ValueGetterParams) => ByContractGridRow | ByChannelGridRow

interface SharedProps {
  includeProfitTrend?: boolean
  getGroupRowData: RowGetter
  nameColumnHeader?: string
  nameColumnField?: string
}
const strokeColor = getComputedStyleValue(document.documentElement, '--theme-color-2').trim()
const fillColor = getComputedStyleValue(document.documentElement, '--theme-color-2-dim').trim()

const tooltipRenderer = (params: TooltipRendererParams) => {
  const { yValue } = params
  return {
    content: fmt.decimal(yValue),
  }
}
export const getSharedColumnDefs = ({
  includeProfitTrend,
  getGroupRowData,
  nameColumnHeader,
  nameColumnField,
}: SharedProps) => {
  return [
    nameColumnHeader && nameColumnField ? Name(nameColumnHeader, nameColumnField) : null,
    includeProfitTrend ? ProfitTrend(getGroupRowData) : null,
    TotalLifted(getGroupRowData),
    AverageMargin(getGroupRowData),
    TotalProfit(getGroupRowData),
  ].filter((column) => !!column) as ColDef[]
}

const getCellData = (params: ICellRendererParams, getGroupRowData: RowGetter) => {
  const { data } = params
  return params?.node?.group ? getGroupRowData(params) : data
}

export const Name = (nameColumnHeader: string, nameColumnField: string) => ({
  headerName: nameColumnHeader,
  field: nameColumnField,
  filterParams: {
    showTooltips: true,
  },
})

const ProfitTrend = (getGroupRowData: RowGetter) => ({
  headerName: 'Profit Trend',
  field: 'ProfitTrend',
  cellRenderer: 'agSparklineCellRenderer',
  filter: false,
  cellRendererParams: {
    sparklineOptions: {
      type: 'line',
      line: {
        stroke: strokeColor,
        strokeWidth: 2,
      },
      highlightStyle: {
        size: 5,
        fill: fillColor,
        stroke: strokeColor,
      },
      padding: {
        top: 10,
        right: 5,
        bottom: 10,
        left: 5,
      },
      tooltip: {
        renderer: tooltipRenderer,
      },
    },
  },
  valueGetter: (params: ValueGetterParams) => {
    if (params.node?.group && getGroupRowData) {
      return getGroupValue(params, getGroupRowData, 'ProfitTrend')
    }
    return params.data.ProfitTrend
  },
})

const TotalLifted = (getGroupRowData: RowGetter) => ({
  headerName: 'Total Lifted',
  field: 'TotalLifted',
  filter: 'agNumberColumnFilter',
  cellRenderer: (params: ICellRendererParams) => {
    const valueFormatter = getFormatter('Liftings')
    const rowData = getCellData(params, getGroupRowData)
    if (!rowData) return null
    return (
      <AggCellRenderer
        value={rowData?.TotalLifted}
        diff={rowData?.LiftingsDiffFromAverage}
        valueFormatter={valueFormatter}
      />
    )
  },
})
const AverageMargin = (getGroupRowData: RowGetter) => ({
  headerName: 'Average Margin',
  field: 'AverageMargin',
  filter: 'agNumberColumnFilter',
  cellRenderer: (params: ICellRendererParams) => {
    const valueFormatter = getFormatter('Margin')
    const rowData = getCellData(params, getGroupRowData)
    if (!rowData) return null
    return (
      <AggCellRenderer
        value={rowData?.AverageMargin}
        diff={rowData?.MarginDiffFromAverage}
        valueFormatter={valueFormatter}
      />
    )
  },
})
const TotalProfit = (getGroupRowData: RowGetter) => ({
  headerName: 'Total Profit',
  field: 'TotalProfit',
  filter: 'agNumberColumnFilter',
  cellRenderer: (params: ICellRendererParams) => {
    const valueFormatter = getFormatter('Profit')
    const rowData = getCellData(params, getGroupRowData)
    if (!rowData) return null
    return (
      <AggCellRenderer
        value={rowData?.TotalProfit}
        diff={rowData?.ProfitDiffFromAverage}
        valueFormatter={valueFormatter}
      />
    )
  },
})
