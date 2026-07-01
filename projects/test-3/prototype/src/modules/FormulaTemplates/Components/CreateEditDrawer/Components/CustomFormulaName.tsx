import { Texto, Vertical } from '@gravitate-js/excalibrr'
import { Form, Input } from 'antd'

export function CustomFormulaName({ title, placeholder, formItemName }) {
  return (
    <Vertical>
      <Texto>{title}</Texto>
      <Form.Item name={formItemName} rules={[{ required: true, message: `Custom formula name is required` }]}>
        <Input.TextArea
          className={'mt-2'}
          placeholder={placeholder}
          style={{ fontFamily: 'monospace', borderRadius: '3px', fontSize: '13px' }}
          rows={3}
        />
      </Form.Item>
    </Vertical>
  )
}
