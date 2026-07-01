import { useApi } from '@gravitate-js/excalibrr'
import { useQuery } from '@tanstack/react-query'
import type { ContractGetAllResponse, ContractReportDetail, GetDetailValuationDataResponse } from './types'

const endpoints = {
  GetAll: 'ContractManagement/report/GetAll',
  GetDetailValuationData: 'ContractManagement/report/GetDetailValuationData',
} as const

type ProductMapping = Pick<ContractReportDetail, 'ProductName' | 'Quantity'>
type Contract = ContractGetAllResponse['Data'][number]

export const useContractsReport = () => {
  const api = useApi()

  const useContractsOverviewQuery = () =>
    useQuery<ContractGetAllResponse>(
      [endpoints.GetAll],
      async () => {
        const resp = (await api.post(endpoints.GetAll)) as ContractGetAllResponse
        return {
          ...resp,
          Data: resp.Data.map((d) => ({
            ...d,
            Locations: [...new Set(d.Details.map((d) => d.FromLocationName))],
            Products: getSortedProductGroups(d.Details),
          })),
        }
      },
      {
        refetchOnWindowFocus: false,
      }
    )

  const useDetailValuationDataQuery = (TradeEntryId: Contract['TradeInstrumentId']) =>
    useQuery<GetDetailValuationDataResponse>([endpoints.GetDetailValuationData, TradeEntryId], () => {
      return api.post(endpoints.GetDetailValuationData, { TradeEntryId })
    })

  return {
    useContractsOverviewQuery,
    useDetailValuationDataQuery,
  }
}

const getSortedProductGroups = (details: ContractReportDetail[]) => {
  const products = details?.map((d) => ({
    ProductName: d?.ProductName,
    Quantity: d?.Quantity,
  })) as ProductMapping[]

  const productGroups = products.reduce((acc, p) => {
    if (acc[p.ProductName]) acc[p.ProductName] += p.Quantity
    else acc[p.ProductName] = p.Quantity
    return acc
  }, {}) as Record<ProductMapping['ProductName'], ProductMapping['Quantity']>

  return productGroups
}
