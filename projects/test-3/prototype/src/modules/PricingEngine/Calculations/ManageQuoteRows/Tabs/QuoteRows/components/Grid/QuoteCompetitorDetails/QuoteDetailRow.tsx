import { GraviGrid } from '@gravitate-js/excalibrr'
import { QuoteConfigurationOverview } from '@modules/PricingEngine/Calculations/ManageQuoteRows/api/types.schema'
import { useQuoteCompetitorDetails } from '@modules/PricingEngine/Calculations/ManageQuoteRows/Tabs/QuoteRows/components/Grid/QuoteCompetitorDetails/api/useQuoteCompetitorDetails'
import { ColDef } from 'ag-grid-community'
import React, { useMemo } from 'react'

import { getColumnDefs } from './components/columnDefs'

type QuoteRowDetailRow = QuoteConfigurationOverview['Data'][number]

export const QuoteDetailRow: React.FC<{ data: QuoteRowDetailRow }> = (params) => {
  const columnDefs = useMemo(() => getColumnDefs() as ColDef[], [])
  const { useCompetitorPrices, upsertQuoteCompetitorDetails } = useQuoteCompetitorDetails()
  const { data: competitorPrices, isLoading } = useCompetitorPrices(params?.data?.QuoteConfigurationMappingId)
  const updateQuoteCompetitorDetails = async ({
    IsHiddenByDefault,
    PriceInstrumentId,
    QuoteConfigurationMappingId,
    IsHighlighted,
  }) => {
    const payload = {
      Associations: [{ IsHiddenByDefault, PriceInstrumentId, QuoteConfigurationMappingId, IsHighlighted }],
    }
    await upsertQuoteCompetitorDetails.mutateAsync(payload)
  }
  const agPropOverrides = useMemo(
    () => ({
      getRowId: (row) => row?.data?.QuoteCompetitorPriceAssociationId,
      domLayout: 'autoHeight',
      rowGroupPanelShow: 'never',
      rowHeight: 35,
    }),
    []
  )
  return (
    <div>
      <GraviGrid
        agPropOverrides={agPropOverrides}
        rowData={competitorPrices?.Data}
        sideBar={false}
        headerHeight={25}
        rowGroupPanelShow='never'
        columnDefs={columnDefs}
        loading={isLoading}
        updateEP={updateQuoteCompetitorDetails}
      />
    </div>
  )
}
