import type { PriceException, Quote } from '@modules/PricingEngine/QuoteBook/Api/types.schema'
import {
  type PriceExceptionsByRow,
  type PublicationModes,
  type UpdateAdjustmentsRequest,
  useQuoteBookTyped,
} from '@modules/PricingEngine/QuoteBook/Api/useQuoteBookTyped'
import { useMemo, useState } from 'react'

interface UsePriceExceptionConfirmFlowArgs {
  publicationMode: PublicationModes
  dirtyQuotes: Quote[]
}

export interface PendingExceptionRow {
  mappingId: number
  productName: string
  locationName: string
  exceptions: PriceException[]
}

export function usePriceExceptionConfirmFlow({ publicationMode, dirtyQuotes }: UsePriceExceptionConfirmFlowArgs) {
  const { useQuoteBookUpdateAdjustmentsMutation, useEvaluatePriceExceptionsMutation, applyPriceExceptionsToCache } =
    useQuoteBookTyped()
  const updateAdjustments = useQuoteBookUpdateAdjustmentsMutation()
  const evaluatePriceExceptions = useEvaluatePriceExceptionsMutation()

  const [isOpen, setIsOpen] = useState(false)
  const [pendingExceptionsByRow, setPendingExceptionsByRow] = useState<PriceExceptionsByRow[]>([])
  const [pendingSavePayload, setPendingSavePayload] = useState<UpdateAdjustmentsRequest | null>(null)

  const pendingRows = useMemo<PendingExceptionRow[]>(() => {
    const quoteByMappingId = new Map(dirtyQuotes.map((q) => [q.QuoteConfigurationMappingId, q]))
    return pendingExceptionsByRow
      .filter((r) => r.Exceptions.length > 0)
      .map((r) => {
        const quote = quoteByMappingId.get(r.QuoteConfigurationMappingId)
        return {
          mappingId: r.QuoteConfigurationMappingId,
          productName: quote?.ProductName ?? '',
          locationName: quote?.LocationName ?? '',
          exceptions: r.Exceptions,
        }
      })
  }, [pendingExceptionsByRow, dirtyQuotes])

  const buildAdjustmentPayload = (saveScope: Quote[]): UpdateAdjustmentsRequest => {
    const adjustments = saveScope.map((quote) => ({
      QuoteConfigurationMappingId: quote.QuoteConfigurationMappingId,
      Adjustment: typeof quote.Adjustment === 'string' ? parseFloat(quote.Adjustment) : quote.Adjustment || 0,
      MarketMoveOverride: quote.MarketMoveOverride ?? null,
    }))
    return { PublicationMode: publicationMode, Updates: adjustments }
  }

  const submit = async () => {
    const saveScope = dirtyQuotes.filter((dq) => !dq.SpreadParentMappingId)
    const payload = buildAdjustmentPayload(saveScope)
    try {
      const resultsByRow = await evaluatePriceExceptions.mutateAsync(saveScope)
      const hasExceptions = resultsByRow.some((r) => r.Exceptions.length > 0)
      if (hasExceptions) {
        setPendingExceptionsByRow(resultsByRow)
        setPendingSavePayload(payload)
        setIsOpen(true)
      } else {
        updateAdjustments.mutate(payload)
      }
    } catch {
      // onError already surfaced via toastApiError
    }
  }

  const confirm = () => {
    if (pendingSavePayload) {
      updateAdjustments.mutate(pendingSavePayload)
    }
    reset()
  }

  const cancel = () => {
    applyPriceExceptionsToCache(publicationMode, pendingExceptionsByRow)
    reset()
  }

  function reset() {
    setIsOpen(false)
    setPendingSavePayload(null)
    setPendingExceptionsByRow([])
  }

  return { submit, confirm, cancel, reset, isOpen, pendingRows }
}
