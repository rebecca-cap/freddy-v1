import { DollarCircleFilled } from '@ant-design/icons'
import { useContractMeasure } from '@api/useContractMeasure'
import { seedBreakdownResponse } from '@api/useContractMeasure/seed'
import { MeasurementBreakdownResponse } from '@api/useContractMeasure/types'
import { Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'
import { Select, Skeleton } from 'antd'
import React from 'react'
import { Area, Bar, ComposedChart, ReferenceLine, ResponsiveContainer, YAxis } from 'recharts'
import { MeasureAverageStatistic } from './components/AverageStat'
import { ContractMeasurementGrid } from './components/ContractMeasurementGrid'
import { MeasurementBreakdownGrid } from './components/MeasurementBreakdownGrid'
import { useLocation } from 'react-router-dom'

const gradientOffset = (data: MeasurementBreakdownResponse['contract_performance']['graph_data']) => {
  const dataMax = Math.max(...data.map((i) => i.price_delta))
  const dataMin = Math.min(...data.map((i) => i.price_delta))

  if (dataMax <= 0) {
    return 0
  }
  if (dataMin >= 0) {
    return 1
  }

  return dataMax / (dataMax - dataMin)
}

function ReferenceLabel({ fill, value, fontSize, viewBox, dy, dx }) {
  const y = viewBox.y + 3
  const charWidth = 6
  return (
    <g>
      <rect
        x={43}
        // x={`calc(15% - ${(value?.length * charWidth) / 2}px`}
        y={y - 13}
        width={value?.length * charWidth}
        height='20'
        fill='var(--theme-optimal)'
      />
      <text
        x={68}
        // x='15%'
        y={y}
        dy={dy}
        dx={dx}
        fill={'white'}
        fontSize={fontSize || 10}
        fontWeight='bold'
        textAnchor='middle'
      >
        {value}
      </text>
    </g>
  )
}

export const ContractMeasurementPage: React.FC = () => {
  const { state } = useLocation()
  const contractId = state?.ContractId
  const { useContractQuery, useComparisonContractMetadata } = useContractMeasure()
  const { data, isLoading, isFetching } = useContractQuery('1')
  const {
    data: metadata,
    isLoading: isMetadataLoading,
    isFetching: isMetadataFetching,
  } = useComparisonContractMetadata()

  return (
    <Horizontal style={{ height: '100%', gap: '1rem' }} className='p-4'>
      <Vertical flex={0.6} style={{ gap: '1rem' }}>
        <div>
          <Horizontal
            className='px-5 py-4'
            justifyContent='space-between'
            alignItems='center'
            style={{ backgroundColor: 'var(--gray-100)' }}
          >
            <Texto category='h4'>Contract Measurement</Texto>
            <Horizontal alignItems='center' style={{ gap: '1rem' }}></Horizontal>
          </Horizontal>
          <Horizontal
            style={{ gap: '4rem', padding: '1rem' }}
            alignItems='center'
            justifyContent='flex-start'
            className='bg-success-dim'
          >
            {isLoading ? (
              <Skeleton active />
            ) : (
              <>
                <Texto category='h5' style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <DollarCircleFilled style={{ color: 'var(--theme-color-2)' }} />
                  <span> Sometimes Better (Under 224/365 days)</span>
                </Texto>
                <MeasureAverageStatistic
                  count={data?.price_comparison?.under_count}
                  average={data?.price_comparison?.under_average}
                />
                <MeasureAverageStatistic
                  count={data?.price_comparison?.over_count}
                  average={data?.price_comparison?.over_average}
                />
              </>
            )}
          </Horizontal>
        </div>
        <ContractMeasurementGrid contract={data} isLoading={isLoading || isFetching} />
        <ContractMeasurementGrid
          contract={data}
          isLoading={isLoading || isFetching}
          isComparison
          contractTitle='What If Contract'
        />
      </Vertical>
      <Vertical flex={0.4}>
        <Vertical className='bg-1 p-4' height={700}>
          <Horizontal
            height={50}
            justifyContent='flex-end'
            alignItems='center'
            style={{ gap: '1rem' }}
            className='mb-4'
          >
            <Texto>Viewing</Texto>
            <Select style={{ width: 160 }} size='large' defaultValue='monthly'>
              <Select.Option value='weekly'>Weekly</Select.Option>
              <Select.Option value='monthly'>Monthly</Select.Option>
              <Select.Option value='yearly'>Yearly</Select.Option>
            </Select>
          </Horizontal>
          <ResponsiveContainer width='100%' height='100%'>
            <ComposedChart
              width={500}
              height={400}
              data={seedBreakdownResponse.contract_performance.graph_data}
              margin={{
                top: 20,
                right: 30,
                left: 30,
              }}
            >
              <defs>
                <linearGradient id='splitColor' x1='0' y1='0' x2='0' y2='1'>
                  <stop
                    offset={gradientOffset(seedBreakdownResponse.contract_performance.graph_data)}
                    stopColor='var(--theme-success)'
                    stopOpacity={0.3}
                    strokeOpacity={0}
                  />
                  <stop
                    offset={gradientOffset(seedBreakdownResponse.contract_performance.graph_data)}
                    stopColor='var(--theme-error)'
                    strokeOpacity={0}
                    stopOpacity={0.3}
                  />
                </linearGradient>
              </defs>
              <YAxis
                yAxisId={0}
                orientation='right'
                label={{ value: 'Delta To Benchmark', angle: -90 }}
                dataKey='price_delta'
              />
              <YAxis yAxisId={1} label={{ value: 'Volume', angle: -90, position: 'insideLeft' }} dataKey='volume' />
              {/* <Area dataKey='price_delta' /> */}
              <Area type='monotone' dataKey='price_delta' fill='url(#splitColor)' yAxisId={0} strokeWidth={0} />
              <Bar dataKey='volume' fill='var(--theme-color-1-trans)' barSize={12} yAxisId={1} />
              <ReferenceLine
                y={seedBreakdownResponse.contract_performance.ratable_volume}
                stroke='var(--theme-optimal)'
                strokeWidth={3}
                yAxisId={1}
                label={<ReferenceLabel value='Rateable' fill='var(--theme-optimal)' viewBox={{ y: 0 }} />}
                // label='Rateable'
              />
            </ComposedChart>
          </ResponsiveContainer>
        </Vertical>
        <MeasurementBreakdownGrid />
      </Vertical>
    </Horizontal>
  )
}
