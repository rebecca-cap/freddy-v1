import { NotificationMessage } from '@gravitate-js/excalibrr'
import { useApi } from '@gravitate-js/excalibrr'
import {
  DeleteLinksPayload,
  GetAllocationAssociationPayload,
  GetAllocationAssociationsResponse,
  GetAllocationsResponse,
  UpsertLinksPayload,
} from '@modules/Admin/PriceEngineQuoteBookAllocationManagement/api/types.schema'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export const endpoints = {
  getAssociations: 'QuoteBook/Analytics/Allocation/Admin/GetAssociations',
  getAllocations: 'QuoteBook/Analytics/Allocation/Admin/GetAllocations',
  upsertLinks: 'QuoteBook/Analytics/Allocation/Admin/UpsertLinks',
  deleteLinks: 'QuoteBook/Analytics/Allocation/Admin/DeleteLinks',
}

export const useAllocationManagement = () => {
  const api = useApi()
  const queryClient = useQueryClient()

  const getAssociationsQuery = (payload?: GetAllocationAssociationPayload) =>
    useQuery([endpoints.getAssociations, payload], (): GetAllocationAssociationsResponse[] =>
      api.post(endpoints.getAssociations, payload)
    )

  const getAllocationsQuery = () =>
    useQuery([endpoints.getAllocations], (): GetAllocationsResponse[] => api.post(endpoints.getAllocations))

  const upsertLinks = useMutation(
    [endpoints.upsertLinks],
    (payload: UpsertLinksPayload) => api.post(endpoints.upsertLinks, payload),
    {
      onMutate: async (request) => {
        const oldData = queryClient.getQueryData<GetAllocationAssociationsResponse[]>([endpoints.getAssociations])

        queryClient.setQueriesData<GetAllocationAssociationsResponse[]>(
          [endpoints.getAssociations],
          (prevQueryResults) => {
            return prevQueryResults?.map((row) => {
              if (request.Links.some((link) => link.QuoteRowId === row.QuoteConfigurationMappingId)) {
                const isAlreadyAssociated = row.LinkedAllocationIds.some(
                  (ids) => ids.AllocationId === request.Links[0].AllocationId
                )
                if (!isAlreadyAssociated) {
                  return {
                    ...row,
                    LinkedAllocationIds: [...row.LinkedAllocationIds, { AllocationId: request.Links[0].AllocationId }],
                  }
                }
              }
              return row
            })
          }
        )

        return { oldData }
      },
      onSuccess: () => {
        NotificationMessage('Saved', 'Your changes have been saved!', false)
      },
      onError: async (_error, _request, context) => {
        queryClient.setQueriesData([endpoints.getAssociations], context?.oldData)
      },
      onSettled: async () => {
        await queryClient.invalidateQueries([endpoints.getAssociations])
      },
    }
  )

  const deleteLinks = useMutation(
    [endpoints.deleteLinks],
    (payload: DeleteLinksPayload) => api.post(endpoints.deleteLinks, payload),
    {
      onMutate: async (request) => {
        const oldData = queryClient.getQueryData<GetAllocationAssociationsResponse[]>([endpoints.getAssociations])

        queryClient.setQueriesData<GetAllocationAssociationsResponse[]>(
          [endpoints.getAssociations],
          (prevQueryResults) => {
            return prevQueryResults?.map((row) => {
              const newLinkedAllocationIds = row.LinkedAllocationIds.filter((ids) =>
                ids?.AssociationId ? !request.AllocationAssociationIds.includes(ids?.AssociationId) : true
              )
              return { ...row, LinkedAllocationIds: newLinkedAllocationIds }
            })
          }
        )
        return { oldData }
      },
      onSuccess: () => {
        NotificationMessage('Saved', 'Your changes have been saved!', false)
      },
      onError: async (_error, _request, context) => {
        queryClient.setQueriesData([endpoints.getAssociations], context?.oldData)
      },
      onSettled: async () => {
        await queryClient.invalidateQueries([endpoints.getAssociations])
      },
    }
  )

  return { getAssociationsQuery, getAllocationsQuery, upsertLinks, deleteLinks }
}
