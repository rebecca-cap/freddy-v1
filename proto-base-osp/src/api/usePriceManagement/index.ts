import { PlaceholderUpdate, PlaceholderUpdateResponse } from '@api/usePriceManagement/types'
import { useApi } from '@gravitate-js/excalibrr'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { message } from 'antd'

export const endpoints = {
  read: 'MarketPlatform/PlaceholderPriceManagement/GetPlaceholders',
  update: 'MarketPlatform/PlaceholderPriceManagement/UpdatePlaceholders',
}

export const usePriceHolderManagement = () => {
  const api = useApi()
  const queryClient = useQueryClient()

  const usePriceHoldersQuery = (MinEffective: Date, MaxEffective: Date, Mode: string) =>
    useQuery<PlaceholderUpdateResponse>([endpoints.read, MinEffective, MaxEffective, Mode], ({ queryKey }) =>
      api.post(queryKey[0], { MinEffective, MaxEffective, Mode })
    )

  const usePlaceholdersUpdate = () =>
    useMutation<PlaceholderUpdateResponse, unknown, PlaceholderUpdate[]>({
      mutationFn: (payload) => api.post(endpoints.update, { Updates: payload }),
      onSuccess: (resp) => {
        if (resp.Validations?.length > 0) {
          const firstError = resp.Validations[0]
          message.error(firstError.Message)
        } else {
          queryClient.invalidateQueries([endpoints.read])
        }
      },
    })

  return { usePriceHoldersQuery, usePlaceholdersUpdate }
}
