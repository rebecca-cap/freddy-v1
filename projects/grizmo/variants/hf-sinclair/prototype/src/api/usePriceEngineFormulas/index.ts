import { useApi } from '@gravitate-js/excalibrr'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { message } from 'antd'

import {
  FormulaUpsertPayload,
  FormulaValidatePayload,
  IAffectedQuoteRowsResponse,
  IFormulaMetadataResponse,
  IFormulaOverviewResponse,
  IFormulaVariable,
} from './types'

export const endpoints = {
  formulasRead: 'PriceEngine/Formula/GetAll',
  formulasMetadata: 'PriceEngine/Formula/Metadata',
  formulasUpsert: 'PriceEngine/Formula/Upsert',
  formulasDelete: 'PriceEngine/Formula/Delete',
  formulasDuplicate: 'PriceEngine/Formula/Clone',
  formulasValidate: 'PriceEngine/Formula/ValidateSyntax',
  formulasUpsertMarker: 'PriceEngine/Formula/Marker/Upsert',
  formulasDeleteMarker: 'PriceEngine/Formula/Marker/Delete',
  formulasGetAffectedQuoteRows: 'PriceEngine/Formula/AffectedQuoteRows',
  valueQuoteRow: 'PriceEngine/Formula/ValueQuoteRow',
} as const

interface AffectedQuoteRowQueryProps {
  selectedFormulaId?: IFormulaOverviewResponse['Data'][number]['FormulaId']
}

interface ValueQuoteRowQueryProps {
  FormulaId: number
  QuoteConfigurationMappingId: number
}

export const usePriceEngineFormulas = () => {
  const api = useApi()
  const queryClient = useQueryClient()

  const useFormulasQuery = () =>
    // useQuery([endpoints.formulasRead], () => api.post(endpoints.formulasRead) as IFormulaOverviewResponse, {
    useQuery([endpoints.formulasRead], () => api.post(endpoints.formulasRead) as IFormulaOverviewResponse, {
      refetchOnWindowFocus: false,
    })

  const useAffectedQuoteRowsQuery = (selectedFormulaId: AffectedQuoteRowQueryProps) =>
    useQuery(
      [endpoints.formulasGetAffectedQuoteRows, selectedFormulaId],
      () =>
        api.post(endpoints.formulasGetAffectedQuoteRows, {
          FormulaId: selectedFormulaId,
        }) as IAffectedQuoteRowsResponse,
      {
        refetchOnWindowFocus: false,
        enabled: !!selectedFormulaId,
      }
    )
  const useValueQuoteRowQuery = (req: ValueQuoteRowQueryProps) =>
    useQuery([endpoints.valueQuoteRow, req], () => api.post(endpoints.valueQuoteRow, req), {
      refetchOnWindowFocus: false,
      enabled: !!req.QuoteConfigurationMappingId,
    })

  const useFormulasMetadataQuery = () =>
    useQuery(
      [endpoints.formulasMetadata],
      () => api.post(endpoints.formulasMetadata, { FormulaId: 0 }) as IFormulaMetadataResponse,
      {
        refetchOnWindowFocus: false,
      }
    )

  const useFormulaUpsertMutation = () =>
    useMutation({
      mutationFn: (payload: FormulaUpsertPayload) => api.post(endpoints.formulasUpsert, payload),
      onSuccess: (resp) => {
        queryClient.invalidateQueries([endpoints.formulasRead])
      },
    })

  type FormulaDeleteMutationProps = {
    onSuccess?: () => void
  }

  const useFormulaDeleteMutation = (props: FormulaDeleteMutationProps) =>
    useMutation({
      mutationFn: (FormulaId: FormulaUpsertPayload['FormulaId']) => api.post(endpoints.formulasDelete, { FormulaId }),
      onMutate: () => {
        setTimeout(() => {
          queryClient.invalidateQueries([endpoints.formulasRead])
          message.success('Formula deleted')
        }, 400)
      },
      onSuccess: props.onSuccess,
    })

  const useFormulaDuplicateMutation = () =>
    useMutation({
      mutationFn: (FormulaId: FormulaUpsertPayload['FormulaId']) =>
        api.post(endpoints.formulasDuplicate, { FormulaId }) as Promise<{
          Data: Partial<IFormulaOverviewResponse['Data'][number]>
        }>,
    })

  const useFormulaMarkerUpsertMutation = () =>
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
            queryClient.setQueriesData([endpoints.formulasRead], (oldData: IFormulaOverviewResponse) => {
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
          queryClient.setQueriesData([endpoints.formulasMetadata], (oldData: IFormulaMetadataResponse) => {
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

        message.success('Marker added')
      },
    })

  const useFormulaMarkerDeleteMutation = () =>
    useMutation({
      mutationFn: (MarkerId: IFormulaOverviewResponse['Data'][number]['MarkerId']) =>
        api.post(endpoints.formulasDeleteMarker, { MarkerId }),
      onMutate: (deletedId) => {
        queryClient.setQueriesData([endpoints.formulasMetadata], (oldData: IFormulaMetadataResponse) => {
          return {
            ...oldData,
            Markers: oldData.Markers.filter((m) => m.Value !== deletedId.toString()),
          }
        })
        message.success('Marker deleted')
      },
    })

  const useFormulaValidateMutation = () =>
    useMutation({
      mutationFn: (payload: FormulaValidatePayload) => api.post(endpoints.formulasValidate, payload),
    })

  const initializeNewFormula = (formula: Partial<IFormulaOverviewResponse['Data'][number]>) => {
    queryClient.setQueriesData([endpoints.formulasRead], (oldData: IFormulaOverviewResponse) => {
      return {
        ...oldData,
        Data: [{ ...formula, $isNew: true }, ...oldData.Data],
      }
    })
  }

  const initializeNewVariable = (formulaId: number, variable: Partial<IFormulaVariable>) => {
    queryClient.setQueriesData([endpoints.formulasRead], (oldData: IFormulaOverviewResponse) => {
      return {
        ...oldData,
        Data: oldData.Data.map((f) => {
          if (f.FormulaId === formulaId) {
            return {
              ...f,
              Variables: [
                ...f.Variables,
                { ...variable, FormulaVariableId: Math.floor(Math.random() * -100000), $isNew: true },
              ],
            }
          }
          return f
        }),
      }
    })
  }

  const flushNewVariables = (formulaId: number) => {
    queryClient.setQueriesData([endpoints.formulasRead], (oldData: IFormulaOverviewResponse) => {
      return {
        ...oldData,
        Data: oldData.Data.map((f) => {
          if (f.FormulaId === formulaId) {
            return {
              ...f,
              Variables: f.Variables.filter((v) => !v.$isNew),
            }
          }
          return f
        }),
      }
    })
  }

  const flushNewFormulas = () => {
    queryClient.setQueriesData([endpoints.formulasRead], (oldData: IFormulaOverviewResponse) => {
      return {
        ...oldData,
        Data: oldData.Data.filter((f) => !f.$isNew),
      }
    })
  }

  return {
    useAffectedQuoteRowsQuery,
    useFormulasQuery,
    useFormulasMetadataQuery,
    useFormulaUpsertMutation,
    useFormulaDuplicateMutation,
    useFormulaDeleteMutation,
    useFormulaMarkerUpsertMutation,
    useFormulaMarkerDeleteMutation,
    useFormulaValidateMutation,
    useValueQuoteRowQuery,
    initializeNewFormula,
    initializeNewVariable,
    flushNewVariables,
    flushNewFormulas,
  }
}
