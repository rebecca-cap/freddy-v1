import { GridControlBar, Vertical } from '@gravitate-js/excalibrr'
import { useLocalStorage } from '@gravitate-js/excalibrr'
import { usePricePerformanceByContract } from '@modules/Analytics/PricePerformance/ByContract/api/useByContract'
import { PricePerformanceByContractGrid } from '@modules/Analytics/PricePerformance/ByContract/components/PricePerformanceByContractGrid'
import { Comparison } from '@modules/Analytics/PricePerformance/components/Comparison/Comparison'
import { PageControls } from '@modules/Analytics/PricePerformance/components/Grid/PageControls'
import { chartColors, getMax, mergeRows } from '@modules/Analytics/PricePerformance/components/helpers'
import { generateShades } from '@utils/index'
import moment from 'moment/moment'
import React, { useCallback, useMemo, useRef, useState } from 'react'
import {
  ByContractGridRow,
  ContractWithPriceLocationGridRow,
} from 'src/modules/Analytics/PricePerformance/ByContract/api/types'

type SelectedRowType = ByContractGridRow | ContractWithPriceLocationGridRow

export function ByContract() {
  const gridAPIRef = useRef(null)
  const [selectedRows, setSelectedRows] = useState<SelectedRowType[]>([])
  const defaultDates = [moment().subtract(30, 'day').startOf('day'), moment().endOf('day')]
  const [selectedMetricType, setSelectedMetricType] = useState('Profit')
  const [showChart, setShowChart] = useState(false)
  const { lightGreenArea } = chartColors
  const shades = useMemo(() => generateShades(lightGreenArea, true), []) // 10 colors

  const { value: dateFilter, setValue: setDateFilter } = useLocalStorage(
    'AnalyticsPricePerformanceByContractDateFilter',
    defaultDates
  )

  const { useByContractQuery } = usePricePerformanceByContract()
  const { data, isLoading, isFetching } = useByContractQuery(dateFilter[0], dateFilter[1])

  const getKeys = useCallback(
    (row) => {
      if (row?.Location) {
        return `${row.Product} @${row.Location} (${row.TradeEntryId})`
      }
      return `${row.TradeEntryId}`
    },
    [data?.GridRows]
  )
  const rowCount = useMemo(() => {
    if (selectedRows?.length) {
      return `${selectedRows.length}/5 Selected | ${data?.ContractPricePerformanceWithPriceLocation?.GridRows?.length}`
    }
    return data?.ContractPricePerformanceWithPriceLocation?.GridRows?.length
  }, [data?.ContractPricePerformanceWithPriceLocation?.GridRows?.length, selectedRows?.length])

  const barData = useMemo(() => {
    if (!selectedRows?.length || !data?.GraphRows || !shades?.length) return []
    // get corresponding graph rows for selected grid rows
    const selectedGraphItems = selectedRows.flatMap((item) => {
      if ('LocationId' in item && item?.LocationId) {
        const { LocationId, ProductId, TradeEntryId } = item
        return data?.ContractPricePerformanceWithPriceLocation.GraphRows.find(
          (row) => row.LocationId === LocationId && row.ProductId === ProductId && row.TradeEntryId === TradeEntryId
        )
      }
      return data?.GraphRows.find((row) => row.TradeEntryId === item.TradeEntryId)
    })
    const formatRow = (row, index) => {
      const name = getKeys(row)
      return {
        Date: row.Date,
        comparisonValue: row.SystemAverageMetrics?.[selectedMetricType],
        [name]: row.CellMetrics?.[selectedMetricType],
        [`${name}Color`]: shades[index],
      }
    }

    const filteredGraphData = selectedGraphItems.map(formatRow).reduce(mergeRows, [])

    const max = getMax(selectedGraphItems, selectedMetricType)

    return { filteredGraphData, max }
  }, [selectedRows, selectedMetricType, shades, data])

  return (
    <Vertical className='full-height-width'>
      <GridControlBar
        onSearch={(e) => gridAPIRef?.current?.setQuickFilter(e.target.value)}
        gridRef={gridAPIRef}
        title='By Contract'
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
      <div className='flex-1 mb-2'>
        <PricePerformanceByContractGrid
          gridAPIRef={gridAPIRef}
          isLoading={isLoading || isFetching}
          data={data}
          selectedRows={selectedRows}
          setSelectedRows={setSelectedRows}
        />
      </div>
    </Vertical>
  )
}
