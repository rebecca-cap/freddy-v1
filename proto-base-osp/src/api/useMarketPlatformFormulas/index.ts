import {
  MarketPlatformFormulaAffectedSetupsResponse,
  MarketPlatformFormulaMetadata,
  MarketPlatformFormulasResponse,
  MarketPlatformFormulaUpsertPayload,
  MarketPlatformFormulaValidatePayload,
} from '@api/useMarketPlatformFormulas/types'
import { useApi } from '@gravitate-js/excalibrr'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { message } from 'antd'

export const endpoints = {
  formulasRead: 'MarketPlatform/Formula/GetAll',
  formulasMetadata: 'MarketPlatform/Formula/Metadata',
  formulasUpsert: 'MarketPlatform/Formula/Upsert',
  formulasDelete: 'MarketPlatform/Formula/Delete',
  formulasDuplicate: 'MarketPlatform/Formula/Clone',
  formulasValidate: 'MarketPlatform/Formula/ValidateSyntax',
  formulasUpsertMarker: 'MarketPlatform/Formula/Marker/Upsert',
  formulasDeleteMarker: 'MarketPlatform/Formula/Marker/Delete',
  formulasGetAffectedSetups: 'MarketPlatform/Formula/AffectedSetups',
  valueOspFormula: 'MarketPlatform/Formula/ValueOspFormula',
} as const

interface ValueOspFormulaQueryProps {
  FormulaId: number
  TradeEntrySetupId: number
}

export const useMarketPlatformFormulas = () => {
  const api = useApi()
  const queryClient = useQueryClient()

  const useMarketPlatformFormulasQuery = () =>
    // useQuery([endpoints.formulasRead], () => api.post(endpoints.formulasRead) as IFormulaOverviewResponse, {
    useQuery([endpoints.formulasRead], () => api.post(endpoints.formulasRead) as MarketPlatformFormulasResponse, {
      refetchOnWindowFocus: false,
    })

  const useMarketPlatformFormulaAffectedSetupsQuery = (selectedFormulaId: number | undefined) =>
    useQuery(
      [endpoints.formulasGetAffectedSetups, selectedFormulaId],
      () =>
        api.post(endpoints.formulasGetAffectedSetups, {
          FormulaId: selectedFormulaId,
        }) as MarketPlatformFormulaAffectedSetupsResponse,
      {
        refetchOnWindowFocus: false,
        enabled: !!selectedFormulaId,
      }
    )

  const useValueOspFormulaQuery = (req: ValueOspFormulaQueryProps) =>
    useQuery([endpoints.valueOspFormula, req], () => api.post(endpoints.valueOspFormula, req), {
      refetchOnWindowFocus: false,
      enabled: !!req.TradeEntrySetupId,
    })

  const useMarketPlatformFormulasMetadataQuery = () =>
    useQuery(
      [endpoints.formulasMetadata],
      () => api.post(endpoints.formulasMetadata) as MarketPlatformFormulaMetadata,
      {
        refetchOnWindowFocus: false,
      }
    )

  const useMarketPlatformFormulaUpsertMutation = () =>
    useMutation({
      mutationFn: (payload: MarketPlatformFormulaUpsertPayload) => api.post(endpoints.formulasUpsert, payload),
      onSuccess: (resp) => {
        queryClient.invalidateQueries([endpoints.formulasRead])
      },
    })

  type FormulaDeleteMutationProps = {
    onSuccess?: () => void
  }
  //
  const useMarketPlatformFormulaDeleteMutation = (props: FormulaDeleteMutationProps) =>
    useMutation({
      mutationFn: (FormulaId: MarketPlatformFormulaUpsertPayload['FormulaId']) =>
        api.post(endpoints.formulasDelete, { FormulaId }),
      onMutate: () => {
        setTimeout(() => {
          queryClient.invalidateQueries([endpoints.formulasRead])
          message.success('Formula deleted')
        }, 400)
      },
      onSuccess: props.onSuccess,
    })

  const useMarketPlatformFormulaDuplicateMutation = () =>
    useMutation({
      mutationFn: (FormulaId: MarketPlatformFormulaUpsertPayload['FormulaId']) =>
        api.post(endpoints.formulasDuplicate, { FormulaId }) as Promise<{
          Data: Partial<MarketPlatformFormulasResponse['Data'][number]>
        }>,
    })

  const useMarketPlatformFormulaValidateMutation = () =>
    useMutation({
      mutationFn: (payload: MarketPlatformFormulaValidatePayload) => api.post(endpoints.formulasValidate, payload),
    })
  //
  const initializeNewMarketPlatformFormula = (formula: Partial<MarketPlatformFormulasResponse['Data'][number]>) => {
    queryClient.setQueriesData([endpoints.formulasRead], (oldData: MarketPlatformFormulasResponse) => {
      if (oldData) {
        return {
          ...oldData,
          Data: [{ ...formula, $isNew: true }, ...oldData.Data],
        }
      }
      return { Data: [{ ...formula, $isNew: true }] }
    })
  }

  const useMarketPlatformFormulaMarkerUpsertMutation = () =>
    useMutation({
      mutationFn: ({
        MarkerId,
        Name,
        ProductHierarchyTypeCvId,
        LocationHierarchyTypeCvId,
        CounterPartyHierarchyDefinitionId,
      }: {
        MarkerId?: string | number
        Name: string
        ProductHierarchyTypeCvId: string
        LocationHierarchyTypeCvId: string
        CounterPartyHierarchyDefinitionId?: string | number
      }) =>
        api.post(endpoints.formulasUpsertMarker, {
          MarkerId,
          Name,
          ProductHierarchyTypeCvId,
          LocationHierarchyTypeCvId,
          CounterPartyHierarchyDefinitionId,
        }),
      onSuccess: (resp, payload) => {
        if (resp.Validations?.length > 0) {
          message.error(resp.Validations[0].Message)
        } else {
          if (payload?.MarkerId) {
            queryClient.setQueriesData([endpoints.formulasRead], (oldData: MarketPlatformFormulasResponse) => {
              return {
                ...oldData,
                Data: oldData.Data.map((f) => {
                  if (f.MarkerId == payload?.MarkerId) {
                    return {
                      ...f,
                      MarkerId: resp.Data.MarkerId,
                      MarkerName: resp.Data.Name,
                    }
                  }
                  return f
                }),
              }
            })
          }
          queryClient.setQueriesData([endpoints.formulasMetadata], (oldData: MarketPlatformFormulasResponse) => {
            return {
              ...oldData,
              Markers: payload?.MarkerId
                ? oldData.Markers.map((m) => {
                    if (m.Value === payload.MarkerId?.toString()) {
                      return { Value: payload.MarkerId, Text: payload.Name, ...payload }
                    }
                    return m
                  })
                : [...oldData.Markers, { Value: resp.Data.MarkerId?.toString(), Text: resp.Data.Name, ...resp.Data }],
            }
          })
        }

        return message.success(payload?.MarkerId ? 'Marker updated' : 'Marker added')
      },
    })

  return {
    useMarketPlatformFormulaAffectedSetupsQuery,
    useMarketPlatformFormulasMetadataQuery,
    useMarketPlatformFormulasQuery,
    useMarketPlatformFormulaUpsertMutation,
    useMarketPlatformFormulaValidateMutation,
    useMarketPlatformFormulaDeleteMutation,
    useMarketPlatformFormulaDuplicateMutation,
    useValueOspFormulaQuery,
    initializeNewMarketPlatformFormula,
    useMarketPlatformFormulaMarkerUpsertMutation,
  }
}
