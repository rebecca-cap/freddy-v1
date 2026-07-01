import { useQuery } from '@tanstack/react-query'
import { useTypedApi, unwrap, queryKey, type InferResponse } from '@hooks/useTypedApi'

type ContractDetailValuationResponse = InferResponse<'/api/PriceEngine/Formula/ValueContractDetails'>
type ContractValuationResponse = InferResponse<'/api/PriceEngine/Formula/ValueContract'>

export const useContractDetailValuationTyped = () => {
  const api = useTypedApi()

  const getContractDetailValuation = (TradeEntryDetailIds: number[]) =>
    useQuery({
      queryKey: [...queryKey('/api/PriceEngine/Formula/ValueContractDetails'), TradeEntryDetailIds],
      queryFn: () =>
        unwrap(api.POST('/api/PriceEngine/Formula/ValueContractDetails', {
          body: { TradeEntryDetailIds },
        })),
      refetchOnWindowFocus: false,
      enabled: TradeEntryDetailIds?.length > 0,
    })

  const getContractValuation = (TradeEntryId?: number | string) =>
    useQuery({
      queryKey: [...queryKey('/api/PriceEngine/Formula/ValueContract'), TradeEntryId],
      queryFn: () =>
        unwrap(api.POST('/api/PriceEngine/Formula/ValueContract', {
          body: { TradeEntryId },
        })),
      refetchOnWindowFocus: false,
      enabled: !!TradeEntryId,
    })

  return { getContractDetailValuation, getContractValuation }
}
