import '../../styles.css'

import { RowSelectionTypes } from '@components/shared/Grid/schema.type'
import { PublicationModes, Quote, QuoteBookMetadataResponse } from '@modules/PricingEngine/QuoteBook/api/types.schema'
import { useQuoteBook } from '@modules/PricingEngine/QuoteBook/api/useQuoteBook'
import {
  getAllRowsAndSetSelectedRowsToPublish,
  getLastSaveDate,
  manageDirtyQuotesListAndUpdateSpreadRows,
  setAndShowAnalytics,
  validateNewPricesAreGreaterThanZero,
} from '@modules/PricingEngine/QuoteBook/components/Grid/components/gridEvents'
import { Current } from '@modules/PricingEngine/QuoteBook/components/Grid/components/grids/Current'
import { EndOfDay } from '@modules/PricingEngine/QuoteBook/components/Grid/components/grids/EndOfDay'
import { IntraDay } from '@modules/PricingEngine/QuoteBook/components/Grid/components/grids/IntraDay'
import { SpreadOverrideModal } from '@modules/PricingEngine/QuoteBook/components/Grid/components/Modals/SpreadOverrideModal'
import { QuoteBookActionButtons } from '@modules/PricingEngine/QuoteBook/components/Grid/components/QuoteBookActionButtons'
import {
  EMPTY_QUOTE_FILTERS,
  QuoteFilterBar,
  QuoteFilters,
  quoteFiltersActive,
} from '@modules/PricingEngine/QuoteBook/components/QuoteFilterBar'
import { PublicationModeOptions } from '@modules/PricingEngine/QuoteBook/type.schema'
import { customOnCellKeyDown, getContextMenuAdditionalMenuItems } from '@utils/grid'
import { isDefinedAndNotNull } from '@utils/index'
import { GridApi, SelectionChangedEvent } from 'ag-grid-community'
import _ from 'lodash'
import React, { useMemo } from 'react'

export interface QuoteBookGridProps {
  publicationMode: PublicationModes
  canWrite: boolean
  dirtyQuotes: Quote[]
  metadata?: QuoteBookMetadataResponse
  setSelectedRowId: React.Dispatch<React.SetStateAction<number | null>>
  setIsFormulaBreakdownAndValuationDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>
  setIsMarketMoveBreakdownAndValuationDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>
  setIsQuoteHistoryDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>
  setSelectedValuationId: React.Dispatch<React.SetStateAction<number | null>>
  setQuoteHistoryHeaderInfo: React.Dispatch<React.SetStateAction<Quote | undefined>>
  isBulkChangeVisible: boolean
  setIsBulkChangeVisible: React.Dispatch<React.SetStateAction<boolean>>
  publishMode: boolean
  getRefKey: (mode: PublicationModes) => React.MutableRefObject<GridApi<any>>
  showAnalytics: boolean
  selectedGroupTabs: string[] | null
  showSpreadRows: boolean | null
  setSelectedRowsToPublish: (rows: Quote[]) => void
  setSelectedAnalyticsRow: React.Dispatch<React.SetStateAction<Quote | null>>
  setTooManySelected: React.Dispatch<React.SetStateAction<boolean>>
  gridTitle: string
  setShowAnalytics: React.Dispatch<React.SetStateAction<boolean>>
  setShowSpreadRows: React.Dispatch<React.SetStateAction<boolean | null>>
  setPublicationMode: React.Dispatch<React.SetStateAction<PublicationModes>>
  setLastEOD: (mode: PublicationModeOptions.EndOfDayCurrentPeriod | PublicationModeOptions.EndOfDay) => void
  refs: Record<string, React.MutableRefObject<any>>
  setDirtyQuotes: React.Dispatch<React.SetStateAction<Quote[]>>
  setSelectedValuationRow: React.Dispatch<React.SetStateAction<Quote | null>>
  isUsingMarketMove: boolean
  isQuoteHistoryDrawerOpen: boolean
  selectedAnalyticsRow: Quote | null
  handleAdjustmentUpdate: () => void
}
export function QuoteBookGrid({
  publicationMode,
  canWrite,
  dirtyQuotes,
  metadata,
  setSelectedRowId,
  setIsFormulaBreakdownAndValuationDrawerOpen,
  setIsMarketMoveBreakdownAndValuationDrawerOpen,
  setIsQuoteHistoryDrawerOpen,
  isQuoteHistoryDrawerOpen,
  setSelectedValuationId,
  setQuoteHistoryHeaderInfo,
  isBulkChangeVisible,
  setIsBulkChangeVisible,
  publishMode,
  getRefKey,
  showAnalytics,
  selectedGroupTabs,
  showSpreadRows,
  setSelectedRowsToPublish,
  setSelectedAnalyticsRow,
  setTooManySelected,
  gridTitle,
  setShowAnalytics,
  setShowSpreadRows,
  setPublicationMode,
  setLastEOD,
  refs,
  setDirtyQuotes,
  setSelectedValuationRow,
  isUsingMarketMove,
  selectedAnalyticsRow,
  handleAdjustmentUpdate,
}: QuoteBookGridProps) {
  const { useQuotes, useQuoteBookUpdateAdjustmentsMutation, useQuoteBookSaveSpreadOverridesMutation } = useQuoteBook()
  const { data: quotes, isFetching } = useQuotes(publicationMode)
  const updateAdjustments = useQuoteBookUpdateAdjustmentsMutation()
  const saveSpreadOverrides = useQuoteBookSaveSpreadOverridesMutation()

  const [isSpreadOverrideModalOpen, setIsSpreadOverrideModalOpen] = React.useState<boolean>(false)
  const [selectedSpreadOverrideRow, setSelectedSpreadOverrideRow] = React.useState<Quote | undefined>()

  const originalRowsCopy = useMemo(() => {
    return _.cloneDeep(quotes?.Data)
  }, [quotes?.Data])

  const lastSavedAdjustment = useMemo(() => {
    return getLastSaveDate({ quotes: quotes?.Data })
  }, [quotes?.Data])

  const rowsByGroup = useMemo(() => {
    return quotes?.Data?.reduce((acc, row) => {
      const key = row?.QuoteConfigurationMappingGroupId || '-1'
      if (!acc[key]) acc[key] = []
      if (showSpreadRows) {
        acc[key].push(row)
      } else if (!isDefinedAndNotNull(row.SpreadParentMappingId)) {
        acc[key].push(row)
      }
      return acc
    }, {} as Record<string, Quote[]>)
  }, [quotes?.Data, showSpreadRows])

  const rowData = useMemo(
    () =>
      !rowsByGroup
        ? []
        : Object.entries(rowsByGroup)
            .filter(([key, _]) => selectedGroupTabs?.includes(key))
            .map(([_, rows]) => rows)
            .flat() || [],
    [rowsByGroup, selectedGroupTabs]
  )

  // --- Quote Filter Bar (hi-fi of design-system/lofi round-2) ---------------
  const [quoteFilters, setQuoteFilters] = React.useState<QuoteFilters>(EMPTY_QUOTE_FILTERS)

  const productOptions = useMemo(
    () => Array.from(new Set((rowData as Quote[]).map((r) => r.ProductName).filter(Boolean))).sort(),
    [rowData]
  )
  const locationOptions = useMemo(
    () => Array.from(new Set((rowData as Quote[]).map((r) => r.LocationName).filter(Boolean))).sort(),
    [rowData]
  )

  const filteredRowData = useMemo(() => {
    const f = quoteFilters
    const search = f.search.trim().toLowerCase()
    const out = (rowData as Quote[]).filter((r) => {
      if (f.products.length > 0 && !f.products.includes(r.ProductName)) return false
      if (f.location && r.LocationName !== f.location) return false
      if (search) {
        const hay = `${r.ExternalCounterPartyName ?? ''} ${r.ProductName ?? ''}`.toLowerCase()
        if (!hay.includes(search)) return false
      }
      return true
    })
    const sorted = [...out]
    switch (f.sort) {
      case 'price-desc':
        sorted.sort((a, b) => (b.ProposedPrice ?? 0) - (a.ProposedPrice ?? 0))
        break
      case 'price-asc':
        sorted.sort((a, b) => (a.ProposedPrice ?? 0) - (b.ProposedPrice ?? 0))
        break
      case 'counterparty':
        sorted.sort((a, b) => String(a.ExternalCounterPartyName).localeCompare(String(b.ExternalCounterPartyName)))
        break
      default:
        sorted.sort((a, b) => String(a.ProductName).localeCompare(String(b.ProductName)))
    }
    return sorted
  }, [rowData, quoteFilters])

  const agPropOverrides = useMemo(
    () => ({
      getRowId: (row) => row.data?.QuoteConfigurationMappingId,
      groupDefaultExpanded: 2,
      rowSelection: 'multiple' as RowSelectionTypes,
      rowHeight: 35,
      enableFillHandle: true,
      onCellKeyDown: (params) => customOnCellKeyDown(params),
      isRowSelectable: (row) => !row?.group,
      getAdditionContextMenuItems: (colId: string, contextMenuRowData?: Quote) =>
        getContextMenuAdditionalMenuItems(
          colId,
          setIsSpreadOverrideModalOpen,
          setSelectedSpreadOverrideRow,
          contextMenuRowData
        ),
    }),
    [showAnalytics, publicationMode]
  )

  const demoEnvironments = ['sinclair', 'demo']
  const ref = window.location.href?.toLowerCase() ?? ''
  const isDemo = demoEnvironments.some((value) => ref.includes(value))

  const controlBarProps = useMemo(
    () => ({
      title: `Quote Book ${gridTitle}`,
      showSelectedCount: canWrite,
      actionButtons: (
        <QuoteBookActionButtons
          publicationMode={publicationMode}
          canWrite={canWrite}
          publishMode={publishMode}
          getRefKey={getRefKey}
          showAnalytics={showAnalytics}
          setShowAnalytics={setShowAnalytics}
          showSpreadRows={showSpreadRows}
          setShowSpreadRows={setShowSpreadRows}
          isBulkChangeVisible={isBulkChangeVisible}
          setSelectedAnalyticsRow={setSelectedAnalyticsRow}
          setPublicationMode={setPublicationMode}
          setLastEOD={setLastEOD}
          lastSavedAdjustment={lastSavedAdjustment}
        />
      ),
    }),
    [publicationMode, canWrite, publishMode, isBulkChangeVisible, showAnalytics, showSpreadRows, quotes?.Data]
  )

  const handleRowSelection = ({ api }: SelectionChangedEvent) => {
    const selectedRows = api?.getSelectedRows() as Quote[]

    // if showing analytics and not bulk change, set the new row as the analytic row
    if (showAnalytics && !isBulkChangeVisible && !publishMode && selectedRows?.length > 0) {
      setAndShowAnalytics({
        setSelectedAnalyticsRow,
        setTooManySelected,
        selectedRows,
      })
    }

    if (!showAnalytics && !isQuoteHistoryDrawerOpen) {
      const externalGridRef = getRefKey(publicationMode)
      getAllRowsAndSetSelectedRowsToPublish({
        selectedRows,
        setSelectedRowId,
        setSelectedRowsToPublish,
        api,
        externalGridRef,
        showSpreadRows,
        quotes,
      })
    }
    return Promise.resolve()
  }
  const isMultipleChanges = (change: Quote | Quote[]): change is Quote[] => Array.isArray(change)

  // errors thrown here should be caught by the bulk change bar

  const anchorIds = useMemo(
    () => new Set(quotes?.Data?.map((r) => r.SpreadParentMappingId)?.filter(isDefinedAndNotNull)),
    [quotes?.Data]
  )

  const validatePriceChangesAndUpdateRows = async (changeOrChanges: Quote | Quote[]) => {
    const changes = isMultipleChanges(changeOrChanges) ? changeOrChanges : [changeOrChanges]
    const affectedRows = changes.filter((row) => !isDefinedAndNotNull(row.SpreadParentMappingId))
    validateNewPricesAreGreaterThanZero(affectedRows)
    affectedRows.forEach((quote) =>
      manageDirtyQuotesListAndUpdateSpreadRows(
        quote,
        dirtyQuotes,
        setDirtyQuotes,
        anchorIds,
        refs,
        publicationMode,
        quotes
      )
    )

    refs[`gridRef${publicationMode}`]?.current?.applyTransaction({ update: affectedRows })
    return affectedRows
  }
  const loading = useMemo(() => {
    return isFetching || updateAdjustments?.isLoading || !quotes
  }, [isFetching, updateAdjustments?.isLoading, quotes])

  const sharedProps = {
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
    originalRowData: originalRowsCopy,
    loading,
    rowData: filteredRowData,
    handleRowSelection,
    controlBarProps,
    agPropOverrides,
    validatePriceChangesAndUpdateRows,
    getRefKey,
    selectedAnalyticsRow,
    showAnalytics,
  }

  const GridComponent =
    publicationMode === PublicationModeOptions.EndOfDay ? (
      <EndOfDay {...sharedProps} />
    ) : publicationMode === PublicationModeOptions.EndOfDayCurrentPeriod ? (
      <Current {...sharedProps} />
    ) : (
      <IntraDay {...sharedProps} />
    )

  return (
    <>
      <QuoteFilterBar
        productOptions={productOptions}
        locationOptions={locationOptions}
        value={quoteFilters}
        onChange={setQuoteFilters}
        totalCount={rowData.length}
        filteredCount={filteredRowData.length}
      />
      {GridComponent}
      <SpreadOverrideModal
        isSpreadOverrideModalOpen={isSpreadOverrideModalOpen}
        setIsSpreadOverrideModalOpen={setIsSpreadOverrideModalOpen}
        selectedSpreadOverrideRow={selectedSpreadOverrideRow}
        saveSpreadOverrides={saveSpreadOverrides}
        publicationMode={publicationMode}
        handleAdjustmentUpdate={handleAdjustmentUpdate}
        originalRowData={originalRowsCopy}
      />
    </>
  )
}
