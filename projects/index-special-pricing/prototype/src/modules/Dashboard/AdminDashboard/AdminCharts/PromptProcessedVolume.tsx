import { LoadingOutlined } from '@ant-design/icons'
import { useAdminDashboard } from '@api/useAdminDashboard'
import { Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'
import { numberToShortString } from '@utils/index'
import { Select } from 'antd'
import React, { useMemo } from 'react'
import { Bar, BarChart, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

export function PromptProcessedVolume({ strokeColor, chartFilters, onFiltersChange, selectOptions }) {
  const { useProcessedPromptVolumeQuery } = useAdminDashboard()

  const { data: processedPromptVolumeData, isFetching } = useProcessedPromptVolumeQuery(
    chartFilters?.ProcessedPromptVolume?.FromDate,
    chartFilters?.ProcessedPromptVolume?.ToDate
  )

  const chartData = useMemo(() => {
    return processedPromptVolumeData?.VolumesByProduct?.map((product, index) => {
      return { name: product?.Key, amount: product?.Value, label: numberToShortString(product.Value) }
    })
  }, [processedPromptVolumeData])

  if (isFetching) {
    return (
      <Horizontal className='bg-1 admin-chart-card' verticalCenter horizontalCenter style={{ height: '15rem' }}>
        <Texto category='h3'>
          <LoadingOutlined />
        </Texto>
      </Horizontal>
    )
  }
  return (
    <Horizontal className='bg-1 admin-chart-card' verticalCenter horizontalCenter style={{ height: '13rem' }}>
      <Vertical>
        <Horizontal
          className='justify-sa bg-2 p-4'
          verticalCenter
          style={{ borderBottom: '1px solid var(--gray-300)' }}
        >
          <Texto style={{ fontSize: '.8rem', fontWeight: 600, width: '100%' }}>Prompt Processed Volume</Texto>
          <Select
            onChange={(selectedValue) => onFiltersChange('ProcessedPromptVolume', selectedValue)}
            defaultValue={chartFilters?.ProcessedPromptVolume?.option}
            style={{
              width: '50%',
              textAlign: 'right',
              fontSize: '.8rem',
              paddingRight: 10,
            }}
            className='custom-select'
            bordered={false}
            options={selectOptions}
          />
        </Horizontal>
        {!!chartData?.length && (
          <>
            <Horizontal className='justify-sb p-4 ml-4' verticalCenter height={20}>
              <Texto weight={600}>PRODUCT GROUP</Texto>
              <Texto weight={600}>PROCESSED</Texto>
            </Horizontal>
            <ResponsiveContainer>
              <BarChart
                layout='vertical'
                data={chartData}
                margin={{
                  top: 0,
                  left: 120,
                  right: 20,
                  bottom: 20,
                }}
              >
                <XAxis type='number' domain={['auto', 'auto']} hide />
                <YAxis
                  dataKey='name'
                  type='category'
                  fontSize='.7rem'
                  tickLine={false}
                  tickMargin={40}
                  minTickGap={1}
                  axisLine={false}
                  domain={['auto', 'auto']}
                  style={{ fontSize: 12 }}
                />
                <Tooltip formatter={(value) => [fmt.decimal(value, 0), 'Quantity']} />
                <Bar dataKey='amount' barSize={12} fill={strokeColor} maxBarSize={12}>
                  <LabelList dataKey='label' position='left' style={{ fontWeight: 600, fontSize: 13, fill: 'black' }} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </>
        )}
        {!chartData?.length && (
          <Horizontal className='bg-3 m-4' fullHeight horizontalCenter verticalCenter>
            <Texto
              className='px-2'
              style={{ textAlign: 'center', fontSize: '.7rem' }}
            >{`There was no data found for ${chartFilters?.ProcessedPromptVolume?.label?.toLowerCase()}`}</Texto>
          </Horizontal>
        )}
      </Vertical>
    </Horizontal>
  )
}
