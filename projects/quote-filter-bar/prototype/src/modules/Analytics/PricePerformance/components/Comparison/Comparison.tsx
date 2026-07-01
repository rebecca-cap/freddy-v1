import { Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'
import { numberToShortString } from '@utils/index'
import { Select } from 'antd'
import React, { useMemo } from 'react'

import { MessageAskingUserToSelectARow, NoData } from '../Messages'
import { Chart } from './Chart'
import { ComparisonGrid } from './ComparisonGrid'
import { ComparisonGridHeader } from './ComparisonGridHeader'

export function Comparison({ selectedRows, barData, selectedMetricType, setSelectedMetricType, getKeys }) {
  const baseLineOptions = [{ value: 'systemAverage', label: 'System Average' }]
  const metricOptions = useMemo(
    () => [
      { value: 'Profit', label: 'Profit' },
      { value: 'Liftings', label: 'Liftings' },
      { value: 'AverageMargin', label: 'Margin' },
    ],
    []
  )
  const valueFormatter = (value) => {
    switch (selectedMetricType) {
      case 'Profit':
      case 'Liftings':
        return numberToShortString(value)
      case 'AverageMargin':
        return fmt.marginDecimal(value)
      default:
        return value
    }
  }

  if (!selectedRows?.length) return <MessageAskingUserToSelectARow />
  if (!barData) return <NoData />

  return (
    <Vertical className='bg-1 bordered round-corners'>
      <Horizontal>
        <Vertical style={{ minWidth: '500px' }}>
          <div className='border-right'>
            <MetricSelect
              setSelectedMetricType={setSelectedMetricType}
              selectedMetricType={selectedMetricType}
              metricOptions={metricOptions}
              baseLineOptions={baseLineOptions}
            />
            <ComparisonGridHeader selectedMetricType={selectedMetricType} />
            <div style={{ overflowY: 'scroll', height: '310px' }}>
              {barData?.filteredGraphData?.map((row) => {
                const items = Object.entries(row)
                  .filter(
                    ([key]) => !key.includes('Date') && !key.includes('comparisonValue') && !key.includes('Color')
                  )
                  .map(([key, value]) => ({ key, value }))
                // maintain correct order
                const orderedItems = selectedRows.map((row) => items.find((item) => item.key === getKeys(row)))
                return (
                  <ComparisonGrid
                    key={`${items[0]?.key} - ${row?.Date}`}
                    row={row}
                    valueFormatter={valueFormatter}
                    items={orderedItems}
                  />
                )
              })}
            </div>
          </div>
        </Vertical>
        <Vertical className='p-3'>
          <Chart
            selectedRows={selectedRows}
            selectedMetricType={selectedMetricType}
            barData={barData}
            valueFormatter={valueFormatter}
            getKeys={getKeys}
          />
        </Vertical>
      </Horizontal>
    </Vertical>
  )
}

function MetricSelect({
  selectedMetricType,
  setSelectedMetricType,

  metricOptions,
  baseLineOptions,
}) {
  return (
    <div className='flex border-bottom p-3'>
      <div className='flex flex-1 pr-3 items-center'>
        <Texto category='label' appearance='medium' weight='bold' className='mr-4'>
          Metric
        </Texto>
        <div className='flex-1 pr-3'>
          <Select
            style={{ width: '100%' }}
            onChange={(value) => setSelectedMetricType(value)}
            value={selectedMetricType}
            options={metricOptions}
            defaultValue='Profit'
          />
        </div>
        <div className='flex flex-1 pr-3 items-center'>
          <Texto category='label' appearance='medium' weight='bold' className='mr-4'>
            Baseline
          </Texto>
          <Select style={{ width: '100%' }} value='systemAverage' options={baseLineOptions} />
        </div>
      </div>
    </div>
  )
}
