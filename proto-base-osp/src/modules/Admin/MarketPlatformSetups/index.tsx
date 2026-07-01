import { useMarketPlatformSetups } from '@api/useMarketPlatformSetups'
import { suppressKeyboardEvent } from '@components/shared/Grid/cellEditors'
import { SearchableSelect } from '@components/shared/Grid/cellEditors/SelectCellEditor'
import { useUser } from '@contexts/UserContext'
import { BBDTag, GraviGrid, Vertical } from '@gravitate-js/excalibrr'
import React, { useCallback, useRef, useState } from 'react'

import { BulkChangeDrawer } from './BulkChangeDrawer'

export function MarketPlatformSetups() {
  const gridAPIRef = useRef(null)

  const { userPermissions } = useUser()
  const canWrite = !!userPermissions?.MarketPlatformSetup?.Write

  const { useMetadataQuery, useMPSGetQuery, useMarketPlatformSetupsMutation } = useMarketPlatformSetups()
  const { data: metadata } = useMetadataQuery()
  const { data: marketPlatformSetups } = useMPSGetQuery()
  const updateMarketPlatformSetupsMutation = useMarketPlatformSetupsMutation()

  const [selectedRows, setSelectedRows] = useState([])
  const clearSelection = useCallback(() => gridAPIRef?.current?.forEachNode((n) => n.setSelected(false)), [gridAPIRef])

  const editableProperties = getColumnDefs(metadata).filter((def) => def.editable && def.field && def.name)

  const handleSaveChanges = async (updatedRow) => {
    return updateMarketPlatformSetupsMutation.mutateAsync([updatedRow])
  }

  return (
    <Vertical style={{ minWidth: '100%' }}>
      <GraviGrid
        onSelectionChanged={(props) => {
          setSelectedRows(props.api.getSelectedRows())
        }}
        controlBarProps={{
          title: 'Manage Market Platform Setups',
        }}
        agPropOverrides={{
          columnDefs: getColumnDefs(canWrite),
          getRowId: (row) => row.data?.TradeEntrySetupId,
          frameworkComponents: { SearchableSelect },
          rowSelection: 'multiple',
          suppressRowClickSelection: true,
        }}
        externalRef={gridAPIRef}
        storageKey='MarketPlatform/ManageMarketPlatformSetups'
        rowData={marketPlatformSetups?.Data}
        updateEP={canWrite ? handleSaveChanges : undefined}
      />
      {selectedRows?.length > 0 && (
        <BulkChangeDrawer
          editableProperties={editableProperties}
          selectedRows={selectedRows}
          clearSelection={clearSelection}
          updateEP={updateMarketPlatformSetupsMutation}
        />
      )}
    </Vertical>
  )
}

export const getColumnDefs = (canWrite) => {
  const columns = [
    {
      headerCheckboxSelection: canWrite,
      checkboxSelection: canWrite,
      headerName: '',
      field: '',
      maxWidth: 50,
      headerCheckboxSelectionFilteredOnly: true,
    },
    {
      field: 'LocationName',
      flex: 1,
      editable: false,
    },
    {
      field: 'ProductName',
      flex: 1,
      editable: false,
    },
    {
      field: 'MarketPlatformInstrumentName',
      editable: false,
      flex: 1,
    },
    {
      name: 'Enabled',
      headerName: 'Enabled',
      field: 'IsActive',
      flex: 0.5,
      editable: canWrite,
      cellEditor: 'SearchableSelect',
      suppressKeyboardEvent,
      cellEditorParams: {
        options: [
          {
            value: true,
            label: 'Yes',
          },
          {
            value: false,
            label: 'No',
          },
        ],
      },
      cellRenderer: ({ value }) =>
        value ? (
          <BBDTag success style={{ textAlign: 'center' }}>
            Yes
          </BBDTag>
        ) : (
          <BBDTag error style={{ textAlign: 'center' }}>
            No
          </BBDTag>
        ),
    },
    {
      name: 'Internal Entry Only',
      field: 'InternalEntryOnly',
      editable: canWrite,
      flex: 0.5,
      cellEditor: 'SearchableSelect',
      suppressKeyboardEvent,
      cellEditorParams: {
        options: [
          {
            value: true,
            label: 'Yes',
          },
          {
            value: false,
            label: 'No',
          },
        ],
      },
      cellRenderer: ({ value }) =>
        value ? (
          <BBDTag success style={{ textAlign: 'center' }}>
            Yes
          </BBDTag>
        ) : (
          <BBDTag error style={{ textAlign: 'center' }}>
            No
          </BBDTag>
        ),
    },
  ]

  return columns
}
