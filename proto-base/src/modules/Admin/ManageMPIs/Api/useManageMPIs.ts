import { APIResponse } from '@api/globalTypes'
import { useApi } from '@gravitate-js/excalibrr'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import {
  MarketPlatformInstrument,
  MarketPlatformInstrumentSubtypeDTO,
  MarketPlatformInstrumentSubtypeWithParent,
  MPIMetadata,
  ReadMPIsResponse,
  UpdateMPIsRequest,
  UpdateMPIsResponse,
} from './types.schema'

const endpoints = {
  read: 'marketPlatform/admin/marketPlatformInstrument/GetAllMarketPlatformInstruments',
  update: 'marketPlatform/admin/marketPlatformInstrument/UpdateMarketPlatformInstruments',
  metadata: 'marketPlatform/admin/marketPlatformInstrument/GetMetaData',
} as const

const queryKeys = {
  mpis: [endpoints.read] as const,
  metadata: [endpoints.metadata] as const,
}

// Helper function to flatten all subtypes from MPIs with parent info
export const getAllSubtypes = (
  mpis: MarketPlatformInstrument[]
): MarketPlatformInstrumentSubtypeWithParent[] => {
  return mpis.flatMap((mpi) =>
    (mpi.MarketPlatformInstrumentSubtypes || []).map((subtype) => ({
      ...subtype,
      ParentInstrumentName: mpi.InstrumentName,
      ParentMPIId: mpi.MarketPlatformInstrumentId,
    }))
  )
}

// Helper function to group subtypes back by parent MPI for saving
export const groupSubtypesByParent = (
  subtypes: MarketPlatformInstrumentSubtypeWithParent[],
  originalMPIs: MarketPlatformInstrument[]
): MarketPlatformInstrument[] => {
  const subtypesByParent = new Map<number, MarketPlatformInstrumentSubtypeDTO[]>()

  subtypes.forEach((subtype) => {
    if (subtype.ParentMPIId) {
      if (!subtypesByParent.has(subtype.ParentMPIId)) {
        subtypesByParent.set(subtype.ParentMPIId, [])
      }
      subtypesByParent.get(subtype.ParentMPIId)!.push(subtype)
    }
  })

  return originalMPIs.map((mpi) => ({
    ...mpi,
    MarketPlatformInstrumentSubtypes:
      subtypesByParent.get(mpi.MarketPlatformInstrumentId) || mpi.MarketPlatformInstrumentSubtypes,
  }))
}

export const useManageMPIs = () => {
  const api = useApi()
  const queryClient = useQueryClient()

  const getMPIs = () =>
    useQuery<ReadMPIsResponse>(
      queryKeys.mpis,
      async ({ queryKey }) => {
        const res = await api.post(queryKey[0] as string)
        return res as ReadMPIsResponse
      },
      {
        refetchOnWindowFocus: false,
      }
    )

  const getMetadata = () =>
    useQuery<APIResponse<MPIMetadata>>(
      queryKeys.metadata,
      async ({ queryKey }) => {
        const res = await api.post(queryKey[0] as string)
        return res as APIResponse<MPIMetadata>
      },
      {
        refetchOnWindowFocus: false,
      }
    )

  const updateMPIs = () =>
    useMutation<UpdateMPIsResponse, unknown, UpdateMPIsRequest, { previousMPIs: ReadMPIsResponse | undefined }>(
      (payload) =>
        api.post<APIResponse<MarketPlatformInstrument[]>>(
          endpoints.update,
          payload as any
        ) as Promise<UpdateMPIsResponse>,
      {
        onMutate: async (updatedMPIs) => {
          await queryClient.cancelQueries(queryKeys.mpis)
          const previousMPIs = queryClient.getQueryData<ReadMPIsResponse>(queryKeys.mpis)
          queryClient.setQueryData<ReadMPIsResponse>(queryKeys.mpis, (old) => {
            if (!old?.Data) return old

            const updatesMap = new Map(updatedMPIs.map((mpi) => [mpi.MarketPlatformInstrumentId, mpi]))

            const updatedData = old.Data.map((mpi) => {
              const update = updatesMap.get(mpi.MarketPlatformInstrumentId)
              return update ? { ...mpi, ...update } : mpi
            })

            return {
              ...old,
              Data: updatedData,
            }
          })
          return { previousMPIs }
        },
        onError: (_err, _variables, context) => {
          if (context?.previousMPIs) {
            queryClient.setQueryData(queryKeys.mpis, context.previousMPIs)
          }
        },
        onSuccess: (response) => {
          queryClient.setQueryData<ReadMPIsResponse>(queryKeys.mpis, (old) => {
            if (!old) return old
            return {
              ...old,
              Data: response.Data,
            }
          })
        },
        onSettled: () => {
          queryClient.invalidateQueries(queryKeys.mpis)
        },
      }
    )

  const updateSubtypes = () =>
    useMutation<
      UpdateMPIsResponse,
      unknown,
      { subtypes: MarketPlatformInstrumentSubtypeWithParent[]; originalMPIs: MarketPlatformInstrument[] },
      { previousMPIs: ReadMPIsResponse | undefined }
    >(
      ({ subtypes, originalMPIs }) => {
        const mpisWithUpdatedSubtypes = groupSubtypesByParent(subtypes, originalMPIs)
        return api.post<APIResponse<MarketPlatformInstrument[]>>(
          endpoints.update,
          mpisWithUpdatedSubtypes as any
        ) as Promise<UpdateMPIsResponse>
      },
      {
        onMutate: async ({ subtypes, originalMPIs }) => {
          await queryClient.cancelQueries(queryKeys.mpis)
          const previousMPIs = queryClient.getQueryData<ReadMPIsResponse>(queryKeys.mpis)
          queryClient.setQueryData<ReadMPIsResponse>(queryKeys.mpis, (old) => {
            if (!old?.Data) return old
            const updatedMPIs = groupSubtypesByParent(subtypes, originalMPIs)
            return {
              ...old,
              Data: updatedMPIs,
            }
          })
          return { previousMPIs }
        },
        onError: (_err, _variables, context) => {
          if (context?.previousMPIs) {
            queryClient.setQueryData(queryKeys.mpis, context.previousMPIs)
          }
        },
        onSuccess: (response) => {
          queryClient.setQueryData<ReadMPIsResponse>(queryKeys.mpis, (old) => {
            if (!old) return old
            return {
              ...old,
              Data: response.Data,
            }
          })
        },
        onSettled: () => {
          queryClient.invalidateQueries(queryKeys.mpis)
        },
      }
    )

  return {
    getMPIs,
    getMetadata,
    updateMPIs,
    updateSubtypes,
  }
}
