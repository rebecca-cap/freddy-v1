// Competitor Mappings — typed React Query hooks for the CompetitorPriceAdmin
// and QuoteConfigurationManagement controllers.

import { NotificationMessage } from '@gravitate-js/excalibrr'
import { type components, queryKey, unwrap, useTypedApi } from '@hooks/useTypedApi'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import type {
  AddSingleAssociationRequest,
  BulkCreateMappingsRequest,
  BulkUpdateVisibilityRequest,
  CompetitorMappingsMetadata,
  FindMatchingCompetitorsRequest,
  FindMatchingCompetitorsResponse,
  ToggleVisibilityRequest,
  UpdateAssociationCategoryRequest,
  UpdateRankCategoriesRequest,
} from './types.schema'

export type { BulkUpdateVisibilityRequest }

type ValidationResult = components['schemas']['Library.Validation.ValidationResult']

const queryKeys = {
  metadata: queryKey('/api/QuoteBook/Analytics/CompetitorPriceAdmin/Metadata'),
  mappings: queryKey('/api/QuoteConfigurationManagement/GetMappings'),
  associations: (mappingId: number) =>
    [...queryKey('/api/QuoteBook/Analytics/CompetitorPriceAdmin/Get'), mappingId] as const,
} as const

// These endpoints return HTTP 200 with a Validations array on logical
// rejection; `unwrap` only throws on non-2xx. Throw here so onError fires
// with the BE's message instead of onSuccess firing on a rejection.
function throwIfValidationErrors<T>(response: T, fallbackMessage: string): T {
  const errors = ((response as { Validations?: ValidationResult[] })?.Validations ?? []).filter(
    (v) => v?.Severity === 'Error'
  )
  if (errors.length > 0) {
    throw new Error(
      errors
        .map((v) => v.Message)
        .filter(Boolean)
        .join('; ') || fallbackMessage
    )
  }
  return response
}

// onError handler — surfaces the thrown Error's message, fallback otherwise.
function showErrorToast(fallbackMessage: string) {
  return (err: unknown) => {
    const msg = err instanceof Error && err.message ? err.message : fallbackMessage
    NotificationMessage('Error', msg, true)
  }
}

export const useCompetitorMappingsTyped = () => {
  const queryClient = useQueryClient()
  const api = useTypedApi()

  // BE returns an untyped DataResult; shape is CompetitorPricingAdminMetadataResult.
  const useCompetitorMappingsMetadata = () =>
    useQuery({
      queryKey: queryKeys.metadata,
      queryFn: async () => {
        const result = await unwrap(api.POST('/api/QuoteBook/Analytics/CompetitorPriceAdmin/Metadata'))
        return (result as { Data: CompetitorMappingsMetadata }).Data
      },
      staleTime: Infinity,
      refetchOnWindowFocus: false,
    })

  // Reuses the same query key as the main Quote Rows tab so we share its
  // cache. Returns the wrapped result; callers extract `.Data`.
  const useCompetitorMappingQuoteRows = () =>
    useQuery({
      queryKey: queryKeys.mappings,
      queryFn: () => unwrap(api.POST('/api/QuoteConfigurationManagement/GetMappings', { body: {} })),
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
    })

  const useCompetitorAssociations = (mappingId: number | undefined) =>
    useQuery({
      queryKey: queryKeys.associations(mappingId ?? -1),
      queryFn: async () => {
        const result = await unwrap(
          api.POST('/api/QuoteBook/Analytics/CompetitorPriceAdmin/Get', {
            body: { QuoteConfigurationMappingId: mappingId ?? 0 },
          })
        )
        return result?.Data ?? []
      },
      enabled: !!mappingId,
      refetchOnWindowFocus: false,
    })

  const useFindMatchingCompetitorsMutation = () =>
    useMutation<FindMatchingCompetitorsResponse, unknown, FindMatchingCompetitorsRequest>({
      mutationFn: async (body) =>
        throwIfValidationErrors(
          await unwrap(api.POST('/api/QuoteBook/Analytics/CompetitorPriceAdmin/FindMatchingCompetitors', { body })),
          'Failed to find matching competitors'
        ),
      onError: showErrorToast('Failed to find matching competitors'),
    })

  const useBulkCreateMappingsMutation = () =>
    useMutation<unknown, unknown, BulkCreateMappingsRequest>({
      mutationFn: async (body) =>
        throwIfValidationErrors(
          await unwrap(api.POST('/api/QuoteBook/Analytics/CompetitorPriceAdmin/Upsert', { body })),
          'Failed to create mappings'
        ),
      onSuccess: (_data, request) => {
        const count = request.Associations?.length ?? 0
        NotificationMessage('Save Successful', `${count} mapping${count === 1 ? '' : 's'} created`, false)
        queryClient.invalidateQueries({ queryKey: queryKeys.mappings })
        request.Associations?.forEach((a) => {
          if (a.QuoteConfigurationMappingId == null) return
          queryClient.invalidateQueries({ queryKey: queryKeys.associations(a.QuoteConfigurationMappingId) })
        })
      },
      onError: showErrorToast('Failed to create mappings'),
    })

  const useUpdateRankCategoriesMutation = () =>
    useMutation<unknown, unknown, UpdateRankCategoriesRequest>({
      mutationFn: async (body) =>
        throwIfValidationErrors(
          await unwrap(api.POST('/api/QuoteConfigurationManagement/UpdateRankCategories', { body })),
          'Failed to update rank categories'
        ),
      onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.mappings }),
      onError: showErrorToast('Failed to update rank categories'),
    })

  const useUpdateAssociationCategoryMutation = () =>
    useMutation<unknown, unknown, UpdateAssociationCategoryRequest>({
      mutationFn: async (body) =>
        throwIfValidationErrors(
          await unwrap(api.POST('/api/QuoteBook/Analytics/CompetitorPriceAdmin/UpdateAssociationCategory', { body })),
          'Failed to update association rank category'
        ),
      onSuccess: (_data, request) => {
        if (request.QuoteConfigurationMappingId == null) return
        queryClient.invalidateQueries({ queryKey: queryKeys.associations(request.QuoteConfigurationMappingId) })
      },
      onError: showErrorToast('Failed to update association rank category'),
    })

  // Visibility toggle and single-add both go through Upsert with a one-item array.
  const useToggleVisibilityMutation = () =>
    useMutation<unknown, unknown, ToggleVisibilityRequest>({
      mutationFn: async (request) =>
        throwIfValidationErrors(
          await unwrap(
            api.POST('/api/QuoteBook/Analytics/CompetitorPriceAdmin/Upsert', {
              body: {
                Associations: [
                  {
                    QuoteConfigurationMappingId: request.QuoteConfigurationMappingId,
                    PriceInstrumentId: request.PriceInstrumentId,
                    IsHiddenByDefault: request.IsHiddenByDefault,
                    IsHighlighted: request.IsHighlighted ?? false,
                    QuoteCompetitorCategoryId: request.QuoteCompetitorCategoryId ?? null,
                  },
                ],
              },
            })
          ),
          'Failed to toggle visibility'
        ),
      onSuccess: (_data, request) => {
        queryClient.invalidateQueries({ queryKey: queryKeys.associations(request.QuoteConfigurationMappingId) })
        // Refresh the master grid's inline CompetitorPriceAssociations[] so
        // its IsHiddenByDefault / IsHighlighted projection stays in sync.
        queryClient.invalidateQueries({ queryKey: queryKeys.mappings })
      },
      onError: showErrorToast('Failed to toggle visibility'),
    })

  // Bulk visibility: one Upsert with all matched associations. Caller sends
  // QuoteCompetitorCategoryId: null per item — BE merge ignores it on update.
  const useBulkUpdateVisibilityMutation = () =>
    useMutation<unknown, unknown, BulkUpdateVisibilityRequest>({
      mutationFn: async (body) =>
        throwIfValidationErrors(
          await unwrap(api.POST('/api/QuoteBook/Analytics/CompetitorPriceAdmin/Upsert', { body })),
          'Failed to update visibility'
        ),
      onSuccess: (_data, request) => {
        const count = request.Associations?.length ?? 0
        NotificationMessage('Save Successful', `${count} association${count === 1 ? '' : 's'} updated`, false)
        new Set(request.Associations?.map((a) => a.QuoteConfigurationMappingId) ?? []).forEach((id) =>
          queryClient.invalidateQueries({ queryKey: queryKeys.associations(id) })
        )
        // Refresh the master grid's inline CompetitorPriceAssociations[] so
        // its IsHiddenByDefault / IsHighlighted projection stays in sync.
        queryClient.invalidateQueries({ queryKey: queryKeys.mappings })
      },
      onError: showErrorToast('Failed to update visibility'),
    })

  const useAddSingleAssociationMutation = () =>
    useMutation<unknown, unknown, AddSingleAssociationRequest>({
      mutationFn: async (request) =>
        throwIfValidationErrors(
          await unwrap(
            api.POST('/api/QuoteBook/Analytics/CompetitorPriceAdmin/Upsert', {
              body: {
                Associations: [
                  {
                    QuoteConfigurationMappingId: request.QuoteConfigurationMappingId,
                    PriceInstrumentId: request.PriceInstrumentId,
                    QuoteCompetitorCategoryId: request.QuoteCompetitorCategoryId,
                    IsHiddenByDefault: request.IsHiddenByDefault,
                    IsHighlighted: false,
                  },
                ],
              },
            })
          ),
          'Failed to add competitor'
        ),
      onSuccess: (_data, request) => {
        NotificationMessage('Save Successful', 'Competitor added', false)
        queryClient.invalidateQueries({ queryKey: queryKeys.associations(request.QuoteConfigurationMappingId) })
        queryClient.invalidateQueries({ queryKey: queryKeys.mappings })
      },
      onError: showErrorToast('Failed to add competitor'),
    })

  return {
    useCompetitorMappingsMetadata,
    useCompetitorMappingQuoteRows,
    useCompetitorAssociations,
    useFindMatchingCompetitorsMutation,
    useBulkCreateMappingsMutation,
    useUpdateRankCategoriesMutation,
    useUpdateAssociationCategoryMutation,
    useToggleVisibilityMutation,
    useBulkUpdateVisibilityMutation,
    useAddSingleAssociationMutation,
  }
}
