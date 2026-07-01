/**
 * Type-safe Price Engine Formulas API hook using OpenAPI generated types
 *
 * Migration notes:
 * - Old: api.post('PriceEngine/Formula/GetAll')
 * - New: api.POST('/api/PriceEngine/Formula/GetAll')
 */

import { type InferRequestBody, type InferResponse, queryKey, unwrap, useTypedApi } from '@hooks/useTypedApi'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { NotificationMessage } from '@gravitate-js/excalibrr'

// Response types from OpenAPI
export type FormulasReadResponse = InferResponse<'/api/PriceEngine/Formula/GetAll'>
export type FormulasMetadataResponse = InferResponse<'/api/PriceEngine/Formula/Metadata'>
export type FormulaCloneResponse = InferResponse<'/api/PriceEngine/Formula/Clone'>
export type AffectedQuoteRowsResponse = InferResponse<'/api/PriceEngine/Formula/AffectedQuoteRows'>
export type ValueQuoteRowResponse = InferResponse<'/api/PriceEngine/Formula/ValueQuoteRow'>
export type MarkerUpsertResponse = InferResponse<'/api/PriceEngine/Formula/Marker/Upsert'>
export type FormulaValidateResponse = InferResponse<'/api/PriceEngine/Formula/ValidateSyntax'>
export type FormulaDeleteResponse = InferResponse<'/api/PriceEngine/Formula/Delete'>
export type FormulaUpsertResponse = InferResponse<'/api/PriceEngine/Formula/Upsert'>

// Request body types from OpenAPI
export type FormulaUpsertRequest = InferRequestBody<'/api/PriceEngine/Formula/Upsert'>
export type FormulaValidateRequest = InferRequestBody<'/api/PriceEngine/Formula/ValidateSyntax'>
export type MarkerUpsertRequest = InferRequestBody<'/api/PriceEngine/Formula/Marker/Upsert'>
export type MarkerDeleteRequest = InferRequestBody<'/api/PriceEngine/Formula/Marker/Delete'>
export type FormulaDeleteRequest = InferRequestBody<'/api/PriceEngine/Formula/Delete'>
export type FormulaCloneRequest = InferRequestBody<'/api/PriceEngine/Formula/Clone'>
export type AffectedQuoteRowsRequest = InferRequestBody<'/api/PriceEngine/Formula/AffectedQuoteRows'>
export type ValueQuoteRowRequest = InferRequestBody<'/api/PriceEngine/Formula/ValueQuoteRow'>

// Nested types for convenience
export type FormulaData = NonNullable<FormulasReadResponse['Data']>[number] & {
  $isNew?: boolean
  $blueprintId?: number
}
export type FormulaVariable = NonNullable<FormulaData['Variables']>[number] & { $isNew?: boolean }
export type AffectedQuoteRow = NonNullable<AffectedQuoteRowsResponse['Data']>[number]

// Marker types from metadata
export type MarkerData = NonNullable<MarkerUpsertResponse['Data']>
export type MetadataMarker = NonNullable<FormulasMetadataResponse['Markers']>[number]
export type MetadataItem = NonNullable<FormulasMetadataResponse['Locations']>[number]
export type PublisherPriceTypes = NonNullable<FormulasMetadataResponse['PublisherPriceTypes']>

// Extended metadata type with computed PublisherPriceInstruments (grouped from Instruments by publisher ID)
export type FormulasMetadataWithInstruments = FormulasMetadataResponse & {
  PublisherPriceInstruments?: { [publisherId: number]: MetadataItem[] }
}

// Query Keys
const queryKeys = {
  read: queryKey('/api/PriceEngine/Formula/GetAll'),
  metadata: queryKey('/api/PriceEngine/Formula/Metadata'),
  affectedQuoteRows: (formulaId: number | undefined) =>
    [...queryKey('/api/PriceEngine/Formula/AffectedQuoteRows'), formulaId] as const,
  valueQuoteRow: (req: ValueQuoteRowRequest | undefined) =>
    [...queryKey('/api/PriceEngine/Formula/ValueQuoteRow'), req] as const,
} as const

export const usePriceEngineFormulasTyped = () => {
  const api = useTypedApi()
  const queryClient = useQueryClient()

  /**
   * Fetch all formulas
   */
  const useFormulasQuery = () =>
    useQuery({
      queryKey: queryKeys.read,
      queryFn: () => unwrap(api.POST('/api/PriceEngine/Formula/GetAll')),
      refetchOnWindowFocus: false,
    })

  /**
   * Fetch formula metadata (lookups, markers, etc)
   */
  const useFormulasMetadataQuery = () =>
    useQuery({
      queryKey: queryKeys.metadata,
      queryFn: () => unwrap(api.POST('/api/PriceEngine/Formula/Metadata')),
      refetchOnWindowFocus: false,
    })

  /**
   * Fetch affected quote rows for a formula
   */
  const useAffectedQuoteRowsQuery = (selectedFormulaId: number | undefined) =>
    useQuery({
      queryKey: queryKeys.affectedQuoteRows(selectedFormulaId),
      queryFn: () =>
        unwrap(
          api.POST('/api/PriceEngine/Formula/AffectedQuoteRows', {
            body: { FormulaId: selectedFormulaId },
          })
        ),
      refetchOnWindowFocus: false,
      enabled: !!selectedFormulaId,
    })

  /**
   * Value quote row for a specific configuration
   */
  const useValueQuoteRowQuery = (req: ValueQuoteRowRequest) =>
    useQuery({
      queryKey: queryKeys.valueQuoteRow(req),
      queryFn: () => unwrap(api.POST('/api/PriceEngine/Formula/ValueQuoteRow', { body: req })),
      refetchOnWindowFocus: false,
      enabled: !!req.QuoteConfigurationMappingId,
    })

  /**
   * Upsert (create/update) a formula
   */
  const useFormulaUpsertMutation = () =>
    useMutation({
      mutationKey: ['/api/PriceEngine/Formula/Upsert'],
      mutationFn: (payload: FormulaUpsertRequest) =>
        unwrap(api.POST('/api/PriceEngine/Formula/Upsert', { body: payload })),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.read })
      },
      onError: () => {
        NotificationMessage('Error', 'Failed to save formula', true)
      },
    })

  /**
   * Delete a formula
   */
  type FormulaDeleteMutationProps = {
    onSuccess?: () => void
  }

  const useFormulaDeleteMutation = (props: FormulaDeleteMutationProps = {}) =>
    useMutation({
      mutationKey: ['/api/PriceEngine/Formula/Delete'],
      mutationFn: (FormulaId: number | undefined) =>
        unwrap(api.POST('/api/PriceEngine/Formula/Delete', { body: { FormulaId } })),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.read })
        NotificationMessage('Success', 'Formula deleted', false)
        props.onSuccess?.()
      },
      onError: () => {
        NotificationMessage('Error', 'Failed to delete formula', true)
      },
    })

  /**
   * Clone/duplicate a formula
   */
  const useFormulaDuplicateMutation = () =>
    useMutation({
      mutationKey: ['/api/PriceEngine/Formula/Clone'],
      mutationFn: (FormulaId: number | undefined) =>
        unwrap(api.POST('/api/PriceEngine/Formula/Clone', { body: { FormulaId } })),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.read })
        NotificationMessage('Success', 'Formula duplicated', false)
      },
      onError: () => {
        NotificationMessage('Error', 'Failed to duplicate formula', true)
      },
    })

  /**
   * Validate formula syntax
   */
  const useFormulaValidateMutation = () =>
    useMutation({
      mutationKey: ['/api/PriceEngine/Formula/ValidateSyntax'],
      mutationFn: (payload: FormulaValidateRequest) =>
        unwrap(api.POST('/api/PriceEngine/Formula/ValidateSyntax', { body: payload })),
      onError: () => {
        NotificationMessage('Error', 'Failed to validate formula syntax', true)
      },
    })

  /**
   * Upsert (create/update) a marker
   */
  type MarkerUpsertInput = {
    MarkerId?: string | number
    Name: string
    ProductHierarchyTypeCvId: string
    LocationHierarchyTypeCvId: string
    CounterPartyHierarchyDefinitionId?: string | number
  }

  const useFormulaMarkerUpsertMutation = () =>
    useMutation<MarkerUpsertResponse, Error, MarkerUpsertInput>({
      mutationKey: ['/api/PriceEngine/Formula/Marker/Upsert'],
      mutationFn: ({
        MarkerId,
        Name,
        ProductHierarchyTypeCvId,
        LocationHierarchyTypeCvId,
        CounterPartyHierarchyDefinitionId,
      }) =>
        unwrap(
          api.POST('/api/PriceEngine/Formula/Marker/Upsert', {
            body: {
              MarkerId: typeof MarkerId === 'string' ? parseInt(MarkerId, 10) : MarkerId,
              Name,
              ProductHierarchyTypeCvId: parseInt(ProductHierarchyTypeCvId, 10),
              LocationHierarchyTypeCvId: parseInt(LocationHierarchyTypeCvId, 10),
              CounterPartyHierarchyDefinitionId:
                typeof CounterPartyHierarchyDefinitionId === 'string'
                  ? parseInt(CounterPartyHierarchyDefinitionId, 10)
                  : CounterPartyHierarchyDefinitionId,
            },
          })
        ),
      onSuccess: (resp, payload) => {
        if (resp?.Validations && resp.Validations.length > 0) {
          NotificationMessage('Error', resp.Validations[0]?.Message ?? 'Unknown error', true)
        } else {
          if (payload?.MarkerId) {
            queryClient.setQueriesData<FormulasReadResponse>({ queryKey: queryKeys.read }, (oldData) => {
              if (!oldData) return oldData
              return {
                ...oldData,
                Data: oldData.Data?.map((f) => {
                  if (f.MarkerId == payload?.MarkerId) {
                    return {
                      ...f,
                      MarkerId: resp?.Data?.MarkerId,
                      MarkerName: resp?.Data?.Name,
                    }
                  }
                  return f
                }),
              }
            })
          }
          queryClient.setQueriesData<FormulasMetadataResponse>({ queryKey: queryKeys.metadata }, (oldData) => {
            if (!oldData) return undefined
            const existingMarkers = oldData.Markers ?? []
            const updatedMarkers = payload?.MarkerId
              ? existingMarkers.map((m) => {
                  if (m.Value === payload.MarkerId?.toString()) {
                    return { ...m, Value: String(payload.MarkerId), Text: payload.Name }
                  }
                  return m
                })
              : [...existingMarkers, { Value: resp?.Data?.MarkerId?.toString(), Text: resp?.Data?.Name ?? '' }]
            return {
              ...oldData,
              Markers: updatedMarkers,
            }
          })
        }

        NotificationMessage('Success', 'Marker added', false)
      },
      onError: () => {
        NotificationMessage('Error', 'Failed to save marker', true)
      },
    })

  /**
   * Delete a marker
   */
  const useFormulaMarkerDeleteMutation = () =>
    useMutation({
      mutationKey: ['/api/PriceEngine/Formula/Marker/Delete'],
      mutationFn: (MarkerId: number | undefined) =>
        unwrap(api.POST('/api/PriceEngine/Formula/Marker/Delete', { body: { MarkerId } })),
      onMutate: (deletedId) => {
        const previousData = queryClient.getQueryData<FormulasMetadataResponse>(queryKeys.metadata)
        queryClient.setQueriesData<FormulasMetadataResponse>({ queryKey: queryKeys.metadata }, (oldData) => {
          if (!oldData) return oldData
          return {
            ...oldData,
            Markers: oldData.Markers?.filter((m) => m.Value !== deletedId?.toString()),
          }
        })
        return { previousData }
      },
      onSuccess: () => {
        NotificationMessage('Success', 'Marker deleted', false)
      },
      onError: (_err, _deletedId, context) => {
        if (context?.previousData) {
          queryClient.setQueryData(queryKeys.metadata, context.previousData)
        }
        NotificationMessage('Error', 'Failed to delete marker', true)
      },
    })

  /**
   * Initialize a new formula in the cache (optimistic update)
   */
  const initializeNewFormula = (formula: Partial<FormulaData> & { $isNew?: boolean }) => {
    queryClient.setQueriesData<FormulasReadResponse>({ queryKey: queryKeys.read }, (oldData) => {
      if (!oldData) return oldData
      return {
        ...oldData,
        Data: [{ ...formula, $isNew: true } as FormulaData, ...(oldData.Data ?? [])],
      }
    })
  }

  /**
   * Initialize a new variable in a formula (optimistic update)
   */
  const initializeNewVariable = (formulaId: number, variable: Partial<FormulaVariable>) => {
    queryClient.setQueriesData<FormulasReadResponse>({ queryKey: queryKeys.read }, (oldData) => {
      if (!oldData) return oldData
      return {
        ...oldData,
        Data: oldData.Data?.map((f) => {
          if (f.FormulaId === formulaId) {
            return {
              ...f,
              Variables: [
                ...(f.Variables ?? []),
                {
                  ...variable,
                  FormulaVariableId: Math.floor(Math.random() * -100000),
                  $isNew: true,
                } as FormulaVariable,
              ],
            }
          }
          return f
        }),
      }
    })
  }

  /**
   * Remove unsaved variables from a formula
   */
  const flushNewVariables = (formulaId: number) => {
    queryClient.setQueriesData<FormulasReadResponse>({ queryKey: queryKeys.read }, (oldData) => {
      if (!oldData) return oldData
      return {
        ...oldData,
        Data: oldData.Data?.map((f) => {
          if (f.FormulaId === formulaId) {
            return {
              ...f,
              Variables: f.Variables?.filter((v) => !(v as FormulaVariable).$isNew),
            }
          }
          return f
        }),
      }
    })
  }

  /**
   * Remove unsaved formulas from cache
   */
  const flushNewFormulas = () => {
    queryClient.setQueriesData<FormulasReadResponse>({ queryKey: queryKeys.read }, (oldData) => {
      if (!oldData) return oldData
      return {
        ...oldData,
        Data: oldData.Data?.filter((f) => !(f as FormulaData).$isNew),
      }
    })
  }

  return {
    useFormulasQuery,
    useFormulasMetadataQuery,
    useAffectedQuoteRowsQuery,
    useValueQuoteRowQuery,
    useFormulaUpsertMutation,
    useFormulaDeleteMutation,
    useFormulaDuplicateMutation,
    useFormulaValidateMutation,
    useFormulaMarkerUpsertMutation,
    useFormulaMarkerDeleteMutation,
    initializeNewFormula,
    initializeNewVariable,
    flushNewVariables,
    flushNewFormulas,
  }
}
