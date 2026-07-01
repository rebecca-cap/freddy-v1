import { BarChartOutlined } from '@ant-design/icons'
import { GraviButton, Horizontal, RangePicker } from '@gravitate-js/excalibrr'
import { Switch, Tooltip } from 'antd'
import moment from 'moment'
import React from 'react'

export function PageControls({
  selectedDates,
  setSelectedDates,
  defaultDates,
  showChart,
  setShowChart,
  setSelectedRows,
  gridAPIRef,
}) {
  const setFilterDates = (values) => {
    setSelectedDates(values)
  }

  return (
    <Horizontal verticalCenter>
      <Tooltip title={showChart ? 'Hide Chart' : 'Show chart'}>
        <Switch
          checked={showChart}
          onClick={(value) => setShowChart(value)}
          checkedChildren={<BarChartOutlined />}
          unCheckedChildren={<BarChartOutlined />}
          className='mr-4'
        />
      </Tooltip>
      <GraviButton
        onClick={() => {
          setSelectedRows([])
          gridAPIRef.current.deselectAll()
        }}
        buttonText='Clear Selection'
        className='mr-4 '
      />
      <RangePicker
        inputKey='dates'
        onChange={(dates) => setFilterDates(() => dates.map((d) => moment(d)))}
        dates={selectedDates?.map((d) => moment(d)) || defaultDates}
      />
    </Horizontal>
  )
}
