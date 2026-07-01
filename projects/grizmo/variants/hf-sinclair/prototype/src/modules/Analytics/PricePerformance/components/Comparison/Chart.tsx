import { LineChartOutlined } from '@ant-design/icons'
import { Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'
import React from 'react'
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Label,
  Legend,
  ResponsiveContainer,
  Scatter,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import { chartColors } from '../helpers'

export function Chart({ barData, selectedRows, valueFormatter, selectedMetricType, getKeys }) {
  const { gold } = chartColors

  const renderTooltip = (props) => {
    const { payload, label } = props
    if (!payload?.length) return null
    const minWidth = Math.max(...payload.map((item) => item.dataKey.length)) * 8
    return (
      <Vertical className='bordered bg-1 p-2'>
        <Horizontal className='mb-2'>
          <Texto>{label}</Texto>
        </Horizontal>
        {payload?.map((item) => {
          const name = item.dataKey === 'comparisonValue' ? 'System Average' : item.dataKey
          return (
            <Horizontal verticalCenter key={name} className='mb-1'>
              <Horizontal flex={3} verticalCenter style={{ minWidth }}>
                {name === 'System Average' ? (
                  <LineChartOutlined className='mr-1' style={{ color: item.color, fontSize: '14px' }} />
                ) : (
                  <div
                    style={{
                      width: 15,
                      height: '15px',
                      backgroundColor: item.color,
                      borderRadius: '50%',
                      flexShrink: 0,
                    }}
                    className='mr-1'
                  />
                )}
                <Texto>{name}:</Texto>
              </Horizontal>
              <Vertical flex={1} alignItems='end' className='mr-2'>
                <Texto>{valueFormatter(item.value)}</Texto>
              </Vertical>
            </Horizontal>
          )
        })}
      </Vertical>
    )
  }
  const renderLegend = (props) => {
    const { payload } = props
    if (!payload?.length) return null
    return (
      <Horizontal className='bg-1 mb-4 px-2' verticalCenter horizontalCenter style={{ flexWrap: 'wrap' }}>
        {payload.map((entry) => {
          const name = entry.value === 'comparisonValue' ? 'System Average' : entry.value
          return (
            <Horizontal key={name} className='mr-4' verticalCenter horizontalCenter>
              {name === 'System Average' ? (
                <LineChartOutlined className='mr-1' style={{ color: entry.color, fontSize: '14px' }} />
              ) : (
                <div
                  style={{
                    width: 15,
                    height: 15,
                    backgroundColor: entry.color,
                    flexShrink: 0,
                    borderRadius: '50%',
                  }}
                  className='mr-1 bordered'
                />
              )}
              <Texto>{name}</Texto>
            </Horizontal>
          )
        })}
      </Horizontal>
    )
  }
  return (
    <ResponsiveContainer width='100%' height='100%' className='m-2'>
      <ComposedChart width={500} height={400} data={barData.filteredGraphData}>
        <CartesianGrid strokeDasharray='3 3' vertical={false} />
        <XAxis dataKey='Date' tickLine={false} />
        <YAxis tickFormatter={valueFormatter}>
          <Label
            value={selectedMetricType === 'AverageMargin' ? 'MARGIN' : selectedMetricType?.toUpperCase()}
            angle={-90}
            fill='var(--gray-400)'
            style={{ letterSpacing: '3px' }}
            dx={-25}
            dy={0}
          />
        </YAxis>
        <Tooltip content={renderTooltip} />
        <Legend content={renderLegend} verticalAlign='top' align='center' />
        {selectedRows.map((row, index) => {
          const key = getKeys(row)
          const nameColor = `${key}Color`

          const color = barData.filteredGraphData?.[0]?.[nameColor]
          return <Bar key={key} dataKey={key} fill={color} barSize={5} />
        })}
        <Scatter dataKey='comparisonValue' fill={gold} line />
      </ComposedChart>
    </ResponsiveContainer>
  )
}
