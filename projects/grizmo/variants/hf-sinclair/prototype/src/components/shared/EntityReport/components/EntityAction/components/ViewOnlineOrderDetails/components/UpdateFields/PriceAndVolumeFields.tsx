import { Horizontal, Texto } from '@gravitate-js/excalibrr'
import { Model } from '@hooks/useOnlineOrderViewTypes'
import { Form, InputNumber } from 'antd'
import { ValidateStatus } from 'antd/lib/form/FormItem'
import { parseInt } from 'lodash'
import React from 'react'

interface PriceAndVolumeFieldsProps {
  getQuantityFieldStatus: (getStatus?: boolean) => ValidateStatus | undefined | string
  volumeRules: any[]
  canWrite: boolean
  onVolumeChange: (value: number | null) => void
  orderDetails: Model
}

export function PriceAndVolumeFields({
  getQuantityFieldStatus,
  volumeRules,
  canWrite,
  onVolumeChange,
  orderDetails,
}: PriceAndVolumeFieldsProps) {
  const parseVolume = (value: string | undefined): number => {
    const parsedValue = value?.replace(/\$\s?|(,*)/g, '')
    return parsedValue ? parseInt(parsedValue) : 0
  }

  const defaultPrice = orderDetails?.SourceIndexOfferId
    ? orderDetails?.IndexOfferDisplay?.ContractDifferential ?? 0
    : orderDetails?.Price

  return (
    <>
      <Horizontal verticalCenter className='m-1 ml-5' justifyContent='flex-end' style={{ minWidth: '140px' }}>
        <Horizontal flex={0.3} verticalCenter className='mr-2'>
          <Texto category='p2' weight='bold'>
            Volume:
          </Texto>
        </Horizontal>
        <Horizontal flex={0.7} verticalCenter>
          <Form.Item
            name='Quantity'
            className='volume-form-item'
            validateStatus={getQuantityFieldStatus(true) as ValidateStatus}
            help={getQuantityFieldStatus()}
            rules={volumeRules}
          >
            <InputNumber
              onChange={onVolumeChange}
              min={0}
              max={999999999}
              step='1'
              controls={false}
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={parseVolume}
              disabled={!canWrite}
              size='small'
              className='w-full border-radius-5'
            />
          </Form.Item>
        </Horizontal>
      </Horizontal>
      <Horizontal verticalCenter className='m-1 ml-5' justifyContent='flex-end' style={{ minWidth: '140px' }}>
        <Horizontal flex={0.4} verticalCenter className='mr-2'>
          <Texto category='p2' weight='bold'>
            {orderDetails?.SourceIndexOfferId ? 'Contract Diff:' : 'Price:'}
          </Texto>
        </Horizontal>
        <Horizontal flex={0.7} verticalCenter>
          <Form.Item name='Price'>
            <InputNumber
              disabled={!canWrite}
              defaultValue={defaultPrice}
              controls={false}
              step='0.0001'
              prefix='$'
              precision={fmt.currentPrecision}
              size='small'
              className='w-full border-radius-5'
            />
          </Form.Item>
        </Horizontal>
      </Horizontal>
    </>
  )
}
