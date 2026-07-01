import { useApi } from '@gravitate-js/excalibrr'
import {
  BenchmarkMetadataResponse,
  CreateBenchmarkPayload,
  CreateBenchmarkResponse,
  CreateCompetitorBenchmarkPayload,
} from '@modules/PricingEngine/Calculations/ManageQuoteRows/Tabs/ManageBenchmarkCorrelations/components/CreateBenchmark/api/schema.types'
import { useMutation, useQuery, useQueryClient, UseQueryResult } from '@tanstack/react-query'

const endpoints = {
  getMetadata: 'Quotebook/BenchmarkCorrelation/Admin/GetMetadata',
  createSpotBenchmark: 'Quotebook/BenchmarkCorrelation/Admin/CreateSpotMarketCorrelatedBenchmark',
  createRackAverageBenchmark: 'Quotebook/BenchmarkCorrelation/Admin/CreateRackAverageCorrelatedBenchmark',
  createRackLowBenchmark: 'Quotebook/BenchmarkCorrelation/Admin/CreateRackLowCorrelatedBenchmark',
  createCompetitorBenchmark: 'Quotebook/BenchmarkCorrelation/Admin/CreateCompetitorCorrelatedBenchmark',
}

export const useCreateBenchmarks = () => {
  const api = useApi()
  const queryClient = useQueryClient()

  const useBenchmarkMetadata = (): UseQueryResult<BenchmarkMetadataResponse> =>
    useQuery<BenchmarkMetadataResponse>([endpoints.getMetadata], () => api.post(endpoints.getMetadata), {
      refetchOnWindowFocus: false,
    })

  const createSpotBenchmark = useMutation(
    [endpoints.createSpotBenchmark],
    (data: CreateBenchmarkPayload): Promise<CreateBenchmarkResponse> =>
      api.post(endpoints.createSpotBenchmark, data as any),
    {
      onSuccess: (data) => {
        queryClient.setQueryData([endpoints.getMetadata], (oldData: any) => {
          return {
            ...oldData,
            Data: {
              ...oldData.Data,
              SpotMarketBenchmarks: [
                ...oldData.Data.SpotMarketBenchmarks,
                { ...data.Data, CorrelatedCalculationId: data.Data.Id },
              ],
            },
          }
        })
      },
    }
  )

  const createRackAverageBenchmark = useMutation(
    [endpoints.createRackAverageBenchmark],
    (data: CreateBenchmarkPayload): Promise<CreateBenchmarkResponse> =>
      api.post(endpoints.createRackAverageBenchmark, data as any),
    {
      onSuccess: (data) => {
        queryClient.setQueryData([endpoints.getMetadata], (oldData: any) => {
          return {
            ...oldData,
            Data: {
              ...oldData.Data,
              RackAverageBenchmarks: [
                ...oldData.Data.RackAverageBenchmarks,
                { ...data.Data, CorrelatedCalculationId: data.Data.Id },
              ],
            },
          }
        })
      },
    }
  )

  const createRackLowBenchmark = useMutation(
    [endpoints.createRackLowBenchmark],
    (data: CreateBenchmarkPayload): Promise<CreateBenchmarkResponse> =>
      api.post(endpoints.createRackLowBenchmark, data as any),
    {
      onSuccess: (data) => {
        queryClient.setQueryData([endpoints.getMetadata], (oldData: any) => {
          return {
            ...oldData,
            Data: {
              ...oldData.Data,
              RackLowBenchmarks: [
                ...oldData.Data.RackLowBenchmarks,
                { ...data.Data, CorrelatedCalculationId: data.Data.Id },
              ],
            },
          }
        })
      },
    }
  )

  const createCompetitorBenchmark = useMutation(
    [endpoints.createCompetitorBenchmark],
    (data: CreateCompetitorBenchmarkPayload): Promise<CreateBenchmarkResponse> =>
      api.post(endpoints.createCompetitorBenchmark, data as any),
    {
      onSuccess: (data) => {
        queryClient.setQueryData([endpoints.getMetadata], (oldData: any) => {
          return {
            ...oldData,
            Data: {
              ...oldData.Data,
              CompetitorBenchmarks: [
                ...oldData.Data.CompetitorBenchmarks,
                { ...data.Data, CorrelatedCalculationId: data.Data.Id },
              ],
            },
          }
        })
      },
    }
  )

  return {
    useBenchmarkMetadata,
    createSpotBenchmark,
    createRackAverageBenchmark,
    createRackLowBenchmark,
    createCompetitorBenchmark,
  }
}
