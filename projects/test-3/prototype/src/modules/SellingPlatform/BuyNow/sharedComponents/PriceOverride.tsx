import { Horizontal, Texto } from '@gravitate-js/excalibrr'
import { getNumSign } from '@utils/index'
import { Form, InputNumber } from 'antd'
import React from 'react'

export function PriceOverride({ form, tasMode, selectedItemMeta }) {
  const showSalePrice =
    !tasMode && !selectedItemMeta?.IsInternalUser && selectedItemMeta?.SpecialOfferData?.PricingMechanism === 'Fixed'

  const isBid = selectedItemMeta?.Type === 'bid'

  const nonZeroPriceRule = {
    validator: (_: any, value: number | undefined) => {
      if (value === undefined || value === null) return Promise.resolve()
      if (value === 0) {
        return Promise.reject(new Error('Price cannot be 0'))
      }
      if (value < 0) {
        return Promise.reject(new Error('Price cannot be negative'))
      }

      return Promise.resolve()
    },
  }

  return (
    <Horizontal className='test-Price mt-3 mb-2 mx-4 justify-sb' verticalCenter>
      {!tasMode && (
        <Texto style={{ color: 'var(--theme-option)' }} category='p2'>
          {isBid ? 'Bid' : 'Sale'} Price
        </Texto>
      )}
      {tasMode && (
        <Texto style={{ color: 'var(--theme-option)' }} category='p2'>
          Basis Price
        </Texto>
      )}

      {!tasMode && selectedItemMeta?.IsInternalUser && (
        <Form.Item
          name='Price'
          style={{ minWidth: '50%' }}
          rules={[{ required: true, message: 'Price is required' }, nonZeroPriceRule]}
        >
          <InputNumber
            controls={false}
            style={{ textAlign: 'right', minWidth: '100%' }}
            prefix='$'
            precision={fmt.currentPrecision}
            step={`.${'0'.repeat((fmt.currentPrecision || 4) - 1) + '1'}`}
          />
        </Form.Item>
      )}
      {showSalePrice && (
        <Form.Item name='Price' style={{ textAlign: 'right', minWidth: '50%' }}>
          {`${getNumSign(selectedItemMeta?.Price)}${fmt.currency(selectedItemMeta?.Price)}`}
        </Form.Item>
      )}
      {!tasMode && !selectedItemMeta?.IsInternalUser && isBid && (
        <Form.Item
          name='Price'
          style={{ minWidth: '50%' }}
          rules={[{ required: true, message: 'Price is required' }, nonZeroPriceRule]}
        >
          <InputNumber
            controls={false}
            style={{ textAlign: 'right', minWidth: '100%' }}
            prefix='$'
            precision={fmt.currentPrecision}
            step={`.${'0'.repeat((fmt.currentPrecision || 4) - 1) + '1'}`}
          />
        </Form.Item>
      )}
      {tasMode && (
        <Texto weight={900} category='h4' style={{ textAlign: 'right', minWidth: '50%' }}>
          {`${getNumSign(selectedItemMeta?.Price)}${fmt.currency(selectedItemMeta?.Price)}`}
        </Texto>
      )}
    </Horizontal>
  )
}
