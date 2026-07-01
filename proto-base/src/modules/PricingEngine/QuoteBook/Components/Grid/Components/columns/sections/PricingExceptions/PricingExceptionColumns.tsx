import type { Quote, QuoteBookMetadataResponse } from '@modules/PricingEngine/QuoteBook/Api/types.schema'
import type { ColGroupDef } from 'ag-grid-community'

import { ExceptionCountColumn } from './CountColumn'
import { ExceptionDetailsColumn } from './DetailColumn'

interface PricingExceptionColumnsProps {
  metadata?: QuoteBookMetadataResponse
}

export function PricingExceptionColumns({ metadata }: PricingExceptionColumnsProps): ColGroupDef<Quote> {
  return {
    headerName: 'Pricing Exceptions',
    marryChildren: true,
    children: [ExceptionCountColumn(metadata), ExceptionDetailsColumn(metadata)],
  }
}
