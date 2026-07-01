import type { QuoteBookMetadataResponse } from '@modules/PricingEngine/QuoteBook/Api/types.schema'

export interface QuoteBookColumnVisibility {
  showOriginDestinationColumns: boolean
  showLocationColumn: boolean
}

export function getColumnVisibilityFlags(metadata?: QuoteBookMetadataResponse): QuoteBookColumnVisibility {
  if (!metadata) {
    return { showOriginDestinationColumns: false, showLocationColumn: false }
  }
  return {
    showOriginDestinationColumns: !!metadata.ShowOriginDestinationColumns,
    showLocationColumn: !!metadata.ShowLocationColumn,
  }
}
