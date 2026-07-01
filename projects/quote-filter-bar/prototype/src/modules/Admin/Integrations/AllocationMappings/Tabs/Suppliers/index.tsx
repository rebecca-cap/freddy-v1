import { useAllocationMappings } from '@api/useAllocationMappings'
import { SupplierTranslation } from '@api/useAllocationMappings/types'
import { SearchableSelect } from '@components/shared/Grid/cellEditors/SelectCellEditor'
import { GraviGrid } from '@gravitate-js/excalibrr'

import { allocationSuppliersColumnDefs } from './columnDefs'

export function AllocationMappingsSuppliersTab({ canWrite }) {
  const { useAllocationSuppliersMetadata, useAllocationSuppliersQuery, useAllocationsSuppliersUpdateMutation } =
    useAllocationMappings()
  const { data: metadata, isLoading: metadataIsLoading } = useAllocationSuppliersMetadata()
  const { data, isLoading: isDataLoading } = useAllocationSuppliersQuery()
  const updateMutation = useAllocationsSuppliersUpdateMutation()

  const handleSupplierUpdate = (row: SupplierTranslation) => {
    updateMutation.mutate([{ ...row }])
  }

  return (
    <GraviGrid
      agPropOverrides={{
        rowGroupPanelShow: 'never',
        columnDefs: allocationSuppliersColumnDefs({ metadata, canWrite }),
        getRowId: (row) => row.data.SourceValue,
        frameworkComponents: { SearchableSelect },
      }}
      controlBarProps={{ title: 'Suppliers' }}
      rowData={data}
      updateEP={handleSupplierUpdate}
      isLoading={isDataLoading || metadataIsLoading}
    />
  )
}
