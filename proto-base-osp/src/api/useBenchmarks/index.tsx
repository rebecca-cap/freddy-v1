import { UpsertBenchmarkPayload } from '@api/useBenchmarks/types'
import { useApi } from '@gravitate-js/excalibrr'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

const endpoints = {
  metadata: 'QuoteConfigurationManagement/Benchmark/Metadata',
  upsert: 'QuoteConfigurationManagement/Benchmark/Upsert',
  getAll: 'QuoteConfigurationManagement/Benchmark/GetAll',
} as const

export const useBenchmarks = () => {
  const queryClient = useQueryClient()
  const api = useApi()

  const useBenchmarkMetadata = () =>
    useQuery([endpoints.metadata], async ({ queryKey }) => api.post(queryKey[0]), {
      refetchOnWindowFocus: false,
    })

  const useBenchmarksGetAll = () =>
    useQuery([endpoints.getAll], async () => api.post(endpoints.getAll), {
      refetchOnWindowFocus: false,
    })

  const useUpsertBenchmark = useMutation({
    mutationFn: (payload: UpsertBenchmarkPayload[]) => api.post(endpoints.upsert, { Benchmarks: payload }),
    onSuccess: () => {
      queryClient.invalidateQueries([endpoints.getAll])
      queryClient.invalidateQueries([endpoints.metadata])
    },
  })

  return { useBenchmarkMetadata, useBenchmarksGetAll, useUpsertBenchmark }
}
