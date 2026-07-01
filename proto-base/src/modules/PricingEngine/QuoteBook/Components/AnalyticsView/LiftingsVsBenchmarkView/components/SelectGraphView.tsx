import { BarChartOutlined, LineChartOutlined } from '@ant-design/icons'
import { GraphView } from '@modules/PricingEngine/QuoteBook/Components/AnalyticsView/LiftingsVsBenchmarkView/index'
import { Radio } from 'antd'
import React from 'react'

interface SelectViewProps {
  selectedView: GraphView | null
  onChange: (view: 'trend' | 'histogram') => void
}

const options = [
  { label: 'As Histogram', value: 'histogram', icon: <BarChartOutlined className='mx-2' /> },
  { label: 'As Trend', value: 'trend', icon: <LineChartOutlined className='mx-2' /> },
]

function SelectGraphView({ selectedView, onChange }: SelectViewProps) {
  return (
    <Radio.Group
      options={options.map((option) => ({
        label: (
          <span>
            {option.icon}
            {option.label}
          </span>
        ),
        value: option.value,
      }))}
      onChange={({ target: { value } }) => onChange(value)}
      value={selectedView}
      optionType='button'
      buttonStyle='solid'
      size='small'
    />
  )
}

export { SelectGraphView }
