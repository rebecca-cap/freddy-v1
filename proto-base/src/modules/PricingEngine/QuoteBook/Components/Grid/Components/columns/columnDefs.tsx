import '../../../../styles.css'

import type {
  PublicationModes,
  Quote,
  QuoteBookMetadataResponse,
} from '@modules/PricingEngine/QuoteBook/Api/types.schema'
import { AllocationColumn } from '@modules/PricingEngine/QuoteBook/Components/Grid/Components/columns/sections/AllocationColumns'
import { CurrentColumns } from '@modules/PricingEngine/QuoteBook/Components/Grid/Components/columns/sections/CurrentColumns'
import {
  QuoteConfigurationNameColumn,
  checkboxColumn,
} from '@modules/PricingEngine/QuoteBook/Components/Grid/Components/columns/sections/InitialColumns'
import { PriceInfoColumns } from '@modules/PricingEngine/QuoteBook/Components/Grid/Components/columns/sections/PriceInfoColumns'
import { PricingExceptionColumns } from '@modules/PricingEngine/QuoteBook/Components/Grid/Components/columns/sections/PricingExceptions/PricingExceptionColumns'
import { PriorColumns } from '@modules/PricingEngine/QuoteBook/Components/Grid/Components/columns/sections/PriorColumns'
import { ProposedColumns } from '@modules/PricingEngine/QuoteBook/Components/Grid/Components/columns/sections/ProposedColumns'
import type { ColDef } from 'ag-grid-community'
import type React from 'react'

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
  showOriginDestinationColumns: boolean
  showLocationColumn: boolean
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
  showOriginDestinationColumns,
  showLocationColumn,
}: QuoteBookColumnDefProps): ColDef[] => {
  const columns = [
    PriceInfoColumns({
      setQuoteHistoryHeaderInfo,
      setSelectedRowId,
      setIsQuoteHistoryDrawerOpen,
      originalRows,
      showOriginDestinationColumns,
      showLocationColumn,
      quoteRowTags: metadata?.QuoteRowTags,
    }),
    PricingExceptionColumns({ metadata }),
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
