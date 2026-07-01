import { Form, Input, InputNumber, Select } from 'antd'
import React, { useEffect } from 'react'

export function SourceEditorModal({ metadata, editingRow, onFinish, form }) {
  useEffect(() => {
    if (editingRow?.SourceInfo != null) {
      const sourceSystem = metadata?.Data?.EditableSources?.find(
        (item) => item.Value === editingRow.SourceInfo.SourceSystemId?.toString()
      )
      if (sourceSystem != undefined) {
        form.setFieldsValue(editingRow.SourceInfo)
        form.setFieldsValue({ SourceSystemId: sourceSystem.Value })
      } else {
        form.resetFields()
      }
    }
  }, [editingRow])

  const getSourceSystem = (value) => {
    return metadata?.Data?.EditableSources?.find((item) => item.Value === value)
  }

  return (
    <Form form={form} onFinish={onFinish} layout='vertical'>
      <Form.Item name='SourceSystemId' label='Source System' rules={[{ required: true }]}>
        <Select style={{ width: '100%' }}>
          <Select.Option key='None'>None</Select.Option>
          {metadata?.Data?.EditableSources?.map((item) => (
            <Select.Option key={item.Value}>{item.Text}</Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item
        noStyle
        shouldUpdate={(prevValues, currentValues) => prevValues.SourceSystemId !== currentValues.SourceSystemId}
      >
        {({ getFieldValue }) =>
          getSourceSystem(getFieldValue('SourceSystemId')) != undefined ? (
            getSourceSystem(getFieldValue('SourceSystemId')).HasSourceId ? (
              <Form.Item name='SourceId' label='Source ID' rules={[{ required: true }]}>
                <InputNumber style={{ width: '100%' }} />
              </Form.Item>
            ) : (
              <Form.Item name='SourceIdString' label='Source ID String' rules={[{ required: true }]}>
                <Input style={{ width: '100%' }} />
              </Form.Item>
            )
          ) : null
        }
      </Form.Item>
    </Form>
  )
}
