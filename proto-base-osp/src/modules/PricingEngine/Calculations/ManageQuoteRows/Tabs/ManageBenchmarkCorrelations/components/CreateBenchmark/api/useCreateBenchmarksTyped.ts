/**
 * Type-safe Create Benchmarks API hook using OpenAPI generated types
 *
 * Migration notes:
 * - Old: api.post('Quotebook/BenchmarkCorrelation/Admin/CreateSpotMarketCorrelatedBenchmark', data as any)
 * - New: api.POST('/api/QuoteBook/BenchmarkCorrelation/Admin/CreateSpotMarketCorrelatedBenchmark', { body: data })
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import {
  useTypedApi,
  unwrap,
  queryKey,
  type InferResponse,
  type InferRequestBody,
} from '@hooks/useTypedApi'

type GetMetaDataResponse = InferResponse<'/api/QuoteBook/BenchmarkCorrelation/Admin/GetMetaData'>
export type CreateSpotMarketResponse = InferResponse<'/api/QuoteBook/BenchmarkCorrelation/Admin/CreateSpotMarketCorrelatedBenchmark'>
export type CreateRackAverageResponse = InferResponse<'/api/QuoteBook/BenchmarkCorrelation/Admin/CreateRackAverageCorrelatedBenchmark'>
export type CreateRackLowResponse = InferResponse<'/api/QuoteBook/BenchmarkCorrelation/Admin/CreateRackLowCorrelatedBenchmark'>
export type CreateCompetitorResponse = InferResponse<'/api/QuoteBook/BenchmarkCorrelation/Admin/CreateCompetitorCorrelatedBenchmark'>

export type CreateSpotMarketRequest = InferRequestBody<'/api/QuoteBook/BenchmarkCorrelation/Admin/CreateSpotMarketCorrelatedBenchmark'>
export type CreateRackAverageRequest = InferRequestBody<'/api/QuoteBook/BenchmarkCorrelation/Admin/CreateRackAverageCorrelatedBenchmark'>
export type CreateRackLowRequest = InferRequestBody<'/api/QuoteBook/BenchmarkCorrelation/Admin/CreateRackLowCorrelatedBenchmark'>
export type CreateCompetitorRequest = InferRequestBody<'/api/QuoteBook/BenchmarkCorrelation/Admin/CreateCompetitorCorrelatedBenchmark'>

// Query Keys

const queryKeys = {
  metadata: queryKey('/api/QuoteBook/BenchmarkCorrelation/Admin/GetMetaData'),
} as const

export const useCreateBenchmarksTyped = () => {
  const api = useTypedApi()
  const queryClient = useQueryClient()

  /**
   * Fetch benchmark metadata
   */
  const useBenchmarkMetadata = () =>
    useQuery({
      queryKey: queryKeys.metadata,
      queryFn: () => unwrap(api.POST('/api/QuoteBook/BenchmarkCorrelation/Admin/GetMetaData')),
      refetchOnWindowFocus: false,
    })

  /**
   * Create spot market correlated benchmark
   */
  const createSpotBenchmark = useMutation({
    mutationKey: queryKey('/api/QuoteBook/BenchmarkCorrelation/Admin/CreateSpotMarketCorrelatedBenchmark'),
    mutationFn: (data: CreateSpotMarketRequest) =>
      unwrap(
        api.POST('/api/QuoteBook/BenchmarkCorrelation/Admin/CreateSpotMarketCorrelatedBenchmark', {
          body: data,
        })
      ),
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.metadata, (oldData: GetMetaDataResponse | undefined) => {
        if (!oldData?.Data) return oldData
        return {
          ...oldData,
          Data: {
            ...oldData.Data,
            SpotMarketBenchmarks: [
              ...(oldData.Data.SpotMarketBenchmarks || []),
              { ...data?.Data, CorrelatedCalculationId: data?.Data?.Id },
            ],
          },
        }
      })
    },
  })

  /**
   * Create rack average correlated benchmark
   */
  const createRackAverageBenchmark = useMutation({
    mutationKey: queryKey('/api/QuoteBook/BenchmarkCorrelation/Admin/CreateRackAverageCorrelatedBenchmark'),
    mutationFn: (data: CreateRackAverageRequest) =>
      unwrap(
        api.POST('/api/QuoteBook/BenchmarkCorrelation/Admin/CreateRackAverageCorrelatedBenchmark', {
          body: data,
        })
      ),
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.metadata, (oldData: GetMetaDataResponse | undefined) => {
        if (!oldData?.Data) return oldData
        return {
          ...oldData,
          Data: {
            ...oldData.Data,
            RackAverageBenchmarks: [
              ...(oldData.Data.RackAverageBenchmarks || []),
              { ...data?.Data, CorrelatedCalculationId: data?.Data?.Id },
            ],
          },
        }
      })
    },
  })

  /**
   * Create rack low correlated benchmark
   */
  const createRackLowBenchmark = useMutation({
    mutationKey: queryKey('/api/QuoteBook/BenchmarkCorrelation/Admin/CreateRackLowCorrelatedBenchmark'),
    mutationFn: (data: CreateRackLowRequest) =>
      unwrap(
        api.POST('/api/QuoteBook/BenchmarkCorrelation/Admin/CreateRackLowCorrelatedBenchmark', {
          body: data,
        })
      ),
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.metadata, (oldData: GetMetaDataResponse | undefined) => {
        if (!oldData?.Data) return oldData
        return {
          ...oldData,
          Data: {
            ...oldData.Data,
            RackLowBenchmarks: [
              ...(oldData.Data.RackLowBenchmarks || []),
              { ...data?.Data, CorrelatedCalculationId: data?.Data?.Id },
            ],
          },
        }
      })
    },
  })

  /**
   * Create competitor correlated benchmark
   */
  const createCompetitorBenchmark = useMutation({
    mutationKey: queryKey('/api/QuoteBook/BenchmarkCorrelation/Admin/CreateCompetitorCorrelatedBenchmark'),
    mutationFn: (data: CreateCompetitorRequest) =>
      unwrap(
        api.POST('/api/QuoteBook/BenchmarkCorrelation/Admin/CreateCompetitorCorrelatedBenchmark', {
          body: data,
        })
      ),
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.metadata, (oldData: GetMetaDataResponse | undefined) => {
        if (!oldData?.Data) return oldData
        return {
          ...oldData,
          Data: {
            ...oldData.Data,
            CompetitorBenchmarks: [
              ...(oldData.Data.CompetitorBenchmarks || []),
              { ...data?.Data, CorrelatedCalculationId: data?.Data?.Id },
            ],
          },
        }
      })
    },
  })

  return {
    useBenchmarkMetadata,
    createSpotBenchmark,
    createRackAverageBenchmark,
    createRackLowBenchmark,
    createCompetitorBenchmark,
  }
}
