import { NotificationMessage, useApi } from '@gravitate-js/excalibrr'
import { useMutation, UseMutationResult, useQuery, useQueryClient } from '@tanstack/react-query'

import {
  ExecuteRevaluationRequest,
  ExecuteRevaluationResponse,
  GetContractValuationsRequest,
  GetContractValuationsResponse,
  GetMetaDataResponse,
  GetValuationBuildUpRequest,
  GetValuationBuildUpResponse,
} from './types'

const endpoints = {
  getMetadata: 'ContractRevaluation/GetMetaData',
  getContractValuations: 'ContractRevaluation/GetContractValuations',
  getValuationBuildUp: 'ContractManagement/report/GetDetailValuationData',
  executeRevaluation: 'ContractRevaluation/ExecuteRevaluation',
} as const

export const useContractRevaluation = () => {
  const api = useApi()
  const queryClient = useQueryClient()

  // GET METADATA
  const getMetaData = () =>
    useQuery<GetMetaDataResponse>(
      [endpoints.getMetadata],
      async ({ queryKey }) => {
        const res = await api.post(queryKey[0] as string)
        return res as GetMetaDataResponse
      },
      {
        refetchOnWindowFocus: false,
      }
    )

  // GET CONTRACT VALUATIONS
  const getContractValuations = (payload: GetContractValuationsRequest) =>
    useQuery<GetContractValuationsResponse>(
      [endpoints.getContractValuations, payload],
      async () => {
        const res = await api.post(endpoints.getContractValuations, payload as any)
        return res as GetContractValuationsResponse
      },
      {
        enabled: !!payload?.FromDate && !!payload?.ToDate, // only run when valid payload exists
        refetchOnWindowFocus: false,
      }
    )

  // GET VALUATION BUILD-UP
  const getValuationBuildUp = (payload: GetValuationBuildUpRequest) =>
    useQuery<GetValuationBuildUpResponse>(
      [endpoints.getValuationBuildUp, payload],
      async () => {
        const res = await api.post(endpoints.getValuationBuildUp, payload as any)
        return res as GetValuationBuildUpResponse
      },
      {
        enabled: !!payload?.FormulaResultId,
        refetchOnWindowFocus: false,
      }
    )

  // EXECUTE REVALUATION
  const executeRevaluation = (): UseMutationResult<ExecuteRevaluationResponse, unknown, ExecuteRevaluationRequest> =>
    useMutation(
      [endpoints.executeRevaluation],
      (payload: ExecuteRevaluationRequest) => api.post(endpoints.executeRevaluation, payload as any),
      {
        onSuccess: (res: ExecuteRevaluationResponse) => {
          const validations = res?.Data?.Validations || res?.Validations || []
          const error = validations.find((v) => v.Severity === 'Error')
          if (error) {
            NotificationMessage(error.Severity, error.Message, true)
          } else {
            NotificationMessage('Success', 'Revaluation executed successfully', false)
          }

          // Invalidate if any post-query cache keys are relevant
          queryClient.invalidateQueries([endpoints.getContractValuations])
        },
      }
    )

  return {
    getMetaData,
    getContractValuations,
    getValuationBuildUp,
    executeRevaluation,
  }
}
