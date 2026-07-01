import { Form } from 'antd'
import React from 'react'

export function FormWrapper({ children, initialValue, form }) {
  return (
    <Form form={form} initialValue={initialValue}>
      {children}
    </Form>
  )
}
