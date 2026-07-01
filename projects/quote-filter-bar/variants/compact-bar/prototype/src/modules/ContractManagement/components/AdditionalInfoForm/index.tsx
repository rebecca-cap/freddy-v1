import { Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'
import { ContractManagementMetadata } from '@modules/ContractManagement/api/types.schema'
import { Form, Input, Select } from 'antd'
import React from 'react'

interface FormProps {
  metadata: ContractManagementMetadata
}

export function AdditionalInfoForm({ metadata }: FormProps) {
  return (
    <Vertical className='bg-1 bordered pb-4' style={{ borderRadius: 8, overflow: 'hidden' }} flex='none' height='auto'>
      <Horizontal className='p-4 bg-2 border-bottom '>
        <Texto category='h6' className='ml-3 font-weight-normal'>
          Additional Info
        </Texto>
      </Horizontal>
      <Horizontal className='px-4 py-3' />
      <Horizontal className='px-4 w-100'>
        <Vertical flex={1} className='my-2 mx-4'>
          <Texto className='py-2'>Internal Contract Number</Texto>
          <Form.Item hasFeedback name='InternalContractNumber'>
            <Input />
          </Form.Item>
        </Vertical>
        <Vertical flex={1} className='my-2 mx-4'>
          <Texto className='py-2'>External Contract Number</Texto>
          <Form.Item hasFeedback name='ExternalContractNumber'>
            <Input />
          </Form.Item>
        </Vertical>
        <Vertical flex={1} className='my-2 mx-4'>
          <Texto className='py-2'>Movement Type</Texto>
          <Form.Item hasFeedback name='MovementTypeCvId'>
            <Select
              allowClear
              showSearch
              filterOption={(value, option) => {
                return option?.children?.toLowerCase().includes(value.toLowerCase())
              }}
            >
              {metadata?.MovementTypes?.map((item) => (
                <Select.Option key={item.Value} value={Number(item.Value)}>
                  {item.Text}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Vertical>
        <Vertical flex={1} className='my-2 mx-4'>
          <Texto className='py-2'>Strategy</Texto>
          <Form.Item hasFeedback name='BookId'>
            <Select
              allowClear
              showSearch
              filterOption={(value, option) => {
                return option?.children?.toLowerCase().includes(value.toLowerCase())
              }}
            >
              {metadata?.Books?.map((item) => (
                <Select.Option key={item.Value} value={Number(item.Value)}>
                  {item.Text}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Vertical>
      </Horizontal>
    </Vertical>
  )
}
