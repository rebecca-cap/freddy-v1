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
import { ColDef } from 'ag-grid-community'
import React from 'react'

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
    ? [QuoteConfigurationNameColumn, checkboxColumn, ...columns]
    : [QuoteConfigurationNameColumn, ...columns]
}
