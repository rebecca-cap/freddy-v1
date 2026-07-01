import { LocationOverviewResponse } from '@api/useLocationManagement/types'
import {
  HierarchyItemsResponse,
  HierarchyListItem,
  MovePayload,
  UpsertHierarchyInput,
} from '@components/shared/Hierarchies/types'
import { NotificationMessage, useApi } from '@gravitate-js/excalibrr'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { message } from 'antd'

export const endpoints = {
  metadata: 'Admin/LocationManagement/GetMetaData',
  read: 'Admin/LocationManagement/read',
  createOrUpdate: 'Admin/LocationManagement/CreateOrUpdate',
  upsertLocationGroup: 'Admin/LocationManagement/UpsertLocationGroup',
  deleteLocationGroup: 'Admin/LocationManagement/DeleteLocationGroup',
  getHierarchy: 'ReferenceData/Hierarchy/Location/Get',
  getHierarchyList: 'ReferenceData/Hierarchy/Location/List',
  upsertHierarchy: 'ReferenceData/Hierarchy/Location/Upsert',
  getHierarchyItems: 'ReferenceData/Hierarchy/Location/Items',
  moveLocation: 'ReferenceData/Hierarchy/Location/Move',
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

export const useLocationManagement = () => {
  const api = useApi()
  const queryClient = useQueryClient()

  const useMetadataQuery = () =>
    useQuery([endpoints.metadata], () => api.post(endpoints.metadata), {
      refetchOnWindowFocus: false,
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

  const useHierarchyQuery = (hierarchyKey = 0) =>
    useQuery([endpoints.getHierarchy, hierarchyKey], () => api.post(endpoints.getHierarchy, { hierarchyKey }))

  const useHierarchyItemsQuery = (key: number | null, hierarchyKey: number | null = 0) =>
    useQuery<HierarchyItemsResponse>(
      [endpoints.getHierarchyItems, hierarchyKey, key],
      () => api.post(endpoints.getHierarchyItems, { key, hierarchyKey }),
      {
        enabled: key !== null && hierarchyKey !== null,
      }
    )

  const moveLocationsInHierarchyMutation = useMutation(
    [endpoints.moveLocation],
    (payload: MovePayload) => api.post(endpoints.moveLocation, payload),
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries([endpoints.getHierarchy])
        await queryClient.invalidateQueries([endpoints.getHierarchyItems])
      },
      onError: toastApiError,
    }
  )

  const useLocationManagementQuery = (locationIds?: string[]) =>
    useQuery<LocationOverviewResponse>([endpoints.read, { locationIds }], async () => {
      const response = await api.post<LocationOverviewResponse>(endpoints.read)

      if (locationIds && locationIds.length > 0) {
        response.Data = response.Data.filter((item) => locationIds.includes(item.LocationId))
      }

      return response
    })

  const createUpdateLocationManagementMutation = useMutation(
    [endpoints.createOrUpdate],
    (locations: any[]) => {
      return api.post(endpoints.createOrUpdate, locations)
    },
    {
      onSuccess: async (resp, rows) => {
        await queryClient.cancelQueries([endpoints.read])
        const previousQueries = queryClient.getQueriesData([endpoints.read])
        const updatedRows = rows.map((row) => {
          return row.LocationId ? row.LocationId.toString() : resp?.Data[0]?.LocationId.toString()
        })

        queryClient.setQueriesData([endpoints.read], (cache: any) => {
          const newLocation = rows.find((r) => !r.LocationId)
          if (newLocation) {
            return {
              ...cache,
              Data: [{ ...newLocation, LocationId: resp?.Data[0]?.LocationId }, ...cache.Data],
            }
          }
          return {
            ...cache,
            Data: cache.Data.map((row) => {
              return updatedRows.includes(row.LocationId.toString())
                ? resp?.Data?.find((r) => r.LocationId.toString() === row.LocationId.toString())
                : row
            }),
          }
        })
        NotificationMessage('Success', 'Location(s) saved successfully', false)
      },
      onError: (err, newRow, context) => {
        NotificationMessage('Error', 'Could not save Location(s)', true)

        queryClient.setQueriesData([endpoints.read], context.previousQueries)
      },
    }
  )

  const upsertLocationGroupMutation = () =>
    useMutation([endpoints.upsertLocationGroup], (location) => api.post(endpoints.upsertLocationGroup, location), {
      onSuccess: () => {
        queryClient.invalidateQueries([endpoints.metadata])
      },
    })

  const useLocationGroupDeleteMutation = () =>
    useMutation(
      [endpoints.deleteLocationGroup],
      (LocationGroupId: number) => api.post(endpoints.deleteLocationGroup, { LocationGroupId }),
      {
        onSuccess: async () => {
          const previousQueries = queryClient.getQueriesData([endpoints.metadata])
          queryClient.invalidateQueries([endpoints.metadata])
          return { previousQueries }
        },
        onError: toastApiError,
      }
    )

  return {
    useMetadataQuery,
    useLocationManagementQuery,
    createUpdateLocationManagementMutation,
    upsertLocationGroupMutation,
    useLocationGroupDeleteMutation,
    moveLocationsInHierarchyMutation,
    useHierarchyQuery,
    useHierarchyItemsQuery,
    useHierarchyListQuery,
    upsertHierarchyMutation,
  }
}
