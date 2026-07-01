import { useApi } from '@gravitate-js/excalibrr'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { message } from 'antd'

import {
  CalculatedPriceReportMetadataResult,
  CalculatedPriceOverviewResponse,
  CalculatedPriceBreakDownResponse,
} from './types'

export const endpoints = {
  metadata: 'MarketPlatform/CalculatedPriceReport/ReadMetadata',
  read: 'MarketPlatform/CalculatedPriceReport/ReadCalculatedValues',
  getSecondaryBreakdown: 'MarketPlatform/CalculatedPriceReport/GetSecondaryPriceBreakdown',
}

export const useCalculatedPriceReport = () => {
  const api = useApi()
  const queryClient = useQueryClient()

  const useCalculatedPriceReportQuery = (tradeTypeCvId) =>
    useQuery(
      [endpoints.read, tradeTypeCvId],
      ({ queryKey }) =>
        api.post(queryKey[0], {
          TradeTypeCvId: tradeTypeCvId,
        }) as CalculatedPriceOverviewResponse
    )

  const useCalculatedPriceReportMetadataQuery = () =>
    useQuery([endpoints.metadata], ({ queryKey }) => api.post(queryKey[0]) as CalculatedPriceReportMetadataResult)

  const useCalculatedPriceBreakdownQuery = (tradeEntrySetupId, deliveryPeriodConfigurationId) =>
    useQuery(
      [endpoints.getSecondaryBreakdown, tradeEntrySetupId, deliveryPeriodConfigurationId],
      ({ queryKey }) =>
        api.post(queryKey[0], {
          TradeEntrySetupId: tradeEntrySetupId,
          DeliveryPeriodConfigurationId: deliveryPeriodConfigurationId,
        }) as CalculatedPriceBreakDownResponse
    )

  return {
    useCalculatedPriceReportQuery,
    useCalculatedPriceReportMetadataQuery,
    useCalculatedPriceBreakdownQuery,
  }
}
