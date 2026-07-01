import { queryKey, unwrap, useTypedApi } from '@hooks/useTypedApi'
import { useQuery } from '@tanstack/react-query'

export const useQuoteAnalyticsAllocationTyped = () => {
  const api = useTypedApi()

  const getAllocationDataQuery = (QuoteConfigurationMappingId: number) =>
    useQuery({
      queryKey: [
        ...queryKey('/api/QuoteBook/Analytics/Allocation/GetDataForAnalytic'),
        { QuoteConfigurationMappingId },
      ],
      queryFn: () =>
        unwrap(
          api.POST('/api/QuoteBook/Analytics/Allocation/GetDataForAnalytic', {
            body: { QuoteConfigurationMappingId },
          })
        ),
      refetchOnWindowFocus: false,
      enabled: !!QuoteConfigurationMappingId,
    })

  return { getAllocationDataQuery }
}
