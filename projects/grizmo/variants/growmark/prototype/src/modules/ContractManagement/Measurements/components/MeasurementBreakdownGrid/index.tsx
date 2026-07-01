import { useContractMeasure } from '@api/useContractMeasure'
import { GraviGrid } from '@gravitate-js/excalibrr'
import React from 'react'
import { seedBreakdownResponse, seedContracts } from '@api/useContractMeasure/seed'
import { getMeasurementBreakdownColumnDefs } from './columnDefs'

interface Props {}

function generateRandomDataArray(length) {
  const dataArray = []
  const currentDate = new Date()

  for (let i = 0; i < length; i++) {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth() - i
    const date = new Date(year, month, 1)

    const dataObject = {
      id: crypto.randomUUID(),
      date: date.toISOString(),
      contracted_volume: Math.floor(Math.random() * 10000),
      lifted_volume: Math.floor(Math.random() * 10000),
      savings: Math.floor(getRandomDelta() * 15000) + 1000,
      deltas: [
        { name: '', value: getRandomDelta() },
        { name: '', value: getRandomDelta() },
        { name: '', value: getRandomDelta() },
      ],
    }

    dataArray.push(dataObject)
  }

  return dataArray
}

function getRandomDelta() {
  // Generate a random number between -3 and 3 (inclusive) with two decimal places
  return (Math.random() * 6 - 3).toFixed(2)
}

export const MeasurementBreakdownGrid: React.FC<IProps> = ({ contract, isComparison }) => {
  return (
    <GraviGrid
      rowData={generateRandomDataArray(12)}
      loading={false}
      agPropOverrides={{
        rowGroupPanelShow: 'never',
        columnDefs: getMeasurementBreakdownColumnDefs(seedContracts[1]),
        getRowId: (row) => row.data.id,
      }}
    />
  )
}
