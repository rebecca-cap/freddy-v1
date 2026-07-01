/**
 * Type-safe Quote Book API hook using OpenAPI generated types
 *
 * Migration notes:
 * - Old: api.post('QuoteBook/SaveSpreadOverrides', { ...payload } as any)
 * - New: api.POST('/api/QuoteBook/SaveSpreadOverrides', { body: payload })
 */

import { toastApiError } from '@api/common'
import { NotificationMessage } from '@gravitate-js/excalibrr'
import { type InferRequestBody, type InferResponse, queryKey, unwrap, useTypedApi } from '@hooks/useTypedApi'
import type { PriceException, Quote } from '@modules/PricingEngine/QuoteBook/Api/types.schema'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

type GetRowsResponse = InferResponse<'/api/QuoteBook/GetRows'>
type PublishResponse = InferResponse<'/api/QuoteBook/Publish'>
type UpdateAdjustmentsResponse = InferResponse<'/api/QuoteBook/UpdateAdjustments'>
type SaveSpreadOverridesResponse = InferResponse<'/api/QuoteBook/SaveSpreadOverrides'>

type GetRowsRequest = InferRequestBody<'/api/QuoteBook/GetRows'>
type PublishRequest = InferRequestBody<'/api/QuoteBook/Publish'>
export type UpdateAdjustmentsRequest = InferRequestBody<'/api/QuoteBook/UpdateAdjustments'>
type SaveSpreadOverridesRequest = InferRequestBody<'/api/QuoteBook/SaveSpreadOverrides'>
type EvaluatePriceExceptionsRequest = InferRequestBody<'/api/QuoteBook/EvaluatePriceExceptions'>

// Publication modes type alias
export type PublicationModes = GetRowsRequest['PublicationMode']

export type PriceExceptionsByRow = { QuoteConfigurationMappingId: number; Exceptions: PriceException[] }

// Query Keys

const queryKeys = {
  overview: (publicationMode?: PublicationModes) => [...queryKey('/api/QuoteBook/GetRows'), publicationMode] as const,
  metadata: (publicationMode?: PublicationModes) =>
    [...queryKey('/api/QuoteBook/GetMetaData'), publicationMode] as const,
  referenceStrategy: (quoteConfigurationMappingId?: number) =>
    [
      ...queryKey('/api/QuoteBook/Analytics/ReferenceStrategy/GetDataForAnalytic'),
      quoteConfigurationMappingId,
    ] as const,
} as const

// Helper Functions

const seedUnimplementedData = (response: GetRowsResponse): GetRowsResponse => {
  return {
    ...response,
    Data: response?.Data?.map((row) => ({
      ...row,
      Allocation: Math.ceil(Math.random() * 100),
    })),
  }
}

export const useQuoteBookTyped = () => {
  const queryClient = useQueryClient()
  const api = useTypedApi()

  /**
   * Fetch quote book rows
   */
  const useQuotes = (PublicationMode?: PublicationModes) =>
    useQuery({
      queryKey: queryKeys.overview(PublicationMode),
      queryFn: async () => {
        const data = await unwrap(
          api.POST('/api/QuoteBook/GetRows', {
            body: { PublicationMode },
          })
        )
        return seedUnimplementedData(data as GetRowsResponse)
      },
      enabled: !!PublicationMode,
      refetchOnWindowFocus: false,
    })

  /**
   * Fetch quote book metadata
   */
  const useQuoteBookMetaData = (PublicationMode?: PublicationModes) =>
    useQuery({
      queryKey: queryKeys.metadata(PublicationMode),
      queryFn: () =>
        unwrap(
          api.POST('/api/QuoteBook/GetMetaData', {
            body: { PublicationMode },
          })
        ),
      refetchOnWindowFocus: false,
      enabled: !!PublicationMode,
    })

  /**
   * Publish quote book
   */
  const useQuoteBookPublishMutation = () =>
    useMutation<PublishResponse, Error, PublishRequest>({
      mutationKey: queryKey('/api/QuoteBook/Publish'),
      mutationFn: (QuoteBookPublishData: PublishRequest) =>
        unwrap(
          api.POST('/api/QuoteBook/Publish', {
            body: QuoteBookPublishData,
          })
        ),
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: queryKey('/api/QuoteBook/GetRows') })
      },
      onError: (e) => toastApiError(e as Parameters<typeof toastApiError>[0]),
    })

  /**
   * Update quote book adjustments
   */
  const useQuoteBookUpdateAdjustmentsMutation = () =>
    useMutation<UpdateAdjustmentsResponse, Error, UpdateAdjustmentsRequest>({
      mutationKey: queryKey('/api/QuoteBook/UpdateAdjustments'),
      mutationFn: (payload: UpdateAdjustmentsRequest) =>
        unwrap(
          api.POST('/api/QuoteBook/UpdateAdjustments', {
            body: payload,
          })
        ),
      onSuccess: async () => {
        NotificationMessage('Success', 'Adjustment(s) saved successfully', false)
        await queryClient.invalidateQueries({ queryKey: queryKey('/api/QuoteBook/GetRows') })
      },
      onError: (e) => {
        toastApiError(e as Parameters<typeof toastApiError>[0], 5)
      },
    })

  /**
   * Save spread overrides
   */
  const useQuoteBookSaveSpreadOverridesMutation = () =>
    useMutation<SaveSpreadOverridesResponse, Error, SaveSpreadOverridesRequest>({
      mutationKey: queryKey('/api/QuoteBook/SaveSpreadOverrides'),
      mutationFn: (payload: SaveSpreadOverridesRequest) =>
        unwrap(
          api.POST('/api/QuoteBook/SaveSpreadOverrides', {
            body: payload,
          })
        ),
      onError: (e) => {
        toastApiError(e as Parameters<typeof toastApiError>[0], 5)
      },
    })

  /**
   * Get reference strategy data
   */
  const getReferenceStrategyData = (QuoteConfigurationMappingId?: number) =>
    useQuery({
      queryKey: queryKeys.referenceStrategy(QuoteConfigurationMappingId),
      queryFn: () =>
        unwrap(
          api.POST('/api/QuoteBook/Analytics/ReferenceStrategy/GetDataForAnalytic', {
            body: { QuoteConfigurationMappingId },
          })
        ),
      refetchOnWindowFocus: false,
      enabled: !!QuoteConfigurationMappingId,
    })

  /**
   * Evaluate price exceptions before saving adjustments. Returns one entry per input row,
   * in the same order, with its QuoteConfigurationMappingId and any exceptions found.
   */
  const useEvaluatePriceExceptionsMutation = () =>
    useMutation<PriceExceptionsByRow[], Error, Quote[]>({
      mutationKey: queryKey('/api/QuoteBook/EvaluatePriceExceptions'),
      mutationFn: async (dirtyRows: Quote[]) => {
        const body: EvaluatePriceExceptionsRequest = {
          Rows: dirtyRows.map((row) => ({
            QuoteConfigurationMappingId: row.QuoteConfigurationMappingId,
            ProposedPrice: row.ProposedPrice,
            Cost: row.Cost,
            MarketMoveValue: row.MarketMoveValue,
            Benchmarks: row.Benchmarks,
            PriorQuotePeriod: row.PriorQuotePeriod,
          })),
        }

        const result = await unwrap(api.POST('/api/QuoteBook/EvaluatePriceExceptions', { body }))
        const rowResponses = result?.Data ?? []

        return dirtyRows.map((row, i) => ({
          QuoteConfigurationMappingId: row.QuoteConfigurationMappingId,
          Exceptions: rowResponses[i]?.Exceptions ?? [],
        }))
      },
      onError: (e) => toastApiError(e as Parameters<typeof toastApiError>[0]),
    })

  // Latest evaluation wins: rows with no evaluated exceptions get PriceExceptions: null,
  // overwriting any server-attached exceptions that no longer reflect current adjustments.
  const applyPriceExceptionsToCache = (publicationMode: PublicationModes, resultsByRow: PriceExceptionsByRow[]) => {
    if (resultsByRow.length === 0) return
    const exceptionsByMappingId = new Map(resultsByRow.map((r) => [r.QuoteConfigurationMappingId, r.Exceptions]))
    queryClient.setQueryData<GetRowsResponse>(queryKeys.overview(publicationMode), (old) => {
      if (!old?.Data) return old
      return {
        ...old,
        Data: old.Data.map((row) => {
          if (!exceptionsByMappingId.has(row.QuoteConfigurationMappingId)) return row
          const updated = exceptionsByMappingId.get(row.QuoteConfigurationMappingId) ?? []
          return { ...row, PriceExceptions: updated.length > 0 ? updated : null }
        }),
      }
    })
  }

  /**
   * Fetch filtered rows by specific QuoteConfigurationMappingIds
   */
  const fetchFilteredRows = async (PublicationMode: PublicationModes, QuoteConfigurationMappings: number[]) => {
    const data = await unwrap(
      api.POST('/api/QuoteBook/GetRows', {
        body: { PublicationMode, QuoteConfigurationMappings },
      })
    )
    return seedUnimplementedData(data as GetRowsResponse)
  }

  return {
    useQuotes,
    useQuoteBookMetaData,
    useQuoteBookPublishMutation,
    useQuoteBookUpdateAdjustmentsMutation,
    getReferenceStrategyData,
    useQuoteBookSaveSpreadOverridesMutation,
    fetchFilteredRows,
    useEvaluatePriceExceptionsMutation,
    applyPriceExceptionsToCache,
    queryClient,
  }
}
