import { useApi } from '@gravitate-js/excalibrr'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { eagerlyUpdateRowData } from '@utils/api'
import { cloneDeep } from 'lodash'

export const endpoints = {
  metadata: 'MarketPlatform/Admin/PriceConfiguration/MetaData',
  read: 'MarketPlatform/Admin/PriceConfiguration/GetAll',
  createOrUpdate: 'MarketPlatform/Admin/PriceConfiguration/Upsert',
}

export const usePriceConfigurations = () => {
  const api = useApi()
  const queryClient = useQueryClient()

  const useMetadataQuery = () =>
    useQuery([endpoints.metadata], () => api.post(endpoints.metadata), {
      refetchOnWindowFocus: false,
    })

  const usePriceConfigurationsQuery = () => useQuery([endpoints.read], ({ queryKey }) => api.post(queryKey[0]))

  const createUpdatePriceConfigurationMutation = useMutation(
    [endpoints.createOrUpdate],
    (priceConfiguration) => {
      return api.post(endpoints.createOrUpdate, priceConfiguration)
    },
    {
      onMutate: async (newRow) => {
        const newRowCopy = cloneDeep(newRow[0])
        await queryClient.cancelQueries([endpoints.read])
        eagerlyUpdateRowData(newRowCopy, endpoints.read, 'MarketPlatformPriceConfigurationId', queryClient)
      },
      onSuccess: (data) => {
        queryClient.invalidateQueries([endpoints.read])
      },
      onError: (err, newRow, context) => {
        queryClient.setQueriesData([endpoints.read], context)
      },
    }
  )

  return { useMetadataQuery, usePriceConfigurationsQuery, createUpdatePriceConfigurationMutation }
}
