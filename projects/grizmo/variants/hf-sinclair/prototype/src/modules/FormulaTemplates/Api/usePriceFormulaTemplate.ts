import { APIResponse } from '@api/globalTypes'
import { NotificationMessage, useApi } from '@gravitate-js/excalibrr'
import { useMutation, useQuery, useQueryClient, UseQueryResult } from '@tanstack/react-query'

import { FormulaTemplateEndpoints, PEFormulaTemplateEndpoints } from './FormulaTemplateEndpoints'
import { FormulaTemplateDetails, FormulaTemplateMetadata, FormulaTemplateRawMetadata } from './types.schema'

export function usePriceFormulaTemplate(endpoints: FormulaTemplateEndpoints = PEFormulaTemplateEndpoints) {
  const api = useApi()
  const queryClient = useQueryClient()

  const getAllFormulaTemplatesQuery = () =>
    useQuery({
      queryKey: [endpoints.getAllFormulaTemplates],
      queryFn: () => api.post(endpoints.getAllFormulaTemplates) as Promise<APIResponse<FormulaTemplateDetails[]>>,
    }) as UseQueryResult<APIResponse<FormulaTemplateDetails[]>, Error>

  const useSaveFormulaTemplateMutation = useMutation({
    mutationFn: (formulaTemplate: Partial<FormulaTemplateDetails>) =>
      // @ts-expect-error excalibrr useApi types don't support object body params
      api.post<APIResponse<FormulaTemplateDetails>>(endpoints.saveFormulaTemplate, formulaTemplate),
    onSuccess: async () => {
      await queryClient.invalidateQueries([endpoints.getAllFormulaTemplates])
      await queryClient.invalidateQueries(['allMeta'])
      NotificationMessage('Success', 'Formula Template saved successfully', false)
    },
    onError: (error: any) =>
      NotificationMessage('Unable to save', error?.json?.Validations?.[0]?.Message ?? 'Error on save formula', true),
  })

  const useDeleteFormulaTemplateMutation = useMutation({
    mutationFn: (FormulaTemplateIds: number[]) =>
      // @ts-expect-error excalibrr useApi types don't support object body params
      api.post<APIResponse<void>>(endpoints.deleteFormulaTemplate, { FormulaTemplateIds }),
    onSuccess: async () => {
      await queryClient.invalidateQueries([endpoints.getAllFormulaTemplates])
      NotificationMessage('Success', 'Formula Template(s) deleted successfully', false)
    },
    onError: () => NotificationMessage('Error', 'Unable to delete formula', true),
  })

  const useMetadataQuery = (enabled = true) =>
    useQuery({
      queryKey: [endpoints.metadata],
      queryFn: () => api.post(endpoints.metadata) as Promise<FormulaTemplateMetadata>,
      enabled,
      staleTime: 2 * 60 * 1000,
      refetchOnWindowFocus: false,
    }) as UseQueryResult<FormulaTemplateMetadata>

  const useRawMetadataQuery = () =>
    useQuery({
      queryKey: [endpoints.rawMetadata],
      queryFn: () => api.post(endpoints.rawMetadata) as Promise<FormulaTemplateRawMetadata>,
    }) as UseQueryResult<FormulaTemplateRawMetadata>

  return {
    useSaveFormulaTemplateMutation,
    useDeleteFormulaTemplateMutation,
    getAllFormulaTemplatesQuery,
    useMetadataQuery,
    useRawMetadataQuery,
  }
}
