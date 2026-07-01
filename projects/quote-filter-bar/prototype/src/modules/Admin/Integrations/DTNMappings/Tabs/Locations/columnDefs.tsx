import { CheckCircleOutlined, WarningOutlined } from '@ant-design/icons'
import { DTNMetadataResponse } from '@api/useDTNMappings/types'
import { BulkSelectEditor } from '@components/shared/Grid/bulkChange/bulkCellEditors'
import { suppressKeyboardEvent } from '@components/shared/Grid/cellEditors'
import { BBDTag, Texto } from '@gravitate-js/excalibrr'
import { toAntOption } from '@utils/index'
import { ColDef } from 'ag-grid-community'
import React from 'react'

interface IGetColumnDefProps {
  metadata: DTNMetadataResponse
  canWrite: boolean
}

export function dtnLocationColumnDefs({ metadata, canWrite }: IGetColumnDefProps) {
  return [
    {
      editable: false,
      field: 'SourceValue',
      headerName: 'Source ID', // identifier used to indicate what the piece of reference data is.
    },
    {
      editable: false,
      field: 'Display',
      headerName: 'Source Location',
    },
    {
      field: 'TargetLocationId',
      headerName: 'Location',
      cellEditor: 'SearchableSelect',
      suppressKeyboardEvent,
      editable: canWrite,
      cellEditorParams: {
        options: metadata?.Locations?.map(toAntOption),
        showSearch: true,
        allowClear: true,
      },
      isBulkEditable: canWrite,
      bulkCellEditor: BulkSelectEditor,
      bulkCellEditorParams: {
        propKey: 'TargetLocationId',
        options: metadata?.Locations,
        selectEditorProps: { showSearch: true, allowClear: true },
      },
      valueGetter: (params) =>
        metadata?.Locations?.find((option) => option.Value?.toString() === params?.data?.TargetLocationId?.toString())
          ?.Text,
      cellRenderer: ({ value }) => {
        if (value) {
          return (
            <Texto>
              <span className='mr-2'>
                <CheckCircleOutlined style={{ color: 'var(--theme-success)' }} />
              </span>
              {value}
            </Texto>
          )
        }
        return (
          <Texto>
            <span className='mr-2'>
              <WarningOutlined style={{ color: 'var(--theme-warning)' }} />
            </span>
            Not set
          </Texto>
        )
      },
    },
    {
      headerName: 'Is Hidden',
      field: 'IsHidden',
      editable: canWrite,
      isBulkEditable: canWrite,
      flex: 0.3,
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
  ] as ColDef[]
}
