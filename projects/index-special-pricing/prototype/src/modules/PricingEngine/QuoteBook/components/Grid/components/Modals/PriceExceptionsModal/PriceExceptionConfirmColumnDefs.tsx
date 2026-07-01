import type { QuoteBookMetadataResponse } from '@modules/PricingEngine/QuoteBook/Api/types.schema'
import type { PendingExceptionRow } from '@modules/PricingEngine/QuoteBook/Api/usePriceExceptionConfirmFlow'
import { ExceptionCountSummary } from '@modules/PricingEngine/QuoteBook/Components/Grid/Components/columns/sections/PricingExceptions/CountColumn'
import { ResponsiveTagCluster } from '@modules/PricingEngine/QuoteBook/Components/Grid/Components/columns/sections/PricingExceptions/DetailColumn'
import type { ColDef, ICellRendererParams } from 'ag-grid-community'

export function getPriceExceptionConfirmColumnDefs(
  metadata?: QuoteBookMetadataResponse
): ColDef<PendingExceptionRow>[] {
  return [
    {
      headerName: 'Quote',
      valueGetter: ({ data }) =>
        data ? [data.productName, data.locationName].filter(Boolean).join(' / ') || `Mapping ${data.mappingId}` : '',
    },
    {
      headerName: 'Exceptions',
      cellRenderer: ({ data }: ICellRendererParams<PendingExceptionRow>) =>
        data ? <ExceptionCountSummary exceptions={data.exceptions} metadata={metadata} /> : null,
    },
    {
      headerName: 'Details',
      cellRenderer: ({ data }: ICellRendererParams<PendingExceptionRow>) => {
        if (data) {

          return <ResponsiveTagCluster exceptions={data.exceptions} metadata={metadata} />
        }
        return null
      },
    },
  ]
}
