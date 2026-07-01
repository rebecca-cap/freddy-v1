import { Form, FormInstance, Input } from 'antd'
import React, { useEffect } from 'react'

interface EditFormProps {
  itemName: string
  setSaveDisabled: React.Dispatch<React.SetStateAction<boolean>>
  form: FormInstance
}

export const EditForm: React.FC<EditFormProps> = ({ itemName, setSaveDisabled, form }) => {
  const inputRef = React.useRef(null)
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [inputRef.current])

  useEffect(() => {
    form.setFieldsValue({ Name: itemName })
  }, [itemName])
  return (
    <Form.Item name='Name' rules={[{ required: true, message: 'Please enter a name.' }]}>
      <Input
        placeholder='Hierarchy Name'
        onChange={(value) => {
          if (value) {
            setSaveDisabled(false)
          }
        }}
        ref={inputRef}
      />
    </Form.Item>
  )
}
