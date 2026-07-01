import { useApi } from '@gravitate-js/excalibrr'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { eagerlyUpdateRowData } from '@utils/api'
import { message } from 'antd'

import { PriceTranslationMetadata, PriceTranslationRow } from './types'

export const endpoints = {
  priceTranslationRead: 'PriceImport/TranslatedIdentifiers/GetAll',
  priceTranslationEnable: 'PriceImport/TranslatedIdentifiers/Enable',
  priceTranslationDisable: 'PriceImport/TranslatedIdentifiers/Disable',
  priceTranslationIgnoreConflicts: 'PriceImport/TranslatedIdentifiers/IgnoreConflicts',
  priceTranslationRespectConflicts: 'PriceImport/TranslatedIdentifiers/RespectConflicts',
  priceTranslationDelete: 'PriceImport/TranslatedIdentifiers/Delete',
  priceTranslationsCreate: 'PriceImport/TranslatedIdentifiers/CreateUserDefinedIdentifier',
  metadata: 'PriceImport/TranslatedIdentifiers/MetaData',
}

export type PriceTranslationUpdatePayload = {
  IdentifierId: string
}

export type NewTranslationPayload = {
  // Sources
  CounterPartySourceIdentifier: string
  CounterPartySourceDisplay: string
  ProductSourceIdentifier: string
  ProductSourceDisplay: string
  LocationSourceIdentifier: string
  LocationSourceDisplay: string

  // Targets
  TargetCounterPartyId: number
  TargetCounterPartyName: string
  TargetLocationId: number
  TargetLocationName: string
  TargetProductId: number
  TargetProductName: string
  TargetPricePublisherId: number
  TargetPricePublisherName: string
}

export const usePriceTranslations = (dirtyRef) => {
  const api = useApi()
  const queryClient = useQueryClient()

  const usePriceTranslationsQuery = () =>
    useQuery(
      [endpoints.priceTranslationRead],
      () => api.post(endpoints.priceTranslationRead) as { Data: PriceTranslationRow[] },
      {
        refetchOnWindowFocus: false,
      }
    )

  const useMetadataQuery = () =>
    useQuery([endpoints.metadata], () => api.post(endpoints.metadata) as PriceTranslationMetadata, {
      refetchOnWindowFocus: false,
    })

  const usePriceTranslationEnableMutation = () =>
    useMutation({
      mutationFn: ({ IdentifierId }: PriceTranslationUpdatePayload) =>
        api.post(endpoints.priceTranslationEnable, { IdentifierId }),
      onSuccess: () => {
        message.success('Translation Enabled')
        queryClient.invalidateQueries([endpoints.priceTranslationRead])
      },
      onMutate: (params) => {
        const pk = params.IdentifierId
        const existingCache = queryClient.getQueryData([endpoints.priceTranslationRead])
        if (existingCache) {
          queryClient.setQueryData([endpoints.priceTranslationRead], (old: { Data: PriceTranslationRow[] }) => {
            const newData = old.Data.map((row) => {
              if (row.PriceImportTranslatedIdentifierId.toString() === pk.toString()) {
                return {
                  ...row,
                  StatusMeaning: 'Active',
                }
              }
              return row
            })
            return { Data: newData }
          })
        }
      },
    })

  const usePriceTranslationDisableMutation = () =>
    useMutation({
      mutationFn: ({ IdentifierId }: PriceTranslationUpdatePayload) =>
        api.post(endpoints.priceTranslationDisable, { IdentifierId }),
      onMutate: (params) => {
        const pk = params.IdentifierId
        const existingCache = queryClient.getQueryData([endpoints.priceTranslationRead])
        if (existingCache) {
          queryClient.setQueryData([endpoints.priceTranslationRead], (old: { Data: PriceTranslationRow[] }) => {
            const newData = old.Data.map((row) => {
              if (row.PriceImportTranslatedIdentifierId.toString() === pk.toString()) {
                return {
                  ...row,
                  StatusMeaning: 'InActive',
                }
              }
              return row
            })
            return { Data: newData }
          })
        }
      },
    })

  const usePriceTranslationIgnoreConflictsMutation = () =>
    useMutation({
      mutationFn: ({ IdentifierId }: PriceTranslationUpdatePayload) =>
        api.post(endpoints.priceTranslationIgnoreConflicts, { IdentifierId }),
      onMutate: (params) => {
        const pk = params.IdentifierId
        const existingCache = queryClient.getQueryData([endpoints.priceTranslationRead])
        if (existingCache) {
          queryClient.setQueryData([endpoints.priceTranslationRead], (old: { Data: PriceTranslationRow[] }) => {
            const newData = old.Data.map((row) => {
              if (row.PriceImportTranslatedIdentifierId.toString() === pk.toString()) {
                return {
                  ...row,
                  IgnoreConflicts: true,
                }
              }
              return row
            })
            return { Data: newData }
          })
        }
      },
    })

  const usePriceTranslationRespectConflictsMutation = () =>
    useMutation({
      mutationFn: ({ IdentifierId }: PriceTranslationUpdatePayload) =>
        api.post(endpoints.priceTranslationRespectConflicts, { IdentifierId }),
      onMutate: (params) => {
        const pk = params.IdentifierId
        const existingCache = queryClient.getQueryData([endpoints.priceTranslationRead])
        if (existingCache) {
          queryClient.setQueryData([endpoints.priceTranslationRead], (old: { Data: PriceTranslationRow[] }) => {
            const newData = old.Data.map((row) => {
              if (row.PriceImportTranslatedIdentifierId.toString() === pk.toString()) {
                return {
                  ...row,
                  IgnoreConflicts: false,
                }
              }
              return row
            })
            return { Data: newData }
          })
        }
      },
    })

  const usePriceTranslationDeleteMutation = () =>
    useMutation({
      mutationFn: ({ IdentifierId }: PriceTranslationUpdatePayload) =>
        api.post(endpoints.priceTranslationDelete, { IdentifierId }),
      onMutate: (params) => {
        const pk = params.IdentifierId
        const existingCache = queryClient.getQueryData([endpoints.priceTranslationRead])
        if (existingCache) {
          queryClient.setQueryData([endpoints.priceTranslationRead], (old: { Data: PriceTranslationRow[] }) => {
            const newData = old.Data.filter((row) => row.PriceImportTranslatedIdentifierId.toString() !== pk.toString())
            return { Data: newData }
          })
        }
      },
    })

  const usePriceTranslationCreateMutation = () =>
    useMutation({
      mutationKey: [endpoints.priceTranslationsCreate],
      mutationFn: async (newTranslations: NewTranslationPayload[]) =>
        api.post(endpoints.priceTranslationsCreate, newTranslations),
      onMutate: (rows) => {
        rows.forEach((row) => {
          eagerlyUpdateRowData(
            row,
            endpoints.priceTranslationRead,
            'PriceImportTranslatedIdentifierId',
            queryClient,
            false,
            'bottom'
          )
        })
      },
      onSuccess: () => {
        queryClient.invalidateQueries([endpoints.priceTranslationRead])

        if (dirtyRef?.current) {
          dirtyRef.current.originalRows = []
        }
        dirtyRef?.current?.setDirtyChanges([])
      },
      onError: (e) => {
        const validationMessages = e.json?.Validations?.map((v) => v.Message).filter(Boolean) ?? []
        const combinedMessage = validationMessages.join('\n') || 'An unexpected error occurred'
        message.error(combinedMessage)
      },
    })

  return {
    usePriceTranslationsQuery,
    usePriceTranslationEnableMutation,
    usePriceTranslationDisableMutation,
    usePriceTranslationIgnoreConflictsMutation,
    usePriceTranslationRespectConflictsMutation,
    usePriceTranslationDeleteMutation,
    usePriceTranslationCreateMutation,
    useMetadataQuery,
  }
}
