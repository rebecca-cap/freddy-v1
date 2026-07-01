import { dateFilterParams } from '@components/shared/Grid/dateFilterParams'
import { dateFormat } from '@components/TheArmory/helpers'
import { BBDTag, Horizontal } from '@gravitate-js/excalibrr'
import dayjs from '@utils/dayjs'
import { ColDef } from 'ag-grid-community'
import React from 'react'

export const getColumnDefs = (showFullBenchmarkPrice: boolean, metadata: []): ColDef[] => {
  return [PriceInfoColumns(), SalesColumns(), BenchmarkColumns(metadata, showFullBenchmarkPrice)]
}
function dateFormatter({ value }) {
  return dayjs(value).format(dateFormat.DATE_TIME)
}

const PriceInfoColumns = () => ({
  headerName: 'Price Information',
  marryChildren: true,
  children: [StartDate(), EndDate(), QuoteType(), Cost(), Price()],
})

const StartDate = () => ({
  flex: 1,
  width: 300,
  headerName: 'Start',
  field: 'StartDate',
  editable: false,
  filter: 'agDateColumnFilter',
  filterValueGetter: ({ data }) => (data?.StartDate ? dayjs(data.StartDate).startOf('day').toDate() : null),
  filterParams: dateFilterParams,
  valueFormatter: dateFormatter,
})
const EndDate = () => ({
  flex: 1,
  width: 300,
  headerName: 'End',
  field: 'EndDate',
  editable: false,
  valueFormatter: dateFormatter,
  filter: 'agDateColumnFilter',
  filterValueGetter: ({ data }) => (data?.EndDate ? dayjs(data.EndDate).startOf('day').toDate() : null),
  filterParams: dateFilterParams,
})
const QuoteType = () => ({
  headerName: 'Quote Type',
  field: 'IsMidday',
  editable: false,
  minWidth: 100,
  valueGetter: (params) => (params?.data?.IsMidday ? 'Midday' : 'EOD'),
  cellRenderer: (params) => (
    <Horizontal fullHeight verticalCenter>
      {params?.data?.IsMidday ? (
        <BBDTag success style={{ textAlign: 'center', width: 80 }}>
          Midday
        </BBDTag>
      ) : (
        <BBDTag success style={{ textAlign: 'center', width: 80 }}>
          EOD
        </BBDTag>
      )}
    </Horizontal>
  ),
})
const Cost = () => ({
  flex: 1,
  width: 300,
  headerName: 'Cost',
  field: 'LastCost',
  editable: false,
  valueFormatter: fmt.currency,
  filter: 'agNumberColumnFilter',
  cellStyle: { textAlign: 'right' },
})
const Price = () => ({
  flex: 1,
  width: 300,
  headerName: 'Price',
  field: 'LastPrice',
  editable: false,
  valueFormatter: fmt.currency,
  filter: 'agNumberColumnFilter',
  cellStyle: { textAlign: 'right' },
})
const SalesColumns = () => ({
  headerName: 'Sales',
  type: 'rightAligned',
  marryChildren: true,
  children: [Margin(), Liftings(), Profits()],
})
const Margin = () => ({
  flex: 1,
  width: 300,
  headerName: 'Margin',
  field: 'Margin',
  editable: false,
  valueFormatter: fmt.currency,
  filter: 'agNumberColumnFilter',
  cellStyle: { textAlign: 'right' },
})
const Liftings = () => ({
  flex: 1,
  width: 300,
  headerName: 'Liftings',
  filter: 'agNumberColumnFilter',
  field: 'Liftings',
  editable: false,
  valueFormatter: fmt.integer,
  cellStyle: { textAlign: 'right' },
})
const Profits = () => ({
  flex: 1,
  width: 300,
  headerName: 'Profits',
  filter: 'agNumberColumnFilter',
  field: 'Profit',
  editable: false,
  valueFormatter: (params) => fmt.currency(params?.value, 0) ?? fmt.currency(0, 0),
  cellStyle: { textAlign: 'right' },
})
const BenchmarkColumns = (metadata, showFullBenchmarkPrice) => ({
  headerName: 'Benchmarks',
  marryChildren: true,
  children: getBenchMarkColumns(metadata, showFullBenchmarkPrice),
})
function getBenchMarkColumns(metadata, showFullBenchmarkPrice) {
  if (metadata && showFullBenchmarkPrice) {
    return metadata?.Benchmarks?.map((benchmark) => ({
      filter: 'agNumberColumnFilter',
      field: `${benchmark.Text}`,
      editable: false,
      headerName: benchmark.Text,
      valueGetter: (params) =>
        params?.data?.Benchmarks.find((b) => b.BenchmarkId.toString() === benchmark?.Value?.toString())?.Value,
      valueFormatter: fmt.currency,
      cellStyle: { textAlign: 'right' },
    }))
  }
  return []
}
