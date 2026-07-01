import { suppressKeyboardEvent } from '@components/shared/Grid/cellEditors'
import { BBDTag } from '@gravitate-js/excalibrr'
import { ColDef } from 'ag-grid-community'
import { Button } from 'antd'
import React from 'react'

export const getColumnDefs = (canWrite) => {
  const columns: ColDef[] = []

  const checkboxSelectionColumn = {
    headerCheckboxSelection: true,
    checkboxSelection: true,
    maxWidth: 50,
    headerCheckboxSelectionFilteredOnly: true,
  }

  if (canWrite) {
    columns.push(checkboxSelectionColumn)
  }
  columns.push(
    {
      headerName: 'Status',
      field: 'IsActive',
      maxWidth: 120,
      editable: canWrite,
      isBulkEditable: canWrite,
      cellEditor: 'SearchableSelect',
      suppressKeyboardEvent,
      filterParams: {
        valueFormatter: (params) => (params.value ? "Active" : "Inactive"),
      },
      cellEditorParams: {
        options: [
          {
            value: true,
            label: 'Active',
          },
          {
            value: false,
            label: 'Inactive',
          },
        ],
        showSearch: false,
        allowClear: false,
      },
      cellRenderer: ({ value }) => (
        <BBDTag success={value} error={!value} style={{ textAlign: 'center' }}>
          {value ? 'Active' : 'Inactive'}
        </BBDTag>
      ),
    },
    {
      field: 'sourceInfo',
      editable: false,
      headerName: 'Source',
      colId: 'sourceInfo',
      maxWidth: 120,
      filterParams: {
        valueGetter: (params) => {
          const SourceInfo = params?.data?.SourceInfo
          const SourceId = SourceInfo?.SourceId
          const SourceIdString = SourceInfo?.SourceIdString
          return SourceId || SourceIdString
        },
      },
      cellRenderer: (params) => {
        const SourceInfo = params?.data?.SourceInfo
        const SourceId = SourceInfo?.SourceId
        const SourceIdString = SourceInfo?.SourceIdString
        return (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Button.Group>
              <Button type='link' style={{ pointerEvents: 'none', minWidth: 140, color: 'black' }}>
                {SourceId || SourceIdString}
              </Button>
            </Button.Group>
          </div>
        )
      },
    },
    {
      headerName: 'Product Name',
      field: 'Name',
      editable: canWrite,
    }
  )

  return columns
}
