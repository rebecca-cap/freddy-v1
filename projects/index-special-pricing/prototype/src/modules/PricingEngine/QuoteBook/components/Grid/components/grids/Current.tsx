import { GraviGrid } from '@gravitate-js/excalibrr'
import { useGridViewManager } from '@hooks/useGridViewManager/useGridViewManager'
import type {
  PublicationModes,
  Quote,
  QuoteBookMetadataResponse,
} from '@modules/PricingEngine/QuoteBook/Api/types.schema'
import { getColumnDefs } from '@modules/PricingEngine/QuoteBook/Components/Grid/Components/columns/columnDefs'
import { PublicationModeOptions } from '@modules/PricingEngine/QuoteBook/type.schema'
import { getColumnVisibilityFlags } from '@modules/PricingEngine/QuoteBook/utils/columnVisibility'
import type { GridApi, SelectionChangedEvent } from 'ag-grid-community'
import { message } from 'antd'
import type React from 'react'
import { useEffect, useMemo, useState } from 'react'

export interface QuoteBookIndividualGridProps {
  canWrite: boolean
  setIsBulkChangeVisible: React.Dispatch<React.SetStateAction<boolean>>
  dirtyQuotes: Quote[]
  metadata?: QuoteBookMetadataResponse
  setSelectedRowId: React.Dispatch<React.SetStateAction<number | null>>
  setIsFormulaBreakdownAndValuationDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>
  setIsMarketMoveBreakdownAndValuationDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>
  setIsQuoteHistoryDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>
  setSelectedValuationId: React.Dispatch<React.SetStateAction<number | null>>
  setQuoteHistoryHeaderInfo: React.Dispatch<React.SetStateAction<any>>
  publishMode: boolean
  isDemo: boolean
  isUsingMarketMove: boolean
  setSelectedValuationRow: React.Dispatch<React.SetStateAction<Quote | null>>
  originalRowData?: Quote[]
  loading: boolean
  rowData: Quote[]
  handleRowSelection: (event: SelectionChangedEvent) => Promise<any>
  controlBarProps: any
  agPropOverrides: any
  validatePriceChangesAndUpdateRows: (changeOrChanges: Quote | Quote[]) => Promise<any>
  getRefKey: (mode: PublicationModes) => React.MutableRefObject<GridApi<any>>
  isBulkChangeVisible: boolean
  selectedAnalyticsRow: Quote | null
  showAnalytics: boolean
}

export function Current({
  canWrite,
  setIsBulkChangeVisible,
  dirtyQuotes,
  metadata,
  setSelectedRowId,
  setIsFormulaBreakdownAndValuationDrawerOpen,
  setIsMarketMoveBreakdownAndValuationDrawerOpen,
  setIsQuoteHistoryDrawerOpen,
  setSelectedValuationId,
  setQuoteHistoryHeaderInfo,
  publishMode,
  isDemo,
  isUsingMarketMove,
  setSelectedValuationRow,
  originalRowData,
  loading,
  rowData,
  handleRowSelection,
  controlBarProps,
  agPropOverrides,
  validatePriceChangesAndUpdateRows,
  getRefKey,
  isBulkChangeVisible,
  showAnalytics,
  selectedAnalyticsRow,
}: QuoteBookIndividualGridProps) {
  const storageKey = `QuoteBookDataGrid${PublicationModeOptions.EndOfDayCurrentPeriod}`
  const gridViewManager = useGridViewManager(storageKey)
  const gridRef = getRefKey(PublicationModeOptions.EndOfDayCurrentPeriod)
  const [isLocalBulkChangeVisible, setIsLocalBulkChangeVisible] = useState<boolean>(false)

  const { showOriginDestinationColumns, showLocationColumn } = getColumnVisibilityFlags(metadata)

  const columnDefs = useMemo(() => {
    return typeof isUsingMarketMove !== 'undefined' && typeof originalRowData !== 'undefined'
      ? getColumnDefs({
          metadata,
          publicationMode: PublicationModeOptions.EndOfDayCurrentPeriod,
          canWrite,
          setSelectedRowId,
          originalRows: originalRowData,
          setIsFormulaBreakdownAndValuationDrawerOpen,
          setIsMarketMoveBreakdownAndValuationDrawerOpen,
          setIsQuoteHistoryDrawerOpen,
          setSelectedValuationId,
          setQuoteHistoryHeaderInfo,
          publishMode,
          isDemo,
          isUsingMarketMove,
          setSelectedValuationRow,
          showOriginDestinationColumns,
          showLocationColumn,
        })
      : []
  }, [
    originalRowData,
    publishMode,
    dirtyQuotes,
    metadata,
    isUsingMarketMove,
    showOriginDestinationColumns,
    showLocationColumn,
  ])

  useEffect(() => {
    setIsBulkChangeVisible(isLocalBulkChangeVisible)
  }, [isLocalBulkChangeVisible])

  useEffect(() => {
    if (!isBulkChangeVisible && isLocalBulkChangeVisible) {
      setIsLocalBulkChangeVisible(false)
    }

    if (!isBulkChangeVisible && selectedAnalyticsRow && showAnalytics) {
      gridRef.current?.getRowNode(selectedAnalyticsRow?.QuoteConfigurationMappingId?.toString())?.setSelected(true)
    }
  }, [isBulkChangeVisible])

  const bulkChangeVisibility = useMemo(() => {
    if (!publishMode && canWrite) {
      return setIsLocalBulkChangeVisible
    }
    return () => message.error('Cannot use bulk change while publishing')
  }, [canWrite, setIsLocalBulkChangeVisible, publishMode])
  return (
    <GraviGrid
      enableFilterContextMenu
      headerHeight={33}
      className='quotebook-grid'
      columnDefs={columnDefs}
      isBulkChangeVisible={isLocalBulkChangeVisible}
      setIsBulkChangeVisible={bulkChangeVisibility}
      hideSaveDisplay
      hideBulkSaveButtons
      externalRef={gridRef}
      updateEP={validatePriceChangesAndUpdateRows}
      controlBarProps={controlBarProps}
      agPropOverrides={agPropOverrides}
      rowData={rowData || []}
      onSelectionChanged={handleRowSelection}
      storageKey={storageKey}
      loading={loading}
      gridViewManager={gridViewManager}
      isBulkChangeCompactMode
    />
  )
}
