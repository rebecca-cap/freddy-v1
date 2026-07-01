import { GraviGrid } from '@gravitate-js/excalibrr'
import { useGridViewManager } from '@hooks/useGridViewManager/useGridViewManager'
import { getColumnDefs } from '@modules/PricingEngine/QuoteBook/components/Grid/components/columns/columnDefs'
import { QuoteBookIndividualGridProps } from '@modules/PricingEngine/QuoteBook/components/Grid/components/grids/Current'
import { PublicationModeOptions } from '@modules/PricingEngine/QuoteBook/type.schema'
import { message } from 'antd'
import React, { useEffect, useMemo, useState } from 'react'

export function EndOfDay({
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
  selectedAnalyticsRow,
  showAnalytics,
}: QuoteBookIndividualGridProps) {
  const storageKey = `QuoteBookDataGrid${PublicationModeOptions.EndOfDay}`
  const gridViewManager = useGridViewManager(storageKey)
  const gridRef = getRefKey(PublicationModeOptions.EndOfDay)
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

  const columnDefs = useMemo(() => {
    return typeof isUsingMarketMove !== 'undefined' && typeof originalRowData !== 'undefined'
      ? getColumnDefs({
          metadata,
          publicationMode: PublicationModeOptions.EndOfDay,
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
        })
      : []
  }, [originalRowData, publishMode, dirtyQuotes, metadata, isUsingMarketMove, rowData])

  const bulkChangeVisibility = useMemo(() => {
    if (!publishMode && canWrite) {
      return setIsLocalBulkChangeVisible
    }
    return () => message.error('Cannot use bulk change while publishing')
  }, [canWrite, setIsLocalBulkChangeVisible, publishMode])

  return (
    <GraviGrid
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
