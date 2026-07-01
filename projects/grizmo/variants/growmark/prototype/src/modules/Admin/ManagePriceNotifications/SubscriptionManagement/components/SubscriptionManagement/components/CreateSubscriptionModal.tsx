import { GraviButton, Horizontal } from '@gravitate-js/excalibrr'
import { toAntOption } from '@utils/index'
import { Form, Modal, Select } from 'antd'
import React from 'react'

export function CreateSubscriptionModal({
  metadata,
  isCreateModalOpen,
  setIsCreateModalOpen,
  upsertSubscriptionMutation,
}) {
  const [form] = Form.useForm()
  const clearStateAndClose = () => {
    form.resetFields()
    setIsCreateModalOpen(false)
  }
  const submitForm = (values) => {
    const payload = [
      {
        CounterPartyId: values.CounterParty,
        QuoteConfigurationId: values.QuoteConfiguration,
        ProductIds: [],
        LocationIds: [],
      },
    ]
    upsertSubscriptionMutation.mutateAsync(payload).then(() => {
      clearStateAndClose()
    })
  }
  const filterOptionAsLowercase = (input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
  return (
    <Modal
      onCancel={clearStateAndClose}
      title='Create Subscription'
      visible={isCreateModalOpen}
      footer={
        <Horizontal justifyContent='flex-end' verticalCenter>
          <GraviButton buttonText='Cancel' className='mr-1' onClick={clearStateAndClose} />
          <GraviButton buttonText='Create' success className='mr-1' onClick={() => form.submit()} />
        </Horizontal>
      }
    >
      <Form form={form} onFinish={submitForm} layout='vertical'>
        <Form.Item
          name='CounterParty'
          label='Counterparty'
          className=' mb-4'
          rules={[{ required: true, message: 'Please select a counterparty' }]}
        >
          <Select
            options={metadata?.CounterParties?.map(toAntOption)}
            showSearch
            filterOption={filterOptionAsLowercase}
          />
        </Form.Item>
        <Form.Item
          name='QuoteConfiguration'
          label='Quote Configuration'
          className=' mb-4'
          rules={[{ required: true, message: 'Please select a quote configuration' }]}
        >
          <Select
            options={metadata?.QuoteConfigurations?.map(toAntOption)}
            showSearch
            filterOption={filterOptionAsLowercase}
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}
