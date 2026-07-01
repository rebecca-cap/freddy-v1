import { useOffersContext } from '@contexts/OffersContext'
import { GraviButton, Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'
import { Checkbox, Form } from 'antd'
import React from 'react'

export function OrderFooter({ form, handleNextStep }) {
  const { orderStep, setOrderStep, disableSubmit, selectedItemMeta, isPriceExpired } = useOffersContext()

  const handleExternalNotification = () => {
    const currValue = form.getFieldValue('SendExternalNotification')
    form.setFieldsValue({ SendExternalNotification: !currValue })
  }

  return (
    <Vertical>
      {selectedItemMeta?.IsInternalUser && (
        <Horizontal
          className='test-SendExternalNotification '
          verticalCenter
          style={{ backgroundColor: 'var(--theme-color-2-dim)' }}
        >
          <GraviButton
            disabled={isPriceExpired}
            onClick={() => handleExternalNotification()}
            style={{
              width: '100%',
              minHeight: 60,
              fontSize: 15,
              justifyContent: 'space-between',
              display: 'flex',
              alignItems: 'center',
              backgroundColor: 'var(--theme-color-2-dim)',
            }}
          >
            <Texto appearance='primary' category='p2'>
              Send External Notification
            </Texto>
            <Form.Item name='ExternalNotification' noStyle valuePropName='checked'>
              <Checkbox defaultChecked />
            </Form.Item>
          </GraviButton>
        </Horizontal>
      )}
      <Horizontal className='justify-center' verticalCenter style={{}}>
        {orderStep === 'confirm' && (
          <GraviButton
            disabled={disableSubmit || (isPriceExpired && form.getFieldValue('Type') !== 'bid')}
            onClick={() => setOrderStep('create')}
            style={{ width: '100%', minHeight: 45, fontSize: 18, textTransform: 'capitalize', borderRadius: 0 }}
          >
            Back
          </GraviButton>
        )}
        <GraviButton
          className='test-SubmitButton gravi-button-success'
          onClick={() => handleNextStep()}
          loading={disableSubmit}
          disabled={disableSubmit || (isPriceExpired && form.getFieldValue('Type') !== 'bid')}
          style={{
            width: '100%',
            minHeight: 45,
            fontSize: 18,
            textTransform: 'capitalize',
            borderColor: 'var(--theme-success)',
            borderRadius: 0,
          }}
        >
          {orderStep}
        </GraviButton>
      </Horizontal>
    </Vertical>
  )
}
