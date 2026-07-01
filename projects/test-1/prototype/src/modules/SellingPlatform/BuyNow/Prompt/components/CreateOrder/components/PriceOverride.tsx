import { Horizontal, Texto } from '@gravitate-js/excalibrr'
import { getNumSign } from '@utils/index'
import { Form, InputNumber } from 'antd'
import React from 'react'

export function PriceOverride({ form, tasMode, selectedItemMeta }) {
  return (
    <Horizontal className='test-Price mt-3 mb-2 mx-4 justify-sb' verticalCenter>
      {!tasMode && (
        <Texto style={{ color: 'var(--theme-option)' }} category='p2'>
          {form.getFieldValue('Type') === 'bid' ? 'Bid' : 'Sale'} Price
        </Texto>
      )}
      {tasMode && (
        <Texto style={{ color: 'var(--theme-option)' }} category='p2'>
          Basis Price
        </Texto>
      )}

      {!tasMode && selectedItemMeta.IsInternalUser && (
        <Form.Item name='Price' style={{ minWidth: '50%' }}>
          <InputNumber
            controls={false}
            style={{ textAlign: 'right', minWidth: '100%' }}
            prefix='$'
            precision={fmt.currentPrecision}
            step={`.${'0'.repeat((fmt.currentPrecision || 4) - 1) + '1'}`}
          />
        </Form.Item>
      )}
      {!tasMode && !selectedItemMeta.IsInternalUser && form.getFieldValue('Type') === 'market' && (
        <Form.Item name='Price' style={{ textAlign: 'right', minWidth: '50%' }}>
          {`${getNumSign(form.getFieldValue('Price'))}${fmt.currency(form.getFieldValue('Price'))}`}
        </Form.Item>
      )}
      {!tasMode && !selectedItemMeta.IsInternalUser && form.getFieldValue('Type') === 'bid' && (
        <Form.Item name='Price' style={{ minWidth: '50%' }}>
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
