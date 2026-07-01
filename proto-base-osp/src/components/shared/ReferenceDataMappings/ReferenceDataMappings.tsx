import { SearchableSelect } from '@components/shared/Grid/cellEditors/SelectCellEditor'
import { GraviGrid } from '@gravitate-js/excalibrr'
import { AllocationReferencesPageProps } from '@modules/Admin/ManageAllocationAssociations'
import { GridApi } from 'ag-grid-community'
import React, { MutableRefObject, useMemo, useRef } from 'react'

import { createReferenceDataMappingsColumns } from './columnDefs'

export function ReferenceDataMappings({
  metadata,
  data,
  updateWrapper,
  isLoading,
  dataKey,
  metaKey,
  canWrite,
}: AllocationReferencesPageProps) {
  const gridRef = useRef() as MutableRefObject<GridApi>

  const idKey = dataKey?.slice(0, -1)
  const metaId = useMemo(() => {
    switch (metaKey) {
      case 'CounterParties':
        return 'CounterPartyId'
      case 'Locations':
        return 'LocationId'
      case 'Products':
        return 'ProductId'
      default:
        return ''
    }
  }, [metaKey])

  const uniqueReferenceDataValues = useMemo(() => {
    const uniqueValues = new Set()

    data?.forEach((item) => {
      item[`Allocation${idKey}Associations`]?.forEach((association) => {
        uniqueValues.add(association[metaId])
      })
    })

    return Array.from(uniqueValues) as number[]
  }, [data])

  const columnDefs = useMemo(
    () => createReferenceDataMappingsColumns(metadata, idKey, metaKey, metaId, uniqueReferenceDataValues, canWrite),
    [metadata, idKey, metaKey, metaId, uniqueReferenceDataValues, data, canWrite]
  )

  return (
    <div style={{ display: 'flex', width: '100%', height: '89vh' }}>
      <div style={{ flex: 1 }}>
        <GraviGrid
          controlBarProps={{
            title: `${dataKey?.slice(0, -1)} - ${metaKey}`,
          }}
          externalRef={gridRef}
          storageKey={`ReferenceData/AllocationAssociations/${dataKey}`}
          agPropOverrides={{
            frameworkComponents: { SearchableSelect },
            getRowId: (row) => row.data?.[`Allocation${idKey}Id`]?.toString(),
          }}
          updateEP={async (row) => (canWrite ? updateWrapper && updateWrapper(row, dataKey) : undefined)}
          rowData={data}
          columnDefs={columnDefs}
          loading={isLoading}
          rowGroupPanelShow='never'
        />
      </div>
    </div>
  )
}
