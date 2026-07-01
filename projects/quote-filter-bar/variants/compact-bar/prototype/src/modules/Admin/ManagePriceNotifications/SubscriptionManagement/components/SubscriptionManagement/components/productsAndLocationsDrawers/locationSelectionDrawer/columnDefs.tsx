import { BBDTag, Horizontal } from '@gravitate-js/excalibrr'
import { ColDef } from 'ag-grid-community'
import React from 'react'

export const getColumnDefs = (): ColDef[] => {
  return [
    {
      headerName: '',
      field: 'checkbox',
      maxWidth: 110,
      checkboxSelection: true,
      headerCheckboxSelection: true,
      headerCheckboxSelectionFilteredOnly: true,
      pinned: 'left',
      filterValueGetter: (params) => {
        return params.node?.selected ? 'Selected' : 'Not Selected'
      },
      comparator: (valueA, valueB, nodeA, nodeB) => {
        return nodeA?.selected ? -1 : 1
      },
    },
    {
      headerName: 'Name',
      field: 'Name',
      minWidth: 220,
    },
    {
      headerName: 'Status',
      field: 'IsActive',
      cellRenderer: (params) => {
        const value = params.value || ''
        return (
          <Horizontal>
            <BBDTag success={!!value}>{value ? 'Active' : 'Inactive'}</BBDTag>
          </Horizontal>
        )
      },
    },
    {
      headerName: 'Type',
      field: 'LocationType',
      valueFormatter: (params) => params.value || '-',
    },
    {
      headerName: 'Abbr..',
      field: 'Abbreviation',
    },
  ] as ColDef[]
}
