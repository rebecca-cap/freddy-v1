import { Texto, Vertical } from '@gravitate-js/excalibrr'
import { Form, Input } from 'antd'
import type { TextAreaRef } from 'antd/es/input/TextArea'
import { Dispatch, SetStateAction, useRef } from 'react'

interface CustomFormulaNameProps {
  title: string
  placeholder: string
  formItemName: string
  onBlur: () => void
  setShowCustomNameLengthError: Dispatch<SetStateAction<boolean>>
}
export function CustomFormulaName({
  title,
  placeholder,
  formItemName,
  onBlur,
  setShowCustomNameLengthError,
}: CustomFormulaNameProps) {
  const inputRef = useRef<TextAreaRef>(null)

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    // allowClear doesn't always refocus the input
    if (!e.target.value.trim()) {
      inputRef.current?.resizableTextArea?.textArea?.focus()
    }
  }

  return (
    <Vertical>
      <Texto>{title}</Texto>
      <Form.Item
        name={formItemName}
        validateTrigger={['onBlur', 'onChange']}
        rules={[
          {
            validator: (field, value) => {
              if (value.length > 1000) {
                setShowCustomNameLengthError(true)
                return Promise.reject('Pricing Display Name cannot be more than 1,000 characters long.')
              }
              setShowCustomNameLengthError(false)
              return Promise.resolve()
            },
          },
        ]}
        className={'mb-0'}
      >
        <Input.TextArea
          ref={inputRef}
          placeholder={placeholder}
          style={{ fontFamily: 'monospace', borderRadius: '3px', fontSize: '13px', marginBottom: '8px' }}
          rows={3}
          allowClear
          onBlur={onBlur}
          onChange={handleChange}
          showCount
          maxLength={1000}
        />
      </Form.Item>
    </Vertical>
  )
}
