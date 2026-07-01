import {
  getHiddenStrategyColumn,
  getStrategyColumnDef,
} from '@modules/PricingEngine/QuoteBook/components/Grid/components/columns/ColumnBuilders'
import { getBenchMarkColumns } from '@modules/PricingEngine/QuoteBook/components/Grid/components/columns/sections/BenchmarkColumns'

export const CurrentColumns = ({
  publicationMode,
  metadata,
  setIsFormulaBreakdownAndValuationDrawerOpen,
  setSelectedValuationId,
  isDemo,
}) => ({
  headerName: `${publicationMode === 'EndOfDayCurrentPeriod' ? 'Prior To Current Period:' : 'Current'} (${
    metadata?.OneBackHeader
  })`,
  marryChildren: true,
  children: [
    SoldVolume(),
    ...(publicationMode === 'EndOfDay' ? [Cost()] : []),
    AggregateCost(),
    {
      ...getStrategyColumnDef({
        field: 'PriorQuotePeriod.LastDiff',
        propertyName: 'PriorQuotePeriod.StrategyDiffName',
      }),
      filter: 'agNumberColumnFilter',
      editable: false,
    },
    {
      ...getHiddenStrategyColumn({
        headerName: 'Aggregate Diff',
        field: 'PriorQuotePeriod.WeightedDiff',
        propertyName: '',
      }),
      filter: 'agNumberColumnFilter',
      editable: false,
    },
    {
      filter: 'agNumberColumnFilter',
      field: 'PriorQuotePeriod.PriceDifference',
      editable: false,
      hide: true,
      headerName: 'Price Diff.',
      valueFormatter: (params) => fmt.currency(params.value) ?? fmt.currency(0),
    },
    {
      filter: 'agNumberColumnFilter',
      field: 'PriorQuotePeriod.Profit',
      editable: false,
      headerName: 'Profit',
      valueFormatter: (params) => fmt.currency(params.value, 0) ?? fmt.currency(0, 0),
    },
    ...getBenchMarkColumns({
      sectionName: 'PriorQuotePeriod',
      metadata,
      setIsFormulaBreakdownAndValuationDrawerOpen,
      setSelectedValuationId,
      isDemo,
    }),
    {
      field: 'PriorQuotePeriod.LastPrice',
      editable: false,
      headerName: 'Price',
      filter: 'agNumberColumnFilter',
      valueFormatter: (params) => fmt.currency(params.value) ?? fmt.currency(0),
    },
    {
      filter: 'agNumberColumnFilter',
      field: 'PriorQuotePeriod.WeightedPrice',
      editable: false,
      hide: true,
      headerName: 'Aggregate Price',
      valueFormatter: (params) => fmt.currency(params.value) ?? fmt.currency(0),
    },
  ],
})

export const SoldVolume = () => ({
  filter: 'agNumberColumnFilter',
  field: 'PriorQuotePeriod.Liftings',
  editable: false,
  headerName: 'Sold Vol',
  valueFormatter: fmt.integer,
})

export const Cost = () => ({
  filter: 'agNumberColumnFilter',
  field: 'PriorQuotePeriod.LastCost',
  editable: false,
  headerName: 'Cost',
  valueFormatter: (params) => fmt.currency(params.value) ?? fmt.currency(0),
})

export const AggregateCost = () => ({
  filter: 'agNumberColumnFilter',
  field: 'PriorQuotePeriod.WeightedCost',
  editable: false,
  hide: true,
  headerName: 'Aggregate Cost',
  valueFormatter: (params) => fmt.currency(params.value) ?? fmt.currency(0),
})
