import { useApi } from '@gravitate-js/excalibrr'
import { useTypedApi, unwrap, queryKey, type InferResponse, type InferRequestBody } from '@hooks/useTypedApi'
import { findMyType, getPriceStatus, ProvisionTypes } from '@modules/ContractManagement/utils'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import dayjs from '@utils/dayjs'

import { ContractDetails, ContractManagementMetadata, TradeResponse } from './types.schema'

type SubmitContractResponse = InferResponse<'/api/ContractManagement/Upsert'>
type SubmitContractRequest = InferRequestBody<'/api/ContractManagement/Upsert'>

type SelectOption = { Value: any; Label: string; GroupingValue: string | null }
export type ContractManagementOptions = Record<keyof ContractManagementMetadata, SelectOption[]>

export const contractQueryKeys = {
  details: queryKey('/api/ContractManagement/GetDetails'),
  duplicate: queryKey('/api/ContractManagement/Duplicate'),
  metadata: ['allMeta'] as const,
} as const

export const useContractsTyped = () => {
  const api = useTypedApi()
  const legacyApi = useApi()
  const queryClient = useQueryClient()

  const cancelContract = () =>
    useMutation({
      mutationKey: queryKey('/api/ContractManagement/Cancel'),
      mutationFn: (id: number) =>
        unwrap(api.POST('/api/ContractManagement/Cancel', {
          body: { tradeEntryId: id },
        })),
      onMutate: async (id) => {
        await queryClient.cancelQueries({ queryKey: [`EntityReport::${id}::Data`] })
        const previousQueries = queryClient.getQueriesData({ queryKey: [`EntityReport::TradeEntry::Data`] })
        queryClient.setQueriesData({ queryKey: [`EntityReport::TradeEntry::Data`] }, (cache: any) => {
          return {
            ...cache,
            Data: cache.Data?.map((row: any) => {
              return row.TradeEntryId === id ? { ...row, OrderStatus: 'Canceled' } : row
            }),
          }
        })
        return { id, previousQueries }
      },
      onError: (_err, id, context: any) => {
        queryClient.setQueriesData({ queryKey: [`EntityReport::${id}::Data`] }, context.previousQueries)
      },
    })

  const useContractDetails = (id: number | string, type = '') => {
    const path = type
      ? '/api/ContractManagement/Duplicate' as const
      : '/api/ContractManagement/GetDetails' as const
    return useQuery({
      queryKey: [...queryKey(path), id],
      queryFn: async () => {
        const response = await unwrap(api.POST(path, {
          body: { tradeEntryId: id },
        }))
        return dataNormalizer(response?.Data) as ContractDetails
      },
      enabled: !!id && id !== 'createContract',
      refetchOnWindowFocus: false,
    })
  }

  const useALLContractManagementData = () =>
    useQuery<ContractManagementMetadata>({
      queryKey: ['allMeta'],
      queryFn: async () => {
        const response = await unwrap(api.POST('/api/ContractManagement/MetaData'))
        return response?.Data as ContractManagementMetadata
      },
      staleTime: 1000 * 60 * 10,
      refetchOnWindowFocus: false,
    })

  // This endpoint is not in the OpenAPI spec - keep using legacy API
  function getContracts() {
    let data: any = {
      IsActiveFilterType: 'ActiveOnly',
      OrderingFields: [
        { FieldName: 'EffectiveFromDateTime', SortDirection: 'Descending' },
        { FieldName: 'InternalContractNumber', SortDirection: 'Descending' },
      ],
      Count: 100,
      Offset: 0,
      SearchString: null,
    }
    data = { ...data, ...getDefaultDateFilter() }
    return legacyApi.post<TradeResponse>('TransactionalData/TradeData/GetTradesByQuery', data)
  }

  const submitContract = async (contract: any): Promise<SubmitContractResponse> => {
    return unwrap(api.POST('/api/ContractManagement/Upsert', {
      body: contract,
    }))
  }

  const useContractDetailNetGrossDefault = (
    LocationId: number,
    ProductId: number,
    CounterPartyId: number,
    TradeEntryTypeCvId: number,
    activeTabId: string
  ) =>
    useQuery({
      queryKey: [...queryKey('/api/Admin/NetGrossRules/GetContractDefaultCvId'), LocationId, ProductId, CounterPartyId, TradeEntryTypeCvId, activeTabId],
      queryFn: () =>
        unwrap(api.POST('/api/Admin/NetGrossRules/GetContractDefaultCvId', {
          body: { LocationId, ProductId, CounterPartyId, TradeEntryTypeCvId },
        })),
      enabled: !!LocationId && !!ProductId,
      refetchOnWindowFocus: false,
    })

  return {
    getContracts,
    useContractDetails,
    useALLContractManagementData,
    cancelContract,
    submitContract,
    useContractDetailNetGrossDefault,
  }
}

const getDefaultDateFilter = () => {
  function firstDayOfMonth(yourDate: Date) {
    return new Date(yourDate.getFullYear(), yourDate.getMonth(), 1)
  }

  const minDate = firstDayOfMonth(new Date())
  minDate.setMonth(minDate.getMonth() - 6)
  minDate.setFullYear(2000)

  let maxDate = new Date()
  const fiscal = new Date(maxDate.getFullYear(), 3, 1)
  if (maxDate > fiscal) maxDate = new Date(maxDate.getFullYear() + 1, 3, 1)

  return {
    MinEffectiveDate: dayjs(minDate).format(),
    MaxEffectiveDate: dayjs(maxDate).format(),
    IncludeOverlappingEffectiveDates: true,
  }
}

const dataNormalizer = (data: any) => {
  data.FromDateTime = dayjs(data.FromDateTime)
  data.ToDateTime = dayjs(data.ToDateTime)
  data.TradeEntryDateTime = dayjs(data.TradeEntryDateTime)
  data.EffectiveDates = [data.FromDateTime, data.ToDateTime]
  data.ExternalColleagueId = data.ExternalColleagueId?.toString()
  data.ExternalCounterPartyId = data.ExternalCounterPartyId?.toString()
  data.InternalColleagueId = data.InternalColleagueId?.toString()
  data.InternalCounterPartyId = data.InternalCounterPartyId?.toString()
  data.Details = data.Details.map((detail: any) => {
    return {
      ...detail,
      FromDateTime: dayjs(detail.FromDateTime),
      ToDateTime: dayjs(detail.ToDateTime),
      EffectiveDates: [dayjs(detail.FromDateTime), dayjs(detail.ToDateTime)],
      FromLocationId: detail?.FromLocationId?.toString(),
      ToLocationId: detail?.ToLocationId?.toString(),
      ProductId: detail?.ProductId?.toString(),
      Quantities: [...detail.Quantities] || [],
      UnitOfMeasureId: detail?.UnitOfMeasureId?.toString(),
      NetOrGrossCvId: detail?.NetOrGrossCvId?.toString(),
      Prices: !detail.Prices?.length
        ? detail.Prices
        : detail.Prices?.map((price: any) => {
            const ProvisionType = findMyType(price?.Formula?.FormulaVariables, data.IsExtracted)
            return {
              ...price,
              ProvisionType,
              FixedValue:
                ProvisionType === ProvisionTypes.FIXED ? price?.Formula?.FormulaVariables[0]?.FixedValue : null,
              Status: getPriceStatus(
                price,
                ProvisionType,
                price?.Formula?.FormulaVariables?.[0]?.FixedValue,
                dayjs(detail.FromDateTime),
                dayjs(detail.ToDateTime)
              ),
            }
          }),
      Status: detail.Status ?? setDetailStatus(detail),
    }
  })
  return data
}

const setDetailStatus = (detail: any) => {
  const isInProgress = detail?.Quantities?.find((item: any) => !item.Quantity)
  if (detail.Prices && detail.Prices.length > 0 && !isInProgress) {
    return 'Valid'
  }
  return 'In Progress'
}
