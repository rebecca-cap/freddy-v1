import { CheckOutlined, CloseOutlined } from '@ant-design/icons'
import { GraviButton, Horizontal } from '@gravitate-js/excalibrr'
import { Form, Input } from 'antd'

import styles from './AddGroup.module.css'

interface AddGroupFormProps {
  onSave: (name: string) => void | Promise<void>
  onCancel: () => void
}

export function AddGroupForm({ onSave, onCancel }: AddGroupFormProps) {
  const [form] = Form.useForm<{ GroupName: string }>()

  const handleSave = async (formValues: { GroupName: string }) => {
    try {
      await onSave(formValues.GroupName)
      form.resetFields()
    } catch {
      // parent surfaces the error toast; preserve user input so they can retry
    }
  }

  const handleCancel = () => {
    form.resetFields()
    onCancel()
  }

  return (
    <Form form={form} onFinish={handleSave} className={styles.form}>
      <Horizontal gap={6} alignItems='center'>
        <Form.Item
          name='GroupName'
          rules={[
            { required: true, message: 'Group name is required' },
            { whitespace: true, message: 'Group name cannot be blank' },
          ]}
          className={styles.field}
          noStyle
        >
          <Input placeholder='Enter group name' autoFocus allowClear />
        </Form.Item>
        <GraviButton icon={<CloseOutlined />} onClick={handleCancel} appearance='text' aria-label='Cancel' />
        <GraviButton icon={<CheckOutlined />} htmlType='submit' color='success' aria-label='Save' />
      </Horizontal>
    </Form>
  )
}
