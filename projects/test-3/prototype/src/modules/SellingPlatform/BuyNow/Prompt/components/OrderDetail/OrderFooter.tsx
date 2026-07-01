import { usePromptContext } from '@contexts/PromptContext'
import { GraviButton, Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'
import { Button, Checkbox, Form } from 'antd'
import React from 'react'

export function OrderFooter({ form, handleNextStep }) {
  const { orderStep, setOrderStep, disableSubmit, selectedItemMeta, isPriceExpired } = usePromptContext()

  const handleExternalNotification = () => {
    const currValue = form.getFieldValue('SendExternalNotification')
    form.setFieldsValue({ SendExternalNotification: !currValue })
  }

  return (
    <Vertical>
      {selectedItemMeta.IsInternalUser && (
        <Horizontal
          className='test-SendExternalNotification '
          verticalCenter
          style={{ backgroundColor: 'var(--theme-color-2-dim)' }}
        >
          <Button
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
          </Button>
        </Horizontal>
      )}
      <Horizontal className='justify-center' verticalCenter style={{}}>
        {orderStep === 'confirm' && (
          <GraviButton
            buttonText='Back'
            disabled={disableSubmit || (isPriceExpired && form.getFieldValue('Type') !== 'bid')}
            onClick={() => setOrderStep('create')}
            style={{ width: '100%', minHeight: 45, fontSize: 18, textTransform: 'capitalize' }}
          />
        )}
        <GraviButton
          className='test-SubmitButton'
          buttonText={orderStep}
          onClick={() => handleNextStep()}
          theme3
          loading={disableSubmit}
          disabled={disableSubmit || (isPriceExpired && form.getFieldValue('Type') !== 'bid')}
          style={{
            width: '100%',
            minHeight: 45,
            fontSize: 18,
            textTransform: 'capitalize',
            borderColor: 'var(--theme-success)',
          }}
        />
      </Horizontal>
    </Vertical>
  )
}
