import { CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons'
import { Contract } from '@api/useContractMeasure/types'
import { Texto } from '@gravitate-js/excalibrr'
import React from 'react'

export const getContractMeasureColumnDefs = (contract: Contract) => {
  const staticColumns = [
    {
      headerName: 'Detail Info',
      children: [
        {
          headerName: 'Terminal',
          field: 'terminal',
        },
        {
          headerName: 'Product',
          field: 'product',
        },
      ],
    },
  ]

  const firstDetailDeltas = contract?.deltas?.details?.[0].deltas
  let dynamicColumns = []

  if (firstDetailDeltas) {
    dynamicColumns = firstDetailDeltas.map((delta, index) => ({
      headerName: delta.name,
      field: `deltas.${index}.value`,
      cellRenderer: ({ value }) => (
        <Texto style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          {value < 0 ? <CaretDownOutlined /> : <CaretUpOutlined />}
          {fmt.currency(value)}
        </Texto>
      ),
    }))
  }

  return [
    ...staticColumns,
    {
      headerName: 'Average Delta',
      children: dynamicColumns,
    },
  ]
}
