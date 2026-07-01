import { NotificationMessage, useApi } from '@gravitate-js/excalibrr'
import { useMutation, UseMutationResult, useQuery, useQueryClient } from '@tanstack/react-query'

import {
  ActivateOpisCurveRequest,
  OpisCurveResponse,
  OpisMetadataResponse,
  UpdateInstrumentSymbolRequest,
} from './types.schema'

const endpoints = {
  getOpisCurves: 'OpisInstruments/Admin/GetAllOpisCurves',
  getOpisMetadata: 'OpisInstruments/Admin/GetMetadata',
  updateInstrumentSymbol: 'OpisInstruments/Admin/UpdateInstrumentSymbol',
  ActivateOpisCurves: 'OpisInstruments/Admin/ActivateOpisCurves',
} as const

export const useOpisCurves = () => {
  const queryClient = useQueryClient()
  const api = useApi()

  const getOpisCurves = () =>
    useQuery<OpisCurveResponse>(
      [endpoints.getOpisCurves],
      async ({ queryKey }) => {
        const response = await api.post(queryKey[0] as string)
        return response as OpisCurveResponse
      },
      {
        refetchOnWindowFocus: false,
      }
    )

  const getOpisMetadata = () =>
    useQuery<OpisMetadataResponse>(
      [endpoints.getOpisMetadata],
      async () => {
        const response = await api.post(endpoints.getOpisMetadata, {} as BodyInit)
        return response as OpisMetadataResponse
      },
      {
        refetchOnWindowFocus: false,
      }
    )

  const updateInstrumentSymbol = (): UseMutationResult<
    void, // response type
    unknown, // error type
    UpdateInstrumentSymbolRequest
  > =>
    useMutation(
      [endpoints.updateInstrumentSymbol],
      (payload: UpdateInstrumentSymbolRequest) => api.post(endpoints.updateInstrumentSymbol, payload as any),
      {
        onSuccess: (response: any) => {
          if (response?.Severity === 'Error') {
            NotificationMessage(response?.Severity, response?.Message, true)
          }
          queryClient.invalidateQueries([endpoints.getOpisCurves])
        },
      }
    )

  const ActivateOpisCurves = (): UseMutationResult<
    void, // response type
    unknown, // error type
    ActivateOpisCurveRequest
  > =>
    useMutation(
      [endpoints.ActivateOpisCurves],
      (payload: ActivateOpisCurveRequest) => api.post(endpoints.ActivateOpisCurves, payload as any),
      {
        onSuccess: () => {
          queryClient.invalidateQueries([endpoints.getOpisCurves])
        },
      }
    )

  return {
    getOpisCurves,
    getOpisMetadata,
    updateInstrumentSymbol,
    ActivateOpisCurves,
  }
}
