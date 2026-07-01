import { Texto } from '@gravitate-js/excalibrr'
import React from 'react'

export const getColumnDefs = () => [
  {
    headerName: 'Channel',
    field: 'Channel',
    rowGroup: true,
    hide: true,
    filterParams: {
      showTooltips: true,
    },
  },
  {
    headerName: 'Customer',
    field: 'CounterParty',
    filterParams: {
      showTooltips: true,
    },
    cellRenderer: (params) => {
      return (
        <Texto style={{ textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>{params.value}</Texto>
      )
    },
  },
]
