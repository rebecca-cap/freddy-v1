import { useApi } from '@gravitate-js/excalibrr'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export const endpoints = {
  metadata: 'DeliveryPeriodManagement/GetMetaData',
  read: 'DeliveryPeriodManagement/GetDeliveryPeriodConfigurations',
  createOrUpdate: 'DeliveryPeriodManagement/UpdateOrCreateDeliveryPeriodConfigurations',
  createOrUpdatePeriodGroup: 'DeliveryPeriodManagement/CreateOrUpdateDeliveryPeriodGroup',
}

export const useDeliveryPeriods = () => {
  const api = useApi()
  const queryClient = useQueryClient()

  const useMetadataQuery = () =>
    useQuery([endpoints.metadata], () => api.post(endpoints.metadata), {
      refetchOnWindowFocus: false,
    })

  const useDeliveryPeriodsQuery = (Start, End, MarketPlatformInstrumentId) =>
    useQuery(
      [endpoints.read, Start, End, MarketPlatformInstrumentId],
      ({ queryKey }) =>
        api.post(queryKey[0], {
          Start,
          End,
          MarketPlatformInstrumentId,
        }),
      {
        enabled: !!Start && !!End && !!MarketPlatformInstrumentId,
        refetchOnWindowFocus: false,
      }
    )

  const createUpdateDeliveryPeriodMutation = useMutation(
    [endpoints.createOrUpdate],
    (deliveryPeriods: any[]) => {
      return api.post(endpoints.createOrUpdate, deliveryPeriods)
    },
    {
      onSuccess: async (resp, rows) => {
        await queryClient.cancelQueries([endpoints.read])
        const previousQueries = queryClient.getQueriesData([endpoints.read])
        const updatedRows = rows.map((row) => {
          return row.ConfigurationId ? row.ConfigurationId.toString() : resp?.Data[0]?.ConfigurationId.toString()
        })
        if (!resp.Validations.length) {
          queryClient.setQueriesData([endpoints.read], (cache: any) => {
            const newDeliveryPeriod = rows.find((r) => !r.ConfigurationId)
            if (newDeliveryPeriod) {
              return {
                ...cache,
                Data: [{ ...newDeliveryPeriod, ConfigurationId: resp?.Data[0]?.ConfigurationId }, ...cache.Data],
              }
            }
            return {
              ...cache,
              Data: cache.Data.map((row) => {
                return updatedRows.includes(row.ConfigurationId.toString())
                  ? resp?.Data?.find((r) => r.ConfigurationId.toString() === row.ConfigurationId.toString())
                  : row
              }),
            }
          })
        } else {
          queryClient.setQueriesData([endpoints.read], (cache: any) => {
            return {
              ...cache,
              Data: [...cache.Data],
            }
          })
          queryClient.refetchQueries([endpoints.read])
        }

        return { previousQueries, rows }
      },
      onError: (err, newRow, context) => {
        queryClient.setQueriesData([endpoints.read], context.previousQueries)
      },
    }
  )

  const createDeliveryPeriodGroupMutation = () =>
    useMutation(
      [endpoints.createOrUpdatePeriodGroup],
      (newPeriodGroup) => api.post(endpoints.createOrUpdatePeriodGroup, newPeriodGroup),
      {
        onSuccess: () => {
          queryClient.invalidateQueries([endpoints.metadata])
        },
      }
    )

  return {
    useMetadataQuery,
    useDeliveryPeriodsQuery,
    createUpdateDeliveryPeriodMutation,
    createDeliveryPeriodGroupMutation,
  }
}
