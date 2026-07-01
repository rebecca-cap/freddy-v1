/**
 * Type-safe Calculated Price Report API hook using OpenAPI generated types
 *
 * Migration notes:
 * - Old: api.post('MarketPlatform/CalculatedPriceReport/ReadMetadata')
 * - New: api.POST('/api/MarketPlatform/CalculatedPriceReport/ReadMetadata')
 */

import { useQuery } from '@tanstack/react-query'

import {
  useTypedApi,
  unwrap,
  queryKey,
  type InferResponse,
  type InferRequestBody,
} from '@hooks/useTypedApi'

export type CalculatedPriceReportMetadataResponse = InferResponse<'/api/MarketPlatform/CalculatedPriceReport/ReadMetadata'>
export type CalculatedPriceReportValuesResponse = InferResponse<'/api/MarketPlatform/CalculatedPriceReport/ReadCalculatedValues'>
export type CalculatedPriceReportBreakdownResponse = InferResponse<'/api/MarketPlatform/CalculatedPriceReport/GetSecondaryPriceBreakdown'>

export type CalculatedPriceReportValuesRequest = InferRequestBody<'/api/MarketPlatform/CalculatedPriceReport/ReadCalculatedValues'>
export type CalculatedPriceReportBreakdownRequest = InferRequestBody<'/api/MarketPlatform/CalculatedPriceReport/GetSecondaryPriceBreakdown'>

// Nested types for consumer convenience
export type CalculatedPriceRow = NonNullable<CalculatedPriceReportValuesResponse['Data']>[number]
export type SecondaryPriceBreakdownRow = NonNullable<CalculatedPriceReportBreakdownResponse['Data']>[number]

// Query Keys

const queryKeys = {
  metadata: queryKey('/api/MarketPlatform/CalculatedPriceReport/ReadMetadata'),
  read: (tradeTypeCvId: string | number | undefined) =>
    [...queryKey('/api/MarketPlatform/CalculatedPriceReport/ReadCalculatedValues'), tradeTypeCvId] as const,
  breakdown: (tradeEntrySetupId: number | undefined, deliveryPeriodConfigurationId: number | undefined) =>
    [
      ...queryKey('/api/MarketPlatform/CalculatedPriceReport/GetSecondaryPriceBreakdown'),
      tradeEntrySetupId,
      deliveryPeriodConfigurationId,
    ] as const,
} as const

export const useCalculatedPriceReportTyped = () => {
  const api = useTypedApi()

  /**
   * Fetch calculated price report data by trade type
   * Note: tradeTypeCvId comes from metadata as a string but API expects number
   */
  const useCalculatedPriceReportQuery = (tradeTypeCvId: string | number | undefined) =>
    useQuery({
      queryKey: queryKeys.read(tradeTypeCvId),
      queryFn: () =>
        unwrap(
          api.POST('/api/MarketPlatform/CalculatedPriceReport/ReadCalculatedValues', {
            body: { TradeTypeCvId: tradeTypeCvId != null ? Number(tradeTypeCvId) : undefined },
          })
        ),
      enabled: tradeTypeCvId != null,
    })

  /**
   * Fetch metadata for calculated price report
   */
  const useCalculatedPriceReportMetadataQuery = () =>
    useQuery({
      queryKey: queryKeys.metadata,
      queryFn: () => unwrap(api.POST('/api/MarketPlatform/CalculatedPriceReport/ReadMetadata')),
    })

  /**
   * Fetch secondary price breakdown
   */
  const useCalculatedPriceBreakdownQuery = (
    tradeEntrySetupId: number | undefined,
    deliveryPeriodConfigurationId: number | undefined
  ) =>
    useQuery({
      queryKey: queryKeys.breakdown(tradeEntrySetupId, deliveryPeriodConfigurationId),
      queryFn: () =>
        unwrap(
          api.POST('/api/MarketPlatform/CalculatedPriceReport/GetSecondaryPriceBreakdown', {
            body: {
              TradeEntrySetupId: tradeEntrySetupId,
              DeliveryPeriodConfigurationId: deliveryPeriodConfigurationId,
            },
          })
        ),
      enabled: tradeEntrySetupId != null && deliveryPeriodConfigurationId != null,
    })

  return {
    useCalculatedPriceReportQuery,
    useCalculatedPriceReportMetadataQuery,
    useCalculatedPriceBreakdownQuery,
  }
}
