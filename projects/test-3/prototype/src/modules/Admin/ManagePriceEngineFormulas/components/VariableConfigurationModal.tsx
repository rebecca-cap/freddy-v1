import { IFormulaMetadataResponse, IFormulaVariable } from '@api/usePriceEngineFormulas/types'
import { Texto, Vertical } from '@gravitate-js/excalibrr'
import { Form, Modal, Select, Switch } from 'antd'
import React, { useEffect } from 'react'

interface IProps {
  visible: boolean
  onCancel: () => void
  onSubmit: (values: any) => void
  metadata: IFormulaMetadataResponse
  selectedVariable: IFormulaVariable
}

export const VariableConfigurationModal: React.FC<IProps> = ({
  visible,
  onCancel,
  onSubmit,
  metadata,
  selectedVariable,
}) => {
  const [form] = Form.useForm()

  useEffect(() => {
    form.resetFields()
  }, [visible])

  return (
    <Form
      form={form}
      onValuesChange={() => form.validateFields()}
      layout='vertical'
      initialValues={{
        ValueSourceCvId: selectedVariable?.ValueSourceCvId?.toString(),
        CounterPartyMatchTypeCvId: selectedVariable?.CounterPartyMatchTypeCvId?.toString(),
        TradeDateRuleCvId: selectedVariable?.TradeDateRuleCvId?.toString(),
        AllowMultiOrigin: selectedVariable?.AllowMultiOrigin || false,
        AllowTradePeriods: selectedVariable?.AllowTradePeriods || false,
      }}
    >
      {(_, _form) => {
        return (
          <Modal
            okButtonProps={{ disabled: _form.getFieldsError().some((item) => item.errors.length > 0) }}
            visible={visible}
            title='Advanced Options'
            onCancel={onCancel}
            onOk={() => {
              const rawFieldValues = _form.getFieldsValue()
              onSubmit(rawFieldValues)
            }}
          >
            <Vertical style={{ gap: '1rem' }}>
              <Vertical>
                <Texto category='h5' weight='lighter' className='mb-2'>
                  Source
                </Texto>
                <Form.Item name='ValueSourceCvId' rules={[{ required: true, message: '' }]}>
                  <Select>
                    {metadata?.Sources.map((option) => (
                      <Select.Option key={option.Value} value={option.Value}>
                        {option.Text}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Vertical>
              <Vertical>
                <Texto category='h5' weight='lighter' className='mb-2'>
                  Counterparty Match Rule
                </Texto>
                <Form.Item name='CounterPartyMatchTypeCvId' rules={[{ required: true, message: '' }]}>
                  <Select>
                    {metadata?.CounterpartyMatchRules.map((option) => (
                      <Select.Option key={option.Value} value={option.Value}>
                        {option.Text}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Vertical>
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
                <Texto category='h5' weight='lighter' className='mb-2'>
                  Allow Multi Origin?
                </Texto>
                <Form.Item name='AllowMultiOrigin' valuePropName='checked'>
                  <Switch />
                </Form.Item>
              </Vertical>
            </Vertical>
          </Modal>
        )
      }}
    </Form>
  )
}
