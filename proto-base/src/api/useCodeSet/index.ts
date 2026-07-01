import { useApi } from '@gravitate-js/excalibrr'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { CodeSetResponse, CodeValue } from './responseTypes'

const endpoints = {
  getOne: 'ReferenceData/CodeSet/Get',
  getAll: 'ReferenceData/CodeSet/GetAll',
  update: 'ReferenceData/CodeSet/CreateOrUpdateCodeValues',
}

export const useCodeSets = () => {
  const api = useApi()
  const queryClient = useQueryClient()

  const useCodeSetQuery = (names: string[]) =>
    useQuery(
      [endpoints.getOne, ...names],
      ({ queryKey: [url] }) => api.post(url, { CodeSetNames: names }) as CodeSetResponse,
      {
        refetchOnWindowFocus: false,
      }
    )

  const useCodeSetAllQuery = () =>
    useQuery([endpoints.getAll], ({ queryKey: [url] }) => api.post(url) as CodeSetResponse, {
      refetchOnWindowFocus: false,
    })

  const useCodeSetMutation = () =>
    useMutation({
      mutationKey: [endpoints.update],
      mutationFn: (value: CodeValue) => api.post(endpoints.update, [{ ...value }]),
      // On a successful code value update, invalidate any CodeSet/Get queries for types found in `invalidateKeys`
      onSuccess: () => {
        queryClient.invalidateQueries([endpoints.getOne])
      },
    })

  return { useCodeSetAllQuery, useCodeSetQuery, useCodeSetMutation }
}
