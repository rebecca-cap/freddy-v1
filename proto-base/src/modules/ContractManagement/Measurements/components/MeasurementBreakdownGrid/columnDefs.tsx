import { CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons'
import { Contract } from '@api/useContractMeasure/types'
import { Texto } from '@gravitate-js/excalibrr'
import React from 'react'

export const getMeasurementBreakdownColumnDefs = (contract: Contract) => {
  const staticDefs = [
    {
      headerName: 'Month',
      field: 'date',
      valueFormatter: ({ value }) => new Date(value).toLocaleDateString(),
    },
    {
      headerName: 'Contracted',
      field: 'contracted_volume',
    },
    {
      headerName: 'Lifted',
      field: 'lifted_volume',
    },
    {
      headerName: 'Comparison Savings',
      field: 'savings',
      cellStyle: { textAlign: 'right' },
      valueFormatter: ({ value }) => {
        const isLoss = value < 0
        const formattedValue = fmt.currency(Math.abs(value))
        return isLoss ? `-(${formattedValue})` : formattedValue
      },
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

  return [...staticDefs, ...dynamicColumns]
}
