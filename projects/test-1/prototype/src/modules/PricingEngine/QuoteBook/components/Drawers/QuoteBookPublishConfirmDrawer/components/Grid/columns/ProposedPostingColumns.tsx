import { isSpreadRow } from '@modules/PricingEngine/Calculations/ManageQuoteRows/Tabs/QuoteSpreads/columnDefs'
import { PublicationModes } from '@modules/PricingEngine/QuoteBook/api/types.schema'
import {
  numberColWidth
} from '@modules/PricingEngine/QuoteBook/components/Drawers/QuoteBookPublishConfirmDrawer/components/Grid/columns/util'
import {
  updateRowPricingDataOnValueChange
} from '@modules/PricingEngine/QuoteBook/components/Grid/components/columns/helpers'

export function ProposedPostingColumns(publicationMode: PublicationModes, isUsingMarketMove?: boolean) {
  if (['EndOfDay', 'EndOfDayCurrentPeriod'].includes(publicationMode)) {
    return [
      {
        headerName: 'Proposed Posting',
        children: [
          Base(),
          MarketMove(isUsingMarketMove),
          MarketMoveOverride(isUsingMarketMove),
          Diff(),
          Price(),
          Margin(),
        ],
      },
    ]
  }
  return []
}
const Base = () => ({
  maxWidth: numberColWidth,
  headerName: 'Base',
  field: 'StrategyBase.Value',
  valueFormatter: fmt.currency,
  type: 'rightAligned',
  filter: 'agNumberColumnFilter',
})
const MarketMove = (isUsingMarketMove?: boolean) => ({
  maxWidth: numberColWidth,
  headerName: 'Market Move',
  field: 'MarketMoveValue',
  type: 'rightAligned',
  valueFormatter: fmt.decimal,
  filter: 'agNumberColumnFilter',
  hide: !isUsingMarketMove,
})
const MarketMoveOverride = (isUsingMarketMove?: boolean) => ({
  maxWidth: numberColWidth,
  headerName: 'Market Move Override',
  field: 'MarketMoveOverride',
  type: 'rightAligned',
  valueFormatter: fmt.decimal,
  filter: 'agNumberColumnFilter',
  hide: !isUsingMarketMove,
})
const Diff = () => ({
  maxWidth: numberColWidth,
  headerName: 'Diff',
  field: 'Adjustment',
  type: 'rightAligned',
  valueFormatter: fmt.currency,
  cellStyle: (params) =>
    isSpreadRow(params) ? { color: 'var(--gray-400)', fontStyle: 'italic', pointerEvents: 'none' } : {},
  filter: 'agNumberColumnFilter',
  valueGetter: (params) => (params?.data?.SpreadOverrideId ? params?.data?.SpreadOverride : params?.data?.Adjustment),
})
const Price = () => ({
  maxWidth: numberColWidth,
  headerName: 'Price',
  field: 'ProposedPrice',
  type: 'rightAligned',
  valueFormatter: fmt.currency,
  cellStyle: (params) =>
    isSpreadRow(params) ? { color: 'var(--gray-400)', fontStyle: 'italic', pointerEvents: 'none' } : {},
  filter: 'agNumberColumnFilter',
  valueSetter: (params) => updateRowPricingDataOnValueChange({ changedField: 'ProposedPrice', params }),
  valueGetter: (params) => {
    const adjustmentValue = params?.data?.SpreadOverride ?? params?.data?.Adjustment
    // eslint-disable-next-line no-unsafe-optional-chaining
    if (isSpreadRow(params)) return params?.data?.StrategyBase?.Value + adjustmentValue
    return params?.data?.ProposedPrice
  },
})
const Margin = () => ({
  headerName: 'Margin',
  field: 'Margin',
  editable: false,
  valueGetter: (params) => {
    const adjustmentValue = params?.data?.SpreadOverride ?? params?.data?.Adjustment
    const proposedPrice = isSpreadRow(params) ? params?.data?.StrategyBase?.Value + adjustmentValue:  params?.data?.ProposedPrice

    return proposedPrice - params?.data?.Cost
  },
  valueFormatter: fmt.currency,
  cellStyle: (params) => {
    let style: React.CSSProperties = { fontWeight: 'bold' }
    if (params.value < 0) style = { backgroundColor: 'var(--theme-error-dim)', fontWeight: 'bold' }
    if (params.value > 0) style = { backgroundColor: 'var(--theme-success-dim)', fontWeight: 'bold' }
    return style
  },
  type: 'rightAligned',
  filter: 'agNumberColumnFilter',
})
