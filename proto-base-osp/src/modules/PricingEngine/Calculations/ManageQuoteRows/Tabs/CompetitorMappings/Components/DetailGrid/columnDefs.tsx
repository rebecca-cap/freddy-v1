import { UserOutlined } from '@ant-design/icons'
import { stopCloseOnEnter, suppressKeyboardEvent } from '@components/shared/Grid/cellEditors'
import { SearchableSelect } from '@components/shared/Grid/cellEditors/SelectCellEditor'
import { BBDTag, Horizontal, Texto } from '@gravitate-js/excalibrr'
import type { ColDef } from 'ag-grid-community'
import React from 'react'

import type { CompetitorAssociation, CompetitorMappingsMetadata, SelectListItem } from '../../Api/types.schema'

const toOption = (item: SelectListItem) => ({ value: item.Value ?? '', label: item.Text ?? '' })

type VisibilityFlags = { IsHiddenByDefault: boolean; IsHighlighted: boolean }

type Args = {
  canWrite: boolean
  metadata: CompetitorMappingsMetadata | undefined
  onUpdateAssociationCategory: (row: CompetitorAssociation, categoryId: number | null) => void
  onUpdateVisibility: (row: CompetitorAssociation, flags: VisibilityFlags) => void
}

export const getCompetitorDetailColumnDefs = ({
  canWrite,
  metadata,
  onUpdateAssociationCategory,
  onUpdateVisibility,
}: Args): ColDef[] => {
  // PE-5456: Drop the Rank Category column when the tenant has not seeded any
  // QuoteCompetitorCategory rows. Mirrors ConfigurePanel/MatchingForm.tsx.
  const hasRankCategories = (metadata?.QuoteCompetitorCategoryList?.length ?? 0) > 0

  return [
    Name(),
    Publisher(),
    Region(),
    Terminal(),
    ProductGroup(),
    Product(),
    ...(hasRankCategories ? [RankCategory(canWrite, metadata, onUpdateAssociationCategory)] : []),
    Visibility(canWrite, onUpdateVisibility),
  ]
}

const Name = (): ColDef => ({
  field: 'CounterParty',
  headerName: 'Name',
  sortable: true,
  editable: false,
  cellRenderer: ({ value }) => (
    <Horizontal verticalCenter gap={10}>
      <UserOutlined />
      {value}
    </Horizontal>
  ),
})

const Publisher = (): ColDef => ({
  field: 'PricePublisher',
  headerName: 'Publisher',
  sortable: true,
  editable: false,
})

const Region = (): ColDef => ({ field: 'Region', headerName: 'Region', editable: false })

const Terminal = (): ColDef => ({ field: 'Location', headerName: 'Terminal', editable: false })

const ProductGroup = (): ColDef => ({ field: 'ProductGroup', headerName: 'Product Group', editable: false })

const Product = (): ColDef => ({ field: 'Product', headerName: 'Product', editable: false })

const RankCategory = (
  canWrite: boolean,
  metadata: CompetitorMappingsMetadata | undefined,
  onUpdateAssociationCategory: (row: CompetitorAssociation, categoryId: number | null) => void
): ColDef => ({
  field: 'QuoteCompetitorCategoryId',
  headerName: 'Rank Category',
  editable: canWrite,
  cellEditor: SearchableSelect,
  cellEditorPopup: true,
  suppressKeyboardEvent,
  cellEditorParams: {
    showSearch: true,
    onKeyDown: stopCloseOnEnter,
    options: metadata?.QuoteCompetitorCategoryList?.map(toOption) ?? [],
  },
  valueGetter: (params) =>
    params?.data?.QuoteCompetitorCategoryName ??
    metadata?.QuoteCompetitorCategoryList?.find((c) => c.Value == params?.data?.QuoteCompetitorCategoryId)?.Text ??
    '',
  valueSetter: (params) => {
    const newId = params.newValue ? Number(params.newValue) : null
    params.data.QuoteCompetitorCategoryId = newId
    params.data.QuoteCompetitorCategoryName =
      metadata?.QuoteCompetitorCategoryList?.find((c) => c.Value == newId)?.Text ?? null
    onUpdateAssociationCategory(params.data, newId)
    return true
  },
})

// Tri-state Visibility — the value getter/setter resolve the
// (IsHiddenByDefault, IsHighlighted) flag pair into one string.
const Visibility = (
  canWrite: boolean,
  onUpdateVisibility: (row: CompetitorAssociation, flags: VisibilityFlags) => void
): ColDef => ({
  field: 'IsHiddenByDefault',
  headerName: 'Visibility',
  editable: canWrite,
  maxWidth: 140,
  cellRenderer: (params: { data?: CompetitorAssociation }) => {
    const isHidden = !!params?.data?.IsHiddenByDefault
    const isHighlighted = !!params?.data?.IsHighlighted
    return (
      <BBDTag success={!isHidden && !isHighlighted} theme4={isHighlighted}>
        <Texto align='center' style={{ color: 'inherit' }}>
          {isHighlighted ? 'Highlight' : isHidden ? 'Hide' : 'Show'}
        </Texto>
      </BBDTag>
    )
  },
  cellEditor: SearchableSelect,
  cellEditorPopup: true,
  suppressKeyboardEvent,
  cellEditorParams: {
    showSearch: false,
    onKeyDown: stopCloseOnEnter,
    // Option values match the value-getter strings so the dropdown
    // highlights the currently-selected state when it opens.
    options: [
      { value: 'Show', label: 'Show' },
      { value: 'Hide', label: 'Hide' },
      { value: 'Highlight', label: 'Highlight' },
    ],
  },
  valueGetter: (params) =>
    params?.data?.IsHighlighted ? 'Highlight' : params?.data?.IsHiddenByDefault ? 'Hide' : 'Show',
  valueSetter: (params) => {
    const next: VisibilityFlags = {
      IsHiddenByDefault: params?.newValue === 'Hide',
      IsHighlighted: params?.newValue === 'Highlight',
    }
    // No-op when the picked option matches the current state.
    const prev = {
      IsHiddenByDefault: !!params.data.IsHiddenByDefault,
      IsHighlighted: !!params.data.IsHighlighted,
    }
    if (prev.IsHiddenByDefault === next.IsHiddenByDefault && prev.IsHighlighted === next.IsHighlighted) {
      return false
    }
    params.data.IsHiddenByDefault = next.IsHiddenByDefault
    params.data.IsHighlighted = next.IsHighlighted
    onUpdateVisibility(params.data, next)
    return true
  },
})
