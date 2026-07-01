import { GraviButton, Texto, Vertical } from '@gravitate-js/excalibrr'
import { toAntOption } from '@utils/index'
import { DatePicker, Form, Input, Modal, Select } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import React from 'react'

const { TextArea } = Input
export interface CreateModalProps {
  createModalOpen: boolean
  metadata: any
  handleCreateEvent: (values) => void
  handleCreateModalCancel: () => void
}
export function CreateModal({
  createModalOpen,
  metadata,
  handleCreateEvent,
  handleCreateModalCancel,
}: CreateModalProps) {
  const [form] = useForm()
  const handleSubmit = (values: any) => {
    handleCreateEvent(values)
    form.resetFields()
  }
  const handleCancel = () => {
    form.resetFields()
    handleCreateModalCancel()
  }
  return (
    <Modal
      visible={createModalOpen}
      title='Create Event'
      footer={[
        <GraviButton key={'cancel'} buttonText='Cancel' onClick={handleCancel} />,
        <GraviButton key={'confirm'} buttonText='Confirm' theme2 onClick={() => form.submit()} />,
      ]}
      onCancel={handleCreateModalCancel}
    >
      <Form form={form} onFinish={handleSubmit} layout='vertical'>
        <Vertical className={'mb-3'}>
          <Texto category='h5' className={'mb-1'}>
            Period Type
          </Texto>
          <Form.Item
            initialValue={metadata?.Data?.PeriodTypeList[0].Value}
            name='PeriodTypeCvId'
            rules={[{ required: true, message: 'Please select a period type' }]}
          >
            <Select
              style={{ width: 200 }}
              defaultValue={metadata?.Data?.PeriodTypeList[0].Value}
              options={metadata?.Data?.PeriodTypeList?.map(toAntOption)}
            ></Select>
          </Form.Item>
        </Vertical>
        <Vertical className={'mb-3'}>
          <Texto category='h5' className={'mb-1'}>
            Name
          </Texto>
          <Form.Item name='Name' rules={[{ required: true, message: 'Please enter the event name' }]}>
            <TextArea
              className='form-text-area'
              placeholder='Enter event name'
              maxLength={255}
              showCount
              autoSize={{ minRows: 1, maxRows: 1 }}
              allowClear
            />
          </Form.Item>
        </Vertical>
        <Vertical className={'mb-3'}>
          <Texto category='h5' className={'mb-1'}>
            Start Date/Time
          </Texto>
          <Form.Item name='Start' rules={[{ required: true, message: 'Please select start date and time' }]}>
            <DatePicker
              format='MM/DD/YYYY: hh:mm a'
              style={{ width: '100%' }}
              showTime={{ format: 'HH:mm' }}
              use12Hours
              placeholder='Select Date and Time'
            />
          </Form.Item>
        </Vertical>
        <Vertical className={'mb-3'}>
          <Texto category='h5' className={'mb-1'}>
            End Date/Time
          </Texto>
          <Form.Item name='End' rules={[{ required: true, message: 'Please select end date and time' }]}>
            <DatePicker
              format='MM/DD/YYYY: hh:mm a'
              style={{ width: '100%' }}
              showTime={{ format: 'HH:mm' }}
              use12Hours
              placeholder='Select Date and Time'
            />
          </Form.Item>
        </Vertical>
      </Form>
    </Modal>
  )
}
