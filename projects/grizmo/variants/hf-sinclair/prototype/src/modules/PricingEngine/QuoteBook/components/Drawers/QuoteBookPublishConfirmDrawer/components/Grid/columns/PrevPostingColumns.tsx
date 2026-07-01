import { defaultNumberColumn } from '@components/shared/Grid/defaultColumnDefs/DefaultNumberColumnDef'
import { PublicationModes } from '@modules/PricingEngine/QuoteBook/api/types.schema'
import { numberColWidth } from '@modules/PricingEngine/QuoteBook/components/Drawers/QuoteBookPublishConfirmDrawer/components/Grid/columns/util'

export function PrevPostingColumns(publicationMode: PublicationModes) {
  if (['EndOfDay', 'EndOfDayCurrentPeriod'].includes(publicationMode)) {
    return [
      {
        headerName: 'Prev. Posting',
        children: [Liftings(), Cost(), Diff(), Price()],
      },
    ]
  }
  return []
}

const Liftings = () => ({
  maxWidth: numberColWidth,
  headerName: 'Liftings',
  field: 'PriorQuotePeriod.Liftings',
  valueFormatter: fmt.integer,
  type: 'rightAligned',
  filter: 'agNumberColumnFilter',
})
const Cost = () => ({
  maxWidth: numberColWidth,
  headerName: 'Cost',
  field: 'PriorQuotePeriod.LastCost',
  valueFormatter: fmt.currency,
  type: 'rightAligned',
  filter: 'agNumberColumnFilter',
})
const Diff = () => ({
  maxWidth: numberColWidth,
  headerName: 'Diff',
  field: 'PriorQuotePeriod.LastDiff', // Behind the scenes, this is really just an adjustment to strategy base. Results in proposed price
  valueFormatter: fmt.currency,
  type: 'rightAligned',
  filter: 'agNumberColumnFilter',
})
const Price = () => ({
  maxWidth: numberColWidth,
  headerName: 'Price',
  field: 'PriorQuotePeriod.LastPrice',
  valueFormatter: fmt.currency,
  type: 'rightAligned',
  filter: 'agNumberColumnFilter',
})
