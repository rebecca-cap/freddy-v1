import { LinkOutlined } from '@ant-design/icons'
import { Horizontal, Texto } from '@gravitate-js/excalibrr'
import { QuoteBookMetadataResponse } from '@modules/PricingEngine/QuoteBook/Api/types.schema'
import { formulaColumnFilterParams } from '@modules/PricingEngine/QuoteBook/Components/Grid/Components/columns/filters/formulaColumnFilterParams'
import { getBenchMark } from '@modules/PricingEngine/QuoteBook/Components/Grid/Components/columns/helpers'
import { getNumSign, isDefinedAndNotNull } from '@utils/index'
import { CellStyle, ColDef, ICellRendererParams } from 'ag-grid-community'
import { Button, Tooltip } from 'antd'
import React from 'react'

interface BenchmarkProps {
  sectionName: string
  metadata?: QuoteBookMetadataResponse
  setIsFormulaBreakdownAndValuationDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>
  setSelectedValuationId: React.Dispatch<React.SetStateAction<number | null>>
  isDemo: boolean
}

export const getBenchMarkColumns = ({
  sectionName,
  metadata,
  setIsFormulaBreakdownAndValuationDrawerOpen,
  setSelectedValuationId,
  isDemo,
}: BenchmarkProps) => {
  if (metadata) {
    const benchmarkColumns: ColDef[] = []
    metadata?.Benchmarks?.forEach((benchmark) => {
      const hideBenchmarkColumn = isDemo && benchmark.Text === 'Spot Move' && sectionName === 'Proposed'
      const hideBenchmarkDiffColumn = isDemo && benchmark.Text === 'Strategy' && sectionName === 'PriorQuotePeriod'

      benchmarkColumns.push(
        BenchmarkColumn({
          sectionName,
          benchmark,
          hideBenchmarkColumn,
          setIsFormulaBreakdownAndValuationDrawerOpen,
          setSelectedValuationId,
        })
      )
      if (sectionName !== 'Proposed')
        benchmarkColumns.push(BenchmarkDiffColumn({ benchmark, sectionName, hideBenchmarkDiffColumn }))
    })
    return benchmarkColumns
  }
  return []
}

const BenchmarkColumn = ({
  sectionName,
  benchmark,
  hideBenchmarkColumn,
  setIsFormulaBreakdownAndValuationDrawerOpen,
  setSelectedValuationId,
}) => ({
  filter: 'agMultiColumnFilter',
  field: `${sectionName}.${benchmark.Value}.Diff`,
  filterParams: {
    filters: [
      formulaColumnFilterParams.filters[0],
      {
        field: 'Status',
        filter: 'agSetColumnFilter',
        display: 'subMenu',
        title: 'Filter by Cost Status',
        filterParams: {
          buttons: ['reset'],
          values: ['Actual', 'Estimated', 'Missing', 'Old'],
          cellRenderer: (params) => {
            if (!params.value.toLowerCase().includes('select all')) {
              return (
                <Texto>
                  {params.value} ({params.value.charAt(0).toUpperCase()})
                </Texto>
              )
            }
            return <Texto>{params.value}</Texto>
          },
          keyCreator: (params) => params.value,
          valueFormatter: (params) => params.value,
          valueGetter: (params) => {
            const benchMark = getBenchMark(benchmark.Value, params, sectionName)
            return benchMark?.Status
          },
        },
      },
    ],
  },
  editable: false,
  hide: !hideBenchmarkColumn,
  minWidth: 100,
  headerName: benchmark.Text,
  cellRenderer: (params: ICellRendererParams) => {
    const benchMark = getBenchMark(benchmark.Value, params, sectionName)

    let statusStyle: React.CSSProperties = { fontStyle: 'italic' }

    switch (benchMark?.StatusSymbol) {
      case 'A':
        statusStyle = { color: 'var(--theme-success-vivid)', fontWeight: 'bold' }
        break
      case 'M':
        statusStyle = { color: 'var(--theme-error-vivid)', fontWeight: 'bold' }
        break
      case 'O':
        statusStyle = { color: 'var(--theme-warning)', fontWeight: 'bold' }
        break
      case null:
      case undefined:
      default:
        statusStyle = { fontStyle: 'italic' }
        break
    }

    return (
      <Tooltip title={benchMark?.PriceId ? 'View valuation' : ''}>
        <Button
          style={{ textAlign: 'left', padding: 0 }}
          type='link'
          onClick={() => {
            if (benchMark?.PriceId) {
              setIsFormulaBreakdownAndValuationDrawerOpen(true)
              setSelectedValuationId(benchMark?.PriceId)
            }
          }}
        >
          {benchMark?.PriceId ? (
            <Horizontal>
              <Texto style={{ gap: '0.5rem', textDecoration: 'underline' }} className='flex items-center'>
                <LinkOutlined />
                {`${getNumSign(benchMark?.Value)}${fmt.currency(benchMark?.Value)}`}
              </Texto>
              {benchMark && benchMark?.StatusSymbol && (
                <Texto style={{ ...statusStyle }} className='mx-2'>
                  ({benchMark?.StatusSymbol})
                </Texto>
              )}
            </Horizontal>
          ) : (
            <Horizontal>
              <Texto category='p1' style={{ gap: '0.5rem' }}>
                N/A
              </Texto>
            </Horizontal>
          )}
        </Button>
      </Tooltip>
    )
  },
  valueGetter: (params) => getBenchMark(benchmark.Value, params, sectionName)?.Value,
})

const BenchmarkDiffColumn = ({ benchmark, hideBenchmarkDiffColumn, sectionName }) => ({
  filter: 'agNumberColumnFilter',
  field: `${sectionName}.${benchmark.Value}`,
  editable: false,
  hide: !hideBenchmarkDiffColumn,
  headerName: `${benchmark.Text} to Price`,
  valueFormatter: ({ value }) => {
    if (isDefinedAndNotNull(value)) {
      const valueAsNumber = parseFloat(value)
      return fmt.currency(valueAsNumber)
    }
    return ''
  },
  cellStyle: (params) => {
    let style: CellStyle = { fontStyle: 'italic' }
    if (params.value < 0) style = { color: 'var(--theme-error)', fontWeight: 'bold' }
    if (params.value > 0) style = { color: 'var(--theme-success)', fontWeight: 'bold' }
    return style
  },
  valueGetter: (params) => {
    const value =
      (parseFloat(getBenchMark(benchmark.Value, params, sectionName)?.Value) || 0) -
      (params?.data?.[`${sectionName}`]?.LastPrice || 0)
    return value
  },
})
