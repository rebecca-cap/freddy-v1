import { Horizontal } from '@gravitate-js/excalibrr'
import {
  getDiffIcon,
  getNestedValue,
  getSign,
} from '@modules/PricingEngine/QuoteBook/components/Grid/components/columns/helpers'
import { hiddenColumn } from '@utils/grid'

interface StrategyColumnProps {
  field: string
  propertyName: string
}
export const rightAlignedTypeNumberColumn = {
  type: 'rightAligned',
  filter: 'agNumberColumnFilter',
}
export const getStrategyColumnDef = ({ field, propertyName }: StrategyColumnProps) => {
  return {
    sortable: true,
    field,
    headerName: 'Diff',
    cellRenderer: (params) => {
      const fieldPath = field === 'Adjustment' && params?.data?.SpreadOverrideId ? 'SpreadOverride' : field

      const value = getNestedValue(params.data, fieldPath) || 0
      // check if we have a spread override then use that value
      return (
        <Horizontal verticalCenter key={params.data?.[propertyName]} style={{ gap: '0.5rem', padding: 0, margin: 0 }}>
          {getDiffIcon(params.data?.[propertyName])} {getSign(value)}
          {fmt.currency(value, fmt.currentPrecision)}
        </Horizontal>
      )
    },
    valueGetter: (params) => {
      if (field === 'Adjustment' && params.data?.SpreadOverrideId) {
        return Number(params.data?.SpreadOverride ?? 0)
      }
      return Number(params.data?.[field] || 0)
    },
  }
}
export const getHiddenStrategyColumn = ({ headerName, field, propertyName }) => ({
  ...hiddenColumn({ title: headerName, field }),
  ...getStrategyColumnDef({ field, propertyName }),
  ...{ headerName },
  maxWidth: 100,
})
export const getHiddenCurrencyColumn = ({ headerName, field }) => ({
  ...hiddenColumn({ title: headerName, field }),
  maxWidth: 100,
  filter: 'agNumberColumnFilter',
  valueFormatter: (params) => fmt.currency(params.value) ?? fmt.currency(0),
})
