import { GraviButton, Horizontal, NotificationMessage, Texto, Vertical } from '@gravitate-js/excalibrr'
import { Form, Select, Switch } from 'antd'
import React from 'react'

export function BulkChangeDrawer({ editableProperties, selectedRows, clearSelection, updateEP }) {
  const [form] = Form.useForm()

  const handleConfirm = async (formValues) => {
    const propertyName = formValues.Property
    const propertyValue = formValues.Value

    const updatedRows = selectedRows.map((row) => {
      return {
        ...row,
        [propertyName]: propertyValue,
      }
    })
    const response = await updateEP.mutateAsync(updatedRows)
    if (response?.ActionStatus === 'Success') {
      clearSelection()
      return NotificationMessage('Save Successful', `${updatedRows.length} ${response?.Validations[0]?.Message}`, false)
    }
    return NotificationMessage('Error Saving', `${updatedRows.length} ${response?.Validations[0]?.Message}`, false)
  }

  return (
    <Form name='MarketPlatformSetupBulkChangeDrawer' onFinish={handleConfirm} form={form}>
      <Horizontal
        className='mr-4'
        style={{
          position: 'relative',
          bottom: 0,
          height: 80,
          backgroundColor: 'var(--theme-color-2-dim)',
          width: '100%',
        }}
      >
        <Vertical flex={3} verticalCenter horizontalCenter style={{ backgroundColor: 'var(--theme-color-2)' }}>
          <Horizontal>
            <Texto category='h4' appearance='white'>
              <span style={{ fontWeight: 500 }}> UPDATE</span> <span style={{ fontWeight: 600 }}> PLATFORM SETUPS</span>
            </Texto>
          </Horizontal>
        </Vertical>
        <Vertical flex={11} verticalCenter className='px-4'>
          <Horizontal verticalCenter>
            <Vertical flex={1} verticalCenter>
              <Texto category='h4'>
                <span style={{ fontWeight: 600 }}> {selectedRows?.length} items</span>
                <span style={{ fontWeight: 500 }}> will be updated</span>
              </Texto>
            </Vertical>
            <Vertical flex={1} verticalCenter>
              <Horizontal verticalCenter>
                <Texto category='p2'>Property:</Texto>
                <Form.Item name='Property' noStyle initialValue={editableProperties[0].field}>
                  <Select
                    placeholder='Select a property'
                    defaultValue={editableProperties[0]?.field}
                    style={{ minWidth: 200 }}
                    bordered={false}
                    options={editableProperties.map((prop) => {
                      return {
                        value: prop.field,
                        label: prop.name,
                      }
                    })}
                  />
                </Form.Item>
              </Horizontal>
            </Vertical>
            <Vertical flex={1} verticalCenter>
              <Horizontal verticalCenter style={{ gap: 10 }}>
                <Texto category='p2'>Value:</Texto>
                <Form.Item name='Value' valuePropName='checked' noStyle initialValue>
                  <Switch checkedChildren='Yes' unCheckedChildren='No' defaultChecked style={{ minWidth: 80 }} />
                </Form.Item>
              </Horizontal>
            </Vertical>

            <Vertical flex={1} verticalCenter>
              <Horizontal style={{ gap: 30 }}>
                <GraviButton
                  className='rounded'
                  buttonText='Cancel'
                  style={{
                    width: '100%',
                    minHeight: 45,
                    fontSize: 18,
                    borderColor: 'var(--theme-success)',
                    borderRadius: 5,
                  }}
                  onClick={() => clearSelection()}
                />
                <GraviButton
                  success
                  buttonText='Confirm'
                  style={{
                    width: '100%',
                    minHeight: 45,
                    fontSize: 18,
                    borderColor: 'var(--theme-success)',
                    borderRadius: 5,
                  }}
                  htmlType='submit'
                />
              </Horizontal>
            </Vertical>
          </Horizontal>
        </Vertical>
      </Horizontal>
    </Form>
  )
}
