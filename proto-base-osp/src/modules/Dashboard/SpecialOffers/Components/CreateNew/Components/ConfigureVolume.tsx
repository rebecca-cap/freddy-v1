import { addCommasToNumber, Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'
import { volumeInputList } from '@modules/Dashboard/SpecialOffers/utils/Constants/FormConstants'
import type { FormInstance } from 'antd'
import { Form, InputNumber } from 'antd'
import { type ElementRef, useEffect, useMemo, useRef } from 'react'

interface ConfigureVolumeProps {
  form: FormInstance
  uomSymbol: any
  focusTotalVolumeToken?: number
}

export function ConfigureVolume({ form, uomSymbol, focusTotalVolumeToken }: ConfigureVolumeProps) {
  const totalVolumeRef = useRef<ElementRef<typeof InputNumber>>(null)
  const uom = uomSymbol ?? defaultUnitOfMeasureSymbol
  const totalVolume = Form.useWatch('TotalVolume', form)
  const minVolume = Form.useWatch('MinimumVolumePerOrder', form)
  const maxVolume = Form.useWatch('MaximumVolumePerOrder', form)
  const increment = Form.useWatch('VolumeIncrement', form)

  useEffect(() => {
    if (!focusTotalVolumeToken) return
    // Defer until step is visible — focusing display:none is a no-op.
    const id = window.setTimeout(() => {
      totalVolumeRef.current?.focus()
    }, 0)
    return () => window.clearTimeout(id)
  }, [focusTotalVolumeToken])
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
        )} ${uom} (minimum per order)`,
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
        text: `Total volume should be divisible by increment (${addCommasToNumber(increment)} ${uom})`,
      })
    }
    return errors
  }, [totalVolume, minVolume, maxVolume, increment, uom])

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
        <InputNumber ref={totalVolumeRef} precision={0} {...defaultInputProps} />
      </Form.Item>
      <Texto>Total {uom} available for this deal </Texto>
      <Vertical className={'my-4 pb-4 border-bottom'}>
        <Horizontal gap={20} className={'pb-2'}>
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
