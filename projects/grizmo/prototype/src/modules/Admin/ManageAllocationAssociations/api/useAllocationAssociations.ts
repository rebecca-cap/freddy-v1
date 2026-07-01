import { Validation } from '@api/globalTypes'
import { useApi } from '@gravitate-js/excalibrr'
import {
  AllocationAssociationMetadataResponse,
  AllocationAssociationReferencesSync,
  AllocationAssociationsReferencesMetadata,
  AllocationAssociationsReferencesResponseData,
  AllocationManagementResponse,
  AuthorizationAllocationUnlinkPayload,
  UpsertLinksPayload,
  UpsertLinksResponse,
} from '@modules/Admin/ManageAllocationAssociations/api/types.schema'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { message } from 'antd'

export const endpoints = {
  getReferencesMetadata: 'admin/allocation/reference/GetMetaDataForReferences',
  getReferences: 'admin/allocation/reference/GetReferences',
  syncReferences: 'admin/allocation/reference/SyncReferences',
  readManagementData: 'admin/allocation/management/ReadManagementData',
  upsertLinks: 'admin/allocation/management/UpsertLinks',
  deleteLinks: 'admin/allocation/management/DeleteLinks',
  getMetadata: 'admin/allocation/management/GetMetadata',
}

export const useAllocationAssociations = () => {
  const api = useApi()
  const queryClient = useQueryClient()

  const useAllocationAssociationsReferencesMetadata = () =>
    useQuery(
      [endpoints.getReferencesMetadata],
      () => api.post(endpoints.getReferencesMetadata) as Promise<AllocationAssociationsReferencesMetadata>,
      {
        refetchOnWindowFocus: false,
      }
    )
  const useAllocationAssociationsReferences = () =>
    useQuery(
      [endpoints.getReferences],
      () => api.post(endpoints.getReferences) as Promise<AllocationAssociationsReferencesResponseData>,
      {
        refetchOnWindowFocus: false,
      }
    )

  const useAllocationAssociationReferencesMutation = () =>
    useMutation({
      mutationFn: (payload: AllocationAssociationReferencesSync) => api.post(endpoints.syncReferences, payload),
      onSuccess: (resp) => {
        if (resp.Validations?.length > 0) {
          const firstError = resp.Validations[0]
          message.error(firstError.Message)
        } else {
          queryClient.invalidateQueries([endpoints.getReferences])
          queryClient.invalidateQueries([endpoints.readManagementData])
        }
      },
    })

  const useAllocationAssociationsMappings = () =>
    useQuery(
      [endpoints.readManagementData],
      () => api.post(endpoints.readManagementData) as Promise<AllocationManagementResponse>,
      {
        refetchOnWindowFocus: false,
      }
    )

  const useAllocationAssociationLinksMutation = () =>
    useMutation(
      [endpoints.upsertLinks],
      (payload: UpsertLinksPayload) => api.post(endpoints.upsertLinks, payload) as Promise<UpsertLinksResponse>,
      {
        onSuccess: (resp: UpsertLinksResponse) => {
          if (resp.Validations?.length > 0) {
            const firstError = resp.Validations[0]
            message.error(firstError.Message)
          } else {
            queryClient.invalidateQueries([endpoints.readManagementData])
          }
        },
      }
    )

  const useAllocationAssociationUnlinkMutation = () =>
    useMutation(
      [endpoints.deleteLinks],
      (payload: AuthorizationAllocationUnlinkPayload) =>
        api.post(endpoints.deleteLinks, payload) as Promise<Validation>,
      {
        onSuccess: (resp: Validation) => {
          queryClient.invalidateQueries([endpoints.readManagementData])
        },
        onError: (resp: Validation) => {
          message.error(resp?.Message)
        },
      }
    )

  const useAllocationAssociationsMetadata = () =>
    useQuery(
      [endpoints.getMetadata],
      () => api.post(endpoints.getMetadata) as Promise<AllocationAssociationMetadataResponse>,
      {
        refetchOnWindowFocus: false,
      }
    )
  return {
    useAllocationAssociationsReferences,
    useAllocationAssociationsReferencesMetadata,
    useAllocationAssociationReferencesMutation,
    useAllocationAssociationsMappings,
    useAllocationAssociationLinksMutation,
    useAllocationAssociationUnlinkMutation,
    useAllocationAssociationsMetadata,
  }
}
