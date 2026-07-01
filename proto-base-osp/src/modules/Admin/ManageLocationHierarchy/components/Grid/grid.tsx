import { useLocationManagement } from '@api/useLocationManagement'
import { SearchableSelect } from '@components/shared/Grid/cellEditors/SelectCellEditor'
import { GraviGrid } from '@gravitate-js/excalibrr'
import React, { useMemo } from 'react'

import { getColumnDefs } from './columnDefs'

export function LocationHierarchyGrid({ title = 'Locations', locationIds, onChangeSelectedLocationIds, canWrite }) {
  const { useLocationManagementQuery } = useLocationManagement()
  const { data: locations } = useLocationManagementQuery(locationIds)
  const columnDefs = useMemo(() => getColumnDefs(canWrite), [canWrite])

  return (
    <GraviGrid
      controlBarProps={{ title, hideActiveFilters: false }}
      onSelectionChanged={({ api }) => {
        onChangeSelectedLocationIds(api.getSelectedRows().map((row) => row.LocationId))
      }}
      agPropOverrides={{
        getRowId: (row) => row.data?.LocationId,
        frameworkComponents: { SearchableSelect },
        rowSelection: 'multiple',
        suppressRowClickSelection: true,
      }}
      storageKey='ReferenceData/ManageProducts'
      rowData={locations?.Data}
      columnDefs={columnDefs}
    />
  )
}
