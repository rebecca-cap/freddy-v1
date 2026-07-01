import { LinkOutlined } from '@ant-design/icons'
import {
  BulkFilteredChildrenEditor,
  type BulkFilteredChildrenEditorParams,
} from '@components/shared/Grid/bulkChange/BulkFilteredChildrenEditor'
import { BBDTag } from '@gravitate-js/excalibrr'
import { RankCategory } from '@modules/PricingEngine/Calculations/ManageQuoteRows/Tabs/shared/rankCategoryColumn'
import type { ColDef } from 'ag-grid-community'
import React from 'react'

import type { CompetitorMappingQuoteRow, CompetitorMappingsMetadata } from '../../Api/types.schema'

// Tri-state choice surfaced by the bulk Visibility editor.
export type BulkVisibilityChoice = 'Show' | 'Hide' | 'Highlight'

// Callbacks the bulk Visibility column passes to BulkFilteredChildrenEditor.
// `getValueOptions` is derived from selectedRows; `onMatched` buffers rows
// for updateEP to consume.
export type BulkVisibilityCallbacks = {
  getValueOptions: BulkFilteredChildrenEditorParams['getValueOptions']
  onMatched: (parentRow: CompetitorMappingQuoteRow, newValue: BulkVisibilityChoice) => void
}

type Args = {
  canWrite: boolean
  metadata: CompetitorMappingsMetadata | undefined
  onUpdateRankCategories: (mappingId: number, categoryIds: number[]) => void
  // When the bulk-change drawer is open GraviGrid injects its own checkbox
  // column; we drop ours to avoid two.
  isBulkChangeVisible: boolean
  bulkVisibility: BulkVisibilityCallbacks
}

export const getCompetitorMappingsColumnDefs = ({
  canWrite,
  metadata,
  onUpdateRankCategories,
  isBulkChangeVisible,
  bulkVisibility,
}: Args): ColDef[] => {
  // Hide the Rank Category column when no categories are seeded — mirrors
  // the conditional in MatchingForm so the subgrid and right panel agree.
  const hasRankCategories = (metadata?.QuoteCompetitorCategoryList?.length ?? 0) > 0

  return [
    ...(isBulkChangeVisible ? [] : [FindMatchingSelect()]),
    Competitors(),
    Configuration(),
    Counterparty(),
    ...(hasRankCategories
      ? [RankCategory(canWrite, metadata?.QuoteCompetitorCategoryList, onUpdateRankCategories)]
      : []),
    Terminal(),
    Product(),
    Visibility(canWrite, isBulkChangeVisible, bulkVisibility),
  ]
}

// Manual checkbox column for the Find Matching flow; omitted in bulk
// mode because GraviGrid injects its own. Shape mirrors that injected
// column (no fixed width) so the layout reads the same across the swap.
const FindMatchingSelect = (): ColDef => ({
  colId: '$findMatchingSelect',
  headerName: '',
  checkboxSelection: true,
  headerCheckboxSelection: true,
  headerCheckboxSelectionFilteredOnly: true,
  maxWidth: 50,
  pinned: 'left',
  lockPosition: 'left',
  filter: false,
  sortable: false,
  suppressMenu: true,
})

const Competitors = (): ColDef => ({
  field: 'CompetitorAssociationCount',
  headerName: 'Competitors',
  cellRenderer: 'agGroupCellRenderer',
  filter: 'agNumberColumnFilter',
  editable: false,
  cellRendererParams: {
    innerRenderer: (params) => (
      <BBDTag theme2 style={{ backgroundColor: 'var(--theme-color-2-trans)', minWidth: 50 }}>
        <LinkOutlined style={{ marginRight: 5 }} />
        {params?.data?.CompetitorAssociationCount ?? 0}
      </BBDTag>
    ),
  },
})

const Configuration = (): ColDef => ({
  field: 'QuoteConfigurationName',
  headerName: 'Configuration',
  rowGroup: true,
  hide: true,
})

// Coalesce across the per-type CounterParty columns — same pattern as
// the main Quote Rows tab so display stays consistent.
const Counterparty = (): ColDef => ({
  colId: 'Counterparty',
  headerName: 'Counterparty',
  editable: false,
  valueGetter: (props) => {
    const row = props?.data
    if (!row) return ''
    return (
      row.SupplierCounterPartyName ??
      row.CarrierCounterPartyName ??
      row.ExternalCounterPartyName ??
      row.InternalCounterPartyName ??
      ''
    )
  },
})

const Terminal = (): ColDef => ({
  field: 'LocationName',
  headerName: 'Terminal',
  editable: false,
})

const Product = (): ColDef => ({
  field: 'ProductName',
  headerName: 'Product',
  editable: false,
})

// Synthetic column hosting the bulk-change editor. Returned with a wider
// inferred type (incl. GraviGrid's isBulkEditable/bulkCellEditor extensions)
// so it clears the ColDef[] return type via structural compatibility rather
// than tripping the excess-property check.
const Visibility = (canWrite: boolean, isBulkChangeVisible: boolean, bulkVisibility: BulkVisibilityCallbacks) => ({
  colId: 'BulkVisibility',
  field: 'BulkVisibility',
  headerName: 'Visibility',
  // Hidden in normal mode — the column only exists to be discovered by the
  // bulk drawer (which iterates colDefs by isBulkEditable, not visibility).
  hide: !isBulkChangeVisible,
  width: 40,
  maxWidth: 40,
  minWidth: 40,
  sortable: false,
  filter: false,
  editable: false,
  suppressMenu: true,
  suppressColumnsToolPanel: true,
  lockPosition: 'right' as const,
  valueGetter: () => '',
  cellRenderer: () => null,
  isBulkEditable: canWrite,
  bulkCellEditor: BulkFilteredChildrenEditor,
  bulkCellEditorParams: {
    dimensions: [
      { key: 'SelectedCounterPartyName', label: 'Counterparty' },
      { key: 'TargetPricePublisherId', label: 'Publisher' },
      { key: 'LocationName', label: 'Terminal' },
    ],
    getValueOptions: bulkVisibility.getValueOptions,
    onMatched: bulkVisibility.onMatched,
    // CompetitorMappingsGrid.updateEP maps each choice to the
    // (IsHiddenByDefault, IsHighlighted) pair.
    valueOptions: [
      { value: 'Show', label: 'Show' },
      { value: 'Hide', label: 'Hide' },
      { value: 'Highlight', label: 'Highlight' },
    ],
    valueLabel: 'Visibility',
  } satisfies BulkFilteredChildrenEditorParams<CompetitorMappingQuoteRow, BulkVisibilityChoice>,
})
