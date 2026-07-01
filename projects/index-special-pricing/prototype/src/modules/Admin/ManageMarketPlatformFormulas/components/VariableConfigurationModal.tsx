import { MarketPlatformFormulaMetadata, VariablesItem } from '@api/useMarketPlatformFormulas/types'
import { Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'
import { Form, Modal, Select, Switch } from 'antd'
import React, { useEffect } from 'react'

interface MarketPlatformVariableConfigurationModalProps {
  visible: boolean
  onCancel: () => void
  onSubmit: (values: any) => void
  metadata: MarketPlatformFormulaMetadata
  selectedVariable: VariablesItem
}

export const MarketPlatformVariableConfigurationModal: React.FC<MarketPlatformVariableConfigurationModalProps> = ({
  visible,
  onCancel,
  onSubmit,
  metadata,
  selectedVariable,
}) => {
  const [form] = Form.useForm()

  useEffect(() => {
    if (selectedVariable && visible) {
      form.setFieldsValue({
        TradeDateRuleCvId: selectedVariable?.TradeDateRuleCvId?.toString(),
        IsPlaceholder: selectedVariable?.IsPlaceholder,
      })
    }
    if (!visible) {
      setTimeout(() => {
        form.resetFields()
      }, 400)
    }
  }, [visible, selectedVariable?.FormulaVariableId])

  const onOkModal = () => {
    const rawFieldValues = form.getFieldsValue()
    const payload = { ...rawFieldValues }
    const valueSource = metadata?.Sources.find(
      (s) => s.Text === (rawFieldValues?.IsPlaceholder ? 'Fixed Value' : 'Database Price')
    )

    if (rawFieldValues?.IsPlaceholder) {
      payload.IsRequired = false
      payload.ValueSource = valueSource?.Text
      payload.ValueSourceCvId = Number(valueSource?.Value)
    } else {
      payload.ValueSource = valueSource?.Text
      payload.ValueSourceCvId = Number(valueSource?.Value)
    }

    onSubmit(payload)
  }

  return (
    <Modal
      okButtonProps={{ disabled: form.getFieldsError().some((item) => item.errors.length > 0) }}
      visible={visible}
      title='Advanced Options'
      onCancel={onCancel}
      onOk={onOkModal}
    >
      <Form
        form={form}
        onValuesChange={() => form.validateFields()}
        layout='vertical'
        initialValues={{
          TradeDateRuleCvId: selectedVariable?.TradeDateRuleCvId,
          IsPlaceholder: selectedVariable?.IsPlaceholder,
        }}
      >
        <Vertical style={{ gap: '1rem' }}>
          <Vertical>
            <Texto category='h5' weight='lighter' className='mb-2'>
              Trade Period Rule
            </Texto>
            <Form.Item name='TradeDateRuleCvId'>
              <Select allowClear>
                {metadata?.TradePeriodRules.map((option) => (
                  <Select.Option key={option.Value} value={option.Value}>
                    {option.Text}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Vertical>
          <Vertical>
            <Horizontal className='justify-sb'>
              <Texto category='h5' weight='lighter' className='mb-2'>
                Is Placeholder?
              </Texto>
              <Form.Item name='IsPlaceholder' valuePropName='checked' noStyle>
                <Switch checkedChildren='Yes' unCheckedChildren='No' style={{ minWidth: 60 }} />
              </Form.Item>
            </Horizontal>
          </Vertical>
        </Vertical>
      </Form>
    </Modal>
  )
}
