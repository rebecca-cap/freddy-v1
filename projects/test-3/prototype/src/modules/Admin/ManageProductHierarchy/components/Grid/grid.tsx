import { useProductManagement } from '@api/useProductManagement'
import { SearchableSelect } from '@components/shared/Grid/cellEditors/SelectCellEditor'
import { GraviGrid } from '@gravitate-js/excalibrr'
import React, { useMemo } from 'react'

import { getColumnDefs } from './columnDefs'

export function ProductHierarchyGrid({ title = 'Products', productIds, onChangeSelectedProductIds, canWrite }) {
  const { useProductManagementQuery, createUpdateProductManagementMutation } = useProductManagement()
  const { data: products } = useProductManagementQuery(productIds)

  const handleSaveChanges = async (data) => {
    const payload = Array.isArray(data) ? data : [data]
    return createUpdateProductManagementMutation.mutateAsync(payload)
  }

  const columnDefs = useMemo(() => getColumnDefs(canWrite), [canWrite])

  return (
    <GraviGrid
      controlBarProps={{ title, hideActiveFilters: false }}
      onSelectionChanged={({ api }) => {
        const selectedProductIds = api.getSelectedRows().map((row) => row.ProductId)
        onChangeSelectedProductIds(selectedProductIds)
      }}
      agPropOverrides={{
        getRowId: (row) => row.data?.ProductId,
        frameworkComponents: { SearchableSelect },
        rowSelection: 'multiple',
        suppressRowClickSelection: true,
      }}
      storageKey='ReferenceData/ProductHierarchyGrid'
      rowData={products?.Data}
      updateEP={canWrite ? handleSaveChanges : undefined}
      columnDefs={columnDefs}
    />
  )
}
