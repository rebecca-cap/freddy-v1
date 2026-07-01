import { type InferResponse, queryKey, unwrap, useTypedApi } from '@hooks/useTypedApi'
import { NotificationMessage } from '@gravitate-js/excalibrr'
import { useMutation, useQuery } from '@tanstack/react-query'

export type FormulaBreakdownAndValuationDataResponse =
  InferResponse<'/api/FormulaResultDetails/GetDetailsByCurvePointPriceId'>
export type FormulaBreakdownAndValuationDetail =
  InferResponse<'/api/FormulaResultDetails/GetDetailsByCurvePointPriceId'>
export type RevalueByCurvePointPriceIdResponse = InferResponse<'/api/ContractRevaluation/RevalueByCurvePointPriceId'>

const queryKeys = {
  costValuation: queryKey('/api/FormulaResultDetails/GetDetailsByCurvePointPriceId'),
  revalue: queryKey('/api/ContractRevaluation/RevalueByCurvePointPriceId'),
} as const

export const useFormulaBreakdownAndValuation = (curvePointPriceId: number | null) => {
  const api = useTypedApi()

  const query = useQuery({
    queryKey: [...queryKeys.costValuation, curvePointPriceId],
    queryFn: () =>
      unwrap(
        api.POST('/api/FormulaResultDetails/GetDetailsByCurvePointPriceId', {
          body: { CurvePointPriceId: curvePointPriceId },
        })
      ),
    refetchOnWindowFocus: false,
    enabled: !!curvePointPriceId,
  })

  const revalueMutation = useMutation({
    mutationKey: queryKeys.revalue,
    mutationFn: (id: number) =>
      unwrap(
        api.POST('/api/ContractRevaluation/RevalueByCurvePointPriceId', {
          body: { CurvePointPriceId: id },
        })
      ),
    onError: (error: Error) => {
      NotificationMessage(
        'Revaluation failed',
        error.message || 'An error occurred while revaluing. Please try again.',
        true
      )
    },
  })

  return { query, revalueMutation }
}
