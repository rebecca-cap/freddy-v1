import React, { useEffect, useState } from 'react'
import { Form, Input, InputNumber, Modal, Select } from 'antd'
import { useProductManagement } from '@api/useProductManagement'
import { GraviButton } from '@gravitate-js/excalibrr'

export default function SourceModal({ isOpen, onClose, editingRow }) {
  const [form] = Form.useForm()
  const { useMetadataQuery, createUpdateProductManagementMutation } = useProductManagement()
  const { data: metadata } = useMetadataQuery()
  const { EditableSources } = metadata?.Data || {}
  const sourceSystemId = editingRow?.SourceInfo?.SourceSystemId?.toString()
  const sourceSystem = metadata?.Data?.EditableSources?.find((item) => item.Value === sourceSystemId)

  const [currentSourceSystemId, setCurrentSourceSystemId] = useState(sourceSystemId)

  useEffect(() => {
    if (editingRow?.SourceInfo == null) return

    if (sourceSystem === undefined) {
      form.resetFields()
      return
    }
    form.setFieldsValue({ ...editingRow.SourceInfo, SourceSystemId: sourceSystem.Value })
    setCurrentSourceSystemId(sourceSystemId)
  }, [editingRow])

  const onFinish = async (formValues) => {
    const rowToSave = { ...editingRow }
    rowToSave.SourceInfo = { ...formValues }
    if (formValues.SourceSystemId === 'None') {
      rowToSave.SourceInfo = null
    }
    const payload = [{ ...rowToSave }]
    await createUpdateProductManagementMutation.mutateAsync(payload)
    onClose()
  }

  const getSourceSystem = (value) => {
    return EditableSources?.find((item) => item.Value === value)
  }

  const handleSourceSystemChange = (newValue) => {
    setCurrentSourceSystemId(newValue)
    if (newValue === 'None') form.setFieldsValue({ SourceId: null, SourceIdString: null })
  }

  return (
    <Modal
      visible={isOpen}
      title='Edit Source Id'
      footer={[
        <GraviButton buttonText='Cancel' onClick={onClose} />,
        <GraviButton buttonText='Save' onClick={form.submit} theme2 />,
      ]}
      onCancel={onClose}
    >
      <Form form={form} onFinish={onFinish} layout='vertical'>
        <Form.Item name='SourceSystemId' label='Source System' rules={[{ required: true }]}>
          <Select style={{ width: '100%' }} onChange={handleSourceSystemChange}>
            <Select.Option key='None'>None</Select.Option>
            {EditableSources?.map((item) => (
              <Select.Option key={item.Value}>{item.Text}</Select.Option>
            ))}
          </Select>
        </Form.Item>
        <SourceIdField sourceSystem={getSourceSystem(currentSourceSystemId)} />
      </Form>
    </Modal>
  )
}

function SourceIdField({ sourceSystem }) {
  if (!sourceSystem) return null

  return sourceSystem.HasSourceId ? (
    <Form.Item name='SourceId' label='Source ID' rules={[{ required: true }]}>
      <InputNumber style={{ width: '100%' }} />
    </Form.Item>
  ) : (
    <Form.Item name='SourceIdString' label='Source ID String' rules={[{ required: true }]}>
      <Input style={{ width: '100%' }} />
    </Form.Item>
  )
}
