import { UserOutlined } from '@ant-design/icons'
import { SearchableSelect } from '@components/shared/Grid/cellEditors/SelectCellEditor'
import { BBDTag, Horizontal, Texto } from '@gravitate-js/excalibrr'
import React from 'react'

export function getColumnDefs() {
  return [
    {
      field: 'CounterParty',
      headerName: 'Name',
      sortable: true,
      sort: 'asc',
      sortIndex: 2,
      cellRenderer: ({ value }) => {
        return (
          <Horizontal verticalCenter style={{ gap: 10 }}>
            <UserOutlined />
            {value}
          </Horizontal>
        )
      },
      editable: false,
    },
    {
      field: 'PricePublisher',
      headerName: 'Publisher',
      sortable: true,
      sort: 'asc',
      sortIndex: 1,
      editable: false,
    },
    {
      field: 'Region',
      headerName: 'Region',
      editable: false,
    },
    {
      field: 'Location',
      headerName: 'Terminal',
      editable: false,
    },
    {
      field: 'ProductGroup',
      headerName: 'Product Group',
      editable: false,
    },
    {
      field: 'Product',
      headerName: 'Product',
      editable: false,
    },
    {
      headerName: 'Visibility',
      field: 'IsHiddenByDefault',
      cellRenderer: (params) => {
        const isHidden = params?.data.IsHiddenByDefault
        const isHighlighted = params?.data?.IsHighlighted
        return (
          <BBDTag success={!isHidden && !isHighlighted} theme4={isHighlighted}>
            <Texto align='center' style={{ color: 'inherit' }}>
              {isHighlighted ? 'Highlight' : isHidden ? 'Hide' : 'Show'}
            </Texto>
          </BBDTag>
        )
      },
      editable: true,
      cellEditor: SearchableSelect,
      cellEditorParams: {
        options: [
          { value: 'isHidden', label: 'Hide' },
          { value: 'Default', label: 'Default' },
          { value: 'isHighlighted', label: 'Highlight' },
        ],
      },
      valueGetter: (params) =>
        params?.data?.IsHighlighted ? 'Highlight' : params.data.IsHiddenByDefault ? 'Hide' : 'Show',
      valueSetter: (params) => {
        const value = params?.newValue
        if (value === 'isHidden') {
          params.data.IsHiddenByDefault = true
          params.data.IsHighlighted = false
        } else if (value === 'isHighlighted') {
          params.data.IsHiddenByDefault = false
          params.data.IsHighlighted = true
        } else {
          params.data.IsHiddenByDefault = false
          params.data.IsHighlighted = false
        }
        return true
      },
    },
  ]
}
