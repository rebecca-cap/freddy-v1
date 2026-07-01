import { Horizontal, Texto } from '@gravitate-js/excalibrr'
import type { Model } from '@hooks/useOnlineOrderViewTypes'
import { Form, InputNumber } from 'antd'
import type { FormItemProps } from 'antd'
import { parseInt } from 'lodash'
import React, { useMemo } from 'react'

type ValidateStatus = FormItemProps['validateStatus']

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

  const defaultPrice = useMemo(() => {
    if (!orderDetails) return undefined

    return orderDetails.SourceIndexOfferId
      ? (orderDetails.IndexOfferDisplay?.ContractDifferential ?? 0)
      : orderDetails.Price
  }, [orderDetails])

  return (
    <>
      <Horizontal className='ml-5' justifyContent='flex-end' >
        <Horizontal>
          <Form.Item
              label={<Texto category={'p2'} weight={'bold'}>Volume</Texto>}
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
      <Horizontal className='ml-5' justifyContent='flex-end'>
        <Horizontal>
          <Form.Item name='Price' label={<Texto category={'p2'} weight={'bold'}>  {orderDetails?.SourceIndexOfferId ? 'Contract Diff' : 'Price'}</Texto>} >
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
