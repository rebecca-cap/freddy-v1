import '../../styles.css'

import type { RowSelectionTypes } from '@components/shared/Grid/schema.type'
import type {
  PublicationModes,
  Quote,
  QuoteBookMetadataResponse,
  QuoteBookOverview,
} from '@modules/PricingEngine/QuoteBook/Api/types.schema'
import { useQuoteBookTyped } from '@modules/PricingEngine/QuoteBook/Api/useQuoteBookTyped'
import { SpreadOverrideModal } from '@modules/PricingEngine/QuoteBook/Components/Grid/Components/Modals/SpreadOverrideModal'
import { QuoteBookActionButtons } from '@modules/PricingEngine/QuoteBook/Components/Grid/Components/QuoteBookActionButtons'
import {
  getAllRowsAndSetSelectedRowsToPublish,
  getLastSaveDate,
  getSpreadFamilyIds,
  manageDirtyQuotesListAndUpdateSpreadRows,
  setAndShowAnalytics,
  validateNewPricesAreGreaterThanZero,
} from '@modules/PricingEngine/QuoteBook/Components/Grid/Components/gridEvents'
import { quoteBookTagsGroupInnerRenderer } from '@modules/PricingEngine/QuoteBook/Components/Grid/Components/columns/Tags'
import { Current } from '@modules/PricingEngine/QuoteBook/Components/Grid/Components/grids/Current'
import { EndOfDay } from '@modules/PricingEngine/QuoteBook/Components/Grid/Components/grids/EndOfDay'
import { IntraDay } from '@modules/PricingEngine/QuoteBook/Components/Grid/Components/grids/IntraDay'
import { PublicationModeOptions } from '@modules/PricingEngine/QuoteBook/type.schema'
import { customOnCellKeyDown, getContextMenuAdditionalMenuItems } from '@utils/grid'
import type { GridApi, SelectionChangedEvent } from 'ag-grid-community'
import _ from 'lodash'
import React, { useMemo } from 'react'

import { isDefinedAndNotNull } from '@/utils'

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
}: QuoteBookGridProps) {
  const {
    useQuotes,
    useQuoteBookUpdateAdjustmentsMutation,
    useQuoteBookSaveSpreadOverridesMutation,
    fetchFilteredRows,
    queryClient,
  } = useQuoteBookTyped()
  const { data: quotes, isFetching } = useQuotes(publicationMode)
  const updateAdjustments = useQuoteBookUpdateAdjustmentsMutation()
  const saveSpreadOverrides = useQuoteBookSaveSpreadOverridesMutation()

  const [isSpreadOverrideModalOpen, setIsSpreadOverrideModalOpen] = React.useState<boolean>(false)
  const [selectedSpreadOverrideRow, setSelectedSpreadOverrideRow] = React.useState<Quote | undefined>()

  const refreshSpreadFamily = async (row: Quote) => {
    if (!quotes?.Data || !publicationMode) return

    const familyIds = getSpreadFamilyIds(row, quotes.Data)
    try {
      const filtered = await fetchFilteredRows(publicationMode, familyIds)

      // Patch rows into the React Query cache
      queryClient.setQueryData(['/api/QuoteBook/GetRows', publicationMode], (prev: QuoteBookOverview | undefined) => {
        if (!prev) return prev
        const updatedMap = new Map(filtered?.Data?.map((r) => [r.QuoteConfigurationMappingId, r]))
        return {
          ...prev,
          Data: prev.Data.map((r) => updatedMap.get(r.QuoteConfigurationMappingId) ?? r),
        }
      })

      // Apply to grid in-place for immediate visual update
      refs[`gridRef${publicationMode}`]?.current?.applyTransaction({ update: filtered.Data })

      // Clear dirty edits for refreshed rows — server data is now authoritative
      const refreshedIds = new Set(familyIds)
      setDirtyQuotes((prev) => prev.filter((q) => !refreshedIds.has(q.QuoteConfigurationMappingId)))
    } catch (err) {
      console.warn('[QuoteBook] Filtered row fetch failed, falling back to full refresh', err)
      queryClient.invalidateQueries({ queryKey: ['/api/QuoteBook/GetRows', publicationMode] })
    }
  }

  const originalRowsCopy = useMemo(() => {
    return _.cloneDeep(quotes?.Data)
  }, [quotes?.Data])

  const lastSavedAdjustment = useMemo(() => {
    return getLastSaveDate({ quotes: quotes?.Data })
  }, [quotes?.Data])

  const namedGroupIds = useMemo(
    () =>
      new Set(
        metadata?.QuoteMappingGroups?.filter((g) => g.GroupName).map((g) =>
          String(g.QuoteConfigurationMappingGroupId)
        ) ?? []
      ),
    [metadata?.QuoteMappingGroups]
  )

  const rowsByGroup = useMemo(() => {
    return quotes?.Data?.reduce(
      (acc, row) => {
        const rawKey = row?.QuoteConfigurationMappingGroupId
        const key = rawKey && namedGroupIds.has(String(rawKey)) ? String(rawKey) : '-1'
        if (!acc[key]) acc[key] = []
        if (showSpreadRows) {
          acc[key].push(row)
        } else if (!isDefinedAndNotNull(row.SpreadParentMappingId)) {
          acc[key].push(row)
        }
        return acc
      },
      {} as Record<string, Quote[]>
    )
  }, [quotes?.Data, showSpreadRows, namedGroupIds])

  const rowData = useMemo(
    () =>
      !rowsByGroup
        ? []
        : Object.entries(rowsByGroup)
            .filter(([key, _]) => selectedGroupTabs?.includes(key))
            .flatMap(([_, rows]) => rows) || [],
    [rowsByGroup, selectedGroupTabs]
  )

  const agPropOverrides = useMemo(
    () => ({
      getRowId: (row) => row.data?.QuoteConfigurationMappingId,
      groupDefaultExpanded: -1,
      rowSelection: 'multiple' as RowSelectionTypes,
      rowHeight: 35,
      enableFillHandle: true,
      onCellKeyDown: (params) => customOnCellKeyDown(params),
      isRowSelectable: (row) => !row?.group,
      getAdditionContextMenuItems: (colId: string, contextMenuRowData?: Quote) =>
        getContextMenuAdditionalMenuItems(
          colId ?? '',
          setIsSpreadOverrideModalOpen,
          setSelectedSpreadOverrideRow,
          contextMenuRowData
        ),
      groupRowRendererParams: {
        innerRenderer: quoteBookTagsGroupInnerRenderer({ quoteRowTags: metadata?.QuoteRowTags }),
      },
    }),
    [showAnalytics, publicationMode, metadata?.QuoteRowTags]
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
    return isFetching || updateAdjustments?.isPending || !quotes
  }, [isFetching, updateAdjustments?.isPending, quotes])

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
    rowData,
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
      {GridComponent}
      <SpreadOverrideModal
        isSpreadOverrideModalOpen={isSpreadOverrideModalOpen}
        setIsSpreadOverrideModalOpen={setIsSpreadOverrideModalOpen}
        selectedSpreadOverrideRow={selectedSpreadOverrideRow}
        saveSpreadOverrides={saveSpreadOverrides}
        publicationMode={publicationMode}
        onSpreadOverrideSaved={refreshSpreadFamily}
        originalRowData={originalRowsCopy}
      />
    </>
  )
}
