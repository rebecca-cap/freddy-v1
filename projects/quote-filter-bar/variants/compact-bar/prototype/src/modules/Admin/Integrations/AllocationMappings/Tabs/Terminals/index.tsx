import { useAllocationMappings } from '@api/useAllocationMappings'
import { LocationTranslation } from '@api/useAllocationMappings/types'
import { SearchableSelect } from '@components/shared/Grid/cellEditors/SelectCellEditor'
import { GraviGrid } from '@gravitate-js/excalibrr'

import { allocationLocationColumnDefs } from './columnDefs'

export function AllocationMappingsTerminalsTab({ canWrite }) {
  const { useAllocationLocationsMetadata, useAllocationLocationsQuery, useAllocationsLocationsUpdateMutation } =
    useAllocationMappings()
  const { data: metadata, isLoading: metadataIsLoading } = useAllocationLocationsMetadata()
  const { data, isLoading: isDataLoading } = useAllocationLocationsQuery()
  const updateMutation = useAllocationsLocationsUpdateMutation()

  const handleLocationUpdate = (row: LocationTranslation) => {
    updateMutation.mutate([{ ...row }])
  }

  return (
    <GraviGrid
      agPropOverrides={{
        rowGroupPanelShow: 'never',
        columnDefs: allocationLocationColumnDefs({ metadata, canWrite }),
        getRowId: (row) => row.data.SourceValue,
        frameworkComponents: { SearchableSelect },
      }}
      controlBarProps={{ title: 'Terminals' }}
      rowData={data}
      updateEP={handleLocationUpdate}
      isLoading={isDataLoading || metadataIsLoading}
    />
  )
}
