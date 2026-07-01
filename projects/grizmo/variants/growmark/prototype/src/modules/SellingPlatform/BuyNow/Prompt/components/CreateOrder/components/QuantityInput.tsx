import { Horizontal, Texto } from '@gravitate-js/excalibrr'
import { Form, FormItemProps, InputNumber } from 'antd'
import React, { useMemo } from 'react'

export function QuantityInput({
  form,
  selectedItemMeta,
  adjustPriceAdjustments,
  isPriceExpired,
  setDateTimeOverrideToLiftingDaysSelection,
}) {
  const getQuantityFieldStatus = useMemo(
    () => (getStatus?: boolean) => {
      const value = form.getFieldValue('Quantity')
      const constraints = selectedItemMeta?.Constraints
      if (!value && value !== undefined) {
        return getStatus ? 'error' : 'Volume is required'
      }
      if (value && value === 0) {
        return getStatus ? 'error' : 'Volume cannot be 0'
      }
      if (value && value < constraints.MinVolume) {
        return getStatus ? 'error' : `Volume must be at least ${fmt.decimal(constraints.MinVolume, 0)} gal(s)`
      }
      if (value && value > constraints.MaxVolume) {
        return getStatus ? 'error' : `Volume cannot exceed max of ${fmt.decimal(constraints.MaxVolume, 0)} gal(s)`
      }
      if (value && value % constraints.VolumeIncrement !== 0) {
        return getStatus ? 'error' : `Volume must be in increments of ${fmt.decimal(constraints.VolumeIncrement, 0)}`
      }
      if (value && value > constraints.WarningVolume) {
        return getStatus ? 'warning' : 'High volume. Please check before proceeding.'
      }
      return undefined
    },
    [form.getFieldValue('Quantity')]
  )

  return (
    <Horizontal
      className='test-Quantity p-4'
      justifyContent='space-between'
      verticalCenter
      style={{
        backgroundColor: 'var(--gray-800)',
      }}
    >
      <Texto category='heading-small' appearance='white'>
        Volume
      </Texto>
      <Form.Item
        name='Quantity'
        rules={[
          {
            validator: (_, value) => {
              const constraints = selectedItemMeta?.Constraints
              if (!value) {
                return Promise.reject(new Error('Volume is required'))
              }
              if (value === 0) {
                return Promise.reject(new Error('Volume cannot be 0'))
              }
              if (value < constraints.MinVolume) {
                return Promise.reject(
                  new Error(`Volume must be at least ${fmt.decimal(constraints.MinVolume, 0)} gal(s)`)
                )
              }
              if (value > constraints.MaxVolume) {
                return Promise.reject(
                  new Error(`Volume cannot exceed max of ${fmt.decimal(constraints.MaxVolume, 0)} gal(s)`)
                )
              }
              if (value % constraints.VolumeIncrement !== 0) {
                return Promise.reject(
                  new Error(`Volume must be in increments of ${fmt.decimal(constraints.VolumeIncrement, 0)}`)
                )
              }
              return Promise.resolve()
            },
          },
        ]}
        style={{ width: '50%', minHeight: '100%' }}
        validateStatus={getQuantityFieldStatus(true) as FormItemProps['validateStatus']}
        help={getQuantityFieldStatus()}
      >
        <InputNumber
          autoFocus
          controls={false}
          disabled={isPriceExpired && form.getFieldValue('Type') !== 'bid'}
          bordered
          className='round-border'
          size='middle'
          onChange={(value) => {
            const newAdjustment = adjustPriceAdjustments(form, value)
            setDateTimeOverrideToLiftingDaysSelection(newAdjustment)
          }}
          formatter={(value) => `${value?.toString()}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          parser={(value) => (value ? value?.toString()?.replace(/\$\s?|(,*)/g, '') : '')}
          style={{
            backgroundColor: 'transparent',
            minWidth: '100%',
            opacity: 0.8,
            color: 'white',
            textAlign: 'right',
          }}
          placeholder='Enter Deal Volume'
        />
      </Form.Item>
    </Horizontal>
  )
}
