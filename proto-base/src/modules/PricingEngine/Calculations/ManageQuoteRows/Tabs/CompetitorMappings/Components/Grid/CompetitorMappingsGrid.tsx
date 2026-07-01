import { SearchableSelect } from '@components/shared/Grid/cellEditors/SelectCellEditor'
import { GraviGrid } from '@gravitate-js/excalibrr'
import { useGridViewManager } from '@hooks/useGridViewManager/useGridViewManager'
import type { GridApi, IRowNode } from 'ag-grid-community'
import React, { useEffect, useMemo, useRef } from 'react'

import type { CompetitorMappingQuoteRow, CompetitorMappingsMetadata } from '../../Api/types.schema'
import { useCompetitorMappingsTyped } from '../../Api/useCompetitorMappingsTyped'
import { CompetitorDetailPanel } from '../DetailGrid/CompetitorDetailPanel'

import { type BulkVisibilityCallbacks, type BulkVisibilityChoice, getCompetitorMappingsColumnDefs } from './columnDefs'

type Props = {
  canWrite: boolean
  quoteRows: CompetitorMappingQuoteRow[] | undefined
  isLoading: boolean
  metadata: CompetitorMappingsMetadata | undefined
  selectedRows: CompetitorMappingQuoteRow[]
  setSelectedRows: React.Dispatch<React.SetStateAction<CompetitorMappingQuoteRow[]>>
  expandedMappingIds: number[]
}

const STORAGE_KEY = 'PricingEngine::Calculations::QuoteRows::CompetitorMappings'

// Inline-association projection on the master row.
type InlineAssociation = { PriceInstrumentId?: number | null }

export function CompetitorMappingsGrid({
  canWrite,
  quoteRows,
  isLoading,
  metadata,
  selectedRows,
  setSelectedRows,
  expandedMappingIds,
}: Props) {
  const gridRef = useRef<GridApi>() as React.MutableRefObject<GridApi>
  const gridViewManager = useGridViewManager(STORAGE_KEY)
  const { useUpdateRankCategoriesMutation, useBulkUpdateVisibilityMutation } = useCompetitorMappingsTyped()
  const updateRankCategories = useUpdateRankCategoriesMutation()
  const bulkUpdateVisibility = useBulkUpdateVisibilityMutation()

  const [isBulkChangeVisible, setIsBulkChangeVisible] = React.useState(false)

  // Buffer of rows matched by the bulk editor; drained by updateEP on Confirm.
  const matchedBufferRef = useRef<Array<{ row: CompetitorMappingQuoteRow; newValue: BulkVisibilityChoice }>>([])
  useEffect(() => {
    matchedBufferRef.current = []
  }, [isBulkChangeVisible])

  // GraviGrid's bulk drawer clears ag-grid's selection on open; snapshot the
  // user's selection before the transition and restore it after.
  const preBulkSelectionRef = useRef<CompetitorMappingQuoteRow[]>([])
  useEffect(() => {
    if (!isBulkChangeVisible) {
      preBulkSelectionRef.current = selectedRows
    }
  }, [selectedRows, isBulkChangeVisible])

  useEffect(() => {
    if (!isBulkChangeVisible) return
    const grid = gridRef.current
    if (!grid) return
    const ids = new Set(
      preBulkSelectionRef.current.map((r) => r.QuoteConfigurationMappingId).filter((id): id is number => id != null)
    )
    if (ids.size === 0) return

    // Batch the selection flip — per-node setSelected fires one event per
    // row, which would stall the page on multi-thousand-row selections.
    const handle = requestAnimationFrame(() => {
      const nodesToSelect: IRowNode<CompetitorMappingQuoteRow>[] = []
      grid.forEachNode((node) => {
        const id = node.data?.QuoteConfigurationMappingId
        if (id != null && ids.has(id) && !node.isSelected()) {
          nodesToSelect.push(node as IRowNode<CompetitorMappingQuoteRow>)
        }
      })
      if (nodesToSelect.length === 0) return

      const apiAny = grid as unknown as {
        setNodesSelected?: (params: {
          nodes: IRowNode<CompetitorMappingQuoteRow>[]
          newValue: boolean
          source?: string
        }) => void
      }
      if (typeof apiAny.setNodesSelected === 'function') {
        apiAny.setNodesSelected({ nodes: nodesToSelect, newValue: true, source: 'api' })
      } else {
        for (const node of nodesToSelect) node.setSelected(true, false)
      }
    })
    return () => cancelAnimationFrame(handle)
  }, [isBulkChangeVisible])

  // Values dropdown options + onMatched buffer-push. Publisher is stored as
  // an id on the row, so resolve its display label via metadata.
  const bulkVisibility = useMemo<BulkVisibilityCallbacks>(
    () => ({
      getValueOptions: (dimension: string) => {
        const seen = new Map<string, string>() // canonical value → display label
        for (const row of selectedRows) {
          const raw = (row as Record<string, unknown>)?.[dimension]
          if (raw == null || raw === '') continue
          const value = String(raw)
          if (seen.has(value)) continue
          let label = String(raw)
          if (dimension === 'TargetPricePublisherId') {
            const pub = metadata?.PricePublisherList?.find((p) => p.Value === value)?.Text
            label = pub ?? value
          }
          seen.set(value, label)
        }
        return Array.from(seen.entries())
          .map(([value, label]) => ({ value, label }))
          .sort((a, b) => a.label.localeCompare(b.label))
      },
      onMatched: (row: CompetitorMappingQuoteRow, newValue: BulkVisibilityChoice) => {
        matchedBufferRef.current.push({ row, newValue })
      },
    }),
    [selectedRows, metadata]
  )

  // Build the Upsert payload from each matched row's inline associations.
  // QuoteCompetitorCategoryId is sent as null — BE's merge ignores it on
  // update and null sidesteps the "no conflicting categories per request"
  // validation. The visibility choice maps to the (IsHiddenByDefault,
  // IsHighlighted) pair the same way the per-row Visibility column does.
  const updateEP = async () => {
    const matched = matchedBufferRef.current
    matchedBufferRef.current = []
    const Associations = matched.flatMap(({ row, newValue }) => {
      const mappingId = row.QuoteConfigurationMappingId
      if (mappingId == null) return []
      const flags = {
        IsHiddenByDefault: newValue === 'Hide',
        IsHighlighted: newValue === 'Highlight',
      }
      const associations = (row.CompetitorPriceAssociations ?? []) as InlineAssociation[]
      return associations
        .filter((a) => a.PriceInstrumentId != null)
        .map((a) => ({
          QuoteConfigurationMappingId: mappingId,
          PriceInstrumentId: a.PriceInstrumentId as number,
          IsHiddenByDefault: flags.IsHiddenByDefault,
          IsHighlighted: flags.IsHighlighted,
          QuoteCompetitorCategoryId: null as number | null,
        }))
    })
    if (Associations.length === 0) return
    await bulkUpdateVisibility.mutateAsync({ Associations })
    setIsBulkChangeVisible(false)
  }

  const columnDefs = useMemo(
    () =>
      getCompetitorMappingsColumnDefs({
        canWrite,
        metadata,
        onUpdateRankCategories: (mappingId, categoryIds) =>
          updateRankCategories.mutate({
            QuoteConfigurationMappingId: mappingId,
            QuoteCompetitorCategoryIds: categoryIds,
          }),
        isBulkChangeVisible,
        bulkVisibility,
      }),
    [canWrite, metadata, isBulkChangeVisible, bulkVisibility]
  )

  const agPropOverrides = useMemo(
    () => ({
      getRowId: (row: { data: CompetitorMappingQuoteRow }) => String(row.data.QuoteConfigurationMappingId ?? ''),
      frameworkComponents: { SearchableSelect },
      rowSelection: 'multiple' as const,
      groupDefaultExpanded: 0,
      masterDetail: true,
      detailRowAutoHeight: true,
      detailCellRenderer: CompetitorDetailPanel,
      detailCellRendererParams: { canWrite, metadata },
    }),
    [canWrite, metadata]
  )

  const onSelectionChanged = ({ api }: { api: GridApi }) => {
    setSelectedRows(api.getSelectedRows())
  }

  // Stable getRowId means ag-grid preserves its selection across refetches,
  // so we mirror a parent-forced clear back into ag-grid. The length-guard
  // prevents looping with onSelectionChanged on user-driven deselects.
  useEffect(() => {
    if (selectedRows.length > 0) return
    const grid = gridRef.current
    if (!grid) return
    if (grid.getSelectedRows().length === 0) return
    grid.deselectAll()
  }, [selectedRows])

  // Auto-expand rows after bulk-create so the new associations are visible.
  useEffect(() => {
    if (!gridRef.current || !expandedMappingIds.length) return
    expandedMappingIds.forEach((id) => {
      const node = gridRef.current.getRowNode(id.toString())
      if (node) node.setExpanded(true)
    })
  }, [expandedMappingIds])

  useEffect(() => {
    if (quoteRows?.length) {
      gridRef.current?.refreshCells({ columns: ['CompetitorAssociationCount'], force: true })
    }
  }, [quoteRows])

  return (
    <GraviGrid
      enableFilterContextMenu
      externalRef={gridRef}
      controlBarProps={{
        title: 'Competitor Mappings',
        showSelectedCount: true,
      }}
      agPropOverrides={agPropOverrides}
      storageKey={STORAGE_KEY}
      rowData={quoteRows ?? []}
      columnDefs={columnDefs}
      gridViewManager={gridViewManager}
      onSelectionChanged={onSelectionChanged}
      loading={isLoading}
      isBulkChangeVisible={isBulkChangeVisible}
      setIsBulkChangeVisible={canWrite ? setIsBulkChangeVisible : undefined}
      updateEP={canWrite ? updateEP : undefined}
      // Suppress GraviGrid's "N record(s) updated" toast — our mutation
      // onSuccess fires the accurate "N associations updated" one instead.
      hideSaveDisplay
    />
  )
}
