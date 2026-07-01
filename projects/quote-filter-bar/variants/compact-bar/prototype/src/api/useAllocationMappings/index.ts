import {
  LocationsMetadataResponse,
  LocationTranslation,
  ProductGroupTranslation,
  ProductsMetadata,
  SuppliersMetadataResponse,
  SupplierTranslation,
} from '@api/useAllocationMappings/types'
import { useApi } from '@gravitate-js/excalibrr'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { message } from 'antd'

export const endpoints = {
  locationMetadata: 'MarketPlatform/Admin/AllocationFileImportManagement/GetLocationMetadata',
  supplierMetadata: 'MarketPlatform/Admin/AllocationFileImportManagement/GetSupplierMetadata',
  productMetadata: 'MarketPlatform/Admin/AllocationFileImportManagement/GetProductMetadata',
  locationsRead: 'MarketPlatform/Admin/AllocationFileImportManagement/ReadLocationTranslations',
  suppliersRead: 'MarketPlatform/Admin/AllocationFileImportManagement/ReadSupplierTranslations',
  productRead: 'MarketPlatform/Admin/AllocationFileImportManagement/ReadProductGroupTranslations',
  saveLocations: 'MarketPlatform/Admin/AllocationFileImportManagement/SaveTerminalTranslations',
  saveSuppliers: 'MarketPlatform/Admin/AllocationFileImportManagement/SaveSupplierTranslations',
  saveProducts: 'MarketPlatform/Admin/AllocationFileImportManagement/SaveProductGroupTranslations',
}

export const useAllocationMappings = () => {
  const api = useApi()
  const queryClient = useQueryClient()

  const useAllocationLocationsMetadata = () =>
    useQuery([endpoints.locationMetadata], () => api.post(endpoints.locationMetadata) as LocationsMetadataResponse, {
      refetchOnWindowFocus: false,
    })
  const useAllocationSuppliersMetadata = () =>
    useQuery([endpoints.supplierMetadata], () => api.post(endpoints.supplierMetadata) as SuppliersMetadataResponse, {
      refetchOnWindowFocus: false,
    })
  const useAllocationProductsMetadata = () =>
    useQuery([endpoints.productMetadata], () => api.post(endpoints.productMetadata) as ProductsMetadata, {
      refetchOnWindowFocus: false,
    })

  const useAllocationLocationsQuery = () =>
    useQuery([endpoints.locationsRead], () => api.post(endpoints.locationsRead) as LocationTranslation[], {
      refetchOnWindowFocus: false,
    })
  const useAllocationSuppliersQuery = () =>
    useQuery([endpoints.suppliersRead], () => api.post(endpoints.suppliersRead) as SupplierTranslation[], {
      refetchOnWindowFocus: false,
    })

  const useAllocationProductsQuery = () =>
    useQuery([endpoints.productRead], () => api.post(endpoints.productRead) as ProductGroupTranslation[], {
      refetchOnWindowFocus: false,
    })

  const useAllocationsSuppliersUpdateMutation = () =>
    useMutation({
      mutationFn: (payload: SupplierTranslation[]) => api.post(endpoints.saveSuppliers, payload),
      onSuccess: (resp) => {
        if (resp.Validations?.length > 0) {
          const firstError = resp.Validations[0]
          message.error(firstError.Message)
        } else {
          queryClient.invalidateQueries([endpoints.saveSuppliers])
        }
      },
    })

  const useAllocationsLocationsUpdateMutation = () =>
    useMutation({
      mutationFn: (payload: LocationTranslation[]) => api.post(endpoints.saveLocations, payload),
      onSuccess: (resp) => {
        if (resp.Validations?.length > 0) {
          const firstError = resp.Validations[0]
          message.error(firstError.Message)
        } else {
          queryClient.invalidateQueries([endpoints.saveLocations])
        }
      },
    })

  const useAllocationsProductsUpdateMutation = () =>
    useMutation({
      mutationFn: (payload: ProductGroupTranslation[]) => api.post(endpoints.saveProducts, payload),
      onSuccess: (resp) => {
        if (resp.Validations?.length > 0) {
          const firstError = resp.Validations[0]
          message.error(firstError.Message)
        } else {
          queryClient.invalidateQueries([endpoints.saveProducts])
        }
      },
    })

  return {
    useAllocationLocationsMetadata,
    useAllocationSuppliersMetadata,
    useAllocationProductsMetadata,
    useAllocationLocationsQuery,
    useAllocationSuppliersQuery,
    useAllocationProductsQuery,
    useAllocationsSuppliersUpdateMutation,
    useAllocationsLocationsUpdateMutation,
    useAllocationsProductsUpdateMutation,
  }
}
