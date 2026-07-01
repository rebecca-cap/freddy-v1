import { GraviButton, GraviGrid, Horizontal } from '@gravitate-js/excalibrr'
import type { ColDef } from 'ag-grid-community'
import React, { useMemo, useState } from 'react'

import type {
  CompetitorAssociation,
  CompetitorMappingQuoteRow,
  CompetitorMappingsMetadata,
} from '../../Api/types.schema'
import { useCompetitorMappingsTyped } from '../../Api/useCompetitorMappingsTyped'
import { AddCompetitorModal } from '../AddCompetitorModal/AddCompetitorModal'

import { getCompetitorDetailColumnDefs } from './columnDefs'

type Props = {
  data: CompetitorMappingQuoteRow
  canWrite: boolean
  metadata: CompetitorMappingsMetadata | undefined
}

export function CompetitorDetailPanel({ data, canWrite, metadata }: Props) {
  const mappingId = data?.QuoteConfigurationMappingId
  const { useCompetitorAssociations, useUpdateAssociationCategoryMutation, useToggleVisibilityMutation } =
    useCompetitorMappingsTyped()

  const { data: associations, isLoading } = useCompetitorAssociations(mappingId)
  const updateAssociationCategory = useUpdateAssociationCategoryMutation()
  const toggleVisibility = useToggleVisibilityMutation()

  const [isAddOpen, setIsAddOpen] = useState(false)

  const columnDefs = useMemo<ColDef[]>(
    () =>
      getCompetitorDetailColumnDefs({
        canWrite,
        metadata,
        onUpdateAssociationCategory: (row, categoryId) => {
          if (row.QuoteConfigurationMappingId == null || row.PriceInstrumentId == null) return
          updateAssociationCategory.mutate({
            QuoteConfigurationMappingId: row.QuoteConfigurationMappingId,
            PriceInstrumentId: row.PriceInstrumentId,
            QuoteCompetitorCategoryId: categoryId,
          })
        },
        onUpdateVisibility: (row, { IsHiddenByDefault, IsHighlighted }) => {
          if (row.QuoteConfigurationMappingId == null || row.PriceInstrumentId == null) return
          // Upsert overwrites every field it receives, so pass the row's
          // QuoteCompetitorCategoryId through to avoid clearing the tag.
          toggleVisibility.mutate({
            QuoteConfigurationMappingId: row.QuoteConfigurationMappingId,
            PriceInstrumentId: row.PriceInstrumentId,
            IsHiddenByDefault,
            IsHighlighted,
            QuoteCompetitorCategoryId: row.QuoteCompetitorCategoryId ?? null,
          })
        },
      }),
    [canWrite, metadata]
  )

  const agPropOverrides = useMemo(
    () => ({
      getRowId: (row: { data: CompetitorAssociation }) => String(row.data.QuoteCompetitorPriceAssociationId ?? ''),
      domLayout: 'autoHeight' as const,
      rowGroupPanelShow: 'never' as const,
      rowHeight: 35,
    }),
    []
  )

  return (
    <div>
      {canWrite && (
        <Horizontal style={{ padding: '6px 12px' }} justifyContent='end'>
          <GraviButton
            buttonText='+ Add Competitor'
            onClick={() => setIsAddOpen(true)}
            disabled={isLoading || associations == null}
          />
        </Horizontal>
      )}
      <GraviGrid
        storageKey='pricing-engine-competitor-mappings-detail-grid'
        enableFilterContextMenu
        agPropOverrides={agPropOverrides}
        rowData={associations ?? []}
        sideBar={false}
        headerHeight={25}
        rowGroupPanelShow='never'
        columnDefs={columnDefs}
        loading={isLoading}
      />
      <AddCompetitorModal
        open={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        quoteRow={data}
        metadata={metadata}
        existingAssociations={associations}
      />
    </div>
  )
}
