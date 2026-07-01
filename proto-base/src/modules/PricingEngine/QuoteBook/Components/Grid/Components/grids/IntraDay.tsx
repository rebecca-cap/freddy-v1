import { GraviGrid } from '@gravitate-js/excalibrr'
import { useGridViewManager } from '@hooks/useGridViewManager/useGridViewManager'
import { getColumnDefs } from '@modules/PricingEngine/QuoteBook/Components/Grid/Components/columns/columnDefs'
import type { QuoteBookIndividualGridProps } from '@modules/PricingEngine/QuoteBook/Components/Grid/Components/grids/Current'
import { PublicationModeOptions } from '@modules/PricingEngine/QuoteBook/type.schema'
import { getColumnVisibilityFlags } from '@modules/PricingEngine/QuoteBook/utils/columnVisibility'
import { message } from 'antd'
import React, { useEffect, useMemo, useState } from 'react'

export function IntraDay({
  canWrite,
  isBulkChangeVisible,
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
  showAnalytics,
  selectedAnalyticsRow,
}: QuoteBookIndividualGridProps) {
  const storageKey = `QuoteBookDataGrid${PublicationModeOptions.IntraDay}`
  const gridViewManager = useGridViewManager(storageKey)
  const gridRef = getRefKey(PublicationModeOptions.IntraDay)
  const [isLocalBulkChangeVisible, setIsLocalBulkChangeVisible] = useState<boolean>(false)
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
  const { showOriginDestinationColumns, showLocationColumn } = getColumnVisibilityFlags(metadata)

  const columnDefs = useMemo(() => {
    return typeof isUsingMarketMove !== 'undefined' && typeof originalRowData !== 'undefined'
      ? getColumnDefs({
          metadata,
          publicationMode: PublicationModeOptions.IntraDay,
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

  return (
    <GraviGrid
      enableFilterContextMenu
      headerHeight={33}
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
      className='quotebook-grid'
      gridViewManager={gridViewManager}
      isBulkChangeCompactMode
    />
  )
}
