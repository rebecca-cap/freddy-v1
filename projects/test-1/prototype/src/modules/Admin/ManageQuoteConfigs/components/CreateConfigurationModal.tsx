import { FunctionOutlined } from '@ant-design/icons'
import { Vertical } from '@gravitate-js/excalibrr'
import { QuoteConfigurationCreatePayload } from '@modules/PricingEngine/Calculations/ManageQuoteRows/api/types.schema'
import { useQuoteRows } from '@modules/PricingEngine/Calculations/ManageQuoteRows/api/useQuoteRows'
import { toAntOption } from '@utils/index'
import { Form, Input, InputNumber, Modal, Select, Switch } from 'antd'
import { useForm, useWatch } from 'antd/lib/form/Form'
import React, { useEffect, useMemo } from 'react'

type Props = {
  visible: boolean
  onCreate: (values: QuoteConfigurationCreatePayload) => Promise<void>
  onCancel: () => void
}
export const CreateConfigurationModal: React.FC<Props> = ({ onCreate, visible, onCancel }) => {
  const { useConfigMetadata } = useQuoteRows()
  const { data: metadata } = useConfigMetadata()
  const [form] = useForm<QuoteConfigurationCreatePayload>()

  const selectedMarkerId = useWatch('DefaultCostSourceMarkerId', form)
  const selectedMarker = useMemo(
    () => metadata?.CostSources?.find((cst) => cst.Value === selectedMarkerId),
    [selectedMarkerId, metadata]
  )

  useEffect(() => {
    form.setFieldsValue({ DefaultCostSourceCvId: selectedMarker?.CostSourceTypeCvId })
  }, [selectedMarker])

  const onCreateProxy = (values: QuoteConfigurationCreatePayload) => {
    onCreate(values)
    form.resetFields()
  }

  return (
    <Modal visible={visible} onCancel={onCancel} onOk={form.submit} okText='Submit'>
      <Form form={form} layout='vertical' onFinish={onCreateProxy}>
        <Vertical style={{ gap: '1rem' }}>
          <Form.Item name='DefaultCostSourceCvId' hidden />
          <Form.Item label='Configuration Name' name='ConfigurationName' rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label='Default Cost Source' name='DefaultCostSourceMarkerId'>
            <Select allowClear showSearch optionFilterProp='children'>
              {metadata?.CostSources?.filter((cst) => cst.IsMarker).map((option) => (
                <Select.Option key={option.Value} value={option.Value}>
                  <FunctionOutlined /> {option.Text}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label='Calendar' name='CalendarId'>
            <Select allowClear showSearch optionFilterProp='children' options={metadata?.Calendars?.map(toAntOption)} />
          </Form.Item>
          <Form.Item label='Cost Counterparty Type' name='BaseCostCounterPartyComparisonTypeCvId'>
            <Select
              allowClear
              showSearch
              optionFilterProp='children'
              options={metadata?.CounterPartyComparisonTypes?.map(toAntOption)}
            />
          </Form.Item>
          <Form.Item label='Output Counterparty Type' name='OutputCounterPartyComparisonTypeCvId'>
            <Select
              allowClear
              showSearch
              optionFilterProp='children'
              options={metadata?.CounterPartyComparisonTypes?.map(toAntOption)}
            />
          </Form.Item>
          <Form.Item label='Auto Publish Type' name='DefaultAutomaticQuotePublicationTypeCvId'>
            <Select
              allowClear
              showSearch
              optionFilterProp='children'
              options={metadata?.AutomaticQuotePublicationTypes?.map(toAntOption)}
            />
          </Form.Item>
          <Form.Item 
            label='Terms Discount (%)' 
            name='TermsDiscount'
            rules={[
              {
                validator: (_, value) => {
                  if (value === null || value === undefined || value === '') {
                    return Promise.resolve()
                  }
                  if (typeof value !== 'number' || isNaN(value)) {
                    return Promise.reject(new Error('Please enter a valid number'))
                  }
                  if (value < 0 || value > 100) {
                    return Promise.reject(new Error('Terms discount must be between 0 and 100'))
                  }
                  return Promise.resolve()
                },
              },
            ]}
            initialValue={0}
          >
            <InputNumber 
              min={0} 
              max={100} 
              precision={2}
              suffix='%'
              placeholder='0.00'
              style={{ width: '100%' }}
            />
          </Form.Item>
          <Form.Item 
            label='Published Price Includes Terms Discount' 
            name='PublishedPriceIncludesTermsDiscount'
            valuePropName='checked'
            initialValue={true}
          >
            <Switch />
          </Form.Item>
        </Vertical>
      </Form>
    </Modal>
  )
}
