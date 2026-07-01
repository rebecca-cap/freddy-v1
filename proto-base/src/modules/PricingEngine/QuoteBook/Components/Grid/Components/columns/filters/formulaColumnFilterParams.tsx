import { Texto } from '@gravitate-js/excalibrr'
import React from 'react'

export const formulaColumnFilterParams = {
  filters: [
    {
      field: 'Cost',
      filter: 'agNumberColumnFilter',
      display: 'subMenu',
      title: 'Filter by Cost Value',
      keyCreator: (params) => parseFloat(params.value),
      valueFormatter: (params) => params.value,
      valueGetter: (params) => (params.value ? parseFloat(params.value) : undefined),
      filterParams: {
        buttons: ['reset'],
      },
    },
    {
      field: 'CostStatus',
      filter: 'agSetColumnFilter',
      display: 'subMenu',
      title: 'Filter by Cost Status',
      filterParams: {
        buttons: ['reset'],
        values: ['Actual', 'Estimated', 'Missing', 'Old'],
        cellRenderer: (params) => {
          if (!params.value.toLowerCase().includes('select all')) {
            return (
              <Texto>
                {params.value} ({params.value.charAt(0).toUpperCase()})
              </Texto>
            )
          }
          return <Texto>{params.value}</Texto>
        },
        keyCreator: (params) => params.value,
        valueFormatter: (params) => params.value,
        valueGetter: (params) => params?.data?.CostStatus,
      },
    },
  ],
}
