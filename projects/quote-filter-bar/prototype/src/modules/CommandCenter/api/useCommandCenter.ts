import { APIResponse } from '@api/globalTypes'
import { useApi } from '@gravitate-js/excalibrr'
import { useQuery, UseQueryResult } from '@tanstack/react-query'

import {
  Metadata,
  OriginalIntradayCompetitorMovementData,
  OriginalMarginSummaryData,
  OriginalStrategyMissReportData,
  OriginalVolumePaceData,
  PageSettingFilters,
  WidgetRequestPayload,
} from './types.schema'

const endpoints = {
  metadata: 'CommandCenter/GetMetaData',
  intradayCompetitorMovement: 'CommandCenter/GetIntradayCompetitorMovementData',
  marginSummary: 'CommandCenter/GetMarginSummaryData',
  strategyMissReport: 'CommandCenter/GetStrategyMissData',
  volumePace: 'CommandCenter/GetVolumePaceData',
} as const

export function useCommandCenter() {
  const api = useApi()

  const getMetadata = (payload: PageSettingFilters) =>
    useQuery([endpoints.metadata, payload], () => api.post(endpoints.metadata, payload as any), {
      enabled: !!payload.LocationHierarchyTypeCvId && !!payload.ProductHierarchyTypeCvId,
    }) as UseQueryResult<APIResponse<Metadata>, Error>

  const getIntradayCompetitorMovementData = (payload: WidgetRequestPayload) =>
    useQuery(
      [endpoints.intradayCompetitorMovement, payload],
      () => api.post(endpoints.intradayCompetitorMovement, payload as any),
      {
        enabled: !!payload.LocationHierarchyTypeCvId && !!payload.ProductHierarchyTypeCvId,
      }
    ) as UseQueryResult<APIResponse<OriginalIntradayCompetitorMovementData>, Error>

  const getMarginSummaryData = (payload: WidgetRequestPayload) =>
    useQuery([endpoints.marginSummary, payload], () => api.post(endpoints.marginSummary, payload as any), {
      enabled: !!payload.LocationHierarchyTypeCvId && !!payload.ProductHierarchyTypeCvId,
    }) as UseQueryResult<APIResponse<OriginalMarginSummaryData>, Error>

  const getStrategyMissData = (payload: WidgetRequestPayload) =>
    useQuery([endpoints.strategyMissReport, payload], () => api.post(endpoints.strategyMissReport, payload as any), {
      enabled: !!payload.LocationHierarchyTypeCvId && !!payload.ProductHierarchyTypeCvId,
    }) as UseQueryResult<APIResponse<OriginalStrategyMissReportData>, Error>

  const getVolumePaceData = (payload: WidgetRequestPayload) =>
    useQuery([endpoints.volumePace, payload], () => api.post(endpoints.volumePace, payload as any), {
      enabled: !!payload.LocationHierarchyTypeCvId && !!payload.ProductHierarchyTypeCvId,
    }) as UseQueryResult<APIResponse<OriginalVolumePaceData>, Error>

  return {
    getMetadata,
    getIntradayCompetitorMovementData,
    getMarginSummaryData,
    getStrategyMissData,
    getVolumePaceData,
  }
}
