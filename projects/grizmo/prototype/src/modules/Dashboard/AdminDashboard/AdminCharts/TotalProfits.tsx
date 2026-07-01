import './styles.css'

import { LoadingOutlined } from '@ant-design/icons'
import { useAdminDashboard } from '@api/useAdminDashboard'
import { Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'
import { numberToShortString } from '@utils/index'
import { Select, Tooltip as AntdToolTip } from 'antd'
import React from 'react'
import { Area, AreaChart, ResponsiveContainer, Tooltip, YAxis } from 'recharts'

export function TotalProfits({ tooltipContent, strokeColor, fillColor, chartFilters, onFiltersChange, selectOptions }) {
  const { useProcessedProfitQuery } = useAdminDashboard()

  const { data: processedProfitData, isFetching } = useProcessedProfitQuery(
    chartFilters?.TotalProfits?.FromDate,
    chartFilters?.TotalProfits?.ToDate
  )

  const chartData = processedProfitData?.ProfitSparkPoints?.length
    ? processedProfitData?.ProfitSparkPoints?.map((point, index) => {
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
    <Horizontal className='bg-1 px-4 py-2' flex={1} verticalCenter horizontalCenter>
      <Vertical flex={1} verticalCenter>
        <Texto style={{ fontSize: '.7rem' }}>Total Profits (USD)</Texto>

        <AntdToolTip
          title={`$${fmt.decimal(processedProfitData?.TotalProfit, 0)}`}
          placement='bottomLeft'
          color={strokeColor}
          key={fillColor}
          overlayStyle={{ maxHeight: '15px', fontSize: '.8rem' }}
        >
          <span style={{ fontSize: '1.5rem', fontWeight: 600, width: 'auto' }}>
            {numberToShortString(processedProfitData?.TotalProfit, 0)}
          </span>
        </AntdToolTip>
      </Vertical>
      <Vertical
        flex={1}
        style={{
          height: '5rem',
        }}
      >
        <Select
          onChange={(selectedValue) => onFiltersChange('TotalProfits', selectedValue)}
          defaultValue={chartFilters?.TotalProfits?.option}
          style={{
            width: '100%',
            textAlign: 'right',
            fontSize: '.8rem',
            paddingRight: 10,
          }}
          bordered={false}
          className='custom-select'
          options={selectOptions}
        />
        {chartData && (
          <ResponsiveContainer width='100%'>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id='colorUv' x1='0' y1='0' x2='0' y2='1'>
                  <stop offset='1%' stopColor={strokeColor} stopOpacity={0.8} />
                  <stop offset='99%' stopColor={strokeColor} stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <YAxis domain={['auto', 'auto']} hide />
              <Tooltip content={tooltipContent} />
              <Area type='monotone' dataKey='uv' fillOpacity={1} fill='url(#colorUv)' stroke={strokeColor} />
            </AreaChart>
          </ResponsiveContainer>
        )}
        {!chartData && (
          <Horizontal className='bg-3 my-2' horizontalCenter verticalCenter height='3rem'>
            <Texto
              className='px-2'
              style={{ textAlign: 'center', fontSize: '.6rem' }}
            >{`There was no data found for ${chartFilters?.TotalProfits?.label?.toLowerCase()}`}</Texto>
          </Horizontal>
        )}
      </Vertical>
    </Horizontal>
  )
}
