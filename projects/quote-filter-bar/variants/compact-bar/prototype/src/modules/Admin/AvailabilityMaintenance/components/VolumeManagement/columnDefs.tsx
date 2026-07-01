import { LinkOutlined } from '@ant-design/icons'
import { Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'
import { Popover } from 'antd'
import React from 'react'

import type { AvailabilityMaintenanceRow } from '../../types'

interface IProps {
  canWrite: boolean
  sampleRow?: AvailabilityMaintenanceRow
}

export const getVolumeManagementColumnDefs = ({ canWrite, sampleRow }: IProps) => {
  if (!sampleRow) return []
  const periodDefs = sampleRow.GridCells.map((cell, index) => ({
    enableRowGroup: false,
    suppressMovable: true,
    minWidth: 120,
    isEditable: cell.IsEditable,
    editable: canWrite,
    $periodIndex: index,
    $isCellDirty: (params) => {
      const { originalRow } = params

      if (originalRow) {
        const a = originalRow.GridCells[index].AvailableQuantity
        const b = params.data.GridCells[index].AvailableQuantity
        return a !== b
      }

      return false
    },
    field: `GridCells.${index}.AvailableQuantity`,
    cellEditor: 'agNumberCellEditor',
    valueGetter: (params: { data: AvailabilityMaintenanceRow }) => params?.data?.GridCells[index].AvailableQuantity,
    valueSetter: (params: { data: AvailabilityMaintenanceRow; newValue: string }) => {
      params.data.GridCells[index].AvailableQuantity = parseInt(params.newValue)
      return true
    },
    valueFormatter: fmt.integer,
    headerName: cell.CellFullName || cell.PeriodName,
  }))

  return [
    {
      field: 'AvailableVolumeName',
      suppressMovable: true,
      enableRowGroup: false,
      editable: false,
      minWidth: 220,
      pinned: 'left',
      sort: 'asc',
      comparator: (valueA, valueB) => {
        return valueA?.toLowerCase().localeCompare(valueB?.toLowerCase())
      },
      cellStyle: (params) => ({ pointerEvents: 'none' }),
    },
    {
      field: 'AllocationId',
      headerName: 'Allocation',
      enableRowGroup: false,
      suppressMovable: true,
      editable: false,
      minWidth: 75,
      pinned: 'left',
      cellRenderer: (params) => {
        if (params.data.AllocationId) {
          return (
            <Horizontal verticalCenter style={{ color: 'var(--theme-color-2)' }}>
              <LinkOutlined className='mr-1' style={{ color: 'inherit' }} />
              <Texto style={{ fontSize: '.9em', color: 'inherit' }}>Linked</Texto>
            </Horizontal>
          )
        }
        return ''
      },
      valueGetter: (params) => (params.data.AllocationId ? 'Linked' : 'Not Linked'),
    },
    {
      field: 'Locations',
      enableRowGroup: false,
      suppressMovable: true,
      minWidth: 260,
      editable: false,
      pinned: 'left',
      comparator: (valueA, valueB) => {
        return (valueA || '')?.toLowerCase().localeCompare((valueB || '')?.toLowerCase())
      },
      cellRenderer: ({ value }) => {
        return <CellHoverPopOver list={value} title='Multiple Locations' />
      },
    },
    {
      field: 'Products',
      enableRowGroup: false,
      suppressMovable: true,
      minWidth: 200,
      editable: false,
      pinned: 'left',
      comparator: (valueA, valueB) => {
        return (valueA || '')?.toLowerCase().localeCompare((valueB || '')?.toLowerCase())
      },
      cellRenderer: ({ value }) => {
        return <CellHoverPopOver list={value} title='Multiple Products' />
      },
    },
    ...periodDefs,
  ]
}

function CellHoverPopOver({ list, title }) {
  if (!list?.length) {
    return <Texto>None</Texto>
  }
  if (list?.length === 1) {
    return <Texto>{list}</Texto>
  }
  return (
    <Popover
      placement='bottomLeft'
      content={
        <Vertical>
          {list?.map((item) => (
            <Horizontal key={item}>
              <Texto>{item}</Texto>
            </Horizontal>
          ))}
        </Vertical>
      }
    >
      {title}
    </Popover>
  )
}
