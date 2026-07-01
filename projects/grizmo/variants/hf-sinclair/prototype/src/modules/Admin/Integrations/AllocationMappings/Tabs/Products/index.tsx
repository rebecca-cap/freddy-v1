import { useAllocationMappings } from '@api/useAllocationMappings'
import { ProductGroupTranslation } from '@api/useAllocationMappings/types'
import { SearchableSelect } from '@components/shared/Grid/cellEditors/SelectCellEditor'
import { GraviGrid } from '@gravitate-js/excalibrr'
import { useMemo } from 'react'

import { allocationProductsColumnDefs } from './columnDefs'

export function AllocationMappingsProductsTab({ canWrite }) {
  const { useAllocationProductsMetadata, useAllocationProductsQuery, useAllocationsProductsUpdateMutation } =
    useAllocationMappings()
  const { data: metadata, isLoading: metadataIsLoading } = useAllocationProductsMetadata()
  const { data, isLoading: isDataLoading } = useAllocationProductsQuery()
  const updateMutation = useAllocationsProductsUpdateMutation()

  const products = useMemo(() => {
    return data?.map((p) => {
      return { ...p, ProductIds: p.ProductIds?.map(String) }
    })
  }, [data])

  const handleProductsUpdate = (row: ProductGroupTranslation) => {
    updateMutation.mutate([{ ...row }])
  }

  return (
    <GraviGrid
      agPropOverrides={{
        rowGroupPanelShow: 'never',
        columnDefs: allocationProductsColumnDefs({ metadata, canWrite }),
        getRowId: (row) => row.data.SourceValue.toString(),
        frameworkComponents: { SearchableSelect },
      }}
      controlBarProps={{ title: 'Product Groups' }}
      rowData={products}
      updateEP={handleProductsUpdate}
      isLoading={isDataLoading || metadataIsLoading}
    />
  )
}
