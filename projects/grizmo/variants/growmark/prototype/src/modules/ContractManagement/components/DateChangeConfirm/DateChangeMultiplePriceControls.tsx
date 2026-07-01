import { addCommasToNumber, Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'
import { InputNumber, Radio } from 'antd'
import React from 'react'

interface DateChangeMultiplePriceControlsProps {
  setUseStartOverride: React.Dispatch<React.SetStateAction<boolean>>
  setUseEndOverride: React.Dispatch<React.SetStateAction<boolean>>
  startValue: number
  endValue: number
  setStartValue: React.Dispatch<React.SetStateAction<number>>
  setEndValue: React.Dispatch<React.SetStateAction<number>>
  useStartOverride: boolean
  useEndOverride: boolean
  dateDiffs: number[]
  startMinValue?: number
  startMaxValue?: number
  endMinValue?: number
  endMaxValue?: number
}

export function DateChangeMultiplePriceControls({
  setUseStartOverride,
  setUseEndOverride,
  startValue,
  endValue,
  setStartValue,
  setEndValue,
  useStartOverride,
  useEndOverride,
  dateDiffs,
  startMinValue,
  startMaxValue,
  endMinValue,
  endMaxValue,
}: DateChangeMultiplePriceControlsProps) {
  return (
    <Horizontal verticalCenter className='mb-2'>
      <Vertical verticalCenter flex={1}>
        <Texto className='mb-1'>Start Adjustment:</Texto>
        <Radio.Group onChange={(e) => setUseStartOverride(e.target.value)} value={useStartOverride}>
          <Vertical verticalCenter>
            <Radio value={false} className='mr-1 mb-1'>
              <Texto>Auto: {addCommasToNumber(dateDiffs[0])} days</Texto>
            </Radio>
            <Radio value className='mr-1'>
              Custom:
              <InputNumber
                className='ml-2'
                value={startValue}
                onChange={(v) => setStartValue(v)}
                size='small'
                min={startMinValue}
                max={startMaxValue}
              />
            </Radio>
          </Vertical>
        </Radio.Group>
      </Vertical>

      <Vertical verticalCenter flex={1}>
        <Texto className='mb-1'>End Adjustment:</Texto>
        <Radio.Group onChange={(e) => setUseEndOverride(e.target.value)} value={useEndOverride}>
          <Vertical verticalCenter className='p-1'>
            <Radio value={false} className='mr-1 mb-1'>
              Auto: {addCommasToNumber(dateDiffs[1])} days
            </Radio>

            <Radio value className='mr-1'>
              Custom:
              <InputNumber
                className='ml-2'
                value={endValue}
                onChange={(v) => setEndValue(v)}
                size='small'
                min={endMinValue}
                max={endMaxValue}
              />
            </Radio>
          </Vertical>
        </Radio.Group>
      </Vertical>
    </Horizontal>
  )
}
