import { GridControlBar, Vertical } from '@gravitate-js/excalibrr'
import { useLocalStorage } from '@gravitate-js/excalibrr'
import { ByChannelCustomerGridRow, ByChannelGridRow } from '@modules/Analytics/PricePerformance/ByChannel/api/types'
import { usePricePerformanceByChannel } from '@modules/Analytics/PricePerformance/ByChannel/api/useByChannel'
import moment from 'moment'
import React, { useCallback, useMemo, useRef, useState } from 'react'

import { Comparison } from '../components/Comparison/Comparison'
import { PageControls } from '../components/Grid/PageControls'
import { addColorToRows, mergeRows } from '../components/helpers'
import { PricePerformanceByChannelGrid } from './components/PricePerformanceByChannelGrid'

type SelectedRowType = ByChannelGridRow | ByChannelCustomerGridRow

export function ByChannel() {
  const gridAPIRef = useRef(null)
  const [selectedRows, setSelectedRows] = useState<SelectedRowType[]>([])
  const defaultDates = [moment().subtract(30, 'day').startOf('day'), moment().endOf('day')]
  const [selectedMetricType, setSelectedMetricType] = useState('Profit')
  const [showChart, setShowChart] = useState(false)

  const { value: dateFilter, setValue: setDateFilter } = useLocalStorage(
    'AnalyticsPricePerformanceByChannelDateFilter',
    defaultDates
  )
  const { useByChannelQuery } = usePricePerformanceByChannel()
  const { data, isLoading } = useByChannelQuery(dateFilter[0], dateFilter[1])

  const barData = useMemo(() => {
    if (!selectedRows?.length || !data?.GraphRows) return []

    const getFilteredRows = (item) => {
      const { CounterPartyId, ChannelId } = item
      if (CounterPartyId) {
        return data.CustomerPricePerformanceWithChannel.GraphRows.filter(
          (row) => row.CounterPartyId === CounterPartyId && row.ChannelId === ChannelId
        )
      }
      return data.GraphRows.filter((row) => row.ChannelId === ChannelId)
    }

    const selectedGraphItems = selectedRows.flatMap(getFilteredRows)

    const formatRow = (row) => {
      const name = row.CounterParty ? `${row.CounterParty} @${row.Channel}` : row.Channel
      return {
        Date: row.Date,
        comparisonValue: row.SystemAverageMetrics?.[selectedMetricType],
        [name]: row.CellMetrics?.[selectedMetricType],
      }
    }

    const filteredGraphData = selectedGraphItems.map(formatRow).reduce(mergeRows, []).map(addColorToRows)

    const max = Math.max(
      ...selectedGraphItems.map((row) =>
        Math.max(row.CellMetrics?.[selectedMetricType], row.SystemAverageMetrics?.[selectedMetricType])
      )
    )

    return { filteredGraphData, max: max * 1.1 }
  }, [selectedRows, selectedMetricType, data])

  const getKeys = useCallback((row) => (row.CounterParty ? `${row.CounterParty} @${row.Channel}` : row.Channel), [])
  const rowCount = useMemo(() => {
    if (selectedRows?.length) {
      return `${selectedRows.length}/5 Selected | ${data?.CustomerPricePerformanceWithChannel?.GridRows?.length}`
    }
    return data?.CustomerPricePerformanceWithChannel?.GridRows?.length
  }, [data?.CustomerPricePerformanceWithChannel?.GridRows?.length, selectedRows?.length])

  return (
    <Vertical className='full-height-width'>
      <GridControlBar
        onSearch={(e) => gridAPIRef?.current?.setQuickFilter(e.target.value)}
        gridRef={gridAPIRef}
        title='By Channel'
        rowCount={rowCount}
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
        showSelectedCount
      />
      <div style={{ height: showChart ? '400px' : 0, transition: '0.5s ease' }} className='vertical-flex'>
        <Comparison
          barData={barData}
          selectedRows={selectedRows}
          selectedMetricType={selectedMetricType}
          setSelectedMetricType={setSelectedMetricType}
          getKeys={getKeys}
        />
      </div>
      <div className=' flex-1 mb-2'>
        <PricePerformanceByChannelGrid
          gridAPIRef={gridAPIRef}
          isLoading={isLoading}
          data={data}
          selectedRows={selectedRows}
          setSelectedRows={setSelectedRows}
        />
      </div>
    </Vertical>
  )
}
