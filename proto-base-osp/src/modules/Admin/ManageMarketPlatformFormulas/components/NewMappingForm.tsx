import { LinkOutlined } from '@ant-design/icons'
import { MarketPlatformFormulaMetadata, MarketPlatformFormulasResponse } from '@api/useMarketPlatformFormulas/types'
import { Texto, Vertical } from '@gravitate-js/excalibrr'
import { Button, Form, message, Select } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import React from 'react'

export interface INewMappingFormPayload {
  ProductId: string
  LocationId: string
}

interface IProps {
  onSubmit: (values: INewMappingFormPayload) => void
  productOptions: MarketPlatformFormulaMetadata['ProductHierarchies']
  locationOptions: MarketPlatformFormulaMetadata['LocationHierarchies']
  formula: MarketPlatformFormulasResponse['Data'][number]
}

export const NewMappingForm: React.FC<IProps> = ({ productOptions, locationOptions, formula, onSubmit }) => {
  const [form] = useForm()

  const submitProxy = async () => {
    try {
      await form.validateFields()
      onSubmit(form.getFieldsValue())
    } catch (error) {
      console.error(error)
      // Form validation failed
      message.error('Please fill in all required fields')
    }
  }

  return (
    <Form form={form} onFinish={submitProxy} layout='vertical' style={{ minWidth: 280 }}>
      <Vertical style={{ gap: '1rem' }} className='p-3'>
        <Texto category='h5' style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <LinkOutlined />
          New Mapping
        </Texto>
        <Form.Item name='ProductId' label='Product' rules={[{ required: true, message: 'Product is required' }]}>
          <Select
            placeholder='Product'
            allowClear
            showSearch
            filterOption={(value, option) => {
              return option?.children?.toLowerCase().includes(value.toLowerCase())
            }}
          >
            {productOptions?.map((option) => (
              <Select.Option value={option.Value} key={option.Value}>
                {option.Text}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name='LocationId' label='Location' rules={[{ required: true, message: 'Location is required' }]}>
          <Select
            placeholder='Location'
            allowClear
            showSearch
            filterOption={(value, option) => {
              return option?.children?.toLowerCase().includes(value.toLowerCase())
            }}
          >
            {locationOptions?.map((option) => (
              <Select.Option value={option.Value} key={option.Value}>
                {option.Text}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item>
          <Button type='primary' htmlType='submit' style={{ width: '100%' }}>
            Create
          </Button>
        </Form.Item>
      </Vertical>
    </Form>
  )
}
