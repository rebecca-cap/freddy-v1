import { addCommasToNumber, Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'
import React from 'react'

interface QuickMetricProps {
  icon: React.ElementType
  label: string
  value?: number
  format: 'volume' | 'price'
}

const formatValue = (value: number, format: 'volume' | 'price') => {
  if (format === 'volume') {
    return addCommasToNumber(value, 0)
  }
  if (format === 'price' && value) {
    return fmt.marginDecimal(value)
  }
  return value
}

function QuickMetric({ icon: Icon, label, value, format }: QuickMetricProps) {
  return (
    <Horizontal
      verticalCenter
      style={{ background: 'var(--gray-100)', borderRadius: 3, gap: '1rem' }}
      className='bordered p-2'
    >
      <Icon style={{ fontSize: '1.5rem', color: 'var(--theme-color-2)' }} />
      <Vertical>
        <Texto appearance='medium'>{label}</Texto>
        <Texto weight='bold'>{value ? formatValue(value, format) : ''}</Texto>
      </Vertical>
    </Horizontal>
  )
}

export { QuickMetric }
