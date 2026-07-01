import { toastApiError } from '@api/common'
import { useApi } from '@gravitate-js/excalibrr'
import {
  BenchmarkCorrelationLatestMeasurementsAPIResponse,
  BenchmarkCorrelationsResponse,
  BenchmarkMetadataResponse,
  CreateCorrelatedAssociationRequest,
  CreateCorrelatedAssociationsResponse,
} from '@modules/PricingEngine/Calculations/ManageQuoteRows/Tabs/ManageBenchmarkCorrelations/api/schema.types'
import { useMutation, useQuery, useQueryClient, UseQueryResult } from '@tanstack/react-query'

const endpoints = {
  getMetadata: 'Quotebook/BenchmarkCorrelation/Admin/GetMetadata',
  readBenchmarkCorrelations: 'Quotebook/BenchmarkCorrelation/Admin/ReadManagementData',
  createCorrelatedAssociations: 'Quotebook/BenchmarkCorrelation/Admin/SyncCorrelatedAssociations',
  getLatestMeasurements: 'BenchmarkCorrelation/Measurement/GetLatestMeasurementsForQuoteRow',
} as const

export const useManageBenchmarkCorrelations = () => {
  const queryClient = useQueryClient()
  const api = useApi()

  const useBenchmarkCorrelationsMetadata = (): UseQueryResult<BenchmarkMetadataResponse> =>
    useQuery<BenchmarkMetadataResponse>([endpoints.getMetadata], () => api.post(endpoints.getMetadata), {
      refetchOnWindowFocus: false,
    })

  const useBenchmarkCorrelations = (): UseQueryResult<BenchmarkCorrelationsResponse> =>
    useQuery<BenchmarkCorrelationsResponse>(
      [endpoints.readBenchmarkCorrelations],
      async ({ queryKey }) => {
        const response = await api.post(queryKey[0] as string)
        return response as BenchmarkCorrelationsResponse
      },
      {
        refetchOnWindowFocus: false,
      }
    )

  const useCreateCorrelatedAssociationsMutation = () =>
    useMutation<CreateCorrelatedAssociationsResponse, unknown, CreateCorrelatedAssociationRequest[]>({
      mutationFn: async (payload: CreateCorrelatedAssociationRequest[]) => {
        return api.post(endpoints.createCorrelatedAssociations, payload as any)
      },
      onSuccess: (response) => {
        queryClient.invalidateQueries([endpoints.readBenchmarkCorrelations])
      },
      onError: (e) => toastApiError(e, 10),
    })

  const useLatestMeasurements = (
    quoteConfigurationMappingId: number
  ): UseQueryResult<BenchmarkCorrelationLatestMeasurementsAPIResponse> =>
    useQuery<BenchmarkCorrelationLatestMeasurementsAPIResponse>(
      [endpoints.getLatestMeasurements, quoteConfigurationMappingId],
      async () =>
        api.post(endpoints.getLatestMeasurements, { QuoteConfigurationMappingId: quoteConfigurationMappingId }),
      {
        refetchOnWindowFocus: false,
      }
    )

  return {
    useBenchmarkCorrelationsMetadata,
    useBenchmarkCorrelations,
    useCreateCorrelatedAssociationsMutation,
    useLatestMeasurements,
  }
}
