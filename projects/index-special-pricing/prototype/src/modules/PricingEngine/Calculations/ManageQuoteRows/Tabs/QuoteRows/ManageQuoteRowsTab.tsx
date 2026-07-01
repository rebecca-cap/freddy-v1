import './styles.css'

import { SettingOutlined } from '@ant-design/icons'
import { NumberCellEditor } from '@components/shared/Grid/cellEditors/NumberCellEditor'
import { SearchableSelect } from '@components/shared/Grid/cellEditors/SelectCellEditor'
import { GraviButton, GraviGrid, Horizontal, Vertical, useLocalStorage } from '@gravitate-js/excalibrr'
import { useGridViewManager } from '@hooks/useGridViewManager/useGridViewManager'
import { useQuoteRowsTyped } from '@modules/PricingEngine/Calculations/ManageQuoteRows/Api/useQuoteRowsTyped'
import { useQuoteRowTags } from '@modules/PricingEngine/Calculations/ManageQuoteRows/Api/useQuoteRowTags'
import { useCompetitorMappingsTyped } from '@modules/PricingEngine/Calculations/ManageQuoteRows/Tabs/CompetitorMappings/Api/useCompetitorMappingsTyped'
import type { GridApi, IsGroupOpenByDefaultParams } from 'ag-grid-community'
import React, { type MutableRefObject, useCallback, useMemo, useRef } from 'react'

import { createColumnDefs } from './components/Grid/columns/columnDefs'
import { ManageQuoteRowsPanel } from './components/ManageQuoteRowsPanel/ManageQuoteRowsPanel'

const panelOpenStorageKey = 'manageQuoteRowsPanel-open'

export function ManageQuoteRowsTab({ canWrite }: { canWrite: boolean }) {
  const { useMappings, useMappingMetadata, upsertMapping } = useQuoteRowsTyped()
  // Rank Category metadata + mutation come from the CompetitorMappings hook.
  const { useCompetitorMappingsMetadata, useUpdateRankCategoriesMutation } = useCompetitorMappingsTyped()
  const { data: rankCategoryMetadata } = useCompetitorMappingsMetadata()
  const updateRankCategories = useUpdateRankCategoriesMutation()
  const { useTagDefinitions, applyAssignmentsMutation, createAndAssignMutation } = useQuoteRowTags()
  const { data: tagDefinitionsData } = useTagDefinitions()
  const tagDefinitions = useMemo(() => tagDefinitionsData?.Data ?? [], [tagDefinitionsData])
  const [isBulkChangeVisible, setIsBulkChangeVisible] = React.useState(false)
  const { data: mappings, isFetching: mappingsFetching } = useMappings()
  const { data: metadata, isFetching: metadataFetching } = useMappingMetadata()
  const { value: isPanelOpen, setValue: setIsPanelOpen } = useLocalStorage(panelOpenStorageKey, false)
  const gridAPIRef = useRef() as MutableRefObject<GridApi>

  const upsertRef = useRef(upsertMapping)

  const columnDefs = useMemo(
    () =>
      createColumnDefs({
        metadata,
        mutationRef: upsertRef,
        canWrite,
        rankCategoryList: rankCategoryMetadata?.QuoteCompetitorCategoryList,
        onUpdateRankCategories: (mappingId, categoryIds) =>
          updateRankCategories.mutate({
            QuoteConfigurationMappingId: mappingId,
            QuoteCompetitorCategoryIds: categoryIds,
          }),
        tagDefinitions,
        applyAssignmentsMutation,
        createAndAssignMutation,
      }),
    [
      metadata,
      canWrite,
      upsertRef,
      rankCategoryMetadata,
      tagDefinitions,
      applyAssignmentsMutation,
      createAndAssignMutation,
    ]
  )

  const updateWrapper = (row) => {
    const rowList = Array.isArray(row) ? row : [row]
    const rowsThatArentGroupRows = rowList.filter((r) => !!r?.QuoteConfigurationId)
    const tagRows = rowsThatArentGroupRows
      .filter((r) => r?.QuoteConfigurationMappingId != null && Array.isArray(r?.AssignedQuoteRowTagIds))
      .map((r) => ({
        QuoteConfigurationMappingId: r.QuoteConfigurationMappingId,
        QuoteRowTagIds: r.AssignedQuoteRowTagIds,
      }))
    const upsertPromise = upsertMapping.mutateAsync({ rowOrRows: rowsThatArentGroupRows })
    if (tagRows.length === 0) return upsertPromise
    return Promise.all([upsertPromise, applyAssignmentsMutation.mutateAsync({ Rows: tagRows })])
  }
  const storageKey = 'QuoteRowsData'
  const gridViewManager = useGridViewManager(storageKey)
  const rowData = useMemo(() => mappings?.Data, [mappings?.Data])
  const loading = useMemo(() => mappingsFetching || metadataFetching, [mappingsFetching, metadataFetching])
  const controlBarProps = useMemo(
    () => ({
      title: 'Quote Rows',
      hideActiveFilters: false,
      actionButtons: (
        <Horizontal>
          <GraviButton
            className='mr-3'
            buttonText='Manage'
            onClick={() => setIsPanelOpen(!isPanelOpen)}
            icon={<SettingOutlined />}
            color={isPanelOpen ? 'success' : 'primary'}
          />
        </Horizontal>
      ),
    }),
    [isPanelOpen, setIsPanelOpen]
  )
  const agPropOverrides = useMemo(
    () => ({
      getRowId: (row) => row?.data?.QuoteConfigurationMappingId,
      rowSelection: 'multiple' as const,
      suppressRowClickSelection: true,
      frameworkComponents: { SearchableSelect, number: NumberCellEditor },
    }),
    []
  )
  const isGroupOpenByDefault = useCallback((params: IsGroupOpenByDefaultParams) => {
    return params.field === 'QuoteConfigurationName'
  }, [])

  const grid = (
    <Vertical flex='1'>
      <GraviGrid
        enableFilterContextMenu
        externalRef={gridAPIRef}
        isBulkChangeVisible={isBulkChangeVisible}
        setIsBulkChangeVisible={canWrite ? setIsBulkChangeVisible : undefined}
        controlBarProps={controlBarProps}
        loading={loading}
        agPropOverrides={agPropOverrides}
        updateEP={canWrite ? updateWrapper : undefined}
        storageKey={storageKey}
        rowData={rowData || []}
        columnDefs={columnDefs}
        gridViewManager={gridViewManager}
        isGroupOpenByDefault={isGroupOpenByDefault}
      />
    </Vertical>
  )

  return (
    <Vertical>
      <ManageQuoteRowsPanel
        leftPane={grid}
        isOpen={!!isPanelOpen}
        onClose={() => setIsPanelOpen(false)}
        canWrite={canWrite}
      />
    </Vertical>
  )
}
