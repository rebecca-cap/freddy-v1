import { dateFormat } from '@components/TheArmory/helpers'
import { GraviButton, Horizontal, NotificationMessage, Texto, Vertical } from '@gravitate-js/excalibrr'
import { useApi } from '@gravitate-js/excalibrr'
import { DatePicker, Form } from 'antd'
import moment from 'moment'
import React from 'react'

export function RollBackExtract({ currentItemId, setIsInfoModalOpen, dataQuery }) {
  const [form] = Form.useForm()
  const api = useApi()

  const submitRollBack = async (formdata) => {
    setIsInfoModalOpen(false)

    const payload = {
      IntegrationStatusId: currentItemId,
      IntegrationRollBackDate: formdata.IntegrationRollBackDate.format(dateFormat.ISO),
    }

    try {
      const response = await api.post('Integration/IntegrationStatus/RollBackExtract', payload)
      if (response?.ActionStatus === 'Success') {
        NotificationMessage('Success', `Roll back success`, false)
        dataQuery.refetch()
      } else {
        const errorMessage = response?.Validations[0]?.Message || 'Roll back failed'
        NotificationMessage('Roll back error', errorMessage, true)
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Form form={form} onFinish={submitRollBack}>
      <Vertical>
        <Horizontal verticalCenter className='justify-sb' style={{ gap: 10 }} flex={1}>
          <Horizontal className='justify-center mb-5' style={{ gap: 10 }} flex={0.4}>
            <Texto category='h5' appearance='secondary'>
              Select a roll back date
            </Texto>
          </Horizontal>
          <Horizontal flex={0.6}>
            <Form.Item
              name='IntegrationRollBackDate'
              style={{ width: '100%' }}
              rules={[{ required: true, message: 'Date selection is required' }]}
              initialValue={moment()}
            >
              <DatePicker
                defaultValue={moment()}
                format='MM/DD/YYYY: hh:mm a'
                style={{ width: '100%' }}
                showTime={{ format: 'HH:mm' }}
                use12Hours
                onSelect={(value) => {
                  form.setFieldsValue({ IntegrationRollBackDate: moment(value, 'MM/DD/YYYY: hh:mm a') })
                }}
                placeholder='Select Date and Time'
              />
            </Form.Item>
          </Horizontal>
        </Horizontal>
        <Horizontal className='justify-end' style={{ gap: 10 }}>
          <GraviButton buttonText='Cancel' default onClick={() => setIsInfoModalOpen(false)} />
          <GraviButton buttonText='Confirm Roll Back' success htmlType='submit' />
        </Horizontal>
      </Vertical>
    </Form>
  )
}
