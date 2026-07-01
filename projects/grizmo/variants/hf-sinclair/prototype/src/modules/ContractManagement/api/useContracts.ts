import { useApi } from '@gravitate-js/excalibrr'
import { findMyType, getPriceStatus, ProvisionTypes } from '@modules/ContractManagement/utils'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import moment from 'moment'

import {
  ContractDetailNetGrossDefaultResponse,
  ContractDetails,
  ContractManagementMetadata,
  TradeResponse,
} from './types.schema'

export const endpoints = {
  metadata: 'ContractManagement/MetaData',
  details: 'ContractManagement/GetDetails',
  cancel: 'ContractManagement/Cancel',
  duplicateDetails: 'ContractManagement/Duplicate',
  submit: 'ContractManagement/Upsert',
  getContractDefaultNetGrossId: 'Admin/NetGrossRules/GetContractDefaultCvId',
}

type SelectOption = { Value: any; Label: string; GroupingValue: string | null }

export type ContractManagementOptions = Record<keyof ContractManagementMetadata, SelectOption[]>

export const useContracts = () => {
  const api = useApi()
  const queryClient = useQueryClient()

  const cancelContract = () =>
    useMutation([endpoints.cancel], (id) => api.post(`${endpoints.cancel}`, { tradeEntryId: id }), {
      onMutate: async (id) => {
        await queryClient.cancelQueries([`EntityReport::${id}::Data`])
        const previousQueries = queryClient.getQueriesData([`EntityReport::TradeEntry::Data`])
        // Optimistically update to the new value
        queryClient.setQueriesData([`EntityReport::TradeEntry::Data`], (cache: any) => {
          return {
            ...cache,
            Data: cache.Data?.map((row) => {
              return row.TradeEntryId === id ? { ...row, OrderStatus: 'Canceled' } : row
            }),
          }
        })
        return { id, previousQueries }
      },
      onError: (err, id, context) => {
        queryClient.setQueriesData([`EntityReport::${id}::Data`], context.previousQueries)
      },
    })

  const useContractDetails = (id, type = '') => {
    const endpointToUse = type ? endpoints.duplicateDetails : endpoints.details
    return useQuery(
      [endpointToUse, id],
      async () => {
        const { Data } = await api.post(endpointToUse, { tradeEntryId: id })
        return dataNormalizer(Data) as ContractDetails
      },
      { enabled: !!id && id !== 'createContract', refetchOnWindowFocus: false }
    )
  }

  const useALLContractManagementData = () =>
    useQuery<ContractManagementMetadata>(
      ['allMeta'],
      async () => {
        const { Data } = await api.post(endpoints.metadata)
        return Data
      },
      { staleTime: 1000 * 60 * 10, refetchOnWindowFocus: false }
    )

  function getContracts() {
    let data = {
      IsActiveFilterType: 'ActiveOnly',
      OrderingFields: [
        {
          FieldName: 'EffectiveFromDateTime',
          SortDirection: 'Descending',
        },
        {
          FieldName: 'InternalContractNumber',
          SortDirection: 'Descending',
        },
      ],
      Count: 100,
      Offset: 0,
      SearchString: null,
    }

    data = { ...data, ...getDefaultDateFilter() }

    return api.post<TradeResponse>('TransactionalData/TradeData/GetTradesByQuery', data)
  }

  const submitContract = async (contract) => {
    return api.post(endpoints.submit, contract)
  }

  const useContractDetailNetGrossDefault = (LocationId, ProductId, CounterPartyId, TradeEntryTypeCvId, activeTabId) =>
    useQuery<ContractDetailNetGrossDefaultResponse>(
      [endpoints.getContractDefaultNetGrossId, LocationId, ProductId, CounterPartyId, TradeEntryTypeCvId, activeTabId],
      () =>
        api.post(endpoints.getContractDefaultNetGrossId, {
          LocationId,
          ProductId,
          CounterPartyId,
          TradeEntryTypeCvId,
        }),
      { enabled: !!LocationId && !!ProductId, refetchOnWindowFocus: false }
    )

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
  function firstDayOfMonth(yourDate) {
    return new Date(yourDate.getFullYear(), yourDate.getMonth(), 1)
  }

  const minDate = firstDayOfMonth(new Date())
  minDate.setMonth(minDate.getMonth() - 6)
  minDate.setFullYear(2000)

  let maxDate = new Date()
  const fiscal = new Date(maxDate.getFullYear(), 3, 1)
  if (maxDate > fiscal) maxDate = new Date(maxDate.getFullYear() + 1, 3, 1)

  return {
    MinEffectiveDate: moment(minDate).format(),
    MaxEffectiveDate: moment(maxDate).format(),
    IncludeOverlappingEffectiveDates: true,
  }
}

const dataNormalizer = (data) => {
  data.FromDateTime = moment(data.FromDateTime)
  data.ToDateTime = moment(data.ToDateTime)
  data.TradeEntryDateTime = moment(data.TradeEntryDateTime)
  data.EffectiveDates = [data.FromDateTime, data.ToDateTime]
  data.ExternalColleagueId = data.ExternalColleagueId?.toString()
  data.ExternalCounterPartyId = data.ExternalCounterPartyId?.toString()
  data.InternalColleagueId = data.InternalColleagueId?.toString()
  data.InternalCounterPartyId = data.InternalCounterPartyId?.toString()
  data.Details = data.Details.map((detail) => {
    return {
      ...detail,
      FromDateTime: moment(detail.FromDateTime),
      ToDateTime: moment(detail.ToDateTime),
      EffectiveDates: [moment(detail.FromDateTime), moment(detail.ToDateTime)],
      FromLocationId: detail?.FromLocationId?.toString(),
      ToLocationId: detail?.ToLocationId?.toString(),
      ProductId: detail?.ProductId?.toString(),
      Quantities: [...detail.Quantities] || [],
      UnitOfMeasureId: detail?.UnitOfMeasureId?.toString(),
      NetOrGrossCvId: detail?.NetOrGrossCvId?.toString(),
      Prices: !detail.Prices?.length
        ? detail.Prices
        : detail.Prices?.map((price) => {
            const ProvisionType = findMyType(price?.Formula?.FormulaVariables, data.IsExtracted) // adding the Provision Type here
            return {
              ...price,
              ProvisionType,
              FixedValue:
                ProvisionType === ProvisionTypes.FIXED ? price?.Formula?.FormulaVariables[0]?.FixedValue : null,
              Status: getPriceStatus(
                price,
                ProvisionType,
                price?.Formula?.FormulaVariables?.[0]?.FixedValue,
                moment(detail.FromDateTime),
                moment(detail.ToDateTime)
              ),
            }
          }),
      Status: detail.Status ?? setDetailStatus(detail),
    }
  })
  return data
}

const setDetailStatus = (detail) => {
  const isInProgress = detail?.Quantities?.find((item) => !item.Quantity)
  if (detail.Prices && detail.Prices.length > 0 && !isInProgress) {
    return 'Valid'
  }
  return 'In Progress'
}
