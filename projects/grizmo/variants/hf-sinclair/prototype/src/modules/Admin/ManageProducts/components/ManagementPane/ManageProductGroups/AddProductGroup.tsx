import { CheckCircleFilled, CloseCircleFilled, PlusOutlined } from '@ant-design/icons'
import { Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'
import { Button, Form, Input } from 'antd'
import React from 'react'

export function AddProductGroup({ addingProductGroup, setAddingProductGroup, upsertProductGroup }) {
  const [form] = Form.useForm()

  const saveNewProductGroup = async (formValues) => {
    await upsertProductGroup.mutateAsync(formValues)
    setAddingProductGroup(false)
    form.resetFields()
  }

  if (addingProductGroup) {
    return (
      <Horizontal
        className='mt-4 p-4 border-bottom'
        verticalCenter
        style={{ backgroundColor: 'var(--theme-color-2-dim)', gap: 50 }}
      >
        <Form name='AddProductGroup' form={form} style={{ minWidth: '70%' }} onFinish={saveNewProductGroup}>
          <Vertical verticalCenter style={{ gap: 15 }}>
            <Form.Item name='ProductGroupName' rules={[{ required: true, message: 'Group name is required' }]}>
              <Input placeholder='Enter a Product Group Name' />
            </Form.Item>
          </Vertical>
        </Form>
        <Horizontal verticalCenter style={{ gap: 10 }}>
          <CloseCircleFilled
            style={{
              fontSize: 20,
            }}
            onClick={() => setAddingProductGroup(false)}
          />
          <CheckCircleFilled
            style={{
              fontSize: 20,
              color: 'var(--theme-success)',
            }}
            onClick={() => form.submit()}
          />
        </Horizontal>
      </Horizontal>
    )
  }
  return (
    <Horizontal className='p-4' horizontalCenter verticalCenter>
      <Button
        ghost
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderColor: 'transparent',
          boxShadow: 'none',
        }}
        onClick={() => setAddingProductGroup(true)}
      >
        <PlusOutlined className='mr-4' style={{ color: 'var(--theme-color-2)' }} />
        <Texto category='heading-small' appearance='secondary'>
          ADD PRODUCT GROUP
        </Texto>
      </Button>
    </Horizontal>
  )
}
