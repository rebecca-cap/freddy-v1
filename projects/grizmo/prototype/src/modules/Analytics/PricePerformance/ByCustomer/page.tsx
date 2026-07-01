import { GridControlBar, Vertical } from '@gravitate-js/excalibrr'
import { useLocalStorage } from '@gravitate-js/excalibrr'
import { ByCustomerGridRow } from '@modules/Analytics/PricePerformance/ByCustomer/api/types'
import { usePricePerformanceByCustomer } from '@modules/Analytics/PricePerformance/ByCustomer/api/useByCustomer'
import { generateShades } from '@utils/index'
import moment from 'moment'
import React, { useMemo, useRef, useState } from 'react'

import { Comparison } from '../components/Comparison/Comparison'
import { PageControls } from '../components/Grid/PageControls'
import { chartColors } from '../components/helpers'
import { PricePerformanceByCustomerGrid } from './PricePerformanceByCustomerGrid'

export function ByCustomer() {
  const gridAPIRef = useRef()
  const [selectedMetricType, setSelectedMetricType] = useState('Profit')
  const [selectedRows, setSelectedRows] = useState<ByCustomerGridRow[]>([])
  const [showChart, setShowChart] = useState(false)

  const defaultDates = [moment().subtract(30, 'day').startOf('day'), moment().endOf('day')]
  const { value: dateFilter, setValue: setDateFilter } = useLocalStorage(
    'AnalyticsPricePerformanceByCustomerDateFilter',
    defaultDates
  )
  const { useByCustomerQuery } = usePricePerformanceByCustomer()
  const { data, isLoading } = useByCustomerQuery(dateFilter[0], dateFilter[1])
  const { lightGreenArea } = chartColors
  const shades = useMemo(() => generateShades(lightGreenArea, true), []) // 10 colors

  const barData = useMemo(() => {
    if (!selectedRows?.length || !data?.GraphRows) return []

    const getFilteredRows = (item) => data.GraphRows.filter((row) => row.CounterPartyId === item.CounterPartyId)

    const mergeRows = (acc, row) => {
      const existingRow = acc.find((r) => r.Date === row.Date)
      if (existingRow) {
        return acc.map((r) => (r.Date === row.Date ? { ...r, ...row } : r))
      }
      return [...acc, row]
    }

    const formatGraphItems = (row) => {
      const shadeIndex = selectedRows.findIndex((r) => r.CounterPartyId === row.CounterPartyId)
      const nameColor = `${row.CounterParty}Color`

      return {
        [nameColor]: shades[shadeIndex],
        Date: row.Date,
        comparisonValue: row.SystemAverageMetrics?.[selectedMetricType],
        [row.CounterParty]: row.CellMetrics?.[selectedMetricType],
      }
    }

    const filteredGraphData = selectedRows.flatMap(getFilteredRows).map(formatGraphItems).reduce(mergeRows, [])

    const max = Math.max(
      ...selectedRows
        .flatMap(getFilteredRows)
        .map((row) => Math.max(row.CellMetrics?.[selectedMetricType], row.SystemAverageMetrics?.[selectedMetricType]))
    )

    return { filteredGraphData, max: max * 1.1 }
  }, [selectedRows, data?.GraphRows, shades, selectedMetricType])

  const rowCount = useMemo(
    () =>
      selectedRows?.length ? `${selectedRows.length}/5 Selected | ${data?.GridRows?.length}` : data?.GridRows?.length,
    [data?.GridRows?.length, selectedRows?.length]
  )
  return (
    <Vertical className='full-height-width'>
      <GridControlBar
        gridRef={gridAPIRef}
        rowCount={rowCount}
        onSearch={(e) => gridAPIRef?.current?.setQuickFilter(e.target.value)}
        title='By Customer'
        actionButtons={
          <PageControls
            selectedDates={dateFilter}
            setSelectedDates={setDateFilter}
            defaultDates={defaultDates}
            setShowChart={setShowChart}
            showChart={showChart}
            setSelectedRows={setSelectedRows}
            gridAPIRef={gridAPIRef}
          />
        }
      />
      <div style={{ height: showChart ? '400px' : 0, transition: '0.5s ease' }} className='vertical-flex'>
        <Comparison
          barData={barData}
          selectedRows={selectedRows}
          selectedMetricType={selectedMetricType}
          setSelectedMetricType={setSelectedMetricType}
          getKeys={(row) => row.CounterParty}
        />
      </div>
      <div className='flex-1 mb-2'>
        <PricePerformanceByCustomerGrid
          gridAPIRef={gridAPIRef}
          isLoading={isLoading}
          data={data}
          setSelectedRows={setSelectedRows}
          selectedRows={selectedRows}
        />
      </div>
    </Vertical>
  )
}
