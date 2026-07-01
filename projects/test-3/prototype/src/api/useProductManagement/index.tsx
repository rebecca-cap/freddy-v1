import { ProductOverviewResponse } from '@api/useProductManagement/types'
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
  metadata: 'Admin/ProductManagement/GetMetaData',
  read: 'Admin/ProductManagement/read',
  createOrUpdate: 'Admin/ProductManagement/CreateOrUpdate',
  upsertProductGroup: 'Admin/ProductManagement/UpsertProductGroup',
  getHierarchy: 'ReferenceData/Hierarchy/Product/Get',
  getHierarchyList: 'ReferenceData/Hierarchy/Product/List',
  upsertHierarchy: 'ReferenceData/Hierarchy/Product/Upsert',
  getHierarchyItems: 'ReferenceData/Hierarchy/Product/Items',
  moveProduct: 'ReferenceData/Hierarchy/Product/Move',
  deleteProductGroup: 'Admin/ProductManagement/DeleteProductGroup',
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

export const useProductManagement = () => {
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

  const moveProductsInHierarchyMutation = useMutation(
    [endpoints.moveProduct],
    (payload: MovePayload) => api.post(endpoints.moveProduct, payload),
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries([endpoints.getHierarchy])
        await queryClient.invalidateQueries([endpoints.getHierarchyItems])
      },
      onError: toastApiError,
    }
  )

  const useProductManagementQuery = (productIds?: string[]) =>
    useQuery<ProductOverviewResponse>([endpoints.read, { productIds }], async () => {
      const response = await api.post<ProductOverviewResponse>(endpoints.read)

      if (productIds && productIds.length > 0) {
        response.Data = response.Data.filter((item) => productIds.includes(item.ProductId))
      }

      return response
    })

  const createUpdateProductManagementMutation = useMutation(
    [endpoints.createOrUpdate],
    (products: any[]) => {
      return api.post(endpoints.createOrUpdate, products)
    },
    {
      onSuccess: async (resp, rows) => {
        const previousQueries = queryClient.getQueriesData([endpoints.read])
        const updatedRows = rows.map((row) => {
          return row.ProductId ? row.ProductId.toString() : resp?.Data[0]?.ProductId.toString()
        })
        queryClient.setQueriesData([endpoints.read], (cache: any) => {
          const newProduct = rows.find((r) => !r.ProductId)
          if (newProduct) {
            return {
              ...cache,
              Data: [{ ...newProduct, ProductId: resp?.Data[0]?.ProductId }, ...cache.Data],
            }
          }
          return {
            ...cache,
            Data: cache.Data.map((row) => {
              return updatedRows.includes(row.ProductId.toString())
                ? resp?.Data?.find((r) => r.ProductId.toString() === row.ProductId.toString())
                : row
            }),
          }
        })
        NotificationMessage('Success', 'Products(s) saved successfully', false)
      },
      onError: (err, newRow, context) => {
        queryClient.setQueriesData([endpoints.read], context.previousQueries)
        NotificationMessage('Error', 'Could not save Products(s)', true)
      },
    }
  )

  const upsertProductGroupMutation = () =>
    useMutation([endpoints.upsertProductGroup], (product) => api.post(endpoints.upsertProductGroup, product), {
      onSuccess: () => {
        queryClient.invalidateQueries([endpoints.metadata])
      },
    })

  const useProductGroupDeleteMutation = () =>
    useMutation(
      [endpoints.deleteProductGroup],
      (ProductGroupId: number) => api.post(endpoints.deleteProductGroup, { ProductGroupId }),
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
    useProductManagementQuery,
    createUpdateProductManagementMutation,
    upsertProductGroupMutation,
    moveProductsInHierarchyMutation,
    useHierarchyQuery,
    useHierarchyItemsQuery,
    useHierarchyListQuery,
    upsertHierarchyMutation,
    useProductGroupDeleteMutation,
  }
}
