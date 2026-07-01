import { LinkOutlined } from '@ant-design/icons'
import { Horizontal, Texto } from '@gravitate-js/excalibrr'
import { isSpreadRow } from '@modules/PricingEngine/Calculations/ManageQuoteRows/Tabs/QuoteSpreads/columnDefs'
import { PublicationModes, Quote, QuoteBookMetadataResponse } from '@modules/PricingEngine/QuoteBook/api/types.schema'
import { BulkDiffEditor } from '@modules/PricingEngine/QuoteBook/components/Grid/components/cellEditors/BulkDiffEditor'
import {
  BulkMarketMoveOverrideEditor
} from '@modules/PricingEngine/QuoteBook/components/Grid/components/cellEditors/BulkMarketMoveOverrideEditor'
import {
  BulkPriceEditor
} from '@modules/PricingEngine/QuoteBook/components/Grid/components/cellEditors/BulkPriceEditor'
import {
  getStrategyColumnDef
} from '@modules/PricingEngine/QuoteBook/components/Grid/components/columns/ColumnBuilders'
import {
  formulaColumnFilterParams
} from '@modules/PricingEngine/QuoteBook/components/Grid/components/columns/filters/formulaColumnFilterParams'
import {
  getDiffIconByStrategyBase,
  getDirtyCellStyle,
  updateRowPricingDataOnValueChange
} from '@modules/PricingEngine/QuoteBook/components/Grid/components/columns/helpers'
import {
  getBenchMarkColumns
} from '@modules/PricingEngine/QuoteBook/components/Grid/components/columns/sections/BenchmarkColumns'
import { PublicationModeOptions } from '@modules/PricingEngine/QuoteBook/type.schema'
import { getNumSign, isDefinedAndNotNull } from '@utils/index'
import { CellClassParams, ICellRendererParams, ValueSetterParams } from 'ag-grid-community'
import { Button, Tooltip } from 'antd'
import React from 'react'

interface EODProposedColumnsProps {
  publicationMode?: PublicationModes
  metadata?: QuoteBookMetadataResponse
  canWrite: boolean
  setIsFormulaBreakdownAndValuationDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>
  setSelectedValuationId: React.Dispatch<React.SetStateAction<number | null>>
  originalRows?: Quote[]
  isDemo: boolean
  isUsingMarketMove: boolean
  setSelectedValuationRow: React.Dispatch<React.SetStateAction<Quote | null>>
  setIsMarketMoveBreakdownAndValuationDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export const ProposedColumns = ({
  publicationMode,
  setIsFormulaBreakdownAndValuationDrawerOpen,
  setSelectedValuationId,
  originalRows,
  canWrite,
  metadata,
  isDemo,
  isUsingMarketMove,
  setSelectedValuationRow,
  setIsMarketMoveBreakdownAndValuationDrawerOpen,
}: EODProposedColumnsProps) => {
  const isEndOfDay =
    publicationMode === PublicationModeOptions.EndOfDay ||
    publicationMode === PublicationModeOptions.EndOfDayCurrentPeriod

  if (isEndOfDay) {
    return [
      {
        headerName:
          publicationMode === PublicationModeOptions.EndOfDayCurrentPeriod
            ? `Proposed (${metadata?.ProposedHeader}, Current Effective Period)`
            : `Proposed (${metadata?.ProposedHeader})`,
        marryChildren: true,
        children: [
          ProposedCost({ setIsFormulaBreakdownAndValuationDrawerOpen, setSelectedValuationId }),
          ProposedStrategyBase({ originalRows }),
          MarketMoveColumn(setIsMarketMoveBreakdownAndValuationDrawerOpen, setSelectedValuationRow, isUsingMarketMove),
          MarketMoveOverrideColumn(originalRows, isUsingMarketMove, canWrite),
          EODProposedDiff({ canWrite, originalRows }),
          ProposedPrice({ canWrite, originalRows }),
          ProposedPriceDelta({ originalRows }),
          ProposedMargin(),
          ProposedTemperatureAdjustedMargin(),
          ...getBenchMarkColumns({
            sectionName: 'Proposed',
            metadata,
            setIsFormulaBreakdownAndValuationDrawerOpen,
            setSelectedValuationId,
            isDemo,
          }),
        ],
      },
    ]
  }
  if (publicationMode === PublicationModeOptions.IntraDay) {
    return [
      {
        headerName: 'Proposed',
        marryChildren: true,
        children: [
          ProposedCost({ setIsFormulaBreakdownAndValuationDrawerOpen, setSelectedValuationId }),
          ProposedStrategyBase({ originalRows }),
          MarketMoveColumn(setIsMarketMoveBreakdownAndValuationDrawerOpen, setSelectedValuationRow, isUsingMarketMove),
          MarketMoveOverrideColumn(originalRows, isUsingMarketMove, canWrite),
          MiddayProposedDiff({ canWrite, originalRows }),
          ProposedPrice({ canWrite, originalRows }),
          ProposedPriceDelta({ originalRows }),
          ProposedMargin(),
        ],
      },
    ]
  }
  return []
}

export const ProposedCost = ({ setIsFormulaBreakdownAndValuationDrawerOpen, setSelectedValuationId }) => ({
  field: 'Cost',
  filter: 'agMultiColumnFilter',
  filterParams: formulaColumnFilterParams,
  editable: false,
  minWidth: 105,
  headerName: 'Cost',

  valueGetter: (params) => (params?.data?.CostId ? parseFloat(params?.data?.Cost) : undefined),
  cellRenderer: (params) => {
    let statusStyle: React.CSSProperties = { fontStyle: 'italic' }

    switch (params?.data?.CostStatusSymbol) {
      case 'A':
        statusStyle = { color: 'var(--theme-success)' }
        break
      case 'M':
        statusStyle = { color: 'var(--theme-error)' }
        break
      case 'O':
        statusStyle = { color: 'var(--theme-warning)' }
        break
      case null:
      case undefined:
      default:
        statusStyle = { fontStyle: 'italic' }
        break
    }
    return (
      <Tooltip title='View valuation'>
        <Button
          style={{ textAlign: 'left', padding: 0 }}
          type='link'
          onClick={() => {
            setIsFormulaBreakdownAndValuationDrawerOpen(true)
            setSelectedValuationId(params?.data?.CostId)
          }}
        >
          <Horizontal verticalCenter>
            <Texto style={{ gap: '0.5rem', textDecoration: 'underline' }} className='flex items-center'>
              <LinkOutlined />
              {`${getNumSign(params?.data?.Cost)}${fmt.currency(params?.data?.Cost)}`}
            </Texto>
            {params?.data?.CostStatusSymbol && (
              <Texto style={{ ...statusStyle }} className='mx-1'>
                ({params?.data?.CostStatusSymbol})
              </Texto>
            )}
          </Horizontal>
        </Button>
      </Tooltip>
    )
  },
})

export const ProposedStrategyBase = ({ originalRows }) => ({
  field: 'StrategyBase.Value',
  editable: false,
  hide: true,
  headerName: 'Strat. Base',
  cellStyle: (params) => ({
    fontStyle: 'italic',
    ...getDirtyCellStyle(params.data, originalRows, 'StrategyBase.Value'),
  }),
  cellRenderer: (params) => {
    const anchor = originalRows?.find((r) => r.QuoteConfigurationMappingId === params?.data?.SpreadParentMappingId)

    return (
      <Button style={{ textAlign: 'left', padding: 0, margin: 0 }} type='link'>
        <Texto>
          <Horizontal verticalCenter style={{ gap: '0.5rem' }}>
            {getDiffIconByStrategyBase(params?.data?.StrategyBase, !!anchor)}
            {`${getNumSign(params?.data?.StrategyBase?.Value)}${fmt.currency(params?.data?.StrategyBase?.Value)}`}
          </Horizontal>
        </Texto>
      </Button>
    )
  },
})

export const EODProposedDiff = ({ canWrite, originalRows }) => ({
  ...getStrategyColumnDef({ field: 'Adjustment', propertyName: 'QuoteStrategyDiffName' }),
  editable: (params) => canWrite && !params?.data?.SpreadParentMappingId,
  isBulkEditable: canWrite,
  bulkCellEditor: BulkDiffEditor,
  bulkCellEditorParams: { isBulkChangeCompactMode: true },
  cellStyle: (params) => {
    const value = Number(params.value)

    let style = {}
    if (value < 0) style = { color: 'var(--theme-error)', fontWeight: 'bold' }
    if (value > 0) style = { color: 'green', fontWeight: 'bold' }
    if (isSpreadRow(params)) style = { color: 'var(--gray-600)', fontStyle: 'italic' }
    if (params.data?.QuoteStrategyDiff < 0) style = { color: 'var(--theme-warning)' }
    return { ...style, ...getDirtyCellStyle(params.data, originalRows, 'Adjustment') }
  },
  valueSetter: (params) => updateRowPricingDataOnValueChange({ changedField: 'Adjustment', params }),
})

export const MiddayProposedDiff = ({ canWrite, originalRows }) => ({
  ...getStrategyColumnDef({ field: 'Adjustment', propertyName: 'QuoteStrategyDiffName' }),
  editable: (params) => canWrite && !params?.data?.SpreadParentMappingId,
  isBulkEditable: canWrite,
  bulkCellEditor: BulkDiffEditor,
  bulkCellEditorParams: { isBulkChangeCompactMode: true },
  cellStyle: (params) => {
    const value = Number(params.value)

    let style = {}
    if (value < 0) style = { color: 'var(--theme-error)', fontWeight: 'bold' }
    if (value > 0) style = { color: 'green', fontWeight: 'bold' }
    if (isSpreadRow(params)) style = { color: 'var(--gray-600)', fontStyle: 'italic' }
    if (params.data?.QuoteStrategyDiff < 0) style = { color: 'var(--theme-warning)' }
    return { ...style, ...getDirtyCellStyle(params.data, originalRows, 'Adjustment') }
  },
  valueSetter: (params) => updateRowPricingDataOnValueChange({ changedField: 'Adjustment', params }),
})

export const ProposedPrice = ({ canWrite, originalRows }) => ({
  editable: (params) => canWrite && !params?.data?.SpreadParentMappingId,
  isBulkEditable: canWrite,
  bulkCellEditor: BulkPriceEditor,
  bulkCellEditorParams: { isBulkChangeCompactMode: true },
  field: 'ProposedPrice',
  headerName: 'Price',
  cellStyle: (params) => {
    let style = {}
    if (isSpreadRow(params)) style = { color: 'var(--gray-500)', fontStyle: 'italic', pointerEvents: 'none' }
    if (params.data?.QuoteStrategyDiff < 0) style = { color: 'var(--theme-warning)' }
    return {
      ...style,
      ...getDirtyCellStyle(params.data, originalRows, 'ProposedPrice'),
      fontWeight: 'bold',
    }
  },
  valueFormatter: fmt.currency,
  valueSetter: (params) => updateRowPricingDataOnValueChange({ changedField: 'ProposedPrice', params }),
  valueGetter: (params) => {
    const adjustmentValue = params?.data?.SpreadOverride ?? params?.data?.Adjustment
    // eslint-disable-next-line no-unsafe-optional-chaining
    if (isSpreadRow(params)) return params?.data?.StrategyBase?.Value + adjustmentValue
    return params?.data?.ProposedPrice
  },
})
export const ProposedPriceDelta = ({ originalRows }) => ({
  editable: false,
  field: 'ProposedPriceDelta',
  headerName: 'Price Delta',
  cellStyle: (params) => {
    let style = {}
    if (isSpreadRow(params)) style = { color: 'var(--gray-500)', fontStyle: 'italic', pointerEvents: 'none' }
    return {
      ...style,
      ...getDirtyCellStyle(params.data, originalRows, 'ProposedPrice'),
    }
  },
  valueFormatter: fmt.currency,
  valueGetter: (params) => {
    if (isSpreadRow(params)) {
      const adjustmentValue = params?.data?.SpreadOverride ?? params?.data?.Adjustment

      return (params?.data?.StrategyBase?.Value || 0) + (adjustmentValue || 0) - params.data.PriorQuotePeriod.LastPrice
    }
    return params.data.ProposedPrice - params.data.PriorQuotePeriod.LastPrice
  },
})
function GetProposedMargin(params) {
  const adjustmentValue = params?.data?.SpreadOverride ?? params?.data?.Adjustment

  const proposedPrice = isSpreadRow(params) ? params?.data?.StrategyBase?.Value + adjustmentValue:  params?.data?.ProposedPrice
  // eslint-disable-next-line no-unsafe-optional-chaining
  if (proposedPrice === undefined || proposedPrice === null) return null

  const cost = params?.data?.Cost
  if (cost === undefined || cost === null) return null
  return proposedPrice - cost
}

export const ProposedMargin = () => ({
  minWidth: 90,
  field: 'Margin',
  editable: false,
  // eslint-disable-next-line no-unsafe-optional-chaining
  valueGetter: (params) => {
    return GetProposedMargin(params)
  },
  valueFormatter: fmt.currency,
  cellStyle: (params) => {
    let style: React.CSSProperties = { fontWeight: 'bold' }
    if (params.value < 0) style = { backgroundColor: 'var(--theme-error-dim)', fontWeight: 'bold' }
    if (params.value > 0) style = { backgroundColor: 'var(--theme-success-dim)', fontWeight: 'bold' }
    return style
  },
})

function GetTemperatureAdjustedMargin(params) {
  const rowData = params?.data

  const proposedPrice = rowData?.ProposedPrice
  if (proposedPrice === undefined || proposedPrice === null) return null

  const cost = rowData?.Cost
  if (cost === undefined || cost === null) return null

  const tciAdjustment = rowData?.TCIValue
  if (tciAdjustment === undefined || tciAdjustment === null) return null

  if (tciAdjustment === 0) return 0

  const useMultiplication = rowData?.TCIIsMultiplication !== false
  const adjustedPrice = useMultiplication ? proposedPrice * tciAdjustment : proposedPrice / tciAdjustment

  // temp adjusted margin is the margin computed when cost is adjusted for temperature
  return adjustedPrice - cost
}

export const ProposedTemperatureAdjustedMargin = () => ({
  minWidth: 90,
  headerName: 'Temp. Adj. Margin',
  headerTooltip: 'Temperature Adjusted Margin',
  field: 'TCIValue',
  initialHide: true,
  editable: false,
  valueGetter: (params) => {
    return GetTemperatureAdjustedMargin(params)
  },
  valueFormatter: fmt.currency,
  cellRenderer: (params) => {
    const adjustedMargin = GetTemperatureAdjustedMargin(params)
    const proposedMargin = GetProposedMargin(params)

    const delta = adjustedMargin == null || proposedMargin == null ? null : adjustedMargin - proposedMargin
    return (
      <Tooltip
        title={`Adjustment: ${delta == null ? '--' : fmt.decimal(delta)}, Factor:  ${fmt.decimal(
          params.data.TCIValue ?? 0
        )}`}
      >
        <Button style={{ padding: 0 }} type='link'>
          <Texto>{fmt.currency(params?.value)}</Texto>
        </Button>
      </Tooltip>
    )
  },
})

export const MarketMoveColumn = (
  setIsMarketMoveBreakdownAndValuationDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>,
  setSelectedValuationRow: React.Dispatch<React.SetStateAction<Quote | null>>,
  isUsingMarketMove: boolean
) => ({
  initialHide: !isUsingMarketMove,
  field: 'MarketMoveValue',
  headerName: 'Market Move',
  editable: false,
  cellRenderer: (params: ICellRendererParams) => {
    if (!params?.value) return null
    return (
      <Tooltip title='View valuation'>
        <Button
          style={{ textAlign: 'left', padding: 0 }}
          type='link'
          onClick={() => {
            setIsMarketMoveBreakdownAndValuationDrawerOpen(true)
            setSelectedValuationRow(params?.data)
          }}
        >
          <Horizontal>
            <Texto style={{ gap: '0.5rem', textDecoration: 'underline' }} className='flex items-center'>
              <LinkOutlined />
              {`${getNumSign(params?.value)}${fmt.decimal(params?.value)}`}
            </Texto>
          </Horizontal>
        </Button>
      </Tooltip>
    )
  },
})
export const MarketMoveOverrideColumn = (
  originalRows: Quote[] | undefined,
  isUsingMarketMove: boolean,
  canWrite: boolean
) => ({
  initialHide: !isUsingMarketMove,
  field: 'MarketMoveOverride',
  headerName: 'Market Move Override',
  editable: (params: CellClassParams) => {
    return params.data.UsesMarketMove && !isSpreadRow(params)
  },
  isBulkEditable: canWrite,
  bulkCellEditor: BulkMarketMoveOverrideEditor,
  bulkCellEditorParams: { isBulkChangeCompactMode: true },
  cellStyle: (params: CellClassParams) => {
    let style = {}
    if (isSpreadRow(params)) style = { color: 'var(--gray-400)', fontStyle: 'italic', pointerEvents: 'none' }
    if (!isDefinedAndNotNull(params.value)) return style
    if (params.data?.QuoteStrategyDiff < 0) style = { color: 'var(--theme-warning)' }
    return {
      ...style,
      ...getDirtyCellStyle(params.data, originalRows, 'MarketMoveOverride'),
      fontWeight: 'bold',
    }
  },
  valueSetter: (params: ValueSetterParams) =>
    updateRowPricingDataOnValueChange({ changedField: 'MarketMoveOverride', params }),
  valueFormatter: fmt.decimal,
})
