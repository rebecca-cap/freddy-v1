import {
  AvailableVolumeRow,
  UnmappedAllocationsResp,
  VolumeGroups,
  VolumeSetupGroupPayload,
  VolumeSetupPayload,
} from '@api/useAvailabilityMaintenance/types'
import { NotificationMessage } from '@gravitate-js/excalibrr'
import { useApi } from '@gravitate-js/excalibrr'
import { AvailabilityMaintenanceRow, GridResponse } from '@modules/Admin/AvailabilityMaintenance/types'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { message } from 'antd'

const endpoints = {
  readVolumeManagement: 'AvailabilityMaintenance/GetAvailabilityMaintenanceGridData',
  upsertVolumeManagement: 'AvailabilityMaintenance/UpdateAvailabilityMaintenanceRows',
  readVolumeSetup: 'AvailabilityMaintenance/GetTradeEntrySetupVolumeMappingGridData',
  upsertVolumeSetup: 'AvailabilityMaintenance/UpdateTradeEntrySetupVolumeMappings',
  getVolumeGroups: 'AvailabilityMaintenance/GetTradeEntrySetupVolumeMappingMetadata',
  upsertVolumeGroups: 'AvailabilityMaintenance/UpsertAvailableVolumes',
  autoAssignSetupsToAvailableVolumes: 'AvailabilityMaintenance/AutoAssignTradeEntrySetupsToAvailableVolumes',
  getUnmappedAllocations: 'AvailabilityMaintenance/GetUnmappedAllocations',
}

export const useAvailabilityMaintenance = () => {
  const api = useApi()
  const queryClient = useQueryClient()

  const useAvailabilityMaintenanceQuery = () =>
    useQuery<GridResponse>([endpoints.readVolumeManagement], () => api.post(endpoints.readVolumeManagement), {
      refetchOnWindowFocus: false,
    })

  const useAvailabilityMaintenanceUpsert = () =>
    useMutation({
      mutationFn: (updates: AvailabilityMaintenanceRow[]) => api.post(endpoints.upsertVolumeManagement, updates),
      onSuccess: () => message.success('Availability Maintenance updated successfully'),
      onError: () => message.error('Availability Maintenance update failed'),
    })

  const useVolumeSetupMetadataQuery = () =>
    useQuery<VolumeGroups>([endpoints.getVolumeGroups], () => api.post(endpoints.getVolumeGroups), {
      refetchOnWindowFocus: false,
    })

  const useVolumeSetupQuery = () =>
    useQuery<AvailableVolumeRow[]>([endpoints.readVolumeSetup], () => api.post(endpoints.readVolumeSetup), {
      refetchOnWindowFocus: false,
    })

  const useVolumeSetupUpsert = () =>
    useMutation({
      mutationFn: (updates: VolumeSetupPayload[]) => api.post(endpoints.upsertVolumeSetup, updates),
      onSuccess: (resp) => {
        message.success('Volume setup  updated successfully')
        queryClient.invalidateQueries([endpoints.readVolumeSetup])
      },
      onError: () => message.error('Volume setup update failed'),
    })

  const useVolumeSetupGroupUpsert = () =>
    useMutation({
      mutationFn: (updates: VolumeSetupGroupPayload) => api.post(endpoints.upsertVolumeGroups, updates),
      onSuccess: (resp) => {
        message.success('Volume group updated successfully')
        queryClient.invalidateQueries([endpoints.getVolumeGroups])
        queryClient.invalidateQueries([endpoints.readVolumeSetup])
        queryClient.invalidateQueries([endpoints.readVolumeManagement])
      },
      onError: () => message.error('Volume group update failed'),
    })

  const autoAssignSetupsToVolumes = async () => {
    const response = await api.post(endpoints.autoAssignSetupsToAvailableVolumes)
    if (!response.Validations.length) {
      queryClient.invalidateQueries([endpoints.readVolumeSetup])
      return response
    }
    const errorMessage = response?.Validations[0]?.Message
    NotificationMessage('Auto assign unsuccessful', errorMessage, true)
  }
  const useGetUnmappedAllocationsQuery = () =>
    useQuery<UnmappedAllocationsResp[]>(
      [endpoints.getUnmappedAllocations],
      () => api.post(endpoints.getUnmappedAllocations),
      {
        refetchOnWindowFocus: false,
      }
    )

  return {
    useAvailabilityMaintenanceQuery,
    useAvailabilityMaintenanceUpsert,
    useVolumeSetupMetadataQuery,
    useVolumeSetupQuery,
    useVolumeSetupUpsert,
    useVolumeSetupGroupUpsert,
    autoAssignSetupsToVolumes,
    useGetUnmappedAllocationsQuery,
  }
}
