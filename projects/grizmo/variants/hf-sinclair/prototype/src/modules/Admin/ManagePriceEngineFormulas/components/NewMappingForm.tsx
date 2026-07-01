import { LinkOutlined } from '@ant-design/icons'
import { IFormulaMetadataResponse, IFormulaOverviewResponse } from '@api/usePriceEngineFormulas/types'
import { GraviButton, Texto, Vertical } from '@gravitate-js/excalibrr'
import { toAntOption } from '@utils/index'
import { Form, message, Select } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import React from 'react'

export interface INewMappingFormPayload {
  ProductId: string
  LocationId: string
}

interface IProps {
  onSubmit: (values: INewMappingFormPayload) => void
  productOptions: IFormulaMetadataResponse['ProductHierarchies']
  locationOptions: IFormulaMetadataResponse['LocationHierarchies']
  formula: IFormulaOverviewResponse['Data'][number]
  counterpartyOptions: IFormulaMetadataResponse['CounterParties']
}

export const NewMappingForm: React.FC<IProps> = ({
  productOptions,
  locationOptions,
  formula,
  onSubmit,
  counterpartyOptions,
}) => {
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
              return option?.label?.toLowerCase().includes(value.toLowerCase()) || false
            }}
            options={productOptions?.map(toAntOption)}
          />
        </Form.Item>
        <Form.Item name='LocationId' label='Location' rules={[{ required: true, message: 'Location is required' }]}>
          <Select
            placeholder='Location'
            allowClear
            showSearch
            filterOption={(value, option) => {
              return option?.label?.toLowerCase().includes(value.toLowerCase()) || false
            }}
            options={locationOptions?.map(toAntOption)}
          />
        </Form.Item>
        <Form.Item name='CounterPartyId' label='Counterparty'>
          <Select
            placeholder='Counterparty'
            allowClear
            showSearch
            filterOption={(value, option) => {
              return option?.label?.toLowerCase().includes(value.toLowerCase()) || false
            }}
            options={counterpartyOptions?.map(toAntOption)}
          />
        </Form.Item>

        <Form.Item>
          <GraviButton
            buttonText='Create'
            onClick={() => {
              form.submit()
            }}
            className='w-full'
            theme1
          />
        </Form.Item>
      </Vertical>
    </Form>
  )
}
