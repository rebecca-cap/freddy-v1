import './styles.css'

import { LoadingOutlined } from '@ant-design/icons'
import { useAdminDashboard } from '@api/useAdminDashboard'
import { Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'
import { numberToShortString } from '@utils/index'
import { Tooltip as AntdToolTip, Select } from 'antd'
import React from 'react'
import { Area, AreaChart, ResponsiveContainer, Tooltip, YAxis } from 'recharts'

export function ProcessedVolume({
  tooltipContent,
  strokeColor,
  fillColor,
  chartFilters,
  onFiltersChange,
  selectOptions,
}) {
  const { useProcessedVolumeQuery } = useAdminDashboard()
  const { data: processedVolumeData, isFetching } = useProcessedVolumeQuery(
    chartFilters?.ProcessedVolume?.FromDate,
    chartFilters?.ProcessedVolume?.ToDate
  )

  const chartData = processedVolumeData?.QuantitySparkPoints?.length
    ? processedVolumeData?.QuantitySparkPoints?.map((point, index) => {
        return { name: index.toString(), uv: point }
      })
    : null

  if (isFetching) {
    return (
      <Horizontal className='bg-1 p-4' flex={1} verticalCenter horizontalCenter>
        <Texto category='h1'>
          <LoadingOutlined />
        </Texto>
      </Horizontal>
    )
  }

  return (
    <Horizontal className='bg-1 px-4 py-2 admin-chart-card' verticalCenter horizontalCenter>
      <Vertical flex={1} verticalCenter>
        <Texto style={{ fontSize: '.7rem' }}>Processed Volume</Texto>
        <AntdToolTip
          title={fmt.decimal(processedVolumeData?.TotalQuantity, 0)}
          placement='bottomLeft'
          color={strokeColor}
          key={fillColor}
          overlayStyle={{ maxHeight: '15px', fontSize: '.8rem' }}
        >
          <span style={{ fontSize: '1.5rem', fontWeight: 600, width: 'auto' }}>
            {numberToShortString(processedVolumeData?.TotalQuantity)}
          </span>
        </AntdToolTip>
      </Vertical>
      <Vertical
        flex={1}
        style={{
          height: '5rem',
          justifyContent: 'space-between',
        }}
      >
        <Select
          onChange={(selectedValue) => onFiltersChange('ProcessedVolume', selectedValue)}
          defaultValue={chartFilters?.ProcessedVolume?.option}
          style={{
            width: '100%',
            textAlign: 'right',
            fontSize: '.8rem',
            paddingRight: 10,
          }}
          className='custom-select'
          bordered={false}
          options={selectOptions}
        />
        {chartData && (
          <ResponsiveContainer>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id='colorUv' x1='0' y1='0' x2='0' y2='1'>
                  <stop offset='1%' stopColor={strokeColor} stopOpacity={0.8} />
                  <stop offset='99%' stopColor={strokeColor} stopOpacity={0} />
                </linearGradient>
              </defs>
              <YAxis domain={['auto', 'auto']} hide />
              <Tooltip content={tooltipContent} />
              <Area type='monotone' dataKey='uv' fillOpacity={1} fill='url(#colorUv)' stroke={strokeColor} />
            </AreaChart>
          </ResponsiveContainer>
        )}
        {!chartData && (
          <Horizontal className='bg-3 my-2' fullHeight horizontalCenter verticalCenter height='3rem'>
            <Texto
              className='px-2'
              style={{ textAlign: 'center', fontSize: '.6rem' }}
            >{`There was no data found for ${chartFilters?.ProcessedVolume?.label?.toLowerCase()}`}</Texto>
          </Horizontal>
        )}
      </Vertical>
    </Horizontal>
  )
}
