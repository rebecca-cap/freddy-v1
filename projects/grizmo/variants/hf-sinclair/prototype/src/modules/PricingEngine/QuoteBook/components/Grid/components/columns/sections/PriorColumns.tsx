import {
  getHiddenCurrencyColumn,
  getHiddenStrategyColumn,
} from '@modules/PricingEngine/QuoteBook/components/Grid/components/columns/ColumnBuilders'
import { getBenchMarkColumns } from '@modules/PricingEngine/QuoteBook/components/Grid/components/columns/sections/BenchmarkColumns'
import { hiddenColumn } from '@utils/grid'

export const PriorColumns = ({
  metadata,
  setIsFormulaBreakdownAndValuationDrawerOpen,
  setSelectedValuationId,
  isDemo,
}) => ({
  headerName: `Prior (${metadata?.TwoBackHeader})`,
  marryChildren: true,
  children: [
    Liftings(),
    Diff(),
    AggregateDiff(),
    Price(),
    AggregatePrice(),
    Profit(),
    ...getBenchMarkColumns({
      sectionName: 'SecondPriorQuotePeriod',
      metadata,
      setIsFormulaBreakdownAndValuationDrawerOpen,
      setSelectedValuationId,
      isDemo,
    }),
  ],
})

const Liftings = () => ({
  ...hiddenColumn({ title: 'Sold Vol', field: 'SecondPriorQuotePeriod.Liftings' }),
  maxWidth: 100,
  valueFormatter: fmt.integer,
})
const Diff = () =>
  getHiddenStrategyColumn({
    headerName: 'Diff',
    field: 'SecondPriorQuotePeriod.LastDiff',
    propertyName: 'SecondPriorQuotePeriod.StrategyType',
  })
const AggregateDiff = () =>
  getHiddenStrategyColumn({
    headerName: 'Aggregate Diff',
    field: 'SecondPriorQuotePeriod.WeightedDiff',
    propertyName: '',
  })
const Price = () => getHiddenCurrencyColumn({ headerName: 'Price', field: 'SecondPriorQuotePeriod.LastPrice' })

const AggregatePrice = () =>
  getHiddenCurrencyColumn({ headerName: 'Aggregate Price', field: 'SecondPriorQuotePeriod.WeightedPrice' })

const Profit = () => getHiddenCurrencyColumn({ headerName: 'Profit.', field: 'SecondPriorQuotePeriod.Profit' })
