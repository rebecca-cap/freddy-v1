import { StockOutlined } from '@ant-design/icons'
import { Contract } from '@api/useContractMeasure/types'
import { Horizontal, Texto } from '@gravitate-js/excalibrr'
import React, { useMemo } from 'react'

interface IProps {
  count: Contract['price_comparison']['over_count']
  average: Contract['price_comparison']['over_average']
}

export const MeasureAverageStatistic: React.FC<IProps> = ({ count, average }) => {
  const isAveragePositive = useMemo(() => average > 0, [average])
  const perfColor = useMemo(() => (isAveragePositive ? 'secondary' : 'error'), [isAveragePositive])

  return (
    <Horizontal alignItems='center' style={{ gap: '1rem' }}>
      <Texto category='h4' weight='bolder' appearance={perfColor}>
        <StockOutlined />
      </Texto>
      <Texto category='h4'>224 Days</Texto>
      <Texto appearance={perfColor} weight='bolder' className='mt-1'>
        ({isAveragePositive ? '+' : ''}
        {average})
      </Texto>
    </Horizontal>
  )
}
