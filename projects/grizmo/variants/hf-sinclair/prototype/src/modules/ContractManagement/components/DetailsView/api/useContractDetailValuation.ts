import { useApi } from '@gravitate-js/excalibrr'
import { ValuationDataResponse } from '@modules/ContractManagement/components/DetailsView/api/types.schema'
import { useQuery } from '@tanstack/react-query'

const endpoints = {
  contractDetailValuation: 'PriceEngine/Formula/ValueContractDetails',
  contractValuation: 'PriceEngine/Formula/ValueContract',
}
export const useContractDetailValuation = () => {
  const api = useApi()

  const getContractDetailValuation = (TradeEntryDetailIds: number[]) =>
    useQuery<ValuationDataResponse>(
      [endpoints.contractDetailValuation, TradeEntryDetailIds],
      () => api.post(endpoints.contractDetailValuation, { TradeEntryDetailIds }),
      {
        refetchOnWindowFocus: false,
        enabled: TradeEntryDetailIds?.length > 0,
      }
    )
  const getContractValuation = (TradeEntryId?: number | string) =>
    useQuery<ValuationDataResponse>(
      [endpoints.contractValuation, TradeEntryId],
      () => api.post(endpoints.contractValuation, { TradeEntryId }),
      { refetchOnWindowFocus: false, enabled: !!TradeEntryId }
    )

  return { getContractDetailValuation, getContractValuation }
}
