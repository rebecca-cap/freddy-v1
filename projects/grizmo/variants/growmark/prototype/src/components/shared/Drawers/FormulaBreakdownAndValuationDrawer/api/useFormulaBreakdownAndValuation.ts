import { FormulaBreakdownAndValuationDataResponse } from '@components/shared/Drawers/FormulaBreakdownAndValuationDrawer/api/schema.type'
import { useApi } from '@gravitate-js/excalibrr'
import { useQuery } from '@tanstack/react-query'

const endpoints = {
  costValuation: 'FormulaResultDetails/GetDetailsByCurvePointPriceId',
} as const
export const useFormulaBreakdownAndValuation = () => {
  const api = useApi()
  const getFormulaBreakdownAndValuationById = (CurvePointPriceId) =>
    useQuery<FormulaBreakdownAndValuationDataResponse>(
      [endpoints.costValuation, CurvePointPriceId],
      async () => api.post(endpoints.costValuation, { CurvePointPriceId }),
      {
        refetchOnWindowFocus: false,
        enabled: !!CurvePointPriceId,
      }
    )

  return { getFormulaBreakdownAndValuationById }
}
