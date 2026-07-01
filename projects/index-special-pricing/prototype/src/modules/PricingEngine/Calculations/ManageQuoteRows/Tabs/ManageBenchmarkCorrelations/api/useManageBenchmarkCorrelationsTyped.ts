/**
 * Type-safe Manage Benchmark Correlations API hook using OpenAPI generated types
 *
 * Migration notes:
 * - Old: api.post('Quotebook/BenchmarkCorrelation/Admin/SyncCorrelatedAssociations', payload as any)
 * - New: api.POST('/api/QuoteBook/BenchmarkCorrelation/Admin/SyncCorrelatedAssociations', { body: payload })
 */

import { toastApiError } from '@api/common'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import {
  useTypedApi,
  unwrap,
  queryKey,
  type InferResponse,
  type InferRequestBody,
} from '@hooks/useTypedApi'

type GetMetaDataResponse = InferResponse<'/api/QuoteBook/BenchmarkCorrelation/Admin/GetMetaData'>
type ReadManagementDataResponse = InferResponse<'/api/QuoteBook/BenchmarkCorrelation/Admin/ReadManagementData'>
export type SyncCorrelatedAssociationsResponse = InferResponse<'/api/QuoteBook/BenchmarkCorrelation/Admin/SyncCorrelatedAssociations'>
type GetLatestMeasurementsResponse = InferResponse<'/api/BenchmarkCorrelation/Measurement/GetLatestMeasurementsForQuoteRow'>

export type SyncCorrelatedAssociationsRequest = InferRequestBody<'/api/QuoteBook/BenchmarkCorrelation/Admin/SyncCorrelatedAssociations'>
type GetLatestMeasurementsRequest = InferRequestBody<'/api/BenchmarkCorrelation/Measurement/GetLatestMeasurementsForQuoteRow'>

// Query Keys

const queryKeys = {
  metadata: queryKey('/api/QuoteBook/BenchmarkCorrelation/Admin/GetMetaData'),
  managementData: queryKey('/api/QuoteBook/BenchmarkCorrelation/Admin/ReadManagementData'),
  latestMeasurements: (quoteConfigurationMappingId: number) =>
    [...queryKey('/api/BenchmarkCorrelation/Measurement/GetLatestMeasurementsForQuoteRow'), quoteConfigurationMappingId] as const,
} as const

export const useManageBenchmarkCorrelationsTyped = () => {
  const queryClient = useQueryClient()
  const api = useTypedApi()

  /**
   * Fetch benchmark correlations metadata
   */
  const useBenchmarkCorrelationsMetadata = () =>
    useQuery({
      queryKey: queryKeys.metadata,
      queryFn: () => unwrap(api.POST('/api/QuoteBook/BenchmarkCorrelation/Admin/GetMetaData')),
      refetchOnWindowFocus: false,
    })

  /**
   * Fetch benchmark correlations management data
   */
  const useBenchmarkCorrelations = () =>
    useQuery({
      queryKey: queryKeys.managementData,
      queryFn: () => unwrap(api.POST('/api/QuoteBook/BenchmarkCorrelation/Admin/ReadManagementData')),
      refetchOnWindowFocus: false,
    })

  /**
   * Sync correlated associations
   */
  const useCreateCorrelatedAssociationsMutation = () =>
    useMutation({
      mutationFn: (payload: SyncCorrelatedAssociationsRequest) =>
        unwrap(
          api.POST('/api/QuoteBook/BenchmarkCorrelation/Admin/SyncCorrelatedAssociations', {
            body: payload,
          })
        ),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.managementData })
      },
      onError: (e) => toastApiError(e, 10),
    })

  /**
   * Fetch latest measurements for a quote row
   */
  const useLatestMeasurements = (quoteConfigurationMappingId: number) =>
    useQuery({
      queryKey: queryKeys.latestMeasurements(quoteConfigurationMappingId),
      queryFn: () =>
        unwrap(
          api.POST('/api/BenchmarkCorrelation/Measurement/GetLatestMeasurementsForQuoteRow', {
            body: { QuoteConfigurationMappingId: quoteConfigurationMappingId },
          })
        ),
      refetchOnWindowFocus: false,
    })

  return {
    useBenchmarkCorrelationsMetadata,
    useBenchmarkCorrelations,
    useCreateCorrelatedAssociationsMutation,
    useLatestMeasurements,
  }
}
