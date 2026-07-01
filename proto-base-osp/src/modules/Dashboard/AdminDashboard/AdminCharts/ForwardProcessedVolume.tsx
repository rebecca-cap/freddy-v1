import { LoadingOutlined } from '@ant-design/icons'
import { useAdminDashboard } from '@api/useAdminDashboard'
import { Horizontal, NothingMessage, Texto, Vertical } from '@gravitate-js/excalibrr'
import { numberToShortString } from '@utils/index'
import { Select } from 'antd'
import React, { useMemo, useState } from 'react'
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

export function ForwardProcessedVolume({ strokeColor, chartFilters, onFiltersChange, selectOptions }) {
  const { useProcessedForwardVolumeQuery } = useAdminDashboard()

  const { data: processedForwardVolumeData, isFetching } = useProcessedForwardVolumeQuery(
    chartFilters?.ProcessedForwardVolume?.FromDate,
    chartFilters?.ProcessedForwardVolume?.ToDate
  )

  const [productList, setProductList] = useState([])

  const chartData = useMemo(() => {
    return processedForwardVolumeData?.VolumesByMonthByProductGroup?.map((product, index) => {
      const productObjects = {}
      product.VolumesByProduct.forEach((item) => {
        productObjects[item.Key] = item.Value
      })

      setProductList(
        Object.entries(productObjects).map(([key, value]) => ({
          product: key,
          value,
        }))
      )
      return { name: product?.Month, ...productObjects }
    })
  }, [processedForwardVolumeData])

  const calcHeight: string | number = useMemo(() => {
    return 23 * (chartData?.length < 6 ? 12 : chartData?.length)
  }, [chartData])

  if (isFetching) {
    return (
      <Horizontal className='bg-1 admin-chart-card' verticalCenter horizontalCenter flex={1}>
        <Texto category='h3'>
          <LoadingOutlined />
        </Texto>
      </Horizontal>
    )
  }

  return (
    <Horizontal className='bg-1 admin-chart-card' flex={1}>
      <Vertical>
        <Horizontal
          className='justify-sb bg-2 p-4'
          verticalCenter
          style={{ borderBottom: '1px solid var(--gray-300)' }}
        >
          <Texto style={{ fontSize: '.8rem', fontWeight: 600, width: '100%' }}>Forward Processed Volume</Texto>
          <Select
            onChange={(selectedValue) => onFiltersChange('ProcessedForwardVolume', selectedValue)}
            defaultValue={chartFilters?.ProcessedForwardVolume?.option}
            size='small'
            placement='topRight'
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
            <Horizontal className='justify-sb p-4 ml-1 mr-4' verticalCenter height={20}>
              <Texto weight={600}>DELIVERY PERIOD</Texto>
              <Texto weight={600}>PROCESSED</Texto>
            </Horizontal>
            <Horizontal fullHeight horizontalCenter verticalCenter flex={1}>
              <ResponsiveContainer>
                <BarChart
                  layout='vertical'
                  data={chartData}
                  margin={{
                    top: 10,
                    left: 20,
                    right: 30,
                    bottom: 20,
                  }}
                >
                  <XAxis type='number' domain={[0, 'auto']} tickFormatter={(value) => numberToShortString(value)} />
                  <YAxis
                    dataKey='name'
                    type='category'
                    fontSize='.7rem'
                    tickLine={false}
                    tickMargin={20}
                    minTickGap={1}
                    axisLine={false}
                    domain={['auto', 'auto']}
                    style={{ fontSize: { calcHeight } }}
                  />
                  <CartesianGrid strokeWidth={0.5} strokeDasharray='3 3' />
                  <Tooltip formatter={(value) => fmt.decimal(value, 0)} />
                  <Legend
                    verticalAlign='top'
                    wrapperStyle={{
                      lineHeight: '10px',
                      paddingBottom: 10,
                      width: '100%',
                    }}
                  />
                  {productList.map((product) => {
                    return (
                      <Bar
                        dataKey={`${product.product}`}
                        barSize={4}
                        fill={strokeColor}
                        maxBarSize={4}
                        key={product?.value}
                      />
                    )
                  })}
                </BarChart>
              </ResponsiveContainer>
            </Horizontal>
          </>
        )}
        {!chartData?.length && (
          <Horizontal className='bg-3 m-4 p-4' fullHeight horizontalCenter verticalCenter flex={1}>
            <NothingMessage
              title='No data found'
              message={`There was no data found for ${chartFilters?.ProcessedForwardVolume?.label?.toLowerCase()}`}
            />
          </Horizontal>
        )}
      </Vertical>
    </Horizontal>
  )
}
