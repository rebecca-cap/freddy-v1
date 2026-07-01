import { addCommasToNumber, Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'
import { volumeInputList } from '@modules/Dashboard/SpecialOffers/utils/Constants/FormConstants'
import { Form, InputNumber } from 'antd'
import { useMemo } from 'react'

export function ConfigureVolume({ form }) {
  const totalVolume = Form.useWatch('TotalVolume', form)
  const minVolume = Form.useWatch('MinimumVolumePerOrder', form)
  const maxVolume = Form.useWatch('MaximumVolumePerOrder', form)
  const increment = Form.useWatch('VolumeIncrement', form)
  const defaultInputProps = {
    formatter: (value) => {
      return parseFloat(value) ? addCommasToNumber(parseFloat(value)) : value
    },
    parser: (value) => {
      return value?.replace(/(,*)/g, '')
    },
    style: { width: '100%' },
    className: 'border-radius-5',
  }
  const warnings = useMemo(() => {
    const errors: { text: string }[] = []
    if (!totalVolume) return errors
    if (minVolume && totalVolume < minVolume) {
      errors.push({
        text: `Total offered volume (${addCommasToNumber(totalVolume)}) must be at least ${addCommasToNumber(
          minVolume
        )} gallons (minimum per order)`,
      })
    }
    if (maxVolume && totalVolume < maxVolume) {
      errors.push({
        text: `Total offered (${addCommasToNumber(totalVolume)}) is less than max per order (${addCommasToNumber(
          maxVolume
        )})`,
      })
    }
    if (increment && totalVolume % increment !== 0) {
      errors.push({
        text: `Total volume should be divisible by increment (${addCommasToNumber(increment)} gallons)`,
      })
    }
    return errors
  }, [totalVolume, minVolume, maxVolume, increment])

  const volumeValidator = (field: any, value: number) => {
    if (!value || value <= 0) {
      return Promise.reject('Volume is required')
    }
    if (warnings.length > 0) {
      return Promise.reject()
    } else {
      return Promise.resolve(value)
    }
  }
  return (
    <>
      <Texto category={'h4'} className={'mt-4 text-18'}>
        Volume Configuration
      </Texto>
      <Texto className={'mb-4 text-14'}>Set total volume available and individual order requirements</Texto>
      <Texto className={'mt-2 text-14'}>Total Offered Volume</Texto>
      <Form.Item name='TotalVolume' rules={[{ validator: volumeValidator }]}>
        <InputNumber precision={0} {...defaultInputProps} />
      </Form.Item>
      <Texto>Total gallons available for this deal </Texto>
      <Vertical className={'my-4 pb-4 border-bottom'}>
        <Horizontal className={'pb-2 gap-20'}>
          {volumeInputList.map((item) => {
            return (
              <Vertical key={item.title} flex={1}>
                <Texto className={'mt-2 text-14'}>{item.title}</Texto>
                <Form.Item
                  name={item.name}
                  rules={[{ validator: (field, value) => item.validator(field, value, form) }]}
                >
                  <InputNumber {...defaultInputProps} />
                </Form.Item>
                <Texto className={'mb-1'}>{item.description}</Texto>
              </Vertical>
            )
          })}
        </Horizontal>
        {warnings?.map((err, index) => (
          <Texto key={index} appearance={'error'} className={'mb-1 text-14'}>
            {err.text}
          </Texto>
        ))}
      </Vertical>
    </>
  )
}
