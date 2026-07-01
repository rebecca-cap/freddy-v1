import '../../../../styles.css'

import { PublicationModes, Quote, QuoteBookMetadataResponse } from '@modules/PricingEngine/QuoteBook/api/types.schema'
import { AllocationColumn } from '@modules/PricingEngine/QuoteBook/components/Grid/components/columns/sections/AllocationColumns'
import { CurrentColumns } from '@modules/PricingEngine/QuoteBook/components/Grid/components/columns/sections/CurrentColumns'
import {
  checkboxColumn,
  QuoteConfigurationNameColumn,
} from '@modules/PricingEngine/QuoteBook/components/Grid/components/columns/sections/InitialColumns'
import { PriceInfoColumns } from '@modules/PricingEngine/QuoteBook/components/Grid/components/columns/sections/PriceInfoColumns'
import { PriorColumns } from '@modules/PricingEngine/QuoteBook/components/Grid/components/columns/sections/PriorColumns'
import { ProposedColumns } from '@modules/PricingEngine/QuoteBook/components/Grid/components/columns/sections/ProposedColumns'
import { ScoutRowReadyCell } from '@modules/Scout/grid/ScoutRowReadyCell'
import { ColDef } from 'ag-grid-community'
import React from 'react'

// ROW-1..3 — pinned leading gutter column rendering the per-row Scout "ready"
// indicator. Narrow, headerless, non-interactive as a column (no sort/menu/
// resize/move); the indicator itself handles its own click (ROW-2).
const ScoutReadyColumn: ColDef = {
  colId: 'scoutReady',
  headerName: '',
  pinned: 'left',
  lockPosition: true,
  lockPinned: true,
  width: 34,
  minWidth: 34,
  maxWidth: 34,
  resizable: false,
  sortable: false,
  suppressMenu: true,
  suppressMovable: true,
  filter: false,
  editable: false,
  cellClass: 'scout-row-ready-cell',
  cellRenderer: ScoutRowReadyCell,
}

interface QuoteBookColumnDefProps {
  metadata?: QuoteBookMetadataResponse
  publicationMode?: PublicationModes
  canWrite: boolean
  setSelectedRowId: React.Dispatch<React.SetStateAction<number | null>>
  originalRows?: Quote[]
  setIsFormulaBreakdownAndValuationDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>
  setIsQuoteHistoryDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>
  setSelectedValuationId: React.Dispatch<React.SetStateAction<number | null>>
  setQuoteHistoryHeaderInfo: React.Dispatch<React.SetStateAction<Quote>>
  publishMode: boolean
  isDemo: boolean
  isUsingMarketMove: boolean
  setSelectedValuationRow: React.Dispatch<React.SetStateAction<Quote | null>>
  setIsMarketMoveBreakdownAndValuationDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>
}
export const getColumnDefs = ({
  metadata,
  publicationMode,
  canWrite,
  setSelectedRowId,
  originalRows,
  setIsFormulaBreakdownAndValuationDrawerOpen,
  setIsQuoteHistoryDrawerOpen,
  setSelectedValuationId,
  setQuoteHistoryHeaderInfo,
  publishMode,
  isDemo,
  isUsingMarketMove,
  setSelectedValuationRow,
  setIsMarketMoveBreakdownAndValuationDrawerOpen,
}: QuoteBookColumnDefProps): ColDef[] => {
  const columns = [
    PriceInfoColumns({ setQuoteHistoryHeaderInfo, setSelectedRowId, setIsQuoteHistoryDrawerOpen, originalRows }),
    PriorColumns({
      metadata,
      setIsFormulaBreakdownAndValuationDrawerOpen,
      setSelectedValuationId,
      isDemo,
    }),
    CurrentColumns({
      publicationMode,
      metadata,
      setIsFormulaBreakdownAndValuationDrawerOpen,
      setSelectedValuationId,
      isDemo,
    }),
    ...AllocationColumn(isDemo),
    ...ProposedColumns({
      publicationMode,
      metadata,
      canWrite,
      setIsFormulaBreakdownAndValuationDrawerOpen,
      setSelectedValuationId,
      originalRows,
      isDemo,
      isUsingMarketMove,
      setSelectedValuationRow,
      setIsMarketMoveBreakdownAndValuationDrawerOpen,
    }),
  ]
  return publishMode
    ? [ScoutReadyColumn, QuoteConfigurationNameColumn, checkboxColumn, ...columns]
    : [ScoutReadyColumn, QuoteConfigurationNameColumn, ...columns]
}
