import {
  HierarchyItemsResponse,
  HierarchyListItem,
  MovePayload,
  UpsertHierarchyInput,
} from '@components/shared/Hierarchies/types'
import { NotificationMessage, useApi } from '@gravitate-js/excalibrr'
import { useMutation, UseMutationResult, useQuery, useQueryClient } from '@tanstack/react-query'
import { message } from 'antd'

import {
  CounterPartyDistributionLists,
  CounterPartyMetadataResponse,
  CounterPartyOverviewResponse,
  CounterPartyUpsert,
  CreateOrUpdateResponse,
} from './types'

export const endpoints = {
  metadata: 'Admin/CounterPartyManagement/GetMetaData',
  readDistributionList: 'Admin/CounterPartyManagement/ReadCounterPartyDistributionLists',
  saveDistributionLIst: 'Admin/CounterPartyManagement/SaveCounterPartyDistributionLists',
  read: 'Admin/CounterPartyManagement/Read',
  createOrUpdate: 'Admin/CounterPartyManagement/CreateOrUpdate',
  getHierarchy: 'ReferenceData/CounterPartyHierarchy/CounterParty/Get',
  getHierarchyList: 'ReferenceData/CounterPartyHierarchy/CounterParty/List',
  upsertHierarchy: 'ReferenceData/CounterPartyHierarchy/CounterParty/Upsert',
  getHierarchyItems: 'ReferenceData/CounterPartyHierarchy/CounterParty/Items',
  moveCounterparty: 'ReferenceData/CounterPartyHierarchy/CounterParty/Move',
}

const toastApiError = (e) => {
  const validationMessages = e.json?.Validations?.map((v) => v.Message).filter(Boolean) ?? []
  const errorMessages = []
  const errors = e.json?.errors

  if (errors) {
    for (const field in errors) {
      if (errors.hasOwnProperty(field)) errorMessages.push(...errors[field])
    }
  }
  const combinedMessage =
    `${validationMessages.join('\n')}${errorMessages.join('\n')}` || 'An unexpected error occurred'
  message.error(combinedMessage)
}

export const useCounterparties = () => {
  const api = useApi()
  const queryClient = useQueryClient()

  const useCounterpartiesQuery = () =>
    useQuery([endpoints.read], ({ queryKey }) => api.post(queryKey[0]) as CounterPartyOverviewResponse)

  const useCounterpartiesMetadataQuery = () =>
    useQuery<CounterPartyMetadataResponse>(
      [endpoints.metadata],
      ({ queryKey }) => api.post(queryKey[0]) as CounterPartyMetadataResponse
    )

  const useCounterpartiesDistributionListQuery = (CounterPartyId) =>
    useQuery(
      [endpoints.readDistributionList, CounterPartyId],
      ({ queryKey }) => api.post(queryKey[0], { CounterPartyId }) as CounterPartyDistributionLists,
      { enabled: !!CounterPartyId }
    )

  const useCounterpartiesMutation = (): UseMutationResult<
    CreateOrUpdateResponse,
    unknown,
    CounterPartyUpsert | CounterPartyUpsert[]
  > =>
    useMutation(
      [endpoints.createOrUpdate],
      (counterparty) =>
        api.post(
          endpoints.createOrUpdate,
          Array.isArray(counterparty) ? counterparty : [counterparty]
        ) as Promise<CreateOrUpdateResponse>,
      {
        onSuccess: async (resp, rows) => {
          if (resp.ActionStatus === 'Error') {
            if (resp.Validations.some((v) => v.Category === 'SourceCollision')) {
              message.error(`Source ID ${rows[0].SourceInfo.SourceId} is already assigned`)
            }
          } else {
            queryClient.invalidateQueries([endpoints.read])
            NotificationMessage('Success', 'Counterparty row(s) saved successfully', false)
          }
        },
      }
    )

  const useCounterpartyDistributionMutation = () =>
    useMutation({
      mutationFn: (payload: CounterPartyDistributionLists) => api.post(endpoints.saveDistributionLIst, payload),
      onSuccess: (resp) => {
        queryClient.invalidateQueries([endpoints.readDistributionList])
      },
    })

  const useHierarchyListQuery = () =>
    useQuery<HierarchyListItem[]>([endpoints.getHierarchyList], () =>
      api.post<HierarchyListItem[]>(endpoints.getHierarchyList)
    )

  const upsertHierarchyMutation = useMutation<void, unknown, UpsertHierarchyInput>(
    [endpoints.upsertHierarchy],
    ({ Name, HierarchyKey = 0 }) => api.post(endpoints.upsertHierarchy, { Name, HierarchyKey }),
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries([endpoints.getHierarchyList])
      },
      onError: toastApiError,
    }
  )

  const useHierarchyQuery = (HierarchyKey = 0) =>
    useQuery([endpoints.getHierarchy, HierarchyKey], () => api.post(endpoints.getHierarchy, { HierarchyKey }))

  const useHierarchyItemsQuery = (Key: number | null, HierarchyKey: number | null = 0) =>
    useQuery<HierarchyItemsResponse>(
      [endpoints.getHierarchyItems, HierarchyKey, Key],
      () => api.post(endpoints.getHierarchyItems, { Key, HierarchyKey }),
      {
        enabled: Key !== null && HierarchyKey !== null,
      }
    )

  const moveCounterpartiesInHierarchyMutation = useMutation(
    [endpoints.moveCounterparty],
    (payload: MovePayload) => api.post(endpoints.moveCounterparty, payload),
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries([endpoints.getHierarchy])
        await queryClient.invalidateQueries([endpoints.getHierarchyItems])
      },
      onError: toastApiError,
    }
  )

  return {
    useCounterpartiesQuery,
    useCounterpartiesMetadataQuery,
    useCounterpartiesMutation,
    useCounterpartiesDistributionListQuery,
    useCounterpartyDistributionMutation,
    moveCounterpartiesInHierarchyMutation,
    useHierarchyListQuery,
    upsertHierarchyMutation,
    useHierarchyItemsQuery,
    useHierarchyQuery,
  }
}
